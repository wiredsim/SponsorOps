import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Send, Lightbulb, ChevronDown, ChevronUp, Mail, AlertCircle } from 'lucide-react';

// Email templates with merge fields and coaching tips
const emailTemplates = [
  {
    id: 'new-sponsor',
    name: 'New Sponsor - First Contact',
    description: 'For companies you\'ve never contacted before',
    forTypes: ['new-prospect', 'local-business'],
    subject: '{{team_location}} Robotics Students - Brief Introduction',
    body: `Dear {{contact_name}},

I'm {{sender_name}}, and I'm part of {{team_name}}, a FIRST Robotics Competition team based in {{team_location}}. We're a group of {{team_size}} high school students who design, build, and compete with 120-pound robots in just 6 weeks.

I'm reaching out because {{personalization_sentence}}

We'd love the opportunity to introduce ourselves and share what we're working on this season. Would you have 15-20 minutes for a brief call or visit? We're happy to work around your schedule.

Thank you for considering this!

{{sender_name}}
{{team_name}}
{{sender_email}}`,
    tips: [
      'The personalization sentence is THE MOST IMPORTANT PART - mention something specific about THEM and connect it to YOUR team',
      'Keep it under 150 words total',
      'Ask for a conversation, not money',
      'Make it easy to say yes by offering flexibility'
    ],
    goodExamples: [
      '"we noticed {{company_name}} specializes in advanced manufacturing, and we\'re developing our own CNC and 3D printing capabilities this season"',
      '"your company\'s commitment to STEM education aligns closely with our mission to inspire young engineers"',
      '"{{company_name}} is a pillar of our local community, and we\'re training the next generation of technical talent right here"'
    ],
    badExamples: [
      '"your company seems successful"',
      '"we need sponsors"',
      '"you probably care about robotics"'
    ]
  },
  {
    id: 'previous-sponsor',
    name: 'Previous Sponsor - Re-engagement',
    description: 'For companies that sponsored before',
    forTypes: ['previous-sponsor'],
    subject: 'Thank You from {{team_name}} - {{season_year}} Season Update',
    body: `Dear {{contact_name}},

I hope this email finds you well! I'm {{sender_name}} with {{team_name}}. I wanted to reach out to thank {{company_name}} for your support during our previous season and share some updates.

With your help, we:
- {{achievement_1}}
- {{achievement_2}}
- {{achievement_3}}

Your partnership made a real difference for our students, and we're grateful.

Looking ahead to the {{season_year}} season:
We're kicking off our build season with some exciting new challenges. {{new_tech}}

We'd love to have {{company_name}} continue as a partner in our mission to inspire young engineers. Would you be available for a brief call to discuss this year's partnership opportunities?

Thank you again for believing in our team!

{{sender_name}}
{{team_name}}
{{sender_email}}`,
    tips: [
      'Be SPECIFIC about what you accomplished with their help',
      'Include numbers where possible (X competitions, Y students)',
      'Mix competition success with student impact',
      'Make them feel like they were part of something awesome'
    ],
    goodExamples: [
      '"Competed at the State Championship for the first time in team history"',
      '"Grew our team to 35 students, including 12 who are now pursuing engineering degrees"',
      '"Successfully implemented swerve drive and autonomous navigation"'
    ],
    badExamples: [
      '"We did some stuff last year"',
      '"We need money again"'
    ]
  },
  {
    id: 'follow-up',
    name: 'Follow-up (No Response)',
    description: 'If no response after 5-7 days',
    forTypes: ['new-prospect', 'previous-sponsor', 'local-business', 'parent-connection', 'mentor-connection'],
    subject: 'Following up - {{team_name}} Introduction',
    body: `Hi {{contact_name}},

I wanted to follow up on my email from last week about {{team_name}}, our local FIRST Robotics team.

I know you're busy, so I'll keep this brief - we're a group of {{team_size}} students building robots and learning engineering, and we'd love a few minutes to introduce ourselves and our program.

If now isn't a good time, no worries at all! But if you have 15 minutes for a quick call, we'd really appreciate it.

Thanks for your time!

{{sender_name}}
{{sender_email}}`,
    tips: [
      'Keep it SHORT - even shorter than the first email',
      'Acknowledge they\'re busy (shows respect)',
      'Give them an easy out ("no worries")',
      'Only follow up once, maybe twice max'
    ],
    goodExamples: [],
    badExamples: [
      '"I noticed you didn\'t respond..."',
      '"Did you get my last email?"',
      'Sending 5 follow-ups in 2 weeks'
    ]
  },
  {
    id: 'meeting-scheduled',
    name: 'Meeting Confirmed',
    description: 'After they agree to meet',
    forTypes: ['new-prospect', 'previous-sponsor', 'local-business', 'parent-connection', 'mentor-connection'],
    subject: 'Re: {{team_name}} - Looking forward to meeting!',
    body: `Hi {{contact_name}},

That's wonderful, thank you! We're excited to tell you more about what we're working on.

Just to confirm: {{meeting_details}}

We'll bring a couple of our students so you can hear directly from them about what the team means to them. We'll keep it brief and focused.

Looking forward to it!

{{sender_name}}
{{team_name}}`,
    tips: [
      'Confirm the details clearly',
      'Bring 2-3 students (not just 1)',
      'Prepare a 5-minute overview',
      'Bring photos/videos of the robot',
      'Practice your pitch beforehand'
    ],
    goodExamples: [],
    badExamples: []
  }
];

export function EmailComposer({ sponsor, teamInfo, currentTeam, onClose, onLogInteraction }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customFields, setCustomFields] = useState({});
  const [copied, setCopied] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  // Auto-select template based on sponsor type
  useEffect(() => {
    if (sponsor?.type) {
      const matchingTemplate = emailTemplates.find(t => t.forTypes.includes(sponsor.type));
      if (matchingTemplate) {
        setSelectedTemplate(matchingTemplate);
      }
    }
  }, [sponsor]);

  // Format an array of variable items as bullet points
  const formatVariableList = (items) => {
    if (!items || items.length === 0) return null;
    return items.map(item => `- ${item.value}`).join('\n');
  };

  // Get merge field value from various sources
  const getMergeValue = (field) => {
    // Custom field override
    if (customFields[field]) return customFields[field];

    // Sponsor data
    const sponsorMap = {
      'company_name': sponsor?.name,
      'contact_name': sponsor?.contact_name || sponsor?.contactName || '[Contact Name]',
      'contact_title': sponsor?.contact_title || sponsor?.contactTitle,
      'contact_email': sponsor?.email,
      'contact_phone': sponsor?.phone,
      'industry': sponsor?.industry,
      'website': sponsor?.website,
    };
    if (sponsorMap[field]) return sponsorMap[field];

    // Variables from VariablesEditor (stored in teamInfo.variables)
    const variables = teamInfo?.variables || {};
    const variablesMap = {
      'past_achievements': formatVariableList(variables.past_achievements),
      'future_goals': formatVariableList(variables.future_goals),
      'team_facts': formatVariableList(variables.team_facts),
    };
    if (variablesMap[field]) return variablesMap[field];

    // Custom variables from VariablesEditor
    const customVars = variables.custom || [];
    const customVar = customVars.find(v => v.key === field);
    if (customVar) return customVar.value;

    // Team info (currentTeam for name/number, teamInfo for other fields)
    const teamMap = {
      'team_name': currentTeam?.name || teamInfo?.team_name || 'Our Team',
      'team_number': currentTeam?.team_number || teamInfo?.team_number,
      'team_location': teamInfo?.team_location || '[Your Town]',
      'team_size': teamInfo?.team_size || '[X]',
      'season_year': teamInfo?.season_year || '2025',
      'new_tech': teamInfo?.new_tech || '[describe what\'s new this season]',
      'team_changes': teamInfo?.team_changes,
      'goals': teamInfo?.goals,
      'last_season_achievements': teamInfo?.last_season_achievements,
      'last_season_story': teamInfo?.last_season_story,
      // Legacy achievement fields (for backwards compatibility)
      'achievement_1': teamInfo?.achievement_1 || '[Specific achievement]',
      'achievement_2': teamInfo?.achievement_2 || '[Student impact]',
      'achievement_3': teamInfo?.achievement_3 || '[Cool accomplishment]',
    };
    if (teamMap[field]) return teamMap[field];

    // User/sender info (would come from auth context in real implementation)
    const senderMap = {
      'sender_name': '[Your Name]',
      'sender_email': '[Your Email]',
    };
    if (senderMap[field]) return senderMap[field];

    // Placeholders for manual fields
    const placeholders = {
      'personalization_sentence': '[WHY you\'re reaching out to THIS company - see tips below!]',
      'meeting_details': '[Date, time, location]',
    };
    if (placeholders[field]) return placeholders[field];

    return `[${field}]`;
  };

  // Replace all merge fields in text
  const replaceMergeFields = (text) => {
    if (!text) return '';
    return text.replace(/\{\{(\w+)\}\}/g, (match, field) => getMergeValue(field));
  };

  // Find unfilled merge fields
  const getUnfilledFields = (text) => {
    const filled = replaceMergeFields(text);
    const matches = filled.match(/\[[^\]]+\]/g) || [];
    return matches;
  };

  const handleCopy = async (text) => {
    const filledText = replaceMergeFields(text);
    await navigator.clipboard.writeText(filledText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAll = async () => {
    if (!selectedTemplate) return;
    const subject = replaceMergeFields(selectedTemplate.subject);
    const body = replaceMergeFields(selectedTemplate.body);
    const fullEmail = `Subject: ${subject}\n\n${body}`;
    await navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkAsSent = () => {
    if (!selectedTemplate) return;
    onLogInteraction({
      type: 'email',
      notes: `Sent "${selectedTemplate.name}" email template`,
      template_used: selectedTemplate.id,
    });
    onClose();
  };

  // Filter templates for this sponsor type
  const relevantTemplates = emailTemplates.filter(t =>
    !sponsor?.type || t.forTypes.includes(sponsor.type)
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <Mail className="w-6 h-6 text-orange-500" />
              Compose Email
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              to {sponsor?.name || 'Sponsor'}
              {sponsor?.contactName && ` (${sponsor.contactName})`}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Template Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-blue-300 mb-2">Select Template</label>
            <div className="grid grid-cols-2 gap-3">
              {relevantTemplates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`text-left p-4 rounded-lg border transition-all ${
                    selectedTemplate?.id === template.id
                      ? 'bg-orange-500/20 border-orange-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-slate-400 mt-1">{template.description}</div>
                </button>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <>
              {/* Coaching Tips */}
              {selectedTemplate.tips.length > 0 && (
                <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setShowTips(!showTips)}
                    className="w-full p-4 flex items-center justify-between text-amber-300 hover:bg-amber-500/10"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      <span className="font-medium">Coaching Tips</span>
                    </div>
                    {showTips ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>

                  {showTips && (
                    <div className="px-4 pb-4 space-y-3">
                      <ul className="space-y-2">
                        {selectedTemplate.tips.map((tip, i) => (
                          <li key={i} className="text-amber-200 text-sm flex items-start gap-2">
                            <span className="text-amber-500">*</span>
                            {tip}
                          </li>
                        ))}
                      </ul>

                      {selectedTemplate.goodExamples.length > 0 && (
                        <div className="mt-4">
                          <div className="text-green-400 text-sm font-medium mb-2">Good examples:</div>
                          {selectedTemplate.goodExamples.map((ex, i) => (
                            <div key={i} className="text-green-300 text-sm bg-green-500/10 p-2 rounded mb-1">
                              {replaceMergeFields(ex)}
                            </div>
                          ))}
                        </div>
                      )}

                      {selectedTemplate.badExamples.length > 0 && (
                        <div className="mt-4">
                          <div className="text-red-400 text-sm font-medium mb-2">Avoid:</div>
                          {selectedTemplate.badExamples.map((ex, i) => (
                            <div key={i} className="text-red-300 text-sm bg-red-500/10 p-2 rounded mb-1">
                              {ex}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Subject Line */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-blue-300">Subject</label>
                  <button
                    onClick={() => handleCopy(selectedTemplate.subject)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white">
                  {replaceMergeFields(selectedTemplate.subject)}
                </div>
              </div>

              {/* Email Body */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-blue-300">Email Body</label>
                  <button
                    onClick={() => handleCopy(selectedTemplate.body)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-white whitespace-pre-wrap font-mono text-sm leading-relaxed">
                  {replaceMergeFields(selectedTemplate.body)}
                </div>
              </div>

              {/* Unfilled Fields Warning */}
              {getUnfilledFields(selectedTemplate.subject + selectedTemplate.body).length > 0 && (
                <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-orange-300 font-medium text-sm">Fields to fill in:</div>
                    <div className="text-orange-200 text-sm mt-1">
                      {getUnfilledFields(selectedTemplate.subject + selectedTemplate.body).join(', ')}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Field Inputs */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-blue-300 mb-2">Personalization Sentence</label>
                <textarea
                  value={customFields.personalization_sentence || ''}
                  onChange={(e) => setCustomFields({...customFields, personalization_sentence: e.target.value})}
                  placeholder="Why are you reaching out to THIS company specifically? What's the connection?"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-700 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyAll}
              disabled={!selectedTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Email'}
            </button>

            <button
              onClick={handleMarkAsSent}
              disabled={!selectedTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Mark as Sent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailComposer;
