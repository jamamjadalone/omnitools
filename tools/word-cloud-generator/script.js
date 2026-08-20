(function () {
  "use strict";
  var COMMON_WORDS = {
    "the":1,"be":1,"to":1,"of":1,"and":1,"a":1,"in":1,"that":1,"have":1,"i":1,
    "it":1,"for":1,"not":1,"on":1,"with":1,"he":1,"as":1,"you":1,"do":1,"at":1,
    "this":1,"but":1,"his":1,"by":1,"from":1,"they":1,"we":1,"say":1,"her":1,"she":1,
    "or":1,"an":1,"will":1,"my":1,"one":1,"all":1,"would":1,"there":1,"their":1,"what":1,
    "so":1,"up":1,"out":1,"if":1,"about":1,"who":1,"get":1,"which":1,"go":1,"me":1,
    "when":1,"make":1,"can":1,"like":1,"time":1,"no":1,"just":1,"him":1,"know":1,"take":1,
    "people":1,"into":1,"year":1,"your":1,"good":1,"some":1,"could":1,"them":1,"see":1,
    "other":1,"than":1,"then":1,"now":1,"look":1,"only":1,"come":1,"its":1,"over":1,
    "think":1,"also":1,"back":1,"after":1,"use":1,"two":1,"how":1,"our":1,"work":1,
    "first":1,"well":1,"way":1,"even":1,"new":1,"want":1,"because":1,"any":1,"these":1,
    "give":1,"day":1,"most":1,"us":1,"is":1,"am":1,"are":1,"was":1,"were":1,"been":1,
    "being":1,"has":1,"had":1,"did":1,"does":1,"doing":1,"done":1,"got":1,"let":1,
    "may":1,"still":1,"must":1,"very":1,"much":1,"should":1,"might":1,"never":1,"such":1,
    "too":1,"each":1,"per":1,"where":1,"while":1,"here":1,"why":1,"those":1,"need":1,
    "used":1,"through":1,"before":1,"between":1,"more":1,"own":1,"same":1,"both":1,
    "however":1,"off":1,"down":1,"many":1,"made":1,"under":1,"found":1,"put":1,"part":1
  };
  var COLORS = ["#e74c3c","#3498db","#2ecc71","#f39c12","#9b59b6","#1abc9c","#e67e22","#e84393","#00cec9","#6c5ce7","#fd79a8","#00b894","#d63031","#0984e3","#6c5ce7","#ffeaa7"];

  var input = document.getElementById("wcInput");
  var maxWords = document.getElementById("wcMaxWords");
  var maxVal = document.getElementById("wcMaxVal");
  var excludeCommon = document.getElementById("wcExcludeCommon");
  var generateBtn = document.getElementById("wcGenerateBtn");
  var cloudEl = document.getElementById("wcCloud");
  var copyBtn = document.getElementById("wcCopyBtn");

  var wordData = [];

  function countWords(text) {
    var words = text.toLowerCase().match(/[a-z']+/g);
    if (!words) return {};
    var freq = {};
    words.forEach(function (w) {
      if (w.length < 3) return;
      if (excludeCommon.checked && COMMON_WORDS[w]) return;
      freq[w] = (freq[w] || 0) + 1;
    });
    return freq;
  }

  function generate() {
    var text = input.value.trim();
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    var freq = countWords(text);
    var sorted = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; });
    var max = parseInt(maxWords.value, 10);
    sorted = sorted.slice(0, max);
    if (sorted.length === 0) { window.OmniTools.showToast("No meaningful words found.", "error"); return; }
    var maxFreq = freq[sorted[0]];
    var minFreq = freq[sorted[sorted.length - 1]];
    wordData = sorted.map(function (w) {
      return { word: w, freq: freq[w] };
    });
    cloudEl.innerHTML = "";
    sorted.forEach(function (w) {
      var f = freq[w];
      var ratio = maxFreq === minFreq ? 1 : (f - minFreq) / (maxFreq - minFreq);
      var size = Math.round(14 + ratio * 42);
      var color = COLORS[Math.floor(Math.random() * COLORS.length)];
      var span = document.createElement("span");
      span.className = "wc-word";
      span.textContent = w;
      span.style.fontSize = size + "px";
      span.style.color = color;
      span.title = w + ": " + f + " occurrences";
      cloudEl.appendChild(span);
    });
  }

  maxWords.addEventListener("input", function () { maxVal.textContent = maxWords.value; });
  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", function () {
    if (wordData.length === 0) { window.OmniTools.showToast("Generate a cloud first.", "error"); return; }
    var text = wordData.map(function (d) { return d.word + " (" + d.freq + ")"; }).join(", ");
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
})();
