import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { TicketX, TicketCheck, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/v1/appoinments/all', {
        withCredentials: true
      });
      console.log(data.appointments);
      setAppointments(data.appointments);
    } catch (error) {
      toast.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8000/api/v1/appoinments/update/${appointmentId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success('Appointment status updated successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating appointment status');
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/v1/appoinments/${appointmentId}`, {
        withCredentials: true
      });
      toast.success('Appointment deleted successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting appointment');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/doctor-home"
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <h2 className="text-2xl font-bold">Appointments</h2>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No appointments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        className="w-8 h-8 rounded-full border border-emerald-300"
                        src={appointment.patientId?.avatar?.url || (appointment.patientGender === "Male" ? "../../public/PatientMan.png" : "../../public/PatientWomen.png")}
                        alt=""
                      />
                      <div>
                        <div className="font-medium">
                          {appointment.firstName} {appointment.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(appointment.appointment_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.appointment_time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        appointment.status === 'Booked'
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : appointment.status === 'Rescheduled'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.status === "Cancelled" ? (
                      <div className="flex items-center gap-2 text-red-500">
                        <TicketX className="w-6 h-6" />
                        <span className="text-sm">Cancelled</span>
                      </div>
                    ) : appointment.hasVisited ? (
                      <div className="flex items-center gap-2 text-green-500">
                        <TicketCheck className="w-6 h-6" />
                        <span className="text-sm">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-500">
                        <Clock className="w-6 h-6" />
                        <span className="text-sm">Upcoming</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {appointment.status === 'Booked' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'Cancelled')}
                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(appointment._id, 'Rescheduled')}
                            className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(appointment._id)}
                        className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments; 