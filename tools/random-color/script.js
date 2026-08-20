(function () {
  "use strict";
  const colorCount = document.getElementById("colorCount");
  const formatSelect = document.getElementById("formatSelect");
  const generateBtn = document.getElementById("generateBtn");
  const copyBtn = document.getElementById("copyBtn");
  const cssBtn = document.getElementById("cssBtn");
  const palette = document.getElementById("palette");

  var currentColors = [];

  function randomInt(max) {
    var arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function hexFromRgb(r, g, b) {
    return "#" + [r, g, b].map(function (v) { return v.toString(16).padStart(2, "0"); }).join("");
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function generate() {
    var count = parseInt(colorCount.value, 10) || 5;
    if (count < 1) count = 1;
    if (count > 20) count = 20;
    currentColors = [];
    for (var i = 0; i < count; i++) {
      var r = randomInt(256), g = randomInt(256), b = randomInt(256);
      currentColors.push({ r: r, g: g, b: b });
    }
    render();
  }

  function render() {
    var fmt = formatSelect.value;
    var html = "";
    currentColors.forEach(function (c, i) {
      var hex = hexFromRgb(c.r, c.g, c.b);
      var label;
      if (fmt === "hex") label = hex;
      else if (fmt === "rgb") label = "rgb(" + c.r + "," + c.g + "," + c.b + ")";
      else { var hsl = rgbToHsl(c.r, c.g, c.b); label = "hsl(" + hsl.h + "," + hsl.s + "%," + hsl.l + "%)"; }
      html += '<div class="swatch" data-idx="' + i + '" title="Click to copy">' +
        '<div class="swatch-color" style="background:' + hex + ';"></div>' +
        '<div class="swatch-label">' + label + '</div></div>';
    });
    palette.innerHTML = html;
    palette.querySelectorAll(".swatch").forEach(function (s) {
      s.addEventListener("click", function () {
        var idx = parseInt(s.dataset.idx, 10);
        var c = currentColors[idx];
        var val = formatSelect.value === "hex" ? hexFromRgb(c.r, c.g, c.b) :
          formatSelect.value === "rgb" ? "rgb(" + c.r + "," + c.g + "," + c.b + ")" :
          (function () { var h = rgbToHsl(c.r, c.g, c.b); return "hsl(" + h.h + "," + h.s + "%," + h.l + "%)"; })();
        window.OmniTools.copyText(val).then(function () { window.OmniTools.showToast("Copied: " + val, "success"); });
      });
    });
  }

  function getCssText() {
    var lines = [":root {"];
    currentColors.forEach(function (c, i) {
      lines.push("  --color-" + (i + 1) + ": " + hexFromRgb(c.r, c.g, c.b) + ";");
    });
    lines.push("}");
    return lines.join("\n");
  }

  copyBtn.addEventListener("click", function () {
    var fmt = formatSelect.value;
    var lines = currentColors.map(function (c) {
      if (fmt === "hex") return hexFromRgb(c.r, c.g, c.b);
      if (fmt === "rgb") return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
      var hsl = rgbToHsl(c.r, c.g, c.b);
      return "hsl(" + hsl.h + "," + hsl.s + "%," + hsl.l + "%)";
    });
    window.OmniTools.copyText(lines.join("\n")).then(function () { window.OmniTools.showToast("Palette copied.", "success"); });
  });

  cssBtn.addEventListener("click", function () {
    window.OmniTools.copyText(getCssText()).then(function () { window.OmniTools.showToast("CSS copied.", "success"); });
  });

  generateBtn.addEventListener("click", generate);
  formatSelect.addEventListener("change", render);
  generate();
})();
