import React, { useState } from 'react';
import {
  Phone, X, ChevronRight, ChevronLeft, MessageSquare, ThumbsUp,
  ThumbsDown, Clock, HelpCircle, CheckCircle2, AlertCircle, Send,
  User, Building2, Lightbulb, Volume2
} from 'lucide-react';

// Common objections and suggested responses
const objectionHandlers = [
  {
    id: 'no-budget',
    trigger: "We don't have budget",
    response: `I completely understand - many sponsors tell us the same thing initially. A few thoughts:

• Sponsorships can be smaller than you might think - even $250-500 makes a real difference
• In-kind donations (materials, services, space) are just as valuable
• Some companies allocate from marketing, community relations, or STEM education budgets separately

Would it help if I sent over our sponsorship tiers so you can see what different levels look like?`,
    followUp: "Ask about in-kind opportunities or smaller amounts"
  },
  {
    id: 'already-sponsor',
    trigger: "We already sponsor other teams",
    response: `That's great to hear - you clearly value STEM education! A few teams that sponsor multiple groups tell us:

• Different teams offer different visibility (events, regions, audiences)
• Our team focuses on [unique aspect] which might complement your other sponsorships
• Even smaller support helps us and keeps you connected to our community

Would you be open to learning what makes our team unique? No pressure - I'd just love to share our story.`,
    followUp: "Highlight what makes your team different"
  },
  {
    id: 'send-email',
    trigger: "Just send me an email",
    response: `Absolutely, I'll send that right over. Just so I include the right information:

• Is there a particular aspect you'd like me to focus on - our impact, sponsorship levels, or how we'd recognize your support?
• What's the best email to send it to?
• And is there a good time to follow up after you've had a chance to review it?

I'll keep it brief and to the point.`,
    followUp: "Get specific email and follow-up timeline"
  },
  {
    id: 'not-interested',
    trigger: "We're not interested",
    response: `I appreciate you being direct with me. Before I let you go:

• Would it be okay if I reached out again next season in case things change?
• Is there someone else at the company who handles community sponsorships I should speak with?
• Or if sponsorship isn't a fit, would you be open to other ways to support - like mentorship or facility tours?

Either way, thank you for taking my call.`,
    followUp: "Leave the door open gracefully"
  },
  {
    id: 'need-approval',
    trigger: "I need to check with someone else",
    response: `Of course - these decisions usually involve multiple people. To help you make the case:

• I can send a one-pager that summarizes who we are and sponsorship benefits
• Would it help if I joined a brief call with you and the decision-maker?
• What questions do you think they'll have that I can help you answer?

What's a good timeline for that conversation? I can follow up after.`,
    followUp: "Offer to help them sell internally"
  },
  {
    id: 'bad-timing',
    trigger: "It's not a good time",
    response: `I totally get it - timing is everything. A couple quick questions:

• When would be a better time to reconnect? I'll make a note to call back then.
• Is there a particular time of year when you review sponsorship requests?
• Would it help if I sent some info now so you have it when the timing is right?

I don't want to bother you, but I also don't want you to miss out on being part of something great.`,
    followUp: "Get specific callback timing"
  }
];

// Response options after delivering the pitch
const responseOptions = [
  {
    id: 'interested',
    label: "They're interested!",
    icon: ThumbsUp,
    color: 'green',
    nextStep: `Great! Here's what to do next:

• Thank them enthusiastically but stay professional
• Ask: "What would be the best next step - should I send over our sponsorship packet?"
• Offer to schedule a follow-up call or meeting
• Get their preferred contact method and timeline
• Confirm: "I'll send that over today and follow up [when they suggested]"

Before hanging up, confirm their email and any specific interests they mentioned.`
  },
  {
    id: 'questions',
    label: "They have questions",
    icon: HelpCircle,
    color: 'blue',
    nextStep: `They're engaged - that's good! Common questions and how to handle:

**"How much does sponsorship cost?"**
→ "We have levels starting at $250 up to $5,000+, and we're flexible. What range works for your budget?"

**"What do we get in return?"**
→ "Logo on our robot and team shirts, social media recognition, invites to competitions, and the chance to inspire future engineers."

**"How will our money be used?"**
→ "Registration fees, robot parts, tools, travel to competitions, and team equipment. Every dollar goes directly to the students."

**"Can we visit or see the robot?"**
→ "Absolutely! We'd love to host you at our workshop. When works for you?"

Answer their questions, then ask: "Does that help? What else can I tell you?"`
  },
  {
    id: 'objection',
    label: "They have concerns",
    icon: AlertCircle,
    color: 'orange',
    nextStep: "SELECT_OBJECTION"
  },
  {
    id: 'busy',
    label: "They're busy right now",
    icon: Clock,
    color: 'slate',
    nextStep: `No problem - respect their time:

• "I completely understand. When would be a better time to call back?"
• "Could I send you a quick email instead? What's the best address?"
• "I'll be brief - do you have just 30 seconds for me to tell you why I'm calling?"

If they give a callback time, confirm it: "Perfect, I'll call you [day/time]. Thanks!"

Note: Don't push too hard. A polite callback is better than an annoyed hang-up.`
  },
  {
    id: 'no',
    label: "They said no",
    icon: ThumbsDown,
    color: 'red',
    nextStep: `That's okay - not every call converts. Handle gracefully:

• "I understand. Thank you for taking my call."
• "Would it be okay if I reached out again next year?"
• "Is there anyone else at the company I should speak with?"

Stay positive and professional. Sometimes "no" today becomes "yes" next season.

End with: "Thanks again for your time. Have a great day!"`
  }
];

export function PhoneScriptPlayer({ playbook, sponsor, teamInfo, currentTeam, onClose, onLogInteraction }) {
  const [step, setStep] = useState('intro'); // intro, script, response, objection, notes
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [selectedObjection, setSelectedObjection] = useState(null);
  const [callNotes, setCallNotes] = useState('');
  const [callOutcome, setCallOutcome] = useState('');

  // Fill in merge fields
  const fillMergeFields = (text) => {
    if (!text) return '';

    const replacements = {
      '{{company_name}}': sponsor?.name || '[Company Name]',
      '{{contact_name}}': sponsor?.contact_name || '[Contact Name]',
      '{{contact_title}}': sponsor?.contact_title || '',
      '{{team_name}}': teamInfo?.team_name || currentTeam?.name || '[Team Name]',
      '{{team_number}}': teamInfo?.team_number || currentTeam?.team_number || '[Team #]',
      '{{sender_name}}': '[Your Name]',
      '{{season_year}}': teamInfo?.season_year || new Date().getFullYear().toString(),
    };

    let result = text;
    for (const [key, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    return result;
  };

  const handleLogCall = () => {
    if (onLogInteraction) {
      onLogInteraction({
        type: 'call',
        notes: `Phone call - ${callOutcome}\n\n${callNotes}`,
        outcome: callOutcome
      });
    }
    onClose();
  };

  const scriptContent = fillMergeFields(playbook?.content || '');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-gradient-to-r from-green-600 to-green-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Phone Script Player</h3>
              <p className="text-green-100 text-sm">
                Calling {sponsor?.name || 'Sponsor'}
                {sponsor?.contact_name && ` - ${sponsor.contact_name}`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Intro Step */}
          {step === 'intro' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Ready to make the call?</h4>
                <p className="text-slate-400">
                  Review the script, then click "Start Call" when you're on the phone.
                </p>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Company</span>
                  </div>
                  <p className="text-white">{sponsor?.name || 'Unknown'}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-400 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Contact</span>
                  </div>
                  <p className="text-white">{sponsor?.contact_name || 'Unknown'}</p>
                  {sponsor?.contact_title && (
                    <p className="text-sm text-slate-400">{sponsor.contact_title}</p>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-400 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-medium">Before you dial</span>
                </div>
                <ul className="text-sm text-amber-200 space-y-1">
                  <li>• Have the script visible but don't read it word-for-word</li>
                  <li>• Smile while you talk - it comes through in your voice</li>
                  <li>• Stand up if you can - it gives you energy</li>
                  <li>• Have a pen ready to take notes</li>
                </ul>
              </div>

              <button
                onClick={() => setStep('script')}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
                Start Call - Show Script
              </button>
            </div>
          )}

          {/* Script Step */}
          {step === 'script' && (
            <div className="space-y-6">
              <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
                <div className="flex items-center gap-2 text-green-400 mb-3">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">Your Script</span>
                </div>
                <div className="text-white whitespace-pre-wrap leading-relaxed text-lg">
                  {scriptContent}
                </div>
              </div>

              <div className="text-center text-slate-400">
                <p>How did they respond?</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {responseOptions.map((option) => {
                  const Icon = option.icon;
                  const colorClasses = {
                    green: 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 text-green-400',
                    blue: 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400',
                    orange: 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20 text-orange-400',
                    slate: 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-slate-300',
                    red: 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-400',
                  };
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedResponse(option);
                        setCallOutcome(option.label);
                        if (option.nextStep === 'SELECT_OBJECTION') {
                          setStep('objection');
                        } else {
                          setStep('response');
                        }
                      }}
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${colorClasses[option.color]}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Objection Selection */}
          {step === 'objection' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('script')}
                className="flex items-center gap-2 text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to responses
              </button>

              <h4 className="text-lg font-bold text-white">What objection did they raise?</h4>

              <div className="space-y-2">
                {objectionHandlers.map((objection) => (
                  <button
                    key={objection.id}
                    onClick={() => {
                      setSelectedObjection(objection);
                      setCallOutcome(`Objection: ${objection.trigger}`);
                      setStep('response');
                    }}
                    className="w-full text-left p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:bg-slate-900 hover:border-orange-500/50 transition-colors"
                  >
                    <span className="text-white font-medium">"{objection.trigger}"</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Response/Guidance Step */}
          {step === 'response' && (
            <div className="space-y-6">
              <button
                onClick={() => {
                  setStep(selectedObjection ? 'objection' : 'script');
                  setSelectedObjection(null);
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              {/* Show objection handler or response guidance */}
              {selectedObjection ? (
                <div className="space-y-4">
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                    <div className="text-orange-400 font-medium mb-2">
                      They said: "{selectedObjection.trigger}"
                    </div>
                  </div>

                  <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
                    <div className="flex items-center gap-2 text-green-400 mb-3">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">Suggested Response</span>
                    </div>
                    <div className="text-white whitespace-pre-wrap leading-relaxed">
                      {selectedObjection.response}
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Lightbulb className="w-4 h-4" />
                      <span className="font-medium">Next Move</span>
                    </div>
                    <p className="text-blue-200">{selectedObjection.followUp}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 rounded-lg p-5 border border-slate-700">
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium">{selectedResponse?.label}</span>
                  </div>
                  <div className="text-white whitespace-pre-wrap leading-relaxed">
                    {selectedResponse?.nextStep}
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep('notes')}
                className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
                Finish Call & Log Notes
              </button>
            </div>
          )}

          {/* Notes Step */}
          {step === 'notes' && (
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-white">Log this call</h4>

              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="text-sm text-slate-400 mb-1">Outcome</div>
                <div className="text-white font-medium">{callOutcome}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Call Notes
                </label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="What was discussed? Any follow-up needed? Key details to remember..."
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleLogCall}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                  Log Interaction
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Skip
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhoneScriptPlayer;
