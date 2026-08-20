(function () {
  "use strict";
  var input = document.getElementById("xmlInput");
  var convertBtn = document.getElementById("convertBtn");
  var errorBox = document.getElementById("xmlError");
  var output = document.getElementById("jsonOutput");
  var copyBtn = document.getElementById("copyBtn");

  function xmlNodeToObj(node) {
    var obj = {};
    if (node.attributes && node.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i];
        obj["@attributes"][attr.name] = attr.value;
      }
    }
    var children = node.childNodes;
    var hasElementChild = false;
    for (var j = 0; j < children.length; j++) {
      if (children[j].nodeType === 1) { hasElementChild = true; break; }
    }
    if (hasElementChild) {
      for (var k = 0; k < children.length; k++) {
        var child = children[k];
        if (child.nodeType !== 1) continue;
        var val = xmlNodeToObj(child);
        if (obj[child.nodeName] !== undefined) {
          if (!Array.isArray(obj[child.nodeName])) {
            obj[child.nodeName] = [obj[child.nodeName]];
          }
          obj[child.nodeName].push(val);
        } else {
          obj[child.nodeName] = val;
        }
      }
    } else {
      var text = "";
      for (var m = 0; m < children.length; m++) {
        if (children[m].nodeType === 3 || children[m].nodeType === 4) {
          text += children[m].nodeValue;
        }
      }
      text = text.trim();
      if (Object.keys(obj).length === 0) return text;
      if (text) obj["#text"] = text;
    }
    return obj;
  }

  function convert() {
    errorBox.style.display = "none";
    var xmlText = input.value.trim();
    if (!xmlText) { errorBox.textContent = "Please paste some XML."; errorBox.style.display = "flex"; return; }
    var parser = new DOMParser();
    var doc = parser.parseFromString(xmlText, "text/xml");
    var parseError = doc.querySelector("parsererror");
    if (parseError) {
      errorBox.textContent = "Invalid XML: " + parseError.textContent.substring(0, 200);
      errorBox.style.display = "flex";
      return;
    }
    var root = doc.documentElement;
    var result = {};
    result[root.nodeName] = xmlNodeToObj(root);
    output.textContent = JSON.stringify(result, null, 2);
  }

  convertBtn.addEventListener("click", convert);

  copyBtn.addEventListener("click", function () {
    var text = output.textContent;
    if (!text || text === "Your JSON output will appear here.") return;
    window.OmniTools.copyText(text).then(function () {
      window.OmniTools.showToast("Copied to clipboard.", "success");
    });
  });
})();
