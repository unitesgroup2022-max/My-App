const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// Download route
app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("No URL provided");
  }

  const output = "video.mp4";

  const command = `yt-dlp -o ${output} ${url}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
      return res.send("Download failed");
    }

    res.download(output, () => {
      console.log("Downloaded");
    });
  });
});

// Home route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
