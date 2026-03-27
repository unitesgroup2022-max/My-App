const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Server running ');
});

app.get('/download', (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send('No URL provided');
  }

  const command = `yt-dlp -o - "${url}"`;

  exec(command, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return res.send('Download failed');
    }

    res.setHeader('Content-Disposition', 'attachment; filename=video.mp4');
    res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
