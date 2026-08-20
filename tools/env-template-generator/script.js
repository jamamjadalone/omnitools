(function () {
  "use strict";

  const frameworkSelect = document.getElementById("frameworkSelect");
  const appNameInput = document.getElementById("appNameInput");
  const generateBtn = document.getElementById("generateBtn");
  const outputBox = document.getElementById("outputBox");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");

  const TEMPLATES = {
    node: [
      ["Application environment", ["NODE_ENV=development"]],
      ["Server port", ["PORT=3000"]],
      ["Server host", ["HOST=0.0.0.0"]],
      ["Database connection", ["DATABASE_URL=postgres://user:pass@localhost:5432/dbname"]],
      ["API base URL", ["API_URL=http://localhost:3000"]],
      ["Signing secret for sessions / JWT", ["JWT_SECRET=change_me"]],
    ],
    react: [
      ["API base URL consumed by the client", ["VITE_API_URL=http://localhost:3000"]],
      ["Public API key (client-safe)", ["VITE_API_KEY=change_me"]],
    ],
    next: [
      ["Public API base URL", ["NEXT_PUBLIC_API_URL=http://localhost:3000"]],
      ["Database connection", ["DATABASE_URL=postgres://user:pass@localhost:5432/dbname"]],
      ["NextAuth secret", ["NEXTAUTH_SECRET=change_me"]],
    ],
    django: [
      ["Django secret key (keep secret)", ["SECRET_KEY=change_me"]],
      ["Debug mode", ["DEBUG=True"]],
      ["Allowed hosts", ["ALLOWED_HOSTS=localhost,127.0.0.1"]],
      ["Database URL", ["DATABASE_URL=postgres://user:pass@localhost:5432/dbname"]],
      ["Email backend", ["EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend"]],
    ],
    flask: [
      ["Flask secret key", ["SECRET_KEY=change_me"]],
      ["Debug mode", ["FLASK_DEBUG=1"]],
      ["Database URL", ["DATABASE_URL=postgres://user:pass@localhost:5432/dbname"]],
    ],
    laravel: [
      ["App environment", ["APP_ENV=local"]],
      ["App debug", ["APP_DEBUG=true"]],
      ["Database connection", ["DB_CONNECTION=mysql"]],
      ["Database host", ["DB_HOST=127.0.0.1"]],
      ["Database name", ["DB_DATABASE=laravel"]],
      ["Database user", ["DB_USERNAME=root"]],
      ["Database password", ["DB_PASSWORD="]],
    ],
    rails: [
      ["Rails environment", ["RAILS_ENV=development"]],
      ["Database URL", ["DATABASE_URL=postgres://user:pass@localhost:5432/dbname"]],
      ["Rails secret key base", ["SECRET_KEY_BASE=change_me"]],
    ],
    flutter: [
      ["API base URL", ["API_URL=https://api.example.com"]],
      ["API key", ["API_KEY=change_me"]],
      ["Environment (dev / staging / prod)", ["ENVIRONMENT=dev"]],
    ],
    generic: [
      ["Application name", ["APP_NAME="]],
      ["Application environment", ["APP_ENV=development"]],
      ["Debug mode", ["DEBUG=false"]],
      ["Server port", ["PORT=3000"]],
      ["Database connection", ["DATABASE_URL=postgres://user:pass@localhost:5432/dbname"]],
      ["API key", ["API_KEY=change_me"]],
      ["Secret key", ["SECRET_KEY=change_me"]],
    ],
  };

  function generate() {
    const key = frameworkSelect.value;
    const appName = appNameInput.value.trim() || "my-app";
    const tpl = TEMPLATES[key] || TEMPLATES.generic;
    const lines = ["# Environment variables for " + appName, "# Copy to .env and fill in your real values", ""];

    tpl.forEach(function (group) {
      lines.push("# " + group[0]);
      group[1].forEach(function (line) {
        if (line.indexOf("APP_NAME=") === 0) line = "APP_NAME=" + appName;
        lines.push(line);
      });
      lines.push("");
    });

    outputBox.textContent = lines.join("\n");
  }

  function download() {
    const content = outputBox.textContent;
    if (!content || content.indexOf("# Environment") === -1) {
      window.OmniTools.showToast("Generate a template first.", "error");
      return;
    }
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".env";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
    window.OmniTools.showToast(".env template downloaded.", "success");
  }

  generateBtn.addEventListener("click", generate);

  copyBtn.addEventListener("click", function () {
    const content = outputBox.textContent;
    if (!content || content.indexOf("# Environment") === -1) {
      window.OmniTools.showToast("Generate a template first.", "error");
      return;
    }
    window.OmniTools.copyText(content).then(function () {
      window.OmniTools.showToast(".env template copied.", "success");
    });
  });

  downloadBtn.addEventListener("click", download);
  generate();
})();