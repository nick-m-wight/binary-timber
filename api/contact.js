const RESEND_API = 'https://api.resend.com/emails';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, interest, message, botcheck } = req.body ?? {};

  // Honeypot — bots fill hidden fields, humans don't
  if (botcheck) {
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;color:#1a1612;">
      <h2 style="font-size:1.2rem;margin-bottom:1.5rem;">
        New inquiry via binarytimber.com
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;width:130px;vertical-align:top;">Name</td>
          <td style="padding:0.4rem 0;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;vertical-align:top;">Email</td>
          <td style="padding:0.4rem 0;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;vertical-align:top;">Division</td>
          <td style="padding:0.4rem 0;">${escapeHtml(interest)}</td>
        </tr>
      </table>
      <div style="margin-top:1.5rem;">
        <strong>Message:</strong>
        <p style="margin-top:0.5rem;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'hello@chefhub.dev',  // TODO: update to hello@binarytimber.com once domain is in Resend
        to: 'nick.m.wight@gmail.com',
        reply_to: email,
        subject: `New inquiry — ${escapeHtml(interest)} — Binary Timber Holdings`,
        html,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error('Resend error:', data);
      return res.status(500).json({ error: 'Failed to send' });
    }
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
