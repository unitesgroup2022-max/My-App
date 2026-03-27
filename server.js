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

// API (SAFE VERSION)
app.get('/api', async (req, res) => {
  try {
    const url = req.query.url;

    if (!url || !ytdl.validateURL(url)) {
      return res.send("Invalid URL");
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

    if (!format || !format.url) {
      return res.send("No video format found");
    }

    res.redirect(format.url);

  } catch (err) {
    console.log(err);
    res.send("Download error");
  }
});

// PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
