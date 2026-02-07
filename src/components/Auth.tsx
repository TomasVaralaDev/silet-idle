import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

export default function Auth() {
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
      // Onnistunut kirjautuminen päivittää App.tsx:n tilan automaattisesti
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white relative overflow-hidden">
      {/* Taustakoristeet */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900/20 z-0"></div>
      
      <div className="bg-slate-800 p-10 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700 text-center relative z-10">
        <h1 className="text-4xl font-black italic text-emerald-500 mb-2">MELVOR <span className="text-slate-400 font-light">CLONE</span></h1>
        <p className="text-slate-400 mb-8">Save your progress to the cloud.</p>
        
        {error && <p className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-sm border border-red-500/30">{error}</p>}

        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg"
        >
          {/* Google Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

// Tämä pysyy samana, mutta laitetaan export tähän tiedostoon
export const LogoutButton = () => (
  <button 
    onClick={() => signOut(auth)} 
    className="w-full mt-4 py-2 bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white rounded border border-red-900/30 transition-colors text-xs font-bold uppercase tracking-wider"
  >
    Log Out
  </button>
);