(function () {
  "use strict";
  var textInput = document.getElementById("textInput");
  var analyzeBtn = document.getElementById("analyzeBtn");
  var fleschScore = document.getElementById("fleschScore");
  var readLabel = document.getElementById("readLabel");
  var gradeScore = document.getElementById("gradeScore");
  var gradeLabel = document.getElementById("gradeLabel");
  var readStats = document.getElementById("readStats");

  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    var m = word.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  }

  function addRow(key, val) {
    return '<div class="meta-row"><span class="meta-key">' + key + '</span><span class="meta-val">' + val + '</span></div>';
  }

  function analyze() {
    var text = textInput.value.trim();
    if (!text) { window.OmniTools.showToast("Paste some text first.", "error"); return; }

    var sentences = text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
    var words = text.split(/\s+/).filter(function (w) { return w.replace(/[^a-z]/gi, "").length > 0; });
    var syllables = 0;
    words.forEach(function (w) { syllables += countSyllables(w); });

    var numSentences = sentences.length || 1;
    var numWords = words.length || 1;
    var numSyllables = syllables;

    var flesch = 206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords);
    flesch = Math.max(0, Math.min(100, flesch));

    var grade = 0.39 * (numWords / numSentences) + 11.8 * (numSyllables / numWords) - 15.59;
    grade = Math.max(0, grade);

    fleschScore.textContent = Math.round(flesch);
    gradeScore.textContent = Math.round(grade * 10) / 10;

    var desc;
    if (flesch >= 90) desc = "Very Easy — 5th grade";
    else if (flesch >= 80) desc = "Easy — 6th grade";
    else if (flesch >= 70) desc = "Fairly Easy — 7th grade";
    else if (flesch >= 60) desc = "Standard — 8th–9th grade";
    else if (flesch >= 50) desc = "Fairly Difficult — 10th–12th grade";
    else if (flesch >= 30) desc = "Difficult — College level";
    else desc = "Very Confusing — Graduate level";

    readLabel.textContent = "Flesch Reading Ease — " + desc;

    var avgWordsPerSentence = (numWords / numSentences).toFixed(1);
    var avgSyllablesPerWord = (numSyllables / numWords).toFixed(2);

    readStats.innerHTML =
      addRow("Words", numWords) +
      addRow("Sentences", numSentences) +
      addRow("Syllables", numSyllables) +
      addRow("Avg words/sentence", avgWordsPerSentence) +
      addRow("Avg syllables/word", avgSyllablesPerWord);
  }

  analyzeBtn.addEventListener("click", analyze);
})();
