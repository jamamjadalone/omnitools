(function () {
  "use strict";
  var fileInput = document.getElementById("fileInput");
  var widthRange = document.getElementById("widthRange");
  var widthVal = document.getElementById("widthVal");
  var charsetSelect = document.getElementById("charsetSelect");
  var convertBtn = document.getElementById("convertBtn");
  var output = document.getElementById("asciiOutput");
  var copyBtn = document.getElementById("copyBtn");
  var loadedImg = null;

  var charsets = {
    standard: " .,:-=+*#%@",
    detailed: " .,:;i1tfLCG08@",
    blocks: " ░▒▓█",
    simple: " .oO@"
  };

  widthRange.addEventListener("input", function () { widthVal.textContent = widthRange.value; });

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    var img = new Image();
    img.onload = function () { loadedImg = img; };
    img.src = URL.createObjectURL(file);
  });

  convertBtn.addEventListener("click", function () {
    if (!loadedImg) { window.OmniTools.showToast("Upload an image first.", "error"); return; }
    var chars = charsets[charsetSelect.value];
    var targetW = parseInt(widthRange.value);
    var aspect = loadedImg.height / loadedImg.width;
    var canvasW = targetW;
    var canvasH = Math.round(targetW * aspect * 0.55);
    var canvas = document.createElement("canvas");
    canvas.width = canvasW;
    canvas.height = canvasH;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(loadedImg, 0, 0, canvasW, canvasH);
    var data = ctx.getImageData(0, 0, canvasW, canvasH).data;
    var lines = [];
    for (var y = 0; y < canvasH; y++) {
      var line = "";
      for (var x = 0; x < canvasW; x++) {
        var idx = (y * canvasW + x) * 4;
        var r = data[idx], g = data[idx + 1], b = data[idx + 2];
        var brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        var charIdx = Math.round(brightness * (chars.length - 1));
        line += chars[charIdx];
      }
      lines.push(line);
    }
    output.textContent = lines.join("\n");
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Upload an image and click Convert.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
