(function () {
  "use strict";
  var input = document.getElementById("htmlInput");
  var checkBtn = document.getElementById("checkBtn");
  var results = document.getElementById("headingResults");

  checkBtn.addEventListener("click", function () {
    var html = input.value.trim();
    if (!html) { results.innerHTML = "Paste some HTML first."; return; }
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    var headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (headings.length === 0) { results.innerHTML = "No headings found in the input."; return; }

    var counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
    var items = [];
    var prevLevel = 0;

    for (var i = 0; i < headings.length; i++) {
      var el = headings[i];
      var level = parseInt(el.tagName.charAt(1));
      var tag = el.tagName.toLowerCase();
      counts[tag]++;
      var text = el.textContent.trim().substring(0, 80) || "(empty)";
      var issue = false;
      var msg = "";

      if (level > prevLevel + 1 && prevLevel > 0) {
        issue = true;
        msg = "Skipped from H" + prevLevel + " to H" + level;
      } else if (prevLevel === 0 && level !== 1) {
        issue = true;
        msg = "First heading should be H1, found H" + level;
      }

      var indent = (level - 1) * 16;
      items.push('<div class="heading-item ' + (issue ? "issue" : "ok") + '" style="margin-left:' + indent + 'px;">' +
        '<span class="heading-level">H' + level + '</span>' +
        '<span>' + text.replace(/</g, "&lt;") + '</span>' +
        (msg ? '<span style="margin-left:auto;font-size:0.75rem;color:#e74c3c;">' + msg + '</span>' : '') +
        '</div>');
      prevLevel = level;
    }

    var summary = '<div class="heading-summary">' +
      '<strong>Found:</strong> ' + headings.length + ' headings — ' +
      'H1: ' + counts.h1 + ', H2: ' + counts.h2 + ', H3: ' + counts.h3 + ', ' +
      'H4: ' + counts.h4 + ', H5: ' + counts.h5 + ', H6: ' + counts.h6;
    if (counts.h1 === 0) summary += ' <span style="color:#e74c3c;">⚠ No H1 found</span>';
    if (counts.h1 > 1) summary += ' <span style="color:#f39c12;">⚠ Multiple H1s</span>';
    summary += '</div>';

    results.innerHTML = summary + items.join("");
  });
})();
