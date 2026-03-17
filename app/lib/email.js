import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Freedom Family <noreply@freedomfamily.app>';

export async function sendWebcastLink({ to, name, zoomLink }) {
  if (!resend) {
    console.log('Resend not configured — skipping webcast link email to', to);
    return { success: false, reason: 'not_configured' };
  }

  if (!zoomLink) {
    console.log('No Zoom link available — skipping email to', to);
    return { success: false, reason: 'no_zoom_link' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: 'Your Webcast Link — Freedom Family',
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #b8956b; margin: 0;">Freedom Family</p>
          </div>
          <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px;">Hi ${name || 'there'},</p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px; color: #333;">
            Thank you for registering for the webcast! Here is your link to join:
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${zoomLink}"
               style="display: inline-block; padding: 14px 32px; background: #1a1a1a; color: #fafaf8; text-decoration: none; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;">
              Join Webcast
            </a>
          </div>
          <p style="font-size: 13px; line-height: 1.5; color: #666; margin: 24px 0 0;">
            Or copy this link: <a href="${zoomLink}" style="color: #b8956b;">${zoomLink}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px;" />
          <p style="font-size: 11px; color: #999; text-align: center; margin: 0;">
            Freedom Family • Building together
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, reason: 'send_error', error: error.message };
    }

    console.log('Webcast link sent to', to, 'id:', data?.id);
    return { success: true, emailId: data?.id };
  } catch (err) {
    console.error('Email send error:', err);
    return { success: false, reason: 'exception', error: err.message };
  }
}
