const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Home page (UI)
app.get("/", (req, res) => {
  res.send(`
    <h2>🎬 Video Downloader</h2>
    <form action="/download" method="get">
      <input type="text" name="url" placeholder="Paste video link" style="width:300px" required />
      <button type="submit">Download</button>
    </form>
  `);
});

// REAL DOWNLOAD
app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("❌ No URL provided");
  }

  const filePath = "video.mp4";

  exec(`yt-dlp -f best -o ${filePath} ${url}`, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      return res.send("❌ Download failed");
    }

    res.download(filePath, () => {
      console.log("✅ File sent");
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
