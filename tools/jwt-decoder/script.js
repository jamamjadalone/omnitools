(function () {
  "use strict";
  const jwtInput = document.getElementById("jwtInput");
  const decodeBtn = document.getElementById("decodeBtn");
  const headerBox = document.getElementById("jwtHeader");
  const payloadBox = document.getElementById("jwtPayload");
  const signatureBox = document.getElementById("jwtSignature");
  const errorBox = document.getElementById("jwtError");

  const TS_FIELDS = ["iat", "exp", "nbf", "auth_time"];

  function base64UrlDecode(str) {
    str = str.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) str += "=";
    const binary = atob(str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder("utf-8").decode(bytes);
  }

  function decode() {
    errorBox.style.display = "none";
    const token = jwtInput.value.trim();
    if (!token) {
      headerBox.textContent = "Header will appear here.";
      payloadBox.textContent = "Payload will appear here.";
      signatureBox.textContent = "Signature will appear here.";
      return;
    }

    const parts = token.split(".");
    if (parts.length < 2 || parts.length > 3) {
      errorBox.textContent = "Invalid JWT format. Expected 2 or 3 dot-separated parts.";
      errorBox.style.display = "flex";
      return;
    }

    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      headerBox.textContent = JSON.stringify(header, null, 2);
    } catch (e) {
      errorBox.textContent = "Failed to decode header: " + e.message;
      errorBox.style.display = "flex";
      return;
    }

    try {
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const display = Object.assign({}, payload);
      TS_FIELDS.forEach(f => {
        if (typeof display[f] === "number") {
          display[f + " (" + new Date(display[f] * 1000).toISOString() + ")"] = display[f];
          delete display[f];
        }
      });
      payloadBox.textContent = JSON.stringify(display, null, 2);
    } catch (e) {
      errorBox.textContent = "Failed to decode payload: " + e.message;
      errorBox.style.display = "flex";
      return;
    }

    if (parts.length === 3 && parts[2]) {
      signatureBox.textContent = base64UrlDecode(parts[2]);
    } else {
      signatureBox.textContent = "(none)";
    }
  }

  decodeBtn.addEventListener("click", decode);
})();
