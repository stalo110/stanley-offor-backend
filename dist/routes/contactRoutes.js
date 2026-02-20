import { Router } from 'express';
import { z } from 'zod';
import { contactRateLimiter } from '../middleware/rateLimiter.js';
import { sendContactEmail } from '../services/emailService.js';
import { logger } from '../utils/logger.js';
const contactSchema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    company: z.string().max(120).optional(),
    message: z.string().trim().min(1, 'Message is required.').max(3000)
});
export const contactRouter = Router();
contactRouter.post('/', contactRateLimiter, async (request, response, next) => {
    try {
        const parsed = contactSchema.safeParse(request.body);
        if (!parsed.success) {
            const messageError = parsed.error.flatten().fieldErrors.message?.[0];
            response.status(400).json({
                success: false,
                message: messageError ?? 'Invalid contact payload.',
                errors: parsed.error.flatten()
            });
            return;
        }
        try {
            await sendContactEmail(parsed.data);
        }
        catch (error) {
            const detail = error instanceof Error ? error.message : 'Unknown email transport error';
            logger.error(`Contact email delivery failed: ${detail}`);
            response.status(502).json({
                success: false,
                message: 'Email service is temporarily unavailable. Please email hello@stanleyoffor.com directly.'
            });
            return;
        }
        response.status(200).json({
            success: true,
            message: 'Message sent successfully.'
        });
    }
    catch (error) {
        next(error);
    }
});
