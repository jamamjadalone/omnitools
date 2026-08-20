(function () {
  "use strict";

  const textInput = document.getElementById("textInput");
  const charCount = document.getElementById("charCount");
  const wordCount = document.getElementById("wordCount");
  const sentenceCount = document.getElementById("sentenceCount");
  const readingTime = document.getElementById("readingTime");
  const limitBox = document.getElementById("limitBox");

  const LIMITS = [
    { name: "Instagram", limit: 2200 },
    { name: "X / Twitter", limit: 280 },
    { name: "YouTube description", limit: 5000 },
  ];

  function sentenceCountOf(text) {
    if (!text.trim()) return 0;
    const clean = text.replace(/\d+\.\d+/g, "0");
    return clean.split(/[.!?]+/).filter(function (s) { return s.trim().length > 0; }).length;
  }

  function render() {
    const text = textInput.value;
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = sentenceCountOf(text);
    const minutes = Math.ceil(words / 200);
    let readTime;
    if (words === 0) readTime = "0s";
    else if (minutes < 1) readTime = Math.ceil(words / 3.3) + "s";
    else readTime = minutes + "m";

    charCount.textContent = String(chars);
    wordCount.textContent = String(words);
    sentenceCount.textContent = String(sentences);
    readingTime.textContent = readTime;

    limitBox.innerHTML = LIMITS.map(function (item) {
      const pct = chars === 0 ? 0 : Math.min(100, Math.round((chars / item.limit) * 100));
      const left = Math.max(0, item.limit - chars);
      const ok = chars <= item.limit;
      const color = ok ? "var(--success)" : "var(--danger)";
      return '<div style="border:1px solid var(--border);border-radius:10px;padding:12px 14px;">' +
        '<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;font-size:.82rem;margin-bottom:8px;">' +
        "<span>" + item.name + "</span>" +
        '<span style="font-family:var(--font-mono);color:' + color + ';">' + chars + " / " + item.limit + " chars (" + left + " left)</span>" +
        "</div>" +
        '<div style="height:8px;border-radius:99px;background:var(--bg-elev-2);overflow:hidden;">' +
        '<div style="height:100%;width:' + pct + "%;background:" + color + ';border-radius:99px;"></div>' +
        "</div>" +
        "</div>";
    }).join("");
  }

  textInput.addEventListener("input", render);
  render();
})();