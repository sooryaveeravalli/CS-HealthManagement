# cs520-healthmanagementsystem
CS 520 - Health Management System ; Team_19

# Steps to run the project  
In Server directory:  
npm install  
npm start  

In client directory:  
npm install  
npm run dev  


# E-Healthcare Management System

Welcome to Caresync, a cutting-edge platform designed to revolutionize healthcare delivery and management. Built with the powerful MERN stack, our system ensures a seamless and efficient experience for both healthcare providers and patients.

1\. Introduction
----------------

### 1.1 Purpose

The purpose of this document is to provide a comprehensive overview of the requirements for the HMS (Health Management System) website. This system is designed to streamline and manage healthcare services, including patient appointments, AI telehealth, doctor schedules, and administrative tasks, with integrated machine learning for health predictions.


2\. Description
-----------------------

### 2.1 Product Perspective

The e-HMS website is designed to be a standalone application that integrates various aspects of healthcare management. It provides a unified platform for patients, doctors, and administrators, enabling seamless interaction and data management.

### 2.2 Product Features

-   **Patient Module**: Appointment booking, dashboard for viewing appointment status.
-   **Doctor Module**: Personalized dashboard for managing appointments (accept/reject).
-   **Frontend**: UI is developed using React and tailwindCSS.
-   **Backend**: The native server is built using Node and Express with RESTful API design.
-   **Secure Authentication**: Stateful JWT for managing user sessions.
-   **Cloud Storage**: Cloudinary for managing image uploads.
-   **Form Validation**: Zod for validating user inputs.
-   **Database**: MongoDB for storing user and appointment data.

### 2.3 User Classes and Characteristics

-   **Patients**: Users who can book appointments and view their status. They require an intuitive interface and easy navigation.
-   **Doctors**: Users who manage appointments. They need a personalized dashboard to efficiently accept or reject appointments.
-   **Admins**: Users who manage the system, including adding/removing doctors and handling user queries. They need access to comprehensive user management tools.

### 2.4 Operating Environment

-   **Frontend**: React.js, compatible with modern web browsers.
-   **Backend**: Node.js with Express.js, hosted on a server or cloud platform.
-   **Database**: MongoDB, either locally hosted or cloud-based (e.g., MongoDB Atlas).

### 2.5 Design and Implementation Constraints

-   **Scalability**: The system should be designed to handle a growing number of users and data.
-   **Security**: Data must be protected with secure authentication and storage practices.
-   **Performance**: The system should provide quick responses and minimal downtime.            

### 2.6 **Benefits:**

* **Enhanced Patient Care:** Streamlined processes and easy access to medical records improve patient outcomes.
    
* **Operational Efficiency:** Automated scheduling, billing, and record-keeping reduce administrative burdens.
    
* **Secure & Compliant:** Adherence to healthcare regulations ensures data privacy and security.
    
* **Scalable & Flexible:** The MERN stack provides a robust foundation that can scale with your needs.
