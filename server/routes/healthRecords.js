import express from "express";
import HealthRecord from "../models/healthRecord.model.js";

const healthRecordsRouter = express.Router();

/**
 * @route   POST /api/v1/create-health-records
 * @desc    Create a new health record
 */
healthRecordsRouter.post("/create-health-records", async (req, res) => {
  try {
    const {
      doctorName,
      doctorDepartment,
      patientEmail,
      patientFirstName,
      patientLastName,
      diagnosis,
      medicinesPrescribed,
      diagnosticTests,
    } = req.body;

    if (!doctorName || !doctorDepartment || !patientEmail || !diagnosis) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRecord = new HealthRecord({
      doctorName,
      doctorDepartment,
      patientEmail,
      patientFirstName,
      patientLastName,
      diagnosis,
      medicinesPrescribed,
      diagnosticTests
    });

    await newRecord.save();
    res.status(201).json({ message: "Health record created successfully" });
  } catch (error) {
    console.error("Error creating health record:", error.message);
    res.status(500).json({ message: "Error creating health record" });
  }
});

export default healthRecordsRouter;
