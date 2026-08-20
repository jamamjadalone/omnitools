(function () {
  "use strict";
  var levelEl = document.getElementById("batteryLevel");
  var statusEl = document.getElementById("batteryStatus");
  var detailsEl = document.getElementById("batteryDetails");
  var iconEl = document.getElementById("batteryIcon");
  var refreshBtn = document.getElementById("refreshBtn");

  function formatTime(seconds) {
    if (!seconds || seconds === Infinity) return "Unknown";
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    return h + "h " + m + "m";
  }

  function updateBattery(battery) {
    var level = Math.round(battery.level * 100);
    levelEl.textContent = level + "%";

    if (level > 70) iconEl.textContent = "🔋";
    else if (level > 30) iconEl.textContent = "🪫";
    else iconEl.textContent = "🪫";

    if (battery.charging) {
      statusEl.textContent = "Charging";
      statusEl.style.color = "#2ecc71";
    } else {
      statusEl.textContent = "Not Charging";
      statusEl.style.color = "var(--text-dim)";
    }

    detailsEl.innerHTML = "";
    var items = [
      { label: "Level", value: level + "%" },
      { label: "Charging", value: battery.charging ? "Yes" : "No" },
      { label: "Charging Time", value: formatTime(battery.chargingTime) },
      { label: "Discharging Time", value: formatTime(battery.dischargingTime) }
    ];
    items.forEach(function (item) {
      var div = document.createElement("div");
      div.className = "battery-detail-item";
      div.innerHTML = '<span class="battery-detail-label">' + item.label + ':</span><span class="battery-detail-value">' + item.value + '</span>';
      detailsEl.appendChild(div);
    });
  }

  function checkBattery() {
    if (!navigator.getBattery) {
      statusEl.textContent = "Battery API not supported on this device/browser.";
      iconEl.textContent = "❓";
      return;
    }
    navigator.getBattery().then(function (battery) {
      updateBattery(battery);
      battery.addEventListener("levelchange", function () { updateBattery(battery); });
      battery.addEventListener("chargingchange", function () { updateBattery(battery); });
    });
  }

  checkBattery();
  refreshBtn.addEventListener("click", checkBattery);
})();
