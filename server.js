const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Download API
app.get('/api', (req, res) => {
  const url = req.query.url;

  if (!url || !ytdl.validateURL(url)) {
    return res.send("Invalid URL");
  }

  try {
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    res.header('Content-Type', 'video/mp4');

    ytdl(url, {
      filter: 'audioandvideo',
      quality: 'highest'
    }).pipe(res);

  } catch (e) {
    console.log(e);
    res.send("Error downloading");
  }
});

// IMPORTANT (မပျက်မကွက်လိုတယ်)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
