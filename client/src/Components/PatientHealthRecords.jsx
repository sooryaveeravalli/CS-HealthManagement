// src/Components/PatientHealthRecords.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PatientHealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/health-records",
          {
            withCredentials: true,
          }
        );
        setRecords(response.data.records);
      } catch (error) {
        toast.error("Failed to fetch health records.");
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading health records...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Health Records</h1>
      
      {records.length === 0 ? (
        <div>No health records found.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <div key={record.id} className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">{record.title}</h2>
              <p className="text-sm mb-2">Date: {new Date(record.date).toLocaleDateString()}</p>
              <p className="text-sm mb-4">{record.description}</p>
              <a
                href={record.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View Document
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientHealthRecords;
