import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Appointment from "./Pages/Appointment";
import HealthRecordsPage from "./Pages/HealthRecordsPage";
import CreateHealthRecord from "./Pages/CreateHealthRecord";
import QuickHelp from "./Pages/QuickHelp";
import Login from "./Pages/login";
import Register from "./Pages/Register";
import RegisterDoctor from "./Pages/RegisterDoctor";
import Loginadmin from "./Pages/loginadmin";
import Logindoctor from "./Pages/logindoctor";
import AdminHome from "./Pages/AdminHome";
import MessagesDisp from "./Pages/MessagesDisp";
import AddAdmin from "./Pages/AddAdmin";
import AddDoctor from "./Pages/AddDoctor";
import Doctors from "./Pages/Doctors";
import { useContext } from "react";
import { useEffect } from "react";
import { Context } from "./main";
import Test from "./Pages/test";
import DoctorHome from "./Pages/DoctorHome";
import PatientHome from "./Pages/PatientHome";
import ChatBotHelp from "./Pages/ChatBotHelp";
import ShiftManagement from "./Components/ShiftManagement";
import BookAppointment from "./Components/BookAppointment";
import PatientAppointments from "./Components/PatientAppointments";
import DoctorAppointments from "./Components/DoctorAppointments";
import axios from "axios";import PatientHealthRecords from "./Components/PatientHealthRecords";

import Testapp from "./test/testapp";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(Context);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/users/patient/profile",
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(true);
        setUser(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/health-records" element={<HealthRecordsPage />} />
          <Route path="/create-health-records" element={<CreateHealthRecord />} />
          <Route path="/quick-help" element={<QuickHelp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logindoctor" element={<Logindoctor />} />
          <Route path="/loginadmin" element={<Loginadmin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-doctor" element={<RegisterDoctor />} />

          {/* Protected Routes */}
          <Route path="/appointment" element={
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          } />
          <Route path="/quick-help" element={
            <ProtectedRoute>
              <QuickHelp />
            </ProtectedRoute>
          } />
          <Route path="/chatBotHelp" element={
            <ProtectedRoute>
              <ChatBotHelp />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <MessagesDisp />
            </ProtectedRoute>
          } />
          <Route path="/doctor-addnew" element={
            <ProtectedRoute>
              <AddDoctor />
            </ProtectedRoute>
          } />
          <Route path="/admin-addnew" element={
            <ProtectedRoute>
              <AddAdmin />
            </ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute>
              <Doctors />
            </ProtectedRoute>
          } />
          <Route path="/test" element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          } />
          <Route path="/patient-home" element={
            <ProtectedRoute>
              <PatientHome />
            </ProtectedRoute>
          } />
          <Route path="/doctor-home" element={
            <ProtectedRoute>
              <DoctorHome />
            </ProtectedRoute>
          } />
          <Route path="/testapp" element={
            <ProtectedRoute>
              <Testapp />
            </ProtectedRoute>
          } />
          <Route path="/doctor/shifts" element={
            <ProtectedRoute>
              <ShiftManagement />
            </ProtectedRoute>
          } />
          <Route path="/doctor/appointments" element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          } />
          <Route path="/patient/book-appointment" element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute>
              <PatientAppointments />
            </ProtectedRoute>
          } />
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
