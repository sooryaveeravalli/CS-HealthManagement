# Caresync - Healthcare Management System

A modern healthcare management platform built with the MERN stack, designed to streamline healthcare services and improve patient care.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/cs520-healthmanagementsystem.git
cd cs520-healthmanagementsystem
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
- React.js (v18.2.0)
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary
- Zod Validation

### Development Tools
- Git & GitHub
- Jest
- React Testing Library
- ESLint
- Nodemon

## ✨ Features

### Patient Features
- User registration and authentication
- Appointment booking and management
- View medical history
- Real-time appointment status updates
- Secure profile management

### Doctor Features
- Personalized dashboard
- Appointment management
- Patient history access
- Schedule management
- Profile customization

### Admin Features
- User management
- Doctor registration
- System monitoring
- Appointment oversight
- Analytics dashboard

## 🔒 Security Features
- JWT-based authentication
- Password encryption with bcrypt
- Role-based access control
- Secure file uploads
- Input validation with Zod

## 🧪 Testing
- Unit tests with Jest
- Component testing with React Testing Library
- API testing with Supertest
- Integration tests

## 📝 API Documentation
The API follows RESTful principles and includes endpoints for:
- User authentication
- Appointment management
- Doctor operations
- Patient records
- Admin functions

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team
- Team 19 - CS 520 Project

## 🙏 Acknowledgments
- MongoDB Atlas for database hosting
- Cloudinary for image storage
- All contributors and supporters of the project
