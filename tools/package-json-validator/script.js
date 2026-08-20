(function () {
  "use strict";

  const pkgInput = document.getElementById("pkgInput");
  const validateBtn = document.getElementById("validateBtn");
  const resultBox = document.getElementById("resultBox");

  const SEMVER = /^\d+\.\d+\.\d+([-+].*)?$/;
  const NAME_RE = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/;

  function alertRow(type, message) {
    const icon = type === "success" ? "✓" : type === "warning" ? "!" : "✕";
    return '<div class="alert alert-' + type + '"><span style="font-weight:700;">' + icon + "</span><span>" + window.OmniTools.escapeHtml(message) + "</span></div>";
  }

  function lineColOf(raw, index) {
    const before = raw.slice(0, index);
    const lines = before.split("\n");
    return { line: lines.length, col: lines[lines.length - 1].length + 1 };
  }

  function validate() {
    const raw = pkgInput.value;
    let pkg;
    try {
      pkg = JSON.parse(raw);
    } catch (err) {
      let detail = "";
      const match = /position (\d+)/.exec(err.message);
      if (match) {
        const pos = parseInt(match[1], 10);
        const lc = lineColOf(raw, pos);
        detail = " (line " + lc.line + ", column " + lc.col + ")";
      }
      resultBox.innerHTML = alertRow("danger", "Invalid JSON" + detail + ": " + err.message);
      return;
    }

    const rows = [];

    if (typeof pkg !== "object" || pkg === null || Array.isArray(pkg)) {
      rows.push(alertRow("danger", "package.json must be a JSON object."));
    } else {
      ["name", "version"].forEach(function (field) {
        const val = pkg[field];
        if (typeof val === "string" && val.trim()) {
          rows.push(alertRow("success", "\"" + field + "\" is present: " + val + "."));
        } else {
          rows.push(alertRow("danger", "\"" + field + "\" is required for every package and is missing."));
        }
      });

      if (typeof pkg.version === "string") {
        if (SEMVER.test(pkg.version)) {
          rows.push(alertRow("success", "Version \"" + pkg.version + "\" is valid semver."));
        } else {
          rows.push(alertRow("danger", "Version \"" + pkg.version + "\" is not valid semver. Expected MAJOR.MINOR.PATCH like 1.0.0, optionally with a -pre or +build suffix."));
        }
      }

      ["description", "main", "scripts", "license"].forEach(function (field) {
        const val = pkg[field];
        if (val === undefined || val === null || val === "") {
          rows.push(alertRow("warning", "Missing or empty \"" + field + "\" — recommended for published packages."));
        } else {
          rows.push(alertRow("success", "\"" + field + "\" is defined."));
        }
      });

      ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"].forEach(function (depField) {
        const deps = pkg[depField];
        if (deps && typeof deps === "object" && !Array.isArray(deps)) {
          Object.keys(deps).forEach(function (name) {
            if (!NAME_RE.test(name)) {
              rows.push(alertRow("warning", "Dependency name \"" + name + "\" in " + depField + " looks invalid — npm names are lowercase with no spaces."));
            }
          });
        }
      });
    }

    resultBox.innerHTML = rows.join("");
  }

  validateBtn.addEventListener("click", validate);
  validate();
})();