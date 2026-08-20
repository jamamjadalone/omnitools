(function () {
  "use strict";
  var input = document.getElementById("romanInput");
  var toRomanBtn = document.getElementById("toRomanBtn");
  var toNumberBtn = document.getElementById("toNumberBtn");
  var errorBox = document.getElementById("romanError");
  var output = document.getElementById("romanOutput");
  var copyBtn = document.getElementById("copyBtn");

  var lookup = [
    [1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],
    [50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]
  ];
  var romanValues = {M:1000,D:500,C:100,L:50,X:10,V:5,I:1};

  function intToRoman(num) {
    var result = "";
    for (var i = 0; i < lookup.length; i++) {
      while (num >= lookup[i][0]) { result += lookup[i][1]; num -= lookup[i][0]; }
    }
    return result;
  }

  function romanToInt(str) {
    str = str.toUpperCase().trim();
    var total = 0;
    for (var i = 0; i < str.length; i++) {
      var curr = romanValues[str[i]];
      var next = i + 1 < str.length ? romanValues[str[i + 1]] : 0;
      if (!curr) return NaN;
      if (curr < next) { total -= curr; } else { total += curr; }
    }
    return total;
  }

  toRomanBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = parseInt(input.value.trim(), 10);
    if (isNaN(val) || val < 1 || val > 3999) {
      errorBox.textContent = "Enter a number between 1 and 3999.";
      errorBox.style.display = "flex";
      return;
    }
    output.textContent = intToRoman(val);
  });

  toNumberBtn.addEventListener("click", function () {
    errorBox.style.display = "none";
    var val = input.value.trim();
    if (!val || !/^[IVXLCDMivxlcdm]+$/.test(val)) {
      errorBox.textContent = "Enter a valid Roman numeral (e.g. XIV).";
      errorBox.style.display = "flex";
      return;
    }
    var result = romanToInt(val);
    if (isNaN(result) || result < 1 || result > 3999) {
      errorBox.textContent = "Invalid Roman numeral.";
      errorBox.style.display = "flex";
      return;
    }
    output.textContent = result;
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Result will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
