import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  patientFirstName: { type: String, required: true },
  patientLastName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  medicinesPrescribed: { type: [String], required: true },
  diagnosticTests: { type: [String], required: true },
  doctorName: { type: String, required: true },
  doctorDepartment: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  createdAt: { type: Date, default: Date.now },
});

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
export default HealthRecord;
