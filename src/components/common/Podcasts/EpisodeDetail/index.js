import React from "react";
import "./style.css";
import Button from "../../Button";

const EpisodeDetail = ({ title, description, index, audioFile, onClick }) => {
  return (
    <div style={{ width: "100%" }}>
      <h1
        style={{
          textAlign: "left",
          marginBottom: 0,
        }}
      >
        {index}. {title}
      </h1>
      <p style={{ marginLeft: "1rem" }} className="podcast_desc">
        {description}
      </p>
      <Button
        text={"Play"}
        onClick={() => onClick(audioFile)}
        width={"100px"}
      />
    </div>
  );
};

export default EpisodeDetail;
