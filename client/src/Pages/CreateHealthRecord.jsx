import React, { useState } from "react";
import NavbarDoctor from "../Components/NavbarDoctor";
import axios from "axios";
import { toast } from "react-toastify";

const CreateHealthRecord = () => {
  const [formData, setFormData] = useState({
    doctorName: "",
    doctorDepartment: "",
    patientEmail: "",
    patientFirstName: "",
    patientLastName: "",
    diagnosis: "",
    medicinesPrescribed: "",
    diagnosticTests: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/create-health-records",
        formData
      );

      toast.success(response.data.message);
      setFormData({
        doctorName: "",
        doctorDepartment: "",
        patientEmail: "",
        patientFirstName: "",
        patientLastName: "",
        diagnosis: "",
        medicinesPrescribed: "",
        diagnosticTests: ""
      });
    } catch (error) {
      toast.error("Error creating health record");
    }
  };

  return (
    <div className="sec-1 w-full min-h-screen bg-gradient-to-tl from-[#76dbcf]">
      <NavbarDoctor />

      <div className="p-10 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Create Health Record</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Doctor Name</label>
              <input
                name="doctorName"
                placeholder="Enter Doctor Name"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Department</label>
              <input
                name="doctorDepartment"
                placeholder="Enter Department"
                value={formData.doctorDepartment}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Patient Email</label>
            <input
              name="patientEmail"
              placeholder="Enter Patient Email"
              value={formData.patientEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">First Name</label>
            <input
              name="patientFirstName"
              placeholder="First Name"
              value={formData.patientFirstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Last Name</label>
            <input
              name="patientLastName"
              placeholder="Last Name"
              value={formData.patientLastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Diagnosis</label>
            <textarea
              name="diagnosis"
              placeholder="Enter diagnosis details..."
              value={formData.diagnosis}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg h-24"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Medicines Prescribed</label>
            <textarea
              name="medicinesPrescribed"
              placeholder="Enter medicines..."
              value={formData.medicinesPrescribed}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg h-24"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Diagnostic Tests</label>
            <textarea
              name="diagnosticTests"
              placeholder="Enter diagnostic tests..."
              value={formData.diagnosticTests}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg h-24"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHealthRecord;
