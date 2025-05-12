import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

const ShiftManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [newShift, setNewShift] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const navigate = useNavigate();

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Function to validate time format (HH:mm)
  const validateTimeFormat = (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):(00|30)$/;
    return timeRegex.test(time);
  };

  // Function to convert time string to minutes
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to convert minutes to time string
  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Function to generate 30-minute slots between start and end time
  const generateTimeSlots = (startTime, endTime) => {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const slots = [];

    for (let time = startMinutes; time < endMinutes; time += 30) {
      slots.push({
        startTime: minutesToTime(time),
        endTime: minutesToTime(time + 30)
      });
    }

    return slots;
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/v1/appoinments/shifts/doctor', {
        withCredentials: true
      });
      setShifts(data.shifts || []);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to access this feature');
        navigate('/logindoctor');
      } else {
        toast.error(error.response?.data?.message || 'Error fetching shifts');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewShift({
      ...newShift,
      [e.target.name]: e.target.value
    });
  };

  const handleAddShift = async () => {
    try {
      // Validate date
      const selectedDate = new Date(newShift.date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        toast.error("Please select a date from today onwards");
        return;
      }

      // Validate time format
      if (!validateTimeFormat(newShift.startTime) || !validateTimeFormat(newShift.endTime)) {
        toast.error("Time must be in HH:mm format with minutes as 00 or 30");
        return;
      }

      // Validate start time is before end time
      const startMinutes = timeToMinutes(newShift.startTime);
      const endMinutes = timeToMinutes(newShift.endTime);

      if (startMinutes >= endMinutes) {
        toast.error("Start time must be before end time");
        return;
      }

      // Generate time slots
      const timeSlots = generateTimeSlots(newShift.startTime, newShift.endTime);

      // Create shifts for each time slot
      for (const slot of timeSlots) {
        await axios.post(
          'http://localhost:8000/api/v1/appoinments/shifts',
          {
            ...newShift,
            startTime: slot.startTime,
            endTime: slot.endTime
          },
          { withCredentials: true }
        );
      }

      toast.success('Shifts added successfully');
      setNewShift({ date: '', startTime: '', endTime: '' });
      fetchShifts();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to access this feature');
        navigate('/logindoctor');
      } else {
        toast.error(error.response?.data?.message || 'Error adding shift');
      }
    }
  };

  const handleDeleteShift = async (shiftId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/users/shifts/${shiftId}`, {
        withCredentials: true
      });
      toast.success('Shift deleted successfully');
      fetchShifts();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to access this feature');
        navigate('/logindoctor');
      } else {
        toast.error(error.response?.data?.message || 'Error deleting shift');
      }
    }
  };

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
        <h2 className="text-2xl font-bold">Shift Management</h2>
        <div className="w-24"></div> {/* Spacer for alignment */}
      </div>
      
      {/* Add New Shift Form */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Add New Shift</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              min={getTodayDate()}
              value={newShift.date}
              onChange={handleInputChange}
              name="date"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              step="1800"
              value={newShift.startTime}
              onChange={handleInputChange}
              name="startTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <input
              type="time"
              step="1800"
              value={newShift.endTime}
              onChange={handleInputChange}
              name="endTime"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleAddShift}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Shift
        </button>
      </div>

      {/* Shifts List */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold p-4 border-b">Your Shifts</h3>
        <div className="divide-y">
          {shifts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No shifts scheduled yet. Add a new shift above.
            </div>
          ) : (
            shifts.map((shift) => (
              <div key={shift._id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {new Date(shift.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    {shift.startTime} - {shift.endTime}
                  </p>
                  <p className="text-sm text-gray-500">
                    Status: {shift.isAvailable ? 'Available' : 'Booked'}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteShift(shift._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftManagement; 