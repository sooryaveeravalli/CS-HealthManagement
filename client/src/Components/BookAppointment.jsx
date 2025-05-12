import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { Context } from "../main";

const BookAppointment = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableShifts, setAvailableShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nic: '',
    dob: '',
    patientGender: '',
    address: '',
    reason: ''
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment && selectedDate) {
      fetchAvailableShifts();
    } else {
      setAvailableShifts([]);
      setSelectedShift(null);
    }
  }, [selectedDepartment, selectedDate]);

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/v1/appoinments/departments');
      console.log(data);
      setDepartments(data.departments);
    } catch (error) {
      toast.error('Error fetching departments');
    }
  };

  const fetchAvailableShifts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/appoinments/shifts/available?department=${selectedDepartment}&date=${selectedDate}`
      );
      setAvailableShifts(data.shifts);
      setSelectedShift(null); // Reset selected shift when fetching new shifts
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching available shifts');
      setAvailableShifts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!selectedShift) {
      toast.error('Please select an available shift');
      return false;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.nic || !formData.dob || !formData.patientGender || !formData.address || !formData.reason) {
      toast.error('Please fill in all required fields');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Validate phone number (assuming 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    // Validate NIC format (assuming 12 digits or 9 digits with 'V' or 'X' at the end)
    const nicRegex = /^(\d{12}|\d{9}[VX])$/;
    if (!nicRegex.test(formData.nic)) {
      toast.error('Please enter a valid NIC number (12 digits or 9 digits with V/X)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:8000/api/v1/appoinments/book',
        {
          ...formData,
          department: selectedDepartment,
          appointment_date: selectedDate,
          appointment_time: selectedShift.startTime,
          shiftId: selectedShift._id,
          doctorId: selectedShift.doctorId._id,
          doctor: {
            firstName: selectedShift.doctorId.firstName,
            lastName: selectedShift.doctorId.lastName
          },
          patientId: user._id
        },
        {
          withCredentials: true
        }
      );
      
      toast.success('Appointment booked successfully');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nic: '',
        dob: '',
        patientGender: '',
        address: '',
        reason: ''
      });
      setSelectedDepartment('');
      setSelectedDate('');
      setAvailableShifts([]);
      setSelectedShift(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking appointment');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Book an Appointment</h2>
        <button
          onClick={() => navigate('/patient-home')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Appointments
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Department and Date Selection */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Select Department and Date</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Available Shifts */}
          <div className="mt-4">
            <h4 className="font-medium mb-2">Available Shifts</h4>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : availableShifts.length > 0 ? (
              <div className="space-y-2">
                {availableShifts.map((shift) => (
                  <div
                    key={shift._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedShift?._id === shift._id
                        ? 'bg-indigo-100 border-2 border-indigo-500'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => setSelectedShift(prev => prev?._id === shift._id ? null : shift)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">
                          Dr. {shift.doctorId.firstName} {shift.doctorId.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {shift.doctorId.department}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-indigo-600">
                          {shift.startTime} - {shift.endTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                {selectedDepartment && selectedDate
                  ? 'No available shifts found for the selected date'
                  : 'Please select a department and date to view available shifts'}
              </div>
            )}
          </div>
        </div>

        {/* Appointment Form */}
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                NIC Number
                <span className="text-xs text-gray-500 ml-1">
                  (National Identity Card)
                </span>
              </label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleInputChange}
                placeholder="Enter your NIC number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: 12 digits or 9 digits with V/X at the end
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="patientGender"
                value={formData.patientGender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Reason for Visit</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!selectedShift}
            className={`mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md ${
              !selectedShift ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            Book Appointment
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment; 