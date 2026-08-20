(function () {
  "use strict";
  var input = document.getElementById("aiInput");
  var checkBtn = document.getElementById("aiCheckBtn");
  var results = document.getElementById("aiResults");

  var AI_PHRASES = [
    "in conclusion","it's important to note","it's worth noting","as an AI",
    "delve into","leverage","landscape","multifaceted","holistic approach",
    "comprehensive overview","in today's digital age","it goes without saying",
    "needless to say","furthermore","moreover","additionally","consequently",
    "in this article","this guide will","let's explore","dive into",
    "game changer","unlock the power","at the end of the day","robust",
    "streamline","optimize","innovative","cutting-edge","seamless",
    "comprehensive","paramount","pivotal","synergy","paradigm shift",
    "empower","foster","navigate","embark","realm","notably",
    "plethora","myriad","tapestry","underscores","underscoring"
  ];

  function analyze(text) {
    var words = text.split(/\s+/).filter(function (w) { return w.length > 0; });
    var sentences = text.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; });
    var paragraphs = text.split(/\n\s*\n/).filter(function (p) { return p.trim().length > 0; });
    if (sentences.length < 3) { window.OmniTools.showToast("Need at least 3 sentences for analysis.", "error"); return; }

    var scores = {};

    var sentLengths = sentences.map(function (s) { return s.split(/\s+/).length; });
    var avgSentLen = sentLengths.reduce(function (a, b) { return a + b; }, 0) / sentLengths.length;
    var sentVariance = sentLengths.reduce(function (sum, len) { return sum + Math.pow(len - avgSentLen, 2); }, 0) / sentLengths.length;
    var sentCv = Math.sqrt(sentVariance) / avgSentLen;
    scores.uniformity = Math.max(0, Math.min(100, Math.round((1 - sentCv) * 150)));

    var phraseCount = 0;
    var textLower = text.toLowerCase();
    AI_PHRASES.forEach(function (phrase) {
      var idx = textLower.indexOf(phrase);
      while (idx !== -1) { phraseCount++; idx = textLower.indexOf(phrase, idx + 1); }
    });
    scores.phrases = Math.min(100, Math.round((phraseCount / Math.max(1, words.length)) * 5000));

    var unique = {};
    words.forEach(function (w) { unique[w.toLowerCase().replace(/[^a-z]/g, "")] = 1; });
    var uniqueCount = Object.keys(unique).length;
    var vocabDiversity = uniqueCount / words.length;
    scores.vocabulary = Math.round(Math.max(0, Math.min(100, (1 - vocabDiversity) * 200)));

    var contraCount = text.match(/\b(don't|can't|won't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|wouldn't|couldn't|shouldn't|I'm|you're|we're|they're|it's|he's|she's|let's|that's|what's|who's|there's|here's|I've|you've|we've|they've|I'll|you'll|we'll|they'll|he'll|she'll|I'd|you'd|we'd|they'd|he'd|she'd)\b/gi);
    var contraRate = contraCount ? contraCount.length / words.length : 0;
    scores.contractions = Math.round(contraRate > 0.03 ? Math.max(0, 100 - contraRate * 2000) : 100 - contraRate * 500);

    var paraLengths = paragraphs.map(function (p) { return p.split(/\s+/).length; });
    if (paraLengths.length > 1) {
      var avgPara = paraLengths.reduce(function (a, b) { return a + b; }, 0) / paraLengths.length;
      var paraVar = paraLengths.reduce(function (sum, l) { return sum + Math.pow(l - avgPara, 2); }, 0) / paraLengths.length;
      scores.paraUniform = Math.round(Math.max(0, Math.min(100, (1 - Math.sqrt(paraVar) / Math.max(1, avgPara)) * 150)));
    } else {
      scores.paraUniform = 50;
    }

    var overall = Math.round((scores.uniformity * 0.25 + scores.phrases * 0.3 + scores.vocabulary * 0.2 + scores.contractions * 0.15 + scores.paraUniform * 0.1));
    overall = Math.min(100, Math.max(0, overall));

    var color = overall > 70 ? "#e74c3c" : overall > 40 ? "#f39c12" : "#2ecc71";
    var label = overall > 70 ? "Likely AI-generated" : overall > 40 ? "Possibly AI-assisted" : "Likely human-written";
    var desc = overall > 70 ? "Strong indicators of AI-generated content detected." : overall > 40 ? "Some AI-like patterns detected. Could be AI-assisted writing." : "Writing patterns suggest human authorship.";

    var html = '<div class="ai-verdict" style="color:' + color + ';background:' + color + '15;">' + label + '</div>';
    html += '<div class="ai-score-bar"><div class="ai-score-fill" style="width:' + overall + '%;background:' + color + ';"></div></div>';
    html += '<div style="text-align:center;margin-bottom:16px;font-size:0.9rem;color:var(--text-dim);">' + desc + '</div>';
    html += '<div style="font-weight:600;margin-bottom:8px;">Detailed Metrics</div>';
    var metrics = [
      { label: "Sentence uniformity", value: scores.uniformity + "%" },
      { label: "AI phrase usage", value: scores.phrases + "%" },
      { label: "Vocabulary repetition", value: scores.vocabulary + "%" },
      { label: "Formal tone (no contractions)", value: scores.contractions + "%" },
      { label: "Paragraph uniformity", value: scores.paraUniform + "%" },
      { label: "Overall score", value: overall + "%" }
    ];
    metrics.forEach(function (m) {
      html += '<div class="ai-metric"><span class="ai-metric-label">' + m.label + '</span><span class="ai-metric-value">' + m.value + '</span></div>';
    });
    html += '<div style="font-size:0.75rem;color:var(--text-dim);margin-top:12px;">Word count: ' + words.length + ' | Sentences: ' + sentences.length + ' | Paragraphs: ' + paragraphs.length + '</div>';
    results.innerHTML = html;
  }

  checkBtn.addEventListener("click", function () {
    var text = input.value.trim();
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    analyze(text);
  });
})();
