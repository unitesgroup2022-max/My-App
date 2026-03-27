const express = require('express');
const ytdl = require('ytdl-core');

const app = express();

// Home Page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>YouTube Downloader</title>
      </head>
      <body style="text-align:center;font-family:sans-serif">
        <h2>YouTube Downloader</h2>

        <input id="url" placeholder="Paste YouTube URL here" style="width:300px;padding:10px"/>
        <br><br>

        <button onclick="go()" style="padding:10px 20px">Download</button>

        <script>
          function go() {
            var url = document.getElementById('url').value;
            if(!url){
              alert("Put URL first");
              return;
            }
            window.location.href = '/api?url=' + encodeURIComponent(url);
          }
        </script>
      </body>
    </html>
  `);
});

// API
app.get('/api', async (req, res) => {
  try {
    const url = req.query.url;

    if (!url || !ytdl.validateURL(url)) {
      return res.send("Invalid URL");
    }

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    res.header('Content-Type', 'video/mp4');

    ytdl(url, { filter: 'audioandvideo' }).pipe(res);

  } catch (err) {
    console.log(err);
    res.send("Download error");
  }
});

// PORT (Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
