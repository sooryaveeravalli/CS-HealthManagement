import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    doctorName: {
      type: String,
      required: true,
    },
    doctorDepartment: {
      type: String,
      required: true,
    },
    patientEmail: {
      type: String,
      required: true,
    },
    patientFirstName: {
      type: String,
      required: true,
    },
    patientLastName: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medicinesPrescribed: {
      type: String,
      required: true,
    },
    diagnosticTests: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
export default HealthRecord;
