(function () {
  "use strict";
  var input = document.getElementById("cbImageInput");
  var canvas = document.getElementById("cbCanvas");
  var ctx = canvas.getContext("2d");
  var simBtns = document.querySelectorAll("[data-sim]");
  var downloadBtn = document.getElementById("cbDownloadBtn");
  var currentMode = "normal";
  var originalData = null;

  var MATRICES = {
    normal: [1,0,0, 0,1,0, 0,0,1],
    deuteranopia: [0.625,0.375,0, 0.7,0.3,0, 0,0.3,0.7],
    protanopia: [0.567,0.433,0, 0.558,0.442,0, 0,0.242,0.758],
    tritanopia: [0.95,0.05,0, 0,0.433,0.567, 0,0.475,0.525]
  };

  input.addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      applySim();
    };
    img.src = URL.createObjectURL(file);
  });

  function applySim() {
    if (!originalData) return;
    var data = new ImageData(new Uint8ClampedArray(originalData.data), originalData.width, originalData.height);
    var m = MATRICES[currentMode];
    for (var i = 0; i < data.data.length; i += 4) {
      var r = data.data[i], g = data.data[i + 1], b = data.data[i + 2];
      data.data[i] = Math.min(255, Math.max(0, r * m[0] + g * m[1] + b * m[2]));
      data.data[i + 1] = Math.min(255, Math.max(0, r * m[3] + g * m[4] + b * m[5]));
      data.data[i + 2] = Math.min(255, Math.max(0, r * m[6] + g * m[7] + b * m[8]));
    }
    ctx.putImageData(data, 0, 0);
  }

  simBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      simBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentMode = btn.dataset.sim;
      applySim();
    });
  });

  downloadBtn.addEventListener("click", function () {
    if (!originalData) { window.OmniTools.showToast("Upload an image first.", "error"); return; }
    var link = document.createElement("a");
    link.download = "color-blindness-sim.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
