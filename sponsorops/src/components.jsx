import React, { useState, useRef } from 'react';
import { X, Edit2, Trash2, ExternalLink, MessageSquare, Plus, Upload, Image, Mail, Search, Flame, ThermometerSun, Snowflake, CheckCircle2 } from 'lucide-react';

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
const LeadTemperatureDisplay = ({ temperature, score }) => {
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
export function SponsorDetailModal({ sponsor, interactions, tasks, onClose, onEdit, onDelete, onAddInteraction, onComposeEmail, onResearch, statusOptions }) {
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
              <button onClick={onResearch} className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600" title="Research sponsor">
                <Search className="w-5 h-5" />
              </button>
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

          <div className="flex gap-2">
            {['overview', 'interactions', 'tasks'].map(tab => (
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
  const [formData, setFormData] = useState(task ? {
    id: task.id,
    sponsorId: task.sponsor_id || '',
    description: task.description || '',
    dueDate: task.due_date || getLocalDatePlusDays(7),
    priority: task.priority || 'medium',
    status: task.status || 'todo',
    category: task.category || 'general',
    assignedTo: task.assigned_to || '',
    completed: task.completed || false
  } : {
    sponsorId: '',
    description: '',
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
            <label className="block text-sm font-medium text-blue-300 mb-2">Description *</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              placeholder="e.g., Follow up on email"
            />
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

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Sponsor (optional)</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
              />
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

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              {isEditing ? 'Update Task' : 'Create Task'}
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

// Team Info Form
export function TeamInfoForm({ teamInfo, onSave, VariablesEditor }) {
  const [formData, setFormData] = useState(teamInfo);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = "w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      {/* Save Button */}
      <div className="flex gap-3 sticky bottom-0 bg-slate-900/90 backdrop-blur-sm py-4 -mx-4 px-4 border-t border-slate-700">
        <button
          type="submit"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Saved!
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}
