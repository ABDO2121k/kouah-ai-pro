import React from "react";

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Chat Interface</h1>
      <iframe
        src="/api/frame"
        style={{
          width: "100%",
          height: "100vh",
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
        }}
        title="Chat Interface"
      />
    </div>
  );
};

export default HomePage;
