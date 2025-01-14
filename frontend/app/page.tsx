"use client";

import React, { useState } from "react";
import axios from "axios";

interface ValidationResult {
  isValid: boolean;
  discrepancies: Array<{
    field: string;
    expected: any;
    actual: any;
    message: string;
  }>;
}

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setValidationResult(null);

    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const selectedFile = files[0];

    const allowedTypes = [
      "text/csv",
      "application/json",
      "text/html",
      "application/vnd.ms-excel",
      "text/plain",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      const extension = selectedFile.name.split(".").pop()?.toLowerCase();
      if (!["csv", "json", "html"].includes(extension || "")) {
        setError("Please upload only CSV, JSON, or HTML files");
        return;
      }
    }

    setFile(selectedFile);
  };

  const onFileUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setValidationResult(response.data.validationResult);
    } catch (error) {
      console.error("Upload error:", error);
      setError(error instanceof Error ? error.message : "File upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">OCPI Tariff Validator</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="mb-4">
        <input
          type="file"
          onChange={onFileChange}
          accept=".csv,.json,.html"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-violet-50 file:text-violet-700
            hover:file:bg-violet-100"
          disabled={loading}
        />
      </div>

      <button
        onClick={onFileUpload}
        disabled={!file || loading}
        className={`w-full py-2 px-4 rounded ${
          !file || loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? "Validating..." : "Validate"}
      </button>

      {validationResult && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Validation Results</h2>

          <div
            className={`p-4 rounded mb-4 ${
              validationResult.isValid
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {validationResult.isValid
              ? "All validations passed!"
              : "Discrepancies found"}
          </div>

          {!validationResult.isValid && (
            <div className="space-y-4">
              {validationResult.discrepancies.map((discrepancy, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded border border-gray-200"
                >
                  <p className="font-semibold">{discrepancy.field}</p>
                  <p className="text-sm text-gray-600">
                    Expected: {JSON.stringify(discrepancy.expected)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Actual: {JSON.stringify(discrepancy.actual)}
                  </p>
                  <p className="text-sm text-red-600 mt-2">
                    {discrepancy.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
