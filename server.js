const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("❌ No URL provided");
  }

  // yt-dlp command with headers (IMPORTANT)
  const command = `yt-dlp -f best -o - "${url}" --no-playlist --add-header "User-Agent: Mozilla/5.0"`;

  exec(command, { maxBuffer: 1024 * 1024 * 50 }, (err, stdout, stderr) => {
    if (err) {
      console.log(stderr);
      return res.send("❌ Download failed");
    }

    res.setHeader("Content-Disposition", "attachment; filename=video.mp4");
    res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
