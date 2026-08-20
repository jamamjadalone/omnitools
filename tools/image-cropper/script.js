(function () {
  "use strict";
  var fileInput = document.getElementById("fileInput");
  var cropCanvas = document.getElementById("cropCanvas");
  var cropOverlay = document.getElementById("cropOverlay");
  var cropBox = document.getElementById("cropBox");
  var cropInfo = document.getElementById("cropInfo");
  var cropBtn = document.getElementById("cropBtn");
  var ratioBtns = document.querySelectorAll(".ratio-btn");

  var origImg = null;
  var displayScale = 1;
  var currentRatio = "free";
  var dragging = false;
  var startX = 0, startY = 0;
  var cropX = 0, cropY = 0, cropW = 0, cropH = 0;

  var ratios = {
    "free": 0,
    "1:1": 1,
    "4:3": 4/3,
    "16:9": 16/9,
    "3:2": 3/2,
    "9:16": 9/16
  };

  ratioBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      ratioBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentRatio = btn.dataset.ratio;
      if (origImg) constrainCrop();
    });
  });

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    var img = new Image();
    img.onload = function () {
      origImg = img;
      var maxW = 600;
      displayScale = img.width > maxW ? maxW / img.width : 1;
      cropCanvas.width = Math.round(img.width * displayScale);
      cropCanvas.height = Math.round(img.height * displayScale);
      var ctx = cropCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, cropCanvas.width, cropCanvas.height);
      cropOverlay.style.display = "block";
      cropOverlay.style.width = cropCanvas.width + "px";
      cropOverlay.style.height = cropCanvas.height + "px";
      cropX = 0; cropY = 0;
      cropW = cropCanvas.width; cropH = cropCanvas.height;
      updateBox();
    };
    img.src = URL.createObjectURL(file);
  });

  function constrainCrop() {
    var r = ratios[currentRatio];
    if (r === 0) return;
    var newW = cropW;
    var newH = Math.round(newW / r);
    if (newH > cropCanvas.height) {
      newH = cropCanvas.height;
      newW = Math.round(newH * r);
    }
    if (newW > cropCanvas.width) {
      newW = cropCanvas.width;
      newH = Math.round(newW / r);
    }
    cropW = newW;
    cropH = newH;
    updateBox();
  }

  function updateBox() {
    cropBox.style.left = cropX + "px";
    cropBox.style.top = cropY + "px";
    cropBox.style.width = cropW + "px";
    cropBox.style.height = cropH + "px";
    var realW = Math.round(cropW / displayScale);
    var realH = Math.round(cropH / displayScale);
    cropInfo.textContent = "Crop: " + realW + "×" + realH + " px";
  }

  cropOverlay.addEventListener("mousedown", function (e) {
    var rect = cropOverlay.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    dragging = true;
    cropX = startX; cropY = startY; cropW = 0; cropH = 0;
    updateBox();
  });

  cropOverlay.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    var rect = cropOverlay.getBoundingClientRect();
    var mx = e.clientX - rect.left;
    var my = e.clientY - rect.top;
    cropW = Math.max(0, Math.min(mx, cropCanvas.width) - cropX);
    cropH = Math.max(0, Math.min(my, cropCanvas.height) - cropY);

    if (currentRatio !== "free") {
      var r = ratios[currentRatio];
      cropH = Math.round(cropW / r);
      if (cropY + cropH > cropCanvas.height) {
        cropH = cropCanvas.height - cropY;
        cropW = Math.round(cropH * r);
      }
    }
    updateBox();
  });

  document.addEventListener("mouseup", function () { dragging = false; });

  cropBtn.addEventListener("click", function () {
    if (!origImg) { window.OmniTools.showToast("Upload an image first.", "error"); return; }
    if (cropW < 2 || cropH < 2) { window.OmniTools.showToast("Draw a crop area first.", "error"); return; }
    var outCanvas = document.createElement("canvas");
    var realX = Math.round(cropX / displayScale);
    var realY = Math.round(cropY / displayScale);
    var realW = Math.round(cropW / displayScale);
    var realH = Math.round(cropH / displayScale);
    outCanvas.width = realW;
    outCanvas.height = realH;
    var ctx = outCanvas.getContext("2d");
    ctx.drawImage(origImg, realX, realY, realW, realH, 0, 0, realW, realH);
    var link = document.createElement("a");
    link.download = "cropped.png";
    link.href = outCanvas.toDataURL("image/png");
    link.click();
  });
})();
