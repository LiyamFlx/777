let wavesurfer, audioContext, recorder, chunks = [];
let sentimentChart;

// Initialize WaveSurfer
document.addEventListener("DOMContentLoaded", () => {
    wavesurfer = WaveSurfer.create({
        container: "#waveform",
        waveColor: "lime",
        progressColor: "green"
    });
});

// Upload Audio File
document.getElementById("uploadButton").addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";
    input.onchange = (event) => {
        const file = event.target.files[0];
        wavesurfer.load(URL.createObjectURL(file));
    };
    input.click();
});

// Start Recording
document.getElementById("startRecordButton").addEventListener("click", () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        audioContext = new AudioContext();
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.start();

        document.getElementById("startRecordButton").disabled = true;
        document.getElementById("stopRecordButton").disabled = false;
    });
});

// Stop Recording
document.getElementById("stopRecordButton").addEventListener("click", () => {
    recorder.stop();
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        wavesurfer.load(URL.createObjectURL(blob));

        document.getElementById("startRecordButton").disabled = false;
        document.getElementById("stopRecordButton").disabled = true;
    };
});

// Analyze Audio and Sentiment
document.getElementById("analyzeButton").addEventListener("click", () => {
    alert("Analyzing audio...");
    fetch("http://localhost:5000/analyze_audio", {
        method: "POST",
        body: new FormData().append("audio", new Blob(chunks, { type: "audio/wav" }))
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("transcription").innerText = data.transcription;
        document.getElementById("positive").innerText = data.sentiment.pos;
        document.getElementById("neutral").innerText = data.sentiment.neu;
        document.getElementById("negative").innerText = data.sentiment.neg;
        updateSentimentChart(data.sentiment);
    });
});

// Sentiment Chart
function updateSentimentChart(sentiment) {
    if (sentimentChart) sentimentChart.destroy();
    const ctx = document.getElementById("sentimentChart").getContext("2d");
    sentimentChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Positive", "Neutral", "Negative"],
            datasets: [{
                label: "Sentiment Scores",
                data: [sentiment.pos, sentiment.neu, sentiment.neg],
                backgroundColor: ["#28a745", "#ffc107", "#dc3545"]
            }]
        }
    });
}
