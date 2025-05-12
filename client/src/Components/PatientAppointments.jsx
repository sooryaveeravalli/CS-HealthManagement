import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/v1/appoinments/patient', {
        withCredentials: true
      });
      setAppointments(data.appointments);
    } catch (error) {
      toast.error('Error fetching appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:8000/api/v1/appoinments/cancel/${appointmentId}`, {}, {
        withCredentials: true
      });
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error cancelling appointment');
    }
  };

  const handleReschedule = async (appointmentId) => {
    // This would typically open a modal or navigate to a rescheduling page
    // For now, we'll just show a message
    toast.info('Rescheduling functionality will be implemented soon');
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
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>

      {appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No appointments found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">
                    Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                  </h3>
                  <p className="text-gray-600">{appointment.doctorId.department}</p>
                </div>
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
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(appointment.appointment_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium">{appointment.appointment_time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reason for Visit</p>
                  <p className="font-medium">{appointment.reason}</p>
                </div>
              </div>

              {appointment.status === 'Booked' && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReschedule(appointment._id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Reschedule
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointments; 