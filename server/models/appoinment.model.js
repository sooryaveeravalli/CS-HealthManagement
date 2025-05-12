import mongoose from "mongoose";
import validator from "validator";

const shiftSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor Id Is Required!"],
    ref: "Doctor"
  },
  date: {
    type: Date,
    required: [true, "Shift Date Is Required!"],
  },
  startTime: {
    type: String,
    required: [true, "Start Time Is Required!"],
  },
  endTime: {
    type: String,
    required: [true, "End Time Is Required!"],
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const appointmentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name Is Required!"],
    minLength: [3, "First Name Must Contain At Least 3 Characters!"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name Is Required!"],
    minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Email Is Required!"],
    validate: [validator.isEmail, "Provide A Valid Email!"],
  },
  phone: {
    type: String,
    required: [true, "Phone Is Required!"],
    minLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
    maxLength: [10, "Phone Number Must Contain Exact 10 Digits!"],
  },
  nic: {
    type: String,
    required: [true, "NIC Is Required!"],
    validate: {
      validator: function(v) {
        return /^(\d{12}|\d{9}[VX])$/.test(v);
      },
      message: "NIC must be either 12 digits or 9 digits followed by V/X"
    },
  },
  dob: {
    type: Date,
    required: [true, "DOB Is Required!"],
  },
  patientGender: {
    type: String,
    required: [true, "Patient Gender Is Required!"],
    enum: ["Male", "Female", "Other"],
  },
  appointment_date: {
    type: Date,
    required: [true, "Appointment Date Is Required!"],
  },
  appointment_time: {
    type: String,
    required: [true, "Appointment Time Is Required!"],
  },
  department: {
    type: String,
    required: [true, "Department Name Is Required!"],
  },
  doctor: {
    firstName: {
      type: String,
      required: [true, "Doctor Name Is Required!"],
    },
    lastName: {
      type: String,
      required: [true, "Doctor Name Is Required!"],
    },
    gender: {
      type: String,
      required: [true, "Doctor Gender Is Required!"],
      enum: ["Male", "Female", "Other"],
    }
  },
  hasVisited: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: [true, "Address Is Required!"],
  },
  doctorId: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Doctor Id Is Invalid!"],
  },
  patientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Patient Id Is Required!"],
  },
  status: {
    type: String,
    enum: ["Booked", "Cancelled", "Rescheduled"],
    default: "Booked"
  },
  shiftId: {
    type: mongoose.Schema.ObjectId,
    ref: "Shift",
    required: [true, "Shift Id Is Required!"],
  },
  reason: {
    type: String,
    required: [true, "Reason for appointment is required!"],
  }
}, {
  timestamps: true
});

export const Shift = mongoose.model("Shift", shiftSchema);
export const Appointment = mongoose.model("Appointment", appointmentSchema);
