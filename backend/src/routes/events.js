import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { events } from '../data/store.js';
import { validateEvent } from '../middleware/validation.js';

const router = Router();

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/events/nearby - MUST be before /:id
router.get('/nearby', (req, res) => {
  const { lat, lng, radius = 10 } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: '需要提供lat和lng参数' });
  }
  const userLat = parseFloat(lat);
  const userLng = parseFloat(lng);
  const radiusKm = parseFloat(radius);
  const nearby = events
    .map(event => ({
      ...event,
      distance: haversineDistance(userLat, userLng, event.location.lat, event.location.lng)
    }))
    .filter(event => event.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
  res.json(nearby);
});

// GET /api/events
router.get('/', (req, res) => {
  const { category, source } = req.query;
  let result = [...events];
  if (category) result = result.filter(e => e.category === category);
  if (source) result = result.filter(e => e.source === source);
  res.json(result);
});

// POST /api/events
router.post('/', validateEvent, (req, res) => {
  const { title, description, category, location, startTime, endTime, organizer, maxParticipants } = req.body;
  const newEvent = {
    id: uuidv4(),
    title,
    description: description || '',
    category,
    location,
    startTime,
    endTime: endTime || null,
    organizer,
    maxParticipants: maxParticipants || 20,
    participants: [],
    source: 'user',
    createdAt: new Date().toISOString()
  };
  events.push(newEvent);
  res.status(201).json(newEvent);
});

// GET /api/events/:id
router.get('/:id', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: '活动不存在' });
  res.json(event);
});

// POST /api/events/:id/join
router.post('/:id/join', (req, res) => {
  const event = events.find(e => e.id === req.params.id);
  if (!event) return res.status(404).json({ error: '活动不存在' });
  const { name, contact } = req.body;
  if (!name || name.trim() === '') return res.status(400).json({ error: '姓名不能为空' });
  if (event.participants.length >= event.maxParticipants) {
    return res.status(400).json({ error: '活动名额已满' });
  }
  event.participants.push({ name, contact, joinedAt: new Date().toISOString() });
  res.json({ message: '成功参与活动', event });
});

// DELETE /api/events/:id
router.delete('/:id', (req, res) => {
  const { organizer } = req.body;
  const index = events.findIndex(e => e.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: '活动不存在' });
  if (events[index].organizer !== organizer) {
    return res.status(403).json({ error: '无权删除此活动' });
  }
  events.splice(index, 1);
  res.json({ message: '活动已删除' });
});

export default router;
