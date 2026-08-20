(function () {
  "use strict";
  var editor = document.getElementById("htmlCode");
  var frame = document.getElementById("previewFrame");
  var updateBtn = document.getElementById("updateBtn");
  var clearBtn = document.getElementById("clearBtn");

  function updatePreview() {
    var html = editor.value;
    var doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }

  updateBtn.addEventListener("click", updatePreview);
  clearBtn.addEventListener("click", function () {
    editor.value = "";
    var doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write("");
    doc.close();
  });

  editor.addEventListener("input", function () {
    clearTimeout(editor._debounce);
    editor._debounce = setTimeout(updatePreview, 500);
  });
})();
