import { supabase } from './supabase';
import { renderDecisionEmail, type EmailContent } from './emailTemplates';
import type { ApplicationStatus } from './supabase';

export interface SendResult {
  success: boolean;
  email?: EmailContent;
  error?: string;
}

export async function sendDecisionEmail(
  applicationId: string,
  name: string,
  email: string,
  status: ApplicationStatus
): Promise<SendResult> {
  try {
    const emailContent = renderDecisionEmail(name, status);

    const { error } = await supabase.from('email_logs').insert({
      application_id: applicationId,
      recipient_email: email,
      recipient_name: name,
      subject: emailContent.subject,
      body_html: emailContent.bodyHtml,
      decision: status,
    });

    if (error) throw error;

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

    const data = await res.json();
    console.log('Email API response:', res.status, data);

    if (!res.ok) {
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