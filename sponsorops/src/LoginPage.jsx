import React, { useState } from 'react';
import { Target, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const { signInWithMagicLink, signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    setStatus('loading');
    setErrorMessage('');
    const { error } = await signInWithGoogle();
    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const { error } = await signInWithMagicLink(email);

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    } else {
      setStatus('success');
    }
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
                We sent a magic link to <span className="text-white font-medium">{email}</span>
              </p>
              <p className="text-sm text-slate-400">
                Click the link in the email to sign in. You can close this tab.
              </p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setEmail('');
                }}
                className="mt-6 text-orange-400 hover:text-orange-300 text-sm"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome back</h2>
              <p className="text-blue-300 text-center mb-6">Sign in with your email to continue</p>

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
                      Sending link...
                    </>
                  ) : (
                    <>
                      Send Magic Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800/50 text-slate-400">or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>

              <p className="text-center text-sm text-slate-400 mt-6">
                No password needed - sign in with Google or email
              </p>
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
