(function () {
  "use strict";
  var ogTitle = document.getElementById("ogTitle");
  var ogDesc = document.getElementById("ogDesc");
  var ogUrl = document.getElementById("ogUrl");
  var ogImage = document.getElementById("ogImage");
  var previewBtn = document.getElementById("previewBtn");

  var previewImage = document.getElementById("previewImage");
  var previewSite = document.getElementById("previewSite");
  var previewTitle = document.getElementById("previewTitle");
  var previewDesc = document.getElementById("previewDesc");
  var twImage = document.getElementById("twImage");
  var twTitle = document.getElementById("twTitle");
  var twDesc = document.getElementById("twDesc");
  var twSite = document.getElementById("twSite");

  function update() {
    var title = ogTitle.value || "Page Title";
    var desc = ogDesc.value || "A brief description of the page.";
    var url = ogUrl.value || "https://example.com";
    var img = ogImage.value;
    var hostname = "";
    try { hostname = new URL(url).hostname; } catch (e) { hostname = url; }

    previewTitle.textContent = title;
    previewDesc.textContent = desc;
    previewSite.textContent = hostname;
    twTitle.textContent = title;
    twDesc.textContent = desc;
    twSite.textContent = hostname;

    if (img) {
      previewImage.innerHTML = '<img src="' + img + '" alt="Preview">';
      twImage.innerHTML = '<img src="' + img + '" alt="Preview">';
    } else {
      previewImage.textContent = "No image";
      twImage.textContent = "No image";
    }
  }

  previewBtn.addEventListener("click", update);
  ogTitle.addEventListener("input", update);
  ogDesc.addEventListener("input", update);
  ogUrl.addEventListener("input", update);
  ogImage.addEventListener("input", update);
})();
