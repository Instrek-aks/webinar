import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const ZOOM_LINK = "https://us06web.zoom.us/j/8735964512?pwd=qBpJGC4Xd6Kb4DVr7pf9PsRCrirlB3.1&omn=83661295344";
const MEETING_ID = "873 596 4512";
const PASSCODE = "d6CKmZ";

// Configure SMTP transporter
const createTransporter = () => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465', 10),
      secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465',
      auth: { user, pass }
    });
  }

  // Default to Gmail service
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
};

export const sendWebinarConfirmationEmail = async ({ name, email }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('⚠️ SMTP not configured (EMAIL_USER / EMAIL_PASS missing in .env). Skipping confirmation email.');
    return { sent: false, reason: 'unconfigured' };
  }

  const senderEmail = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Legal Olympiad" <${senderEmail}>`,
    to: email,
    subject: `Confirmed: Registration for "Can AI Replace Lawyers?" Webinar`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F3F0E6; margin: 0; padding: 20px; color: #104633; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #ded9ca; box-shadow: 0 4px 20px rgba(16,70,51,0.08); }
          .header { background: linear-gradient(135deg, #104633 0%, #092a1e 100%); color: #ffffff; padding: 36px 30px; text-align: center; }
          .header h1 { margin: 0 0 8px; font-size: 24px; font-weight: 700; }
          .header p { margin: 0; color: #D4A425; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
          .content { padding: 32px 30px; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: #104633; }
          .info-card { background: #F3F0E6; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #ded9ca; }
          .info-row { margin-bottom: 12px; font-size: 15px; }
          .info-row:last-child { margin-bottom: 0; }
          .info-label { font-weight: 600; color: #104633; }
          .btn-container { text-align: center; margin: 30px 0 20px; }
          .btn { background: #104633; color: #ffffff !important; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; border-bottom: 3px solid #092a1e; }
          .meeting-details { background: #FAF8F2; border: 1px dashed #D4A425; border-radius: 10px; padding: 16px; margin: 20px 0; text-align: center; }
          .footer { background: #F3F0E6; padding: 24px; text-align: center; font-size: 13px; color: #6f8a7e; border-top: 1px solid #ded9ca; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <p>Legal Olympiad Webinar Series 2026</p>
            <h1>Registration Confirmed</h1>
          </div>
          <div class="content">
            <div class="greeting">Hello ${name || 'Counsel'},</div>
            <p style="line-height: 1.6; font-size: 15px; color: #38564a;">
              Your registration for the upcoming high-impact masterclass is confirmed. Here are the session details and your direct joining credentials:
            </p>

            <div class="info-card">
              <div class="info-row"><span class="info-label">Topic:</span> Can AI Replace Lawyers? The Next Constitutional Crisis</div>
              <div class="info-row"><span class="info-label">Speaker:</span> Sr. Advocate Arundhati Katju</div>
              <div class="info-row"><span class="info-label">Date:</span> Sunday, 20 September 2026</div>
              <div class="info-row"><span class="info-label">Time:</span> 11:00 AM – 12:00 PM IST</div>
            </div>

            <div class="btn-container">
              <a href="${ZOOM_LINK}" class="btn">Join Zoom Meeting</a>
            </div>

            <div class="meeting-details">
              <div style="font-size: 13px; text-transform: uppercase; color: #6f8a7e; margin-bottom: 6px; font-weight: 600;">Manual Zoom Access Details</div>
              <div style="font-size: 15px; margin-bottom: 4px;"><strong>Meeting ID:</strong> ${MEETING_ID}</div>
              <div style="font-size: 15px;"><strong>Passcode:</strong> ${PASSCODE}</div>
            </div>

            <p style="font-size: 13px; color: #6f8a7e; line-height: 1.5; margin-top: 24px;">
              Please make sure to join 5 minutes early to ensure optimal audio/video setup. Feel free to prepare your questions for the interactive Q&A session with Sr. Advocate Arundhati Katju.
            </p>
          </div>
          <div class="footer">
            © 2026 Legal Olympiad. All rights reserved.<br/>
            Need assistance? Reach out to <a href="mailto:connect@legalolympiad.com" style="color: #104633; font-weight: 600;">connect@legalolympiad.com</a>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Confirmation email sent to ${email} (MessageId: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ Failed to send confirmation email to ${email}:`, err.message);
    return { sent: false, error: err.message };
  }
};
