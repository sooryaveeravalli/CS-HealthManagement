import React, { useState, useEffect } from "react";
import { Navbar } from "../Components/Navbar";
import axios from "axios";

const HealthRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/health-records", {
          withCredentials: true,
        });
        setRecords(response.data.records);
      } catch (error) {
        console.error("Error fetching health records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  return (
    <div className="sec-1 w-full h-full bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="header w-full flex justify-center mt-7">
        <h1 className="font-semibold text-2xl">Your Health Records</h1>
      </div>
      <div className="p-5 flex justify-center flex-wrap">
        {loading ? (
          <h1>Loading Health Records...</h1>
        ) : records.length > 0 ? (
          records.map((record) => (
            <div key={record._id} className="bg-white p-4 m-2 rounded-lg shadow-lg">
              <h2>{record.diagnosis}</h2>
              <p>Medicines: {record.medicinesPrescribed.join(", ")}</p>
              <p>Tests: {record.diagnosticTests.join(", ")}</p>
              <p>Doctor: {record.doctorName}</p>
            </div>
          ))
        ) : (
          <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded-lg">
            <p>No health records available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthRecordsPage;
