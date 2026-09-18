// A logged client interaction (call, email, meeting, WhatsApp, visit).
// AddCommunicationDialog.tsx builds these and passes them via its `onAdd`
// callback into ClientDetailDialog.tsx, which stores them in a
// `communications: Communication[]` list — but each file previously
// declared this identical shape independently with no shared import.
export interface Communication {
  id: string;
  type: 'Telepon' | 'Email' | 'Meeting' | 'WhatsApp' | 'Visit';
  title: string;
  description: string;
  timestamp: string;
  categories: string[];
}
