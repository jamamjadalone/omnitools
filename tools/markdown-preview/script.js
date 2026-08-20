(function () {
  "use strict";
  const mdInput = document.getElementById("mdInput");
  const preview = document.getElementById("mdPreview");

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function parseMarkdown(src) {
    let html = src;
    html = html.replace(/```([\s\S]*?)```/g, function (m, code) {
      return "<pre><code>" + escapeHtml(code.trim()) + "</code></pre>";
    });
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    html = html.replace(/^\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
    html = html.replace(/^---+$/gm, "<hr>");
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/^(\d+)\. (.+)$/gm, "<li>$2</li>");
    html = html.replace(/(<li>.*<\/li>\n?)+/g, function (m) {
      return "<ul>" + m + "</ul>";
    });
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";
    html = html.replace(/<p><(h[1-3]|blockquote|pre|ul|hr)/g, "<$1");
    html = html.replace(/<\/(h[1-3]|blockquote|pre|ul|hr)><\/p>/g, "</$1>");
    html = html.replace(/<p><\/p>/g, "");
    return html;
  }

  function update() {
    preview.innerHTML = parseMarkdown(mdInput.value);
  }

  mdInput.addEventListener("input", update);
  update();
})();
