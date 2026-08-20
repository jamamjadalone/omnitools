(function () {
  "use strict";
  const input = document.getElementById("b64Input");
  const encodeBtn = document.getElementById("encodeBtn");
  const decodeBtn = document.getElementById("decodeBtn");
  const errorBox = document.getElementById("b64Error");
  const output = document.getElementById("b64Output");
  const copyBtn = document.getElementById("copyBtn");

  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    bytes.forEach((b) => { binary += String.fromCharCode(b); });
    return btoa(binary);
  }

  function base64ToUtf8(str) {
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  encodeBtn.addEventListener("click", () => {
    errorBox.style.display = "none";
    output.textContent = utf8ToBase64(input.value);
  });

  decodeBtn.addEventListener("click", () => {
    errorBox.style.display = "none";
    try {
      output.textContent = base64ToUtf8(input.value.trim());
    } catch (e) {
      errorBox.textContent = "That doesn't look like valid Base64.";
      errorBox.style.display = "flex";
    }
  });

  copyBtn.addEventListener("click", () => {
    const text = output.textContent;
    if (!text || text === "Your result will appear here.") return;
    window.OmniTools.copyText(text).then(() => window.OmniTools.showToast("Copied to clipboard.", "success"));
  });
})();
