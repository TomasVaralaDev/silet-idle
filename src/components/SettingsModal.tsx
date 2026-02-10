import { useState } from 'react';
import type { GameSettings } from '../types';

interface SettingsModalProps {
  settings: GameSettings;
  username: string;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
  onForceSave: () => void;
  onReset: () => void;
  onLogout: () => void;
}

// --- APUKOMPONENTTI SIIRRETTY TÄNNE ULKOPUOLELLE ---
const ToggleSwitch = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors">
    <span className="text-sm font-bold text-slate-300 uppercase tracking-wide">{label}</span>
    <button 
      onClick={onClick}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 border ${active ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-800 border-slate-600'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200 ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

export default function SettingsModal({ 
  settings, 
  username, 
  onUpdateSettings, 
  onClose, 
  onForceSave,
  onReset,
  onLogout
}: SettingsModalProps) {

  const [activeTab, setActiveTab] = useState<'general' | 'audio' | 'account'>('general');

  const toggleSetting = (key: keyof GameSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key]
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-950 border-2 border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[80vh]">
        
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center">
              <span className="text-xl">⚙️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 uppercase tracking-widest">System Config</h2>
              <p className="text-[10px] text-cyan-500 font-mono">TERMINAL_ID: {username}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-2xl leading-none">&times;</button>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* SIDEBAR TABS */}
          <div className="w-1/3 bg-slate-900/30 border-r border-slate-800 p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('general')}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${activeTab === 'general' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
            >
              General
            </button>
            <button 
              onClick={() => setActiveTab('audio')}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${activeTab === 'audio' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
            >
              Audio & Visuals
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                ${activeTab === 'account' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
            >
              Account & Data
            </button>
          </div>

          {/* MAIN PANEL */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2 mb-4">Interface</h3>
                <ToggleSwitch label="Notifications" active={settings.notifications} onClick={() => toggleSetting('notifications')} />
                
                <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg mt-4">
                  <p className="text-xs text-blue-200">
                    <span className="font-bold block mb-1">ℹ️ Game Info</span>
                    Version: Alpha 1.0.4<br/>
                    Server: EU-West (Simulated)
                  </p>
                </div>
              </div>
            )}

            {/* AUDIO TAB */}
            {activeTab === 'audio' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2 mb-4">Audio</h3>
                <ToggleSwitch label="Master Sound" active={settings.sound} onClick={() => toggleSetting('sound')} />
                <ToggleSwitch label="Music" active={settings.music} onClick={() => toggleSetting('music')} />
                
                <h3 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2 mb-4 mt-8">Performance</h3>
                <ToggleSwitch label="Particle Effects" active={settings.particles} onClick={() => toggleSetting('particles')} />
              </div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2 mb-4">Data Management</h3>
                  <div className="grid gap-3">
                    <button onClick={onForceSave} className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-xs font-bold text-emerald-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                      <span>💾</span> Force Cloud Save
                    </button>
                    
                    <button 
                      onClick={() => { if(confirm("Are you sure? This will wipe all progress.")) onReset(); }}
                      className="w-full py-3 bg-red-950/20 hover:bg-red-950/40 border border-red-900/50 rounded text-xs font-bold text-red-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                    >
                      <span>⚠️</span> Hard Reset Data
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase border-b border-slate-800 pb-2 mb-4">Session</h3>
                  <button onClick={onLogout} className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300 uppercase tracking-widest transition-colors">
                    Sign Out
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}