(function () {
  "use strict";
  const plainInput = document.getElementById("plainInput");
  const encodedOutput = document.getElementById("encodedOutput");
  const encodeBtn = document.getElementById("encodeBtn");
  const decodeBtn = document.getElementById("decodeBtn");
  const copyBtn = document.getElementById("copyBtn");

  const ENCODE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  function encodeHtml(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (ENCODE_MAP[ch]) {
        result += ENCODE_MAP[ch];
      } else if (ch.charCodeAt(0) > 127) {
        result += "&#x" + ch.charCodeAt(0).toString(16) + ";";
      } else {
        result += ch;
      }
    }
    return result;
  }

  function decodeHtml(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  encodeBtn.addEventListener("click", () => {
    encodedOutput.value = encodeHtml(plainInput.value);
    window.OmniTools.showToast("Encoded.", "success");
  });

  decodeBtn.addEventListener("click", () => {
    plainInput.value = decodeHtml(encodedOutput.value);
    window.OmniTools.showToast("Decoded.", "success");
  });

  copyBtn.addEventListener("click", () => {
    if (!encodedOutput.value) return;
    window.OmniTools.copyText(encodedOutput.value).then(() => window.OmniTools.showToast("Copied to clipboard.", "success"));
  });
})();
