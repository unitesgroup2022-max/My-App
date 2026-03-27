const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

// UI Page
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Video Downloader</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; }
          input { width: 80%; padding: 10px; }
          button { padding: 10px 20px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h2>🎬 Video Downloader</h2>
        <input type="text" id="url" placeholder="Paste video link هنا"><br>
        <button onclick="download()">Download</button>

        <p id="result"></p>

        <script>
          function download() {
            const url = document.getElementById("url").value;
            fetch('/download?url=' + encodeURIComponent(url))
              .then(res => res.json())
              .then(data => {
                document.getElementById("result").innerText = data.message;
              });
          }
        </script>
      </body>
    </html>
  `);
});

// API
app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({
      status: "error",
      message: "No URL provided"
    });
  }

  res.json({
    status: "success",
    message: "Download simulated",
    video: url
  });
});

app.listen(PORT, () => {
  console.log("🚀 Server running");
});
