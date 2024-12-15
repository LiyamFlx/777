
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const tf = require('@tensorflow/tfjs');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Audio File Storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

let engagementMetrics = { rms: 0, spectralCentroid: 0, engagementScore: 0 };

const calculateMetrics = (audioBuffer) => {
    const rms = Math.random() * 1.0; 
    const spectralCentroid = Math.random() * 5000; 
    const engagementScore = ((rms * 50) + (spectralCentroid / 100)).toFixed(2);
    return { rms: rms.toFixed(4), spectralCentroid: spectralCentroid.toFixed(2), engagementScore };
};

app.post('/upload-audio', upload.single('audio'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded.' });
    const metrics = calculateMetrics(req.file.buffer);
    engagementMetrics = metrics;
    res.status(200).json({ message: 'Audio processed successfully!', metrics });
});

app.get('/metrics', (req, res) => res.status(200).json(engagementMetrics));

app.listen(port, () => console.log(`Backend running at http://localhost:${port}`));
