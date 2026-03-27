const express = require('express');
const path = require('path');
const youtubedl = require('yt-dlp-exec');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API endpoint to download video
app.get('/api/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Video URL is required' });
    }

    console.log(`[LOG] Received request to download: ${videoUrl}`);

    try {
        // Validate URL and get video info first (optional but good for error handling)
        // For simplicity and streaming, we use the yt-dlp-exec to pipe output
        
        // Set response headers for the video download
        // We'll name the file 'video.mp4' as a default, or try to get the title
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');
        res.header('Content-Type', 'video/mp4');

        // Execute yt-dlp and stream the output to the response
        // Using -o - to output to stdout
        const subprocess = youtubedl.exec(videoUrl, {
            output: '-',
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        });

        // Pipe the stdout of the subprocess to the express response
        subprocess.stdout.pipe(res);

        // Handle errors in the stream
        subprocess.stderr.on('data', (data) => {
            console.error(`[yt-dlp stderr]: ${data}`);
        });

        subprocess.on('error', (err) => {
            console.error('[LOG] Subprocess error:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to process video download' });
            }
        });

        // When the process finishes
        subprocess.on('close', (code) => {
            console.log(`[LOG] yt-dlp process closed with code ${code}`);
        });

        // If the client closes the connection, kill the subprocess
        req.on('close', () => {
            console.log('[LOG] Client closed connection, killing subprocess');
            subprocess.kill();
        });

    } catch (error) {
        console.error('[LOG] Unexpected error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`[LOG] Server is running on http://localhost:${PORT}`);
});
