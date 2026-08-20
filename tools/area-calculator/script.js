(function () {
  "use strict";
  var shapeEl = document.getElementById("areaShape");
  var rectFields = document.getElementById("rectFields");
  var circleFields = document.getElementById("circleFields");
  var triFields = document.getElementById("triFields");
  var rectWidth = document.getElementById("rectWidth");
  var rectHeight = document.getElementById("rectHeight");
  var circleRadius = document.getElementById("circleRadius");
  var triBase = document.getElementById("triBase");
  var triHeight = document.getElementById("triHeight");
  var unitEl = document.getElementById("areaUnit");
  var calcBtn = document.getElementById("calcAreaBtn");
  var resultBox = document.getElementById("areaResult");
  var areaEl = document.getElementById("areaValue");
  var perimeterEl = document.getElementById("areaPerimeter");

  function fmt(n) { return n.toFixed(4).replace(/\.?0+$/, ""); }

  function switchShape() {
    var shape = shapeEl.value;
    rectFields.hidden = shape !== "rectangle";
    circleFields.hidden = shape !== "circle";
    triFields.hidden = shape !== "triangle";
  }

  function calculate() {
    var shape = shapeEl.value;
    var unit = unitEl.value === "units" ? "" : unitEl.value;
    var area, perimeter;
    var sqUnit = unit ? unit + "\u00B2" : "sq units";
    var u = unit || " units";

    if (shape === "rectangle") {
      var w = parseFloat(rectWidth.value);
      var h = parseFloat(rectHeight.value);
      if (isNaN(w) || isNaN(h) || w < 0 || h < 0) { window.OmniTools.showToast("Enter valid dimensions.", "error"); return; }
      area = w * h;
      perimeter = 2 * (w + h);
    } else if (shape === "circle") {
      var r = parseFloat(circleRadius.value);
      if (isNaN(r) || r < 0) { window.OmniTools.showToast("Enter a valid radius.", "error"); return; }
      area = Math.PI * r * r;
      perimeter = 2 * Math.PI * r;
    } else {
      var b = parseFloat(triBase.value);
      var th = parseFloat(triHeight.value);
      if (isNaN(b) || isNaN(th) || b < 0 || th < 0) { window.OmniTools.showToast("Enter valid dimensions.", "error"); return; }
      area = 0.5 * b * th;
      var side = Math.sqrt((b / 2) * (b / 2) + th * th);
      perimeter = b + 2 * side;
    }

    areaEl.textContent = fmt(area) + " " + sqUnit;
    perimeterEl.textContent = fmt(perimeter) + u;
    resultBox.hidden = false;
  }

  shapeEl.addEventListener("change", switchShape);
  calcBtn.addEventListener("click", calculate);
  [rectWidth, rectHeight, circleRadius, triBase, triHeight].forEach(function (el) {
    el.addEventListener("keydown", function (e) { if (e.key === "Enter") calculate(); });
  });
  switchShape();
})();
