import React, { useContext, useState } from "react";
import { IoRemoveOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const RegisterDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState(""); 
  const [licenseNumber, setLicenseNumber] = useState(""); 

  const navigateTo = useNavigate();
  const goToLogin = () => {
    navigateTo("/login");
  };
  const goToHome = () => {
    navigateTo("/");
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(
          "http://localhost:8000/api/v1/users/doctor/register", // Ensure this route is created on your server
          {
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender,
            password,
            doctorDepartment,
            yearsOfExperience,
            licenseNumber,
            role: "Doctor", // Set the role as Doctor
          },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          // Reset all fields after successful registration
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setDob("");
          setGender("");
          setPassword("");
          setDoctorDepartment("");
          setYearsOfExperience("");
          setLicenseNumber("");
        });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex">
      <div className="w-1/3 h-screen bg-[#76dbcf] flex flex-col place-content-center items-center rounded-r-full">
        <Link to={"/"}>
          <img className="w-40 mb-10" src="./image.png" alt="" />
        </Link>
        <h2 className="text-4xl flex w-full justify-center font-bold">
          Hello, We are Caresync!!
        </h2>
        <IoRemoveOutline size={80} />
        <p className="text-2xl flex w-full justify-center mb-6">
          Already Have an Account !!!
        </p>
        <button
          className="w-40 rounded-2xl h-10 font-semibold border-solid border-2 border-black"
          onClick={goToLogin}
        >
          Sign In
        </button>
        <button
          className="w-44 mt-5 rounded-2xl h-10 font-semibold border-solid border-2 border-black"
          onClick={goToHome}
        >
          Home
        </button>
      </div>
      <div className="w-2/3 h-screen flex flex-col place-content-center">
        <h2 className="text-4xl flex w-full mb-5 justify-center font-bold">
          Register as Doctor
        </h2>
        <div className="w-full h-fit mt-5">
          <form
            className="w-full flex flex-col justify-center items-center"
            onSubmit={handleRegistration}
          >
            <div className=" w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className=" w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="number"
                placeholder="Mobile Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="Date Of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
              <label className="w-96 h-10 bg-zinc-200 rounded-2xl px-4">
                <select
                  className="w-fit h-10 bg-zinc-200 rounded-2xl  border-0 outline-none"
                  name="selectedGender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="nosay">Prefer not to say</option>
                </select>
              </label>
            </div>
            {/* New Fields for Doctor */}
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="Department"
                value={doctorDepartment}
                onChange={(e) => setDoctorDepartment(e.target.value)}
              />
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="Years of Experience"
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="text"
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>
            <div className=" w-full flex justify-around mb-6">
              <input
                className="w-96 h-10 bg-zinc-200 rounded-2xl px-4 outline-none"
                type="password"
                placeholder="Set up your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex w-full justify-center mt-3">
              <button
                className="w-96 bg-[#76dbcf] rounded-2xl h-10 font-semibold"
                type="submit"
              >
                REGISTER
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterDoctor;
