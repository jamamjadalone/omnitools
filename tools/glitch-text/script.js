(function () {
  "use strict";
  var input = document.getElementById("glitchInput");
  var output = document.getElementById("glitchOutput");
  var genBtn = document.getElementById("glitchBtn");
  var copyBtn = document.getElementById("copyBtn");
  var intensityEl = document.getElementById("glitchIntensity");
  var intVal = document.getElementById("glitchIntVal");
  var modeBtns = document.querySelectorAll("[data-gmode]");
  var currentMode = "zalgo";

  var ZALGO_UP = "\u0300\u0301\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030A\u030B\u030C\u030D\u030E\u030F\u0310\u0311\u0312\u0313\u0314\u0315\u0316\u0317\u0318\u0319\u031A\u031B";
  var ZALGO_DOWN = "\u0316\u0317\u0318\u0319\u031A\u031B\u031C\u031D\u031E\u031F\u0320\u0321\u0322\u0323\u0324\u0325\u0326\u0327\u0328\u0329\u032A\u032B\u032C\u032D\u032E\u032F\u0330\u0331\u0332\u0333";

  var GLITCH_MAP = {
    "a":"ä","b":"ß","c":"ç","d":"Ð","e":"€","f":"ƒ","g":"g̊","h":"h̐","i":"ï","j":"j̈",
    "k":"k̂","l":"£","m":"m̄","n":"ñ","o":"ö","p":"p̃","q":"q̂","r":"r̊","s":"§","t":"†",
    "u":"ü","v":"v̌","w":"ẘ","x":"×","y":"ÿ","z":"z̃"
  };

  var CRAZY_MAP = {
    "a":"𝔞","b":"𝔟","c":"𝔠","d":"𝔡","e":"𝔢","f":"𝔣","g":"𝔤","h":"𝔥","i":"𝔦","j":"𝔧",
    "k":"𝔨","l":"𝔩","m":"𝔪","n":"𝔫","o":"𝔬","p":"𝔭","q":"𝔮","r":"𝔯","s":"𝔰","t":"𝔱",
    "u":"𝔲","v":"𝔳","w":"𝔴","x":"𝔵","y":"𝔶","z":"𝔷",
    "A":"𝔄","B":"𝔅","C":"ℭ","D":"𝔇","E":"𝔈","F":"𝔉","G":"𝔊","H":"ℌ","I":"ℑ","J":"𝔍",
    "K":"𝔎","L":"𝔏","M":"𝔐","N":"𝔑","O":"𝔒","P":"𝔓","Q":"𝔔","R":"ℜ","S":"𝔖","T":"𝔗",
    "U":"𝔘","V":"𝔙","W":"𝔚","X":"𝔛","Y":"𝔜","Z":"ℨ"
  };

  function pickRandom(str) {
    return str[Math.floor(Math.random() * str.length)];
  }

  function zalgo(text, intensity) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === " " || ch === "\n" || ch === "\t") { result += ch; continue; }
      result += ch;
      var upCount = Math.floor(Math.random() * intensity) + 1;
      var downCount = Math.floor(Math.random() * intensity) + 1;
      for (var j = 0; j < upCount; j++) result += pickRandom(ZALGO_UP);
      for (var k = 0; k < downCount; k++) result += pickRandom(ZALGO_DOWN);
    }
    return result;
  }

  function glitch(text, intensity) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === " " || ch === "\n") { result += ch; continue; }
      if (Math.random() * 10 < intensity) {
        var lower = ch.toLowerCase();
        result += GLITCH_MAP[lower] || ch;
      } else {
        result += ch;
      }
    }
    return result;
  }

  function crazy(text, intensity) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === " " || ch === "\n") { result += ch; continue; }
      if (Math.random() * 10 < intensity) {
        var mapped = CRAZY_MAP[ch] || CRAZY_MAP[ch.toLowerCase()];
        if (mapped) {
          result += mapped;
          var upCount = Math.floor(Math.random() * Math.ceil(intensity / 2));
          for (var j = 0; j < upCount; j++) result += pickRandom(ZALGO_UP);
        } else {
          result += ch;
        }
      } else {
        result += ch;
      }
    }
    return result;
  }

  function generate() {
    var text = input.value;
    if (!text.trim()) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    var intensity = parseInt(intensityEl.value, 10);
    if (currentMode === "zalgo") output.textContent = zalgo(text, intensity);
    else if (currentMode === "glitch") output.textContent = glitch(text, intensity);
    else output.textContent = crazy(text, intensity);
  }

  intensityEl.addEventListener("input", function () { intVal.textContent = intensityEl.value; });
  genBtn.addEventListener("click", generate);

  modeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      modeBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentMode = btn.dataset.gmode;
    });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Glitch text will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
