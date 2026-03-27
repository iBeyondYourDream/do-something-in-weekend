import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/events', eventsRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

export default app;
