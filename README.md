# Caresync - Healthcare Management System

A modern healthcare management platform built with the MERN stack, designed to streamline healthcare services and improve patient care within US hospitals.

## 🎯 Project Overview

This Health Management System (HMS) aims to develop a digital platform that enhances healthcare options within US hospitals. Despite advancements in medical technology, there is still a need for improved streamlining processes in patient management. We seek to enhance doctor-patient communication by providing real-time updates on doctors' availability and facilitating efficient medical record handling, which is crucial for accessing critical patient medical history.

### Key Objectives:
- **Enhanced Communication**: Real-time updates on doctors' availability
- **Efficient Record Management**: Streamlined medical record handling
- **Emergency Response**: Mitigate delays in patient care during emergencies
- **AI-Powered Telehealth**: AI-driven assistance for symptom analysis and doctor inquiries
- **Digital Prescriptions**: Seamless prescription sharing and automated diagnostic report management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sooryaveeravalli/CS-HealthManagement.git
cd CS-HealthManagement
```

2. **Backend Setup**
```bash
cd server
npm install
# Create a .env file with the following variables:
# ATLAS_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# JWT_EXPIRES=7d
# PORT=8000
# CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
# CLOUDINARY_API_KEY=your_cloudinary_api_key
# CLOUDINARY_API_SECRET=your_cloudinary_api_secret
# OPENAI_API_KEY=your_OpenAI_api_key
npm run dev
```

3. **Frontend Setup**
```bash
cd client
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

## 🛠️ Tech Stack

### Frontend
- **React.js (v18.2.0)**: Dynamic, interactive user interfaces for appointment booking and chatbot integration
- **Vite (v5.2.0)**: Fast build tool and development server
- **Tailwind CSS (v3.4.3)**: Utility-first CSS framework for rapid UI development
- **React Router DOM (v6.23.1)**: Client-side routing
- **Axios (v1.6.8)**: HTTP client for API communication
- **React Toastify (v10.0.5)**: User notifications
- **React Icons (v5.2.1)**: Icon library
- **Lucide React (v0.395.0)**: Modern icon set
- **React Markdown (v8.0.7)**: Markdown rendering

### Backend
- **Node.js with Express.js (v4.19.2)**: Non-blocking, event-driven architecture ideal for handling multiple concurrent requests
- **MongoDB with Mongoose (v8.4.0)**: NoSQL database for flexible data storage
- **JWT Authentication (v9.0.2)**: Secure token-based authentication
- **Cloudinary (v2.2.0)**: Cloud-based file upload and management
- **Zod (v3.23.8)**: Schema validation for data integrity
- **bcrypt (v5.1.1)**: Password hashing and security
- **OpenAI (v4.0.0)**: AI-powered features and symptom analysis

### Development Tools
- **Git & GitHub**: Version control and collaboration
- **Jest (v29.7.0)**: Testing framework
- **React Testing Library (v13.0.0)**: Component testing
- **ESLint (v8.57.0)**: Code linting and quality
- **Nodemon (v3.1.3)**: Development server with auto-restart
- **Supertest (v7.1.1)**: API testing

## �� Project Structure

```
CS-HealthManagement/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── Components/     # Reusable UI components
│   │   ├── Pages/         # Page components
│   │   ├── assets/        # Static assets
│   │   ├── test/          # Test files
│   │   └── App.jsx        # Main application component
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   │   ├── user.controllers.js
│   │   ├── appoinment.controllers.js
│   │   ├── chat.controllers.js
│   │   └── msg.controllers.js
│   ├── models/           # Database models
│   │   ├── user.model.js
│   │   ├── patient.model.js
│   │   ├── doctor.model.js
│   │   ├── appoinment.model.js
│   │   ├── healthRecord.model.js
│   │   └── msg.model.js
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── utils/           # Utility functions
│   ├── __tests__/       # Backend tests
│   └── server.js        # Main server file
├── API.md               # Detailed API documentation
└── README.md           # This file
```

## ✨ Core Features

### 1. Secure Authentication & Role-Based Access Control (RBAC)
- **Multi-role Authentication**: Secure login for Patients, Doctors, and Admins
- **Role-Based Permissions**: 
  - Patients: Access to their medical records and appointment schedules
  - Doctors: Access to patient data, shared health records, and prescriptions
  - Admins: System operations and data oversight
- **End-to-End Encryption**: User credentials and medical data encrypted in transit and at rest
- **HTTPS Compliance**: Adherence to security standards

### 2. Optimized Appointment Scheduling
- **Doctor Availability Management**: Real-time shift management and availability tracking
- **Conflict Prevention**: Robust notification system to reduce scheduling conflicts
- **Emergency Case Support**: Priority handling for critical cases without disrupting routine visits
- **Real-time Updates**: Live status updates for appointments

### 3. AI-Powered TeleHealth Support
- **Symptom Checker**: AI-driven pre-diagnosis assistance using LLMs
- **Self-Care Recommendations**: Personalized tips to reduce unnecessary doctor visits
- **Condition Analysis**: Understanding patient conditions and causes
- **Fast-track Assistance**: Efficient healthcare services for patients

### 4. Electronic Health Record Management
- **Real-time Updates**: Multiple stakeholders (doctors, patients, labs) accessing and updating records
- **Unified Patient Profile**: Centralized storage of patient information
- **Emergency Access**: Authorized personal records access for doctors in emergencies
- **Medication Tracking**: Up-to-date medication records

### 5. Digital Prescription Management
- **E-Prescriptions**: Doctors issuing digital prescriptions
- **Medication Tracking**: Patients tracking prescribed medications and history
- **Paperwork Elimination**: Reducing manual documentation
- **Prescription History**: Complete medication history tracking

### Additional Features
- **Real-time Messaging**: Secure communication between patients and doctors
- **File Upload Management**: Secure document and image handling
- **Department-based Scheduling**: Specialized appointment booking by medical departments
- **Health Analytics**: Patient health data analysis and insights

## 🔒 Security Features
- **JWT-based Authentication**: Secure token-based authentication with secure cookies
- **Password Encryption**: bcrypt hashing for password security
- **Role-based Access Control**: Granular permissions for different user types
- **Secure File Uploads**: Cloudinary integration with security measures
- **Input Validation**: Zod schemas for data integrity
- **CORS Protection**: Cross-origin resource sharing security
- **Environment Variable Protection**: Secure configuration management
- **HTTPS Compliance**: End-to-end encryption for data in transit

## 🧪 Testing
- **Unit Tests**: Jest framework for backend testing
- **Component Tests**: React Testing Library for frontend components
- **API Tests**: Supertest for endpoint testing
- **Integration Tests**: Full-stack functionality testing

## 📝 API Documentation
Detailed API documentation is available in [API.md](./API.md)

The API follows RESTful principles and includes endpoints for:
- User authentication and registration
- Appointment management and scheduling
- Doctor operations and shift management
- Patient records and health data
- Admin functions and user management
- Real-time messaging system
- File uploads and management
- AI-powered chat and symptom analysis

## 🚀 Available Scripts

### Backend (server/)
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Frontend (client/)
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm test         # Run tests
```

## 🙏 Acknowledgments
- **MongoDB Atlas** for database hosting
- **Cloudinary** for secure file storage and management
- **OpenAI** for AI-powered features and symptom analysis

## 🔧 Environment Variables

### Backend (.env)
```env
ATLAS_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
PORT=8000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
OPENAI_API_KEY=your_OpenAI_api_key
```

## 📊 Database Models
- **User**: Base user model with authentication and role management
- **Patient**: Patient-specific information, medical history, and profile data
- **Doctor**: Doctor profiles, departments, qualifications, and availability
- **Appointment**: Appointment scheduling, status tracking, and management
- **HealthRecord**: Patient health records, medical data, and history
- **Message**: Real-time messaging system for patient-doctor communication

## 📋 Project Status
- ✅ **Completed Features**: Authentication, Appointment Scheduling, Health Records, Basic AI Support
- 🔄 **In Progress**: Enhanced AI Integration, Advanced Analytics
- ⏳ **Future Enhancements**: Pharmacy Integration, Advanced Emergency Triage

## 📚 Documentation
- [API Documentation](./API.md) - Complete API reference
- [Project Documentation](https://docs.google.com/document/d/1Hi00oxYTPXSSk6t-jKs31vU-ici_KBDCN9a52alyPIc/edit?usp=sharing) - Google Drive project documents
