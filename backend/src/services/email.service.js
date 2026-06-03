import { Resend } from 'resend';
 import dotenv from 'dotenv';

dotenv.config();
// The API key must be stored in an environment variable called RESEND_API_KEY.
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send an email using Resend
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @param {string} idempotencyKey - Optional idempotency key for safe retries
 * @returns {Promise<{data: any, error: any}>}
 */

export const sendEmail = async (to, subject, html, idempotencyKey = undefined) => {
  // Use a verified domain in production. 
  // 'onboarding@resend.dev' and 'delivered@resend.dev' can be used for testing.
  const fromEmail = process.env.NODE_ENV === 'development' 
    ? 'karim <noreply@yourdomain.com>' // Replace with verified domain
    : 'karim <onboarding@resend.dev>';
  
  const options = {
    from: fromEmail,
    to: to,
    subject: subject,
    html: html,
  };

  if (idempotencyKey) {
    options.idempotencyKey = idempotencyKey;
  }

  // Await the promise and extract data, error
  const { data, error } = await resend.emails.send(options);

  if (error) {
    throw new Error(`failed to send email ${error.message}`)
    console.error('Failed to send welcome email:', error);
  }

  return { data, error };
};
