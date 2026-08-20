(function () {
  "use strict";
  var input = document.getElementById("pigInput");
  var output = document.getElementById("pigOutput");
  var convertBtn = document.getElementById("convertBtn");
  var copyBtn = document.getElementById("copyBtn");

  function toPigLatin(word) {
    if (!word) return word;
    var vowels = "aeiouAEIOU";
    var punct = "";
    var clean = word;
    while (clean.length > 0 && /[.,!?;:'")\-]/.test(clean[clean.length - 1])) {
      punct = clean[clean.length - 1] + punct;
      clean = clean.slice(0, -1);
    }
    if (!clean) return word;
    if (vowels.indexOf(clean[0]) !== -1) {
      return clean + "way" + punct;
    }
    var consonants = "";
    var i = 0;
    while (i < clean.length && vowels.indexOf(clean[i]) === -1) {
      consonants += clean[i];
      i++;
    }
    var rest = clean.slice(i);
    var result = rest + consonants.toLowerCase() + "ay";
    if (clean[0] === clean[0].toUpperCase()) {
      result = result.charAt(0).toUpperCase() + result.slice(1);
      if (consonants.length > 0 && consonants[0] === consonants[0].toUpperCase()) {
        result = rest.charAt(0).toUpperCase() + rest.slice(1) + consonants.charAt(0).toLowerCase() + consonants.slice(1).toLowerCase() + "ay";
      }
    }
    return result + punct;
  }

  function convert() {
    var text = input.value;
    if (!text.trim()) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    var words = text.split(/(\s+)/);
    var result = words.map(function (w) {
      if (/^\s+$/.test(w)) return w;
      return toPigLatin(w);
    }).join("");
    output.textContent = result;
  }

  convertBtn.addEventListener("click", convert);
  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text.indexOf("Pig Latin") === 0) return;
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
})();
