const express = require('express');
const path = require('path');
const youtubedl = require('yt-dlp-exec');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    //  URL validation (added)
    if (!videoUrl || !videoUrl.startsWith('http')) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    console.log(`[LOG] Download request: ${videoUrl}`);

    try {
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        res.header('Content-Type', 'video/mp4');

        const subprocess = youtubedl.exec(videoUrl, {
            output: '-',
            format: 'best', //  more stable
        });

        subprocess.stdout.pipe(res);

        subprocess.stderr.on('data', (data) => {
            console.error(`[yt-dlp]: ${data}`);
        });

        subprocess.on('error', (err) => {
            console.error('[ERROR] Subprocess:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Download failed' });
            }
        });

        subprocess.on('close', (code) => {
            console.log(`[LOG] Process closed: ${code}`);
        });

        req.on('close', () => {
            console.log('[LOG] Client disconnected');
            subprocess.kill();
        });

    } catch (err) {
        console.error('[ERROR] Unexpected:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Server error' });
        }
    }
});

//  Health check (Render test အတွက်)
app.get('/', (req, res) => {
    res.send("Server is running ");
});

// Start server (ONLY ONE)
app.listen(PORT, () => {
    console.log(`[LOG] Server running on port ${PORT}`);
});
