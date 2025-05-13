import express from "express";
import HealthRecord from "../models/healthRecord.model.js";
import { isPatientAuthenticated, isDoctorAuthenticated } from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";
import { Patient } from "../models/patient.model.js";

const router = express.Router();

/**
 * GET /api/v1/health-records
 * Only accessible by patients to view their own records.
 */
router.get("/", isPatientAuthenticated, async (req, res) => {
  try {
    const patientId = req.user._id;
    const records = await HealthRecord.find({ patientId }).sort({ createdAt: -1 });
    res.status(200).json({ records });
  } catch (error) {
    console.error("Error fetching health records:", error.message);
    res.status(500).json({ message: "Error fetching health records" });
  }
});

/**
 * POST /api/v1/health-records/doctor
 * Only accessible by doctors to create a new health record.
 */
router.post("/doctor", isDoctorAuthenticated, async (req, res) => {
  try {
    const {
      patientId,
      patientFirstName,
      patientLastName,
      diagnosis,
      medicinesPrescribed,
      diagnosticTests,
    } = req.body;

    const doctorName = `${req.user.firstName} ${req.user.lastName}`;
    const doctorDepartment = req.user.department;

    const newRecord = new HealthRecord({
      patientId,
      patientFirstName,
      patientLastName,
      diagnosis,
      medicinesPrescribed: medicinesPrescribed.split(","),
      diagnosticTests: diagnosticTests.split(","),
      doctorName,
      doctorDepartment,
      createdBy: req.user._id,
    });

    await newRecord.save();
    res.status(201).json({ message: "Health record created successfully" });
  } catch (error) {
    console.error("Error creating health record:", error.message);
    res.status(500).json({ message: "Error creating health record" });
  }
});

export default router;
