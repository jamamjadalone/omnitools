(function () {
  "use strict";
  const colorInput = document.getElementById("colorInput");
  const hexInput = document.getElementById("hexInput");
  const rgbInput = document.getElementById("rgbInput");
  const hslInput = document.getElementById("hslInput");
  const preview = document.getElementById("colorPreview");
  const details = document.getElementById("colorDetails");

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function luminance(r, g, b) {
    const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function update(hex) {
    if (!/^#?[0-9a-fA-F]{6}$/.test(hex) && !/^#?[0-9a-fA-F]{3}$/.test(hex)) return;
    if (!hex.startsWith("#")) hex = "#" + hex;
    colorInput.value = hex;
    hexInput.value = hex;

    const rgb = hexToRgb(hex);
    rgbInput.value = "rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")";

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hslInput.value = "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)";

    preview.style.background = hex;

    const lum = luminance(rgb.r, rgb.g, rgb.b);
    const textColor = lum > 0.179 ? "#000" : "#fff";
    preview.style.color = textColor;
    preview.textContent = hex.toUpperCase();

    const contrastWhite = (1.05) / (lum + 0.05);
    const contrastBlack = (lum + 0.05) / 0.05;
    details.innerHTML = '<div class="detail-grid">' +
      '<div class="detail-row"><span>HEX</span><span class="mono">' + hex.toUpperCase() + '</span></div>' +
      '<div class="detail-row"><span>RGB</span><span class="mono">' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + '</span></div>' +
      '<div class="detail-row"><span>HSL</span><span class="mono">' + hsl.h + '°, ' + hsl.s + '%, ' + hsl.l + '%</span></div>' +
      '<div class="detail-row"><span>Contrast vs white</span><span class="mono">' + contrastWhite.toFixed(2) + ':1</span></div>' +
      '<div class="detail-row"><span>Contrast vs black</span><span class="mono">' + contrastBlack.toFixed(2) + ':1</span></div>' +
      '</div>';
  }

  colorInput.addEventListener("input", () => update(colorInput.value));
  hexInput.addEventListener("input", () => {
    let v = hexInput.value.trim();
    if (!v.startsWith("#")) v = "#" + v;
    update(v);
  });

  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.copy;
      let val = "";
      if (type === "hex") val = hexInput.value;
      else if (type === "rgb") val = rgbInput.value;
      else if (type === "hsl") val = hslInput.value;
      window.OmniTools.copyText(val).then(() => window.OmniTools.showToast("Copied!", "success"));
    });
  });

  update(colorInput.value);
})();
