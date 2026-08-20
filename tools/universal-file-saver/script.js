(function () {
  "use strict";

  const categorySelect = document.getElementById("categorySelect");
  const extSelect = document.getElementById("extSelect");
  const fileNameInput = document.getElementById("fileNameInput");
  const contentInput = document.getElementById("contentInput");
  const saveBtn = document.getElementById("saveBtn");
  const copyBtn = document.getElementById("copyBtn");
  const previewBox = document.getElementById("previewBox");

  const CATEGORIES = {
    code: {
      label: "Code",
      exts: [
        { ext: ".js", name: "JavaScript (.js)" },
        { ext: ".jsx", name: "React JSX (.jsx)" },
        { ext: ".ts", name: "TypeScript (.ts)" },
        { ext: ".py", name: "Python (.py)" },
        { ext: ".rb", name: "Ruby (.rb)" },
        { ext: ".php", name: "PHP (.php)" },
        { ext: ".java", name: "Java (.java)" },
        { ext: ".c", name: "C (.c)" },
        { ext: ".cpp", name: "C++ (.cpp)" },
        { ext: ".cs", name: "C# (.cs)" },
        { ext: ".go", name: "Go (.go)" },
        { ext: ".rs", name: "Rust (.rs)" },
        { ext: ".swift", name: "Swift (.swift)" },
        { ext: ".kt", name: "Kotlin (.kt)" },
        { ext: ".sql", name: "SQL (.sql)" },
        { ext: ".sh", name: "Shell script (.sh)" },
      ],
    },
    documents: {
      label: "Documents",
      exts: [
        { ext: ".txt", name: "Plain text (.txt)" },
        { ext: ".md", name: "Markdown (.md)" },
        { ext: ".rtf", name: "Rich text (.rtf)" },
        { ext: ".csv", name: "CSV spreadsheet (.csv)" },
        { ext: ".tsv", name: "TSV table (.tsv)" },
        { ext: ".html", name: "HTML document (.html)" },
        { ext: ".tex", name: "LaTeX (.tex)" },
      ],
    },
    data: {
      label: "Data & Config",
      exts: [
        { ext: ".json", name: "JSON (.json)" },
        { ext: ".xml", name: "XML (.xml)" },
        { ext: ".yaml", name: "YAML (.yaml)" },
        { ext: ".yml", name: "YAML alt (.yml)" },
        { ext: ".toml", name: "TOML (.toml)" },
        { ext: ".ini", name: "INI config (.ini)" },
        { ext: ".cfg", name: "Config file (.cfg)" },
        { ext: ".env", name: "Environment (.env)" },
        { ext: ".sql", name: "SQL dump (.sql)" },
        { ext: ".csv", name: "CSV data (.csv)" },
      ],
    },
    web: {
      label: "Web",
      exts: [
        { ext: ".html", name: "HTML (.html)" },
        { ext: ".css", name: "CSS (.css)" },
        { ext: ".js", name: "JavaScript (.js)" },
        { ext: ".scss", name: "SCSS (.scss)" },
        { ext: ".json", name: "JSON (.json)" },
        { ext: ".xml", name: "XML / sitemap (.xml)" },
        { ext: ".txt", name: "robots.txt style (.txt)" },
        { ext: ".webmanifest", name: "Web manifest (.webmanifest)" },
      ],
    },
    other: {
      label: "Other",
      exts: [
        { ext: "", name: "No extension" },
        { ext: ".log", name: "Log file (.log)" },
        { ext: ".bak", name: "Backup (.bak)" },
        { ext: ".conf", name: "Config (.conf)" },
        { ext: ".lst", name: "List (.lst)" },
      ],
    },
  };

  const TEMPLATES = {
    html: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>Hello, world!</h1>\n</body>\n</html>",
    readme: "# Project Name\n\nShort description of what this project does.\n\n## Features\n\n- Feature one\n- Feature two\n\n## Usage\n\n```bash\ncommand here\n```\n\n## License\n\nMIT",
    json: "{\n  \"name\": \"project-name\",\n  \"version\": \"1.0.0\",\n  \"description\": \"\",\n  \"main\": \"index.js\",\n  \"scripts\": {},\n  \"keywords\": [],\n  \"license\": \"MIT\"\n}",
    env: "# Environment variables\n# Copy to .env and fill in your values\n\nAPP_NAME=my-app\nAPP_ENV=development\nDEBUG=false\nPORT=3000\nDATABASE_URL=postgres://user:pass@localhost:5432/db\nAPI_KEY=\nSECRET_KEY=",
    css: "/* CSS reset */\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nhtml {\n  scroll-behavior: smooth;\n}\n\nbody {\n  font-family: system-ui, -apple-system, sans-serif;\n  line-height: 1.5;\n  color: #111;\n  background: #fff;\n}\n\nimg {\n  max-width: 100%;\n  display: block;\n}",
    python: "#!/usr/bin/env python3\n\"\"\"Short description of this script.\"\"\"\n\ndef main():\n    print(\"Hello, world!\")\n\nif __name__ == \"__main__\":\n    main()",
  };

  function populateExts() {
    const cat = CATEGORIES[categorySelect.value];
    extSelect.innerHTML = cat.exts
      .map((e) => '<option value="' + e.ext + '">' + e.name + "</option>")
      .join("");
  }

  function updatePreview() {
    const content = contentInput.value || " ";
    previewBox.textContent = content || "Your file content will preview here.";
  }

  function mimeFor(ext) {
    const map = {
      ".js": "application/javascript",
      ".jsx": "text/jsx",
      ".ts": "application/typescript",
      ".css": "text/css",
      ".html": "text/html",
      ".htm": "text/html",
      ".json": "application/json",
      ".xml": "application/xml",
      ".txt": "text/plain",
      ".md": "text/markdown",
      ".csv": "text/csv",
      ".yaml": "text/yaml",
      ".yml": "text/yaml",
      ".toml": "text/toml",
      ".env": "text/plain",
      ".svg": "image/svg+xml",
    };
    return map[ext.toLowerCase()] || "application/octet-stream";
  }

  function download() {
    const content = contentInput.value;
    const ext = extSelect.value;
    let name = fileNameInput.value.trim() || "my-file";
    if (!ext && name.lastIndexOf(".") > 0) {
      const dot = name.lastIndexOf(".");
      name = name.slice(0, dot);
    }
    const filename = name + ext;
    const blob = new Blob([content], { type: mimeFor(ext) + ";charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
    window.OmniTools.showToast("Saved " + filename, "success");
  }

  categorySelect.addEventListener("change", populateExts);
  contentInput.addEventListener("input", updatePreview);
  document.querySelectorAll("[data-tpl]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tpl = TEMPLATES[btn.getAttribute("data-tpl")];
      if (tpl) {
        contentInput.value = tpl;
        updatePreview();
        if (btn.getAttribute("data-tpl") === "html") {
          categorySelect.value = "web";
          populateExts();
          extSelect.value = ".html";
        } else if (btn.getAttribute("data-tpl") === "json") {
          categorySelect.value = "data";
          populateExts();
          extSelect.value = ".json";
        } else if (btn.getAttribute("data-tpl") === "env") {
          categorySelect.value = "data";
          populateExts();
          extSelect.value = ".env";
        } else if (btn.getAttribute("data-tpl") === "css") {
          categorySelect.value = "web";
          populateExts();
          extSelect.value = ".css";
        } else if (btn.getAttribute("data-tpl") === "python") {
          categorySelect.value = "code";
          populateExts();
          extSelect.value = ".py";
        } else if (btn.getAttribute("data-tpl") === "readme") {
          categorySelect.value = "documents";
          populateExts();
          extSelect.value = ".md";
        }
        window.OmniTools.showToast("Template loaded — edit and download.", "success");
      }
    });
  });

  saveBtn.addEventListener("click", download);
  copyBtn.addEventListener("click", () => {
    window.OmniTools.copyText(contentInput.value).then(() => {
      window.OmniTools.showToast("Content copied to clipboard.", "success");
    });
  });

  populateExts();
  updatePreview();
})();