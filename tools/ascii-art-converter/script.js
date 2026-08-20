(function () {
  "use strict";
  var FONT = {
    "A": ["  #  "," # # ","#   #","#####","#   #","#   #"],
    "B": ["#### ","#   #","#### ","#   #","#   #","#### "],
    "C": [" ####","#    ","#    ","#    ","#    "," ####"],
    "D": ["#### ","#   #","#   #","#   #","#   #","#### "],
    "E": ["#####","#    ","#### ","#    ","#    ","#####"],
    "F": ["#####","#    ","#### ","#    ","#    ","#    "],
    "G": [" ####","#    ","#  ##","#   #","#   #"," ####"],
    "H": ["#   #","#   #","#####","#   #","#   #","#   #"],
    "I": ["#####","  #  ","  #  ","  #  ","  #  ","#####"],
    "J": ["#####","   # ","   # ","   # ","#  # "," ##  "],
    "K": ["#   #","#  # ","###  ","#  # ","#   #","#   #"],
    "L": ["#    ","#    ","#    ","#    ","#    ","#####"],
    "M": ["#   #","## ##","# # #","#   #","#   #","#   #"],
    "N": ["#   #","##  #","# # #","#  ##","#   #","#   #"],
    "O": [" ### ","#   #","#   #","#   #","#   #"," ### "],
    "P": ["#### ","#   #","#### ","#    ","#    ","#    "],
    "Q": [" ### ","#   #","#   #","# # #","#  # "," ## #"],
    "R": ["#### ","#   #","#### ","# #  ","#  # ","#   #"],
    "S": [" ####","#    "," ### ","    #","    #","#### "],
    "T": ["#####","  #  ","  #  ","  #  ","  #  ","  #  "],
    "U": ["#   #","#   #","#   #","#   #","#   #"," ### "],
    "V": ["#   #","#   #","#   #"," # # "," # # ","  #  "],
    "W": ["#   #","#   #","# # #","## ##","#   #","#   #"],
    "X": ["#   #"," # # ","  #  "," # # ","#   #","#   #"],
    "Y": ["#   #"," # # ","  #  ","  #  ","  #  ","  #  "],
    "Z": ["#####","   # ","  #  "," #   ","#    ","#####"],
    " ": ["      ","      ","      ","      ","      ","      "],
    "0": [" ### ","#   #","#  ##","# # #","##  #"," ### "],
    "1": ["  #  "," ##  ","  #  ","  #  ","  #  ","#####"],
    "2": [" ### ","#   #","   # ","  #  "," #   ","#####"],
    "3": ["#####","    #"," ### ","    #","#   #"," ### "],
    "4": ["#   #","#   #","#####","    #","    #","    #"],
    "5": ["#####","#    ","#### ","    #","#   #"," ### "],
    "6": [" ### ","#    ","#### ","#   #","#   #"," ### "],
    "7": ["#####","    #","   # ","  #  "," #   "," #   "],
    "8": [" ### ","#   #"," ### ","#   #","#   #"," ### "],
    "9": [" ### ","#   #"," ####","    #","    #"," ### "]
  };

  var SHADOW = {};
  Object.keys(FONT).forEach(function (ch) {
    SHADOW[ch] = FONT[ch].map(function (line, i) {
      return line.replace(/#/g, "\u2588").replace(/ /g, "\u00A0");
    });
  });

  var input = document.getElementById("asciiInput");
  var styleSelect = document.getElementById("asciiStyle");
  var charInput = document.getElementById("asciiChar");
  var convertBtn = document.getElementById("convertBtn");
  var output = document.getElementById("asciiOutput");
  var copyBtn = document.getElementById("copyBtn");

  function buildBanner(text, fillChar) {
    var rows = ["","","","","","","","","",""];
    var chars = text.toUpperCase().split("");
    chars.forEach(function (ch) {
      var glyph = FONT[ch] || FONT[" "];
      for (var i = 0; i < 6; i++) {
        var line = glyph[i] || "";
        rows[i] += line + "  ";
      }
      for (var j = 6; j < 10; j++) {
        rows[j] += "      " + "  ";
      }
    });
    var filled = rows.map(function (line) {
      if (fillChar !== "#") {
        return line.replace(/#/g, fillChar);
      }
      return line;
    });
    return filled.join("\n");
  }

  function buildBlock(text, fillChar) {
    var rows = ["","","","","",""];
    var chars = text.toUpperCase().split("");
    chars.forEach(function (ch) {
      var glyph = FONT[ch] || FONT[" "];
      for (var i = 0; i < 6; i++) {
        rows[i] += (glyph[i] || "      ") + "  ";
      }
    });
    if (fillChar !== "#") {
      rows = rows.map(function (line) { return line.replace(/#/g, fillChar); });
    }
    return rows.join("\n");
  }

  function buildShadow(text) {
    var rows = ["","","","","",""];
    var chars = text.toUpperCase().split("");
    chars.forEach(function (ch) {
      var glyph = FONT[ch] || FONT[" "];
      for (var i = 0; i < 6; i++) {
        var line = glyph[i] || "      ";
        line = line.replace(/#/g, "\u2588").replace(/ /g, "\u00A0");
        rows[i] += line + "\u00A0\u00A0";
      }
    });
    return rows.join("\n");
  }

  function convert() {
    var text = input.value.trim();
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    var style = styleSelect.value;
    var fill = charInput.value || "#";
    var result;
    if (style === "shadow") result = buildShadow(text);
    else if (style === "banner") result = buildBanner(text, fill);
    else result = buildBlock(text, fill);
    output.textContent = result;
  }

  convertBtn.addEventListener("click", convert);
  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text.indexOf("ASCII") === 0) return;
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
})();
