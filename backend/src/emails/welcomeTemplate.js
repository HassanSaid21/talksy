export const buildWelcomeEmailTemplate = (name, url) => {
  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const safeName = escapeHtml(name || "there");
  const rawUrl = typeof url === "string" ? url : "";
  const normalizedUrl = /^(https?:\/\/|\/)/i.test(rawUrl) ? rawUrl : "#";
  const safeUrl = escapeHtml(normalizedUrl || "#");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Talksy</title>
    <style>
      body { margin: 0; padding: 0; background: #eef1f6; font-family: "Segoe UI", Arial, sans-serif; color: #2a3441; }
      .container { max-width: 640px; margin: 0 auto; padding: 28px; }
      .card { background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 16px 35px rgba(45, 62, 98, 0.12); }
      .header { padding: 28px 24px; text-align: center; background: linear-gradient(135deg, #32c6d6, #4f6ff8); color: #ffffff; }
      .logo {
        width: 62px;
        height: 62px;
        border-radius: 50%;
        border: 4px solid rgba(255, 255, 255, 0.6);
        margin: 0 auto 10px;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .logo svg { width: 30px; height: 30px; }
      .title { font-size: 22px; font-weight: 600; margin: 6px 0 0; }
      .content { padding: 24px 30px 30px; }
      .greeting { color: #3b5bdc; font-weight: 600; font-size: 16px; margin: 0 0 10px; }
      p { font-size: 15px; line-height: 1.6; margin: 0 0 16px; color: #4b5563; }
      .steps { background: #f6f8fc; border-radius: 14px; padding: 18px 20px; border-left: 4px solid #48b9d6; margin: 18px 0; }
      .steps-title { font-weight: 600; color: #1f2a44; margin: 0 0 10px; }
      ul { padding-left: 18px; margin: 0; color: #5b6473; font-size: 14px; }
      li { margin-bottom: 8px; }
      .cta-wrap { text-align: center; margin: 22px 0 8px; }
      .cta { display: inline-block; background: #4f6ff8; color: #ffffff !important; text-decoration: none; padding: 12px 26px; border-radius: 999px; font-weight: 600; font-size: 14px; }
      .muted { color: #6b7280; font-size: 13px; margin-top: 12px; }
      .footer { text-align: center; color: #9aa3b2; font-size: 12px; margin-top: 18px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <div class="header">
          <div class="logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
</svg>
          </div>
          <div class="title">Welcome to Talksy!</div>
        </div>
        <div class="content">
          <div class="greeting">Hello ${safeName},</div>
          <p>We are excited to have you join our messaging platform! Talksy connects you with friends, family, and colleagues in real time, no matter where they are.</p>
          <div class="steps">
            <div class="steps-title">Get started in just a few steps:</div>
            <ul>
              <li>Set up your profile picture</li>
              <li>Find and add your contacts</li>
              <li>Start a conversation</li>
              <li>Share photos, videos, and more</li>
            </ul>
          </div>
          <div class="cta-wrap">
            <a class="cta" href="${safeUrl}" target="_blank" rel="noopener noreferrer">Open Talksy</a>
          </div>
          <p class="muted">If you need any help or have questions, we are always here to assist you. Happy messaging!</p>
          <p class="muted">Best regards,<br />The Talksy Team</p>
          <p class="muted">${safeUrl}</p>
        </div>
      </div>
      <div class="footer">You received this email because you have an account on Talksy.</div>
    </div>
  </body>
</html>`;
};
