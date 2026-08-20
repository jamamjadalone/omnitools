(function () {
  "use strict";

  const platformSelect = document.getElementById("platformSelect");
  const descInput = document.getElementById("descInput");
  const generateBtn = document.getElementById("generateBtn");
  const titleOutput = document.getElementById("titleOutput");
  const descOutput = document.getElementById("descOutput");
  const keywordsOutput = document.getElementById("keywordsOutput");

  const KEYWORD_BANK = [
    "photo", "photograph", "picture", "image", "shot", "scene", "view",
    "background", "colorful", "vibrant", "natural", "lifestyle", "candid",
    "outdoor", "indoor", "people", "woman", "man", "child", "family", "friends",
    "travel", "city", "nature", "landscape", "sky", "water", "food", "coffee",
    "business", "office", "work", "technology", "health", "fitness", "sport",
    "home", "garden", "animal", "car", "street", "building", "sunny", "rainy",
    "moody", "warm", "cool", "soft", "sharp", "focused", "blurred", "vertical",
    "horizontal", "square", "modern", "classic", "creative", "abstract", "minimal",
  ];

  function words(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9\s-]/gi, " ").split(/\s+/).filter(Boolean);
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function unique(list) {
    const seen = {};
    return list.filter((w) => { if (seen[w]) return false; seen[w] = true; return true; });
  }

  function buildTitle(desc, platform) {
    const w = words(desc);
    const maxWords = platform === "adobe" ? 12 : platform === "shutterstock" ? 12 : 15;
    let title = w.slice(0, maxWords).join(" ");
    if (title.length < 20 && w.length > maxWords) title = w.slice(0, maxWords + 3).join(" ");
    if (!title) title = "Untitled stock photo";
    return capitalize(title);
  }

  function buildDescription(desc, platform, title) {
    let out = title + ". " + capitalize(desc.trim());
    const maxChars = platform === "adobe" ? 350 : platform === "shutterstock" ? 200 : 400;
    if (out.length > maxChars) out = out.slice(0, maxChars - 1).replace(/\s+\S*$/, "") + ".";
    return out;
  }

  function buildKeywords(desc) {
    const w = words(desc);
    const fromDesc = unique(w.filter((x) => x.length > 2 && isNaN(Number(x))));
    const bonus = KEYWORD_BANK.filter((k) => !fromDesc.includes(k));
    const combined = unique(fromDesc.concat(bonus)).slice(0, 50);
    return combined.join(", ");
  }

  function generate() {
    const desc = descInput.value.trim();
    if (!desc) {
      window.OmniTools.showToast("Describe your photo first.", "error");
      return;
    }
    const platform = platformSelect.value;
    const title = buildTitle(desc, platform);
    const description = buildDescription(desc, platform, title);
    const keywords = buildKeywords(desc);
    titleOutput.value = title;
    descOutput.value = description;
    keywordsOutput.value = keywords;
    window.OmniTools.showToast("Metadata generated — review before submitting.", "success");
  }

  generateBtn.addEventListener("click", generate);
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.getAttribute("data-copy"));
      if (!target || !target.value) return;
      window.OmniTools.copyText(target.value).then(() => {
        window.OmniTools.showToast("Copied to clipboard.", "success");
      });
    });
  });

  // Generate on Ctrl+Enter in the description box
  descInput.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate();
  });
})();