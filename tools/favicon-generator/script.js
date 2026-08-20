(function () {
  "use strict";
  var fileInput = document.getElementById("fileInput");
  var generateBtn = document.getElementById("generateBtn");
  var previewArea = document.getElementById("previewArea");
  var loadedImg = null;

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    var img = new Image();
    img.onload = function () { loadedImg = img; previewArea.innerHTML = '<div class="heading-summary">Image loaded. Click Generate & Download.</div>'; };
    img.src = URL.createObjectURL(file);
  });

  function resizeImage(img, size) {
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, size, size);
    return canvas;
  }

  function downloadCanvas(canvas, filename) {
    var link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  generateBtn.addEventListener("click", function () {
    if (!loadedImg) { window.OmniTools.showToast("Upload an image first.", "error"); return; }
    var checkboxes = document.querySelectorAll("#sizesCheckboxes input:checked");
    if (checkboxes.length === 0) { window.OmniTools.showToast("Select at least one size.", "error"); return; }
    previewArea.innerHTML = "";
    checkboxes.forEach(function (cb) {
      var size = parseInt(cb.value);
      var canvas = resizeImage(loadedImg, size);
      var div = document.createElement("div");
      div.className = "favicon-preview";
      div.appendChild(canvas);
      var label = document.createElement("div");
      label.className = "favicon-label";
      label.textContent = size + "×" + size;
      div.appendChild(label);
      var dlBtn = document.createElement("button");
      dlBtn.className = "btn btn-secondary btn-sm";
      dlBtn.textContent = "Download";
      dlBtn.addEventListener("click", function () {
        downloadCanvas(canvas, "favicon-" + size + "x" + size + ".png");
      });
      div.appendChild(dlBtn);
      previewArea.appendChild(div);
    });
  });
})();
