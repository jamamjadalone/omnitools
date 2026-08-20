(function () {
  "use strict";

  const projectName = document.getElementById("projectName");
  const projectDesc = document.getElementById("projectDesc");
  const githubUser = document.getElementById("githubUser");
  const licenseSelect = document.getElementById("licenseSelect");
  const badgesCheck = document.getElementById("badgesCheck");
  const installCheck = document.getElementById("installCheck");
  const generateBtn = document.getElementById("generateBtn");
  const outputBox = document.getElementById("outputBox");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const LICENSE_URLS = {
    MIT: "https://opensource.org/licenses/MIT",
    "Apache-2.0": "https://opensource.org/licenses/Apache-2.0",
    "GPL-3.0": "https://www.gnu.org/licenses/gpl-3.0",
  };

  function sluggedRepo(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  function generate() {
    const name = projectName.value.trim() || "My Project";
    const desc = projectDesc.value.trim();
    const user = githubUser.value.trim();
    const license = licenseSelect.value;
    const repo = sluggedRepo(name) || "my-project";

    const lines = ["# " + name];
    if (desc) {
      lines.push("");
      lines.push(desc);
    }
    lines.push("");

    if (badgesCheck.checked) {
      const badges = [
        "[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()",
        "[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()",
        "[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()",
      ];
      if (license !== "none" && LICENSE_URLS[license]) {
        badges.push("[![License](https://img.shields.io/badge/License-" + license.replace(/-/g, "--") + "-blue?style=for-the-badge)](" + LICENSE_URLS[license] + ")");
      }
      if (user) {
        const repoUrl = "https://github.com/" + user + "/" + repo;
        badges.push("[![GitHub](https://img.shields.io/badge/GitHub-" + user.replace(/-/g, "--") + "-181717?style=for-the-badge&logo=github&logoColor=white)](" + repoUrl + ")");
      }
      lines.push(badges.join(" "));
      lines.push("");
    }

    lines.push("## Features", "", "- Feature one", "- Feature two", "- Feature three", "");

    if (installCheck.checked) {
      lines.push("## Installation", "");
      lines.push("```bash", "# Clone the repository");
      lines.push("git clone https://github.com/" + (user || "your-username") + "/" + repo + ".git");
      lines.push("cd " + repo, "");
      lines.push("# Install dependencies", "npm install", "```", "");
      lines.push("## Usage", "");
      lines.push("```bash", "npm start", "```", "");
    }

    lines.push("## Contributing", "", "Contributions are welcome! Open an issue or submit a pull request.", "");

    if (license !== "none") {
      lines.push("## License", "", "This project is licensed under the " + license + " License.");
      if (user) {
        lines.push("See the LICENSE file for details.", "");
        lines.push("Built by [" + user + "](https://github.com/" + user + ").");
      }
    }

    outputBox.textContent = lines.join("\n").replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  function download() {
    const content = outputBox.textContent;
    if (!content || content.indexOf("# ") !== 0) {
      window.OmniTools.showToast("Generate a README first.", "error");
      return;
    }
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
    window.OmniTools.showToast("README.md downloaded.", "success");
  }

  generateBtn.addEventListener("click", generate);

  copyBtn.addEventListener("click", function () {
    const content = outputBox.textContent;
    if (!content || content.indexOf("# ") !== 0) {
      window.OmniTools.showToast("Generate a README first.", "error");
      return;
    }
    window.OmniTools.copyText(content).then(function () {
      window.OmniTools.showToast("README copied to clipboard.", "success");
    });
  });

  downloadBtn.addEventListener("click", download);
  generate();
})();