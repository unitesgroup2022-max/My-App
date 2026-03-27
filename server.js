const express = require('express');
const ytdl = require('ytdl-core');

const app = express();

// Home page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Downloader</title></head>
      <body style="text-align:center;font-family:sans-serif;">
        <h2>YouTube Downloader</h2>
        <input id="url" placeholder="Paste YouTube URL">
        <br><br>
        <button onclick="go()">Download</button>

        <script>
          function go() {
            var url = document.getElementById('url').value;
            window.location = '/api?url=' + encodeURIComponent(url);
          }
        </script>
      </body>
    </html>
  `);
});

// API
app.get('/api', async (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.send("Invalid URL");
  }

  res.header('Content-Disposition', 'attachment; filename="video.mp4"');

  ytdl(url, {
    quality: 'highest',
  }).pipe(res);
});

// PORT (IMPORTANT)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
