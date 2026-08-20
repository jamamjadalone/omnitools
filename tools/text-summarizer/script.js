(function () {
  "use strict";
  var input = document.getElementById("summaryInput");
  var countEl = document.getElementById("sentenceCount");
  var output = document.getElementById("summaryOutput");
  var statsEl = document.getElementById("summaryStats");
  var origWordsEl = document.getElementById("origWords");
  var summWordsEl = document.getElementById("summWords");
  var reductionEl = document.getElementById("reduction");
  var summarizeBtn = document.getElementById("summarizeBtn");
  var copyBtn = document.getElementById("copyBtn");

  var STOP_WORDS = new Set(["a","an","the","and","or","but","in","on","at","to","for","of","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","that","this","these","those","it","its","he","she","they","we","you","i","me","my","your","his","her","our","their","not","no","nor","so","if","then","than","too","very","just","about","also","as","into","through","during","before","after","above","below","between","out","off","over","under","again","further","once","here","there","when","where","why","how","all","each","every","both","few","more","most","other","some","such","only","own","same"]);

  function splitSentences(text) {
    var clean = text.replace(/\d+\.\d+/g, "0");
    return clean.split(/(?<=[.!?])\s+/).filter(function (s) { return s.trim().length > 10; });
  }

  function scoreSentences(sentences) {
    var wordFreq = {};
    var totalWords = 0;
    sentences.forEach(function (s) {
      var words = s.toLowerCase().match(/[a-z']+/g) || [];
      words.forEach(function (w) {
        if (!STOP_WORDS.has(w) && w.length > 2) {
          wordFreq[w] = (wordFreq[w] || 0) + 1;
          totalWords++;
        }
      });
    });

    Object.keys(wordFreq).forEach(function (w) {
      wordFreq[w] = wordFreq[w] / totalWords;
    });

    return sentences.map(function (s, idx) {
      var words = s.toLowerCase().match(/[a-z']+/g) || [];
      var score = 0;
      words.forEach(function (w) { score += (wordFreq[w] || 0); });
      score = score / Math.max(words.length, 1);
      if (idx < 2) score *= 1.3;
      if (idx === 0) score *= 1.2;
      return { text: s.trim(), score: score, idx: idx };
    });
  }

  function summarize() {
    var text = input.value.trim();
    if (!text) { window.OmniTools.showToast("Paste some text first.", "error"); return; }
    var count = parseInt(countEl.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 20) count = 20;

    var sentences = splitSentences(text);
    if (sentences.length === 0) {
      output.textContent = "Could not extract sentences from the text.";
      return;
    }

    var scored = scoreSentences(sentences);
    scored.sort(function (a, b) { return b.score - a.score; });
    var top = scored.slice(0, count);
    top.sort(function (a, b) { return a.idx - b.idx; });

    var summaryText = top.map(function (s) { return s.text; }).join(" ");
    output.textContent = summaryText;

    var origWords = text.trim().split(/\s+/).length;
    var summWords = summaryText.split(/\s+/).length;
    var pct = Math.round((1 - summWords / origWords) * 100);
    origWordsEl.textContent = String(origWords);
    summWordsEl.textContent = String(summWords);
    reductionEl.textContent = pct + "%";
    statsEl.style.display = "";
  }

  summarizeBtn.addEventListener("click", summarize);

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Summary will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
