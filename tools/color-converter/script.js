(function () {
  "use strict";
  const hexInput = document.getElementById("hexInput");
  const rInput = document.getElementById("rInput");
  const gInput = document.getElementById("gInput");
  const bInput = document.getElementById("bInput");
  const hInput = document.getElementById("hInput");
  const sInput = document.getElementById("sInput");
  const lInput = document.getElementById("lInput");
  const colorPreview = document.getElementById("colorPreview");
  const nativePicker = document.getElementById("nativePicker");
  const rgbOutput = document.getElementById("rgbOutput");
  const hslOutput = document.getElementById("hslOutput");
  const colorInfo = document.getElementById("colorInfo");

  var updating = false;

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    if (hex.length !== 6) return null;
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return { r: r, g: g, b: b };
  }

  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(function (v) { return clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0"); }).join("");
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

  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    var r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      function hue2rgb(p, q, t) {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }
      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function updateFromRgb(r, g, b, source) {
    if (updating) return;
    updating = true;
    r = clamp(Math.round(r), 0, 255);
    g = clamp(Math.round(g), 0, 255);
    b = clamp(Math.round(b), 0, 255);

    var hex = rgbToHex(r, g, b);
    var hsl = rgbToHsl(r, g, b);

    if (source !== "hex") hexInput.value = hex;
    if (source !== "rgb") { rInput.value = r; gInput.value = g; bInput.value = b; }
    if (source !== "hsl") { hInput.value = hsl.h; sInput.value = hsl.s; lInput.value = hsl.l; }

    colorPreview.style.background = hex;
    nativePicker.value = hex;
    rgbOutput.textContent = "rgb(" + r + ", " + g + ", " + b + ")";
    hslOutput.textContent = "hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)";
    colorInfo.innerHTML = "<b>" + hex.toUpperCase() + "</b><br>rgb(" + r + ", " + g + ", " + b + ")<br>hsl(" + hsl.h + ", " + hsl.s + "%, " + hsl.l + "%)";
    updating = false;
  }

  hexInput.addEventListener("input", function () {
    var rgb = hexToRgb(hexInput.value);
    if (rgb) updateFromRgb(rgb.r, rgb.g, rgb.b, "hex");
  });

  [rInput, gInput, bInput].forEach(function (el) {
    el.addEventListener("input", function () {
      updateFromRgb(parseInt(rInput.value)||0, parseInt(gInput.value)||0, parseInt(bInput.value)||0, "rgb");
    });
  });

  [hInput, sInput, lInput].forEach(function (el) {
    el.addEventListener("input", function () {
      var rgb = hslToRgb(parseInt(hInput.value)||0, parseInt(sInput.value)||0, parseInt(lInput.value)||0);
      updateFromRgb(rgb.r, rgb.g, rgb.b, "hsl");
    });
  });

  nativePicker.addEventListener("input", function () {
    var rgb = hexToRgb(nativePicker.value);
    if (rgb) updateFromRgb(rgb.r, rgb.g, rgb.b, "picker");
  });

  document.querySelectorAll(".copy-field").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      if (!target) return;
      window.OmniTools.copyText(target.textContent).then(function () { window.OmniTools.showToast("Copied.", "success"); });
    });
  });

  updateFromRgb(34, 197, 94, "");
})();
