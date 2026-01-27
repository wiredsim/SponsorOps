import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Calendar, CheckCircle2, Clock, 
  TrendingUp, Mail, Phone, Plus, Search, Filter,
  X, Edit2, Trash2, ExternalLink, BarChart3,
  FileText, Target, Briefcase, Award, ChevronRight,
  AlertCircle, Star, MessageSquare, Bell
} from 'lucide-react';
import { supabase } from './supabaseClient';
import { SponsorModal, SponsorDetailModal, TaskModal, InteractionModal, TeamInfoForm } from './components';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [sponsors, setSponsors] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamInfo, setTeamInfo] = useState(null);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [showAddInteraction, setShowAddInteraction] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      // Load sponsors
      const { data: sponsorsData, error: sponsorsError } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (sponsorsError) throw sponsorsError;
      setSponsors(sponsorsData || []);

      // Load interactions
      const { data: interactionsData, error: interactionsError } = await supabase
        .from('interactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (interactionsError) throw interactionsError;
      setInteractions(interactionsData || []);

      // Load tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

      // Load team info
      const { data: teamInfoData, error: teamInfoError } = await supabase
        .from('team_info')
        .select('*')
        .limit(1)
        .single();
      
      if (teamInfoError && teamInfoError.code !== 'PGRST116') {
        throw teamInfoError;
      }
      
      setTeamInfo(teamInfoData || {
        season_year: '2025',
        new_tech: '',
        team_changes: '',
        goals: '',
        last_season_achievements: '',
        last_season_story: ''
      });

    } catch (error) {
      console.error('Error loading data:', error);
      alert('Error loading data. Please check your internet connection and Supabase configuration.');
    }

    setLoading(false);
  };

  const saveSponsor = async (sponsor) => {
    try {
      if (sponsor.id) {
        // Update existing
        const { error } = await supabase
          .from('sponsors')
          .update({
            name: sponsor.name,
            status: sponsor.status,
            type: sponsor.type,
            contact_name: sponsor.contactName,
            contact_title: sponsor.contactTitle,
            email: sponsor.email,
            phone: sponsor.phone,
            website: sponsor.website,
            industry: sponsor.industry,
            notes: sponsor.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', sponsor.id);
        
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('sponsors')
          .insert([{
            name: sponsor.name,
            status: sponsor.status,
            type: sponsor.type,
            contact_name: sponsor.contactName,
            contact_title: sponsor.contactTitle,
            email: sponsor.email,
            phone: sponsor.phone,
            website: sponsor.website,
            industry: sponsor.industry,
            notes: sponsor.notes
          }]);
        
        if (error) throw error;
      }
      
      await loadData();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      alert('Error saving sponsor. Please try again.');
    }
  };

  const deleteSponsor = async (id) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      try {
        const { error } = await supabase
          .from('sponsors')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        await loadData();
        setSelectedSponsor(null);
      } catch (error) {
        console.error('Error deleting sponsor:', error);
        alert('Error deleting sponsor. Please try again.');
      }
    }
  };

  const saveInteraction = async (interaction) => {
    try {
      const { error } = await supabase
        .from('interactions')
        .insert([{
          sponsor_id: interaction.sponsorId,
          type: interaction.type,
          date: interaction.date,
          notes: interaction.notes
        }]);
      
      if (error) throw error;
      
      await loadData();
    } catch (error) {
      console.error('Error saving interaction:', error);
      alert('Error saving interaction. Please try again.');
    }
  };

  const saveTask = async (task) => {
    try {
      if (task.id) {
        // Update
        const { error } = await supabase
          .from('tasks')
          .update({
            sponsor_id: task.sponsorId || task.sponsor_id,
            description: task.description,
            due_date: task.dueDate || task.due_date,
            priority: task.priority,
            completed: task.completed
          })
          .eq('id', task.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('tasks')
          .insert([{
            sponsor_id: task.sponsorId,
            description: task.description,
            due_date: task.dueDate,
            priority: task.priority,
            completed: task.completed || false
          }]);
        
        if (error) throw error;
      }
      
      await loadData();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error saving task. Please try again.');
    }
  };

  const saveTeamInfo = async (info) => {
    try {
      const { data: existing } = await supabase
        .from('team_info')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        // Update
        const { error } = await supabase
          .from('team_info')
          .update({
            season_year: info.season_year || info.seasonYear,
            new_tech: info.new_tech || info.newTech,
            team_changes: info.team_changes || info.teamChanges,
            goals: info.goals,
            last_season_achievements: info.last_season_achievements || info.lastSeasonAchievements,
            last_season_story: info.last_season_story || info.lastSeasonStory
          })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('team_info')
          .insert([{
            season_year: info.season_year || info.seasonYear,
            new_tech: info.new_tech || info.newTech,
            team_changes: info.team_changes || info.teamChanges,
            goals: info.goals,
            last_season_achievements: info.last_season_achievements || info.lastSeasonAchievements,
            last_season_story: info.last_season_story || info.lastSeasonStory
          }]);
        
        if (error) throw error;
      }
      
      await loadData();
    } catch (error) {
      console.error('Error saving team info:', error);
      alert('Error saving team info. Please try again.');
    }
  };

  // Filter sponsors
  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sponsor.contact_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sponsor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats for dashboard
  const stats = {
    totalSponsors: sponsors.length,
    activeSponsors: sponsors.filter(s => s.status === 'active-sponsor').length,
    prospects: sponsors.filter(s => s.type === 'new-prospect').length,
    upcomingTasks: tasks.filter(t => !t.completed).length
  };

  const statusOptions = [
    { value: 'research', label: 'Research Phase', color: 'bg-gray-500' },
    { value: 'ready', label: 'Ready to Contact', color: 'bg-blue-500' },
    { value: 'email-sent', label: 'Email Sent', color: 'bg-yellow-500' },
    { value: 'meeting-scheduled', label: 'Meeting Scheduled', color: 'bg-purple-500' },
    { value: 'follow-up', label: 'Follow-up Needed', color: 'bg-orange-500' },
    { value: 'active-sponsor', label: 'Active Sponsor', color: 'bg-green-500' },
    { value: 'pending', label: 'Pending', color: 'bg-indigo-500' },
    { value: 'declined', label: 'Declined', color: 'bg-red-500' },
    { value: 'no-response', label: 'No Response', color: 'bg-gray-400' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading SponsorOps...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-orange-500/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-outfit">
                  SponsorOps
                </h1>
                <p className="text-xs text-blue-300">FRC Sponsor Management</p>
              </div>
            </div>
            <nav className="flex gap-2">
              {[
                { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
                { id: 'sponsors', icon: Building2, label: 'Sponsors' },
                { id: 'tasks', icon: CheckCircle2, label: 'Tasks' },
                { id: 'team-info', icon: Award, label: 'Team Info' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    view === item.id
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                      : 'text-blue-200 hover:bg-slate-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <DashboardView
            stats={stats}
            sponsors={sponsors}
            tasks={tasks}
            onAddSponsor={() => {
              setShowAddSponsor(true);
              setSelectedSponsor(null);
            }}
            onSelectSponsor={(sponsor) => {
              setSelectedSponsor(sponsor);
              setView('sponsors');
            }}
            onUpdateTask={saveTask}
            statusOptions={statusOptions}
          />
        )}

        {/* Sponsors View */}
        {view === 'sponsors' && (
          <SponsorsView
            sponsors={filteredSponsors}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            statusOptions={statusOptions}
            onAddSponsor={() => {
              setShowAddSponsor(true);
              setSelectedSponsor(null);
            }}
            onSelectSponsor={setSelectedSponsor}
          />
        )}

        {/* Tasks View */}
        {view === 'tasks' && (
          <TasksView
            tasks={tasks}
            sponsors={sponsors}
            onAddTask={() => setShowAddTask(true)}
            onUpdateTask={saveTask}
            onDeleteTask={async (id) => {
              if (confirm('Delete this task?')) {
                await supabase.from('tasks').delete().eq('id', id);
                await loadData();
              }
            }}
          />
        )}

        {/* Team Info View */}
        {view === 'team-info' && teamInfo && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Team Information</h2>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 max-w-3xl">
              <TeamInfoForm teamInfo={teamInfo} onSave={saveTeamInfo} />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddSponsor && (
        <SponsorModal
          sponsor={selectedSponsor}
          onClose={() => {
            setShowAddSponsor(false);
            setSelectedSponsor(null);
          }}
          onSave={saveSponsor}
          statusOptions={statusOptions}
        />
      )}

      {selectedSponsor && !showAddSponsor && (
        <SponsorDetailModal
          sponsor={selectedSponsor}
          interactions={interactions.filter(i => i.sponsor_id === selectedSponsor.id)}
          tasks={tasks.filter(t => t.sponsor_id === selectedSponsor.id)}
          onClose={() => setSelectedSponsor(null)}
          onEdit={() => setShowAddSponsor(true)}
          onDelete={() => deleteSponsor(selectedSponsor.id)}
          onAddInteraction={() => setShowAddInteraction(true)}
          statusOptions={statusOptions}
        />
      )}

      {showAddTask && (
        <TaskModal
          sponsors={sponsors}
          onClose={() => setShowAddTask(false)}
          onSave={saveTask}
        />
      )}

      {showAddInteraction && selectedSponsor && (
        <InteractionModal
          sponsor={selectedSponsor}
          onClose={() => setShowAddInteraction(false)}
          onSave={saveInteraction}
        />
      )}
    </div>
  );
}

// Dashboard View Component
function DashboardView({ stats, sponsors, tasks, onAddSponsor, onSelectSponsor, onUpdateTask, statusOptions }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <button
          onClick={onAddSponsor}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Sponsor
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sponsors', value: stats.totalSponsors, icon: Building2, color: 'from-blue-500 to-blue-600' },
          { label: 'Active Sponsors', value: stats.activeSponsors, icon: Star, color: 'from-green-500 to-green-600' },
          { label: 'Prospects', value: stats.prospects, icon: Target, color: 'from-purple-500 to-purple-600' },
          { label: 'Upcoming Tasks', value: stats.upcomingTasks, icon: Bell, color: 'from-orange-500 to-red-600' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-blue-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sponsors */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Recent Sponsors
          </h3>
          <div className="space-y-3">
            {sponsors.slice(0, 5).map(sponsor => (
              <div
                key={sponsor.id}
                onClick={() => onSelectSponsor(sponsor)}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/80 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{sponsor.name}</div>
                    <div className="text-xs text-blue-300">{sponsor.contact_name}</div>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs text-white ${
                  statusOptions.find(s => s.value === sponsor.status)?.color || 'bg-gray-500'
                }`}>
                  {statusOptions.find(s => s.value === sponsor.status)?.label || sponsor.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            {tasks.filter(t => !t.completed).slice(0, 5).map(task => {
              const sponsor = sponsors.find(s => s.id === task.sponsor_id);
              return (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={async () => {
                      await onUpdateTask({ ...task, completed: !task.completed });
                    }}
                    className="mt-1 w-4 h-4 rounded border-slate-600 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{task.description}</div>
                    {sponsor && (
                      <div className="text-xs text-blue-300 mt-1">{sponsor.name}</div>
                    )}
                    <div className="text-xs text-slate-400 mt-1">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
            {tasks.filter(t => !t.completed).length === 0 && (
              <div className="text-center text-slate-400 py-8">No upcoming tasks</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sponsors View Component
function SponsorsView({ sponsors, searchQuery, setSearchQuery, statusFilter, setStatusFilter, statusOptions, onAddSponsor, onSelectSponsor }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Sponsors</h2>
        <button
          onClick={onAddSponsor}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Sponsor
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search sponsors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sponsors.map(sponsor => (
          <div
            key={sponsor.id}
            onClick={() => onSelectSponsor(sponsor)}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-orange-500/50 cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{sponsor.name}</h3>
                  <div className="text-sm text-blue-300">{sponsor.industry}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Users className="w-4 h-4 text-slate-400" />
                {sponsor.contact_name} - {sponsor.contact_title}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Mail className="w-4 h-4 text-slate-400" />
                {sponsor.email}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 rounded-full text-xs text-white ${
                statusOptions.find(s => s.value === sponsor.status)?.color || 'bg-gray-500'
              }`}>
                {statusOptions.find(s => s.value === sponsor.status)?.label || sponsor.status}
              </div>
              <ChevronRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {sponsors.length === 0 && (
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No sponsors found</h3>
          <p className="text-slate-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

// Tasks View Component
function TasksView({ tasks, sponsors, onAddTask, onUpdateTask, onDeleteTask }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Tasks & Reminders</h2>
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">Active Tasks</h3>
          <div className="space-y-3">
            {tasks.filter(t => !t.completed).map(task => {
              const sponsor = sponsors.find(s => s.id === task.sponsor_id);
              return (
                <div key={task.id} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={async () => {
                      await onUpdateTask({ ...task, completed: !task.completed });
                    }}
                    className="mt-1 w-5 h-5 rounded border-slate-600 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1">{task.description}</div>
                    {sponsor && (
                      <div className="text-sm text-blue-300 mb-1">{sponsor.name}</div>
                    )}
                    <div className="text-xs text-slate-400">
                      Due: {new Date(task.due_date).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {tasks.filter(t => !t.completed).length === 0 && (
              <div className="text-center text-slate-400 py-8">No active tasks</div>
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">Completed</h3>
          <div className="space-y-3">
            {tasks.filter(t => t.completed).map(task => {
              const sponsor = sponsors.find(s => s.id === task.sponsor_id);
              return (
                <div key={task.id} className="flex items-start gap-3 p-4 bg-slate-900/50 rounded-lg opacity-60">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={async () => {
                      await onUpdateTask({ ...task, completed: !task.completed });
                    }}
                    className="mt-1 w-5 h-5 rounded border-slate-600 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1 line-through">{task.description}</div>
                    {sponsor && (
                      <div className="text-sm text-blue-300 mb-1">{sponsor.name}</div>
                    )}
                  </div>
                </div>
              );
            })}
            {tasks.filter(t => t.completed).length === 0 && (
              <div className="text-center text-slate-400 py-8">No completed tasks</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
