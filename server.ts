import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Real-time in-memory presence tracking across devices
  const activeSessions = new Map<string, number>();

  // Heartbeat endpoint
  app.post('/api/presence/heartbeat', (req, res) => {
    const { sessionId } = req.body;
    const now = Date.now();
    if (sessionId) {
      activeSessions.set(sessionId, now);
    }

    // Clean stale sessions older than 12 seconds
    for (const [id, lastSeen] of activeSessions.entries()) {
      if (now - lastSeen > 12000) {
        activeSessions.delete(id);
      }
    }

    const realCount = Math.max(1, activeSessions.size);
    res.json({ count: realCount });
  });

  // Client leave endpoint
  app.post('/api/presence/leave', (req, res) => {
    const { sessionId } = req.body;
    if (sessionId) {
      activeSessions.delete(sessionId);
    }
    const realCount = Math.max(1, activeSessions.size);
    res.json({ success: true, count: realCount });
  });

  // Client count check
  app.get('/api/presence/count', (_req, res) => {
    const now = Date.now();
    for (const [id, lastSeen] of activeSessions.entries()) {
      if (now - lastSeen > 12000) {
        activeSessions.delete(id);
      }
    }
    const realCount = Math.max(1, activeSessions.size);
    res.json({ count: realCount });
  });

  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Tayyorlaymiz-English server running on port ${port}`);
  });
}

startServer();
