const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 10000;

// Home
app.get("/", (req, res) => {
  res.send(" Server running...");
});

// Download endpoint
app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send(" Please provide URL");
  }

  const command = `yt-dlp -f best -o - "${url}"`;

  exec(command, { maxBuffer: 1024 * 1024 * 50 }, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return res.send(" Download failed");
    }

    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    res.send(stdout);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
