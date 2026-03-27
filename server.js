const express = require('express');
const ytdl = require('ytdl-core');

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="text-align:center;font-family:sans-serif">
        <h2>YouTube Downloader</h2>
        <input id="url" placeholder="Paste URL" style="padding:10px;width:300px"/>
        <br><br>
        <button onclick="go()">Download</button>

        <script>
          function go(){
            var url = document.getElementById('url').value;
            if(!url){ alert("Put URL first"); return; }
            window.location.href = '/api?url=' + encodeURIComponent(url);
          }
        </script>
      </body>
    </html>
  `);
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
