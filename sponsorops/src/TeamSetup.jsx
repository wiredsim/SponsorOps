import React, { useState } from 'react';
import { Users, Mail, CheckCircle2, AlertCircle, Plus, Building2 } from 'lucide-react';
import { useTeam } from './TeamContext';
import { useAuth } from './AuthContext';

export default function TeamSetup() {
  const { user } = useAuth();
  const { pendingInvites, hasPendingInvites, acceptInvite, createTeam, loading, error: teamError } = useTeam();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createFormData, setCreateFormData] = useState({ name: '', teamNumber: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Debug logging
  console.log('TeamSetup render:', {
    userEmail: user?.email,
    pendingInvites,
    hasPendingInvites,
    loading,
    teamError
  });

  const handleAcceptInvite = async (inviteId) => {
    setSubmitting(true);
    setError(null);

    const { error: acceptError } = await acceptInvite(inviteId);

    if (acceptError) {
      setError(acceptError.message);
    }

    setSubmitting(false);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: createError } = await createTeam(
      createFormData.name,
      createFormData.teamNumber
    );

    if (createError) {
      setError(createError.message);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading team information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl inline-flex mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to SponsorOps</h1>
          <p className="text-blue-300">
            {hasPendingInvites
              ? "You've been invited to join a team!"
              : "You're not a member of any team yet."
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Pending Invites */}
        {hasPendingInvites && (
          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-500" />
              Pending Invitations
            </h2>

            {pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  {invite.team.logo_url ? (
                    <img
                      src={invite.team.logo_url}
                      alt={invite.team.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-white">{invite.team.name}</h3>
                    {invite.team.team_number && (
                      <p className="text-sm text-blue-300">Team #{invite.team.team_number}</p>
                    )}
                  </div>
                </div>

                <p className="text-slate-300 text-sm mb-4">
                  You've been invited to join this team. Accept the invitation to start collaborating.
                </p>

                <button
                  onClick={() => handleAcceptInvite(invite.id)}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  {submitting ? 'Accepting...' : 'Accept Invitation'}
                </button>

                <p className="text-xs text-slate-500 mt-3 text-center">
                  Expires {new Date(invite.expires_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* No Team Message */}
        {!hasPendingInvites && !showCreateForm && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 text-center">
            <AlertCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Team Found</h3>
            <p className="text-slate-400 mb-6">
              Contact your team admin to get an invitation, or create a new team if you're the team lead.
            </p>

            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              <Plus className="w-5 h-5" />
              Create New Team
            </button>
          </div>
        )}

        {/* Create Team Form */}
        {showCreateForm && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Create New Team</h3>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  placeholder="e.g., Team 74 CHAOS"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2">
                  FRC Team Number
                </label>
                <input
                  type="text"
                  value={createFormData.teamNumber}
                  onChange={(e) => setCreateFormData({ ...createFormData, teamNumber: e.target.value })}
                  placeholder="e.g., 74"
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Team'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Logged in as <span className="text-blue-300">{user?.email}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
