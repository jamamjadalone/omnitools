(function () {
  "use strict";
  const textInput = document.getElementById("qrText");
  const sizeSelect = document.getElementById("qrSize");
  const fgInput = document.getElementById("qrFg");
  const bgInput = document.getElementById("qrBg");
  const canvas = document.getElementById("qrCanvas");
  const ctx = canvas.getContext("2d");
  const downloadBtn = document.getElementById("downloadQrBtn");

  function render() {
    const text = textInput.value.trim();
    const size = parseInt(sizeSelect.value, 10);
    canvas.width = size;
    canvas.height = size;
    const fg = fgInput.value || "#000000";
    const bg = bgInput.value || "#ffffff";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    if (!text) return;
    let matrix;
    try {
      matrix = window.OmniQR.generateMatrix(text);
    } catch (e) {
      window.OmniTools.showToast(e.message, "error");
      return;
    }
    const modules = matrix.length;
    const quiet = 4;
    const cell = size / (modules + quiet * 2);

    ctx.fillStyle = fg;
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (matrix[r][c]) {
          ctx.fillRect((quiet + c) * cell, (quiet + r) * cell, cell + 0.5, cell + 0.5);
        }
      }
    }
  }

  let debounceTimer;
  function scheduleRender() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 150);
  }

  [textInput, sizeSelect, fgInput, bgInput].forEach((el) => {
    el.addEventListener("input", scheduleRender);
    el.addEventListener("change", scheduleRender);
  });

  downloadBtn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code.png";
    a.click();
    window.OmniTools.showToast("Download started.", "success");
  });

  render();
})();
