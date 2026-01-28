import React, { useState } from 'react';
import {
  X, Plus, Edit2, Trash2, Copy, Check, ChevronDown, ChevronUp,
  Mail, Phone, Users, Lightbulb, FileText, Play, BookOpen,
  MessageSquare, Target, Clock, AlertCircle, CheckCircle2, Sparkles,
  HelpCircle, Building2, User, Settings, Zap
} from 'lucide-react';

// All available merge field variables
export const variableReference = {
  sponsor: {
    title: 'Sponsor Variables',
    description: 'Auto-filled from the sponsor record you\'re emailing',
    icon: Building2,
    color: 'blue',
    variables: [
      { key: 'company_name', description: 'Company/organization name', example: 'Acme Manufacturing' },
      { key: 'contact_name', description: 'Contact person\'s name', example: 'Jane Smith' },
      { key: 'contact_title', description: 'Contact\'s job title', example: 'Marketing Director' },
      { key: 'contact_email', description: 'Contact\'s email address', example: 'jane@acme.com' },
      { key: 'contact_phone', description: 'Contact\'s phone number', example: '555-123-4567' },
      { key: 'industry', description: 'Company industry/sector', example: 'Manufacturing' },
      { key: 'website', description: 'Company website URL', example: 'www.acme.com' },
    ]
  },
  team: {
    title: 'Team Variables',
    description: 'Set up in Team Specs - basic team information',
    icon: Users,
    color: 'purple',
    variables: [
      { key: 'team_name', description: 'Your team\'s full name', example: 'Team 74 CHAOS' },
      { key: 'team_number', description: 'FRC team number', example: '74' },
      { key: 'team_location', description: 'City/town location', example: 'Holland, Michigan' },
      { key: 'team_size', description: 'Number of students', example: '35' },
      { key: 'season_year', description: 'Current competition year', example: '2025' },
    ]
  },
  season: {
    title: 'Season Variables',
    description: 'Set up in Team Specs - this season\'s details',
    icon: Zap,
    color: 'orange',
    variables: [
      { key: 'new_tech', description: 'New technology/approach this season', example: 'Implementing swerve drive and computer vision' },
      { key: 'team_changes', description: 'Changes from last year', example: 'Added 10 new members, new workshop space' },
      { key: 'goals', description: 'This season\'s goals', example: 'Qualify for State Championship' },
      { key: 'last_season_achievements', description: 'What you accomplished last year', example: 'Regional finalists, Innovation Award' },
      { key: 'last_season_story', description: 'Story from last season', example: 'Our robot competed in 3 events...' },
    ]
  },
  lists: {
    title: 'List Variables',
    description: 'Set up in Team Specs > Variables section - formatted as bullet points',
    icon: FileText,
    color: 'green',
    variables: [
      { key: 'past_achievements', description: 'What you accomplished WITH sponsor help', example: '- Competed at State Championship\n- Grew team to 45 students' },
      { key: 'future_goals', description: 'What you CAN DO with sponsor support', example: '- Fund our Manufacturing Initiative\n- Send students to Championship' },
      { key: 'team_facts', description: 'Quick facts about your team', example: '- 15 years competing\n- Alumni at NASA and SpaceX' },
    ]
  },
  sender: {
    title: 'Sender Variables',
    description: 'You\'ll fill these in when composing - who\'s sending the email',
    icon: User,
    color: 'slate',
    variables: [
      { key: 'sender_name', description: 'Your name (the person sending)', example: 'Alex Johnson' },
      { key: 'sender_email', description: 'Your email address', example: 'alex@team74.org' },
      { key: 'personalization_sentence', description: 'WHY you\'re reaching out to THIS company', example: 'your commitment to local STEM education...' },
      { key: 'meeting_details', description: 'When/where you\'re meeting', example: 'Tuesday at 2pm at your office' },
    ]
  },
  custom: {
    title: 'Custom Variables',
    description: 'Create your own in Team Specs > Variables section',
    icon: Settings,
    color: 'amber',
    variables: [
      { key: 'robot_name', description: 'Example: your robot\'s name', example: 'Thunderbolt' },
      { key: 'mentor_name', description: 'Example: lead mentor', example: 'Coach Williams' },
      { key: 'any_key_you_want', description: 'Any custom variable you create', example: 'Your custom value' },
    ]
  }
};

// Variables Guide Component
export function VariablesGuide({ onClose, onNavigateToSpecs }) {
  const [expandedSection, setExpandedSection] = useState('sponsor');
  const [copiedVar, setCopiedVar] = useState(null);

  const handleCopy = async (varKey) => {
    await navigator.clipboard.writeText(`{{${varKey}}}`);
    setCopiedVar(varKey);
    setTimeout(() => setCopiedVar(null), 1500);
  };

  const colorClasses = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-500' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'text-purple-500' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: 'text-orange-500' },
    green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: 'text-green-500' },
    slate: { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', icon: 'text-slate-500' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'text-amber-500' },
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-orange-500" />
              Variables Guide
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              How to use merge fields in your templates
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* How it works */}
          <div className="bg-slate-900/50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-white mb-2">How Variables Work</h4>
            <p className="text-slate-300 text-sm mb-3">
              Variables are placeholders in your templates that get replaced with real data when you compose an email.
              Write them as <code className="px-1.5 py-0.5 bg-slate-800 rounded text-orange-400">{"{{variable_name}}"}</code> and
              they'll auto-fill with sponsor info, team details, or custom values.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Template:</span>
                <code className="px-2 py-1 bg-slate-800 rounded text-white">{"Dear {{contact_name}},"}</code>
              </div>
              <span className="text-slate-500">→</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Result:</span>
                <code className="px-2 py-1 bg-green-500/20 rounded text-green-300">Dear Jane Smith,</code>
              </div>
            </div>
          </div>

          {/* Variable Categories */}
          {Object.entries(variableReference).map(([key, category]) => {
            const Icon = category.icon;
            const colors = colorClasses[category.color];
            const isExpanded = expandedSection === key;

            return (
              <div key={key} className={`rounded-xl border ${colors.border} overflow-hidden`}>
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : key)}
                  className={`w-full p-4 flex items-center gap-3 ${colors.bg} hover:bg-white/5 transition-colors`}
                >
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-medium ${colors.text}`}>{category.title}</h4>
                    <p className="text-sm text-slate-400">{category.description}</p>
                  </div>
                  <span className="text-sm text-slate-500">{category.variables.length} variables</span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-4 pt-0 space-y-2">
                    {category.variables.map((v) => (
                      <div key={v.key} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                        <button
                          onClick={() => handleCopy(v.key)}
                          className="flex-shrink-0 px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-orange-400 font-mono text-sm transition-colors"
                          title="Click to copy"
                        >
                          {copiedVar === v.key ? (
                            <span className="text-green-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> copied
                            </span>
                          ) : (
                            `{{${v.key}}}`
                          )}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm">{v.description}</p>
                          <p className="text-slate-500 text-xs mt-1">Example: {v.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Setup CTA */}
          {onNavigateToSpecs && (
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl p-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">Set up your variables</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    Configure your team info, achievements, and goals in Team Specs
                  </p>
                </div>
                <button
                  onClick={() => { onNavigateToSpecs(); onClose(); }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Go to Team Specs
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Playbook types with icons and colors
const playbookTypes = {
  email: { label: 'Email Template', icon: Mail, color: 'orange' },
  phone: { label: 'Phone Script', icon: Phone, color: 'blue' },
  meeting: { label: 'Meeting Guide', icon: Users, color: 'purple' },
  tip: { label: 'Quick Tip', icon: Lightbulb, color: 'green' },
};

// Sponsor stages for context-aware suggestions
const sponsorStages = [
  { value: 'research', label: 'Research' },
  { value: 'outreach', label: 'Initial Outreach' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'meeting', label: 'Meeting Scheduled' },
  { value: 'proposal', label: 'Proposal Sent' },
  { value: 'negotiation', label: 'Negotiating' },
  { value: 'committed', label: 'Committed' },
  { value: 'received', label: 'Received' },
  { value: 'thank-you', label: 'Thank You' },
];

// Default playbooks to seed new teams
export const defaultPlaybooks = [
  // EMAIL TEMPLATES
  {
    id: 'email-first-contact',
    type: 'email',
    title: 'First Contact - New Prospect',
    stages: ['outreach'],
    subject: '{{team_location}} Robotics Students - Brief Introduction',
    content: `Dear {{contact_name}},

I'm {{sender_name}}, and I'm part of {{team_name}}, a FIRST Robotics Competition team based in {{team_location}}. We're a group of {{team_size}} high school students who design, build, and compete with 120-pound robots in just 6 weeks.

I'm reaching out because {{personalization_sentence}}

We'd love the opportunity to introduce ourselves and share what we're working on this season. Would you have 15-20 minutes for a brief call or visit? We're happy to work around your schedule.

Thank you for considering this!

{{sender_name}}
{{team_name}}`,
    tips: [
      'The personalization sentence is THE MOST IMPORTANT PART',
      'Keep it under 150 words total',
      'Ask for a conversation, not money',
      'Make it easy to say yes by offering flexibility'
    ],
    isDefault: true
  },
  {
    id: 'email-returning-sponsor',
    type: 'email',
    title: 'Re-engagement - Returning Sponsor',
    stages: ['outreach'],
    subject: 'Thank You from {{team_name}} - {{season_year}} Season Update',
    content: `Dear {{contact_name}},

I hope this email finds you well! I'm {{sender_name}} with {{team_name}}. I wanted to reach out to thank {{company_name}} for your support during our previous season and share some updates.

With your help, we:
{{past_achievements}}

Your partnership made a real difference for our students, and we're grateful.

Looking ahead to the {{season_year}} season, with your continued support we can:
{{future_goals}}

We'd love to have {{company_name}} continue as a partner. Would you be available for a brief call to discuss this year's partnership?

Thank you again for believing in our team!

{{sender_name}}
{{team_name}}`,
    tips: [
      'Be SPECIFIC about what you accomplished with their help',
      'Include numbers where possible',
      'Mix competition success with student impact',
      'Show them what their investment made possible'
    ],
    isDefault: true
  },
  {
    id: 'email-follow-up',
    type: 'email',
    title: 'Follow-up - No Response',
    stages: ['follow-up'],
    subject: 'Following up - {{team_name}} Introduction',
    content: `Hi {{contact_name}},

I wanted to follow up on my email from last week about {{team_name}}, our local FIRST Robotics team.

I know you're busy, so I'll keep this brief - we're a group of {{team_size}} students building robots and learning engineering, and we'd love a few minutes to introduce ourselves and our program.

If now isn't a good time, no worries at all! But if you have 15 minutes for a quick call, we'd really appreciate it.

Thanks for your time!

{{sender_name}}`,
    tips: [
      'Keep it SHORT - even shorter than the first email',
      'Acknowledge they are busy (shows respect)',
      'Give them an easy out',
      'Only follow up once, maybe twice max'
    ],
    isDefault: true
  },
  {
    id: 'email-thank-you',
    type: 'email',
    title: 'Thank You - After Donation',
    stages: ['thank-you'],
    subject: 'Thank You from {{team_name}}!',
    content: `Dear {{contact_name}},

On behalf of everyone at {{team_name}}, I want to express our sincere gratitude for {{company_name}}'s generous support!

Your investment in our team means so much to our students. With your help, we'll be able to {{future_goals}}

We'll keep you updated on our progress throughout the season. We'd also love to invite you to see our robot in action at an upcoming competition!

Thank you again for believing in the next generation of engineers and innovators.

With gratitude,
{{sender_name}} and the entire {{team_name}} family`,
    tips: [
      'Send within 24-48 hours of receiving donation',
      'Be specific about what their gift enables',
      'Invite them to see the impact in person',
      'Keep the door open for future relationship'
    ],
    isDefault: true
  },

  // PHONE SCRIPTS
  {
    id: 'phone-cold-call',
    type: 'phone',
    title: 'Cold Call Introduction',
    stages: ['outreach'],
    content: `**OPENING (10 seconds)**
"Hi, this is [Your Name] from [Team Name], a local high school robotics team. Do you have just 2 minutes?"

**IF YES - THE HOOK (20 seconds)**
"Great! I'm reaching out because [PERSONALIZATION - why this company]. We're a group of [X] students who build competitive robots and we're looking for community partners who share our passion for developing future engineers."

**THE ASK (10 seconds)**
"I'd love to send you a quick email with more info and maybe schedule a 15-minute call. Would that be okay?"

**IF THEY ASK ABOUT MONEY**
"We have various partnership levels, but honestly I'd just love to tell you more about what we do first. Many partners find value beyond just financial support."

**CLOSING**
"What's the best email to reach you? ... Great, I'll send that over today. Thanks so much for your time!"`,
    tips: [
      'Stand up while calling - you\'ll sound more energetic',
      'Smile while talking - it comes through in your voice',
      'Have the sponsor\'s website open in front of you',
      'If they\'re busy, ask for a better time to call back',
      'It\'s okay if they say no - thank them and move on'
    ],
    isDefault: true
  },
  {
    id: 'phone-voicemail',
    type: 'phone',
    title: 'Leaving a Voicemail',
    stages: ['outreach', 'follow-up'],
    content: `**KEEP IT TO 20-30 SECONDS**

"Hi [Name], this is [Your Name] from [Team Name], a local high school robotics team.

I'm reaching out because [ONE SENTENCE personalization].

I'd love to tell you more about our program. You can reach me at [PHONE NUMBER] - that's [REPEAT NUMBER].

Thanks, and have a great day!"

**KEY POINTS:**
- Speak slowly and clearly
- Say your phone number TWICE
- Keep it SHORT - under 30 seconds
- Sound friendly and confident, not desperate`,
    tips: [
      'Write out your number so you say it clearly',
      'Practice before calling',
      'Leave a voicemail even if you\'ll also email',
      'One voicemail is enough - don\'t leave multiple'
    ],
    isDefault: true
  },

  // MEETING GUIDES
  {
    id: 'meeting-first',
    type: 'meeting',
    title: 'First Meeting Agenda',
    stages: ['meeting'],
    content: `**BEFORE THE MEETING**
□ Research the company and contact
□ Prepare 2-3 students to attend
□ Bring: team info sheet, photos, small robot demo if possible
□ Practice your 2-minute pitch

**MEETING STRUCTURE (15-20 min)**

**1. Introductions (2 min)**
- Thank them for their time
- Introduce yourself and students
- Let each student say one sentence about their role

**2. Our Team Story (3 min)**
- Who we are, how long we've been competing
- What makes robotics special
- Brief mention of achievements

**3. What We're Building (5 min)**
- This year's challenge
- What we're excited about
- Show photos/video if you have them

**4. The Ask (3 min)**
- Partnership opportunities
- What their support would enable
- Various ways to partner (not just money)

**5. Questions & Next Steps (5 min)**
- Answer their questions
- Ask what interests them most
- Agree on next steps

**AFTER THE MEETING**
□ Send thank-you email within 24 hours
□ Include any materials promised
□ Add notes to SponsorOps`,
    tips: [
      'Let students do most of the talking',
      'Bring something to show (photos, awards, small demo)',
      'Don\'t overstay - respect their time',
      'Listen more than you talk'
    ],
    isDefault: true
  },
  {
    id: 'meeting-objections',
    type: 'meeting',
    title: 'Handling Common Objections',
    stages: ['meeting', 'negotiation'],
    content: `**"We don't have budget for this"**
→ "I understand. Would it help if I shared some non-financial ways companies partner with us? Some sponsors provide materials, services, or mentorship instead."

**"We already support other organizations"**
→ "That's great to hear - it shows you're committed to the community. Our program offers a unique opportunity to support STEM education specifically. Could we be considered for next year's budget?"

**"I need to check with someone else"**
→ "Of course! Would it help if I prepared a one-page summary you could share with them? And who would be the best person for me to follow up with?"

**"What do we get out of it?"**
→ "Great question! Partners get logo placement on our robot and team shirts, recognition at events, and most importantly - the chance to meet and inspire future engineers. Some partners also enjoy hosting team visits or seeing us compete."

**"Can you send me more information?"**
→ "Absolutely! I'll send that today. Would it be okay if I followed up next week to answer any questions?"

**"We're too busy right now"**
→ "I completely understand. When would be a better time for me to reach back out? I'm happy to work around your schedule."`,
    tips: [
      'Never argue - acknowledge their concern first',
      'Have a next step ready for any response',
      'No doesn\'t always mean never',
      'Stay positive and professional'
    ],
    isDefault: true
  },

  // QUICK TIPS
  {
    id: 'tip-best-times',
    type: 'tip',
    title: 'Best Times to Reach Out',
    stages: ['outreach'],
    content: `**BEST TIMES TO CALL**
- Tuesday-Thursday, 10am-11am or 2pm-4pm
- Avoid Mondays (catching up) and Fridays (winding down)
- Avoid lunch hours (12-1pm)

**BEST TIMES TO EMAIL**
- Tuesday-Thursday, early morning (7-8am) or mid-afternoon (2-3pm)
- Emails sent early morning often get read first

**WORST TIMES**
- Monday mornings (inbox overload)
- Friday afternoons (already checked out)
- Right before/after holidays

**RESPONSE TIME**
- If no response in 5-7 business days, follow up once
- After 2 attempts, wait a month before trying again
- Don't take it personally - people are busy!`,
    tips: [],
    isDefault: true
  },
  {
    id: 'tip-research',
    type: 'tip',
    title: 'What to Research First',
    stages: ['research'],
    content: `**BEFORE REACHING OUT - DO YOUR HOMEWORK**

□ **Company basics**
  - What do they do? (in plain English)
  - How big are they?
  - Where are they located?

□ **Find the connection**
  - Do they work in tech/engineering?
  - Do they support other community programs?
  - Do we have any personal connections?

□ **Find the right person**
  - Look for: Community Relations, Marketing, HR, or Owner
  - Check company website "About" or "Team" pages
  - Try LinkedIn if website doesn't list contacts

□ **Craft your personalization**
  - Why THIS company?
  - How do THEY connect to YOUR team?
  - Make it specific, not generic!

**USE THE DETECTIVE WORKSHEET!**
Click the 🔍 button on any sponsor to do guided research.`,
    tips: [],
    isDefault: true
  }
];

// Color utilities
const colorClasses = {
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: 'text-orange-500', badge: 'bg-orange-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'text-blue-500', badge: 'bg-blue-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'text-purple-500', badge: 'bg-purple-500' },
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: 'text-green-500', badge: 'bg-green-500' },
};

// Playbook Card Component
function PlaybookCard({ playbook, onEdit, onDelete, onUse, onCustomize, onHide, onPlayScript }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const typeConfig = playbookTypes[playbook.type];
  const colors = colorClasses[typeConfig.color];
  const Icon = typeConfig.icon;

  const handleCopy = async () => {
    const text = playbook.subject
      ? `Subject: ${playbook.subject}\n\n${playbook.content}`
      : playbook.content;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
      <div
        className="p-4 flex items-start gap-3 cursor-pointer hover:bg-white/5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-white truncate">{playbook.title}</h4>
            {playbook.isDefault && (
              <span className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">Default</span>
            )}
          </div>
          <p className={`text-sm ${colors.text}`}>{typeConfig.label}</p>
        </div>
        <div className="flex items-center gap-2">
          {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Subject line for emails */}
          {playbook.subject && (
            <div>
              <label className="text-xs text-slate-500 uppercase tracking-wide">Subject</label>
              <p className="text-white bg-slate-900/50 p-2 rounded mt-1 text-sm">{playbook.subject}</p>
            </div>
          )}

          {/* Content */}
          <div>
            <label className="text-xs text-slate-500 uppercase tracking-wide">
              {playbook.type === 'email' ? 'Body' : 'Script'}
            </label>
            <div className="text-white bg-slate-900/50 p-3 rounded mt-1 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
              {playbook.content}
            </div>
          </div>

          {/* Tips */}
          {playbook.tips && playbook.tips.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                <Lightbulb className="w-4 h-4" />
                Tips
              </div>
              <ul className="space-y-1">
                {playbook.tips.map((tip, i) => (
                  <li key={i} className="text-amber-200 text-sm flex items-start gap-2">
                    <span className="text-amber-500">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Applicable stages */}
          {playbook.stages && playbook.stages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-500">Use when:</span>
              {playbook.stages.map(stage => (
                <span key={stage} className="text-xs px-2 py-1 bg-slate-700 text-slate-300 rounded">
                  {sponsorStages.find(s => s.value === stage)?.label || stage}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-700">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            {onPlayScript && (
              <button
                onClick={() => onPlayScript(playbook)}
                className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                <Play className="w-4 h-4" />
                Play Script
              </button>
            )}
            {onUse && (
              <button
                onClick={() => onUse(playbook)}
                className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
              >
                <Play className="w-4 h-4" />
                Use This
              </button>
            )}
            {playbook.isDefault && onCustomize && (
              <button
                onClick={() => onCustomize(playbook)}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg text-sm"
                title="Create editable copy"
              >
                <Copy className="w-4 h-4" />
                Customize
              </button>
            )}
            {playbook.isDefault && onHide && (
              <button
                onClick={() => onHide(playbook.id)}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg text-sm"
                title="Hide this template"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            {!playbook.isDefault && onEdit && (
              <button
                onClick={() => onEdit(playbook)}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg text-sm"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {!playbook.isDefault && onDelete && (
              <button
                onClick={() => onDelete(playbook.id)}
                className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Playbook Editor Modal
function PlaybookEditor({ playbook, onSave, onClose }) {
  const [formData, setFormData] = useState(playbook || {
    type: 'email',
    title: '',
    subject: '',
    content: '',
    tips: [],
    stages: [],
  });
  const [newTip, setNewTip] = useState('');

  const addTip = () => {
    if (newTip.trim()) {
      setFormData({ ...formData, tips: [...(formData.tips || []), newTip.trim()] });
      setNewTip('');
    }
  };

  const removeTip = (index) => {
    setFormData({ ...formData, tips: formData.tips.filter((_, i) => i !== index) });
  };

  const toggleStage = (stage) => {
    const stages = formData.stages || [];
    if (stages.includes(stage)) {
      setFormData({ ...formData, stages: stages.filter(s => s !== stage) });
    } else {
      setFormData({ ...formData, stages: [...stages, stage] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || `custom-${Date.now()}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">
            {playbook ? 'Edit Playbook' : 'New Playbook'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Type</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(playbookTypes).map(([key, config]) => {
                const Icon = config.icon;
                const colors = colorClasses[config.color];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: key })}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      formData.type === key
                        ? `${colors.bg} ${colors.border} ${colors.text}`
                        : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
              placeholder="e.g., First Contact Email"
              required
            />
          </div>

          {/* Subject (email only) */}
          {formData.type === 'email' && (
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Subject Line</label>
              <input
                type="text"
                value={formData.subject || ''}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                placeholder="e.g., {{team_location}} Robotics - Introduction"
              />
            </div>
          )}

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">
              {formData.type === 'email' ? 'Email Body' : 'Content'}
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm"
              rows={10}
              placeholder="Enter your template content. Use {{variable_name}} for merge fields."
              required
            />
          </div>

          {/* Stages */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">When to Use</label>
            <div className="flex flex-wrap gap-2">
              {sponsorStages.map(stage => (
                <button
                  key={stage.value}
                  type="button"
                  onClick={() => toggleStage(stage.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    (formData.stages || []).includes(stage.value)
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Tips (optional)</label>
            <div className="space-y-2">
              {(formData.tips || []).map((tip, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-900/50 p-2 rounded">
                  <span className="flex-1 text-sm text-slate-300">{tip}</span>
                  <button
                    type="button"
                    onClick={() => removeTip(i)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
                  placeholder="Add a tip..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTip())}
                />
                <button
                  type="button"
                  onClick={addTip}
                  className="px-3 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-medium hover:shadow-lg"
            >
              Save Playbook
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Main Playbook Manager Component
export function PlaybookManager({ playbooks = [], onSave, onDelete, onNavigateToSpecs, hiddenDefaults = [], onHideDefault, onRestoreDefault, onPlayPhoneScript, sponsors = [] }) {
  const [filter, setFilter] = useState('all');
  const [editingPlaybook, setEditingPlaybook] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showVariablesGuide, setShowVariablesGuide] = useState(false);
  const [showSponsorSelector, setShowSponsorSelector] = useState(false);
  const [pendingPhoneScript, setPendingPhoneScript] = useState(null);
  const [sponsorSearch, setSponsorSearch] = useState('');

  // Combine default playbooks with custom ones, sorted by type
  // Filter out hidden defaults
  const typeOrder = ['email', 'phone', 'meeting', 'tip'];
  const visibleDefaults = defaultPlaybooks.filter(p => !hiddenDefaults.includes(p.id));
  const allPlaybooks = [
    ...visibleDefaults,
    ...playbooks.filter(p => !p.isDefault)
  ].sort((a, b) => {
    // First sort by type
    const typeA = typeOrder.indexOf(a.type);
    const typeB = typeOrder.indexOf(b.type);
    if (typeA !== typeB) return typeA - typeB;
    // Within same type, defaults come first
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return 0;
  });

  // Handle customizing a default (creates an editable copy)
  const handleCustomize = (playbook) => {
    const customized = {
      ...playbook,
      id: undefined, // Will get new ID on save
      title: `${playbook.title} (Custom)`,
      isDefault: false,
    };
    setEditingPlaybook(customized);
    setShowEditor(true);
  };

  const filteredPlaybooks = filter === 'all'
    ? allPlaybooks
    : allPlaybooks.filter(p => p.type === filter);

  const handleSave = (playbook) => {
    onSave(playbook);
    setShowEditor(false);
    setEditingPlaybook(null);
  };

  // Handle launching phone script player
  const handlePlayPhoneScript = (playbook) => {
    if (onPlayPhoneScript) {
      setPendingPhoneScript(playbook);
      setShowSponsorSelector(true);
      setSponsorSearch('');
    }
  };

  const handleSelectSponsorForScript = (sponsor) => {
    if (onPlayPhoneScript && pendingPhoneScript) {
      onPlayPhoneScript(pendingPhoneScript, sponsor);
    }
    setShowSponsorSelector(false);
    setPendingPhoneScript(null);
  };

  const filteredSponsorsForScript = sponsors.filter(s =>
    s.name.toLowerCase().includes(sponsorSearch.toLowerCase()) ||
    (s.contact_name && s.contact_name.toLowerCase().includes(sponsorSearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-orange-500" />
            Playbook
          </h2>
          <p className="text-slate-400 mt-1">Email templates, phone scripts, and guidance for sponsor outreach</p>
        </div>
        <button
          onClick={() => { setEditingPlaybook(null); setShowEditor(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          New Playbook
        </button>
      </div>

      {/* Merge Fields Helper */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-white mb-1">Personalize with Merge Fields</h4>
            <p className="text-sm text-slate-300 mb-2">
              Templates use <code className="px-1.5 py-0.5 bg-slate-800 rounded text-orange-400">{"{{variable_name}}"}</code> merge fields
              that auto-fill with your team and sponsor info when composing emails.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-400">{"{{team_name}}"}</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-400">{"{{contact_name}}"}</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-400">{"{{past_achievements}}"}</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-400">{"{{future_goals}}"}</span>
              <span className="text-slate-500">and more...</span>
            </div>
            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={() => setShowVariablesGuide(true)}
                className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                View All Variables
              </button>
              {onNavigateToSpecs && (
                <button
                  onClick={onNavigateToSpecs}
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  Set up in Team Specs
                  <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm transition-all ${
            filter === 'all' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {Object.entries(playbookTypes).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                filter === key ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label}s
            </button>
          );
        })}
      </div>

      {/* Playbook List */}
      <div className="space-y-3">
        {filteredPlaybooks.map(playbook => (
          <PlaybookCard
            key={playbook.id}
            playbook={playbook}
            onEdit={(p) => { setEditingPlaybook(p); setShowEditor(true); }}
            onDelete={onDelete}
            onCustomize={handleCustomize}
            onHide={onHideDefault}
            onPlayScript={playbook.type === 'phone' ? handlePlayPhoneScript : null}
          />
        ))}
      </div>

      {/* Hidden Templates Section */}
      {hiddenDefaults.length > 0 && onRestoreDefault && (
        <div className="mt-8 pt-6 border-t border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-3">
            Hidden Templates ({hiddenDefaults.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {hiddenDefaults.map(id => {
              const playbook = defaultPlaybooks.find(p => p.id === id);
              if (!playbook) return null;
              return (
                <button
                  key={id}
                  onClick={() => onRestoreDefault(id)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                >
                  <span>{playbook.title}</span>
                  <Plus className="w-3 h-3" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {showEditor && (
        <PlaybookEditor
          playbook={editingPlaybook}
          onSave={handleSave}
          onClose={() => { setShowEditor(false); setEditingPlaybook(null); }}
        />
      )}

      {/* Sponsor Selector for Phone Scripts */}
      {showSponsorSelector && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden border border-slate-700">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Select Sponsor to Call</h3>
                <p className="text-sm text-slate-400">Who are you calling?</p>
              </div>
              <button
                onClick={() => { setShowSponsorSelector(false); setPendingPhoneScript(null); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={sponsorSearch}
                onChange={(e) => setSponsorSearch(e.target.value)}
                placeholder="Search sponsors..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm mb-3"
                autoFocus
              />
              <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredSponsorsForScript.length === 0 ? (
                  <div className="text-center text-slate-500 py-4">No sponsors found</div>
                ) : (
                  filteredSponsorsForScript.slice(0, 20).map(sponsor => (
                    <button
                      key={sponsor.id}
                      onClick={() => handleSelectSponsorForScript(sponsor)}
                      className="w-full text-left p-3 bg-slate-900/50 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <div className="text-white font-medium">{sponsor.name}</div>
                      {sponsor.contact_name && (
                        <div className="text-sm text-slate-400">{sponsor.contact_name}</div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
            <div className="p-4 border-t border-slate-700">
              <button
                onClick={() => handleSelectSponsorForScript(null)}
                className="w-full px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 text-sm"
              >
                Continue without selecting a sponsor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variables Guide Modal */}
      {showVariablesGuide && (
        <VariablesGuide
          onClose={() => setShowVariablesGuide(false)}
          onNavigateToSpecs={onNavigateToSpecs}
        />
      )}
    </div>
  );
}

// Compact Playbook Suggestions for Sponsor Detail
export function PlaybookSuggestions({ sponsorStatus, onSelect }) {
  const relevantPlaybooks = defaultPlaybooks.filter(p =>
    p.stages && p.stages.some(stage => stage === sponsorStatus || stage === 'outreach')
  ).slice(0, 3);

  if (relevantPlaybooks.length === 0) return null;

  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-blue-300 mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Suggested Actions
      </h4>
      <div className="space-y-2">
        {relevantPlaybooks.map(playbook => {
          const typeConfig = playbookTypes[playbook.type];
          const Icon = typeConfig.icon;
          return (
            <button
              key={playbook.id}
              onClick={() => onSelect(playbook)}
              className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors text-left"
            >
              <Icon className={`w-5 h-5 text-${typeConfig.color}-500`} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{playbook.title}</p>
                <p className="text-slate-400 text-xs">{typeConfig.label}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 rotate-[-90deg]" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PlaybookManager;
