(function () {
  "use strict";
  var nameInput = document.getElementById("nameInput");
  var bgColor = document.getElementById("bgColor");
  var fgColor = document.getElementById("fgColor");
  var sizeSelect = document.getElementById("sizeSelect");
  var shapeSelect = document.getElementById("shapeSelect");
  var generateBtn = document.getElementById("generateBtn");
  var downloadBtn = document.getElementById("downloadBtn");
  var canvas = document.getElementById("avatarCanvas");

  function getInitials(name) {
    var parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function draw() {
    var size = parseInt(sizeSelect.value);
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext("2d");
    var radius = shapeSelect.value === "circle" ? size / 2 : size * 0.15;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = bgColor.value;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(size - radius, 0);
    ctx.quadraticCurveTo(size, 0, size, radius);
    ctx.lineTo(size, size - radius);
    ctx.quadraticCurveTo(size, size, size - radius, size);
    ctx.lineTo(radius, size);
    ctx.quadraticCurveTo(0, size, 0, size - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    var initials = getInitials(nameInput.value);
    ctx.fillStyle = fgColor.value;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold " + (size * 0.38) + "px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillText(initials, size / 2, size / 2);
  }

  generateBtn.addEventListener("click", draw);
  nameInput.addEventListener("input", draw);
  bgColor.addEventListener("input", draw);
  fgColor.addEventListener("input", draw);
  shapeSelect.addEventListener("change", draw);
  draw();

  downloadBtn.addEventListener("click", function () {
    var link = document.createElement("a");
    link.download = "avatar.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
})();
