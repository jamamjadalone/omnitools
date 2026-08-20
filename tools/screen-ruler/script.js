(function () {
  "use strict";
  const orientationSelect = document.getElementById("orientationSelect");
  const colorSelect = document.getElementById("colorSelect");
  const showRulerBtn = document.getElementById("showRuler");
  const hideRulerBtn = document.getElementById("hideRuler");
  const manualWidth = document.getElementById("manualWidth");
  const drawManualBtn = document.getElementById("drawManual");
  const rulerInfo = document.getElementById("rulerInfo");

  var ruler = null;
  var dragging = false;
  var dragOffsetX = 0;
  var dragOffsetY = 0;

  function createRuler(pixels) {
    removeRuler();
    var orient = orientationSelect.value;
    var color = colorSelect.value;
    var isH = orient === "horizontal";

    ruler = document.createElement("div");
    ruler.className = "ruler-overlay " + orient + " " + color;
    ruler.style.pointerEvents = "auto";
    ruler.style.cursor = "grab";

    if (isH) {
      ruler.style.left = "50px";
      ruler.style.top = "50px";
      ruler.style.width = pixels + "px";
      ruler.style.height = "30px";
    } else {
      ruler.style.left = "50px";
      ruler.style.top = "50px";
      ruler.style.width = "30px";
      ruler.style.height = pixels + "px";
    }

    /* Add tick marks */
    for (var i = 0; i <= pixels; i++) {
      if (i % 100 === 0) {
        var tick = document.createElement("div");
        tick.className = "ruler-tick major";
        if (isH) tick.style.left = i + "px";
        else tick.style.top = i + "px";
        ruler.appendChild(tick);

        var label = document.createElement("span");
        label.className = "ruler-tick-label";
        label.textContent = i + "px";
        label.style.cssText = "position:absolute;font-size:9px;font-family:monospace;pointer-events:none;color:inherit;";
        if (isH) { label.style.left = (i + 2) + "px"; label.style.bottom = "12px"; }
        else { label.style.top = (i + 2) + "px"; label.style.left = "2px"; }
        ruler.appendChild(label);
      } else if (i % 50 === 0) {
        var tick2 = document.createElement("div");
        tick2.className = "ruler-tick major";
        if (isH) tick2.style.left = i + "px";
        else tick2.style.top = i + "px";
        ruler.appendChild(tick2);
      } else if (i % 10 === 0) {
        var tick3 = document.createElement("div");
        tick3.className = "ruler-tick minor";
        if (isH) tick3.style.left = i + "px";
        else tick3.style.top = i + "px";
        ruler.appendChild(tick3);
      } else if (i % 5 === 0) {
        var tick4 = document.createElement("div");
        tick4.className = "ruler-tick tiny";
        if (isH) tick4.style.left = i + "px";
        else tick4.style.top = i + "px";
        ruler.appendChild(tick4);
      }
    }

    /* Size label */
    var sizeLabel = document.createElement("div");
    sizeLabel.className = "ruler-label " + (isH ? "size-label" : "size-label-v");
    sizeLabel.textContent = pixels + "px";
    ruler.appendChild(sizeLabel);

    /* Drag functionality */
    ruler.addEventListener("mousedown", function (e) {
      dragging = true;
      var rect = ruler.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      ruler.style.cursor = "grabbing";
      e.preventDefault();
    });

    document.addEventListener("mousemove", function (e) {
      if (!dragging) return;
      ruler.style.left = (e.clientX - dragOffsetX) + "px";
      ruler.style.top = (e.clientY - dragOffsetY) + "px";
      ruler.style.right = "auto";
      ruler.style.bottom = "auto";
    });

    document.addEventListener("mouseup", function () {
      if (dragging) { dragging = false; ruler.style.cursor = "grab"; }
    });

    document.body.appendChild(ruler);
    rulerInfo.textContent = "Ruler displayed: " + pixels + "px " + orient + ". Drag to reposition.";
  }

  function removeRuler() {
    if (ruler) { ruler.remove(); ruler = null; }
  }

  showRulerBtn.addEventListener("click", function () {
    createRuler(parseInt(manualWidth.value, 10) || 400);
  });

  hideRulerBtn.addEventListener("click", function () {
    removeRuler();
    rulerInfo.textContent = "Ruler hidden.";
  });

  drawManualBtn.addEventListener("click", function () {
    var px = parseInt(manualWidth.value, 10);
    if (isNaN(px) || px < 1) px = 1;
    if (px > 5000) px = 5000;
    createRuler(px);
  });

  orientationSelect.addEventListener("change", function () {
    if (ruler) {
      var size = orientationSelect.value === "horizontal" ?
        parseInt(ruler.style.width) : parseInt(ruler.style.height);
      createRuler(size || 400);
    }
  });
})();
