(function () {
  "use strict";
  var WORDS = [
    "apple","brave","creek","dusk","eagle","flame","grain","honor","ivory","jewel",
    "kneel","lemon","mango","novel","ocean","pearl","quilt","river","storm","tiger",
    "umbra","vivid","whale","xenon","yield","zebra","amber","blaze","cedar","delta",
    "ember","frost","globe","hazel","inbox","joker","karma","lunar","maple","nectar",
    "olive","prism","queen","rapid","solar","tower","ultra","vapor","woven","xenon",
    "yacht","anchor","breeze","cobalt","daffle","epoch","falcon","groove","helium","impact",
    "jungle","kettle","lively","matrix","nimble","oracle","plasma","quartz","radiant","summit",
    "thrive","uranus","vertex","waffle","zenith","atlas","bloom","canvas","desert","echo",
    "flint","galaxy","harbor","icon","joust","knack","latch","mirth","noble","orbit",
    "pixel","quest","raven","sage","trail","union","vigor","wings","youth","zone",
    "alchemy","brisk","cactus","drift","epic","fusion","glacier","haven","inlet","jade",
    "kernel","lotus","mango","nexus","opal","prism","quartz","realm","sigma","tango",
    "unity","valve","whirl","xenon","youth","zodiac","acorn","bliss","charm","dusk",
    "earth","fable","grove","honey","ivory","jasper","kayak","llama","marsh","noble",
    "ocean","petal","raven","solar","teal","umbra","vivid","willow","youth","ember"
  ];
  var SYMBOLS = "!@#$%^&*";
  var wordCount = document.getElementById("wordCount");
  var wordCountVal = document.getElementById("wordCountVal");
  var sepSelect = document.getElementById("separator");
  var capSelect = document.getElementById("capitalize");
  var addNums = document.getElementById("addNumbers");
  var addSymbol = document.getElementById("addSymbol");
  var generateBtn = document.getElementById("generateBtn");
  var output = document.getElementById("memOutput");
  var copyBtn = document.getElementById("copyBtn");

  function secureRandomInt(max) {
    var arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function pickWord() {
    return WORDS[secureRandomInt(WORDS.length)];
  }

  function capitalize(word, mode) {
    if (mode === "none") return word;
    if (mode === "all") return word.charAt(0).toUpperCase() + word.slice(1);
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function generate() {
    var count = parseInt(wordCount.value, 10);
    var sep = sepSelect.value;
    var cap = capSelect.value;
    var words = [];
    for (var i = 0; i < count; i++) {
      words.push(capitalize(pickWord(), cap));
    }
    var result = words.join(sep);
    if (addNums.checked) result += secureRandomInt(100);
    if (addSymbol.checked) result += SYMBOLS[secureRandomInt(SYMBOLS.length)];
    output.textContent = result;
  }

  wordCount.addEventListener("input", function () { wordCountVal.textContent = wordCount.value; });
  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "—") return;
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
  generate();
})();
