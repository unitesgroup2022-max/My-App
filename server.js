const express = require('express');

const app = express();

// Home Page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>YouTube Downloader</title>
      </head>
      <body style="text-align:center;font-family:sans-serif;">
        <h2>YouTube Downloader</h2>

        <input id="url" placeholder="Paste YouTube URL" style="width:300px;padding:10px;">
        <br><br>

        <button onclick="go()" style="padding:10px 20px;">Download</button>

        <script>
          function go() {
            var url = document.getElementById('url').value;
            if (!url) {
              alert("Paste URL first!");
              return;
            }
            window.location = '/api?url=' + encodeURIComponent(url);
          }
        </script>
      </body>
    </html>
  `);
});

// API (simple + no error)
app.get('/api', (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("No URL");
  }

  // 👉 YouTube ကို direct ဖွင့် (error မဖြစ်အောင်)
  res.redirect(url);
});

// PORT
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
