const express = require('express');
const ytdl = require('ytdl-core');

const app = express();


// ✅ Home Page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>YouTube Downloader</title>
      </head>
      <body style="text-align:center;font-family:sans-serif;">
        <h2>YouTube Downloader</h2>

        <input id="url" placeholder="Paste YouTube URL" style="width:300px;padding:10px;">
        <br><br>

        <button onclick="go()" style="padding:10px 20px;">Download</button>

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


// ✅ API (Download)
app.get('/api', (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.send("Invalid URL");
  }

  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  res.header('Content-Type', 'video/mp4');

  ytdl(url, {
    quality: 'highest'
  }).pipe(res);
});


// ✅ PORT (Render important)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
