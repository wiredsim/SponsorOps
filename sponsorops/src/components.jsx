import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Edit2, Trash2, ExternalLink, MessageSquare, Plus, Upload, Image, Mail, Search, Flame, ThermometerSun, Snowflake, CheckCircle2, Users, DollarSign } from 'lucide-react';
import ContactsEditor from './ContactsEditor';
import DonationsEditor from './DonationsEditor';
import { DetectiveWorksheet } from './DetectiveWorksheet';

// Helper: Get local date string (YYYY-MM-DD) without timezone issues
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper: Get date X days from now in local time
const getLocalDatePlusDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return getLocalDateString(date);
};

// Helper: Check if a date string is before today (overdue)
export const isDateOverdue = (dateString) => {
  if (!dateString) return false;
  const today = getLocalDateString();
  return dateString < today;
};

// Helper: Parse date string and display in local format
export const formatLocalDate = (dateString) => {
  if (!dateString) return '';
  // Add time component to avoid timezone shift
  const date = new Date(dateString + 'T12:00:00');
  return date.toLocaleDateString();
};

// Sponsor Modal Component
export function SponsorModal({ sponsor, onClose, onSave, statusOptions }) {
  const [formData, setFormData] = useState(sponsor || {
    name: '',
    status: 'research',
    type: 'new-prospect',
    contactName: '',
    contactTitle: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">
            {sponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-blue-300 mb-2">Company Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              >
                <option value="new-prospect">New Prospect</option>
                <option value="previous-sponsor">Previous Sponsor</option>
                <option value="parent-connection">Parent Connection</option>
                <option value="mentor-connection">Mentor Connection</option>
                <option value="local-business">Local Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Contact Name</label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Contact Title</label>
              <input
                type="text"
                value={formData.contactTitle}
                onChange={(e) => setFormData({...formData, contactTitle: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Website</label>
              <input
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-blue-300 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              {sponsor ? 'Update' : 'Create'} Sponsor
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Lead temperature display helper
export const LeadTemperatureDisplay = ({ temperature, score }) => {
  if (!temperature) return null;

  const config = {
    hot: { icon: Flame, color: 'text-red-500', bg: 'bg-red-500/20', label: 'HOT' },
    warm: { icon: ThermometerSun, color: 'text-orange-500', bg: 'bg-orange-500/20', label: 'WARM' },
    cold: { icon: Snowflake, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'COLD' },
  };

  const { icon: Icon, color, bg, label } = config[temperature] || config.cold;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
      <Icon className="w-3 h-3" />
      {label} {score && `(${score})`}
    </div>
  );
};

// Sponsor Detail Modal
export function SponsorDetailModal({ sponsor, interactions, tasks, onClose, onEdit, onDelete, onAddInteraction, onComposeEmail, onSaveResearch, statusOptions }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">{sponsor.name}</h3>
                <LeadTemperatureDisplay temperature={sponsor.lead_temperature} score={sponsor.lead_score} />
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm text-white ${
                statusOptions.find(s => s.value === sponsor.status)?.color || 'bg-gray-500'
              }`}>
                {statusOptions.find(s => s.value === sponsor.status)?.label || sponsor.status}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onComposeEmail} className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600" title="Compose email">
                <Mail className="w-5 h-5" />
              </button>
              <button onClick={onEdit} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" title="Edit sponsor">
                <Edit2 className="w-5 h-5" />
              </button>
              <button onClick={onDelete} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600" title="Archive sponsor">
                <Trash2 className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {['overview', 'research', 'contacts', 'donations', 'interactions', 'tasks'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white'
                    : 'text-blue-300 hover:bg-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Contact Person</h4>
                  <p className="text-white">{sponsor.contact_name || 'Not set'}</p>
                  <p className="text-sm text-slate-400">{sponsor.contact_title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Industry</h4>
                  <p className="text-white">{sponsor.industry || 'Not set'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Email</h4>
                  <a href={`mailto:${sponsor.email}`} className="text-orange-400 hover:underline">
                    {sponsor.email || 'Not set'}
                  </a>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Phone</h4>
                  <a href={`tel:${sponsor.phone}`} className="text-orange-400 hover:underline">
                    {sponsor.phone || 'Not set'}
                  </a>
                </div>
                {sponsor.website && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-blue-300 mb-2">Website</h4>
                    <a
                      href={`https://${sponsor.website.replace(/^https?:\/\//, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:underline flex items-center gap-1"
                    >
                      {sponsor.website}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              {sponsor.notes && (
                <div>
                  <h4 className="text-sm font-medium text-blue-300 mb-2">Notes</h4>
                  <p className="text-white bg-slate-900/50 p-4 rounded-lg">{sponsor.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'research' && (
            <div className="space-y-4">
              {/* Show existing research summary if available */}
              {sponsor.research_data && !sponsor._showResearchForm && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-300">
                      <Search className="w-5 h-5" />
                      <h4 className="font-medium">Research Profile</h4>
                    </div>
                    <button
                      onClick={() => {
                        // Toggle to show form for updating research
                        sponsor._showResearchForm = true;
                        setActiveTab('overview');
                        setTimeout(() => setActiveTab('research'), 0);
                      }}
                      className="text-sm text-orange-400 hover:text-orange-300"
                    >
                      Update Research
                    </button>
                  </div>

                  {sponsor.research_data.whatTheyDo && (
                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-blue-300 mb-1">What They Do</h5>
                      <p className="text-white">{sponsor.research_data.whatTheyDo}</p>
                    </div>
                  )}

                  {sponsor.research_data.personalizationSentence && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-orange-300 mb-1">Why We're Reaching Out</h5>
                      <p className="text-white italic">
                        "We're reaching out to {sponsor.name} because {sponsor.research_data.personalizationSentence}"
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {sponsor.research_data.companySize && (
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <h5 className="text-xs font-medium text-blue-300 mb-1">Company Size</h5>
                        <p className="text-white text-sm capitalize">{sponsor.research_data.companySize}</p>
                      </div>
                    )}
                    {sponsor.research_data.location && (
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <h5 className="text-xs font-medium text-blue-300 mb-1">Location</h5>
                        <p className="text-white text-sm">{sponsor.research_data.location}</p>
                      </div>
                    )}
                    {sponsor.research_data.industry && (
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <h5 className="text-xs font-medium text-blue-300 mb-1">Industry</h5>
                        <p className="text-white text-sm capitalize">{sponsor.research_data.industry}</p>
                      </div>
                    )}
                    {sponsor.research_data.teamConnectionType && sponsor.research_data.teamConnectionType !== 'none' && (
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <h5 className="text-xs font-medium text-blue-300 mb-1">Team Connection</h5>
                        <p className="text-white text-sm">{sponsor.research_data.teamConnection}</p>
                      </div>
                    )}
                  </div>

                  {sponsor.research_data.techConnection && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                      <h5 className="text-sm font-medium text-purple-300 mb-1">Tech Connection</h5>
                      <p className="text-white text-sm">{sponsor.research_data.techConnection}</p>
                    </div>
                  )}

                  <LeadTemperatureDisplay temperature={sponsor.lead_temperature} score={sponsor.lead_score} />
                </div>
              )}

              {/* Show detective worksheet form if no research or updating */}
              {(!sponsor.research_data || sponsor._showResearchForm) && (
                <DetectiveWorksheet
                  sponsor={sponsor}
                  embedded={true}
                  onClose={() => {}}
                  onSave={(researchData) => {
                    sponsor._showResearchForm = false;
                    if (onSaveResearch) onSaveResearch(researchData);
                  }}
                />
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-300 mb-4">
                <Users className="w-5 h-5" />
                <h4 className="font-medium">Contacts at {sponsor.name}</h4>
              </div>
              <ContactsEditor
                sponsorId={sponsor.id}
                teamId={sponsor.team_id}
              />
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-300 mb-4">
                <DollarSign className="w-5 h-5" />
                <h4 className="font-medium">Donations from {sponsor.name}</h4>
              </div>
              <DonationsEditor
                sponsorId={sponsor.id}
                teamId={sponsor.team_id}
              />
            </div>
          )}

          {activeTab === 'interactions' && (
            <div className="space-y-4">
              <button
                onClick={onAddInteraction}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                <Plus className="w-4 h-4" />
                Log Interaction
              </button>

              {interactions.length === 0 ? (
                <div className="text-center text-slate-400 py-8">No interactions logged yet</div>
              ) : (
                <div className="space-y-3">
                  {interactions.sort((a, b) => new Date(b.date) - new Date(a.date)).map(interaction => (
                    <div key={interaction.id} className="bg-slate-900/50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-orange-500" />
                          <span className="text-white font-medium capitalize">{interaction.type}</span>
                        </div>
                        <span className="text-sm text-slate-400">
                          {new Date(interaction.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-300">{interaction.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center text-slate-400 py-8">No tasks for this sponsor</div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="bg-slate-900/50 p-4 rounded-lg flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      className="mt-1 w-5 h-5 rounded border-slate-600 text-orange-500"
                      readOnly
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{task.description}</div>
                      <div className="text-sm text-slate-400 mt-1">
                        Due: {formatLocalDate(task.due_date)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Task category options
const taskCategories = [
  { value: 'general', label: 'General' },
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Phone Call' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'research', label: 'Research' },
  { value: 'visit', label: 'Site Visit' }
];

// Task status options
const taskStatuses = [
  { value: 'todo', label: 'To Do', color: 'bg-slate-500' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { value: 'blocked', label: 'Blocked', color: 'bg-red-500' },
  { value: 'completed', label: 'Completed', color: 'bg-green-500' }
];

// Task Modal
export function TaskModal({ sponsors, teamMembers = [], onClose, onSave, task = null, currentUserId }) {
  const isEditing = !!task;
  const [showAdvanced, setShowAdvanced] = useState(isEditing);
  const [formData, setFormData] = useState(task ? {
    id: task.id,
    sponsorId: task.sponsor_id || '',
    description: task.description || '',
    notes: task.notes || '',
    dueDate: task.due_date || getLocalDatePlusDays(7),
    priority: task.priority || 'medium',
    status: task.status || 'todo',
    category: task.category || 'general',
    assignedTo: task.assigned_to || '',
    completed: task.completed || false
  } : {
    sponsorId: '',
    description: '',
    notes: '',
    dueDate: getLocalDatePlusDays(7),
    priority: 'medium',
    status: 'todo',
    category: 'general',
    assignedTo: currentUserId || '',
    completed: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">{isEditing ? 'Edit Task' : 'Add Task'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">What needs to be done? *</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              placeholder="e.g., Follow up on email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">For which sponsor? (optional)</label>
            <select
              value={formData.sponsorId}
              onChange={(e) => setFormData({...formData, sponsorId: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="">No sponsor</option>
              {sponsors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">When is it due?</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={2}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              placeholder="Any extra details or context..."
            />
          </div>

          {/* Show more options toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            {showAdvanced ? '- Hide options' : '+ Show more options'}
          </button>

          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-slate-700/50">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Assigned To</label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.display_name || member.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    {taskCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-300 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                >
                  {taskStatuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              {isEditing ? 'Update Task' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Export task options for use in other components
export { taskCategories, taskStatuses };

// Interaction Modal
export function InteractionModal({ sponsor, onClose, onSave }) {
  const [formData, setFormData] = useState({
    sponsorId: sponsor.id,
    type: 'email',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Log Interaction</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Sponsor</label>
            <input
              type="text"
              value={sponsor.name}
              disabled
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            >
              <option value="email">Email</option>
              <option value="call">Phone Call</option>
              <option value="meeting">Meeting</option>
              <option value="visit">Site Visit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Notes *</label>
            <textarea
              required
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              placeholder="What was discussed? What are the next steps?"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Log Interaction
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Logo Upload Component
export function LogoUpload({ currentLogo, onUpload, disabled }) {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentLogo);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onUpload(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        {preview ? (
          <img
            src={preview}
            alt="Logo preview"
            className="w-20 h-20 rounded-lg object-cover border border-slate-600"
          />
        ) : (
          <div className="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
            <Image className="w-8 h-8 text-slate-500" />
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
          >
            <Upload className="w-4 h-4" />
            {currentLogo ? 'Change Logo' : 'Upload Logo'}
          </button>
          <p className="text-xs text-slate-500 mt-1">JPEG, PNG, or WebP. Max 2MB.</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

// Month names for annual tasks
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Suggested annual tasks
const suggestedAnnualTasks = [
  { description: 'Site visit / facility tour', category: 'visit', month: 1, priority: 'medium' },
  { description: 'Send thank you letter', category: 'email', month: 2, priority: 'high' },
  { description: 'Invite to competition event', category: 'meeting', month: 3, priority: 'medium' },
  { description: 'End-of-season update with results', category: 'email', month: 5, priority: 'high' },
  { description: 'Summer check-in / share plans for next season', category: 'email', month: 7, priority: 'low' },
  { description: 'Send renewal / re-sponsorship request', category: 'email', month: 9, priority: 'high' },
  { description: 'Share team photos and season recap', category: 'email', month: 12, priority: 'medium' },
];

// Annual Task Adder component
function AnnualTaskAdder({ onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [newTask, setNewTask] = useState({ description: '', category: 'general', month: 1, priority: 'medium' });

  if (!showForm && !showSuggestions) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-orange-400 border border-orange-500/30 rounded-lg text-sm hover:bg-orange-500/10"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
        <button
          type="button"
          onClick={() => setShowSuggestions(true)}
          className="flex items-center gap-2 px-3 py-2 text-slate-400 border border-slate-700 rounded-lg text-sm hover:bg-white/5"
        >
          Suggestions
        </button>
      </div>
    );
  }

  if (showSuggestions) {
    return (
      <div className="bg-slate-900/30 rounded-lg p-3 space-y-2">
        <p className="text-xs text-slate-500 mb-2">Click to add:</p>
        {suggestedAnnualTasks.map((task, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { onAdd(task); setShowSuggestions(false); }}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 bg-slate-800/50 rounded hover:bg-slate-700 transition-colors flex items-center justify-between"
          >
            <span>{task.description}</span>
            <span className="text-xs text-slate-500">{monthNames[task.month - 1]}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowSuggestions(false)}
          className="text-xs text-slate-500 hover:text-slate-300"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/50 rounded-lg p-3 space-y-3">
      <input
        type="text"
        value={newTask.description}
        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        placeholder="Task description (e.g., Send thank you letter)"
        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500"
      />
      <div className="grid grid-cols-3 gap-2">
        <select
          value={newTask.month}
          onChange={(e) => setNewTask({...newTask, month: parseInt(e.target.value)})}
          className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500"
        >
          {monthNames.map((m, i) => (
            <option key={i} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({...newTask, category: e.target.value})}
          className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500"
        >
          {taskCategories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
          className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            if (newTask.description.trim()) {
              onAdd(newTask);
              setNewTask({ description: '', category: 'general', month: 1, priority: 'medium' });
              setShowForm(false);
            }
          }}
          disabled={!newTask.description.trim()}
          className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => { setShowForm(false); setNewTask({ description: '', category: 'general', month: 1, priority: 'medium' }); }}
          className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Team Info Form
export function TeamInfoForm({ teamInfo, onSave, VariablesEditor }) {
  const [formData, setFormData] = useState(teamInfo);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved'
  const isFirstRender = useRef(true);

  // Auto-save with debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    const timer = setTimeout(() => {
      onSave(formData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 1500);
    }, 800);

    return () => clearTimeout(timer);
  }, [formData]);

  const inputClass = "w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500";

  return (
    <div className="space-y-8">
      {/* Section 1: Basic Team Info */}
      <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700/50">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
          Basic Team Info
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Season Year</label>
            <input
              type="text"
              value={formData.season_year || ''}
              onChange={(e) => setFormData({...formData, season_year: e.target.value})}
              className={inputClass}
              placeholder="2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Team Size</label>
            <input
              type="text"
              value={formData.team_size || ''}
              onChange={(e) => setFormData({...formData, team_size: e.target.value})}
              className={inputClass}
              placeholder="35 students"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Location</label>
            <input
              type="text"
              value={formData.team_location || ''}
              onChange={(e) => setFormData({...formData, team_location: e.target.value})}
              className={inputClass}
              placeholder="Holland, MI"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Email Template Variables */}
      <div>
        <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
          Email Template Content
        </h4>
        <p className="text-sm text-slate-400 mb-4">Add talking points that will auto-fill into your sponsor emails. Click "Suggestions" for ideas!</p>

        {VariablesEditor && (
          <VariablesEditor
            variables={formData.variables || {}}
            onChange={(variables) => setFormData({...formData, variables})}
          />
        )}
      </div>

      {/* Section 3: Annual Sponsor Tasks */}
      <div className="bg-slate-900/30 p-5 rounded-xl border border-slate-700/50">
        <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
          <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
          Annual Sponsor Tasks
        </h4>
        <p className="text-sm text-slate-400 mb-4">
          Define tasks that every sponsor should get each year. These will auto-generate for each sponsor.
        </p>

        <div className="space-y-3">
          {(formData.annual_tasks || []).map((task, index) => (
            <div key={index} className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3">
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{task.description}</div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="capitalize">{task.category || 'general'}</span>
                  <span>·</span>
                  <span>{monthNames[task.month - 1] || 'Any time'}</span>
                  <span>·</span>
                  <span className={task.priority === 'high' ? 'text-red-400' : task.priority === 'medium' ? 'text-yellow-400' : 'text-slate-400'}>
                    {task.priority || 'medium'} priority
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(formData.annual_tasks || [])];
                  updated.splice(index, 1);
                  setFormData({...formData, annual_tasks: updated});
                }}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <AnnualTaskAdder onAdd={(task) => {
            setFormData({
              ...formData,
              annual_tasks: [...(formData.annual_tasks || []), task]
            });
          }} />
        </div>
      </div>

      {/* Auto-save status */}
      {saveStatus && (
        <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-sm py-3 -mx-4 px-4 border-t border-slate-700">
          <div className="flex items-center gap-2 text-sm">
            {saveStatus === 'saving' ? (
              <span className="text-slate-400">Saving...</span>
            ) : (
              <span className="text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Saved
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
