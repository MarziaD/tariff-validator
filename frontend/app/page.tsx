"use client";
import React, { useState } from "react";

const Home = () => {
  const [discrepancies, setDiscrepancies] = useState([]);

  const handleValidation = async () => {
    const response = await fetch("http://localhost:3001/api/validate-tariffs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cpoType: "csv",
        filePath: "./cpoData.csv",
      }),
    });
    const data = await response.json();
    setDiscrepancies(data.discrepancies || []);
  };

  return (
    <div>
      <h1>Tariff Validator</h1>
      <button onClick={handleValidation}>Validate Tariffs</button>
      {discrepancies.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Discrepancy</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.map((discrepancy, index) => (
              <tr key={index}>
                <td>{discrepancy.cpoTariff?.region || "N/A"}</td>
                <td>{discrepancy.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Home;
