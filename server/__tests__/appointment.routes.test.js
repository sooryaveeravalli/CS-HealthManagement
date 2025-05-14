import request from 'supertest';
import { app } from '../server.js';

describe('Appointment Routes', () => {
  // Test public routes
  describe('GET /api/v1/appoinments/departments', () => {
    it('should return list of departments', async () => {
      const response = await request(app)
        .get('/api/v1/appoinments/departments');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('departments');
      expect(Array.isArray(response.body.departments)).toBe(true);
    });
  });

  describe('GET /api/v1/appoinments/shifts/available', () => {
    it('should return available shifts', async () => {
      const response = await request(app)
        .get('/api/v1/appoinments/shifts/available')
        .query({
          date: '2024-03-20',
          department: 'Cardiology'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('shifts');
      expect(Array.isArray(response.body.shifts)).toBe(true);
    });

    it('should return 400 for missing required query parameters', async () => {
      const response = await request(app)
        .get('/api/v1/appoinments/shifts/available');
      
      expect(response.status).toBe(400);
    });
  });

  // Test authenticated routes
  describe('POST /api/v1/appoinments/book', () => {
    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/appoinments/book')
        .send({
          doctorId: '123',
          date: '2024-03-20',
          time: '10:00 AM'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/v1/appoinments/patient', () => {
    it('should return 400 for unauthenticated request', async () => {
      const response = await request(app)
        .get('/api/v1/appoinments/patient');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/v1/appoinments/cancel/:id', () => {
    it('should return 400 for unauthenticated request', async () => {
      const response = await request(app)
        .put('/api/v1/appoinments/cancel/123');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/v1/appoinments/reschedule/:id', () => {
    it('should return 400 for unauthenticated request', async () => {
      const response = await request(app)
        .put('/api/v1/appoinments/reschedule/123')
        .send({
          newDate: '2024-03-21',
          newTime: '11:00 AM'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });
}); 