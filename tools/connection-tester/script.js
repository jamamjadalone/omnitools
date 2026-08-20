(function () {
  "use strict";
  var statusEl = document.getElementById("connStatus");
  var resultEl = document.getElementById("connResult");
  var unitEl = document.getElementById("connUnit");
  var detailsEl = document.getElementById("connDetails");
  var testBtn = document.getElementById("testBtn");

  function getNetworkInfo() {
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return null;
    return {
      effectiveType: conn.effectiveType || "Unknown",
      downlink: conn.downlink ? conn.downlink + " Mbps" : "Unknown",
      rtt: conn.rtt ? conn.rtt + " ms" : "Unknown",
      saveData: conn.saveData ? "Yes" : "No"
    };
  }

  function showNetworkInfo() {
    var info = getNetworkInfo();
    detailsEl.innerHTML = "";
    if (info) {
      var items = [
        { label: "Effective Type", value: info.effectiveType },
        { label: "Downlink", value: info.downlink },
        { label: "RTT", value: info.rtt },
        { label: "Save Data", value: info.saveData }
      ];
      items.forEach(function (item) {
        var div = document.createElement("div");
        div.className = "conn-detail-item";
        div.innerHTML = '<span class="conn-detail-label">' + item.label + ':</span><span class="conn-detail-value">' + item.value + '</span>';
        detailsEl.appendChild(div);
      });
    } else {
      detailsEl.innerHTML = '<p style="color:var(--text-dim);">Network Information API not available.</p>';
    }
  }

  showNetworkInfo();

  testBtn.addEventListener("click", function () {
    testBtn.disabled = true;
    statusEl.textContent = "Testing... downloading data...";
    resultEl.textContent = "...";
    unitEl.textContent = "";

    var testSizes = [100000, 500000, 1000000];
    var totalBytes = 0;
    var totalTime = 0;
    var completed = 0;

    testSizes.forEach(function (size) {
      var data = new Uint8Array(size);
      crypto.getRandomValues(data);
      var blob = new Blob([data]);
      var url = URL.createObjectURL(blob);
      var start = performance.now();

      var img = new Image();
      img.onload = img.onerror = function () {
        var elapsed = (performance.now() - start) / 1000;
        totalBytes += size;
        totalTime += elapsed;
        completed++;
        URL.revokeObjectURL(url);

        if (completed === testSizes.length) {
          var speedBps = totalBytes / totalTime;
          var speedMbps = (speedBps * 8) / 1000000;
          resultEl.textContent = speedMbps.toFixed(2);
          unitEl.textContent = "Mbps (estimated)";
          statusEl.textContent = "Test complete!";
          testBtn.disabled = false;
        }
      };
      img.src = url;
    });
  });
})();
