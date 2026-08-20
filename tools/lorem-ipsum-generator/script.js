(function () {
  "use strict";
  const WORDS = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore " +
    "et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo " +
    "consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint " +
    "occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum").split(" ");

  const unitSelect = document.getElementById("unitSelect");
  const countInput = document.getElementById("countInput");
  const startClassic = document.getElementById("startClassic");
  const generateBtn = document.getElementById("generateBtn");
  const output = document.getElementById("loremOutput");
  const copyBtn = document.getElementById("copyBtn");

  function pick() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function makeSentence(minWords, maxWords) {
    const len = minWords + Math.floor(Math.random() * (maxWords - minWords));
    const words = Array.from({ length: len }, pick);
    return capitalize(words.join(" ")) + ".";
  }

  function makeParagraph(sentenceCount) {
    return Array.from({ length: sentenceCount }, () => makeSentence(6, 16)).join(" ");
  }

  function generate() {
    const unit = unitSelect.value;
    const count = Math.max(1, Math.min(50, parseInt(countInput.value, 10) || 1));
    let result = "";

    if (unit === "words") {
      const words = Array.from({ length: count }, pick);
      result = capitalize(words.join(" "));
      if (startClassic.checked) result = "Lorem ipsum " + words.slice(2).join(" ");
    } else if (unit === "sentences") {
      const sentences = Array.from({ length: count }, () => makeSentence(6, 16));
      if (startClassic.checked) sentences[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
      result = sentences.join(" ");
    } else {
      const paragraphs = Array.from({ length: count }, () => makeParagraph(4 + Math.floor(Math.random() * 3)));
      if (startClassic.checked) {
        paragraphs[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + paragraphs[0];
      }
      result = paragraphs.join("\n\n");
    }
    output.textContent = result;
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => {
    const text = output.textContent;
    if (!text || text === "Your placeholder text will appear here.") return;
    window.OmniTools.copyText(text).then(() => window.OmniTools.showToast("Copied to clipboard.", "success"));
  });

  generate();
})();
