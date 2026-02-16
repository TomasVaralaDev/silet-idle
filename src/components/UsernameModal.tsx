import { useState } from 'react';

// Määritellään saatavilla olevat avatarit (nämä pitää löytyä assets-kansiosta)
const AVAILABLE_AVATARS = [
  { id: 1, src: '/assets/profilepics/profile_pic_1.png', name: 'Standard' },
  { id: 2, src: '/assets/profilepics/profile_pic_2.png', name: 'Cyber' },
  { id: 3, src: '/assets/profilepics/profile_pic_3.png', name: 'Rogue' },
  { id: 4, src: '/assets/profilepics/profile_pic_4.png', name: 'Mage' },
  { id: 5, src: '/assets/profilepics/profile_pic_5.png', name: 'Warrior' },
  { id: 6, src: '/assets/profilepics/profile_pic_6.png', name: 'Construct' },
];

interface Props {
  onConfirm: (name: string, avatar: string) => void;
  onLogout: () => void;
}

export default function UsernameModal({ onConfirm, onLogout }: Props) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVAILABLE_AVATARS[0].src);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Identity required');
      return;
    }
    if (name.length > 12) {
      setError('Identity too long (max 12 chars)');
      return;
    }
    // Välitetään sekä nimi että valittu kuva
    onConfirm(name.trim(), selectedAvatar);
  };

  return (
    <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md relative overflow-hidden">
      {/* Taustaefekti */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>

      <h2 className="text-2xl font-black uppercase tracking-widest text-center mb-1 text-slate-100">
        Initialize Identity
      </h2>
      <p className="text-center text-slate-500 text-xs font-mono mb-6 uppercase tracking-wider">
        Select your neural interface appearance
      </p>

      {/* AVATAR VALINTA */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {AVAILABLE_AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => setSelectedAvatar(avatar.src)}
            className={`
              relative group rounded-xl overflow-hidden border-2 transition-all duration-200 p-1
              ${selectedAvatar === avatar.src 
                ? 'border-cyan-500 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105' 
                : 'border-slate-800 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-900'
              }
            `}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-900">
              <img 
                src={avatar.src} 
                alt={avatar.name} 
                className={`w-full h-full object-cover pixelated transition-opacity duration-300 ${selectedAvatar === avatar.src ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}
                onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=?&background=0f172a&color=fff'; }}
              />
            </div>
            {selectedAvatar === avatar.src && (
              <div className="absolute inset-0 border-2 border-cyan-500/50 rounded-xl pointer-events-none animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
            Designation (Username)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="Enter Name..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs mt-2 ml-1 font-bold animate-pulse">{error}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 px-4 py-3 bg-slate-800 hover:bg-red-900/20 text-slate-400 hover:text-red-400 font-bold rounded-lg border border-slate-700 hover:border-red-900/50 transition-all uppercase text-xs tracking-wider"
          >
            Abort
          </button>
          <button
            type="submit"
            className="flex-[2] px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg shadow-cyan-900/20 transition-all uppercase text-xs tracking-wider flex items-center justify-center gap-2 group"
          >
            <span>Confirm Identity</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}