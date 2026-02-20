import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { contactRouter } from './routes/contactRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();
const normalizeOrigin = (origin: string): string => origin.replace(/\/+$/, '');
const allowedOrigins = new Set(
  ['http://localhost:5173', 'https://stanleyoffor.com', 'https://www.stanleyoffor.com', env.CLIENT_ORIGIN]
    .filter((value): value is string => Boolean(value))
    .map(normalizeOrigin)
);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowedOrigin = allowedOrigins.has(normalizeOrigin(origin));

      if (isAllowedOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: false
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_request, response) => {
  response.json({
    success: true,
    message: 'Portfolio API is running.'
  });
});

app.use('/api/contact', contactRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  logger.info(`Server listening on port ${env.PORT}`);
});
