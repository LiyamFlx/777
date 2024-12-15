
let wavesurfer, audioContext, analyser, dataArray, recordingSeconds = 0;
const rmsDisplay = document.getElementById('rms');
const centroidDisplay = document.getElementById('centroid');
const engagementDisplay = document.getElementById('engagement');
const chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: { labels: [], datasets: [{ label: 'RMS', data: [], borderColor: '#28a745' }] },
    options: { responsive: true, maintainAspectRatio: false }
});

function uploadAudio() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = async () => {
        const formData = new FormData();
        formData.append('audio', input.files[0]);
        const res = await fetch('http://localhost:3000/upload-audio', { method: 'POST', body: formData });
        const data = await res.json();
        updateMetrics(data.metrics);
    };
    input.click();
}

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        setupWaveform(stream);
    });
}

function stopRecording() {
    audioContext.close();
}

function setupWaveform(stream) {
    wavesurfer = WaveSurfer.create({ container: '#waveform', waveColor: 'green', interact: false });
    wavesurfer.microphone = WaveSurfer.microphone.create({ wavesurfer });
    wavesurfer.microphone.start();
}

function updateMetrics(metrics) {
    rmsDisplay.textContent = metrics.rms;
    centroidDisplay.textContent = metrics.spectralCentroid;
    engagementDisplay.textContent = metrics.engagementScore;
    chart.data.labels.push(new Date().toLocaleTimeString());
    chart.data.datasets[0].data.push(metrics.rms);
    chart.update();
}
