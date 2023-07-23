import React from "react";

const Transcript = ({ transcript }) => {
  return (
    <div>
      <div>
        {transcript.map((item, index) => (
          <p key={index}>{item.text}</p>
        ))}
      </div>
    </div>
  );
};

export default Transcript;
