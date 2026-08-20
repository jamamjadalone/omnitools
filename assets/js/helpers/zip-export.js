/* =========================================================================
   OmniTools — zip-export.js
   Shared helper for bundling files into a .zip and saving it. Wraps the
   vendored JSZip + FileSaver libraries so individual tools don't each
   re-implement the same download flow.
   Usage: await OmniToolsZip.save({ name: "files.zip", files: [{name, blob}, ...] })
   ========================================================================= */
(function () {
  "use strict";

  function saveAs(blob, filename) {
    if (window.saveAs) return window.saveAs(blob, filename);
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 500);
  }

  async function createZip(files) {
    if (!window.JSZip) {
      throw new Error("JSZip library is not loaded.");
    }
    const zip = new window.JSZip();
    for (const item of files) {
      zip.file(item.name, item.blob);
    }
    return zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });
  }

  async function save(items, zipName) {
    const blob = await createZip(items);
    saveAs(blob, zipName || "download.zip");
    return blob;
  }

  window.OmniToolsZip = {
    createZip,
    save,
    saveAs,
  };
})();