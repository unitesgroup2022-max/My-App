const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

// Home route
app.get("/", (req, res) => {
  res.send(" Server is running");
});

// Download route (SIMULATION)
app.get("/download", (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.json({
      status: "error",
      message: "No URL provided"
    });
  }

  // Fake response (UI test only)
  res.json({
    status: "success",
    message: "Download simulated",
    video: url
  });
});

// Start server
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
