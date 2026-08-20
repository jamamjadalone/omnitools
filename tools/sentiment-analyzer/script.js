(function () {
  "use strict";
  var textInput = document.getElementById("textInput");
  var analyzeBtn = document.getElementById("analyzeBtn");
  var sentLabel = document.getElementById("sentLabel");
  var sentScore = document.getElementById("sentScore");
  var sentBar = document.getElementById("sentBar");
  var sentDetails = document.getElementById("sentDetails");

  var positive = [
    "good","great","excellent","amazing","wonderful","fantastic","love","happy","awesome",
    "beautiful","brilliant","best","better","enjoy","perfect","pleased","superb","thrilled",
    "awesome","outstanding","impressive","delightful","positive","nice","like","favor",
    "success","successful","win","won","thanks","thankful","grateful","pleasant","cheerful",
    "exciting","excited","incredible","magnificent","remarkable","fabulous","terrific",
    "splendid","glorious","marvelous","adore","admire","appreciate","commend","celebrate"
  ];

  var negative = [
    "bad","terrible","horrible","awful","hate","worst","worse","ugly","sad","angry",
    "disappointed","failure","fail","failed","poor","annoying","annoyed","boring","bored",
    "dreadful","disgusting","unpleasant","nasty","pathetic","miserable","unhappy","upset",
    "wrong","problem","broken","damage","damaged","useless","waste","regret","pain",
    "suffer","suffering","loss","lost","stupid","dumb","trash","garbage","disaster",
    "frustrating","frustrated","despise","loathe","resent","complain","criticism","flaw"
  ];

  var negators = ["not","no","never","neither","nobody","nothing","nowhere","nor","hardly","barely","scarcely","don't","doesn't","didn't","won't","wouldn't","couldn't","shouldn't","isn't","aren't","wasn't","weren't","can't"];

  function analyze() {
    var text = textInput.value.trim();
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    var words = text.toLowerCase().replace(/[^a-z\s']/g, " ").split(/\s+/).filter(Boolean);
    var posFound = [];
    var negFound = [];
    var posCount = 0;
    var negCount = 0;
    var prevWasNegator = false;

    for (var i = 0; i < words.length; i++) {
      var w = words[i].replace(/[^a-z]/g, "");
      if (negators.indexOf(w) !== -1) { prevWasNegator = true; continue; }
      if (positive.indexOf(w) !== -1) {
        if (prevWasNegator) { negCount++; if (negFound.indexOf(w) === -1) negFound.push(w); }
        else { posCount++; if (posFound.indexOf(w) === -1) posFound.push(w); }
        prevWasNegator = false;
      } else if (negative.indexOf(w) !== -1) {
        if (prevWasNegator) { posCount++; if (posFound.indexOf(w) === -1) posFound.push(w); }
        else { negCount++; if (negFound.indexOf(w) === -1) negFound.push(w); }
        prevWasNegator = false;
      } else {
        prevWasNegator = false;
      }
    }

    var total = posCount + negCount || 1;
    var score = ((posCount - negCount) / total) * 100;
    var label, cls;

    if (score > 10) { label = "Positive"; cls = "positive"; }
    else if (score < -10) { label = "Negative"; cls = "negative"; }
    else { label = "Neutral"; cls = "neutral"; }

    sentLabel.textContent = label;
    sentLabel.className = "sentiment-label " + cls;
    sentScore.textContent = "Score: " + Math.round(score) + " (+" + posCount + " / -" + negCount + ")";
    sentBar.style.width = Math.round((score + 100) / 2) + "%";
    sentBar.className = "sentiment-bar " + cls;

    var detailHtml = "";
    if (posFound.length > 0) detailHtml += '<div style="color:#27ae60;">Positive: ' + posFound.join(", ") + '</div>';
    if (negFound.length > 0) detailHtml += '<div style="color:#e74c3c;">Negative: ' + negFound.join(", ") + '</div>';
    sentDetails.innerHTML = detailHtml;
  }

  analyzeBtn.addEventListener("click", analyze);
})();
