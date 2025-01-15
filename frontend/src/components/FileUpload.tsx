"use client";

import React, { useState } from "react";
import axios from "axios";
import { ValidationResults } from "./ValidationResults";
import { ValidationResult } from "../../../backend/src/types/ocpi";
import { Button } from "@nextui-org/button";

export const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setValidationResult(null);
    }
  };

  const onFileUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/validate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setValidationResult(response.data);
    } catch (error) {
      setError("Failed to validate file");
      console.error("Validation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="container text-center px-6 py-4">
        <h1 className="text-3xl font-semibold text-white mb-6">
          OCPI Tariff Validator
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 text-red-300 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            type="file"
            onChange={onFileChange}
            accept=".csv,.json,.html"
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              cursor-pointer
              focus:outline-none"
            disabled={loading}
          />
        </div>

        <Button
          onPress={onFileUpload}
          isDisabled={!file || loading}
          className="w-full text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-green-400"
        >
          {loading ? "Validating..." : "Validate"}
        </Button>

        {validationResult && <ValidationResults result={validationResult} />}
      </div>
    </div>
  );
};
