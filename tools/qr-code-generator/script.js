(function () {
  "use strict";
  const modeSelect = document.getElementById("qrMode");
  const textFields = document.getElementById("qrTextFields");
  const wifiFields = document.getElementById("qrWifiFields");
  const vcardFields = document.getElementById("qrVcardFields");
  const textInput = document.getElementById("qrText");
  const wifiSsid = document.getElementById("wifiSsid");
  const wifiSecurity = document.getElementById("wifiSecurity");
  const wifiPass = document.getElementById("wifiPass");
  const vcardName = document.getElementById("vcardName");
  const vcardPhone = document.getElementById("vcardPhone");
  const vcardEmail = document.getElementById("vcardEmail");
  const vcardOrg = document.getElementById("vcardOrg");
  const sizeSelect = document.getElementById("qrSize");
  const fgInput = document.getElementById("qrFg");
  const bgInput = document.getElementById("qrBg");
  const canvas = document.getElementById("qrCanvas");
  const ctx = canvas.getContext("2d");
  const downloadBtn = document.getElementById("downloadQrBtn");
  const charCount = document.getElementById("qrCharCount");

  function escapeWifi(value) {
    return value.replace(/([\\;,:"])/g, "\\$1");
  }

  function escapeVcard(value) {
    return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }

  function buildPayload() {
    const mode = modeSelect.value;
    if (mode === "wifi") {
      const ssid = wifiSsid.value.trim();
      const security = wifiSecurity.value;
      const pass = wifiPass.value;
      if (!ssid) return "";
      if (security === "nopass") {
        return "WIFI:T:nopass;S:" + escapeWifi(ssid) + ";;";
      }
      return "WIFI:T:" + security + ";S:" + escapeWifi(ssid) + ";P:" + escapeWifi(pass) + ";;";
    }
    if (mode === "vcard") {
      const name = vcardName.value.trim();
      if (!name) return "";
      let vcard = "BEGIN:VCARD\r\nVERSION:3.0\r\nFN:" + escapeVcard(name) + "\r\nN:" + escapeVcard(name) + "\r\n";
      if (vcardPhone.value.trim()) vcard += "TEL:" + escapeVcard(vcardPhone.value.trim()) + "\r\n";
      if (vcardEmail.value.trim()) vcard += "EMAIL:" + escapeVcard(vcardEmail.value.trim()) + "\r\n";
      if (vcardOrg.value.trim()) vcard += "ORG:" + escapeVcard(vcardOrg.value.trim()) + "\r\n";
      vcard += "END:VCARD";
      return vcard;
    }
    return textInput.value.trim();
  }

  function switchMode() {
    const mode = modeSelect.value;
    textFields.hidden = mode !== "text";
    wifiFields.hidden = mode !== "wifi";
    vcardFields.hidden = mode !== "vcard";
  }

  function updateCharCount() {
    const payload = buildPayload();
    const bytes = new TextEncoder().encode(payload).length;
    charCount.textContent = bytes === 0
      ? "Fill in the fields above to generate your code."
      : bytes + " / ~100 characters encoded";
    charCount.style.color = bytes > 100 ? "var(--danger, #e5484d)" : "";
  }

  function render() {
    updateCharCount();
    const text = buildPayload();
    const size = parseInt(sizeSelect.value, 10);
    canvas.width = size;
    canvas.height = size;
    const fg = fgInput.value || "#000000";
    const bg = bgInput.value || "#ffffff";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    if (!text) return;
    let matrix;
    try {
      matrix = window.OmniQR.generateMatrix(text);
    } catch (e) {
      window.OmniTools.showToast(e.message, "error");
      return;
    }
    const modules = matrix.length;
    const quiet = 4;
    const cell = size / (modules + quiet * 2);

    ctx.fillStyle = fg;
    for (let r = 0; r < modules; r++) {
      for (let c = 0; c < modules; c++) {
        if (matrix[r][c]) {
          ctx.fillRect((quiet + c) * cell, (quiet + r) * cell, cell + 0.5, cell + 0.5);
        }
      }
    }
  }

  let debounceTimer;
  function scheduleRender() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(render, 150);
  }

  modeSelect.addEventListener("change", () => {
    switchMode();
    render();
  });

  [
    textInput,
    wifiSsid,
    wifiSecurity,
    wifiPass,
    vcardName,
    vcardPhone,
    vcardEmail,
    vcardOrg,
    sizeSelect,
    fgInput,
    bgInput
  ].forEach((el) => {
    el.addEventListener("input", scheduleRender);
    el.addEventListener("change", scheduleRender);
  });

  downloadBtn.addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = "qr-code.png";
    a.click();
    window.OmniTools.showToast("Download started.", "success");
  });

  switchMode();
  render();
})();