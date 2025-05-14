import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar";
import AppointForm from "../Components/AppointForm";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import AppointDoctors from "../Components/AppointDoctors";
import { toast } from "react-toastify";

const Appointment = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
  };

  const isDoctor = localStorage.getItem("doctor") !== null;
  const isPatient = localStorage.getItem("patient") !== null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isDoctor) {
          // Fetch all appointments for doctor
          const { data } = await axios.get(
            "http://localhost:8000/api/v1/appoinments/all",
            { withCredentials: true }
          );
          setAppointments(data.appointments);
        } else if (isPatient) {
          // Fetch patient's appointments
          const { data } = await axios.get(
            "http://localhost:8000/api/v1/appoinments/patient",
            { withCredentials: true }
          );
          setAppointments(data.appointments);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isDoctor, isPatient]);

  const handleCancel = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/appoinments/cancel/${appointmentId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Appointment cancelled successfully");
      // Refresh appointments based on user type
      const endpoint = isDoctor ? "all" : "patient";
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/appoinments/${endpoint}`,
        { withCredentials: true }
      );
      setAppointments(data.appointments);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling appointment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tl from-[#76dbcf]">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      
      {isDoctor ? (
        // Doctor's View
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-8">My Appointments</h1>
          
          {/* Upcoming Appointments */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>
            {appointments.filter(appointment => {
              const appointmentDate = new Date(appointment.appointment_date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return appointmentDate >= today && appointment.status !== "Cancelled";
            }).length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-lg">
                <p className="text-gray-600 text-lg">No upcoming appointments</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {appointments
                  .filter(appointment => {
                    const appointmentDate = new Date(appointment.appointment_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return appointmentDate >= today && appointment.status !== "Cancelled";
                  })
                  .map((appointment) => (
                    <div
                      key={appointment._id}
                      className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-[1.02] transition-transform"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <img
                            className="w-12 h-12 rounded-full border border-emerald-300"
                            src={appointment.patientId?.avatar?.url || (appointment.patientGender === "Male" ? "../../public/PatientMan.png" : "../../public/PatientWomen.png")}
                            alt=""
                          />
                          <div>
                            <h3 className="text-xl font-semibold">
                              Patient: {appointment.firstName} {appointment.lastName}
                            </h3>
                            <p className="text-gray-600">Reason: {appointment.reason}</p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            appointment.status === "Booked"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">
                            {appointment.appointment_date.split('T')[0].split('-').join('/')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">{appointment.appointment_time}</p>
                        </div>
                      </div>

                      {appointment.status === "Booked" && (
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent Appointments */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Recent Appointments</h2>
            {appointments.filter(appointment => {
              const appointmentDate = new Date(appointment.appointment_date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return appointmentDate < today || appointment.status === "Cancelled";
            }).length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-lg">
                <p className="text-gray-600 text-lg">No recent appointments</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {appointments
                  .filter(appointment => {
                    const appointmentDate = new Date(appointment.appointment_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return appointmentDate < today || appointment.status === "Cancelled";
                  })
                  .map((appointment) => (
                    <div
                      key={appointment._id}
                      className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-[1.02] transition-transform"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <img
                            className="w-12 h-12 rounded-full border border-emerald-300"
                            src={appointment.patientId?.avatar?.url || (appointment.patientGender === "Male" ? "../../public/PatientMan.png" : "../../public/PatientWomen.png")}
                            alt=""
                          />
                          <div>
                            <h3 className="text-xl font-semibold">
                              Patient: {appointment.firstName} {appointment.lastName}
                            </h3>
                            <p className="text-gray-600">Reason: {appointment.reason}</p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            appointment.status === "Booked"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">
                            {appointment.appointment_date.split('T')[0].split('-').join('/')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">{appointment.appointment_time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : isPatient ? (
        // Patient's View
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center mb-8">My Appointments</h1>
          
          {/* Upcoming Appointments */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Upcoming Appointments</h2>
            {appointments.filter(appointment => {
              const appointmentDate = new Date(appointment.appointment_date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return appointmentDate >= today && appointment.status !== "Cancelled";
            }).length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-lg">
                <p className="text-gray-600 text-lg">No upcoming appointments</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {appointments
                  .filter(appointment => {
                    const appointmentDate = new Date(appointment.appointment_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return appointmentDate >= today && appointment.status !== "Cancelled";
                  })
                  .map((appointment) => (
                    <div
                      key={appointment._id}
                      className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-[1.02] transition-transform"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <img
                            className="w-12 h-12 rounded-full border border-emerald-300"
                            src={appointment.doctor?.avatar?.url || (appointment.doctor?.gender === "Male" ? "../../public/man.png" : "../../public/women.png")}
                            alt=""
                          />
                          <div>
                            <h3 className="text-xl font-semibold">
                              Doctor: Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                            </h3>
                            <p className="text-gray-600">Department: {appointment.department}</p>
                            <p className="text-gray-600">Reason: {appointment.reason}</p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            appointment.status === "Booked"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">
                            {appointment.appointment_date.split('T')[0].split('-').join('/')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">{appointment.appointment_time}</p>
                        </div>
                      </div>

                      {appointment.status === "Booked" && (
                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() => handleCancel(appointment._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                          >
                            Cancel Appointment
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent Appointments */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Recent Appointments</h2>
            {appointments.filter(appointment => {
              const appointmentDate = new Date(appointment.appointment_date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return appointmentDate < today || appointment.status === "Cancelled";
            }).length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-lg">
                <p className="text-gray-600 text-lg">No recent appointments</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {appointments
                  .filter(appointment => {
                    const appointmentDate = new Date(appointment.appointment_date);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return appointmentDate < today || appointment.status === "Cancelled";
                  })
                  .map((appointment) => (
                    <div
                      key={appointment._id}
                      className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-[1.02] transition-transform"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <img
                            className="w-12 h-12 rounded-full border border-emerald-300"
                            src={appointment.doctor?.avatar?.url || (appointment.doctor?.gender === "Male" ? "../../public/man.png" : "../../public/women.png")}
                            alt=""
                          />
                          <div>
                            <h3 className="text-xl font-semibold">
                              Doctor: Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                            </h3>
                            <p className="text-gray-600">Department: {appointment.department}</p>
                            <p className="text-gray-600">Reason: {appointment.reason}</p>
                          </div>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            appointment.status === "Booked"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-medium">
                            {appointment.appointment_date.split('T')[0].split('-').join('/')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-medium">{appointment.appointment_time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Not logged in view
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login to Continue</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view or book appointments</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-[#76dbcf] text-black rounded-full font-semibold hover:bg-[#5bc4b7] transition-colors"
            >
              Login as Patient
            </button>
            <button
              onClick={() => navigate("/logindoctor")}
              className="px-6 py-2 bg-[#76dbcf] text-black rounded-full font-semibold hover:bg-[#5bc4b7] transition-colors"
            >
              Login as Doctor
            </button>
          </div>
        </div>
      )}

      <AppointForm data={selectedCard} onClose={handleCloseModal} />
    </div>
  );
};

export default Appointment;
