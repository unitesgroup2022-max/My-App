const express = require('express');
const ytdl = require('ytdl-core');

const app = express();

//  1. Home page
app.get('/', (req, res) => {
  res.send(`...html code...`);
});


//  2.  ဒီနေရာမှာထည့် (API)
app.get('/api', (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.send("Invalid URL");
  }

  res.header('Content-Disposition', 'attachment; filename="video.mp4"');
  res.header('Content-Type', 'video/mp4');

  ytdl(url, { filter: 'audioandvideo' }).pipe(res);
});


//  3. PORT (အောက်ဆုံး)
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
