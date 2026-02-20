import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { contactRouter } from './routes/contactRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
const app = express();
app.use(helmet());
app.use(cors({
    origin: env.CLIENT_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: false
}));
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
