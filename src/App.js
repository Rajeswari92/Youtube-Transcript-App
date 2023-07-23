// File: App.js
import React, { useState } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";
import Transcript from "./Transcript";
import "./App.css";
const App = () => {
  const [videoId, setVideoId] = useState(""); // Set the video ID here
  const [transcript, setTranscript] = useState([]);
  const handlePlayerReady = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/transcript/${videoId}`
      );
      setTranscript(response.data.transcript);
    } catch (error) {
      console.error("Error fetching transcript:", error);
    }
  };

  const handleVideoIdChange = (event) => {
    setVideoId(event.target.value);
  };

  return (
    <div>
      <div className="form">
        <h1 className="heading">Get a Transcript</h1>
        <form>
          <input
            className="input"
            type="text"
            id="videoIdInput"
            value={videoId}
            onChange={handleVideoIdChange}
            placeholder="Paste YouTube Video ID here..."
          />
          <br />
          <button className="button" onClick={() => handlePlayerReady()}>
            Go
          </button>
        </form>
      </div>
      <VideoPlayer videoId={videoId} />
      <Transcript transcript={transcript} />
    </div>
  );
};

export default App;
