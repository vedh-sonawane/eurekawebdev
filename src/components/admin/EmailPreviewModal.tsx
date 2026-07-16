import { Modal } from '../ui/Modal';
import { Mail, Check } from 'lucide-react';

interface EmailPreviewModalProps {
  html: string;
  subject: string;
  name: string;
  onClose: () => void;
}

export function EmailPreviewModal({ html, subject, name, onClose }: EmailPreviewModalProps) {
  return (
    <Modal open onClose={onClose} maxWidth="max-w-2xl" title={`Email sent to ${name}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-lg bg-moss-500/10 border border-moss-400/20">
          <Check className="text-moss-400 shrink-0" size={16} />
          <span className="font-sans text-sm text-cream-100/80">
            This email has been logged and would be delivered to the applicant.
          </span>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Mail className="text-stone-400" size={15} />
          <span className="font-sans text-xs text-stone-400 uppercase tracking-wider">Subject</span>
        </div>
        <p className="font-display text-lg text-cream-50 mb-4 px-4 py-3 rounded-lg bg-forest-950/40 border border-forest-700/40">
          {subject}
        </p>

        <div className="mb-3 font-sans text-xs text-stone-400 uppercase tracking-wider">Email preview</div>
        <div className="rounded-lg overflow-hidden border border-forest-700/40">
          <iframe
            srcDoc={html}
            title="Email preview"
            className="w-full h-[500px] bg-white"
            sandbox=""
          />
        </div>
      </div>
    </Modal>
  );
}
