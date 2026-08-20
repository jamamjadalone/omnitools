(function () {
  "use strict";
  var input = document.getElementById("freqInput");
  var chart = document.getElementById("freqChart");
  var modeButtons = document.querySelectorAll("[data-mode]");
  var mode = "letters";

  function count(text) {
    var map = {};
    if (mode === "letters") {
      var clean = text.toLowerCase().replace(/[^a-z]/g, "");
      for (var i = 0; i < clean.length; i++) {
        var ch = clean[i];
        map[ch] = (map[ch] || 0) + 1;
      }
    } else {
      var words = text.toLowerCase().match(/[a-z']+/g);
      if (words) {
        for (var j = 0; j < words.length; j++) {
          var w = words[j];
          map[w] = (map[w] || 0) + 1;
        }
      }
    }
    return Object.keys(map).map(function (k) { return { key: k, count: map[k] }; })
      .sort(function (a, b) { return b.count - a.count; });
  }

  function render() {
    var text = input.value;
    if (!text.trim()) {
      chart.innerHTML = '<p class="freq-empty">Enter text to see frequency analysis.</p>';
      return;
    }
    var data = count(text);
    if (data.length === 0) {
      chart.innerHTML = '<p class="freq-empty">No ' + mode + ' found.</p>';
      return;
    }
    var max = data[0].count;
    chart.innerHTML = data.map(function (d) {
      var pct = Math.round((d.count / max) * 100);
      return '<div class="freq-row">' +
        '<span class="freq-label">' + (mode === "letters" ? d.key : (d.key.length > 12 ? d.key.slice(0,12) + "…" : d.key)) + '</span>' +
        '<div class="freq-bar-wrap"><div class="freq-bar" style="width:' + pct + '%"></div></div>' +
        '<span class="freq-count">' + d.count + ' (' + Math.round((d.count / text.replace(/\s/g,"").length) * 100) + '%)</span>' +
        '</div>';
    }).join("");
  }

  modeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      modeButtons.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      mode = btn.dataset.mode;
      render();
    });
  });

  input.addEventListener("input", render);
})();
