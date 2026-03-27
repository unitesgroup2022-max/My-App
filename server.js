app.get('/api', async (req, res) => {
  const url = req.query.url;

  if (!ytdl.validateURL(url)) {
    return res.send("Invalid YouTube URL");
  }

  try {
    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(url, { format: 'mp4' }).pipe(res);
  } catch (err) {
    res.send("Download failed");
  }
});
