(function () {
  "use strict";
  var countEl = document.getElementById("promptCount");
  var output = document.getElementById("promptOutput");
  var genBtn = document.getElementById("promptBtn");
  var copyBtn = document.getElementById("copyBtn");
  var refreshBtn = document.getElementById("refreshBtn");
  var genreBtns = document.querySelectorAll("[data-pgenre]");
  var currentGenre = "any";

  var CHARACTERS = {
    any: ["a retired spy","a teenage hacker","a blind musician","a disgraced doctor","an aging astronaut","a child prodigy","a wheelchair-bound detective","a shapeshifting alien","a reclusive billionaire","a war veteran with amnesia","a time-traveling historian","a mute painter","a disgraced knight","a robotic companion","a cursed immortal"],
    fantasy: ["a dragon rider","an elven archer","a cursed prince","a wandering minstrel","a dark sorcerer","a forest spirit","a dwarven blacksmith","a fallen angel","a shape-shifting thief","a royal guard with a secret","a witch in hiding","a lost god","a ghost-hunting paladin","a blood mage","a talking wolf"],
    scifi: ["a clone discovering their origins","a rogue AI","a space cargo pilot","a cybernetically enhanced soldier","a dimension-hopping scientist","a gene-spliced hybrid","a consciousness uploader","a post-apocalyptic scavenger","a time-looped engineer","an alien ambassador","a robot gaining sentience","a terraforming colonist","a neural hacker","a cryo-sleeper waking up","a holographic detective"],
    horror: ["a medium who sees too much","a trapped psychiatric patient","a cult survivor","a house with a dark history","a priest losing faith","a paranormal investigator","a cursed doll maker","a sleepwalking murderer","a zombie who remembers being human","a vampire trying to reform","a ghost trapped in a mirror","a cursed bloodline heir","a demon negotiator","a haunted lighthouse keeper","a body-snatcher"],
    romance: ["two rival chefs","childhood friends reuniting","a love letter sent to the wrong person","a wedding planner who doesn't believe in marriage","pen pals who finally meet","a librarian and a rock star","two astronauts stranded together","a fake dating arrangement","a florist and a funeral director","a love story told in reverse","neighbors who only communicate through notes","a travel blogger and a local guide","a second chance at first love","a bookshop owner and a author","a chef and a food critic"],
    mystery: ["a locked-room puzzle","a detective who can't remember the case","a missing person with no records","a jewel thief leaving riddles","an unsolved murder from decades ago","a witness who saw nothing","a detective solving their own murder","a code that leads to treasure","a perfect crime with no motive","a false identity unraveling","a blackmailed politician","a stolen painting mystery","a serial letter writer","a cold case reopened","a poisoner at a dinner party"]
  };

  var SETTINGS = [
    "in a city built on clouds","aboard a sinking ocean liner","in a library that exists in all timelines","in a desert where it rains glass","on a space station orbiting a dying star","in a Victorian-era parallel universe","inside a computer simulation","in a village erased from maps","in an underwater civilization","in a forest where time moves differently","on a train that never stops","in a tower above the world","in a post-apocalyptic bunker","in a city where emotions are illegal","in a dreamscape that's bleeding into reality","in a museum after midnight","in a world where gravity is reversed","in a floating city above the clouds","in a labyrinth beneath a hospital","in a town where no one ages"
  ];

  var CONFLICTS = [
    "must stop a catastrophe before midnight","discovers a secret that changes everything","is framed for a crime they didn't commit","must choose between love and duty","finds a message from their future self","has 24 hours to save someone they love","uncovers a conspiracy that goes to the top","is haunted by someone they thought was dead","must survive a deadly game","must decide whether to reveal the truth","races against time to crack a code","realizes they can't trust anyone","must confront their darkest fear","discovers they've been lied to their whole life","must make an impossible moral choice","finds themselves hunted by former allies","must solve a puzzle before it's too late","learns their memories have been altered","must escape a situation that seems inescapable","must sacrifice something precious to save others"
  ];

  var TWISTS = [
    "but there's a twist they never saw coming","and nothing is what it seems","but the real enemy is within","leading to a revelation that shatters their world","and the truth is stranger than fiction","but the cost is higher than expected","and the answer was within them all along","but saving one means dooming another","and the line between friend and foe blurs","but the solution creates an even bigger problem","and what they find changes the meaning of everything","but they must live with the consequences","and the story they believed was a lie","but redemption comes at a terrible price","and the ending redefines the beginning","but the victory is bittersweet","and the world will never be the same","but they gain something unexpected","and the final revelation ties everything together","but at what cost to their humanity"
  ];

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generatePrompt() {
    var chars = CHARACTERS[currentGenre] || CHARACTERS.any;
    var character = pickRandom(chars);
    var setting = pickRandom(SETTINGS);
    var conflict = pickRandom(CONFLICTS);
    var twist = pickRandom(TWISTS);
    return "A story about " + character + " " + setting + ", who " + conflict + " " + twist + ".";
  }

  function generate() {
    var count = parseInt(countEl.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 20) count = 20;

    var prompts = [];
    var genreLabel = currentGenre === "any" ? "" : currentGenre;
    for (var i = 0; i < count; i++) {
      var p = generatePrompt();
      prompts.push((genreLabel ? '<div class="prompt-genre">' + genreLabel + '</div>' : '') + '<div class="prompt-item">' + p + '</div>');
    }
    output.innerHTML = prompts.join("");
  }

  genBtn.addEventListener("click", generate);
  refreshBtn.addEventListener("click", generate);

  genreBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      genreBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      currentGenre = btn.dataset.pgenre;
    });
  });

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Story prompts will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
