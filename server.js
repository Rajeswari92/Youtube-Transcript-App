const express = require("express");
const axios = require("axios");

const app = express();
const port = 4000;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

app.get("/api/transcript", async (req, res) => {
  const { url } = req.query;

  if (!url || !isValidYouTubeUrl(url)) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const videoId = getYouTubeVideoId(url);
    const transcript = await fetchYouTubeTranscript(videoId);
    res.json({ transcript });
  } catch (error) {
    console.error("Error fetching transcript:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the transcript." });
  }
});

function isValidYouTubeUrl(url) {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
}

function getYouTubeVideoId(url) {
  const match = url.match(
    /(youtube.com\/watch\?v=|youtu.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match && match[2] ? match[2] : null;
}

async function fetchYouTubeTranscript(videoId) {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=AIzaSyCBsG21_FGcaQePHFqupjn7aH2CAPJgf80`
  );
  const captionUrl = response.data.items[0].snippet?.videoId;

  if (!captionUrl) {
    throw new Error("Transcript not found for this video.");
  }

  const captionResponse = await axios.get(captionUrl);
  const transcriptText = parseTranscript(captionResponse.data);

  return transcriptText;
}

function parseTranscript(xmlData) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlData, "text/xml");
  const textNodes = xmlDoc.getElementsByTagName("text");
  const transcript = Array.from(textNodes).map((node) => ({
    start: parseFloat(node.getAttribute("start")),
    text: node.textContent,
  }));
  return transcript;
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
