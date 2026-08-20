(function () {
  "use strict";
  var TYPES = ["INTEGER","VARCHAR(255)","TEXT","BOOLEAN","DATE","DATETIME","FLOAT","DECIMAL(10,2)","BIGINT","UUID"];
  var tableName = document.getElementById("tableName");
  var fieldsContainer = document.getElementById("fieldsContainer");
  var addFieldBtn = document.getElementById("addFieldBtn");
  var addTableBtn = document.getElementById("addTableBtn");
  var exportSqlBtn = document.getElementById("exportSqlBtn");
  var tablesList = document.getElementById("tablesList");
  var sqlOutput = document.getElementById("sqlOutput");
  var copyBtn = document.getElementById("copyBtn");

  var tables = [];

  function addFieldRow() {
    var row = document.createElement("div");
    row.className = "db-field-row";
    var nameIn = document.createElement("input");
    nameIn.type = "text";
    nameIn.placeholder = "field name";
    var typeSel = document.createElement("select");
    TYPES.forEach(function (t) { var o = document.createElement("option"); o.value = t; o.textContent = t; typeSel.appendChild(o); });
    var pkCheck = document.createElement("input");
    pkCheck.type = "checkbox";
    pkCheck.title = "Primary key";
    var pkLabel = document.createElement("label");
    pkLabel.textContent = "PK";
    pkLabel.title = "Primary key";
    var nnCheck = document.createElement("input");
    nnCheck.type = "checkbox";
    nnCheck.title = "NOT NULL";
    nnCheck.checked = true;
    var nnLabel = document.createElement("label");
    nnLabel.textContent = "NN";
    nnLabel.title = "NOT NULL";
    var delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.className = "btn btn-secondary btn-sm";
    delBtn.style.cssText = "padding:2px 6px;min-width:auto;";
    delBtn.addEventListener("click", function () { row.remove(); });
    row.appendChild(nameIn);
    row.appendChild(typeSel);
    row.appendChild(pkCheck);
    row.appendChild(pkLabel);
    row.appendChild(nnCheck);
    row.appendChild(nnLabel);
    row.appendChild(delBtn);
    fieldsContainer.appendChild(row);
  }

  function addTable() {
    var name = tableName.value.trim();
    if (!name) { window.OmniTools.showToast("Enter a table name.", "error"); return; }
    var rows = fieldsContainer.querySelectorAll(".db-field-row");
    var fields = [];
    rows.forEach(function (row) {
      var inputs = row.querySelectorAll("input[type='text']");
      var selects = row.querySelectorAll("select");
      var checks = row.querySelectorAll("input[type='checkbox']");
      var fname = inputs[0].value.trim();
      if (!fname) return;
      fields.push({
        name: fname,
        type: selects[0].value,
        pk: checks[0].checked,
        nn: checks[1].checked
      });
    });
    if (fields.length === 0) { window.OmniTools.showToast("Add at least one field.", "error"); return; }
    tables.push({ name: name, fields: fields });
    fieldsContainer.innerHTML = "";
    tableName.value = "";
    renderTables();
  }

  function renderTables() {
    tablesList.innerHTML = "";
    tables.forEach(function (t, i) {
      var tag = document.createElement("span");
      tag.className = "table-tag";
      tag.textContent = t.name + " (" + t.fields.length + " fields)";
      var del = document.createElement("button");
      del.textContent = "×";
      del.style.cssText = "background:none;border:none;color:#e74c3c;cursor:pointer;font-size:1rem;margin-left:4px;";
      del.addEventListener("click", function () { tables.splice(i, 1); renderTables(); });
      tag.appendChild(del);
      tablesList.appendChild(tag);
    });
  }

  function exportSql() {
    if (tables.length === 0) { window.OmniTools.showToast("No tables to export.", "error"); return; }
    var sql = "";
    tables.forEach(function (t) {
      sql += "CREATE TABLE " + t.name + " (\n";
      var lines = [];
      var pks = [];
      t.fields.forEach(function (f) {
        var line = "  " + f.name + " " + f.type;
        if (f.nn && !f.pk) line += " NOT NULL";
        lines.push(line);
        if (f.pk) pks.push(f.name);
      });
      if (pks.length > 0) lines.push("  PRIMARY KEY (" + pks.join(", ") + ")");
      sql += lines.join(",\n") + "\n);\n\n";
    });
    sqlOutput.textContent = sql.trim();
  }

  addFieldBtn.addEventListener("click", addFieldRow);
  addTableBtn.addEventListener("click", addTable);
  exportSqlBtn.addEventListener("click", exportSql);
  copyBtn.addEventListener("click", function () {
    var text = sqlOutput.textContent;
    if (!text || text.indexOf("--") === 0) return;
    window.OmniTools.copyText(text).then(function () { window.OmniTools.showToast("Copied!", "success"); });
  });
  addFieldRow();
})();
