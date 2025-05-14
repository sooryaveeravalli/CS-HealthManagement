import { Appointment, Shift } from "../models/appoinment.model.js";
import { Doctor } from "../models/doctor.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../middlewares/error.middlewares.js";

// Doctor Shift Management
export const addDoctorShift = asyncHandler(async (req, res, next) => {
  const { date, startTime, endTime } = req.body;
  const doctorId = req.user._id;

  const shift = await Shift.create({
    doctorId,
    date,
    startTime,
    endTime
  });

  res.status(201).json({
    success: true,
    message: "Shift added successfully",
    shift
  });
});

export const getDoctorShifts = asyncHandler(async (req, res, next) => {
  const doctorId = req.user._id;
  const shifts = await Shift.find({ doctorId });

  res.status(200).json({
    success: true,
    shifts
  });
});

export const updateDoctorShift = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { date, startTime, endTime, isAvailable } = req.body;

  const shift = await Shift.findById(id);
  if (!shift) {
    return next(new ErrorHandler("Shift not found", 404));
  }

  if (shift.doctorId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update this shift", 403));
  }

  const updatedShift = await Shift.findByIdAndUpdate(
    id,
    { date, startTime, endTime, isAvailable },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Shift updated successfully",
    shift: updatedShift
  });
});

export const deleteDoctorShift = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const shift = await Shift.findById(id);
  if (!shift) {
    return next(new ErrorHandler("Shift not found", 404));
  }

  if (shift.doctorId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to delete this shift", 403));
  }

  await shift.deleteOne();

  res.status(200).json({
    success: true,
    message: "Shift deleted successfully"
  });
});

// Patient Appointment Booking
export const getAvailableShifts = asyncHandler(async (req, res, next) => {
  const { date, department } = req.query;

  // Validate required query parameters
  if (!date || !department) {
    return next(new ErrorHandler("Date and department are required", 400));
  }

  const doctors = await Doctor.find({ doctorDepartment: department });
  const doctorIds = doctors.map(doctor => doctor._id);

  console.log(doctorIds);
  console.log(date);

  const shifts = await Shift.find({
    doctorId: { $in: doctorIds },
    date,
    isAvailable: true
  }).populate("doctorId", "firstName lastName department gender");

  res.status(200).json({
    success: true,
    shifts
  });
});

export const postAppointment = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    patientGender,
    appointment_date,
    appointment_time,
    department,
    doctor,
    address,
    doctorId,
    shiftId,
    reason
  } = req.body;

  const shift = await Shift.findById(shiftId).populate("doctorId", "firstName lastName department gender");
  if (!shift) {
    return next(new ErrorHandler("Shift not found", 404));
  }

  if (!shift.isAvailable) {
    return next(new ErrorHandler("This shift is no longer available", 400));
  }

  const patientId = req.user._id;

  const appointment = await Appointment.create({
    firstName,
    lastName,
    email,
    phone,
    nic,
    dob,
    patientGender,
    appointment_date,
    appointment_time,
    department,
    doctor: {
      firstName: shift.doctorId.firstName,
      lastName: shift.doctorId.lastName,
      gender: shift.doctorId.gender
    },
    address,
    doctorId: shift.doctorId._id,
    patientId,
    shiftId,
    reason,
    status: "Booked"
  });

  shift.isAvailable = false;
  await shift.save();

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    appointment
  });
});

export const getPatientAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find({ patientId: req.user._id })
    .populate("doctorId", "firstName lastName department")
    .populate("shiftId");

  res.status(200).json({
    success: true,
    appointments
  });
});

export const cancelAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  if (appointment.patientId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to cancel this appointment", 403));
  }

  if (appointment.status === "Cancelled") {
    return next(new ErrorHandler("Appointment is already cancelled", 400));
  }

  appointment.status = "Cancelled";
  await appointment.save();

  // Make the shift available again
  const shift = await Shift.findById(appointment.shiftId);
  if (shift) {
    shift.isAvailable = true;
    await shift.save();
  }

  res.status(200).json({
    success: true,
    message: "Appointment cancelled successfully"
  });
});

export const rescheduleAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { newShiftId } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  if (appointment.patientId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to reschedule this appointment", 403));
  }

  const newShift = await Shift.findById(newShiftId);
  if (!newShift) {
    return next(new ErrorHandler("New shift not found", 404));
  }

  if (!newShift.isAvailable) {
    return next(new ErrorHandler("New shift is not available", 400));
  }

  // Make old shift available
  const oldShift = await Shift.findById(appointment.shiftId);
  if (oldShift) {
    oldShift.isAvailable = true;
    await oldShift.save();
  }

  // Update appointment with new shift
  appointment.shiftId = newShiftId;
  appointment.appointment_date = newShift.date;
  appointment.appointment_time = newShift.startTime;
  appointment.status = "Rescheduled";
  await appointment.save();

  // Make new shift unavailable
  newShift.isAvailable = false;
  await newShift.save();

  res.status(200).json({
    success: true,
    message: "Appointment rescheduled successfully",
    appointment
  });
});

// Admin/Doctor Appointment Management
export const getAllAppointments = asyncHandler(async (req, res, next) => {
  const appointments = await Appointment.find({ doctorId: req.user._id })
    .populate("patientId", "firstName lastName email")
    .populate("shiftId");

  res.status(200).json({
    success: true,
    appointments
  });
});

export const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  if (appointment.doctorId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to update this appointment", 403));
  }

  appointment.status = status;
  await appointment.save();

  res.status(200).json({
    success: true,
    message: "Appointment status updated successfully",
    appointment
  });
});

export const deleteAppointment = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  if (appointment.doctorId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized to delete this appointment", 403));
  }

  // Make the shift available again
  const shift = await Shift.findById(appointment.shiftId);
  if (shift) {
    shift.isAvailable = true;
    await shift.save();
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully"
  });
});

// Get all departments from available doctors
export const getAllDepartments = asyncHandler(async (req, res, next) => {
  // Get all doctors who have shifts
  const doctorsWithShifts = await Shift.distinct('doctorId');
  
  // Get unique departments from these doctors
  const departments = await Doctor.find(
    { _id: { $in: doctorsWithShifts } },
    'doctorDepartment'
  ).distinct('doctorDepartment');

  res.status(200).json({
    success: true,
    departments
  });
});
