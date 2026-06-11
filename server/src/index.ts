import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { analyzeRouter } from './routes/analyze.js';
import { draftRouter } from './routes/draft.js';
import { commitmentsRouter } from './routes/commitments.js';
import { verifyJwt } from './middleware/auth.js';

const app = express();
const PORT = process.env['PORT'] ? parseInt(process.env['PORT']) : 3001;

const ALLOWED_ORIGINS = [
  'https://mail.google.com',
  'https://getrex.ai',
  'http://localhost:3000',
  // Chrome extensions send requests with chrome-extension:// origin
];

app.use(cors({
  origin: (origin, cb) => {
    // Allow no-origin (same-origin) and chrome-extension:// origins
    if (!origin || origin.startsWith('chrome-extension://') || ALLOWED_ORIGINS.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50kb' }));

// Health check — public
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Rex', version: '1.0.0' });
});

// All API routes require a valid JWT
app.use('/api/analyze', verifyJwt, analyzeRouter);
app.use('/api/draft', verifyJwt, draftRouter);
app.use('/api/commitments', verifyJwt, commitmentsRouter);

app.listen(PORT, () => {
  console.log(`
+---------------------------------------+
|         Rex Server v1.0.0             |
|   AI commitment tracker for Gmail     |
+---------------------------------------+
|  Listening on: http://localhost:${PORT}  |
|  Health:       GET  /api/health       |
|  Analyze:      POST /api/analyze/thread|
|                POST /api/analyze/inbox |
|  Draft:        POST /api/draft        |
|  Commitments:  GET  /api/commitments  |
+---------------------------------------+
  `);

  if (!process.env['ANTHROPIC_API_KEY']) {
    console.warn('[Rex] WARNING: ANTHROPIC_API_KEY not set.');
  }
  if (!process.env['SUPABASE_JWT_SECRET']) {
    console.warn('[Rex] WARNING: SUPABASE_JWT_SECRET not set — all API requests will fail auth.');
  }
});
