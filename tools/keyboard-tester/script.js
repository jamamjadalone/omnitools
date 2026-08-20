(function () {
  "use strict";
  var lastKeyEl = document.getElementById("lastKey");
  var keyCodeEl = document.getElementById("keyCode");
  var resetBtn = document.getElementById("resetBtn");
  var container = document.getElementById("keyboardContainer");

  var ROWS = [
    [
      { label: "Esc", code: "Escape", cls: "fn-key" },
      { label: "F1", code: "F1", cls: "fn-key" }, { label: "F2", code: "F2", cls: "fn-key" },
      { label: "F3", code: "F3", cls: "fn-key" }, { label: "F4", code: "F4", cls: "fn-key" },
      { label: "F5", code: "F5", cls: "fn-key" }, { label: "F6", code: "F6", cls: "fn-key" },
      { label: "F7", code: "F7", cls: "fn-key" }, { label: "F8", code: "F8", cls: "fn-key" },
      { label: "F9", code: "F9", cls: "fn-key" }, { label: "F10", code: "F10", cls: "fn-key" },
      { label: "F11", code: "F11", cls: "fn-key" }, { label: "F12", code: "F12", cls: "fn-key" }
    ],
    [
      { label: "`", code: "Backquote" }, { label: "1", code: "Digit1" }, { label: "2", code: "Digit2" },
      { label: "3", code: "Digit3" }, { label: "4", code: "Digit4" }, { label: "5", code: "Digit5" },
      { label: "6", code: "Digit6" }, { label: "7", code: "Digit7" }, { label: "8", code: "Digit8" },
      { label: "9", code: "Digit9" }, { label: "0", code: "Digit0" }, { label: "-", code: "Minus" },
      { label: "=", code: "Equal" }, { label: "Bksp", code: "Backspace", cls: "wider" }
    ],
    [
      { label: "Tab", code: "Tab", cls: "wider" }, { label: "Q", code: "KeyQ" }, { label: "W", code: "KeyW" },
      { label: "E", code: "KeyE" }, { label: "R", code: "KeyR" }, { label: "T", code: "KeyT" },
      { label: "Y", code: "KeyY" }, { label: "U", code: "KeyU" }, { label: "I", code: "KeyI" },
      { label: "O", code: "KeyO" }, { label: "P", code: "KeyP" }, { label: "[", code: "BracketLeft" },
      { label: "]", code: "BracketRight" }, { label: "\\", code: "Backslash" }
    ],
    [
      { label: "Caps", code: "CapsLock", cls: "wider" }, { label: "A", code: "KeyA" }, { label: "S", code: "KeyS" },
      { label: "D", code: "KeyD" }, { label: "F", code: "KeyF" }, { label: "G", code: "KeyG" },
      { label: "H", code: "KeyH" }, { label: "J", code: "KeyJ" }, { label: "K", code: "KeyK" },
      { label: "L", code: "KeyL" }, { label: ";", code: "Semicolon" }, { label: "'", code: "Quote" },
      { label: "Enter", code: "Enter", cls: "wider" }
    ],
    [
      { label: "Shift", code: "ShiftLeft", cls: "wider" }, { label: "Z", code: "KeyZ" }, { label: "X", code: "KeyX" },
      { label: "C", code: "KeyC" }, { label: "V", code: "KeyV" }, { label: "B", code: "KeyB" },
      { label: "N", code: "KeyN" }, { label: "M", code: "KeyM" }, { label: ",", code: "Comma" },
      { label: ".", code: "Period" }, { label: "/", code: "Slash" }, { label: "Shift", code: "ShiftRight", cls: "wider" }
    ],
    [
      { label: "Ctrl", code: "ControlLeft", cls: "wide" }, { label: "Win", code: "MetaLeft", cls: "fn-key" },
      { label: "Alt", code: "AltLeft", cls: "wide" }, { label: "Space", code: "Space", cls: "space" },
      { label: "Alt", code: "AltRight", cls: "wide" }, { label: "Win", code: "MetaRight", cls: "fn-key" },
      { label: "Menu", code: "ContextMenu", cls: "fn-key" }, { label: "Ctrl", code: "ControlRight", cls: "wide" }
    ]
  ];

  var keyMap = {};

  function buildKeyboard() {
    ROWS.forEach(function (row) {
      var rowDiv = document.createElement("div");
      rowDiv.className = "kb-row";
      row.forEach(function (k) {
        var key = document.createElement("div");
        key.className = "kb-key" + (k.cls ? " " + k.cls : "");
        key.textContent = k.label;
        key.dataset.code = k.code;
        rowDiv.appendChild(key);
        keyMap[k.code] = key;
      });
      container.appendChild(rowDiv);
    });
  }

  buildKeyboard();

  document.addEventListener("keydown", function (e) {
    e.preventDefault();
    var key = keyMap[e.code];
    if (key) key.classList.add("active");
    lastKeyEl.textContent = e.key;
    keyCodeEl.textContent = e.code;
  });

  document.addEventListener("keyup", function (e) {
    var key = keyMap[e.code];
    if (key) key.classList.remove("active");
  });

  resetBtn.addEventListener("click", function () {
    document.querySelectorAll(".kb-key.active").forEach(function (k) { k.classList.remove("active"); });
    lastKeyEl.textContent = "None";
    keyCodeEl.textContent = "—";
  });
})();
