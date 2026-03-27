const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Home Page
app.get("/", (req, res) => {
  res.send(`
    <h2>🎬 Video Downloader</h2>
    <form action="/download">
      <input name="url" placeholder="Paste video link" style="width:300px"/>
      <button type="submit">Download</button>
    </form>
  `);
});

// Download Route
app.get("/download", (req, res) => {
  const url = req.query.url;

  res.send(`
    <h3>✅ Video Ready</h3>
    <p>${url}</p>
    <a href="${url}" target="_blank">▶ Open Video</a>
  `);
});

app.listen(PORT, () => {
  console.log("🚀 Server running...");
});
