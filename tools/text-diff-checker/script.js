(function () {
  "use strict";
  var leftIn = document.getElementById("diffLeft");
  var rightIn = document.getElementById("diffRight");
  var leftOut = document.getElementById("diffLeftOut");
  var rightOut = document.getElementById("diffRightOut");
  var diffBtn = document.getElementById("diffBtn");

  function escapeHtml(s) {
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function diff(a, b) {
    var linesA = a.split("\n");
    var linesB = b.split("\n");
    var maxLen = Math.max(linesA.length, linesB.length);
    var leftHtml = [];
    var rightHtml = [];

    for (var i = 0; i < maxLen; i++) {
      var la = i < linesA.length ? linesA[i] : undefined;
      var lb = i < linesB.length ? linesB[i] : undefined;

      if (la === undefined) {
        leftHtml.push('<span class="diff-del">— (removed)</span>');
        rightHtml.push('<span class="diff-add">' + escapeHtml(lb) + '</span>');
      } else if (lb === undefined) {
        leftHtml.push('<span class="diff-add">' + escapeHtml(la) + '</span>');
        rightHtml.push('<span class="diff-del">— (removed)</span>');
      } else if (la === lb) {
        leftHtml.push('<span class="diff-same">' + escapeHtml(la) + '</span>');
        rightHtml.push('<span class="diff-same">' + escapeHtml(lb) + '</span>');
      } else {
        leftHtml.push('<span class="diff-del">' + escapeHtml(la) + '</span>');
        rightHtml.push('<span class="diff-add">' + escapeHtml(lb) + '</span>');
      }
    }

    leftOut.innerHTML = leftHtml.join("\n");
    rightOut.innerHTML = rightHtml.join("\n");
  }

  diffBtn.addEventListener("click", function () {
    var a = leftIn.value;
    var b = rightIn.value;
    if (!a && !b) {
      window.OmniTools.showToast("Paste some text in both boxes.", "error");
      return;
    }
    diff(a, b);
  });
})();
