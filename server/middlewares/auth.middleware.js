import {asyncHandler} from "../utils/asyncHandler.js"
import ErrorHandler from "./error.middlewares.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";

export const isAdminAuthenticated=asyncHandler(async (req,res,next)=>{
    // console.log(req.cookies)
    const token= req.cookies.adminToken;
    if(!token) return next(new ErrorHandler("Admin is not authenticated", 400));

    const decoded=jwt.decode(token, process.env.JWT_SECRET);
    req.user=await User.findById(decoded.id);

    if(req.user.role!="Admin"){
        return next(new ErrorHandler(`${req.user.role} is not authorized for this resource!`, 403));
    }
    next();
})

export const isPatientAuthenticated=asyncHandler(async (req,res,next)=>{
    const token= req.cookies.patientToken;
    if(!token) return next(new ErrorHandler("Patient is not authenticated", 400));
   
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Patient.findById(decoded.id);
        if(req.user.role !== "Patient"){
            return next(new ErrorHandler(`${req.user.role} is not authorized for this resource!`, 403));
        }
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
})

export const isDoctorAuthenticated=asyncHandler(async (req,res,next)=>{
    const token = req.cookies.doctorToken;
    if(!token) return next(new ErrorHandler("Doctor is not authenticated", 400));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Doctor.findById(decoded.id);
        if(req.user.role !== "Doctor"){
            return next(new ErrorHandler(`${req.user.role} is not authorized for this resource!`, 403));
        }
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
})