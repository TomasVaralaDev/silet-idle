import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface UsernameModalProps {
  onConfirm: (name: string) => void;
  onLogout: () => void; // <--- UUSI PROP
}

export default function UsernameModal({ onConfirm, onLogout }: UsernameModalProps) {
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const name = inputName.trim();

    // 1. Perusvalidointi
    if (name.length < 3) {
      setError("Username is too short (min 3 chars).");
      setLoading(false);
      return;
    }
    if (name.length > 15) {
      setError("Username is too long (max 15 chars).");
      setLoading(false);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(name)) {
      setError("Only letters, numbers, and underscores allowed.");
      setLoading(false);
      return;
    }
    if (name.toLowerCase() === "player" || name.toLowerCase() === "admin") {
      setError("That name is reserved.");
      setLoading(false);
      return;
    }

    // 2. Tietokantatarkistus
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Username is already taken.");
        setLoading(false);
        return;
      }

      onConfirm(name);
      
    } catch (err) {
      console.error("Error checking username:", err);
      // Jos virhe on permission-tyyppinen, annetaan selkeämpi ohje (dev-vaiheessa)
      // @ts-expect-error: err type unknown
      if (err.code === 'permission-denied') {
         setError("Database permission error. Check Firebase Rules.");
      } else {
         setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-slate-700 shadow-lg">
            <span className="text-4xl animate-pulse">👋</span>
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Welcome, Hero</h2>
          <p className="text-slate-400 text-sm mt-2">Identify yourself to access the system.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block pl-1">Username</label>
            <div className="relative">
              <input 
                type="text" 
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter unique name..."
                className="w-full bg-slate-950 border-2 border-slate-800 text-white rounded-lg px-4 py-3 outline-none focus:border-indigo-500 focus:bg-slate-900 transition-all font-mono"
                disabled={loading}
              />
              {inputName.length > 0 && (
                <span className={`absolute right-3 top-3.5 text-xs font-bold ${inputName.length >= 3 && inputName.length <= 15 ? 'text-green-500' : 'text-red-500'}`}>
                  {inputName.length}/15
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-950/40 border border-red-900/60 text-red-300 text-xs p-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-1">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-2">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3.5 rounded-lg font-bold text-white uppercase tracking-widest shadow-lg transition-all
                ${loading 
                  ? 'bg-slate-700 cursor-wait' 
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/20 active:scale-[0.98]'}`}
            >
              {loading ? 'Checking Availability...' : 'Confirm Identity'}
            </button>

            {/* --- UUSI LOGOUT-NAPPI --- */}
            <button 
              type="button"
              onClick={onLogout}
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-slate-400 text-xs uppercase tracking-widest hover:text-white hover:bg-slate-800 transition-all"
            >
              Wrong Account? Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}