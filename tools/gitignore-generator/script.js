(function () {
  "use strict";

  const presetChecks = document.querySelectorAll(".presetCheck");
  const generateBtn = document.getElementById("generateBtn");
  const outputBox = document.getElementById("outputBox");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const PRESETS = {
    node: ["node_modules/", "npm-debug.log*", "dist/", "coverage/", ".env", ".npmrc"],
    python: ["__pycache__/", "*.py[cod]", ".venv/", "venv/", "dist/", "*.egg-info/"],
    java: ["target/", "*.class", ".gradle/", ".idea/", "*.jar"],
    dotnet: ["bin/", "obj/", "*.user", "*.suo", "packages/"],
    php: ["vendor/", "composer.lock", ".env", "storage/*.key"],
    ruby: ["vendor/bundle/", ".bundle/", "log/*", "tmp/", "*.log"],
    go: ["bin/", "*.exe", "*.test", "coverage.out"],
    rust: ["/target", "**/*.rs.bk", "Cargo.lock"],
    macos: [".DS_Store", "._*", ".Spotlight-V100", "Icon?"],
    windows: ["Thumbs.db", "Desktop.ini", "$RECYCLE.BIN/"],
    linux: ["*.o", "core", "*.out"],
    ide: [".vscode/", ".idea/", "*.swp", "*.swo", ".project", ".settings/"],
    env: [".env", ".env.*", "!.env.example"],
  };

  const LABELS = {
    node: "Node.js",
    python: "Python",
    java: "Java",
    dotnet: ".NET / C#",
    php: "PHP",
    ruby: "Ruby / Rails",
    go: "Go",
    rust: "Rust",
    macos: "macOS",
    windows: "Windows",
    linux: "Linux",
    ide: "Editors / IDEs",
    env: "Environment / secrets",
  };

  function generate() {
    const sections = [];
    presetChecks.forEach(function (box) {
      if (box.checked) {
        const key = box.value;
        const rules = PRESETS[key] || [];
        sections.push("# ---- " + (LABELS[key] || key) + " ----\n" + rules.join("\n"));
      }
    });
    if (!sections.length) {
      outputBox.textContent = "Tick at least one preset, then generate.";
      return;
    }
    outputBox.textContent = sections.join("\n\n");
  }

  function download() {
    const content = outputBox.textContent;
    if (!content || content.indexOf("# ----") === -1) {
      window.OmniTools.showToast("Generate a .gitignore first.", "error");
      return;
    }
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".gitignore";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
    window.OmniTools.showToast(".gitignore downloaded.", "success");
  }

  presetChecks.forEach(function (box) {
    box.addEventListener("change", generate);
  });
  generateBtn.addEventListener("click", generate);

  copyBtn.addEventListener("click", function () {
    const content = outputBox.textContent;
    if (!content || content.indexOf("# ----") === -1) {
      window.OmniTools.showToast("Generate a .gitignore first.", "error");
      return;
    }
    window.OmniTools.copyText(content).then(function () {
      window.OmniTools.showToast(".gitignore copied.", "success");
    });
  });

  downloadBtn.addEventListener("click", download);
})();