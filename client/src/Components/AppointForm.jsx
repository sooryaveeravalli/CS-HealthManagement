import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const AppointForm = ({ data, onClose}) => {
  if(!data)return null;

  const docfirst = data.firstName;
  const doclast = data.lastName;
  const dept = data.doctorDepartment;
  const { user } = useContext(Context);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    patientGender: "",
    appointmentDate: "",
    address: "",
    hasVisited: false
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/v1/appoinments/departments');
      setDepartments(data.departments);
    } catch (error) {
      toast.error('Error fetching departments');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.nic || !formData.dob || !formData.patientGender || !formData.appointmentDate || 
        !formData.address) {
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

    // Validate appointment date (must be future date)
    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.error('Please select a future date for the appointment');
      return false;
    }

    return true;
  };

  const handleAppointment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/appoinments/post",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          nic: formData.nic,
          dob: formData.dob,
          patientGender: formData.patientGender,
          appointment_date: formData.appointmentDate,
          appointment_time: data.startTime,
          department: dept,
          doctorId: data._id,
          shiftId: data.shiftId,
          address: formData.address,
          reason: "Regular checkup",
          patientId: user._id
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      toast.success(response.data.message);
      onClose(); // Close the form after successful submission
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="w-2/3 flex flex-col">
        <button onClick={onClose} className="place-self-end mb-3">
          <IoMdCloseCircleOutline size={30} />
        </button>
        <div className="w-full flex flex-col items-center bg-white rounded-2xl p-6">
          <h1 className="font-semibold text-2xl mb-3">
            Schedule Your Appointment
          </h1>
          <form
            className="w-full flex flex-col justify-center items-center"
            onSubmit={handleAppointment}
          >
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="tel"
                name="phone"
                placeholder="Phone No"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                name="nic"
                placeholder="NIC"
                value={formData.nic}
                onChange={handleInputChange}
                required
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full flex justify-around mb-6">
              <select
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                name="patientGender"
                value={formData.patientGender}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Prefer not to say</option>
              </select>
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-full px-14">
              <textarea
                className="w-full bg-zinc-200 rounded-2xl px-4 py-2 outline-none"
                rows="3"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Address"
                required
              />
            </div>
            <div className="w-full px-14 flex gap-10 items-center">
              <p>Have you visited before?</p>
              <input
                type="checkbox"
                name="hasVisited"
                checked={formData.hasVisited}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex w-full justify-center mt-3">
              <button
                className={`w-96 bg-[#76dbcf] rounded-2xl h-10 font-semibold ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5bc4b7]'
                }`}
                type="submit"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointForm;
