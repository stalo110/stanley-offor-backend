import { Router } from 'express';
import { z } from 'zod';
import { contactRateLimiter } from '../middleware/rateLimiter.js';
import { sendContactEmail } from '../services/emailService.js';

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  company: z.string().max(120).optional(),
  message: z.string().min(15).max(3000)
});

export const contactRouter = Router();

contactRouter.post('/', contactRateLimiter, async (request, response, next) => {
  try {
    const parsed = contactSchema.safeParse(request.body);

    if (!parsed.success) {
      response.status(400).json({
        success: false,
        message: 'Invalid contact payload.',
        errors: parsed.error.flatten()
      });
      return;
    }

    await sendContactEmail(parsed.data);

    response.status(200).json({
      success: true,
      message: 'Message sent successfully.'
    });
  } catch (error) {
    next(error);
  }
});
