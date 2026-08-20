(function () {
  "use strict";
  const fields = {
    min: document.getElementById("cronMin"),
    hour: document.getElementById("cronHour"),
    day: document.getElementById("cronDay"),
    month: document.getElementById("cronMonth"),
    dow: document.getElementById("cronDow")
  };
  const display = document.getElementById("cronDisplay");
  const desc = document.getElementById("cronDescription");
  const errorBox = document.getElementById("cronError");
  const copyBtn = document.getElementById("copyCron");

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function describeCron(vals) {
    const [min, hour, day, month, dow] = vals;
    let parts = [];

    if (min === "*" && hour === "*") parts.push("every minute");
    else if (min === "*" && hour !== "*") parts.push("every minute past hour " + hour);
    else if (min !== "*" && hour === "*") parts.push("at minute " + min + " past every hour");
    else parts.push("at " + hour.padStart(2, "0") + ":" + min.padStart(2, "0"));

    if (day !== "*" && dow === "*") parts.push("on day " + day + " of the month");
    else if (day === "*" && dow !== "*") {
      const dayNames = dow.split(",").map(d => {
        const n = parseInt(d);
        return isNaN(n) ? d : DAYS[n] || d;
      });
      parts.push("on " + dayNames.join(", "));
    } else if (day !== "*" && dow !== "*") {
      parts.push("on day " + day + " and " + dow);
    }

    if (month !== "*") {
      const monthNames = month.split(",").map(m => {
        const n = parseInt(m);
        return isNaN(n) ? m : MONTHS[n] || m;
      });
      parts.push("in " + monthNames.join(", "));
    }

    return parts.join(" ");
  }

  function update() {
    errorBox.style.display = "none";
    const vals = [fields.min.value, fields.hour.value, fields.day.value, fields.month.value, fields.dow.value];
    const expr = vals.join(" ");
    display.textContent = expr;

    const isValid = vals.every(v => /^[\d\*\/\-\,]+$/.test(v));
    if (isValid) {
      desc.textContent = describeCron(vals);
    } else {
      desc.textContent = "Contains invalid characters. Use digits, *, commas, hyphens, and slashes only.";
    }
  }

  Object.values(fields).forEach(f => f.addEventListener("input", update));

  document.querySelectorAll("[data-cron]").forEach(btn => {
    btn.addEventListener("click", () => {
      const parts = btn.dataset.cron.split(" ");
      fields.min.value = parts[0] || "*";
      fields.hour.value = parts[1] || "*";
      fields.day.value = parts[2] || "*";
      fields.month.value = parts[3] || "*";
      fields.dow.value = parts[4] || "*";
      update();
    });
  });

  copyBtn.addEventListener("click", () => {
    window.OmniTools.copyText(display.textContent).then(() => window.OmniTools.showToast("Copied to clipboard.", "success"));
  });

  update();
})();
