const express = require('express');
const ytdl = require('ytdl-core');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/api', async (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.json({ error: "Invalid YouTube URL" });
  }

  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: '18' });

    res.json({ download: format.url });
  } catch (err) {
    res.json({ error: "Download failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
