import React, { useState, useEffect } from 'react';
import {
  X, Users, Mail, Crown, Trash2, Upload, Building2,
  UserPlus, AlertCircle, CheckCircle2, Clock, Edit2
} from 'lucide-react';
import { useTeam } from './TeamContext';
import { useAuth } from './AuthContext';
import { supabase } from './supabaseClient';

export default function TeamSettings({ onClose }) {
  const { user } = useAuth();
  const {
    currentTeam,
    isAdmin,
    updateTeam,
    inviteMember,
    removeMember,
    updateMemberRole,
    cancelInvite,
    uploadTeamLogo,
    refreshTeams
  } = useTeam();

  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [editing, setEditing] = useState(false);
  const [teamName, setTeamName] = useState(currentTeam?.name || '');
  const [teamNumber, setTeamNumber] = useState(currentTeam?.team_number || '');
  const [inviteEmail, setInviteEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentTeam) {
      loadTeamData();
      setTeamName(currentTeam.name);
      setTeamNumber(currentTeam.team_number || '');
    }
  }, [currentTeam]);

  const loadTeamData = async () => {
    setLoading(true);
    try {
      // Load members
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select('id, role, joined_at, user_id')
        .eq('team_id', currentTeam.id);

      if (memberError) throw memberError;

      // Get user emails from profiles or auth (we'll need to handle this)
      // For now, we store the basic info
      setMembers(memberData || []);

      // Load pending invites
      const { data: inviteData, error: inviteError } = await supabase
        .from('team_invites')
        .select('*')
        .eq('team_id', currentTeam.id)
        .is('accepted_at', null)
        .order('created_at', { ascending: false });

      if (inviteError) throw inviteError;
      setInvites(inviteData || []);

    } catch (err) {
      console.error('Error loading team data:', err);
      setError(err.message);
    }
    setLoading(false);
  };

  const handleSaveTeamInfo = async () => {
    setSubmitting(true);
    setError(null);

    const { error: updateError } = await updateTeam(currentTeam.id, {
      name: teamName,
      team_number: teamNumber
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('Team information updated');
      setEditing(false);
      setTimeout(() => setSuccess(null), 3000);
    }

    setSubmitting(false);
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setSubmitting(true);
    setError(null);

    const { error: inviteError } = await inviteMember(currentTeam.id, inviteEmail);

    if (inviteError) {
      if (inviteError.code === '23505') {
        setError('This email has already been invited');
      } else {
        setError(inviteError.message);
      }
    } else {
      setSuccess(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      loadTeamData();
      setTimeout(() => setSuccess(null), 3000);
    }

    setSubmitting(false);
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this member from the team?')) return;

    setError(null);
    const { error: removeError } = await removeMember(currentTeam.id, memberId);

    if (removeError) {
      setError(removeError.message);
    } else {
      setSuccess('Member removed');
      loadTeamData();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleToggleRole = async (memberId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin';
    setError(null);

    const { error: roleError } = await updateMemberRole(currentTeam.id, memberId, newRole);

    if (roleError) {
      setError(roleError.message);
    } else {
      setSuccess(`Role updated to ${newRole}`);
      loadTeamData();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleCancelInvite = async (inviteId) => {
    if (!confirm('Cancel this invitation?')) return;

    setError(null);
    const { error: cancelError } = await cancelInvite(inviteId);

    if (cancelError) {
      setError(cancelError.message);
    } else {
      setSuccess('Invitation cancelled');
      loadTeamData();
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: uploadError } = await uploadTeamLogo(currentTeam.id, file);

    if (uploadError) {
      setError(uploadError.message);
    } else {
      setSuccess('Logo uploaded successfully');
      setTimeout(() => setSuccess(null), 3000);
    }

    setSubmitting(false);
  };

  if (!currentTeam) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white">Team Settings</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Success/Error Messages */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-200">{success}</p>
            </div>
          )}

          {/* Team Info Section */}
          <section>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-orange-500" />
              Team Information
            </h4>

            <div className="bg-slate-900/50 rounded-lg p-4 space-y-4">
              {/* Logo */}
              <div className="flex items-center gap-4">
                {currentTeam.logo_url ? (
                  <img
                    src={currentTeam.logo_url}
                    alt={currentTeam.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                )}

                {isAdmin && (
                  <div>
                    <label className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 cursor-pointer transition-all">
                      <Upload className="w-4 h-4" />
                      {currentTeam.logo_url ? 'Change Logo' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleLogoUpload}
                        disabled={submitting}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-1">JPEG, PNG, or WebP. Max 2MB.</p>
                  </div>
                )}
              </div>

              {/* Team Name & Number */}
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2">Team Name</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2">FRC Team Number</label>
                    <input
                      type="text"
                      value={teamNumber}
                      onChange={(e) => setTeamNumber(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveTeamInfo}
                      disabled={submitting}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setTeamName(currentTeam.name);
                        setTeamNumber(currentTeam.team_number || '');
                      }}
                      className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xl font-bold text-white">{currentTeam.name}</h5>
                    {currentTeam.team_number && (
                      <p className="text-blue-300">Team #{currentTeam.team_number}</p>
                    )}
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Members Section */}
          <section>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Team Members ({members.length})
            </h4>

            <div className="space-y-2">
              {loading ? (
                <p className="text-slate-400 text-center py-4">Loading members...</p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {member.user_id === user.id ? 'You' : `Member`}
                        </p>
                        <p className="text-xs text-slate-400">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {member.role === 'admin' && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                          <Crown className="w-3 h-3" />
                          Admin
                        </span>
                      )}

                      {isAdmin && member.user_id !== user.id && (
                        <>
                          <button
                            onClick={() => handleToggleRole(member.user_id, member.role)}
                            className="px-2 py-1 text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-700 rounded transition-all"
                          >
                            {member.role === 'admin' ? 'Demote' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleRemoveMember(member.user_id)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Invite Section (Admin Only) */}
          {isAdmin && (
            <section>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-orange-500" />
                Invite Members
              </h4>

              <form onSubmit={handleInviteMember} className="flex gap-3 mb-4">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  disabled={submitting || !inviteEmail.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  Invite
                </button>
              </form>

              {/* Pending Invites */}
              {invites.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400 mb-2">Pending Invitations</p>
                  {invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white">{invite.email}</p>
                          <p className="text-xs text-slate-400">
                            Expires {new Date(invite.expires_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCancelInvite(invite.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded transition-all"
                        title="Cancel invitation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Close Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
