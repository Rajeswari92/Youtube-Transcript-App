import React from "react";
import YouTube from "react-youtube";
import "./VideoPlayer.css";
const VideoPlayer = ({ videoId }) => {
  return <div className="video">{<YouTube videoId={videoId} />}</div>;
};

export default VideoPlayer;
