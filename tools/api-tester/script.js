(function () {
  "use strict";
  const methodSelect = document.getElementById("reqMethod");
  const urlInput = document.getElementById("reqUrl");
  const bodyField = document.getElementById("bodyField");
  const bodyInput = document.getElementById("reqBody");
  const headersInput = document.getElementById("reqHeaders");
  const sendBtn = document.getElementById("sendBtn");
  const errorBox = document.getElementById("apiError");
  const apiStatus = document.getElementById("apiStatus");
  const statusCode = document.getElementById("statusCode");
  const statusTime = document.getElementById("statusTime");
  const responseHeaders = document.getElementById("responseHeaders");
  const responseBody = document.getElementById("responseBody");
  const copyResp = document.getElementById("copyResp");

  methodSelect.addEventListener("change", () => {
    const show = ["POST", "PUT", "PATCH"].includes(methodSelect.value);
    bodyField.style.display = show ? "block" : "none";
  });

  function parseHeaders(str) {
    const headers = {};
    str.split("\n").forEach(line => {
      const idx = line.indexOf(":");
      if (idx > 0) {
        const key = line.slice(0, idx).trim();
        const val = line.slice(idx + 1).trim();
        if (key) headers[key] = val;
      }
    });
    return headers;
  }

  async function send() {
    errorBox.style.display = "none";
    apiStatus.style.display = "none";
    responseHeaders.textContent = "Loading...";
    responseBody.textContent = "Loading...";

    const url = urlInput.value.trim();
    if (!url) {
      errorBox.textContent = "Please enter a URL.";
      errorBox.style.display = "flex";
      return;
    }

    const opts = { method: methodSelect.value, headers: {} };
    const customHeaders = parseHeaders(headersInput.value);
    Object.assign(opts.headers, customHeaders);

    if (["POST", "PUT", "PATCH"].includes(opts.method) && bodyInput.value.trim()) {
      try {
        JSON.parse(bodyInput.value);
        opts.headers["Content-Type"] = opts.headers["Content-Type"] || "application/json";
        opts.body = bodyInput.value.trim();
      } catch (e) {
        errorBox.textContent = "Invalid JSON body: " + e.message;
        errorBox.style.display = "flex";
        responseBody.textContent = "";
        responseHeaders.textContent = "";
        return;
      }
    }

    const start = performance.now();
    try {
      const resp = await fetch(url, opts);
      const elapsed = Math.round(performance.now() - start);

      apiStatus.style.display = "flex";
      statusCode.textContent = resp.status + " " + resp.statusText;
      statusCode.className = "status-code " + (resp.ok ? "status-ok" : "status-err");
      statusTime.textContent = elapsed + " ms";

      let hdrs = "";
      resp.headers.forEach((val, key) => { hdrs += key + ": " + val + "\n"; });
      responseHeaders.textContent = hdrs || "No headers.";

      const text = await resp.text();
      try {
        responseBody.textContent = JSON.stringify(JSON.parse(text), null, 2);
      } catch (_) {
        responseBody.textContent = text;
      }
    } catch (e) {
      errorBox.textContent = "Request failed: " + e.message;
      errorBox.style.display = "flex";
      responseBody.textContent = "";
      responseHeaders.textContent = "";
    }
  }

  sendBtn.addEventListener("click", send);
  copyResp.addEventListener("click", () => {
    const text = responseBody.textContent;
    if (!text || text.startsWith("Response")) return;
    window.OmniTools.copyText(text).then(() => window.OmniTools.showToast("Copied to clipboard.", "success"));
  });
})();
