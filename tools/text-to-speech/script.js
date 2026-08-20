(function () {
  "use strict";
  var input = document.getElementById("ttsInput");
  var voiceSelect = document.getElementById("ttsVoice");
  var rateRange = document.getElementById("ttsRate");
  var pitchRange = document.getElementById("ttsPitch");
  var rateVal = document.getElementById("rateVal");
  var pitchVal = document.getElementById("pitchVal");
  var speakBtn = document.getElementById("speakBtn");
  var pauseBtn = document.getElementById("pauseBtn");
  var stopBtn = document.getElementById("stopBtn");
  var status = document.getElementById("ttsStatus");

  var synth = window.speechSynthesis;
  var voices = [];
  var utterance = null;

  function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach(function (v, i) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.textContent = v.name + " (" + v.lang + ")";
      voiceSelect.appendChild(opt);
    });
  }

  if (synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = loadVoices;
  }
  loadVoices();

  rateRange.addEventListener("input", function () { rateVal.textContent = rateRange.value; });
  pitchRange.addEventListener("input", function () { pitchVal.textContent = pitchRange.value; });

  speakBtn.addEventListener("click", function () {
    var text = input.value.trim();
    if (!text) { window.OmniTools.showToast("Enter some text first.", "error"); return; }
    synth.cancel();
    utterance = new SpeechSynthesisUtterance(text);
    var idx = parseInt(voiceSelect.value, 10);
    if (voices[idx]) utterance.voice = voices[idx];
    utterance.rate = parseFloat(rateRange.value);
    utterance.pitch = parseFloat(pitchRange.value);
    utterance.onstart = function () { status.textContent = "Status: Speaking..."; };
    utterance.onend = function () { status.textContent = "Status: Done."; };
    utterance.onerror = function () { status.textContent = "Status: Error occurred."; };
    synth.speak(utterance);
    status.textContent = "Status: Speaking...";
  });

  pauseBtn.addEventListener("click", function () {
    if (synth.speaking) {
      if (synth.paused) { synth.resume(); pauseBtn.textContent = "Pause"; status.textContent = "Status: Speaking..."; }
      else { synth.pause(); pauseBtn.textContent = "Resume"; status.textContent = "Status: Paused."; }
    }
  });

  stopBtn.addEventListener("click", function () {
    synth.cancel();
    pauseBtn.textContent = "Pause";
    status.textContent = "Status: Stopped.";
  });
})();
