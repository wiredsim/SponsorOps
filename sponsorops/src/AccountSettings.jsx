import React, { useState } from 'react';
import { X, Lock, Check, AlertCircle, Eye, EyeOff, User, Mail } from 'lucide-react';
import { useAuth } from './AuthContext';

export function AccountSettings({ onClose }) {
  const { user, updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Validation
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const { error: updateError } = await updatePassword(newPassword);

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage('Password set successfully! You can now sign in with your email and password.');
      setNewPassword('');
      setConfirmPassword('');
    }

    setLoading(false);
  };

  // Check if user signed up with password or magic link/OAuth
  const hasPasswordProvider = user?.app_metadata?.providers?.includes('email');
  const authMethod = user?.app_metadata?.provider || 'email';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            Account Settings
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Account Info */}
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-white">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">Sign-in Method</p>
                <p className="text-white capitalize">
                  {authMethod === 'email' ? (hasPasswordProvider ? 'Email & Password' : 'Magic Link') : authMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Set/Change Password */}
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-1 flex items-center gap-2">
                <Lock className="w-4 h-4 text-orange-500" />
                {hasPasswordProvider ? 'Change Password' : 'Set Up Password'}
              </h4>
              <p className="text-sm text-slate-400 mb-4">
                {hasPasswordProvider
                  ? 'Update your password for email sign-in.'
                  : 'Add a password so you can sign in with email & password instead of magic links.'}
              </p>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {message && (
              <div className="flex items-center gap-2 text-green-400 text-sm bg-green-500/10 p-3 rounded-lg">
                <Check className="w-4 h-4 flex-shrink-0" />
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (hasPasswordProvider ? 'Update Password' : 'Set Password')}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
