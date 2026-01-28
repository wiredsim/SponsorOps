import React, { useState } from 'react';
import { Target, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('signin'); // signin, signup, magic
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const { signInWithPassword, signUp, signInWithMagicLink } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    if (mode !== 'magic' && !password) {
      setStatus('error');
      setErrorMessage('Please enter your password');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setStatus('error');
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    let result;
    if (mode === 'magic') {
      result = await signInWithMagicLink(email);
    } else if (mode === 'signup') {
      result = await signUp(email, password);
    } else {
      result = await signInWithPassword(email, password);
    }

    if (result.error) {
      setStatus('error');
      setErrorMessage(result.error.message);
    } else if (mode === 'magic' || mode === 'signup') {
      setStatus('success');
    }
    // For password signin, auth state change will redirect automatically
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-3 rounded-xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white font-outfit">SponsorOps</h1>
              <p className="text-sm text-blue-300">FRC Sponsor Management</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-xl">
          {status === 'success' ? (
            <div className="text-center py-6">
              <div className="bg-green-500/20 p-4 rounded-full inline-flex mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
              <p className="text-blue-300 mb-4">
                We sent a {mode === 'signup' ? 'confirmation' : 'magic'} link to <span className="text-white font-medium">{email}</span>
              </p>
              <p className="text-sm text-slate-400">
                Click the link in the email to {mode === 'signup' ? 'confirm your account' : 'sign in'}.
              </p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setEmail('');
                  setPassword('');
                }}
                className="mt-6 text-orange-400 hover:text-orange-300 text-sm"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white text-center mb-2">
                {mode === 'signup' ? 'Create account' : 'Welcome back'}
              </h2>
              <p className="text-blue-300 text-center mb-6">
                {mode === 'signup' ? 'Sign up to get started' : 'Sign in to continue'}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@team.org"
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                {mode !== 'magic' && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={mode === 'signup' ? 'Create a password (6+ chars)' : 'Enter your password'}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                        disabled={status === 'loading'}
                      />
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      {mode === 'signup' ? 'Create Account' : mode === 'magic' ? 'Send Magic Link' : 'Sign In'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Mode toggles */}
              <div className="mt-6 space-y-3 text-center text-sm">
                {mode === 'signin' && (
                  <>
                    <p className="text-slate-400">
                      Don't have an account?{' '}
                      <button onClick={() => { setMode('signup'); setStatus('idle'); setErrorMessage(''); }} className="text-orange-400 hover:text-orange-300">
                        Sign up
                      </button>
                    </p>
                    <p className="text-slate-500">
                      <button onClick={() => { setMode('magic'); setStatus('idle'); setErrorMessage(''); }} className="text-slate-400 hover:text-slate-300">
                        Use magic link instead
                      </button>
                    </p>
                  </>
                )}
                {mode === 'signup' && (
                  <p className="text-slate-400">
                    Already have an account?{' '}
                    <button onClick={() => { setMode('signin'); setStatus('idle'); setErrorMessage(''); }} className="text-orange-400 hover:text-orange-300">
                      Sign in
                    </button>
                  </p>
                )}
                {mode === 'magic' && (
                  <p className="text-slate-400">
                    <button onClick={() => { setMode('signin'); setStatus('idle'); setErrorMessage(''); }} className="text-orange-400 hover:text-orange-300">
                      Sign in with password instead
                    </button>
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Built for FRC teams
        </p>
      </div>
    </div>
  );
}
