import request from 'supertest';
import { app } from '../server.js';

describe('Message Routes', () => {
  describe('POST /api/v1/message/send', () => {
    it('should return 400 for invalid message data', async () => {
      const response = await request(app)
        .post('/api/v1/message/send')
        .send({
          // Missing required fields
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 400 for empty message', async () => {
      const response = await request(app)
        .post('/api/v1/message/send')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          message: ''
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 200 for valid message', async () => {
      const response = await request(app)
        .post('/api/v1/message/send')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '1234567890',
          message: 'Test message'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Message sent successfully!');
    });
  });

  describe('GET /api/v1/message/get-all-msg', () => {
    it('should return list of messages', async () => {
      const response = await request(app)
        .get('/api/v1/message/get-all-msg');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('messages');
      expect(Array.isArray(response.body.messages)).toBe(true);
    });
  });
}); 