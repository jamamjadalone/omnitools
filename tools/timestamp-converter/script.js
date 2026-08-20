(function () {
  "use strict";
  var input = document.getElementById("tsInput");
  var toDateBtn = document.getElementById("toDateBtn");
  var toTsBtn = document.getElementById("toTsBtn");
  var nowBtn = document.getElementById("nowBtn");
  var errorBox = document.getElementById("tsError");
  var dateOut = document.getElementById("dateOut");
  var tsOut = document.getElementById("tsOut");
  var msOut = document.getElementById("msOut");
  var isoOut = document.getElementById("isoOut");
  var utcOut = document.getElementById("utcOut");
  var copyBtn = document.getElementById("copyBtn");

  function showAll(d) {
    var seconds = Math.floor(d.getTime() / 1000);
    var milliseconds = d.getTime();
    dateOut.innerHTML = "<strong>Human-readable:</strong> " + d.toLocaleString();
    tsOut.innerHTML = "<strong>Unix (seconds):</strong> " + seconds;
    msOut.innerHTML = "<strong>Unix (milliseconds):</strong> " + milliseconds;
    isoOut.innerHTML = "<strong>ISO 8601:</strong> " + d.toISOString();
    utcOut.innerHTML = "<strong>UTC:</strong> " + d.toUTCString();
  }

  toDateBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value.trim();
    if (!val) { errorBox.textContent = "Enter a timestamp first."; errorBox.style.display = "flex"; return; }
    var num = Number(val);
    var d;
    if (/^\d{10}$/.test(val)) {
      d = new Date(num * 1000);
    } else if (/^\d{13}$/.test(val)) {
      d = new Date(num);
    } else {
      d = new Date(val);
    }
    if (isNaN(d.getTime())) { errorBox.textContent = "Could not parse the input as a timestamp or date."; errorBox.style.display = "flex"; return; }
    showAll(d);
  });

  toTsBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value.trim();
    if (!val) { errorBox.textContent = "Enter a date string first."; errorBox.style.display = "flex"; return; }
    var d = new Date(val);
    if (isNaN(d.getTime())) { errorBox.textContent = "Could not parse the date string."; errorBox.style.display = "flex"; return; }
    showAll(d);
  });

  nowBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var d = new Date();
    input.value = Math.floor(d.getTime() / 1000);
    showAll(d);
  });

  copyBtn.addEventListener("click", function () {
    var text = dateOut.textContent + "\n" + tsOut.textContent + "\n" + msOut.textContent + "\n" + isoOut.textContent + "\n" + utcOut.textContent;
    if (tsOut.textContent.indexOf("—") !== -1) return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
