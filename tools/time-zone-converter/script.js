(function () {
  "use strict";
  const fromTime = document.getElementById("fromTime");
  const fromZone = document.getElementById("fromZone");
  const toZone = document.getElementById("toZone");
  const convertBtn = document.getElementById("convertBtn");
  const output = document.getElementById("output");

  const zones = [
    "UTC",
    "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
    "America/Anchorage", "Pacific/Honolulu", "America/Toronto", "America/Vancouver",
    "America/Sao_Paulo", "America/Argentina/Buenos_Aires",
    "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Rome",
    "Europe/Madrid", "Europe/Amsterdam", "Europe/Moscow", "Europe/Istanbul",
    "Asia/Dubai", "Asia/Kolkata", "Asia/Bangkok", "Asia/Singapore",
    "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul", "Asia/Hong_Kong",
    "Australia/Sydney", "Australia/Melbourne", "Pacific/Auckland",
    "Africa/Cairo", "Africa/Johannesburg", "Africa/Nairobi"
  ];

  zones.forEach(function (z) {
    fromZone.innerHTML += '<option value="' + z + '">' + z.replace(/_/g, " ") + '</option>';
    toZone.innerHTML += '<option value="' + z + '">' + z.replace(/_/g, " ") + '</option>';
  });

  /* Set defaults */
  var now = new Date();
  fromTime.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  fromZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  toZone.value = "UTC";

  function formatInZone(date, tz) {
    try {
      var opts = { timeZone: tz, year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true };
      return new Intl.DateTimeFormat("en-US", opts).format(date);
    } catch (e) {
      return date.toLocaleString();
    }
  }

  function convert() {
    var inputDate = new Date(fromTime.value);
    if (isNaN(inputDate.getTime())) { output.textContent = "Please select a valid date and time."; return; }

    var from = fromZone.value;
    var to = toZone.value;

    /* Get the timestamp by formatting in from zone and re-parsing isn't reliable.
       Instead, compute the offset difference using Intl. */
    var fromStr = inputDate.toLocaleString("en-US", { timeZone: from });
    var toStr = inputDate.toLocaleString("en-US", { timeZone: to });
    var fromDate = new Date(fromStr);
    var toDate = new Date(toStr);
    var diff = toDate - fromDate; /* ms offset */

    var resultDate = new Date(inputDate.getTime() + diff);

    output.innerHTML =
      '<div class="tz-result">' +
      '<div class="tz-time">' + formatInZone(resultDate, to) + '</div>' +
      '<div class="tz-date">in ' + to.replace(/_/g, " ") + '</div>' +
      '<div class="tz-date" style="margin-top:8px;">Original: ' + formatInZone(inputDate, from) + ' (' + from.replace(/_/g, " ") + ')</div>' +
      '</div>';
  }

  convertBtn.addEventListener("click", convert);
  convert();
})();
