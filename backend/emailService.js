import dotenv from 'dotenv';
dotenv.config();

const ZOOM_LINK = "https://us06web.zoom.us/j/89081201247?pwd=pWpybefqajKEYypSXjiFvz31M2vgrb.1";
const MEETING_ID = "890 8120 1247";
const PASSCODE = "310555";

export const sendWebinarConfirmationEmail = async ({ name, email }) => {
  const apiKey = process.env.API_KEY || process.env.BREVO_API_KEY;
  const senderEmail = process.env.SENDER_EMAIL || 'connect@legalolympiad.com';

  if (!apiKey) {
    console.warn('⚠️ API Key not configured (API_KEY missing in .env). Skipping confirmation email.');
    return { sent: false, reason: 'unconfigured' };
  }

  const htmlContent = `
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
            <div class="info-row"><span class="info-label">Topic:</span> UAPA and the Constitution: National Security vs Individual Liberty</div>
            <div class="info-row"><span class="info-label">Speaker:</span> Akhand Pratap Singh (Special Public Prosecutor – Delhi Police, Experienced Advocate)</div>
            <div class="info-row"><span class="info-label">Date:</span> Sunday, 27th September, 2026</div>
            <div class="info-row"><span class="info-label">Time:</span> 4:00 PM – 5:00 PM IST</div>
          </div>

          <div class="btn-container">
            <a href="${ZOOM_LINK}" class="btn">Join Zoom Meeting</a>
          </div>

          <div class="meeting-details">
            <div style="font-size: 13px; text-transform: uppercase; color: #6f8a7e; margin-bottom: 6px; font-weight: 600;">Manual Zoom Access Details</div>
            <div style="font-size: 15px; margin-bottom: 4px;"><strong>Meeting ID:</strong> ${MEETING_ID}</div>
            <div style="font-size: 15px;"><strong>Passcode:</strong> ${PASSCODE}</div>
          </div>

          <p style="font-size: 14px; font-weight: 600; color: #104633; text-align: center; margin: 20px 0 10px;">
            ⚡ “Prepare to Compete. Prepare to Win. THIS SUNDAY!”
          </p>

          <p style="font-size: 13px; color: #6f8a7e; line-height: 1.5; margin-top: 14px;">
            Please make sure to join 5 minutes early to ensure optimal audio/video setup. Feel free to prepare your questions for the interactive Q&A session with Akhand Pratap Singh.
          </p>
        </div>
        <div class="footer">
          © 2026 Legal Olympiad. All rights reserved.<br/>
          Need assistance? Reach out to <a href="mailto:Connect@legalolympiad.com" style="color: #104633; font-weight: 600;">Connect@legalolympiad.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Legal Olympiad', email: senderEmail },
        to: [{ email: email, name: name }],
        subject: 'Confirmed: Registration for "UAPA and the Constitution" Webinar #009',
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`✉️ Confirmation email sent to ${email} (MessageId: ${data.messageId})`);
    return { sent: true, messageId: data.messageId };
  } catch (err) {
    console.error(`❌ Failed to send confirmation email to ${email}:`, err.message);
    return { sent: false, error: err.message };
  }
};
