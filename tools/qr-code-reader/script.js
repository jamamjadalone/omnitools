(function () {
  "use strict";
  var fileInput = document.getElementById("fileInput");
  var previewImg = document.getElementById("previewImg");
  var scanBtn = document.getElementById("scanBtn");
  var errorBox = document.getElementById("qrError");
  var output = document.getElementById("qrOutput");
  var copyBtn = document.getElementById("copyBtn");
  var currentCanvas = null;

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    errorBox.style.display = "none";
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = "block";
    output.textContent = "Image loaded. Click Scan QR Code.";
  });

  scanBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    if (!previewImg.src) { errorBox.textContent = "Upload an image first."; errorBox.style.display = "flex"; return; }
    if (typeof jsQR === "undefined") {
      errorBox.textContent = "QR library failed to load. Check your connection.";
      errorBox.style.display = "flex";
      return;
    }
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;
    ctx.drawImage(previewImg, 0, 0);
    currentCanvas = canvas;
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var code = jsQR(imageData.data, canvas.width, canvas.height, { inversionAttempts: "attemptBoth" });
    if (code) {
      output.textContent = code.data;
    } else {
      errorBox.textContent = "No QR code found in the image. Try a clearer or higher-resolution image.";
      errorBox.style.display = "flex";
    }
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text.indexOf("Upload") !== -1 || text.indexOf("Image loaded") !== -1) return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
