(function () {
  "use strict";
  const textInput = document.getElementById("textInput");
  const scaleSelect = document.getElementById("scaleSelect");
  const generateBtn = document.getElementById("generateBtn");
  const downloadPng = document.getElementById("downloadPng");
  const downloadSvg = document.getElementById("downloadSvg");
  const canvas = document.getElementById("barcodeCanvas");
  const barcodeText = document.getElementById("barcodeText");
  const ctx = canvas.getContext("2d");

  /* Code128 encoding tables */
  var CODE128B = [
    " ","!","\"","#","$","%","&","'","(",")","*","+",",","-",".","/",
    "0","1","2","3","4","5","6","7","8","9",":",";","<","=",">","?",
    "@","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O",
    "P","Q","R","S","T","U","V","W","X","Y","Z","[","\\","]","^","_",
    "`","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o",
    "p","q","r","s","t","u","v","w","x","y","z","{","|","}","~",String.fromCharCode(127)
  ];

  var PATTERNS = [
    "11011001100","11001101100","11001100110","10010011000","10010001100","10001001100","10011001000","10011000100",
    "10001100100","11001001000","11001000100","11000100100","10110011100","10011011100","10011001110","10111001100",
    "10011101100","10011100110","11001110010","11001011100","11001001110","11011100100","11001110100","11101101110",
    "11101001100","11100101100","11100100110","11101100100","11100110100","11100110010","11011011000","11011000110",
    "11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010","11010001000",
    "11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110",
    "11101110110","11010001110","11000101110","11011101000","11011100010","11011101110","11101011000","11101000110",
    "11100010110","11101101000","11101100010","11100011010","11101111010","11001000010","11110001010","10100110000",
    "10100001100","10010110000","10010000110","10000101100","10000100110","10110010000","10110000100","10011010000",
    "10011000010","10000110100","10000110010","11000010010","11001010000","11110111010","11000010100","10001111010",
    "10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100",
    "11110010010","11011011110","11011110110","11110110110","10101111000","10100011110","10001011110","10111101000",
    "10111100010","11110101000","11110100010","10111011110","10111101110","11101011110","11110101110","11010000100",
    "11010010000","11010011100","11000111010"
  ];

  var STOP = "11000111010";

  function encode(text) {
    if (!text) return null;
    var codes = [];
    for (var i = 0; i < text.length; i++) {
      var idx = CODE128B.indexOf(text[i]);
      if (idx === -1) continue;
      codes.push(idx);
    }
    if (codes.length === 0) return null;

    /* Start with Code B (104) */
    var sum = 104;
    for (var j = 0; j < codes.length; j++) sum += codes[j] * (j + 1);
    var check = sum % 103;

    var allCodes = [104].concat(codes).concat([check]);
    var bits = "";
    for (var k = 0; k < allCodes.length; k++) bits += PATTERNS[allCodes[k]];
    bits += STOP;
    return bits;
  }

  function renderBarcode(text, scale) {
    var bits = encode(text);
    if (!bits) { ctx.clearRect(0, 0, canvas.width, canvas.height); barcodeText.textContent = ""; return; }

    var barWidth = scale;
    var height = 60 * scale;
    var quiet = 10 * scale;
    var width = bits.length * barWidth + quiet * 2;

    canvas.width = width;
    canvas.height = height + 20 * scale;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    for (var i = 0; i < bits.length; i++) {
      if (bits[i] === "1") {
        ctx.fillRect(quiet + i * barWidth, 0, barWidth, height);
      }
    }

    /* Text below barcode */
    ctx.fillStyle = "#000000";
    ctx.font = (10 * scale) + "px monospace";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, height + 14 * scale);

    barcodeText.textContent = text;
  }

  function generate() {
    var scale = parseInt(scaleSelect.value, 10);
    renderBarcode(textInput.value, scale);
  }

  textInput.addEventListener("input", generate);
  scaleSelect.addEventListener("change", generate);
  generateBtn.addEventListener("click", generate);

  downloadPng.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "barcode-" + textInput.value + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  downloadSvg.addEventListener("click", function () {
    var bits = encode(textInput.value);
    if (!bits) return;
    var scale = parseInt(scaleSelect.value, 10);
    var barW = scale;
    var h = 60 * scale;
    var quiet = 10 * scale;
    var totalW = bits.length * barW + quiet * 2;
    var totalH = h + 24 * scale;

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + totalW + '" height="' + totalH + '" viewBox="0 0 ' + totalW + ' ' + totalH + '">';
    svg += '<rect width="100%" height="100%" fill="#fff"/>';
    for (var i = 0; i < bits.length; i++) {
      if (bits[i] === "1") {
        svg += '<rect x="' + (quiet + i * barW) + '" y="0" width="' + barW + '" height="' + h + '" fill="#000"/>';
      }
    }
    svg += '<text x="' + (totalW/2) + '" y="' + (h + 14*scale) + '" text-anchor="middle" font-family="monospace" font-size="' + (10*scale) + '" fill="#000">' + textInput.value.replace(/&/g,"&amp;").replace(/</g,"&lt;") + '</text>';
    svg += '</svg>';

    var blob = new Blob([svg], { type: "image/svg+xml" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = "barcode-" + textInput.value + ".svg";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  });

  generate();
})();
