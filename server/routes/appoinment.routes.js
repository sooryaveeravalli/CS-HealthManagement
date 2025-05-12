import express from "express"
import {
  postAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
  getDoctorShifts,
  addDoctorShift,
  updateDoctorShift,
  deleteDoctorShift,
  getAvailableShifts,
  getPatientAppointments,
  cancelAppointment,
  rescheduleAppointment,
  getAllDepartments
} from "../controllers/appoinment.controllers.js";
import {isAdminAuthenticated, isPatientAuthenticated, isDoctorAuthenticated} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all departments (public route)
router.get("/departments", getAllDepartments);

// Doctor shift management routes
router.post("/shifts", isDoctorAuthenticated, addDoctorShift);
router.get("/shifts/doctor", isDoctorAuthenticated, getDoctorShifts);
router.put("/shifts/:id", isDoctorAuthenticated, updateDoctorShift);
router.delete("/shifts/:id", isDoctorAuthenticated, deleteDoctorShift);

// Patient appointment booking routes
router.get("/shifts/available", getAvailableShifts);
router.post("/book", isPatientAuthenticated, postAppointment);
router.get("/patient", isPatientAuthenticated, getPatientAppointments);
router.put("/cancel/:id", isPatientAuthenticated, cancelAppointment);
router.put("/reschedule/:id", isPatientAuthenticated, rescheduleAppointment);

// Admin/Doctor appointment management routes
router.get("/all", isDoctorAuthenticated, getAllAppointments);
router.put("/status/:id", isDoctorAuthenticated, updateAppointmentStatus);
router.delete("/:id", isDoctorAuthenticated, deleteAppointment);

export default router;