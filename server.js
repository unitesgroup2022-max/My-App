const express = require('express');
const ytdl = require('ytdl-core');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api', async (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.send("Invalid YouTube URL");
  }

  try {
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    res.header('Content-Type', 'video/mp4');

    ytdl(url, {
      filter: 'audioandvideo',
      quality: 'highest'
    }).pipe(res);

  } catch (err) {
    res.send("Download failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
