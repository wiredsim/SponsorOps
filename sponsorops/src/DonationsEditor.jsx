import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, DollarSign, Gift, Receipt, Calendar } from 'lucide-react';
import { supabase } from './supabaseClient';

const formatCurrency = (amount) => {
  if (!amount) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export function DonationsEditor({ sponsorId, teamId, onDonationsChange }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'monetary',
    amount: '',
    description: '',
    estimated_value: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    reference: '',
    receipt_sent: false
  });

  useEffect(() => {
    if (sponsorId) {
      loadDonations();
    }
  }, [sponsorId]);

  const loadDonations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('sponsor_id', sponsorId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error loading donations:', error);
    } else {
      setDonations(data || []);
      if (onDonationsChange) onDonationsChange(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      type: 'monetary',
      amount: '',
      description: '',
      estimated_value: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
      reference: '',
      receipt_sent: false
    });
  };

  const handleSave = async () => {
    // Validate
    if (formData.type === 'monetary' && !formData.amount) {
      alert('Please enter an amount for monetary donations.');
      return;
    }
    if (formData.type === 'in_kind' && !formData.description) {
      alert('Please enter a description for in-kind donations.');
      return;
    }

    try {
      const donationData = {
        sponsor_id: sponsorId,
        team_id: teamId,
        type: formData.type,
        amount: formData.type === 'monetary' ? parseFloat(formData.amount) || null : null,
        description: formData.type === 'in_kind' ? formData.description : null,
        estimated_value: formData.type === 'in_kind' ? parseFloat(formData.estimated_value) || null : null,
        date: formData.date,
        notes: formData.notes || null,
        reference: formData.reference || null,
        receipt_sent: formData.receipt_sent,
        updated_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase
          .from('donations')
          .update(donationData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('donations')
          .insert([donationData]);

        if (error) throw error;
      }

      resetForm();
      setEditingId(null);
      setShowAddForm(false);
      await loadDonations();
    } catch (error) {
      console.error('Error saving donation:', error);
      alert('Error saving donation. Please try again.');
    }
  };

  const handleEdit = (donation) => {
    setFormData({
      type: donation.type || 'monetary',
      amount: donation.amount || '',
      description: donation.description || '',
      estimated_value: donation.estimated_value || '',
      date: donation.date || new Date().toISOString().split('T')[0],
      notes: donation.notes || '',
      reference: donation.reference || '',
      receipt_sent: donation.receipt_sent || false
    });
    setEditingId(donation.id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this donation record?')) return;

    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadDonations();
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Error deleting donation. Please try again.');
    }
  };

  const handleToggleReceipt = async (donation) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({
          receipt_sent: !donation.receipt_sent,
          receipt_sent_at: !donation.receipt_sent ? new Date().toISOString() : null
        })
        .eq('id', donation.id);

      if (error) throw error;
      await loadDonations();
    } catch (error) {
      console.error('Error updating receipt status:', error);
    }
  };

  // Calculate totals
  const totals = donations.reduce((acc, d) => {
    if (d.type === 'monetary') {
      acc.monetary += parseFloat(d.amount) || 0;
    } else {
      acc.inKind += parseFloat(d.estimated_value) || 0;
    }
    return acc;
  }, { monetary: 0, inKind: 0 });

  if (loading) {
    return <div className="text-slate-400 text-sm">Loading donations...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Totals Summary */}
      {donations.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
            <div className="text-xs text-green-400 mb-1">Monetary</div>
            <div className="text-lg font-semibold text-green-300">{formatCurrency(totals.monetary)}</div>
          </div>
          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-center">
            <div className="text-xs text-purple-400 mb-1">In-Kind Value</div>
            <div className="text-lg font-semibold text-purple-300">{formatCurrency(totals.inKind)}</div>
          </div>
          <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-center">
            <div className="text-xs text-orange-400 mb-1">Total Value</div>
            <div className="text-lg font-semibold text-orange-300">{formatCurrency(totals.monetary + totals.inKind)}</div>
          </div>
        </div>
      )}

      {/* Donations List */}
      {donations.map((donation) => (
        <div
          key={donation.id}
          className={`p-3 rounded-lg border ${
            donation.type === 'monetary'
              ? 'bg-green-500/5 border-green-500/20'
              : 'bg-purple-500/5 border-purple-500/20'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {donation.type === 'monetary' ? (
                  <DollarSign className="w-4 h-4 text-green-400" />
                ) : (
                  <Gift className="w-4 h-4 text-purple-400" />
                )}
                <span className="font-medium text-white">
                  {donation.type === 'monetary'
                    ? formatCurrency(donation.amount)
                    : donation.description}
                </span>
                {donation.type === 'in_kind' && donation.estimated_value && (
                  <span className="text-xs text-slate-400">
                    (est. {formatCurrency(donation.estimated_value)})
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(donation.date)}
                </span>
                {donation.reference && (
                  <span className="text-slate-500">Ref: {donation.reference}</span>
                )}
              </div>
              {donation.notes && (
                <div className="text-sm text-slate-500 mt-1">{donation.notes}</div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleToggleReceipt(donation)}
                className={`p-1.5 rounded ${
                  donation.receipt_sent
                    ? 'text-green-400 bg-green-500/20'
                    : 'text-slate-400 hover:text-green-400 hover:bg-green-500/20'
                }`}
                title={donation.receipt_sent ? 'Receipt sent' : 'Mark receipt sent'}
              >
                <Receipt className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleEdit(donation)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(donation.id)}
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
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'monetary' })}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm ${
                formData.type === 'monetary'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Monetary
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'in_kind' })}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm ${
                formData.type === 'in_kind'
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <Gift className="w-4 h-4" />
              In-Kind
            </button>
          </div>

          {/* Type-specific fields */}
          {formData.type === 'monetary' ? (
            <div>
              <label className="block text-xs text-slate-400 mb-1">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., 3D printer, workshop supplies, venue space"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Estimated Value</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Common fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Reference</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Check #, Invoice #"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional details..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm resize-none"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={formData.receipt_sent}
              onChange={(e) => setFormData({ ...formData, receipt_sent: e.target.checked })}
              className="rounded border-slate-600"
            />
            Receipt/acknowledgment sent
          </label>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
            >
              <Check className="w-4 h-4" />
              {editingId ? 'Update' : 'Add Donation'}
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
          Add Donation
        </button>
      )}

      {donations.length === 0 && !showAddForm && (
        <p className="text-sm text-slate-500 text-center py-2">
          No donations recorded yet. Add the first one above.
        </p>
      )}
    </div>
  );
}

export default DonationsEditor;
