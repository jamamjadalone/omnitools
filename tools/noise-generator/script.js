(function () {
  "use strict";
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeValue = document.getElementById("volumeValue");
  const playBtn = document.getElementById("playBtn");
  const noiseTypes = document.getElementById("noiseTypes");
  const noiseOutput = document.getElementById("noiseOutput");
  const visualCanvas = document.getElementById("visualCanvas");
  const ctx2d = visualCanvas.getContext("2d");

  var audioCtx = null;
  var noiseNode = null;
  var gainNode = null;
  var analyser = null;
  var playing = false;
  var noiseType = "white";
  var animId = null;

  function createNoiseBuffer() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var bufferSize = audioCtx.sampleRate * 2;
    var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    var data = buffer.getChannelData(0);

    if (noiseType === "white") {
      for (var i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    } else if (noiseType === "brown") {
      var last = 0;
      for (var i = 0; i < bufferSize; i++) {
        var white = Math.random() * 2 - 1;
        last = (last + (0.02 * white)) / 1.02;
        data[i] = last * 3.5;
      }
    } else {
      /* pink noise using Voss-McCartney */
      var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (var i = 0; i < bufferSize; i++) {
        var white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  function startNoise() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = createNoiseBuffer();
    noiseNode.loop = true;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = volumeSlider.value / 100;

    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;

    noiseNode.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioCtx.destination);
    noiseNode.start();

    playing = true;
    playBtn.textContent = "⏹ Stop";
    playBtn.classList.remove("btn-primary");
    playBtn.classList.add("btn-secondary");
    noiseOutput.textContent = "Playing " + noiseType + " noise.";

    drawVisual();
  }

  function stopNoise() {
    if (noiseNode) { try { noiseNode.stop(); } catch (e) {} noiseNode = null; }
    playing = false;
    playBtn.textContent = "▶ Play";
    playBtn.classList.remove("btn-secondary");
    playBtn.classList.add("btn-primary");
    noiseOutput.textContent = "Stopped.";
    cancelAnimationFrame(animId);
    ctx2d.clearRect(0, 0, visualCanvas.width, visualCanvas.height);
  }

  function drawVisual() {
    if (!analyser) return;
    var bufLen = analyser.frequencyBinCount;
    var arr = new Uint8Array(bufLen);
    analyser.getByteTimeDomainData(arr);

    ctx2d.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--bg-surface").trim() || "#1a1d26";
    ctx2d.fillRect(0, 0, visualCanvas.width, visualCanvas.height);

    ctx2d.lineWidth = 2;
    ctx2d.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent", "").trim() || "#22c55e";
    ctx2d.beginPath();

    var w = visualCanvas.width;
    var h = visualCanvas.height;
    var sliceWidth = w / bufLen;
    var x = 0;
    for (var i = 0; i < bufLen; i++) {
      var v = arr[i] / 128.0;
      var y = v * h / 2;
      if (i === 0) ctx2d.moveTo(x, y);
      else ctx2d.lineTo(x, y);
      x += sliceWidth;
    }
    ctx2d.lineTo(w, h / 2);
    ctx2d.stroke();
    animId = requestAnimationFrame(drawVisual);
  }

  volumeSlider.addEventListener("input", function () {
    volumeValue.textContent = volumeSlider.value;
    if (gainNode) gainNode.gain.value = volumeSlider.value / 100;
  });

  playBtn.addEventListener("click", function () { playing ? stopNoise() : startNoise(); });

  noiseTypes.querySelectorAll(".noise-type").forEach(function (btn) {
    btn.addEventListener("click", function () {
      noiseTypes.querySelectorAll(".noise-type").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      noiseType = btn.dataset.type;
      if (playing) { stopNoise(); startNoise(); }
    });
  });
})();
