(function () {
  "use strict";
  var input = document.getElementById("hashInput");
  var hashBtn = document.getElementById("hashBtn");
  var results = document.getElementById("hashResults");

  function md5(str) {
    function md5cycle(x, k) {
      var a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function md51(s) {
      var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
      for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
      s = s.substring(i - 64);
      var tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) { md5cycle(state, tail); tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }
    function md5blk(s) {
      var md5blks = [], i;
      for (i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      return md5blks;
    }
    var hex_chr = "0123456789abcdef".split("");
    function rhex(n) {
      var s = "", j = 0;
      for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
      return s;
    }
    function hex(x) { for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]); return x.join(""); }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
    return hex(md51(str));
  }

  function sha1(str) {
    function rotate_left(n, s) { return (n << s) | (n >>> (32 - s)); }
    function ft(b, c, d) { if (b & c) return ((b & d) | (c & (~d))); if (b | d) return (b ^ c ^ d); return (c ^ (~b)); }
    function sha1_ft(t, b, c, d) { if (t < 20) return (b & c) | ((~b) & d); if (t < 40) return b ^ c ^ d; if (t < 60) return (b & c) | (b & d) | (c & d); return b ^ c ^ d; }
    function sha1_k(t) { return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514; }
    var msg = unescape(encodeURIComponent(str));
    var msg_len = msg.length;
    var word_array = [];
    for (var i = 0; i < msg_len; i++) word_array[i >> 2] |= msg.charCodeAt(i) << (24 - (i % 4) * 8);
    word_array[i >> 2] |= 0x80 << (24 - (i % 4) * 8);
    if (i > 55) { word_array[15] = msg_len * 8; }
    var H0 = 1732584193, H1 = -271733879, H2 = -1732584194, H3 = 271733878, H4 = -1009589776;
    for (var j = 0; j < word_array.length; j += 16) {
      var W = [];
      for (var t = 0; t < 80; t++) W[t] = (t < 16) ? word_array[j + t] : rotate_left(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
      var a = H0, b = H1, c = H2, d = H3, e = H4;
      for (t = 0; t < 80; t++) {
        var temp = rotate_left(a, 5) + sha1_ft(t, b, c, d) + e + W[t] + sha1_k(t);
        e = d; d = c; c = rotate_left(b, 30); b = a; a = temp;
      }
      H0 = (H0 + a) | 0; H1 = (H1 + b) | 0; H2 = (H2 + c) | 0; H3 = (H3 + d) | 0; H4 = (H4 + e) | 0;
    }
    function toHex(n) { var s = ""; for (var i = 7; i >= 0; i--) s += "0123456789abcdef".charAt((n >> (i * 4)) & 0xf); return s; }
    return toHex(H0) + toHex(H1) + toHex(H2) + toHex(H3) + toHex(H4);
  }

  async function sha(algo, str) {
    var enc = new TextEncoder();
    var data = enc.encode(str);
    var hash = await crypto.subtle.digest(algo, data);
    return Array.from(new Uint8Array(hash)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  async function generate() {
    var text = input.value;
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    results.innerHTML = "";
    var algos = [
      { label: "MD5", fn: function () { return Promise.resolve(md5(text)); } },
      { label: "SHA-1", fn: function () { return Promise.resolve(sha1(text)); } },
      { label: "SHA-256", fn: function () { return sha("SHA-256", text); } },
      { label: "SHA-384", fn: function () { return sha("SHA-384", text); } },
      { label: "SHA-512", fn: function () { return sha("SHA-512", text); } }
    ];
    for (var i = 0; i < algos.length; i++) {
      var hash = await algos[i].fn();
      var row = document.createElement("div");
      row.className = "hash-row";
      row.innerHTML = '<span class="hash-label">' + algos[i].label + '</span><span class="hash-value">' + hash + '</span>';
      row.addEventListener("click", (function (h) {
        return function () { window.OmniTools.copyText(h).then(function () { window.OmniTools.showToast("Hash copied!", "success"); }); };
      })(hash));
      results.appendChild(row);
    }
  }

  hashBtn.addEventListener("click", generate);
})();
