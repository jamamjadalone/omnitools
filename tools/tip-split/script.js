(function () {
  "use strict";
  var itemsContainer = document.getElementById("itemsContainer");
  var addItemBtn = document.getElementById("addItemBtn");
  var tipRange = document.getElementById("tipPercent");
  var tipVal = document.getElementById("tipVal");
  var splitRange = document.getElementById("splitCount");
  var splitVal = document.getElementById("splitVal");
  var calcBtn = document.getElementById("calcBtn");
  var results = document.getElementById("tipResults");

  function addItemRow(name, price) {
    var row = document.createElement("div");
    row.className = "tip-item-row";
    var nameIn = document.createElement("input");
    nameIn.type = "text";
    nameIn.placeholder = "Item name";
    nameIn.value = name || "";
    var priceIn = document.createElement("input");
    priceIn.type = "number";
    priceIn.placeholder = "Price";
    priceIn.min = "0";
    priceIn.step = "0.01";
    priceIn.value = price || "";
    var delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.className = "btn btn-secondary btn-sm";
    delBtn.style.cssText = "padding:4px 8px;min-width:auto;";
    delBtn.addEventListener("click", function () { row.remove(); });
    row.appendChild(nameIn);
    row.appendChild(priceIn);
    row.appendChild(delBtn);
    itemsContainer.appendChild(row);
  }

  function calculate() {
    var rows = itemsContainer.querySelectorAll(".tip-item-row");
    var subtotal = 0;
    var items = [];
    rows.forEach(function (row) {
      var inputs = row.querySelectorAll("input");
      var name = inputs[0].value.trim() || "Item";
      var price = parseFloat(inputs[1].value) || 0;
      subtotal += price;
      items.push({ name: name, price: price });
    });
    if (subtotal === 0) { window.OmniTools.showToast("Add items with prices.", "error"); return; }
    var tipPct = parseInt(tipRange.value, 10);
    var split = parseInt(splitRange.value, 10);
    var tip = subtotal * (tipPct / 100);
    var total = subtotal + tip;
    var perPerson = Math.ceil((total / split) * 100) / 100;

    var html = '<div class="tip-result-row"><span>Subtotal</span><span>$' + subtotal.toFixed(2) + '</span></div>';
    html += '<div class="tip-result-row"><span>Tip (' + tipPct + '%)</span><span>$' + tip.toFixed(2) + '</span></div>';
    html += '<div class="tip-result-row"><span>Total</span><span>$' + total.toFixed(2) + '</span></div>';
    html += '<div class="tip-result-total">Per person: $' + perPerson.toFixed(2) + '</div>';
    if (split > 1) {
      html += '<div style="text-align:center;font-size:0.85rem;color:var(--text-dim);">Split ' + split + ' ways (' + (total).toFixed(2) + ' ÷ ' + split + ')</div>';
    }
    results.innerHTML = html;
  }

  addItemBtn.addEventListener("click", function () { addItemRow(); });
  tipRange.addEventListener("input", function () { tipVal.textContent = tipRange.value; });
  splitRange.addEventListener("input", function () { splitVal.textContent = splitRange.value; });
  calcBtn.addEventListener("click", calculate);
  addItemRow("Item 1", "");
})();
