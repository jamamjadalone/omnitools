(function () {
  "use strict";
  var fileInput = document.getElementById("fileInput");
  var previewImg = document.getElementById("previewImg");
  var results = document.getElementById("metaResults");

  function addRow(key, val) {
    return '<div class="meta-row"><span class="meta-key">' + key + '</span><span class="meta-val">' + val + '</span></div>';
  }

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  function readEXIF(buffer) {
    var view = new DataView(buffer);
    if (view.getUint16(0, false) !== 0xFFD8) return {};
    var offset = 2;
    var exif = {};
    while (offset < view.byteLength) {
      if (view.getUint16(offset, false) === 0xFFE1) {
        var exifStart = offset + 4;
        if (view.getUint16(exifStart, false) === 0x4578) {
          var tiffStart = exifStart + 6;
          var little = view.getUint16(tiffStart, false) === 0x4949;
          var ifdStart = tiffStart + view.getUint32(tiffStart + 4, little);
          var numEntries = view.getUint16(ifdStart, little);
          for (var i = 0; i < numEntries; i++) {
            var entryOff = ifdStart + 2 + (i * 12);
            var tag = view.getUint16(entryOff, little);
            var type = view.getUint16(entryOff + 2, little);
            var count = view.getUint32(entryOff + 4, little);
            if (tag === 0x010F) exif.Make = readASCII(view, entryOff + 8, count, little);
            if (tag === 0x0110) exif.Model = readASCII(view, entryOff + 8, count, little);
            if (tag === 0x9003) exif.DateTime = readASCII(view, entryOff + 8, count, little);
            if (tag === 0x829A) exif.ExposureTime = readASCII(view, entryOff + 8, count, little);
            if (tag === 0x829D) exif.FNumber = readASCII(view, entryOff + 8, count, little);
            if (tag === 0x8827) exif.ISO = view.getUint16(entryOff + 8, little);
            if (tag === 0xA002) exif.PixelXDimension = view.getUint32(entryOff + 8, little);
            if (tag === 0xA003) exif.PixelYDimension = view.getUint32(entryOff + 8, little);
          }
        }
        break;
      }
      offset += 2 + view.getUint16(offset + 2, false);
    }
    return exif;
  }

  function readASCII(view, offset, count, little) {
    var s = "";
    for (var i = 0; i < count && i < 50; i++) {
      var c = view.getUint8(offset + (little ? i : i));
      if (c === 0) break;
      s += String.fromCharCode(c);
    }
    return s;
  }

  fileInput.addEventListener("change", function () {
    var file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file);
    previewImg.style.display = "block";

    var html = addRow("File Name", file.name);
    html += addRow("File Size", formatSize(file.size));
    html += addRow("Type", file.type || "unknown");

    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        html += addRow("Width", img.width + " px");
        html += addRow("Height", img.height + " px");
        html += addRow("Aspect Ratio", (img.width / img.height).toFixed(2));
        var exif = readEXIF(e.target.result);
        if (Object.keys(exif).length > 0) {
          html += '<div style="padding:8px 12px;font-weight:600;color:var(--accent);margin-top:8px;">EXIF Data</div>';
          if (exif.Make) html += addRow("Camera Make", exif.Make);
          if (exif.Model) html += addRow("Camera Model", exif.Model);
          if (exif.DateTime) html += addRow("Date Taken", exif.DateTime);
          if (exif.ExposureTime) html += addRow("Exposure", exif.ExposureTime + "s");
          if (exif.FNumber) html += addRow("Aperture", "f/" + exif.FNumber);
          if (exif.ISO) html += addRow("ISO", exif.ISO);
        }
        results.innerHTML = html;
      };
      img.src = e.target.result;
    };
    reader.readAsArrayBuffer(file);
  });
})();
