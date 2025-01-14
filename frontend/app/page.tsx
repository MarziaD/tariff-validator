"use client";

import React, { useState } from "react";
import axios from "axios";

const Page = () => {
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
      .then(() => alert("Successfully uploaded file"))
      .catch(() => alert("Failed to upload file"));
  };

  return (
    <div>
      <h1>Upload a File</h1>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
    </div>
  );
};

export default Page;
