(function () {
  "use strict";
  const baseFontInput = document.getElementById("baseFontSize");
  const vpWidthInput = document.getElementById("viewportWidth");
  const vpHeightInput = document.getElementById("viewportHeight");
  const inputValue = document.getElementById("inputValue");
  const inputUnit = document.getElementById("inputUnit");
  const results = document.getElementById("unitResults");

  const PX_PER_PT = 96 / 72;

  function toPx(val, unit) {
    const base = parseFloat(baseFontInput.value) || 16;
    const vpW = parseFloat(vpWidthInput.value) || 1920;
    const vpH = parseFloat(vpHeightInput.value) || 1080;
    switch (unit) {
      case "px": return val;
      case "em": return val * base;
      case "rem": return val * base;
      case "vw": return (val / 100) * vpW;
      case "vh": return (val / 100) * vpH;
      case "pt": return val * PX_PER_PT;
      case "%": return (val / 100) * base;
      default: return val;
    }
  }

  function fromPx(px, unit) {
    const base = parseFloat(baseFontInput.value) || 16;
    const vpW = parseFloat(vpWidthInput.value) || 1920;
    const vpH = parseFloat(vpHeightInput.value) || 1080;
    switch (unit) {
      case "px": return px;
      case "em": return px / base;
      case "rem": return px / base;
      case "vw": return (px / vpW) * 100;
      case "vh": return (px / vpH) * 100;
      case "pt": return px / PX_PER_PT;
      case "%": return (px / base) * 100;
      default: return px;
    }
  }

  function update() {
    const val = parseFloat(inputValue.value);
    const unit = inputUnit.value;
    if (isNaN(val)) {
      results.textContent = "Enter a valid number.";
      return;
    }
    const px = toPx(val, unit);
    const units = ["px", "em", "rem", "vw", "vh", "pt", "%"];
    let html = '<div class="unit-results-grid">';
    units.forEach(u => {
      const converted = fromPx(px, u);
      const isActive = u === unit ? " active" : "";
      const displayVal = Math.round(converted * 10000) / 10000;
      html += '<div class="unit-row' + isActive + '"><span class="unit-label">' + u + '</span><span class="unit-value">' + displayVal + u + '</span></div>';
    });
    html += '</div>';
    results.innerHTML = html;
  }

  [baseFontInput, vpWidthInput, vpHeightInput, inputValue, inputUnit].forEach(el => {
    el.addEventListener("input", update);
  });
  update();
})();
