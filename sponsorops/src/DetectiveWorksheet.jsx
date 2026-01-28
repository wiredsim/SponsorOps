import React, { useState, useEffect } from 'react';
import {
  X, Search, Building2, Users, MapPin, Globe, Briefcase,
  Heart, UserCheck, Mail, Phone, Linkedin, CheckCircle2,
  ChevronRight, ChevronLeft, Flame, Snowflake, ThermometerSun,
  Lightbulb, Target, Award, Sparkles, ExternalLink, Trophy
} from 'lucide-react';

// Mission/step definitions
const missions = [
  {
    id: 'basics',
    title: 'The Basics',
    subtitle: 'Get to know the company',
    icon: Building2,
    description: 'First, let\'s gather some basic intel on this potential sponsor.',
  },
  {
    id: 'connections',
    title: 'The Connection Hunt',
    subtitle: 'Find the link between you',
    icon: Search,
    description: 'Now for the treasure hunt! Find connections between their company and your team.',
  },
  {
    id: 'contact',
    title: 'Contact Detective',
    subtitle: 'Find the right person',
    icon: UserCheck,
    description: 'Who should you reach out to? Let\'s find the best contact.',
  },
  {
    id: 'personalize',
    title: 'The Magic Sentence',
    subtitle: 'Craft your pitch',
    icon: Sparkles,
    description: 'Time to write the most important part of your email!',
  },
  {
    id: 'results',
    title: 'Mission Complete',
    subtitle: 'Your lead score',
    icon: Trophy,
    description: 'Great detective work! Here\'s your lead assessment.',
  },
];

// Industry options
const industries = [
  { value: 'manufacturing', label: 'Manufacturing / Engineering', icon: '🏭' },
  { value: 'technology', label: 'Technology / Software', icon: '💻' },
  { value: 'construction', label: 'Construction / Trades', icon: '🔨' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'finance', label: 'Finance / Insurance', icon: '💰' },
  { value: 'retail', label: 'Retail / Restaurant', icon: '🛍️' },
  { value: 'professional', label: 'Professional Services', icon: '💼' },
  { value: 'other', label: 'Other', icon: '📦' },
];

// Company size options
const companySizes = [
  { value: 'small', label: 'Small (under 50 people)', description: 'Local business, owner probably makes decisions' },
  { value: 'medium', label: 'Medium (50-500 people)', description: 'May have marketing or community relations person' },
  { value: 'large', label: 'Large (500+ people)', description: 'Likely has formal sponsorship process' },
];

// Contact title options
const contactTitles = [
  { value: 'community', label: 'Community Relations Manager', priority: 1 },
  { value: 'marketing', label: 'Marketing Director', priority: 2 },
  { value: 'hr', label: 'HR Director', priority: 3 },
  { value: 'owner', label: 'Owner / CEO / President', priority: 4 },
  { value: 'operations', label: 'Operations / Plant Manager', priority: 5 },
  { value: 'other', label: 'Other', priority: 6 },
];

export function DetectiveWorksheet({ sponsor, onClose, onSave }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [research, setResearch] = useState({
    // Basics
    website: sponsor?.website || '',
    whatTheyDo: '',
    companySize: '',
    location: '',
    legitCheck: null, // true/false

    // Connections
    industry: '',
    industryOther: '',
    techConnection: '',
    hasTechConnection: null,
    communityEvidence: [],
    communitySource: '',
    teamConnection: '',
    teamConnectionType: '', // parent, mentor, previous, none

    // Contact
    contactName: sponsor?.contactName || sponsor?.contact_name || '',
    contactTitle: '',
    contactTitleOther: '',
    contactEmail: sponsor?.email || '',
    contactPhone: sponsor?.phone || '',
    contactSource: '', // website, linkedin, guessed, called

    // Personalization
    personalizationSentence: '',

    // Meta
    timeSpent: 0,
    startTime: Date.now(),
  });

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setResearch(r => ({
        ...r,
        timeSpent: Math.floor((Date.now() - r.startTime) / 60000)
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate lead score
  const calculateScore = () => {
    let score = 0;
    const details = [];

    // Basics (max 20)
    if (research.website) { score += 5; details.push('Has website'); }
    if (research.whatTheyDo) { score += 5; details.push('Knows what they do'); }
    if (research.companySize) { score += 5; details.push('Knows company size'); }
    if (research.legitCheck === true) { score += 5; details.push('Verified legitimate'); }

    // Connections (max 40)
    if (research.industry) { score += 5; details.push('Identified industry'); }
    if (research.hasTechConnection) { score += 15; details.push('Found tech connection!'); }
    if (research.communityEvidence.length > 0) { score += 10; details.push('Found community involvement'); }
    if (research.teamConnection && research.teamConnectionType !== 'none') {
      score += 10;
      details.push('Has team connection!');
    }

    // Contact (max 20)
    if (research.contactName) { score += 10; details.push('Found contact name'); }
    if (research.contactEmail) { score += 5; details.push('Has email'); }
    if (research.contactTitle) { score += 5; details.push('Knows their title'); }

    // Personalization (max 20)
    if (research.personalizationSentence && research.personalizationSentence.length > 50) {
      score += 20;
      details.push('Great personalization!');
    } else if (research.personalizationSentence) {
      score += 10;
      details.push('Has personalization');
    }

    return { score, details };
  };

  const getLeadTemperature = () => {
    const { score } = calculateScore();
    if (score >= 70) return { temp: 'hot', label: 'HOT LEAD', color: 'text-red-500', bg: 'bg-red-500/20', icon: Flame, message: 'Excellent research! This is a great prospect.' };
    if (score >= 40) return { temp: 'warm', label: 'WARM LEAD', color: 'text-orange-500', bg: 'bg-orange-500/20', icon: ThermometerSun, message: 'Good prospect. You have enough to reach out.' };
    return { temp: 'cold', label: 'COLD LEAD', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: Snowflake, message: 'Consider finding more info or picking a different company.' };
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basics
        return research.whatTheyDo && research.legitCheck === true;
      case 1: // Connections
        return research.industry;
      case 2: // Contact
        return research.contactName || research.contactEmail;
      case 3: // Personalization
        return research.personalizationSentence && research.personalizationSentence.length > 20;
      default:
        return true;
    }
  };

  const handleSave = () => {
    const { score } = calculateScore();
    const temp = getLeadTemperature();

    onSave({
      ...research,
      leadScore: score,
      leadTemperature: temp.temp,
      completedAt: new Date().toISOString(),
    });
  };

  const renderBasics = () => (
    <div className="space-y-6">
      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-2">
          Company Website
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={research.website}
            onChange={(e) => setResearch({...research, website: e.target.value})}
            placeholder="www.company.com"
            className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
          />
          {research.website && (
            <a
              href={`https://${research.website.replace(/^https?:\/\//, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Visit
            </a>
          )}
        </div>
      </div>

      {/* What they do */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-2">
          What do they make or do? <span className="text-slate-500">(in plain English)</span>
        </label>
        <textarea
          value={research.whatTheyDo}
          onChange={(e) => setResearch({...research, whatTheyDo: e.target.value})}
          placeholder="e.g., They manufacture car parts for the automotive industry..."
          rows={2}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Company size */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-3">
          How big are they?
        </label>
        <div className="space-y-2">
          {companySizes.map(size => (
            <button
              key={size.value}
              onClick={() => setResearch({...research, companySize: size.value})}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                research.companySize === size.value
                  ? 'bg-orange-500/20 border-orange-500'
                  : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="font-medium text-white">{size.label}</div>
              <div className="text-sm text-slate-400">{size.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-2">
          Where are they located?
        </label>
        <input
          type="text"
          value={research.location}
          onChange={(e) => setResearch({...research, location: e.target.value})}
          placeholder="e.g., Downtown Holland, Michigan"
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Legit check */}
      <div className="bg-slate-900/50 p-4 rounded-lg">
        <label className="block text-sm font-medium text-blue-300 mb-3">
          First impression check:
        </label>
        <div className="flex gap-3">
          <button
            onClick={() => setResearch({...research, legitCheck: true})}
            className={`flex-1 p-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${
              research.legitCheck === true
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <CheckCircle2 className="w-5 h-5" />
            Looks legit - Continue!
          </button>
          <button
            onClick={() => setResearch({...research, legitCheck: false})}
            className={`flex-1 p-4 rounded-lg border flex items-center justify-center gap-2 transition-all ${
              research.legitCheck === false
                ? 'bg-red-500/20 border-red-500 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
            Sketchy - Skip this one
          </button>
        </div>
      </div>

      {research.legitCheck === false && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-300">
          No worries! Not every company is a good fit. Close this and try a different prospect.
        </div>
      )}
    </div>
  );

  const renderConnections = () => (
    <div className="space-y-6">
      {/* Industry */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-3">
          What industry are they in?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {industries.map(ind => (
            <button
              key={ind.value}
              onClick={() => setResearch({...research, industry: ind.value})}
              className={`text-left p-3 rounded-lg border transition-all ${
                research.industry === ind.value
                  ? 'bg-orange-500/20 border-orange-500'
                  : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="mr-2">{ind.icon}</span>
              <span className="text-white text-sm">{ind.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tech connection */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="w-6 h-6 text-purple-400 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-purple-300">Tech Connection Hunt!</h4>
            <p className="text-sm text-slate-400">Do they use any technology or skills your team is learning?</p>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setResearch({...research, hasTechConnection: true})}
            className={`flex-1 p-3 rounded-lg border transition-all ${
              research.hasTechConnection === true
                ? 'bg-green-500/20 border-green-500 text-green-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            Yes! Found one
          </button>
          <button
            onClick={() => setResearch({...research, hasTechConnection: false})}
            className={`flex-1 p-3 rounded-lg border transition-all ${
              research.hasTechConnection === false
                ? 'bg-slate-600/50 border-slate-500 text-slate-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            Not really
          </button>
        </div>

        {research.hasTechConnection === true && (
          <textarea
            value={research.techConnection}
            onChange={(e) => setResearch({...research, techConnection: e.target.value})}
            placeholder="What's the connection? e.g., They use CNC machines and we're learning CAD/CAM..."
            rows={2}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
        )}
      </div>

      {/* Community evidence */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-3">
          Evidence they care about community/education: <span className="text-slate-500">(check all that apply)</span>
        </label>
        <div className="space-y-2">
          {[
            { id: 'stem', label: 'They mention "STEM education" on their website' },
            { id: 'scholarship', label: 'They have a scholarship or education program' },
            { id: 'sponsor', label: 'They sponsor other community programs/teams' },
            { id: 'giving', label: 'They have a "Community" or "Giving Back" page' },
            { id: 'local', label: 'They\'re a local business invested in our area' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                const current = research.communityEvidence || [];
                const updated = current.includes(item.id)
                  ? current.filter(i => i !== item.id)
                  : [...current, item.id];
                setResearch({...research, communityEvidence: updated});
              }}
              className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 transition-all ${
                research.communityEvidence?.includes(item.id)
                  ? 'bg-green-500/20 border-green-500 text-green-300'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                research.communityEvidence?.includes(item.id)
                  ? 'bg-green-500 border-green-500'
                  : 'border-slate-500'
              }`}>
                {research.communityEvidence?.includes(item.id) && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
              {item.label}
            </button>
          ))}
        </div>

        {research.communityEvidence?.length > 0 && (
          <input
            type="text"
            value={research.communitySource}
            onChange={(e) => setResearch({...research, communitySource: e.target.value})}
            placeholder="Where did you find this? (e.g., 'About Us page')"
            className="w-full mt-3 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
          />
        )}
      </div>

      {/* Team connection */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-3">
          Do we have any inside connection?
        </label>
        <div className="space-y-2">
          {[
            { value: 'parent', label: 'Yes - someone\'s parent works there' },
            { value: 'mentor', label: 'Yes - a mentor knows someone' },
            { value: 'previous', label: 'Yes - they sponsored us before' },
            { value: 'none', label: 'No connection (that\'s fine!)' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setResearch({...research, teamConnectionType: opt.value})}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                research.teamConnectionType === opt.value
                  ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {research.teamConnectionType && research.teamConnectionType !== 'none' && (
          <input
            type="text"
            value={research.teamConnection}
            onChange={(e) => setResearch({...research, teamConnection: e.target.value})}
            placeholder="Who's the connection? (e.g., 'Jake's dad is the plant manager')"
            className="w-full mt-3 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
          />
        )}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-300 mb-2">Who should you contact?</h4>
        <p className="text-sm text-slate-400">
          Look for these titles (in order of preference): Community Relations Manager, Marketing Director,
          HR Director, or for small companies: Owner/CEO/President.
        </p>
      </div>

      {/* Contact name */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-2">
          Contact Person Name
        </label>
        <input
          type="text"
          value={research.contactName}
          onChange={(e) => setResearch({...research, contactName: e.target.value})}
          placeholder="e.g., Sarah Johnson"
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Contact title */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-3">
          Their Title
        </label>
        <div className="grid grid-cols-2 gap-2">
          {contactTitles.map(title => (
            <button
              key={title.value}
              onClick={() => setResearch({...research, contactTitle: title.value})}
              className={`text-left p-3 rounded-lg border transition-all ${
                research.contactTitle === title.value
                  ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {title.label}
            </button>
          ))}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={research.contactEmail}
          onChange={(e) => setResearch({...research, contactEmail: e.target.value})}
          placeholder="sarah@company.com (or your best guess)"
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        />
        <p className="text-xs text-slate-500 mt-1">
          Tip: If not listed, try firstname@company.com or flastname@company.com
        </p>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-2">
          Phone <span className="text-slate-500">(optional)</span>
        </label>
        <input
          type="tel"
          value={research.contactPhone}
          onChange={(e) => setResearch({...research, contactPhone: e.target.value})}
          placeholder="(555) 123-4567"
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Where found */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-3">
          Where did you find this contact?
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'website', label: 'Company website' },
            { value: 'linkedin', label: 'LinkedIn' },
            { value: 'guessed', label: 'Guessed email format' },
            { value: 'called', label: 'Called and asked' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setResearch({...research, contactSource: opt.value})}
              className={`px-4 py-2 rounded-lg border transition-all ${
                research.contactSource === opt.value
                  ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPersonalization = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-orange-400 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-orange-300">This is THE MOST IMPORTANT PART!</h4>
            <p className="text-sm text-slate-400 mt-1">
              Based on everything you found, write why you're reaching out to THIS company specifically.
            </p>
          </div>
        </div>
      </div>

      {/* Summary of what they found */}
      <div className="bg-slate-900/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Your research so far:</h4>
        <ul className="space-y-2 text-sm">
          {research.whatTheyDo && (
            <li className="flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span><strong>They do:</strong> {research.whatTheyDo}</span>
            </li>
          )}
          {research.hasTechConnection && research.techConnection && (
            <li className="flex items-start gap-2 text-green-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span><strong>Tech connection:</strong> {research.techConnection}</span>
            </li>
          )}
          {research.communityEvidence?.length > 0 && (
            <li className="flex items-start gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span><strong>Community involvement:</strong> Found {research.communityEvidence.length} evidence(s)</span>
            </li>
          )}
          {research.teamConnectionType && research.teamConnectionType !== 'none' && (
            <li className="flex items-start gap-2 text-green-300">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span><strong>Team connection:</strong> {research.teamConnection}</span>
            </li>
          )}
        </ul>
      </div>

      {/* The sentence */}
      <div>
        <label className="block text-sm font-medium text-blue-300 mb-2">
          Complete this sentence:
        </label>
        <div className="text-white mb-3 font-medium">
          "We're reaching out to {sponsor?.name || '[Company]'} because..."
        </div>
        <textarea
          value={research.personalizationSentence}
          onChange={(e) => setResearch({...research, personalizationSentence: e.target.value})}
          placeholder="...you specialize in precision manufacturing and we're developing our own CNC capabilities this season"
          rows={4}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Checklist */}
      <div className="bg-slate-900/50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Does your sentence include:</h4>
        <ul className="space-y-2 text-sm">
          <li className={`flex items-center gap-2 ${research.personalizationSentence?.length > 20 ? 'text-green-300' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-4 h-4" />
            Something specific about THEM
          </li>
          <li className={`flex items-center gap-2 ${research.personalizationSentence?.length > 40 ? 'text-green-300' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-4 h-4" />
            Something specific about YOUR TEAM
          </li>
          <li className={`flex items-center gap-2 ${research.personalizationSentence?.length > 60 ? 'text-green-300' : 'text-slate-500'}`}>
            <CheckCircle2 className="w-4 h-4" />
            A natural connection between the two
          </li>
        </ul>
      </div>

      {/* Examples */}
      <div>
        <h4 className="text-sm font-medium text-green-400 mb-2">Good examples:</h4>
        <div className="space-y-2 text-sm text-green-300">
          <p className="bg-green-500/10 p-2 rounded">"...you specialize in precision manufacturing and we're developing our own CNC capabilities"</p>
          <p className="bg-green-500/10 p-2 rounded">"...your scholarship program shows you're invested in developing future engineers"</p>
        </div>

        <h4 className="text-sm font-medium text-red-400 mt-4 mb-2">Avoid (too generic):</h4>
        <div className="space-y-2 text-sm text-red-300">
          <p className="bg-red-500/10 p-2 rounded">"...your company seems successful"</p>
          <p className="bg-red-500/10 p-2 rounded">"...we need sponsors"</p>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    const { score, details } = calculateScore();
    const temp = getLeadTemperature();
    const TempIcon = temp.icon;

    return (
      <div className="space-y-6">
        {/* Score display */}
        <div className={`text-center p-8 rounded-xl ${temp.bg}`}>
          <TempIcon className={`w-16 h-16 mx-auto mb-4 ${temp.color}`} />
          <div className={`text-3xl font-bold ${temp.color}`}>{temp.label}</div>
          <div className="text-5xl font-bold text-white my-4">{score}/100</div>
          <p className="text-slate-300">{temp.message}</p>
        </div>

        {/* What you found */}
        <div className="bg-slate-900/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-300 mb-3">Research completed:</h4>
          <ul className="space-y-2">
            {details.map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-green-300 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Time spent */}
        <div className="text-center text-slate-400">
          Time spent: {research.timeSpent || '< 1'} minute(s)
          {research.timeSpent < 15 && (
            <p className="text-amber-400 text-sm mt-1">
              Tip: Spending 20-30 minutes usually yields better results!
            </p>
          )}
        </div>

        {/* Personalization preview */}
        {research.personalizationSentence && (
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-orange-300 mb-2">Your personalization:</h4>
            <p className="text-white italic">
              "We're reaching out to {sponsor?.name} because {research.personalizationSentence}"
            </p>
          </div>
        )}
      </div>
    );
  };

  const currentMission = missions[currentStep];
  const MissionIcon = currentMission.icon;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Sponsor Detective</h3>
                <p className="text-sm text-slate-400">Researching: {sponsor?.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1">
            {missions.map((m, i) => (
              <div
                key={m.id}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i < currentStep ? 'bg-green-500' :
                  i === currentStep ? 'bg-orange-500' :
                  'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mission header */}
        <div className="px-6 py-4 bg-slate-900/50 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${currentStep === missions.length - 1 ? 'bg-green-500/20' : 'bg-orange-500/20'}`}>
              <MissionIcon className={`w-5 h-5 ${currentStep === missions.length - 1 ? 'text-green-400' : 'text-orange-400'}`} />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Mission {currentStep + 1} of {missions.length}
              </div>
              <h4 className="font-bold text-white">{currentMission.title}</h4>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-2">{currentMission.description}</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === 0 && renderBasics()}
          {currentStep === 1 && renderConnections()}
          {currentStep === 2 && renderContact()}
          {currentStep === 3 && renderPersonalization()}
          {currentStep === 4 && renderResults()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < missions.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:hover:shadow-none"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-green-500/30 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Save Research
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetectiveWorksheet;
