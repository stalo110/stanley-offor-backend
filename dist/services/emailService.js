import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
const hasSmtpConfig = Boolean(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS);
const transporter = hasSmtpConfig
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
        }
    })
    : null;
const formatBody = (payload) => `
Name: ${payload.name}
Email: ${payload.email}
Company: ${payload.company || 'Not provided'}

Message:
${payload.message}
`;
export const sendContactEmail = async (payload) => {
    if (!transporter) {
        logger.warn('SMTP config missing. Contact message logged instead of emailed.');
        logger.info(formatBody(payload));
        return;
    }
    await transporter.sendMail({
        from: env.SMTP_FROM ?? `Portfolio Contact <${env.SMTP_USER}>`,
        to: env.CONTACT_RECEIVER_EMAIL,
        replyTo: payload.email,
        subject: `Portfolio inquiry from ${payload.name}`,
        text: formatBody(payload)
    });
};
