import React, { useState, useEffect } from 'react';
import { Mail, User, Building2, Check, X, Clock, ChevronDown, ChevronUp, Inbox } from 'lucide-react';
import { supabase } from './supabaseClient';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export function EmailQueue({ sponsors, onInteractionLogged }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [assigning, setAssigning] = useState(null); // email id being assigned
  const [selectedSponsor, setSelectedSponsor] = useState('');
  const [sponsorSearch, setSearchSponsor] = useState('');

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_queue')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading email queue:', error);
    } else {
      setQueue(data || []);
    }
    setLoading(false);
  };

  const handleAssign = async (emailId) => {
    if (!selectedSponsor) return;

    const email = queue.find(e => e.id === emailId);
    const sponsor = sponsors.find(s => s.id === selectedSponsor);
    if (!email || !sponsor) return;

    try {
      // Create the interaction
      const { error: interactionError } = await supabase
        .from('interactions')
        .insert([{
          sponsor_id: sponsor.id,
          team_id: sponsor.team_id,
          type: 'email',
          notes: `Subject: ${email.email_subject}\n\n(Manually assigned from email queue)`,
          date: new Date(email.created_at).toISOString().split('T')[0],
          metadata: {
            logged_via: 'email_queue',
            email_from: email.email_from,
            email_to: email.email_to,
            email_subject: email.email_subject
          }
        }]);

      if (interactionError) throw interactionError;

      // Update queue item status
      const { error: updateError } = await supabase
        .from('email_queue')
        .update({
          status: 'assigned',
          assigned_sponsor_id: sponsor.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', emailId);

      if (updateError) throw updateError;

      // Refresh and notify
      await loadQueue();
      setAssigning(null);
      setSelectedSponsor('');
      if (onInteractionLogged) onInteractionLogged();

    } catch (error) {
      console.error('Error assigning email:', error);
      alert('Error assigning email. Please try again.');
    }
  };

  const handleDismiss = async (emailId) => {
    if (!confirm('Dismiss this email? It won\'t be logged as an interaction.')) return;

    try {
      const { error } = await supabase
        .from('email_queue')
        .update({
          status: 'dismissed',
          processed_at: new Date().toISOString()
        })
        .eq('id', emailId);

      if (error) throw error;
      await loadQueue();

    } catch (error) {
      console.error('Error dismissing email:', error);
      alert('Error dismissing email. Please try again.');
    }
  };

  const filteredSponsors = sponsors.filter(s =>
    s.name.toLowerCase().includes(sponsorSearch.toLowerCase()) ||
    (s.contact_name && s.contact_name.toLowerCase().includes(sponsorSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="text-center py-8 text-slate-400">
        Loading email queue...
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="text-center py-12">
        <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">No emails waiting for assignment</p>
        <p className="text-sm text-slate-500 mt-1">
          Emails that can't be auto-matched will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-orange-500" />
          Email Queue
          <span className="text-sm font-normal text-slate-400">
            ({queue.length} pending)
          </span>
        </h3>
      </div>

      {queue.map((email) => (
        <div
          key={email.id}
          className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div
            className="p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
            onClick={() => setExpandedId(expandedId === email.id ? null : email.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white truncate">
                    {email.email_subject || '(no subject)'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {email.email_from || 'Unknown sender'}
                  </span>
                  {email.email_to && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {email.email_to}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(email.created_at)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {expandedId === email.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </div>
          </div>

          {/* Expanded Content */}
          {expandedId === email.id && (
            <div className="border-t border-slate-700 p-4 space-y-4">
              {/* Body Preview */}
              {email.email_body_preview && (
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Preview</label>
                  <p className="text-sm text-slate-300 bg-slate-800 p-3 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                    {email.email_body_preview}
                  </p>
                </div>
              )}

              {/* Assignment UI */}
              {assigning === email.id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">
                      Search & Select Sponsor
                    </label>
                    <input
                      type="text"
                      value={sponsorSearch}
                      onChange={(e) => setSearchSponsor(e.target.value)}
                      placeholder="Type to search sponsors..."
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm mb-2"
                      autoFocus
                    />
                    <div className="max-h-48 overflow-y-auto bg-slate-800 border border-slate-600 rounded">
                      {filteredSponsors.length === 0 ? (
                        <div className="p-3 text-sm text-slate-500">No sponsors found</div>
                      ) : (
                        filteredSponsors.slice(0, 10).map(sponsor => (
                          <button
                            key={sponsor.id}
                            onClick={() => setSelectedSponsor(sponsor.id)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                              selectedSponsor === sponsor.id ? 'bg-orange-500/20 text-orange-300' : 'text-white'
                            }`}
                          >
                            <Building2 className="w-4 h-4 text-slate-400" />
                            <span className="flex-1">{sponsor.name}</span>
                            {sponsor.contact_name && (
                              <span className="text-xs text-slate-500">{sponsor.contact_name}</span>
                            )}
                            {selectedSponsor === sponsor.id && (
                              <Check className="w-4 h-4 text-orange-400" />
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAssign(email.id)}
                      disabled={!selectedSponsor}
                      className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="w-4 h-4" />
                      Assign & Log
                    </button>
                    <button
                      onClick={() => {
                        setAssigning(null);
                        setSelectedSponsor('');
                        setSearchSponsor('');
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setAssigning(email.id);
                      setSelectedSponsor('');
                      setSearchSponsor('');
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                  >
                    <Building2 className="w-4 h-4" />
                    Assign to Sponsor
                  </button>
                  <button
                    onClick={() => handleDismiss(email.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
                  >
                    <X className="w-4 h-4" />
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default EmailQueue;
