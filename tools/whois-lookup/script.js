(function () {
  "use strict";
  const domainInput = document.getElementById("domainInput");
  const lookupBtn = document.getElementById("lookupBtn");
  const output = document.getElementById("whoisOutput");
  const errorBox = document.getElementById("whoisError");

  function formatDate(d) {
    if (!d) return "N/A";
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  function calcAge(created) {
    if (!created) return "N/A";
    const start = new Date(created);
    if (isNaN(start.getTime())) return "N/A";
    const now = new Date();
    const diff = now - start;
    const days = Math.floor(diff / 86400000);
    const years = Math.floor(days / 365.25);
    const remDays = Math.floor(days - years * 365.25);
    if (years > 0) return years + " years, " + remDays + " days";
    return days + " days";
  }

  async function lookup() {
    errorBox.style.display = "none";
    const domain = domainInput.value.trim().replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");
    if (!domain) {
      errorBox.textContent = "Please enter a domain name.";
      errorBox.style.display = "flex";
      return;
    }

    output.textContent = "Loading WHOIS data...";
    try {
      const resp = await fetch("https://www.whoisxmlapi.com/whoisserver/WhoisService?domainName=" + encodeURIComponent(domain) + "&outputFormat=JSON&apiKey=at_demo");
      if (!resp.ok) throw new Error("API returned HTTP " + resp.status);
      const data = await resp.json();
      const info = data.WhoisRecord;

      if (!info) {
        throw new Error("No WHOIS record found for " + domain);
      }

      const rows = [
        ["Domain", info.domainName || domain],
        ["Registrar", info.registrarName || "N/A"],
        ["Created", formatDate(info.createdDate)],
        ["Expires", formatDate(info.expiresDate)],
        ["Updated", formatDate(info.updatedDate)],
        ["Domain Age", calcAge(info.createdDate)],
        ["Status", info.status || "N/A"],
        ["Name Servers", (info.nameServers && info.nameServers.hostNames) ? info.nameServers.hostNames.join(", ") : "N/A"]
      ];

      let html = '<div class="whois-results">';
      rows.forEach(([label, val]) => {
        html += '<div class="whois-row"><span class="whois-label">' + label + '</span><span class="whois-val">' + (val || "N/A") + '</span></div>';
      });
      html += "</div>";
      output.innerHTML = html;
    } catch (e) {
      errorBox.textContent = "Lookup failed: " + e.message;
      errorBox.style.display = "flex";
      output.textContent = "";
    }
  }

  lookupBtn.addEventListener("click", lookup);
  domainInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") lookup();
  });
})();
