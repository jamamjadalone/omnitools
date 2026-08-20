/* =========================================================================
   OmniTools — slugify.js
   Shared slug/filename engine used by the SEO-Friendly Filename Generator,
   Slug Generator and any other tool that needs a safe URL/filename slug.
   ========================================================================= */
(function () {
  "use strict";

  var MAP = {
    á: "a", à: "a", â: "a", ä: "a", ã: "a", å: "a", ā: "a", ă: "a",
    é: "e", è: "e", ê: "e", ë: "e", ē: "e", ĕ: "e", ę: "e",
    í: "i", ì: "i", î: "i", ï: "i", ī: "i", ĭ: "i",
    ó: "o", ò: "o", ô: "o", ö: "o", õ: "o", ō: "o", ŏ: "o", ø: "o",
    ú: "u", ù: "u", û: "u", ü: "u", ū: "u", ŭ: "u",
    ñ: "n", ç: "c", ć: "c", č: "c", š: "s", ß: "ss", ž: "z", ý: "y", ÿ: "y",
  };

  function normalizeChars(str) {
    return String(str).replace(/[áàâäãåāăéèêëēĕęíìîïīĭóòôöõōŏøúùûüūŭñçćčšßžýÿ]/g, function (ch) {
      return MAP[ch] || ch;
    });
  }

  function slugify(input, options) {
    options = options || {};
    var sep = options.separator || "-";
    var lower = options.lowercase !== false;
    var stripExt = options.stripExtension === true;

    var s = String(input || "");
    if (stripExt) {
      s = s.replace(/\.[^.\/]+$/, "");
    }
    s = normalizeChars(s);
    if (lower) s = s.toLowerCase();
    s = s.replace(/[\s_]+/g, sep);
    s = s.replace(/[^a-z0-9\-]+/gi, options.stripSpecial === false ? sep : "");
    s = s.replace(new RegExp(sep + "+", "g"), sep);
    s = s.replace(new RegExp("^" + sep + "+|" + sep + "+$", "g"), "");
    return s;
  }

  window.OmniToolsSlugify = { slugify: slugify };
})();