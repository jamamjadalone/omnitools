(function () {
  "use strict";
  var input = document.getElementById("morseInput");
  var output = document.getElementById("morseOutput");
  var toMorseBtn = document.getElementById("toMorseBtn");
  var toTextBtn = document.getElementById("toTextBtn");
  var copyBtn = document.getElementById("copyBtn");

  var TEXT_TO_MORSE = {
    "A":".-","B":"-...","C":"-.-.","D":"-..","E":".","F":"..-.","G":"--.","H":"....","I":"..","J":".---",
    "K":"-.-","L":".-..","M":"--","N":"-.","O":"---","P":".--.","Q":"--.-","R":".-.","S":"...","T":"-",
    "U":"..-","V":"...-","W":".--","X":"-..-","Y":"-.--","Z":"--..",
    "0":"-----","1":".----","2":"..---","3":"...--","4":"....-","5":".....",
    "6":"-....","7":"--...","8":"---..","9":"----.",
    ".":".-.-.-",",":"--..--","?":"..--..","!":"-.-.--","'":".----.",
    "/":"-..-.","(":"-.--.",")":"-.--.-","&":".-...",":":"---...",";":"-.-.-.",
    "-":"-....-","+":".-.-.","_":"..--.-","\"":".-..-.","$":"...-..-","@":".--.-."
  };

  var MORSE_TO_TEXT = {};
  Object.keys(TEXT_TO_MORSE).forEach(function (k) {
    MORSE_TO_TEXT[TEXT_TO_MORSE[k]] = k;
  });

  toMorseBtn.addEventListener("click", function () {
    var text = input.value.toUpperCase().trim();
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    var result = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === " ") { result.push("/"); }
      else if (TEXT_TO_MORSE[ch]) { result.push(TEXT_TO_MORSE[ch]); }
    }
    output.textContent = result.join(" ");
  });

  toTextBtn.addEventListener("click", function () {
    var morse = input.value.trim();
    if (!morse) { window.OmniTools.showToast("Enter Morse code first.", "error"); return; }
    var words = morse.split(" / ");
    var result = words.map(function (word) {
      return word.split(" ").map(function (code) {
        return MORSE_TO_TEXT[code] || "";
      }).join("");
    }).join(" ");
    output.textContent = result;
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Translation will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
