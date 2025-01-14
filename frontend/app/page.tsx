"use client";

import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const onFileUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://localhost:3001/upload", formData)
      .then(() => alert("File uploaded successfully"))
      .catch(() => alert("File upload failed"));
  };

  return (
    <div>
      <h1>Upload a File</h1>
      <input type="file" accept=".csv, .json, .html" onChange={onFileChange} />
      <button onClick={onFileUpload} style={{ marginTop: "10px" }}>
        Upload
      </button>
    </div>
  );
};

export default FileUpload;
