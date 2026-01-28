import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const TeamContext = createContext({});

export function TeamProvider({ children }) {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user's teams and pending invites when user changes
  useEffect(() => {
    if (user) {
      loadTeamsAndInvites();
    } else {
      setTeams([]);
      setCurrentTeam(null);
      setPendingInvites([]);
      setLoading(false);
    }
  }, [user]);

  const loadTeamsAndInvites = async () => {
    setLoading(true);
    setError(null);

    try {
      // Ensure user profile exists (for new users)
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          email: user.email,
          display_name: user.email.split('@')[0]
        }, { onConflict: 'id' });

      if (profileError) {
        console.warn('Could not upsert user profile:', profileError);
        // Don't throw - this is not critical
      }

      // Load user's teams with their role
      const { data: memberData, error: memberError } = await supabase
        .from('team_members')
        .select(`
          role,
          team:teams (
            id,
            name,
            team_number,
            logo_url,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (memberError) {
        console.error('Error loading team memberships:', memberError);
        // Don't throw - user might just not be in any teams yet
      }

      const userTeams = (memberData || [])
        .filter(m => m.team) // Filter out any null teams
        .map(m => ({
          ...m.team,
          role: m.role
        }));

      setTeams(userTeams);

      // Set current team from localStorage or first team
      const savedTeamId = localStorage.getItem('currentTeamId');
      const savedTeam = userTeams.find(t => t.id === savedTeamId);

      if (savedTeam) {
        setCurrentTeam(savedTeam);
      } else if (userTeams.length > 0) {
        setCurrentTeam(userTeams[0]);
        localStorage.setItem('currentTeamId', userTeams[0].id);
      } else {
        setCurrentTeam(null);
      }

      // Load pending invites for this user's email (case-insensitive)
      const userEmail = user.email.toLowerCase();
      const { data: inviteData, error: inviteError } = await supabase
        .from('team_invites')
        .select(`
          id,
          email,
          created_at,
          expires_at,
          team:teams (
            id,
            name,
            team_number,
            logo_url
          )
        `)
        .ilike('email', userEmail)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString());

      if (inviteError) {
        console.error('Error loading invites:', inviteError);
        // Don't throw - just means no invites found or RLS issue
        setPendingInvites([]);
      } else {
        setPendingInvites(inviteData || []);
      }

    } catch (err) {
      console.error('Error loading teams:', err);
      setError(err.message);
    }

    setLoading(false);
  };

  const switchTeam = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
      localStorage.setItem('currentTeamId', teamId);
    }
  };

  const createTeam = async (name, teamNumber) => {
    if (!user) return { error: { message: 'Not authenticated' } };

    try {
      // Create the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert([{
          name,
          team_number: teamNumber,
          created_by: user.id
        }])
        .select()
        .single();

      if (teamError) throw teamError;

      // Add creator as admin
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: team.id,
          user_id: user.id,
          role: 'admin'
        }]);

      if (memberError) throw memberError;

      // Reload teams
      await loadTeamsAndInvites();

      return { data: team };
    } catch (err) {
      console.error('Error creating team:', err);
      return { error: err };
    }
  };

  const updateTeam = async (teamId, updates) => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', teamId);

      if (error) throw error;

      // Reload teams
      await loadTeamsAndInvites();

      return { success: true };
    } catch (err) {
      console.error('Error updating team:', err);
      return { error: err };
    }
  };

  const inviteMember = async (teamId, email) => {
    if (!user) return { error: { message: 'Not authenticated' } };

    try {
      const { data, error } = await supabase
        .from('team_invites')
        .insert([{
          team_id: teamId,
          email: email.toLowerCase(),
          invited_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      return { data };
    } catch (err) {
      console.error('Error inviting member:', err);
      return { error: err };
    }
  };

  const acceptInvite = async (inviteId) => {
    if (!user) return { error: { message: 'Not authenticated' } };

    try {
      // Get the invite details
      const { data: invite, error: fetchError } = await supabase
        .from('team_invites')
        .select('team_id, invited_by')
        .eq('id', inviteId)
        .single();

      if (fetchError) throw fetchError;

      // Add user to team
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          team_id: invite.team_id,
          user_id: user.id,
          role: 'member',
          invited_by: invite.invited_by
        }]);

      if (memberError) throw memberError;

      // Mark invite as accepted
      const { error: updateError } = await supabase
        .from('team_invites')
        .update({ accepted_at: new Date().toISOString() })
        .eq('id', inviteId);

      if (updateError) throw updateError;

      // Reload teams
      await loadTeamsAndInvites();

      return { success: true };
    } catch (err) {
      console.error('Error accepting invite:', err);
      return { error: err };
    }
  };

  const removeMember = async (teamId, memberId) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', memberId);

      if (error) throw error;

      return { success: true };
    } catch (err) {
      console.error('Error removing member:', err);
      return { error: err };
    }
  };

  const updateMemberRole = async (teamId, memberId, newRole) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ role: newRole })
        .eq('team_id', teamId)
        .eq('user_id', memberId);

      if (error) throw error;

      return { success: true };
    } catch (err) {
      console.error('Error updating member role:', err);
      return { error: err };
    }
  };

  const getTeamMembers = async (teamId) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          role,
          joined_at,
          user_id
        `)
        .eq('team_id', teamId);

      if (error) throw error;

      // Get user emails separately (since we can't directly join auth.users)
      const memberIds = data.map(m => m.user_id);

      // We'll need to store user info in a separate table or use a function
      // For now, return the basic member data
      return { data };
    } catch (err) {
      console.error('Error fetching team members:', err);
      return { error: err };
    }
  };

  const getTeamInvites = async (teamId) => {
    try {
      const { data, error } = await supabase
        .from('team_invites')
        .select('*')
        .eq('team_id', teamId)
        .is('accepted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data };
    } catch (err) {
      console.error('Error fetching team invites:', err);
      return { error: err };
    }
  };

  const cancelInvite = async (inviteId) => {
    try {
      const { error } = await supabase
        .from('team_invites')
        .delete()
        .eq('id', inviteId);

      if (error) throw error;

      return { success: true };
    } catch (err) {
      console.error('Error canceling invite:', err);
      return { error: err };
    }
  };

  const uploadTeamLogo = async (teamId, file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${teamId}/logo.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('team-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('team-logos')
        .getPublicUrl(fileName);

      // Update team with logo URL
      const { error: updateError } = await supabase
        .from('teams')
        .update({ logo_url: publicUrl })
        .eq('id', teamId);

      if (updateError) throw updateError;

      // Reload teams
      await loadTeamsAndInvites();

      return { data: { url: publicUrl } };
    } catch (err) {
      console.error('Error uploading logo:', err);
      return { error: err };
    }
  };

  // Computed values
  const isAdmin = currentTeam?.role === 'admin';
  const hasTeam = teams.length > 0;
  const hasPendingInvites = pendingInvites.length > 0;

  const value = {
    teams,
    currentTeam,
    pendingInvites,
    loading,
    error,
    isAdmin,
    hasTeam,
    hasPendingInvites,
    switchTeam,
    createTeam,
    updateTeam,
    inviteMember,
    acceptInvite,
    removeMember,
    updateMemberRole,
    getTeamMembers,
    getTeamInvites,
    cancelInvite,
    uploadTeamLogo,
    refreshTeams: loadTeamsAndInvites
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
