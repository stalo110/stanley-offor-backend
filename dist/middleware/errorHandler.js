import { logger } from '../utils/logger.js';
export const notFoundHandler = (_request, response) => {
    response.status(404).json({
        success: false,
        message: 'Route not found'
    });
};
export const errorHandler = (error, _request, response, _next) => {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    logger.error(message);
    response.status(500).json({
        success: false,
        message: 'Something went wrong. Please try again later.'
    });
};
