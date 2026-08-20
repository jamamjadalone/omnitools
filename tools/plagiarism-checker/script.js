(function () {
  "use strict";
  var text1 = document.getElementById("plagText1");
  var text2 = document.getElementById("plagText2");
  var checkBtn = document.getElementById("plagCheckBtn");
  var results = document.getElementById("plagResults");

  function tokenize(text) {
    return text.toLowerCase().match(/[a-z']+/g) || [];
  }

  function wordFreq(words) {
    var freq = {};
    words.forEach(function (w) { freq[w] = (freq[w] || 0) + 1; });
    return freq;
  }

  function jaccard(set1, set2) {
    var all = {};
    set1.forEach(function (w) { all[w] = 1; });
    set2.forEach(function (w) { all[w] = 1; });
    var union = Object.keys(all).length;
    var intersection = 0;
    set1.forEach(function (w) { if (set2.indexOf(w) !== -1) intersection++; });
    return union > 0 ? intersection / union : 0;
  }

  function lcsLength(a, b) {
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) { dp[i] = []; for (var j = 0; j <= n; j++) dp[i][j] = 0; }
    for (var i = 1; i <= m; i++) {
      for (var j = 1; j <= n; j++) {
        dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] + 1 : Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
    return dp[m][n];
  }

  function compare() {
    var t1 = text1.value.trim();
    var t2 = text2.value.trim();
    if (!t1 || !t2) { window.OmniTools.showToast("Enter both texts.", "error"); return; }
    if (t1.length < 20 || t2.length < 20) { window.OmniTools.showToast("Enter at least 20 characters in each.", "error"); return; }

    var words1 = tokenize(t1);
    var words2 = tokenize(t2);
    var unique1 = {};
    var unique2 = {};
    words1.forEach(function (w) { unique1[w] = 1; });
    words2.forEach(function (w) { unique2[w] = 1; });

    var shared = [];
    Object.keys(unique1).forEach(function (w) { if (unique2[w]) shared.push(w); });
    var onlyIn1 = Object.keys(unique1).filter(function (w) { return !unique2[w]; });
    var onlyIn2 = Object.keys(unique2).filter(function (w) { return !unique1[w]; });

    var jacScore = jaccard(words1, words2);
    var lcs = lcsLength(words1, words2);
    var lcsRatio = Math.max(words1.length, words2.length) > 0 ? lcs / Math.max(words1.length, words2.length) : 0;
    var sharedCount = shared.length;
    var totalUnique = Object.keys(unique1).length + Object.keys(unique2).length - sharedCount;
    var sharedPercent = totalUnique > 0 ? Math.round((sharedCount / totalUnique) * 100) : 0;
    var overallScore = Math.round((jacScore * 0.4 + lcsRatio * 0.3 + (sharedPercent / 100) * 0.3) * 100);

    var color = overallScore > 60 ? "#e74c3c" : overallScore > 30 ? "#f39c12" : "#2ecc71";
    var label = overallScore > 60 ? "High similarity" : overallScore > 30 ? "Moderate similarity" : "Low similarity";

    var html = '<div style="text-align:center;padding:12px;font-weight:700;font-size:1.2rem;color:' + color + ';">' + label + ' (' + overallScore + '%)</div>';
    html += '<div class="plag-score-bar"><div class="plag-score-fill" style="width:' + overallScore + '%;background:' + color + ';"></div></div>';
    html += '<div class="plag-metric"><span class="plag-metric-label">Jaccard similarity</span><span class="plag-metric-value">' + Math.round(jacScore * 100) + '%</span></div>';
    html += '<div class="plag-metric"><span class="plag-metric-label">LCS ratio</span><span class="plag-metric-value">' + Math.round(lcsRatio * 100) + '%</span></div>';
    html += '<div class="plag-metric"><span class="plag-metric-label">Shared unique words</span><span class="plag-metric-value">' + sharedCount + '</span></div>';
    html += '<div class="plag-metric"><span class="plag-metric-label">Text 1 unique words</span><span class="plag-metric-value">' + onlyIn1.length + '</span></div>';
    html += '<div class="plag-metric"><span class="plag-metric-label">Text 2 unique words</span><span class="plag-metric-value">' + onlyIn2.length + '</span></div>';
    html += '<div class="plag-metric"><span class="plag-metric-label">Text 1 word count</span><span class="plag-metric-value">' + words1.length + '</span></div>';
    html += '<div class="plag-metric"><span class="plag-metric-label">Text 2 word count</span><span class="plag-metric-value">' + words2.length + '</span></div>';

    html += '<div style="margin-top:16px;font-weight:600;">Shared words (top 30)</div><div class="plag-words">';
    shared.sort(function (a, b) { return (words1.includes(a) && words2.includes(a) ? 0 : 1); }).slice(0, 30).forEach(function (w) {
      html += '<span class="plag-word plag-shared">' + w + '</span>';
    });
    html += '</div>';

    results.innerHTML = html;
  }

  checkBtn.addEventListener("click", compare);
})();
