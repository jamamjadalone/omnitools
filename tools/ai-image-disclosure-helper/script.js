(function () {
  "use strict";

  const platformSelect = document.getElementById("platformSelect");
  const notesInput = document.getElementById("notesInput");
  const generateBtn = document.getElementById("generateBtn");
  const copyBtn = document.getElementById("copyBtn");
  const outputBox = document.getElementById("outputBox");
  const checklistBox = document.getElementById("checklistBox");

  const DISCLOSURES = {
    adobe: {
      fully: "This image was created entirely with generative AI tools and does not contain any real identifiable individuals, property or locations.",
      assisted: "This image is based on a real photograph that was edited or enhanced with AI-assisted tools. AI was used for retouching, compositing or other digital edits.",
    },
    shutterstock: {
      fully: "AI-generated content: This image was created using generative AI tools.",
      assisted: "AI-assisted content: This image was created from a real capture and enhanced or edited using AI tools.",
    },
    freepik: {
      fully: "This image was generated entirely with AI. No real people, places or objects were photographed.",
      assisted: "This image was created from a real photo and edited with AI tools.",
    },
  };

  const CHECKLISTS = {
    adobe: [
      "Tick the 'AI-generated' or 'AI-assisted' checkbox on the upload form",
      "Add the disclosure note to the image description",
      "Declare which AI tools were used when asked (e.g. Midjourney, Stable Diffusion)",
      "Confirm no real identifiable people, property or logos appear",
    ],
    shutterstock: [
      "Select the AI-generated content option during upload",
      "Include the disclosure in the description or submission notes",
      "List the AI tools used on the submission form",
      "Verify the image meets Shutterstock's AI content policy",
    ],
    freepik: [
      "Mark the image as AI-generated or AI-assisted in the upload wizard",
      "Add the disclosure note to the description",
      "Confirm the image does not include real identifiable people without consent",
    ],
  };

  function currentType() {
    const checked = document.querySelector('input[name="genType"]:checked');
    return checked ? checked.value : "fully";
  }

  function generate() {
    const platform = platformSelect.value;
    const type = currentType();
    let note = DISCLOSURES[platform][type] || "";
    const extra = notesInput.value.trim();
    if (extra) note += "\n\nAdditional notes: " + extra;

    outputBox.textContent = note;

    checklistBox.innerHTML = (CHECKLISTS[platform] || []).map((c) =>
      '<label class="checkbox-field"><input type="checkbox"> ' + window.OmniTools.escapeHtml(c) + "</label>"
    ).join("");
    window.OmniTools.showToast("Disclosure note generated.", "success");
  }

  generateBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", () => {
    if (!outputBox.textContent || outputBox.textContent.indexOf("Select options") === 0) return;
    window.OmniTools.copyText(outputBox.textContent).then(() => {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });

  document.querySelectorAll('input[name="genType"]').forEach((r) => r.addEventListener("change", generate));

  generate();
})();