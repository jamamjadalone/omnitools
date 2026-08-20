(function () {
  "use strict";

  const inputText = document.getElementById("inputText");
  const separatorSelect = document.getElementById("separatorSelect");
  const stripStopwords = document.getElementById("stripStopwords");
  const outputText = document.getElementById("outputText");
  const copyBtn = document.getElementById("copyBtn");
  const examplesBox = document.getElementById("examplesBox");

  const STOP_WORDS = ["a", "an", "the", "of", "to", "in", "on", "and", "or", "for", "with", "at", "by", "from", "is", "are", "was", "be"];

  function stripStopWords(input) {
    const re = new RegExp("\\b(" + STOP_WORDS.join("|") + ")\\b", "gi");
    return input.replace(re, " ");
  }

  function slugify(input, options) {
    return window.OmniToolsSlugify.slugify(input, options);
  }

  function render() {
    let input = inputText.value;
    if (stripStopwords.checked) input = stripStopWords(input);
    const result = slugify(input, {
      separator: separatorSelect.value === "none" ? "" : separatorSelect.value,
      lowercase: true,
      stripSpecial: true,
    });
    outputText.textContent = result || "Your URL slug will appear here.";
  }

  const examples = [
    "How to Grow Tomatoes in Small Spaces",
    "The Best Chocolate Chip Cookie Recipe",
    "10 Tips for a Productive Work From Home Setup",
    "A Complete Guide to On-Page SEO in 2025",
    "Top 5 Travel Destinations in Europe for Beginners",
  ];
  examplesBox.innerHTML = examples.map(function (ex) {
    const src = stripStopwords.checked ? stripStopWords(ex) : ex;
    const hyphens = slugify(src, { separator: "-", lowercase: true, stripSpecial: true });
    const underscores = slugify(src, { separator: "_", lowercase: true, stripSpecial: true });
    return '<div style="padding:10px 0;border-bottom:1px solid var(--border-soft);">' +
      '<div style="font-size:.8rem;color:var(--text-faint);word-break:break-all;">' + window.OmniTools.escapeHtml(ex) + "</div>" +
      '<div style="font-family:var(--font-mono);font-size:.82rem;color:var(--accent-2);word-break:break-all;">' + hyphens + "</div>" +
      '<div style="font-family:var(--font-mono);font-size:.78rem;color:var(--text-dim);word-break:break-all;">' + underscores + "</div>" +
      "</div>";
  }).join("");

  inputText.addEventListener("input", render);
  separatorSelect.addEventListener("change", render);
  stripStopwords.addEventListener("change", render);

  copyBtn.addEventListener("click", function () {
    const text = outputText.textContent;
    if (!text || text.indexOf("Your URL slug") === 0) {
      window.OmniTools.showToast("Nothing to copy yet.", "error");
      return;
    }
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Slug copied to clipboard.", "success");
    });
  });

  render();
})();