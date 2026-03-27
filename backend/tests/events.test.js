import request from 'supertest';
import app from '../src/app.js';

describe('Events API', () => {
  describe('GET /api/events', () => {
    it('should return all events', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(10);
    });

    it('should filter by category', async () => {
      const res = await request(app).get('/api/events').query({ category: '运动' });
      expect(res.status).toBe(200);
      expect(res.body.every(e => e.category === '运动')).toBe(true);
    });

    it('should filter by source', async () => {
      const res = await request(app).get('/api/events').query({ source: 'public' });
      expect(res.status).toBe(200);
      expect(res.body.every(e => e.source === 'public')).toBe(true);
    });
  });

  describe('POST /api/events', () => {
    it('should create a new event', async () => {
      const newEvent = {
        title: '测试活动',
        description: '这是一个测试活动',
        category: '运动',
        location: { name: '测试地点', lat: 39.9, lng: 116.4 },
        startTime: '2030-01-01T10:00:00.000Z',
        endTime: '2030-01-01T12:00:00.000Z',
        organizer: '测试用户',
        maxParticipants: 10
      };
      const res = await request(app).post('/api/events').send(newEvent);
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('测试活动');
      expect(res.body.source).toBe('user');
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app).post('/api/events').send({
        category: '运动',
        location: { name: '测试地点', lat: 39.9, lng: 116.4 },
        startTime: '2030-01-01T10:00:00.000Z',
        organizer: '测试用户'
      });
      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 if startTime is in the past', async () => {
      const res = await request(app).post('/api/events').send({
        title: '过去的活动',
        category: '运动',
        location: { name: '测试地点', lat: 39.9, lng: 116.4 },
        startTime: '2020-01-01T10:00:00.000Z',
        organizer: '测试用户'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/events/nearby', () => {
    it('should return nearby events', async () => {
      const res = await request(app).get('/api/events/nearby?lat=39.9&lng=116.4&radius=50');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].distance).toBeDefined();
    });

    it('should return 400 if lat/lng missing', async () => {
      const res = await request(app).get('/api/events/nearby');
      expect(res.status).toBe(400);
    });

    it('should return fewer events with smaller radius', async () => {
      const largeRadius = await request(app).get('/api/events/nearby?lat=39.9&lng=116.4&radius=100');
      const smallRadius = await request(app).get('/api/events/nearby?lat=39.9&lng=116.4&radius=1');
      expect(largeRadius.body.length).toBeGreaterThanOrEqual(smallRadius.body.length);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return a single event', async () => {
      const res = await request(app).get('/api/events/a1b2c3d4-e5f6-7890-abcd-ef1234567890');
      expect(res.status).toBe(200);
      expect(res.body.id).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
    });

    it('should return 404 for unknown id', async () => {
      const res = await request(app).get('/api/events/nonexistent-id');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/events/:id/join', () => {
    it('should join an event', async () => {
      const res = await request(app)
        .post('/api/events/b2c3d4e5-f6a7-8901-bcde-f12345678901/join')
        .send({ name: '张三', contact: '13800138000' });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('成功参与活动');
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/api/events/b2c3d4e5-f6a7-8901-bcde-f12345678901/join')
        .send({ contact: '13800138000' });
      expect(res.status).toBe(400);
    });
  });
});
