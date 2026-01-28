import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Star, User, Mail, Phone, Briefcase } from 'lucide-react';
import { supabase } from './supabaseClient';

const roleOptions = [
  'Decision Maker',
  'Technical Contact',
  'Day-to-day Contact',
  'Finance/Billing',
  'Marketing',
  'Other'
];

export function ContactsEditor({ sponsorId, teamId, onContactsChange }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    role: '',
    is_primary: false,
    notes: ''
  });

  useEffect(() => {
    if (sponsorId) {
      loadContacts();
    }
  }, [sponsorId]);

  const loadContacts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('sponsor_id', sponsorId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading contacts:', error);
    } else {
      setContacts(data || []);
      if (onContactsChange) onContactsChange(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      email: '',
      phone: '',
      role: '',
      is_primary: false,
      notes: ''
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('contacts')
          .update({
            name: formData.name,
            title: formData.title,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            is_primary: formData.is_primary,
            notes: formData.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('contacts')
          .insert([{
            sponsor_id: sponsorId,
            team_id: teamId,
            name: formData.name,
            title: formData.title,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            is_primary: contacts.length === 0 ? true : formData.is_primary,
            notes: formData.notes
          }]);

        if (error) throw error;
      }

      resetForm();
      setEditingId(null);
      setShowAddForm(false);
      await loadContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Error saving contact. Please try again.');
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name || '',
      title: contact.title || '',
      email: contact.email || '',
      phone: contact.phone || '',
      role: contact.role || '',
      is_primary: contact.is_primary || false,
      notes: contact.notes || ''
    });
    setEditingId(contact.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact?')) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact. Please try again.');
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ is_primary: true })
        .eq('id', id);

      if (error) throw error;
      await loadContacts();
    } catch (error) {
      console.error('Error setting primary contact:', error);
    }
  };

  if (loading) {
    return <div className="text-slate-400 text-sm">Loading contacts...</div>;
  }

  return (
    <div className="space-y-3">
      {/* Contact List */}
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`p-3 rounded-lg border ${
            contact.is_primary
              ? 'bg-orange-500/10 border-orange-500/30'
              : 'bg-slate-900/50 border-slate-700'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-white">{contact.name}</span>
                {contact.is_primary && (
                  <span className="flex items-center gap-1 text-xs px-2 py-0.5 bg-orange-500 text-white rounded-full">
                    <Star className="w-3 h-3" />
                    Primary
                  </span>
                )}
              </div>
              {contact.title && (
                <div className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                  <Briefcase className="w-3 h-3" />
                  {contact.title}
                </div>
              )}
              <div className="flex flex-wrap gap-3 mt-2 text-sm">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {contact.email}
                  </a>
                )}
                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    {contact.phone}
                  </a>
                )}
              </div>
              {contact.role && (
                <div className="text-xs text-slate-500 mt-1">{contact.role}</div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!contact.is_primary && (
                <button
                  onClick={() => handleSetPrimary(contact.id)}
                  className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/20 rounded"
                  title="Set as primary"
                >
                  <Star className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleEdit(contact)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(contact.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add/Edit Form */}
      {showAddForm ? (
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Name *"
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
            />
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title"
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email"
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
            />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone"
              className="px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
            />
          </div>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
          >
            <option value="">Select role...</option>
            {roleOptions.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {contacts.length > 0 && (
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={formData.is_primary}
                onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                className="rounded border-slate-600"
              />
              Set as primary contact
            </label>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={!formData.name.trim()}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {editingId ? 'Update' : 'Add Contact'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-orange-400 border border-orange-500/30 rounded-lg text-sm hover:bg-orange-500/10 w-full justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      )}

      {contacts.length === 0 && !showAddForm && (
        <p className="text-sm text-slate-500 text-center py-2">
          No contacts yet. Add your first contact above.
        </p>
      )}
    </div>
  );
}

export default ContactsEditor;
