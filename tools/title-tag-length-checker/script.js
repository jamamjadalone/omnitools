(function () {
  "use strict";

  const titleInput = document.getElementById("titleInput");
  const siteInput = document.getElementById("siteInput");
  const checkBtn = document.getElementById("checkBtn");
  const serpTitle = document.getElementById("serpTitle");
  const charCount = document.getElementById("charCount");
  const pixelWidth = document.getElementById("pixelWidth");
  const statusBadge = document.getElementById("statusBadge");
  const adviceBox = document.getElementById("adviceBox");

  function fullTitle() {
    const title = titleInput.value.trim();
    const site = siteInput.value.trim();
    return site ? title + " | " + site : title;
  }

  function pixelWidthOf(text) {
    let px = 0;
    for (let i = 0; i < text.length; i++) {
      const ch = text.charAt(i);
      if (ch === " ") px += 5;
      else if ("iljtfI|.,:;'\"()[]!".indexOf(ch) !== -1) px += 5;
      else if (ch === "m" || ch === "w") px += 12;
      else if (ch === "M" || ch === "W") px += 13;
      else if ("0123456789".indexOf(ch) !== -1) px += 9;
      else if (ch >= "A" && ch <= "Z") px += 10;
      else px += 8;
    }
    return px;
  }

  function render() {
    const title = fullTitle();
    const len = title.length;
    const px = pixelWidthOf(title);

    serpTitle.textContent = title || "Your page title will appear here.";
    charCount.textContent = String(len);
    pixelWidth.textContent = String(px);

    let status, color, alertType, advice;
    if (len === 0) {
      status = "—";
      color = "var(--text-faint)";
      alertType = "alert-warning";
      advice = "Type a page title to see how it renders and how close it is to the recommended 50–60 characters.";
    } else if (len < 50) {
      status = "Too short";
      color = "var(--warning)";
      alertType = "alert-warning";
      advice = "Under 50 characters — you have room to add more descriptive keywords. Aim for 50–60 characters.";
    } else if (len <= 60) {
      status = "Ideal";
      color = "var(--success)";
      alertType = "alert-success";
      advice = "In the recommended 50–60 character range. Keep your most important keywords near the start of the title.";
    } else {
      status = "Too long";
      color = "var(--danger)";
      alertType = "alert-danger";
      advice = "Over 60 characters — Google may truncate it in results. Shorten it, and note Google truncates by pixel width (~580px on desktop), so check the pixel estimate too.";
    }

    statusBadge.textContent = status;
    statusBadge.style.color = color;
    adviceBox.innerHTML = '<div class="alert ' + alertType + '">' + window.OmniTools.escapeHtml(advice) + "</div>";
  }

  titleInput.addEventListener("input", render);
  siteInput.addEventListener("input", render);
  checkBtn.addEventListener("click", render);
  render();
})();