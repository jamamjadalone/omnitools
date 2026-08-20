(function () {
  "use strict";
  const input = document.getElementById("emailInput");
  const extractBtn = document.getElementById("extractBtn");
  const resultEmpty = document.getElementById("resultEmpty");
  const resultBox = document.getElementById("resultBox");
  const emailCount = document.getElementById("emailCount");
  const emailOutput = document.getElementById("emailOutput");
  const copyAllBtn = document.getElementById("copyAllBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  let found = [];

  function extract() {
    const matches = input.value.match(EMAIL_RE) || [];
    found = Array.from(new Set(matches.map((m) => m.toLowerCase())));
    emailCount.textContent = found.length;
    emailOutput.textContent = found.join("\n") || "No email addresses found.";
    resultEmpty.style.display = "none";
    resultBox.style.display = "block";
  }

  extractBtn.addEventListener("click", extract);

  copyAllBtn.addEventListener("click", () => {
    if (!found.length) return;
    window.OmniTools.copyText(found.join("\n")).then(() => {
      window.OmniTools.showToast("Copied " + found.length + " email(s).", "success");
    });
  });

  downloadBtn.addEventListener("click", () => {
    if (!found.length) return;
    const blob = new Blob([found.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "emails.txt";
    a.click();
  });
})();
