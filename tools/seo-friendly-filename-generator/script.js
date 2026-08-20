(function () {
  "use strict";

  const inputText = document.getElementById("inputText");
  const lowercaseCheck = document.getElementById("lowercaseCheck");
  const stripSpecialCheck = document.getElementById("stripSpecialCheck");
  const separatorSelect = document.getElementById("separatorSelect");
  const outputText = document.getElementById("outputText");
  const copyBtn = document.getElementById("copyBtn");
  const examplesBox = document.getElementById("examplesBox");

  function slugify(input, options) {
    return window.OmniToolsSlugify.slugify(input, options);
  }

  function render() {
    const input = inputText.value;
    const result = slugify(input, {
      separator: separatorSelect.value === "none" ? "" : separatorSelect.value,
      lowercase: lowercaseCheck.checked,
      stripSpecial: stripSpecialCheck.checked,
    });
    outputText.textContent = result || "Your SEO-friendly name will appear here.";
  }

  const examples = [
    "My Summer Vacation Photos 2024!.jpg",
    "Chocolate Chip Cookie Recipe (Easy) — Blog Post",
    "Été à Paris: guide complet [2025]",
    "  lots_of___weird  spaces _and- dashes  ",
    "README (FINAL) v2.0",
    "How to Grow Your Own Tomatoes",
  ];
  examplesBox.innerHTML = examples.map((ex) => {
    const clean = slugify(ex, { separator: "-", lowercase: true, stripSpecial: true });
    const cleanUnderscore = slugify(ex, { separator: "_", lowercase: true, stripSpecial: true });
    return '<div style="padding:10px 0;border-bottom:1px solid var(--border-soft);">' +
      '<div style="font-size:.8rem;color:var(--text-faint);word-break:break-all;">' + window.OmniTools.escapeHtml(ex) + "</div>" +
      '<div style="font-family:var(--font-mono);font-size:.82rem;color:var(--accent-2);word-break:break-all;">' + clean + "</div>" +
      '<div style="font-family:var(--font-mono);font-size:.78rem;color:var(--text-dim);word-break:break-all;">' + cleanUnderscore + "</div>" +
      "</div>";
  }).join("");

  inputText.addEventListener("input", render);
  lowercaseCheck.addEventListener("change", render);
  stripSpecialCheck.addEventListener("change", render);
  separatorSelect.addEventListener("change", render);

  copyBtn.addEventListener("click", () => {
    const text = outputText.textContent;
    if (!text || text.indexOf("Your SEO-friendly") === 0) {
      window.OmniTools.showToast("Nothing to copy yet.", "error");
      return;
    }
    window.OmniTools.copyText(text).then(() => {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });

  render();
})();