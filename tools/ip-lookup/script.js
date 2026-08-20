(function () {
  "use strict";
  const lookupBtn = document.getElementById("lookupBtn");
  const output = document.getElementById("ipOutput");
  const errorBox = document.getElementById("ipError");

  async function lookup() {
    errorBox.style.display = "none";
    output.textContent = "Loading...";
    try {
      const resp = await fetch("http://ip-api.com/json/?fields=query,country,regionName,city,zip,lat,lon,timezone,isp,org,as");
      if (!resp.ok) throw new Error("HTTP " + resp.status);
      const data = await resp.json();
      if (data.status === "fail") throw new Error(data.message || "Lookup failed");

      const rows = [
        ["IP Address", data.query],
        ["Country", data.country],
        ["Region", data.regionName],
        ["City", data.city],
        ["ZIP", data.zip],
        ["Latitude", data.lat],
        ["Longitude", data.lon],
        ["Timezone", data.timezone],
        ["ISP", data.isp],
        ["Organization", data.org],
        ["AS", data.as]
      ];

      let html = '<div class="ip-results">';
      rows.forEach(([label, val]) => {
        if (val) {
          html += '<div class="ip-row"><span class="ip-label">' + label + '</span><span class="ip-val">' + val + '</span></div>';
        }
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
  lookup();
})();
