(function () {
  "use strict";
  var input = document.getElementById("slugInput");
  var sepSelect = document.getElementById("slugSep");
  var caseSelect = document.getElementById("slugCase");
  var slugBtn = document.getElementById("slugBtn");
  var output = document.getElementById("slugOutput");
  var copyBtn = document.getElementById("copyBtn");

  var TRANSLIT = {
    "а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z",
    "и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r",
    "с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"ts","ч":"ch","ш":"sh",
    "щ":"sch","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya",
    "ä":"ae","ö":"oe","ü":"ue","ß":"ss","ø":"o","å":"a","æ":"ae",
    "ñ":"n","ç":"c","é":"e","è":"e","ê":"e","ë":"e","á":"a","à":"a",
    "â":"a","ã":"a","í":"i","ì":"i","î":"i","ï":"i","ó":"o","ò":"o",
    "ô":"o","õ":"o","ú":"u","ù":"u","û":"u","ý":"y","ÿ":"y"
  };

  function transliterate(ch) {
    var lower = ch.toLowerCase();
    if (TRANSLIT[lower]) {
      var result = TRANSLIT[lower];
      if (ch === ch.toUpperCase() && result) result = result.toUpperCase();
      return result;
    }
    return ch;
  }

  function slugify(text) {
    var sep = sepSelect.value;
    var casing = caseSelect.value;
    var result = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (/[a-zA-Z0-9]/.test(ch)) {
        result += ch;
      } else {
        var t = transliterate(ch);
        if (/[a-zA-Z0-9]/.test(t)) {
          result += t;
        } else if (result.length > 0 && result[result.length - 1] !== sep) {
          result += sep;
        }
      }
    }
    result = result.replace(new RegExp("[" + sep.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "]+", "g"), sep);
    result = result.replace(new RegExp("^[" + sep.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "]+"), "");
    result = result.replace(new RegExp("[" + sep.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "]+$"), "");
    if (casing === "lower") result = result.toLowerCase();
    else if (casing === "upper") result = result.toUpperCase();
    return result;
  }

  function generate() {
    var text = input.value.trim();
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    output.textContent = slugify(text);
  }

  slugBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text.indexOf("Slug") === 0) return;
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
})();
