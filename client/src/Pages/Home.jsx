import React from "react";
import { Navbar } from "../Components/Navbar";
import { Department } from "../Components/Department";
import Message from "../Components/Message";
import { Footer } from "../Components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatBubble from "../Components/ChatBubble";
function decode(token) {
  try {
    const tokenValue = JSON.parse(window.atob(token.split(".")[1]));
    // console.log(tokenValue);
    return tokenValue;
  } catch (e) {
    return undefined;
  }
}
const adminData = decode(localStorage.getItem("authToken"));
// console.log(adminData);

const Home = () => {
  return (
    <>
{/* Navbar + Hero Section */}
<div className="sec-1 w-full h-fit bg-gradient-to-tr from-cyan-300 to-green-200">

  <Navbar />
  <div className="hero max-w-screen-2xl w-full flex items-center px-32 py-16 mx-auto h-[700px]">
    <div className="hero-pic w-2/5 flex justify-center">
      <img className="w-3/4 lg:w-4/5" src="/doctor-patient.png" alt="Doctor with Patient" />
    </div>
    <div className="hero-text w-3/5 flex flex-col items-center text-center space-y-4">
      <h1 className="font-bold text-5xl">We are Caresync</h1>
      <h1 className="text-4xl">We are here to provide world</h1>
      <h1 className="text-4xl">class healthcare for everyone</h1>
    </div>
  </div>
</div>



      {/* Message Section + footer */}
      <div className="sec-1 w-full h-fit bg-gradient-to-tr from-cyan-300 to-green-200">

       {/* <div className="department-head flex justify-center">
          <h1 className="text-3xl font-semibold mt-1">Send Us A Message</h1>
        </div>
        <Message /> */}
        <div className="footer px-10 ">
          <hr className="h-px my-8 border-0 bg-[#76dbcf]" />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;
