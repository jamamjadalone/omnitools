(function () {
  "use strict";

  const topicInput = document.getElementById("topicInput");
  const countRange = document.getElementById("countRange");
  const countValue = document.getElementById("countValue");
  const camelCheck = document.getElementById("camelCheck");
  const generateBtn = document.getElementById("generateBtn");
  const outputBox = document.getElementById("outputBox");
  const copyBtn = document.getElementById("copyBtn");

  const DICT = {
    food: ["food", "foodie", "cooking", "recipes", "homemade", "instafood", "delicious", "yum", "healthy", "tasty", "cuisine", "foodstagram"],
    travel: ["travel", "travelgram", "wanderlust", "adventure", "explore", "vacation", "holiday", "trip", "passportready", "worldtraveler", "travelphotography", "destination"],
    coffee: ["coffee", "coffeelover", "coffeetime", "cafe", "latte", "espresso", "coffeeaddict", "coffeegram", "barista", "caffeine", "brew", "morningcoffee"],
    fitness: ["fitness", "workout", "gym", "training", "health", "wellness", "fitlife", "exercise", "strength", "motivation", "fitfam", "nutrition"],
    fashion: ["fashion", "style", "ootd", "outfit", "fashionista", "streetwear", "trendy", "styleinspo", "clothing", "vintage", "wardrobe", "accessories"],
    nature: ["nature", "naturephotography", "outdoors", "landscape", "wildlife", "earth", "scenery", "green", "mountain", "forest", "sunset", "adventure"],
    tech: ["tech", "technology", "gadgets", "innovation", "coding", "developer", "software", "ai", "programming", "startup", "future", "digital"],
    work: ["work", "career", "business", "productivity", "office", "success", "motivation", "entrepreneur", "goals", "leadership", "teamwork", "hustle"],
    family: ["family", "familytime", "home", "love", "kids", "parenting", "together", "momlife", "dadlife", "qualitytime", "memories", "grateful"],
    home: ["home", "homestyle", "interiors", "decor", "homedecor", "cozy", "house", "diy", "organization", "renovation", "livingroom", "minimal"],
    business: ["business", "entrepreneur", "marketing", "startup", "success", "branding", "finance", "growth", "strategy", "innovation", "ceo", "money"],
    art: ["art", "artist", "creative", "drawing", "painting", "design", "illustration", "craft", "handmade", "digitalart", "artwork", "inspiration"],
    music: ["music", "musician", "songwriter", "live", "concert", "guitar", "melody", "studio", "artist", "band", "playlist", "sound"],
    lifestyle: ["lifestyle", "daily", "inspiration", "positivevibes", "wellness", "selfcare", "mindset", "habits", "balance", "joy", "gratitude", "motivation"],
    beauty: ["beauty", "skincare", "makeup", "glow", "selfcare", "cosmetics", "beautytips", "hair", "fashionbeauty", "radiant", "grooming", "naturalbeauty"],
    photography: ["photography", "photographer", "photos", "camera", "shoot", "capture", "instagood", "photooftheday", "visual", "frames", "moment", "click"],
  };

  const GENERAL = ["instagood", "photooftheday", "viral", "trending", "mustsee", "featured", "love", "amazing", "instadaily", "explore", "follow", "share", "creative", "happy", "goodvibes", "newpost", "instamood", "cool", "awesome", "bestoftheday", "instatag", "picoftheday", "dailypost"];

  const KEYS = Object.keys(DICT);
  const STOP = ["a", "an", "the", "of", "to", "in", "on", "and", "or", "for", "with", "at", "by", "from", "is", "are", "was", "be", "my", "your", "our", "this", "that", "these", "those", "how", "what", "why", "when", "where"];

  function wordsOf(topic) {
    return topic.toLowerCase().split(/[^a-z0-9']+/).filter(function (w) {
      return w.length > 1 && STOP.indexOf(w) === -1;
    });
  }

  function camelize(tag) {
    if (!camelCheck.checked) return tag;
    const parts = tag.replace(/^#/, "").split(/(?=[A-Z])|[\s_-]+/);
    let out = "";
    parts.forEach(function (p) {
      out += p.charAt(0).toUpperCase() + p.slice(1);
    });
    return "#" + out;
  }

  function generate() {
    const count = Math.max(3, Math.min(30, parseInt(countRange.value, 10) || 10));
    const topic = topicInput.value;
    const pool = [];
    const used = {};

    function add(tag) {
      const key = tag.toLowerCase();
      if (used[key]) return;
      used[key] = true;
      pool.push(tag);
    }

    if (topic.trim()) {
      const words = wordsOf(topic);
      words.forEach(function (w) {
        for (let i = 0; i < KEYS.length; i++) {
          const key = KEYS[i];
          if (key.indexOf(w) === 0 || w.indexOf(key) === 0) {
            DICT[key].forEach(add);
            break;
          }
        }
      });
    }

    let safety = 0;
    while (pool.length < count && safety < 30) {
      GENERAL.forEach(function (g) {
        if (pool.length < count) add(g);
      });
      safety++;
    }

    if (!topic.trim()) {
      outputBox.textContent = "Enter a topic to generate hashtags.";
      window.OmniTools.showToast("Enter a topic first.", "error");
      return;
    }

    outputBox.textContent = pool.slice(0, count).map(camelize).join(" ");
  }

  countRange.addEventListener("input", function () {
    countValue.textContent = countRange.value;
    if (topicInput.value.trim()) generate();
  });
  countRange.addEventListener("change", generate);
  generateBtn.addEventListener("click", generate);
  camelCheck.addEventListener("change", function () {
    if (outputBox.textContent.indexOf("Enter a topic") !== 0) generate();
  });

  copyBtn.addEventListener("click", function () {
    const text = outputBox.textContent;
    if (!text || text.indexOf("Enter a topic") === 0 || text.indexOf("Your hashtags") === 0) {
      window.OmniTools.showToast("Nothing to copy yet.", "error");
      return;
    }
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Hashtags copied to clipboard.", "success");
    });
  });

  countValue.textContent = countRange.value;
})();