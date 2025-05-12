import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { Navbar } from "../Components/Navbar";
import { TicketX } from "lucide-react";
import { TicketCheck } from "lucide-react";
import { Calendar, Clock, List } from "lucide-react";

const PatientHome = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:8000/api/v1/appoinments/patient",
          { withCredentials: true }
        );
        console.log(data);
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      }
    };
    fetchAppointments();
  }, []);

  const { firstName, lastName } = JSON.parse(localStorage.getItem("patient"));
  const pat = JSON.parse(localStorage.getItem("patient"));
  
  var c = 0;
  appointments.forEach((obj) => {
    if (obj.patientId === pat._id) {
      c++;
    }
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-tl from-[#76dbcf]">
      <Navbar />
      <div className="h-28 flex justify-around mt-10 px-60">
        <div className="w-1/3 font-semibold text-3xl flex gap-5 items-center">
          <div className="h-full flex flex-col justify-center">
            <h1>Hi, {firstName + " " + lastName}</h1>
          </div>
        </div>
        <div className="w-1/3 flex h-full bg-[#76dbcf] px-4 font-semibold text-2xl rounded-3xl items-center justify-center">
          Appointments Scheduled : {c}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-28 mt-10">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/patient/book-appointment"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold">Book Appointment</h3>
                <p className="text-gray-600">Schedule a new appointment</p>
              </div>
            </div>
          </Link>

          <Link
            to="/patient/appointments"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <List className="w-8 h-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold">My Appointments</h3>
                <p className="text-gray-600">View and manage your appointments</p>
              </div>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold">Upcoming</h3>
                <p className="text-gray-600">{c} appointments scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="px-28 mt-10">
        <h2 className="text-2xl font-semibold mb-6">Recent Appointments</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments && appointments.length > 0 ? (
                appointments
                  .filter((appointment) => appointment.patientId === pat._id)
                  .slice(0, 5)
                  .map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            className="w-8 h-8 rounded-full border border-emerald-300"
                            src={appointment.doctor.avatar?.url || (appointment.doctor.gender === "Male" ? "../../public/man.png" : "../../public/women.png")}
                            alt=""
                          />
                          <span>Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.appointment_date.substring(0, 10)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {appointment.appointment_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            appointment.status === "Booked"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : appointment.status === "Rescheduled"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientHome;
