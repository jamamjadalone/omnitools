(function () {
  "use strict";

  const descriptionInput = document.getElementById("descriptionInput");
  const checkBtn = document.getElementById("checkBtn");
  const serpDesc = document.getElementById("serpDesc");
  const charCount = document.getElementById("charCount");
  const wordCount = document.getElementById("wordCount");
  const statusBadge = document.getElementById("statusBadge");
  const adviceBox = document.getElementById("adviceBox");

  function wordCountOf(text) {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  function truncate(text, max) {
    if (text.length <= max) return text;
    return text.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
  }

  function render() {
    const text = descriptionInput.value;
    const len = text.length;
    const words = wordCountOf(text);

    serpDesc.textContent = text ? truncate(text, 155) : "Your description will appear here.";

    charCount.textContent = String(len);
    wordCount.textContent = String(words);

    let status, color, alertType, advice;
    if (len === 0) {
      status = "—";
      color = "var(--text-faint)";
      alertType = "alert-warning";
      advice = "Type or paste a meta description to see how it renders in Google search results.";
    } else if (len < 70) {
      status = "Too short";
      color = "var(--warning)";
      alertType = "alert-warning";
      advice = "Under 70 characters — this may not give searchers enough context to click. Aim for 150–160 characters and include your main keyword.";
    } else if (len <= 160) {
      status = "Ideal";
      color = "var(--success)";
      alertType = "alert-success";
      advice = "Between 70 and 160 characters — great. Google typically shows the full description, so keep it under 160 to avoid truncation.";
    } else {
      status = "Too long";
      color = "var(--danger)";
      alertType = "alert-danger";
      advice = "Over 160 characters — Google truncates around 155 with an ellipsis, which can cut off your call to action. Trim it to 150–160 characters.";
    }

    statusBadge.textContent = status;
    statusBadge.style.color = color;
    adviceBox.innerHTML = '<div class="alert ' + alertType + '">' + window.OmniTools.escapeHtml(advice) + "</div>";
  }

  descriptionInput.addEventListener("input", render);
  checkBtn.addEventListener("click", render);
  render();
})();