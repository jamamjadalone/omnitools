(function () {
  "use strict";
  const lengthRange = document.getElementById("lengthRange");
  const lengthValue = document.getElementById("lengthValue");
  const optUpper = document.getElementById("optUpper");
  const optLower = document.getElementById("optLower");
  const optNumbers = document.getElementById("optNumbers");
  const optSymbols = document.getElementById("optSymbols");
  const generateBtn = document.getElementById("generateBtn");
  const output = document.getElementById("passwordOutput");
  const strengthLabel = document.getElementById("strengthLabel");
  const copyBtn = document.getElementById("copyBtn");

  const SETS = {
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lower: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{}<>?/"
  };

  function secureRandomInt(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function generate() {
    let pool = "";
    if (optUpper.checked) pool += SETS.upper;
    if (optLower.checked) pool += SETS.lower;
    if (optNumbers.checked) pool += SETS.numbers;
    if (optSymbols.checked) pool += SETS.symbols;

    if (!pool) {
      window.OmniTools.showToast("Select at least one character type.", "error");
      return;
    }

    const length = parseInt(lengthRange.value, 10);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += pool[secureRandomInt(pool.length)];
    }
    output.textContent = result;

    let score = 0;
    if (optUpper.checked) score++;
    if (optLower.checked) score++;
    if (optNumbers.checked) score++;
    if (optSymbols.checked) score++;
    score += length >= 12 ? 1 : 0;
    score += length >= 20 ? 1 : 0;
    const labels = ["Weak", "Weak", "Fair", "Good", "Strong", "Very strong", "Excellent"];
    strengthLabel.textContent = labels[Math.min(score, labels.length - 1)];
  }

  lengthRange.addEventListener("input", () => {
    lengthValue.textContent = lengthRange.value;
    generate();
  });
  [optUpper, optLower, optNumbers, optSymbols].forEach((el) => el.addEventListener("change", generate));
  generateBtn.addEventListener("click", generate);

  copyBtn.addEventListener("click", () => {
    const text = output.textContent;
    if (!text || text === "—") return;
    window.OmniTools.copyText(text).then(() => window.OmniTools.showToast("Password copied.", "success"));
  });

  generate();
})();
