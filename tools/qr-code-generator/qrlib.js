/* =========================================================================
   Minimal QR Code matrix generator (original implementation).
   Supports byte-mode encoding, versions 1-6, error-correction level M.
   Good for URLs, short text and Wi-Fi strings (up to ~100 bytes).
   ========================================================================= */
(function (global) {
  "use strict";

  // ---- Galois Field GF(256) tables for Reed-Solomon ----
  const EXP = new Array(512);
  const LOG = new Array(256);
  (function buildGF() {
    let x = 1;
    for (let i = 0; i < 255; i++) {
      EXP[i] = x;
      LOG[x] = i;
      x <<= 1;
      if (x & 0x100) x ^= 0x11d;
    }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0;
    return EXP[LOG[a] + LOG[b]];
  }

  function rsGeneratorPoly(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= gfMul(poly[j], 1);
        next[j + 1] ^= gfMul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    const gen = rsGeneratorPoly(ecLen);
    const res = data.slice();
    res.push(...new Array(ecLen).fill(0));
    for (let i = 0; i < data.length; i++) {
      const coef = res[i];
      if (coef === 0) continue;
      for (let j = 0; j < gen.length; j++) {
        res[i + j] ^= gfMul(gen[j], coef);
      }
    }
    return res.slice(data.length);
  }

  // Capacity table for EC level M, byte mode: [version]: {total, dataCodewords, ecPerBlock, blocks}
  // Values follow the published QR spec capacity table (versions 1-10, level M).
  const VERSION_INFO = [
    null,
    { size: 21, dataCw: 16,  ecCw: 10,  blocks: 1 },
    { size: 25, dataCw: 28,  ecCw: 16,  blocks: 1 },
    { size: 29, dataCw: 44,  ecCw: 26,  blocks: 1 },
    { size: 33, dataCw: 64,  ecCw: 36,  blocks: 2 },
    { size: 37, dataCw: 86,  ecCw: 48,  blocks: 2 },
    { size: 41, dataCw: 108, ecCw: 64,  blocks: 4 },
    { size: 45, dataCw: 124, ecCw: 72,  blocks: 4 },
    { size: 49, dataCw: 154, ecCw: 88,  blocks: 4 },
    { size: 53, dataCw: 182, ecCw: 110, blocks: 5 },
    { size: 57, dataCw: 216, ecCw: 130, blocks: 5 }
  ];
  const ALIGNMENT_COORDS = [
    null, [], [6,18], [6,22], [6,26], [6,30], [6,34],
    [6,22,38], [6,24,42], [6,26,46], [6,28,50]
  ];

  function chooseVersion(byteLen) {
    for (let v = 1; v <= 6; v++) {
      const info = VERSION_INFO[v];
      // byte mode overhead: 4 bit mode + 8 bit count (version<=9) or 16 bit (>=10)
      const countBits = v <= 9 ? 8 : 16;
      const capacityBits = info.dataCw * 8;
      const usedBits = 4 + countBits + byteLen * 8;
      if (usedBits <= capacityBits) return v;
    }
    return null; // too much data for this minimal implementation
  }

  function buildDataCodewords(text, version) {
    const info = VERSION_INFO[version];
    const bytes = new TextEncoder().encode(text);
    const countBits = version <= 9 ? 8 : 16;
    let bits = "0100"; // byte mode indicator
    bits += bytes.length.toString(2).padStart(countBits, "0");
    for (const b of bytes) bits += b.toString(2).padStart(8, "0");

    const capacityBits = info.dataCw * 8;
    // terminator
    bits += "0".repeat(Math.min(4, capacityBits - bits.length));
    // pad to byte boundary
    while (bits.length % 8 !== 0) bits += "0";
    // pad bytes
    const padBytes = [0xec, 0x11];
    let pi = 0;
    while (bits.length < capacityBits) {
      bits += padBytes[pi % 2].toString(2).padStart(8, "0");
      pi++;
    }
    const codewords = [];
    for (let i = 0; i < bits.length; i += 8) {
      codewords.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return codewords.slice(0, info.dataCw);
  }

  function interleave(dataCw, version) {
    const info = VERSION_INFO[version];
    const blocks = info.blocks;
    const baseLen = Math.floor(info.dataCw / blocks);
    const extra = info.dataCw % blocks; // number of blocks with one extra codeword
    const dataBlocks = [];
    let idx = 0;
    for (let b = 0; b < blocks; b++) {
      const len = baseLen + (b >= blocks - extra ? 1 : 0);
      dataBlocks.push(dataCw.slice(idx, idx + len));
      idx += len;
    }
    const ecPerBlock = Math.floor(info.ecCw / blocks);
    const ecBlocks = dataBlocks.map((blk) => rsEncode(blk, ecPerBlock));

    const result = [];
    const maxDataLen = Math.max(...dataBlocks.map((b) => b.length));
    for (let i = 0; i < maxDataLen; i++) {
      for (const blk of dataBlocks) if (i < blk.length) result.push(blk[i]);
    }
    for (let i = 0; i < ecPerBlock; i++) {
      for (const blk of ecBlocks) result.push(blk[i]);
    }
    return result;
  }

  function makeMatrix(size) {
    return Array.from({ length: size }, () => new Array(size).fill(null));
  }

  function placeFinder(m, r, c) {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const rr = r + i, cc = c + j;
        if (rr < 0 || cc < 0 || rr >= m.length || cc >= m.length) continue;
        const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
        const isCore = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        if (i === -1 || i === 7 || j === -1 || j === 7) m[rr][cc] = 0;
        else m[rr][cc] = isBorder || isCore ? 1 : 0;
      }
    }
  }

  function placeAlignment(m, r, c) {
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const isBorder = i === -2 || i === 2 || j === -2 || j === 2;
        m[r + i][c + j] = isBorder || (i === 0 && j === 0) ? 1 : 0;
      }
    }
  }

  function buildFunctionMatrix(version) {
    const info = VERSION_INFO[version];
    const size = info.size;
    const m = makeMatrix(size);
    placeFinder(m, 0, 0);
    placeFinder(m, 0, size - 7);
    placeFinder(m, size - 7, 0);

    // timing patterns
    for (let i = 8; i < size - 8; i++) {
      m[6][i] = i % 2 === 0 ? 1 : 0;
      m[i][6] = i % 2 === 0 ? 1 : 0;
    }

    // alignment patterns
    const coords = ALIGNMENT_COORDS[version] || [];
    for (const r of coords) {
      for (const c of coords) {
        // skip overlaps with finder patterns
        if ((r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8)) continue;
        placeAlignment(m, r, c);
      }
    }

    // dark module
    m[size - 8][8] = 1;

    return m;
  }

  const RESERVED = Symbol("reserved");
  function markReserved(reserved, size, version) {
    for (let i = 0; i < 9; i++) { reserved[8][i] = true; reserved[i][8] = true; }
    for (let i = 0; i < 8; i++) { reserved[8][size - 1 - i] = true; reserved[size - 1 - i][8] = true; }
    for (let i = 0; i < size; i++) {
      if (i !== 6) { /* timing already function */ }
    }
  }

  function isFunctionModule(m, r, c) {
    return m[r][c] !== null;
  }

  function placeData(matrix, codewords) {
    const size = matrix.length;
    const bits = [];
    for (const cw of codewords) {
      for (let b = 7; b >= 0; b--) bits.push((cw >> b) & 1);
    }
    let bitIndex = 0;
    let dir = -1; // upward
    let col = size - 1;
    while (col > 0) {
      if (col === 6) col--; // skip timing column
      for (let count = 0; count < size; count++) {
        const row = dir === -1 ? size - 1 - count : count;
        for (const c of [col, col - 1]) {
          if (matrix[row][c] === null) {
            matrix[row][c] = bitIndex < bits.length ? bits[bitIndex] : 0;
            bitIndex++;
          }
        }
      }
      dir = -dir;
      col -= 2;
    }
    return matrix;
  }

  function applyMask(matrix, maskId, isFunction) {
    const size = matrix.length;
    const out = makeMatrix(size);
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (isFunction[r][c]) { out[r][c] = matrix[r][c]; continue; }
        let invert;
        switch (maskId) {
          case 0: invert = (r + c) % 2 === 0; break;
          case 1: invert = r % 2 === 0; break;
          case 2: invert = c % 3 === 0; break;
          case 3: invert = (r + c) % 3 === 0; break;
          case 4: invert = (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0; break;
          case 5: invert = ((r * c) % 2) + ((r * c) % 3) === 0; break;
          case 6: invert = (((r * c) % 2) + ((r * c) % 3)) % 2 === 0; break;
          case 7: invert = (((r + c) % 2) + ((r * c) % 3)) % 2 === 0; break;
          default: invert = false;
        }
        out[r][c] = invert ? matrix[r][c] ^ 1 : matrix[r][c];
      }
    }
    return out;
  }

  function penalty(m) {
    const size = m.length;
    let score = 0;
    // rule 1: runs of 5+ same color in a row/col
    for (let r = 0; r < size; r++) {
      let run = 1;
      for (let c = 1; c < size; c++) {
        if (m[r][c] === m[r][c - 1]) run++;
        else { if (run >= 5) score += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }
    for (let c = 0; c < size; c++) {
      let run = 1;
      for (let r = 1; r < size; r++) {
        if (m[r][c] === m[r - 1][c]) run++;
        else { if (run >= 5) score += 3 + (run - 5); run = 1; }
      }
      if (run >= 5) score += 3 + (run - 5);
    }
    // rule 3 (approx): dark/light balance
    let dark = 0;
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (m[r][c]) dark++;
    const pct = (dark / (size * size)) * 100;
    score += Math.floor(Math.abs(pct - 50) / 5) * 10;
    return score;
  }

  // Format info (EC level M = '00') BCH(15,5) encoding, per spec generator 0x537, xor mask 0x5412
  function formatBits(maskId) {
    const ecBits = 0b00; // M
    let data = (ecBits << 3) | maskId;
    let bch = data << 10;
    const gen = 0b10100110111;
    for (let i = 14; i >= 10; i--) {
      if ((bch >> i) & 1) bch ^= gen << (i - 10);
    }
    let result = ((data << 10) | bch) ^ 0b101010000010010;
    return result.toString(2).padStart(15, "0").split("").map(Number);
  }

  function placeFormatInfo(matrix, maskId) {
    const size = matrix.length;
    const bits = formatBits(maskId); // bits[0] = MSB of the 15-bit format string

    const copy1 = [ [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8] ];
    const copy2 = [
      [size-1,8],[size-2,8],[size-3,8],[size-4,8],[size-5,8],[size-6,8],[size-7,8],
      [8,size-8],[8,size-7],[8,size-6],[8,size-5],[8,size-4],[8,size-3],[8,size-2],[8,size-1]
    ];
    for (let i = 0; i < 15; i++) {
      const [r1, c1] = copy1[i];
      matrix[r1][c1] = bits[i];
      const [r2, c2] = copy2[i];
      matrix[r2][c2] = bits[i];
    }
  }

  function generateMatrix(text) {
    const bytes = new TextEncoder().encode(text);
    const version = chooseVersion(bytes.length);
    if (!version) throw new Error("Text too long for this QR generator (try under 100 characters).");
    const dataCw = buildDataCodewords(text, version);
    const allCw = interleave(dataCw, version);

    const funcMatrix = buildFunctionMatrix(version);
    const size = funcMatrix.length;
    const isFunction = makeMatrix(size).map((row, r) => row.map((_, c) => funcMatrix[r][c] !== null));
    // reserve format info areas
    for (let i = 0; i < 9; i++) { isFunction[8][i] = true; isFunction[i][8] = true; }
    for (let i = 0; i < 8; i++) { isFunction[8][size - 1 - i] = true; isFunction[size - 1 - i][8] = true; }

    const dataMatrix = makeMatrix(size);
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (funcMatrix[r][c] !== null) dataMatrix[r][c] = funcMatrix[r][c];
    // reserve the exact format-info module coordinates so placeData() doesn't write real data bits into them
    const formatCoords = [
      [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],
      [size-1,8],[size-2,8],[size-3,8],[size-4,8],[size-5,8],[size-6,8],[size-7,8],
      [8,size-8],[8,size-7],[8,size-6],[8,size-5],[8,size-4],[8,size-3],[8,size-2],[8,size-1]
    ];
    for (const [r, c] of formatCoords) dataMatrix[r][c] = 0;
    placeData(dataMatrix, allCw);
    // fill remaining nulls (format area placeholders) with 0 before masking
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (dataMatrix[r][c] === null) dataMatrix[r][c] = 0;

    let best = null, bestScore = Infinity;
    for (let maskId = 0; maskId < 8; maskId++) {
      const masked = applyMask(dataMatrix, maskId, isFunction);
      placeFormatInfo(masked, maskId);
      const score = penalty(masked);
      if (score < bestScore) { bestScore = score; best = masked; }
    }
    return best;
  }

  global.OmniQR = { generateMatrix };
})(window);
