const express = require('express');
const app = express();

// static files (index.html)
app.use(express.static(__dirname));

// test api
app.get('/api', (req, res) => {
  res.json({ message: "API Working" });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
