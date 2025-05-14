import request from 'supertest';
import { app } from '../server.js';

describe('User Routes', () => {
  // Test login endpoint
  describe('POST /api/v1/users/login', () => {
    it('should return 400 for invalid login credentials', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'invalid@email.com',
          password: 'wrongpassword',
          confirmPassword: 'wrongpassword',
          role: 'Patient'
        });
      
      expect(response.status).toBe(400);
    });
  });

  // Test doctor routes
  describe('GET /api/v1/users/doctors', () => {
    it('should return list of doctors', async () => {
      const response = await request(app)
        .get('/api/v1/users/doctors');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('doctors');
      expect(Array.isArray(response.body.doctors)).toBe(true);
    });
  });

  // Test patient registration
  describe('POST /api/v1/users/patient/register', () => {
    it('should return 400 for invalid registration data', async () => {
      const response = await request(app)
        .post('/api/v1/users/patient/register')
        .send({
          firstName: '',  // Empty string should fail validation
          lastName: 'User',
          email: 'invalid-email',  // Invalid email format
          phone: '123',  // Invalid phone format
          dob: 'invalid-date',  // Invalid date format
          gender: '',  // Empty string should fail validation
          password: ''  // Empty string should fail validation
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 