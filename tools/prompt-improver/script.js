(function () {
  "use strict";
  var promptInput = document.getElementById("promptInput");
  var goalSelect = document.getElementById("goalSelect");
  var improveBtn = document.getElementById("improveBtn");
  var output = document.getElementById("promptOutput");
  var copyBtn = document.getElementById("copyBtn");

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function addPeriod(s) {
    s = s.trim();
    if (s && ".!?:;".indexOf(s.charAt(s.length - 1)) === -1) s += ".";
    return s;
  }

  function improveClarity(text) {
    var sentences = text.replace(/\n+/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean);
    var improved = sentences.map(function (s) {
      s = s.trim();
      s = s.replace(/\bvery\s+/gi, "");
      s = s.replace(/\breally\s+/gi, "");
      s = s.replace(/\bjust\s+/gi, "");
      s = s.replace(/\bbasically\s+/gi, "");
      s = s.replace(/\bliterally\s+/gi, "");
      s = s.replace(/\bkind of\s+/gi, "");
      s = s.replace(/\bsort of\s+/gi, "");
      return addPeriod(capitalize(s));
    });
    return improved.join(" ");
  }

  function addDetail(text) {
    var core = text.trim();
    var additions = [];
    var lower = core.toLowerCase();

    if (lower.indexOf("write") !== -1 || lower.indexOf("create") !== -1 || lower.indexOf("generate") !== -1) {
      additions.push("Include specific details about the target audience and desired tone.");
    }
    if (lower.indexOf("explain") !== -1 || lower.indexOf("describe") !== -1 || lower.indexOf("tell") !== -1) {
      additions.push("Provide examples or use cases to illustrate the explanation.");
    }
    if (lower.indexOf("code") !== -1 || lower.indexOf("program") !== -1 || lower.indexOf("function") !== -1) {
      additions.push("Specify the programming language, include error handling, and add comments for complex logic.");
    }
    if (lower.indexOf("email") !== -1 || lower.indexOf("letter") !== -1 || lower.indexOf("message") !== -1) {
      additions.push("Define the sender, recipient, and desired action or response.");
    }
    if (lower.indexOf("list") !== -1 || lower.indexOf("compare") !== -1) {
      additions.push("Specify the number of items and criteria for comparison.");
    }

    additions.push("Provide the output in a clear, structured format.");
    additions.push("Specify any constraints or requirements.");

    return core + "\n\nAdditional requirements:\n" + additions.map(function (a, i) { return (i + 1) + ". " + a; }).join("\n");
  }

  function makeStructured(text) {
    var core = text.trim();
    var sections = [];

    sections.push("## Context");
    sections.push("The following request needs a clear, structured response.\n");
    sections.push("## Task");
    sections.push(addPeriod(capitalize(core)));
    sections.push("\n## Requirements");
    sections.push("- Provide a clear and direct answer");
    sections.push("- Support the answer with reasoning or evidence");
    sections.push("- Use a structured format for readability");
    sections.push("\n## Output Format");
    sections.push("Provide the response in a well-organized format with clear headings or bullet points where appropriate.");

    return sections.join("\n");
  }

  function addPersona(text) {
    var core = text.trim();
    var lower = core.toLowerCase();
    var role = "an expert assistant";

    if (lower.indexOf("code") !== -1 || lower.indexOf("program") !== -1) role = "a senior software engineer";
    else if (lower.indexOf("write") !== -1 || lower.indexOf("story") !== -1) role = "a professional creative writer";
    else if (lower.indexOf("business") !== -1 || lower.indexOf("marketing") !== -1) role = "a business strategy consultant";
    else if (lower.indexOf("health") !== -1 || lower.indexOf("medical") !== -1) role = "a medical professional";
    else if (lower.indexOf("law") !== -1 || lower.indexOf("legal") !== -1) role = "a legal advisor";
    else if (lower.indexOf("science") !== -1 || lower.indexOf("research") !== -1) role = "a research scientist";
    else if (lower.indexOf("teach") !== -1 || lower.indexOf("learn") !== -1 || lower.indexOf("explain") !== -1) role = "an experienced educator";

    return "You are " + role + " with deep knowledge and experience in the relevant domain.\n\n" +
           "Task: " + addPeriod(capitalize(core)) + "\n\n" +
           "Instructions:\n" +
           "- Answer with authority and confidence based on your expertise\n" +
           "- Provide detailed, well-reasoned responses\n" +
           "- If unsure, acknowledge limitations honestly\n" +
           "- Use clear, accessible language";
  }

  function improve() {
    var text = promptInput.value.trim();
    if (!text) { window.OmniTools.showToast("Enter a prompt first.", "error"); return; }
    var goal = goalSelect.value;
    var result;

    if (goal === "clarity") result = improveClarity(text);
    else if (goal === "detail") result = addDetail(text);
    else if (goal === "structured") result = makeStructured(text);
    else if (goal === "persona") result = addPersona(text);
    else result = text;

    output.textContent = result;
  }

  improveBtn.addEventListener("click", improve);

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Improved prompt will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
