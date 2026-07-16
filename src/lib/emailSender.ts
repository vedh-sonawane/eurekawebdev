import { supabase } from './supabase';
import { renderDecisionEmail, type EmailContent } from './emailTemplates';
import type { ApplicationStatus } from './supabase';

export interface SendResult {
  success: boolean;
  email?: EmailContent;
  error?: string;
}

/**
 * "Sends" a decision email by rendering the HTML template and logging it
 * to the email_logs table. In a production app this would call an email
 * service (Resend, SendGrid, etc.) — here we persist the rendered email
 * so organizers can preview exactly what the applicant received.
 */
export async function sendDecisionEmail(
  applicationId: string,
  name: string,
  email: string,
  status: ApplicationStatus
): Promise<SendResult> {
  try {
    const emailContent = renderDecisionEmail(name, status);

    // Save to email_logs
    const { error } = await supabase.from('email_logs').insert({
      application_id: applicationId,
      recipient_email: email,
      recipient_name: name,
      subject: emailContent.subject,
      body_html: emailContent.bodyHtml,
      decision: status,
    });

    if (error) throw error;

    // Actually send the email via Vercel function
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: emailContent.subject,
        html: emailContent.bodyHtml,
        name,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to send email');
    }

    return { success: true, email: emailContent };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}