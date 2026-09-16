import React, { useState } from 'react';
import { 
  Mail, Sparkles, Copy, Send, RefreshCw, Wand2, 
  User, Building2, Calendar, CheckCircle, X 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  purpose: string;
  tone: 'formal' | 'professional' | 'casual';
  content: string;
}

interface AIEmailGeneratorProps {
  open: boolean;
  onClose: () => void;
  recipientName?: string;
  recipientOrg?: string;
  context?: string;
}

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'follow-up-demo',
    name: 'Follow-up After Demo',
    subject: 'Next Steps - SIMRS Implementation',
    purpose: 'Follow-up setelah demo produk',
    tone: 'professional',
    content: `Dear {name},

Thank you for attending our SIMRS demo on {date}. We're excited about the possibility of partnering with {organization} to modernize your healthcare operations.

Based on our discussion, I understand your key priorities are:
• BPJS integration automation
• Real-time patient data management
• Mobile accessibility for medical staff

I'd like to propose the following next steps:
1. Detailed technical presentation for your IT team
2. Site visit to reference hospital (RS Sejahtera Jakarta)
3. Customized proposal with pricing for {bed_count} beds

Would you be available for a follow-up meeting next week? I have slots on Tuesday 2pm or Thursday 10am.

Looking forward to your response.`
  },
  {
    id: 'proposal-submission',
    name: 'Proposal Submission',
    subject: 'SIMRS Proposal - {organization}',
    purpose: 'Submit proposal resmi',
    tone: 'formal',
    content: `Dear {name},

Further to our recent discussions, please find attached our comprehensive proposal for SIMRS implementation at {organization}.

Proposal Highlights:
• Investment: Rp {budget} (includes hardware, software, training)
• Implementation Timeline: {timeline} months
• Included Modules: Core SIMRS, BPJS Integration, LIS, Mobile App
• Support: 24/7 technical support with 2-hour response SLA

Key Differentiators:
✅ 98.7% system uptime guarantee
✅ Local support team in {location}
✅ Proven track record with 150+ healthcare facilities
✅ Free system upgrades for 3 years

I'm available to present this proposal to your management team at your convenience. Please let me know if you need any clarifications.

Thank you for considering our solution.`
  },
  {
    id: 'cold-outreach',
    name: 'Cold Outreach',
    subject: 'Modernize Your Healthcare Operations',
    purpose: 'First contact dengan prospek baru',
    tone: 'professional',
    content: `Dear {name},

I hope this email finds you well. I'm reaching out because {organization} fits the profile of healthcare facilities that have successfully modernized their operations with our SIMRS platform.

I noticed that {pain_point}. Many hospitals in your area have faced similar challenges and achieved:
• 40% reduction in administrative workload
• 95% faster BPJS claim processing
• 60% improvement in patient satisfaction scores

Would you be open to a brief 15-minute call to explore how we might help {organization} achieve similar results?

I have availability this week on:
• Wednesday, 2pm - 4pm
• Friday, 10am - 12pm

No pressure - just a quick conversation to see if there's a fit.

Best regards,`
  },
  {
    id: 'upsell-module',
    name: 'Upsell Additional Module',
    subject: 'Enhance Your SIMRS with LIS Module',
    purpose: 'Cross-sell modul tambahan ke existing client',
    tone: 'professional',
    content: `Dear {name},

I hope you're enjoying the benefits of your SIMRS implementation at {organization}. Your team has been doing great with the system!

I wanted to reach out about an opportunity that could further streamline your laboratory operations. Based on your current lab volume of {lab_tests} tests/month, our LIS (Laboratory Information System) module could deliver significant value:

Expected Benefits:
• Automate lab result entry (save 15 hours/week)
• Reduce transcription errors by 95%
• Real-time integration with SIMRS
• Mobile result viewing for doctors

Special Offer for Existing Clients:
• 30% discount on implementation (save Rp {discount})
• Free data migration from current system
• 2-month trial period

{organization} is similar to your facility and achieved ROI within 4 months. Would you be interested in a 30-minute demo?

Let me know your availability next week.`
  },
  {
    id: 're-engagement',
    name: 'Re-engagement Campaign',
    subject: 'Following Up - Still Interested?',
    purpose: 'Re-engage cold leads',
    tone: 'casual',
    content: `Hi {name},

I wanted to reach out one more time regarding the SIMRS solution we discussed for {organization} back in {last_contact_date}.

I completely understand that timing might not have been right, or perhaps priorities have shifted. No worries at all!

However, I wanted to share that we just launched some new features that might be relevant:
• AI-powered patient queue management (new!)
• WhatsApp integration for appointment reminders (new!)
• Enhanced BPJS auto-claim with 99.8% success rate

If you're still exploring options, I'd be happy to provide an updated demo showcasing these new capabilities.

If not, no problem - just let me know and I'll stop reaching out.

Either way, hope all is well at {organization}!

Cheers,`
  }
];

export function AIEmailGenerator({ open, onClose, recipientName = '', recipientOrg = '', context = '' }: AIEmailGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [generating, setGenerating] = useState(false);
  const [tone, setTone] = useState<'formal' | 'professional' | 'casual'>('professional');
  const [customContext, setCustomContext] = useState(context);

  const generateEmail = (template: EmailTemplate) => {
    setGenerating(true);
    setSelectedTemplate(template);
    
    // Simulate AI generation with personalization
    setTimeout(() => {
      const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const userName = recipientName || 'Dr. [Name]';
      const orgName = recipientOrg || '[Organization Name]';
      
      let personalizedContent = template.content
        .replace(/\{name\}/g, userName)
        .replace(/\{organization\}/g, orgName)
        .replace(/\{date\}/g, today)
        .replace(/\{bed_count\}/g, '75')
        .replace(/\{budget\}/g, '285 juta')
        .replace(/\{timeline\}/g, '3')
        .replace(/\{location\}/g, 'Jakarta')
        .replace(/\{pain_point\}/g, 'you might be looking to improve operational efficiency')
        .replace(/\{lab_tests\}/g, '1,200')
        .replace(/\{discount\}/g, '45 juta')
        .replace(/\{last_contact_date\}/g, 'September 2024');

      // Add context if available
      if (customContext) {
        personalizedContent += `\n\n[Context Note: ${customContext}]`;
      }

      // Add AI signature
      personalizedContent += `\n\nBest regards,\n[Your Name]\nSales Executive\n[Company Name]\n📞 +62 xxx-xxxx-xxxx\n✉️ email@company.com`;

      setGeneratedEmail(personalizedContent);
      setEmailSubject(template.subject.replace(/\{organization\}/g, orgName));
      setGenerating(false);
      toast.success('Email generated successfully!');
    }, 1500);
  };

  const regenerateEmail = () => {
    if (selectedTemplate) {
      generateEmail(selectedTemplate);
      toast.info('Regenerating email...');
    }
  };

  const copyToClipboard = () => {
    const fullEmail = `Subject: ${emailSubject}\n\n${generatedEmail}`;
    navigator.clipboard.writeText(fullEmail);
    toast.success('Email copied to clipboard!');
  };

  const handleSend = () => {
    toast.success('Email sent successfully! (Demo mode)');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[calc(100%-2rem)] overflow-y-auto">
        <DialogDescription className="sr-only">
          AI-powered email generator with {EMAIL_TEMPLATES.length} professional templates for sales outreach, follow-ups, proposals, and re-engagement campaigns. Generate personalized emails to {recipientName || 'contacts'} at {recipientOrg || 'organizations'}.
        </DialogDescription>
        
        <DialogHeader className="bg-gradient-to-r from-[#013E37] to-[#025C52] text-white p-6 -m-6 mb-4 rounded-t-lg">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div>AI Email Generator</div>
              <div className="text-sm font-normal text-white/80 mt-1">
                Personalized email in seconds powered by AI
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Recipient Info */}
          {(recipientName || recipientOrg) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">To: {recipientName || 'Unnamed Contact'}</p>
                    <p className="text-xs text-gray-600">{recipientOrg || 'No organization'}</p>
                  </div>
                  <Badge className="bg-blue-600">Auto-detected</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Custom Context */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Context (Optional)
            </label>
            <textarea
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="e.g., Discussed BPJS integration, interested in 50-bed package, budget confirmed..."
              className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013E37] focus:border-transparent resize-none"
            />
          </div>

          {/* Tone Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Tone
            </label>
            <div className="flex gap-2">
              {['formal', 'professional', 'casual'].map((t) => (
                <Button
                  key={t}
                  onClick={() => setTone(t as any)}
                  variant={tone === t ? 'default' : 'outline'}
                  className={tone === t ? 'bg-[#013E37] hover:bg-[#025C52]' : ''}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Choose Email Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EMAIL_TEMPLATES.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                    selectedTemplate?.id === template.id
                      ? 'border-[#013E37] bg-[#EEF7F5]'
                      : 'border-gray-200 hover:border-[#013E37]'
                  }`}
                  onClick={() => generateEmail(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Mail className="h-5 w-5 text-[#013E37]" />
                      <Badge variant="outline" className="text-xs">
                        {template.tone}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                    <p className="text-xs text-gray-600">{template.purpose}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Generated Email Preview */}
          {generatedEmail && (
            <Card className="border-2 border-[#013E37]">
              <CardHeader className="bg-gradient-to-r from-[#013E37] to-[#025C52] text-white pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4" />
                    Generated Email
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={regenerateEmail}
                      disabled={generating}
                      className="text-white hover:bg-white/20 h-8"
                    >
                      <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyToClipboard}
                      className="text-white hover:bg-white/20 h-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Subject Line */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">SUBJECT</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013E37] focus:border-transparent font-semibold"
                  />
                </div>

                {/* Email Body */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">MESSAGE</label>
                  <textarea
                    value={generatedEmail}
                    onChange={(e) => setGeneratedEmail(e.target.value)}
                    className="w-full h-96 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#013E37] focus:border-transparent font-mono text-sm resize-none"
                  />
                </div>

                {/* Personalization Tags */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-2">✨ AI Personalized:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs bg-white">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Recipient name
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Organization
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Context-aware
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-white">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      Professional tone
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={onClose}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="border-[#013E37] text-[#013E37] hover:bg-[#EEF7F5]"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button
                    onClick={handleSend}
                    className="bg-[#013E37] hover:bg-[#025C52]"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!generatedEmail && !generating && (
            <Card className="bg-gray-50 border-dashed border-2">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a template to get started
                </h3>
                <p className="text-sm text-gray-600">
                  AI will generate a personalized email based on your recipient and context
                </p>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {generating && (
            <Card className="bg-gradient-to-r from-blue-50 to-[#EEF7F5] border-blue-200">
              <CardContent className="p-8 text-center">
                <div className="animate-pulse">
                  <Sparkles className="h-12 w-12 text-[#013E37] mx-auto mb-4 animate-bounce" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    🤖 AI is crafting your email...
                  </h3>
                  <p className="text-sm text-gray-600">
                    Personalizing content based on recipient and context
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}