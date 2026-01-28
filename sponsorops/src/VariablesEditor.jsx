import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, Edit2, Check, X, Lightbulb } from 'lucide-react';

// Pre-defined categories with suggestions
const categoryConfig = {
  past_achievements: {
    title: "With your help, we...",
    subtitle: "Past achievements (for returning sponsors)",
    color: "green",
    suggestions: [
      "Competed at State Championship for the first time",
      "Grew our team to 45 students",
      "Sent 12 students to engineering programs",
      "Won the Innovation in Control Award",
      "Built our first swerve drive robot"
    ]
  },
  future_goals: {
    title: "With your help, we can...",
    subtitle: "Future goals (sponsor asks)",
    color: "blue",
    suggestions: [
      "Fund our Manufacturing Excellence Initiative with advanced CNC equipment",
      "Send students to FIRST Championship in Houston",
      "Expand our outreach to 5 local elementary schools",
      "Upgrade our computer vision and AI capabilities",
      "Start a summer robotics camp for younger students"
    ]
  },
  team_facts: {
    title: "Team Facts",
    subtitle: "Quick stats and facts about your team",
    color: "purple",
    suggestions: [
      "We have 45 students from 3 local high schools",
      "Our team has been competing for 15 years",
      "We've mentored over 200 students since founding",
      "Our alumni work at NASA, SpaceX, and Google",
      "We partner with 5 local manufacturing companies"
    ]
  },
  custom: {
    title: "Custom Variables",
    subtitle: "Your own merge fields for emails",
    color: "orange",
    suggestions: []
  }
};

const colorClasses = {
  green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', badge: 'bg-green-500' },
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', badge: 'bg-blue-500' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500' },
};

function CategorySection({ categoryKey, config, items = [], onUpdate }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newItemKey, setNewItemKey] = useState('');
  const [newItemValue, setNewItemValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const colors = colorClasses[config.color];

  const addItem = (value, key = null) => {
    const newItem = {
      id: Date.now().toString(),
      key: key || `item_${Date.now()}`,
      value: value
    };
    onUpdate([...items, newItem]);
    setNewItemValue('');
    setNewItemKey('');
    setShowAddForm(false);
    setShowSuggestions(false);
  };

  const removeItem = (id) => {
    onUpdate(items.filter(item => item.id !== id));
  };

  const updateItem = (id, newValue) => {
    onUpdate(items.map(item =>
      item.id === id ? { ...item, value: newValue } : item
    ));
    setEditingId(null);
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditValue(item.value);
  };

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`${colors.badge} text-white text-xs px-2 py-1 rounded-full`}>
            {items.length}
          </span>
          <div className="text-left">
            <h4 className={`font-semibold ${colors.text}`}>{config.title}</h4>
            <p className="text-sm text-slate-400">{config.subtitle}</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-3">
          {/* Existing items */}
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-2 bg-slate-900/50 rounded-lg p-3">
              {editingId === item.id ? (
                <>
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm resize-none"
                    rows={2}
                    autoFocus
                  />
                  <button
                    onClick={() => updateItem(item.id, editValue)}
                    className="p-2 text-green-400 hover:bg-green-500/20 rounded"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 text-slate-400 hover:bg-slate-700 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <p className="flex-1 text-white text-sm">{item.value}</p>
                  <button
                    onClick={() => startEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}

          {/* Add new item */}
          {showAddForm ? (
            <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
              {categoryKey === 'custom' && (
                <input
                  type="text"
                  value={newItemKey}
                  onChange={(e) => setNewItemKey(e.target.value.replace(/\s+/g, '_').toLowerCase())}
                  placeholder="Variable name (e.g., robot_name)"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm"
                />
              )}
              <textarea
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                placeholder="Enter value..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white text-sm resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => addItem(newItemValue, categoryKey === 'custom' ? newItemKey : null)}
                  disabled={!newItemValue.trim()}
                  className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  onClick={() => { setShowAddForm(false); setNewItemValue(''); setNewItemKey(''); }}
                  className="px-3 py-1.5 bg-slate-700 text-white text-sm rounded hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddForm(true)}
                className={`flex items-center gap-2 px-3 py-2 ${colors.text} border ${colors.border} rounded-lg text-sm hover:bg-white/5`}
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>

              {config.suggestions.length > 0 && (
                <button
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-400 border border-slate-700 rounded-lg text-sm hover:bg-white/5"
                >
                  <Lightbulb className="w-4 h-4" />
                  Suggestions
                </button>
              )}
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && config.suggestions.length > 0 && (
            <div className="bg-slate-900/30 rounded-lg p-3 space-y-2">
              <p className="text-xs text-slate-500 mb-2">Click to add:</p>
              {config.suggestions
                .filter(s => !items.some(item => item.value === s))
                .map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => addItem(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-300 bg-slate-800/50 rounded hover:bg-slate-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function VariablesEditor({ variables = {}, onChange }) {
  const updateCategory = (categoryKey, items) => {
    onChange({
      ...variables,
      [categoryKey]: items
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(categoryConfig).map(([key, config]) => (
        <CategorySection
          key={key}
          categoryKey={key}
          config={config}
          items={variables[key] || []}
          onUpdate={(items) => updateCategory(key, items)}
        />
      ))}
    </div>
  );
}

export default VariablesEditor;
