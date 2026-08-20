(function () {
  "use strict";
  const input = document.getElementById("caseInput");
  const output = document.getElementById("caseOutput");
  const copyBtn = document.getElementById("copyBtn");
  const buttons = document.querySelectorAll("[data-case]");

  function words(str) {
    return str.trim().split(/[\s_-]+/).filter(Boolean);
  }

  const converters = {
    upper: (s) => s.toUpperCase(),
    lower: (s) => s.toLowerCase(),
    title: (s) => words(s).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "),
    sentence: (s) => {
      const lower = s.toLowerCase();
      return lower.replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase());
    },
    camel: (s) => {
      const w = words(s).map((x) => x.toLowerCase());
      return w.map((x, i) => (i === 0 ? x : x.charAt(0).toUpperCase() + x.slice(1))).join("");
    },
    pascal: (s) => words(s).map((x) => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join(""),
    snake: (s) => words(s).map((x) => x.toLowerCase()).join("_"),
    kebab: (s) => words(s).map((x) => x.toLowerCase()).join("-")
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.case;
      const text = input.value;
      if (!text.trim()) {
        window.OmniTools.showToast("Type some text first.", "error");
        return;
      }
      output.textContent = converters[type](text);
    });
  });

  copyBtn.addEventListener("click", () => {
    const text = output.textContent;
    if (!text || text === "Your converted text will appear here.") return;
    window.OmniTools.copyText(text).then(() => window.OmniTools.showToast("Copied to clipboard.", "success"));
  });
})();
