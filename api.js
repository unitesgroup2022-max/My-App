export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.json({ error: "No URL provided" });
  }

  // test response
  res.json({
    message: "API Working ✅",
    your_url: url
  });
}
