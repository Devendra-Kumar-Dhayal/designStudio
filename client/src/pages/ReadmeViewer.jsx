import React, { useEffect, useState } from "react";
// import Readme from "../../../README.md";

const ReadmeViewer = () => {
  const [readmeContent, setReadmeContent] = useState("");

  // useEffect(() => {
  //   const readmePath = "../../../../../README.md";

  //   fetch(readmePath)
  //     .then((response) => response.text())
  //     .then((data) => {
  //       setReadmeContent(data);
  //     })
  //     .catch((error) => console.error("Error reading README file:", error));
  // }, []); // Empty dependency array ensures the effect runs only once

  console.log(readmeContent)

  return (
    <div>
      <h1>README File</h1>
      {/* <pre>{readmeContent}</pre> */}
    </div>
  );
};

export default ReadmeViewer;
