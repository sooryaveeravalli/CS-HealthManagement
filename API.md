# API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
All protected routes require JWT authentication. Include the token in cookies for authenticated requests.

## Endpoints

### Authentication

#### Login
```http
POST /users/login
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "confirmPassword": "string",
  "role": "Patient|Doctor|Admin"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token"
}
```

#### Register Patient
```http
POST /users/patient/register
```
**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dob": "string",
  "gender": "Male|Female|Other",
  "password": "string"
}
```

#### Register Doctor
```http
POST /users/doctor/register
```
**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dob": "string",
  "gender": "Male|Female|Other",
  "password": "string",
  "doctorDepartment": "string",
  "yearsOfExperience": "number",
  "licenseNumber": "string"
}
```

### Appointments

#### Get Available Shifts
```http
GET /appoinments/shifts/available
```
**Query Parameters:**
- `date`: string (YYYY-MM-DD)
- `department`: string

#### Book Appointment
```http
POST /appoinments/book
```
**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "nic": "string",
  "dob": "string",
  "patientGender": "Male|Female|Other",
  "appointment_date": "string",
  "appointment_time": "string",
  "department": "string",
  "doctorId": "string",
  "shiftId": "string",
  "reason": "string"
}
```

#### Get Patient Appointments
```http
GET /appoinments/patient
```
**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "id": "string",
      "appointment_date": "string",
      "appointment_time": "string",
      "status": "string",
      "doctor": {
        "firstName": "string",
        "lastName": "string",
        "department": "string"
      }
    }
  ]
}
```

#### Get Doctor Appointments
```http
GET /appoinments/all
```
**Response:**
```json
{
  "success": true,
  "appointments": [
    {
      "id": "string",
      "appointment_date": "string",
      "appointment_time": "string",
      "status": "string",
      "patient": {
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    }
  ]
}
```

### Doctor Shifts

#### Add Doctor Shift
```http
POST /appoinments/shifts
```
**Request Body:**
```json
{
  "date": "string",
  "startTime": "string",
  "endTime": "string"
}
```

#### Get Doctor Shifts
```http
GET /appoinments/shifts/doctor
```

#### Update Doctor Shift
```http
PUT /appoinments/shifts/:id
```
**Request Body:**
```json
{
  "date": "string",
  "startTime": "string",
  "endTime": "string"
}
```

### User Management

#### Get All Doctors
```http
GET /users/doctors
```
**Response:**
```json
{
  "success": true,
  "doctors": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "department": "string",
      "yearsOfExperience": "number"
    }
  ]
}
```

#### Get User Profile
```http
GET /users/patient/profile
```
**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "role": "string"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "success": false,
  "message": "Error message"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Authentication Headers

For protected routes, include the following in your requests:
- Cookies: JWT token
- Content-Type: application/json

## Rate Limiting

API requests are limited to:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## Best Practices

1. Always handle errors appropriately
2. Use HTTPS in production
3. Implement proper input validation
4. Keep tokens secure
5. Use appropriate HTTP methods
6. Follow RESTful conventions 