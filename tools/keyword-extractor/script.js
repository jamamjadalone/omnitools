(function () {
  "use strict";
  var textInput = document.getElementById("textInput");
  var numKeywords = document.getElementById("numKeywords");
  var extractBtn = document.getElementById("extractBtn");
  var results = document.getElementById("kwResults");
  var copyBtn = document.getElementById("copyBtn");
  var lastKeywords = [];

  var stopWords = new Set([
    "the","be","to","of","and","a","in","that","have","i","it","for","not","on","with",
    "he","as","you","do","at","this","but","his","by","from","they","we","say","her",
    "she","or","an","will","my","one","all","would","there","their","what","so","up",
    "out","if","about","who","get","which","go","me","when","make","can","like","time",
    "no","just","him","know","take","people","into","year","your","good","some","could",
    "them","see","other","than","then","now","look","only","come","its","over","think",
    "also","back","after","use","two","how","our","work","first","well","way","even",
    "new","want","because","any","these","give","day","most","us","is","am","are","was",
    "were","been","being","has","had","did","does","doing","done","should","may","might",
    "shall","must","need","dare","ought","used","very","much","more","most","own","same",
    "both","few","such","enough","each","every","through","during","before","between",
    "under","above","below","further","here","there","where","why","how","all","any",
    "both","each","more","most","other","some","such","than","too","very","still","just",
    "that","this","those","which","what","while","where","when","who","whom","whose",
    "why","how","many","much","few","little","often","never","always","sometimes",
    "already","yet","though","although","however","instead","otherwise","perhaps",
    "rather","quite","surely","certainly","really","actually","basically","simply",
    "literally","definitely","absolutely","totally","completely","entirely","wholly"
  ]);

  function extract() {
    var text = textInput.value.trim();
    if (!text) { window.OmniTools.showToast("Paste some text first.", "error"); return; }
    var words = text.toLowerCase().replace(/[^a-z\s'-]/g, " ").split(/\s+/).filter(function (w) {
      return w.length > 2 && !stopWords.has(w) && !/^[']|[']$/.test(w);
    });

    var freq = {};
    words.forEach(function (w) {
      w = w.replace(/^['']+|['']+$/g, "");
      if (w.length > 2) freq[w] = (freq[w] || 0) + 1;
    });

    var sorted = Object.keys(freq).sort(function (a, b) { return freq[b] - freq[a]; });
    var n = parseInt(numKeywords.value);
    lastKeywords = sorted.slice(0, n);

    var html = '<div class="kw-list">';
    lastKeywords.forEach(function (kw) {
      html += '<span class="kw-tag">' + kw + ' <span class="kw-count">×' + freq[kw] + '</span></span>';
    });
    html += "</div>";
    html += '<div class="heading-summary" style="margin-top:12px;">Total unique words: ' + Object.keys(freq).length + ' | Words analyzed: ' + words.length + '</div>';
    results.innerHTML = html;
  }

  extractBtn.addEventListener("click", extract);

  copyBtn.addEventListener("click", function () {
    if (lastKeywords.length === 0) return;
    window.OmniTools.copyText(lastKeywords.join(", ")).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
