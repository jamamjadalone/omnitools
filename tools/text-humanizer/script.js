(function () {
  "use strict";
  var textInput = document.getElementById("textInput");
  var levelSelect = document.getElementById("levelSelect");
  var humanizeBtn = document.getElementById("humanizeBtn");
  var output = document.getElementById("humanOutput");
  var copyBtn = document.getElementById("copyBtn");

  var replacements = {
    "utilize": "use",
    "utilization": "use",
    "commence": "start",
    "commencement": "start",
    "endeavor": "try",
    "subsequent": "next",
    "subsequently": "then",
    "approximately": "about",
    "demonstrate": "show",
    "demonstrates": "shows",
    "facilitate": "help",
    "facilitates": "helps",
    "implement": "set up",
    "implements": "sets up",
    "implementation": "setup",
    "furthermore": "also",
    "moreover": "also",
    "nevertheless": "still",
    "notwithstanding": "despite",
    "aforementioned": "this",
    "heretofore": "until now",
    "henceforth": "from now on",
    "insofar": "to the extent",
    "therein": "in that",
    "thereof": "of that",
    "thereby": "by doing this",
    "whereby": "by which",
    "herein": "in this",
    "hereafter": "from now on",
    "inasmuch": "since",
    "peruse": "read",
    "effectuate": "bring about",
    "ameliorate": "improve",
    "disseminate": "spread",
    "promulgate": "announce",
    "ascertain": "find out",
    "contemplate": "think about",
    "necessitate": "require",
    "prior to": "before",
    "subsequent to": "after",
    "in lieu of": "instead of",
    "in the event that": "if",
    "at this point in time": "now",
    "due to the fact that": "because",
    "for the purpose of": "to",
    "in order to": "to",
    "on a regular basis": "regularly",
    "at the present time": "now",
    "in the near future": "soon",
    "has the ability to": "can",
    "is able to": "can",
    "it is important to note that": "note that",
    "it should be noted that": "note that",
    "with regard to": "about",
    "in regard to": "about",
    "with respect to": "about",
    "in terms of": "for",
    "on the grounds that": "because",
    "in light of": "given",
    "for the reason that": "because",
    "on account of": "because",
    "as a consequence": "so",
    "as a result": "so",
    "consequently": "so",
    "accordingly": "so",
    "it is worth noting": "worth noting",
    "it goes without saying": "obviously",
    " needless to say": "obviously"
  };

  var casualPhrases = {
    "I would like to": "I want to",
    "I would like": "I want",
    "I was wondering": "I'm wondering",
    "could you please": "can you",
    "would you mind": "can you",
    "I believe that": "I think",
    "I think that": "I think",
    "in my opinion": "I think",
    "it appears that": "it seems",
    "it seems like": "it seems",
    "is currently": "is now",
    "was previously": "was before",
    "will be able to": "can",
    "has been able to": "has been able to"
  };

  var formalToCasual = {
    "therefore": "so",
    "thus": "so",
    "hence": "so",
    "albeit": "although",
    "whilst": "while",
    "amongst": "among",
    "towards": "toward",
    "regarding": "about",
    "concerning": "about",
    "pertaining to": "about",
    "sufficient": "enough",
    "sufficiently": "enough",
    "insufficient": "not enough"
  };

  function humanize() {
    var text = textInput.value;
    if (!text.trim()) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    var level = levelSelect.value;
    var result = text;

    for (var key in replacements) {
      var re = new RegExp("\\b" + key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "gi");
      result = result.replace(re, replacements[key]);
    }

    if (level === "casual") {
      for (var k in casualPhrases) {
        var re2 = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        result = result.replace(re2, casualPhrases[k]);
      }
      for (var k2 in formalToCasual) {
        var re3 = new RegExp("\\b" + k2 + "\\b", "gi");
        result = result.replace(re3, formalToCasual[k2]);
      }
    }

    result = result.replace(/\bFurthermore,\s*/gi, "");
    result = result.replace(/\bMoreover,\s*/gi, "");
    result = result.replace(/\bIn addition,\s*/gi, "Also, ");
    result = result.replace(/\bAdditionally,\s*/gi, "Also, ");

    output.textContent = result;
  }

  humanizeBtn.addEventListener("click", humanize);

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Humanized text will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
