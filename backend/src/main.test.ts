import request from 'supertest';
import app from './main';

describe('API Tests', () => {
  it('GET /api/health should return healthy status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ code: 200, message: 'Success', data: { status: 'healthy' } });
  });

  it('POST /api/auth/login should fail without credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({});
    expect(response.status).toBe(400);
  });

  it('POST /api/auth/login should fail with invalid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'wrongpassword' });
    expect(response.status).toBe(401);
  });

  it('POST /api/auth/login should succeed with correct credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({ username: 'admin', password: 'admin123' });
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  it('should handle unknown routes', async () => {
    const response = await request(app).get('/api/unknown-route');
    expect(response.status).toBe(404);
  });
});
