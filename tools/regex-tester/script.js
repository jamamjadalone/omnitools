(function () {
  "use strict";
  const patternInput = document.getElementById("regexPattern");
  const flagsInput = document.getElementById("regexFlags");
  const testArea = document.getElementById("testString");
  const highlightOutput = document.getElementById("highlightOutput");
  const groupOutput = document.getElementById("groupOutput");
  const matchInfo = document.getElementById("matchInfo");
  const matchCount = document.getElementById("matchCount");
  const errorBox = document.getElementById("regexError");

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function testRegex() {
    errorBox.style.display = "none";
    groupOutput.style.display = "none";
    matchInfo.style.display = "none";

    const pattern = patternInput.value;
    const flags = flagsInput.value;
    const text = testArea.value;

    if (!pattern) {
      highlightOutput.innerHTML = escapeHtml(text) || "Matches will be highlighted here.";
      return;
    }

    let regex;
    try {
      regex = new RegExp(pattern, flags);
    } catch (e) {
      errorBox.textContent = "Invalid regex: " + e.message;
      errorBox.style.display = "flex";
      highlightOutput.textContent = "";
      return;
    }

    if (!text) {
      highlightOutput.innerHTML = "Matches will be highlighted here.";
      return;
    }

    const matches = [];
    let match;
    if (flags.includes("g")) {
      while ((match = regex.exec(text)) !== null) {
        matches.push({ index: match.index, length: match[0].length, groups: match.slice() });
        if (match[0].length === 0) regex.lastIndex++;
      }
    } else {
      match = regex.exec(text);
      if (match) {
        matches.push({ index: match.index, length: match[0].length, groups: match.slice() });
      }
    }

    matchInfo.style.display = "block";
    matchCount.textContent = matches.length;

    if (matches.length === 0) {
      highlightOutput.innerHTML = escapeHtml(text);
      return;
    }

    let html = "";
    let lastIndex = 0;
    matches.forEach((m, i) => {
      html += escapeHtml(text.slice(lastIndex, m.index));
      html += '<span class="regex-match">' + escapeHtml(text.slice(m.index, m.index + m.length)) + '</span>';
      lastIndex = m.index + m.length;
    });
    html += escapeHtml(text.slice(lastIndex));
    highlightOutput.innerHTML = html;

    let groupsHtml = "";
    matches.forEach((m, i) => {
      groupsHtml += '<div class="group-entry"><strong>Match ' + (i + 1) + ':</strong> "' + escapeHtml(m.groups[0]) + '"';
      if (m.groups.length > 1) {
        groupsHtml += '<div class="group-list">';
        for (let g = 1; g < m.groups.length; g++) {
          groupsHtml += '<div class="group-item">Group ' + g + ': ' + (m.groups[g] !== undefined ? '"' + escapeHtml(m.groups[g]) + '"' : '<em>undefined</em>') + '</div>';
        }
        groupsHtml += '</div>';
      }
      groupsHtml += '</div>';
    });
    groupOutput.innerHTML = groupsHtml;
    groupOutput.style.display = "block";
  }

  patternInput.addEventListener("input", testRegex);
  flagsInput.addEventListener("input", testRegex);
  testArea.addEventListener("input", testRegex);
  testRegex();
})();
