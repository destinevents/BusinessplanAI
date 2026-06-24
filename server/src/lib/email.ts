import { Resend } from "resend";

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const serverUrl = process.env.SERVER_URL ?? "http://localhost:3001";
  const verifyUrl = `${serverUrl}/api/auth/verify?token=${token}`;

  if (!apiKey) {
    console.log(`[DEV] Verification link for ${email}: ${verifyUrl}`);
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.FROM_EMAIL ?? "onboarding@resend.dev";

  await resend.emails.send({
    from,
    to: email,
    subject: "Verify your DisenyoDigitals account",
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  body{font-family:Arial,sans-serif;background:#EDE0CC;margin:0;padding:40px 20px;}
  .card{max-width:480px;margin:0 auto;background:#FAF4E8;border-radius:20px;padding:40px;text-align:center;}
  h1{font-style:italic;color:#2C1A0E;font-size:26px;margin-bottom:8px;}
  p{color:#7A4A18;font-size:15px;line-height:1.6;margin:12px 0;}
  .btn{display:inline-block;margin:24px 0;background:linear-gradient(135deg,#C9A84C,#B87A30);color:white;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:700;font-size:14px;letter-spacing:.08em;}
  .divider{height:1.5px;background:#C9A84C;opacity:.3;margin:20px 0;}
  .footer{color:#B89060;font-size:12px;}
</style>
</head>
<body>
<div class="card">
  <p style="font-size:36px;margin:0 0 4px">✦</p>
  <h1>Welcome to DisenyoDigitals</h1>
  <div class="divider"></div>
  <p>Thanks for signing up for <strong>Business Plan In A Day</strong>.<br/>Click the button below to verify your email and activate your account.</p>
  <a href="${verifyUrl}" class="btn">VERIFY MY ACCOUNT</a>
  <p style="font-size:12px;color:#B89060;">This link expires in 24 hours.<br/>If you didn't create an account, ignore this email.</p>
  <div class="divider"></div>
  <p class="footer">DisenyoDigitals · Business Plan Studio 💛</p>
</div>
</body>
</html>`,
  });
}
