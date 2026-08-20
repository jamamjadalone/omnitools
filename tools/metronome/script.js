(function () {
  "use strict";
  const bpmSlider = document.getElementById("bpmSlider");
  const bpmValue = document.getElementById("bpmValue");
  const bpmDisplay = document.getElementById("bpmDisplay");
  const beatsSelect = document.getElementById("beatsSelect");
  const soundSelect = document.getElementById("soundSelect");
  const playBtn = document.getElementById("playBtn");
  const beatDots = document.getElementById("beatDots");
  const output = document.getElementById("metroOutput");

  var audioCtx = null;
  var playing = false;
  var currentBeat = 0;
  var nextBeatTime = 0;
  var timerId = null;
  var scheduleAheadTime = 0.1;
  var lookahead = 25;

  function getBpm() { return parseInt(bpmSlider.value, 10); }

  function createDots() {
    var count = parseInt(beatsSelect.value, 10);
    beatDots.innerHTML = "";
    for (var i = 0; i < count; i++) {
      var dot = document.createElement("div");
      dot.className = "beat-dot" + (i === 0 ? " accent" : "");
      beatDots.appendChild(dot);
    }
  }

  function playClick(time, accent) {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (soundSelect.value === "wood") {
      osc.frequency.value = accent ? 900 : 700;
      osc.type = "triangle";
      gain.gain.setValueAtTime(accent ? 0.5 : 0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      osc.start(time);
      osc.stop(time + 0.05);
    } else {
      osc.frequency.value = accent ? 1000 : 800;
      osc.type = "square";
      gain.gain.setValueAtTime(accent ? 0.3 : 0.15, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
      osc.start(time);
      osc.stop(time + 0.03);
    }
  }

  function highlightBeat(beat) {
    var dots = beatDots.querySelectorAll(".beat-dot");
    dots.forEach(function (d, i) { d.classList.toggle("active", i === beat); });
  }

  function scheduler() {
    var bpm = getBpm();
    var beatsPerBar = parseInt(beatsSelect.value, 10);
    var secondsPerBeat = 60.0 / bpm;

    while (nextBeatTime < audioCtx.currentTime + scheduleAheadTime) {
      var accent = currentBeat === 0;
      playClick(nextBeatTime, accent);

      (function (beat) {
        setTimeout(function () { highlightBeat(beat); }, Math.max(0, (nextBeatTime - audioCtx.currentTime) * 1000));
      })(currentBeat);

      nextBeatTime += secondsPerBeat;
      currentBeat = (currentBeat + 1) % beatsPerBar;
    }
    timerId = setTimeout(scheduler, lookahead);
  }

  function start() {
    if (playing) return;
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    playing = true;
    currentBeat = 0;
    nextBeatTime = audioCtx.currentTime;
    scheduler();
    playBtn.textContent = "⏹ Stop";
    playBtn.classList.remove("btn-primary");
    playBtn.classList.add("btn-secondary");
    output.textContent = "Playing at " + getBpm() + " BPM (" + beatsSelect.value + "/4)";
  }

  function stop() {
    playing = false;
    clearTimeout(timerId);
    playBtn.textContent = "▶ Start";
    playBtn.classList.remove("btn-secondary");
    playBtn.classList.add("btn-primary");
    beatDots.querySelectorAll(".beat-dot").forEach(function (d) { d.classList.remove("active"); });
    output.textContent = "Stopped.";
  }

  bpmSlider.addEventListener("input", function () {
    bpmValue.textContent = bpmSlider.value;
    bpmDisplay.textContent = bpmSlider.value;
    if (playing) output.textContent = "Playing at " + bpmSlider.value + " BPM (" + beatsSelect.value + "/4)";
  });

  beatsSelect.addEventListener("change", function () {
    createDots();
    if (playing) { stop(); start(); }
  });

  playBtn.addEventListener("click", function () { playing ? stop() : start(); });

  document.querySelectorAll(".bpm-preset").forEach(function (btn) {
    btn.addEventListener("click", function () {
      bpmSlider.value = btn.dataset.bpm;
      bpmValue.textContent = btn.dataset.bpm;
      bpmDisplay.textContent = btn.dataset.bpm;
      if (playing) output.textContent = "Playing at " + btn.dataset.bpm + " BPM (" + beatsSelect.value + "/4)";
    });
  });

  createDots();
})();
