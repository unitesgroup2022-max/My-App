const express = require('express');
const path = require('path');
const youtubedl = require('yt-dlp-exec').create({
    binaryPath: require('yt-dlp-exec/bin').path
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Test route (502 fix အတွက် အရေးကြီး)
app.get('/', (req, res) => {
    res.send(" Server is running...");
});

// API endpoint
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Video URL is required' });
    }

    console.log(`[LOG] Download request: ${videoUrl}`);

    try {
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        res.header('Content-Type', 'video/mp4');

        const subprocess = youtubedl.exec(videoUrl, {
            output: '-',
            format: 'bestvideo+bestaudio/best'
        });

        subprocess.stdout.pipe(res);

        subprocess.stderr.on('data', (data) => {
            console.error(`[yt-dlp]: ${data}`);
        });

        subprocess.on('error', (err) => {
            console.error('Error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Download failed' });
            }
        });

        subprocess.on('close', (code) => {
            console.log(`Process closed with code ${code}`);
        });

        req.on('close', () => {
            subprocess.kill();
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
