(function () {
  "use strict";
  const minVal = document.getElementById("minVal");
  const maxVal = document.getElementById("maxVal");
  const countVal = document.getElementById("countVal");
  const allowDuplicates = document.getElementById("allowDuplicates");
  const generateBtn = document.getElementById("generateBtn");
  const output = document.getElementById("output");
  const copyBtn = document.getElementById("copyBtn");

  function secureRandomInt(max) {
    var arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function generate() {
    var min = parseInt(minVal.value, 10);
    var max = parseInt(maxVal.value, 10);
    var count = parseInt(countVal.value, 10);
    if (isNaN(min) || isNaN(max)) { output.textContent = "Enter valid min and max."; return; }
    if (min > max) { var t = min; min = max; max = t; }
    if (count < 1) count = 1;
    if (count > 100) count = 100;
    var range = max - min + 1;

    if (!allowDuplicates.checked && count > range) {
      output.textContent = "Cannot pick " + count + " unique numbers from a range of " + range + ".";
      return;
    }

    var results = [];
    if (allowDuplicates.checked) {
      for (var i = 0; i < count; i++) {
        results.push(min + secureRandomInt(range));
      }
    } else {
      var pool = [];
      for (var j = 0; j < range; j++) pool.push(min + j);
      for (var k = 0; k < count; k++) {
        var idx = secureRandomInt(pool.length);
        results.push(pool[idx]);
        pool.splice(idx, 1);
      }
    }

    var html = '<div class="number-grid">';
    for (var m = 0; m < results.length; m++) {
      html += '<span class="num-chip">' + results[m] + '</span>';
    }
    html += '</div>';
    output.innerHTML = html;
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", function () {
    var chips = output.querySelectorAll(".num-chip");
    if (!chips.length) return;
    var text = [];
    chips.forEach(function (c) { text.push(c.textContent); });
    window.OmniTools.copyText(text.join(", ")).then(function () {
      window.OmniTools.showToast("Numbers copied.", "success");
    });
  });

  generate();
})();
