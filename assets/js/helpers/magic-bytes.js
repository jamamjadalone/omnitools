/* =========================================================================
   OmniTools — magic-bytes.js
   File type detection by reading magic bytes (file signature), independent
   of the file extension. Used by the File Type Detector tool.
   ========================================================================= */
(function () {
  "use strict";

  function bytesToHex(bytes, start, length) {
    var out = "";
    for (var i = start; i < start + length; i++) {
      out += bytes[i].toString(16).padStart(2, "0");
    }
    return out.toUpperCase();
  }

  function utf8(bytes, start, length) {
    var s = "";
    for (var i = start; i < start + length && i < bytes.length; i++) {
      s += String.fromCharCode(bytes[i]);
    }
    return s;
  }

  function detect(bytes) {
    var hex8 = bytesToHex(bytes, 0, 8);
    var hex4 = hex8.slice(0, 4);
    var hex3 = hex8.slice(0, 3);
    var ascii4 = utf8(bytes, 0, 4);

    if (hex8.startsWith("FFD8FF")) return { type: "JPEG image", mime: "image/jpeg", ext: "jpg", match: "FFD8FF…" };
    if (hex8.startsWith("89504E470D0A1A0A")) return { type: "PNG image", mime: "image/png", ext: "png", match: "89504E47…" };
    if (hex8.startsWith("474946383761") || hex8.startsWith("474946383961")) return { type: "GIF image", mime: "image/gif", ext: "gif", match: "GIF89a/87a" };
    if (hex8.startsWith("49492A00") || hex8.startsWith("4D4D002A")) return { type: "TIFF image", mime: "image/tiff", ext: "tiff", match: "II* / MM*" };
    if (hex8.startsWith("424D")) return { type: "BMP image", mime: "image/bmp", ext: "bmp", match: "BM" };
    if (hex8.startsWith("52494646") && utf8(bytes, 8, 4) === "WEBP") return { type: "WebP image", mime: "image/webp", ext: "webp", match: "RIFF…WEBP" };
    if (hex8.startsWith("25504446")) return { type: "PDF document", mime: "application/pdf", ext: "pdf", match: "%PDF" };
    if (hex8.startsWith("504B0304") || hex8.startsWith("504B0506") || hex8.startsWith("504B0708")) {
      var inner = utf8(bytes, 30, 4);
      if (inner === "mimetype" || hex8 === "504B0304") return { type: "ZIP archive", mime: "application/zip", ext: "zip", match: "PK" };
    }
    if (hex8.startsWith("1F8B")) return { type: "GZIP archive", mime: "application/gzip", ext: "gz", match: "1F8B" };
    if (hex8.startsWith("377ABCEF275C")) return { type: "7-Zip archive", mime: "application/x-7z-compressed", ext: "7z", match: "7z¼¯'Œ" };
    if (hex8.startsWith("526172211A0700")) return { type: "RAR archive", mime: "application/vnd.rar", ext: "rar", match: "Rar!" };
    if (hex4 === "000000" && (hex8.startsWith("00000018") || hex8.startsWith("00000020") || hex8.startsWith("00000014") || hex8.startsWith("0000001C"))) return { type: "MP4 video", mime: "video/mp4", ext: "mp4", match: "ftyp box" };
    if (hex8.startsWith("1A45DFA3")) return { type: "WebM / Matroska video", mime: "video/webm", ext: "webm", match: "EBML" };
    if (hex8.startsWith("0000001C667479706D703432")) return { type: "MP4 video", mime: "video/mp4", ext: "mp4", match: "ftypmp42" };
    if (hex8.startsWith("000000206674797069736F6D")) return { type: "MP4 video", mime: "video/mp4", ext: "mp4", match: "ftypisom" };
    if (hex8.startsWith("494433") || hex8.startsWith("FFFB") || hex8.startsWith("FFF3") || hex8.startsWith("FFF2") || hex8.startsWith("FFF1")) return { type: "MP3 audio", mime: "audio/mpeg", ext: "mp3", match: "ID3 / FFFB" };
    if (hex4 === "52494646" && utf8(bytes, 8, 4) === "WAVE") return { type: "WAV audio", mime: "audio/wav", ext: "wav", match: "RIFF…WAVE" };
    if (hex8.startsWith("4F676753")) return { type: "OGG audio", mime: "audio/ogg", ext: "ogg", match: "OggS" };
    if (hex4 === "4D546864") return { type: "MIDI audio", mime: "audio/midi", ext: "mid", match: "MThd" };
    if (hex8.startsWith("504B0304") && utf8(bytes, 30, 8).startsWith("mimetype")) return { type: "EPUB ebook", mime: "application/epub+zip", ext: "epub", match: "PK…mimetype" };
    if (hex4 === "7B5C727466") return { type: "Rich Text Format", mime: "application/rtf", ext: "rtf", match: "{\\rtf" };
    if (hex4 === "D0CF11E0") return { type: "MS Office (OLE2) document", mime: "application/x-ole-storage", ext: "doc|xls|ppt", match: "D0CF11E0" };
    if (hex8.startsWith("3C3F786D6C")) return { type: "XML document", mime: "application/xml", ext: "xml", match: "<?xml" };
    if (hex8.startsWith("EFBBBF")) return { type: "Text file (UTF-8 BOM)", mime: "text/plain", ext: "txt", match: "EF BB BF" };
    if (hex8.startsWith("7F454C46")) return { type: "ELF executable", mime: "application/octet-stream", ext: "elf", match: "ELF" };
    if (hex4 === "4C000000") return { type: "Windows executable/link library", mime: "application/vnd.microsoft.portable-executable", ext: "exe|dll", match: "MZ" };
    if (hex4 === "CAFEBABE") return { type: "Java class file", mime: "application/java-vm", ext: "class", match: "CAFEBABE" };
    if (hex8.startsWith("7573746172")) return { type: "TAR archive", mime: "application/x-tar", ext: "tar", match: "ustar" };

    return { type: "Unknown / plain text", mime: "text/plain", ext: "txt", match: ascii4 || hex4 || "—" };
  }

  window.OmniToolsMagicBytes = { detect: detect };
})();