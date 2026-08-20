(function () {
  "use strict";
  var input = document.getElementById("htmlMdInput");
  var output = document.getElementById("mdOutput");
  var convertBtn = document.getElementById("convertBtn");
  var copyBtn = document.getElementById("copyBtn");

  function htmlToMd(html) {
    var md = html;
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
    md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
    md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
    md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
    md = md.replace(/<del[^>]*>(.*?)<\/del>/gi, "~~$1~~");
    md = md.replace(/<s[^>]*>(.*?)<\/s>/gi, "~~$1~~");
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
    md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, "```\n$1\n```\n\n");
    md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "```\n$1\n```\n\n");
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");
    md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, "![$1]($2)");
    md = md.replace(/<hr[^>]*\/?>/gi, "\n---\n\n");
    md = md.replace(/<br[^>]*\/?>/gi, "\n");
    md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, function (m, c) {
      return c.split("\n").map(function (l) { return "> " + l; }).join("\n") + "\n\n";
    });
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, function (m, items) {
      return items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n") + "\n";
    });
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, function (m, items) {
      var idx = 0;
      return items.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, function (match, content) {
        idx++;
        return idx + ". " + content + "\n";
      }) + "\n";
    });
    md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "$1\n\n");
    md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, "$1\n");
    md = md.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, "$1");
    md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, function (m, content) {
      var rows = [];
      var headerMatch = content.match(/<thead[^>]*>([\s\S]*?)<\/thead>/i);
      var bodyMatch = content.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
      var thead = headerMatch ? headerMatch[1] : "";
      var tbody = bodyMatch ? bodyMatch[1] : content;
      var headerCells = [];
      thead.replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi, function (m2, c) { headerCells.push(c.trim()); });
      if (headerCells.length > 0) {
        rows.push("| " + headerCells.join(" | ") + " |");
        rows.push("| " + headerCells.map(function () { return "---"; }).join(" | ") + " |");
      }
      tbody.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, function (m2, trContent) {
        var cells = [];
        trContent.replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi, function (m3, c) { cells.push(c.trim()); });
        if (cells.length > 0) rows.push("| " + cells.join(" | ") + " |");
      });
      return rows.join("\n") + "\n\n";
    });
    md = md.replace(/<!DOCTYPE[^>]*>/gi, "");
    md = md.replace(/<html[^>]*>/gi, "");
    md = md.replace(/<\/html>/gi, "");
    md = md.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, "");
    md = md.replace(/<body[^>]*>/gi, "");
    md = md.replace(/<\/body>/gi, "");
    md = md.replace(/<[^>]+>/g, "");
    md = md.replace(/&amp;/g, "&");
    md = md.replace(/&lt;/g, "<");
    md = md.replace(/&gt;/g, ">");
    md = md.replace(/&quot;/g, '"');
    md = md.replace(/&#39;/g, "'");
    md = md.replace(/&nbsp;/g, " ");
    md = md.replace(/\n{3,}/g, "\n\n");
    return md.trim();
  }

  convertBtn.addEventListener("click", function () {
    var html = input.value.trim();
    if (!html) { window.OmniTools.showToast("Enter HTML first.", "error"); return; }
    output.textContent = htmlToMd(html);
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text.indexOf("Markdown") === 0) return;
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
})();
