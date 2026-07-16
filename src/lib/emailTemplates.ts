import type { ApplicationStatus } from './supabase';

export interface EmailContent {
  subject: string;
  bodyHtml: string;
}

const FOREST_BG = '#142613';
const FOREST_MID = '#2d5029';
const MOSS = '#6b8a4f';
const MOSS_LIGHT = '#86a36a';
const CREAM = '#faf4e8';
const STONE = '#727265';
const GOLD = '#c0912f';

function shell(inner: string, accentColor: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>EurekaHACKS</title>
</head>
<body style="margin:0;padding:0;background-color:#0a160a;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a160a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${FOREST_BG};border-radius:16px;overflow:hidden;border:1px solid #1f3a1d;">
          <!-- Topographic header bar -->
          <tr>
            <td style="background:linear-gradient(135deg,${FOREST_MID} 0%,${FOREST_BG} 100%);padding:32px 40px 24px;text-align:center;">
              <!-- Compass mark -->
              <div style="font-size:28px;color:${MOSS_LIGHT};margin-bottom:8px;">&#9901;</div>
              <span style="font-size:20px;font-weight:bold;color:${CREAM};letter-spacing:0.5px;">Eureka<span style="color:${MOSS_LIGHT};">HACKS</span></span>
              <div style="font-size:11px;color:${STONE};letter-spacing:2px;text-transform:uppercase;margin-top:6px;">Expedition HQ</div>
            </td>
          </tr>
          <!-- Accent line -->
          <tr>
            <td style="height:4px;background:${accentColor};"></td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${inner}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #1f3a1d;">
              <p style="font-size:12px;color:${STONE};line-height:1.6;margin:0;text-align:center;">
                EurekaHACKS &middot; A journey through code &amp; discovery<br>
                <a href="mailto:hello@eurekahacks.com" style="color:${MOSS_LIGHT};text-decoration:none;">hello@eurekahacks.com</a>
                &nbsp;&middot;&nbsp;
                <span style="color:${STONE};">Made with care in the Pacific Northwest</span>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function greeting(name: string): string {
  return `<p style="font-size:16px;color:${CREAM};margin:0 0 24px;line-height:1.6;">Dear ${name},</p>`;
}

function signature(): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;">
    <tr>
      <td style="border-left:3px solid ${MOSS};padding-left:16px;">
        <p style="font-size:15px;color:${CREAM};margin:0 0 4px;font-style:italic;">With anticipation,</p>
        <p style="font-size:15px;color:${CREAM};margin:0 0 2px;font-weight:bold;">The EurekaHACKS Expedition Team</p>
        <p style="font-size:12px;color:${STONE};margin:0;">Organizers &middot; EurekaHACKS 2026</p>
      </td>
    </tr>
  </table>`;
}

export function renderDecisionEmail(name: string, status: ApplicationStatus): EmailContent {
  const cleanName = name || 'Explorer';

  if (status === 'accepted') {
    return {
      subject: `Welcome to the expedition, ${cleanName} — You're in!`,
      bodyHtml: shell(`
        ${greeting(cleanName)}
        <p style="font-size:26px;font-weight:bold;color:${MOSS_LIGHT};margin:0 0 8px;line-height:1.3;">Your application has reached Eureka.</p>
        <p style="font-size:14px;color:${GOLD};margin:0 0 24px;letter-spacing:1px;text-transform:uppercase;">Status: Accepted</p>
        <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0 0 16px;">
          We are thrilled to welcome you to the EurekaHACKS 2026 expedition. Your application stood out
          among hundreds — your passion, your projects, and your perspective told us that you belong on
          this trail.
        </p>
        <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0 0 16px;">
          Over 36 hours, you'll join 500+ explorers at the edge of the forest to build, learn, and discover.
          We'll be covering your meals and lodging, and you'll receive travel reimbursement details shortly.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#1f3a1d;border-radius:10px;">
          <tr><td style="padding:20px;">
            <p style="font-size:12px;color:${GOLD};margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Next Steps</p>
            <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:0;">1. Watch your inbox for travel &amp; lodging details within 5 days</p>
            <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:8px 0 0;">2. Join our community Discord (link coming soon)</p>
            <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:8px 0 0;">3. Start dreaming up your project — the forest is waiting</p>
          </td></tr>
        </table>
        <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0 0 0;">
          Pack your curiosity. The expedition begins this October.
        </p>
        ${signature()}
      `, MOSS),
    };
  }

  if (status === 'waitlisted') {
    return {
      subject: `${cleanName}, you're on the waitlist — the trail may still open`,
      bodyHtml: shell(`
        ${greeting(cleanName)}
        <p style="font-size:26px;font-weight:bold;color:${GOLD};margin:0 0 8px;line-height:1.3;">The trail is full — but your journey isn't over.</p>
        <p style="font-size:14px;color:${GOLD};margin:0 0 24px;letter-spacing:1px;text-transform:uppercase;">Status: Waitlisted</p>
        <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0 0 16px;">
          Your application impressed our team, ${cleanName}. We received an overwhelming number of
          applications this year, and while we'd love to welcome everyone, our capacity is limited.
        </p>
        <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0 0 16px;">
          You've been placed on our waitlist, which means that if a spot opens up — and they often do —
          you'll be among the first we contact. We'll keep you updated as the expedition approaches.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#1f3a1d;border-radius:10px;">
          <tr><td style="padding:20px;">
            <p style="font-size:12px;color:${GOLD};margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">What to Expect</p>
            <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:0;">We'll notify you by email if a spot opens</p>
            <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:8px 0 0;">Waitlist decisions are typically sent 1–2 weeks before the event</p>
            <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:8px 0 0;">No further action needed from you right now</p>
          </td></tr>
        </table>
        <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0;">
          Thank you for your patience and your passion. The forest remembers those who wait.
        </p>
        ${signature()}
      `, GOLD),
    };
  }

  // rejected
  return {
    subject: `${cleanName}, thank you for applying to EurekaHACKS`,
    bodyHtml: shell(`
      ${greeting(cleanName)}
      <p style="font-size:26px;font-weight:bold;color:${STONE};margin:0 0 8px;line-height:1.3;">Every explorer's path is different.</p>
      <p style="font-size:14px;color:${STONE};margin:0 0 24px;letter-spacing:1px;text-transform:uppercase;">Status: Not Selected</p>
      <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0 0 16px;">
        Thank you for taking the time to apply to EurekaHACKS 2026. We read every application with care,
        and yours showed genuine passion and creativity. This year we received far more applications
        than we could accept, and that meant making some incredibly difficult decisions.
      </p>
      <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0 0 16px;">
        This is not a reflection of your potential. Some of the most remarkable builders we know were
        told "not yet" before they found their moment. We encourage you to keep building, keep exploring,
        and keep applying — to EurekaHACKS and to every opportunity that calls to you.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;background:#1f3a1d;border-radius:10px;">
        <tr><td style="padding:20px;">
          <p style="font-size:12px;color:${MOSS_LIGHT};margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Keep Exploring</p>
          <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:0;">Follow us on social media for future events</p>
          <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:8px 0 0;">Join our community Discord to stay connected</p>
          <p style="font-size:14px;color:${CREAM};line-height:1.6;margin:8px 0 0;">Applications for EurekaHACKS 2027 open next spring</p>
        </td></tr>
      </table>
      <p style="font-size:15px;color:${CREAM};line-height:1.7;margin:0;">
        The trail will be here. We hope to see you on it again.
      </p>
      ${signature()}
    `, STONE),
  };
}
