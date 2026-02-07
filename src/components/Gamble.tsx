import { useState } from 'react';

interface GambleProps {
  coins: number;
  onGamble: (amount: number, callback: (isWin: boolean) => void) => void;
}

export default function Gamble({ coins, onGamble }: GambleProps) {
  const [betAmount, setBetAmount] = useState<string>('10');
  const [isSpinning, setIsSpinning] = useState(false);
  const [gambleResult, setGambleResult] = useState<'win' | 'lose' | null>(null);

  const handleSpin = () => {
    const amount = parseInt(betAmount);
    if (isNaN(amount) || amount <= 0 || amount > coins) return;

    setGambleResult(null);
    setIsSpinning(true);

    // Call parent to calculate logic after animation delay simulation
    setTimeout(() => {
        onGamble(amount, (isWin) => {
            setGambleResult(isWin ? 'win' : 'lose');
            setIsSpinning(false);
        });
    }, 1000);
  };

  const setBetPercentage = (percent: number) => {
    const amount = Math.floor(coins * percent);
    setBetAmount(amount.toString());
  };

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
      <header className="mb-8 text-center"><h2 className="text-5xl font-black italic text-pink-500 mb-2 drop-shadow-lg">CASINO</h2><p className="text-slate-400">Double your money or lose it all.</p></header>
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-500/5 to-purple-500/5 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className={`text-9xl mb-8 transition-transform duration-1000 ${isSpinning ? 'animate-flip' : ''}`}>{gambleResult === 'lose' ? '💀' : '🪙'}</div>
            <div className="h-16 mb-4 flex items-center justify-center">
              {isSpinning && <span className="text-yellow-400 font-bold text-xl animate-pulse">FLIPPING...</span>}
              {!isSpinning && gambleResult === 'win' && (<div className="text-center animate-bounce"><p className="text-emerald-400 font-black text-3xl">WIN!</p><p className="text-emerald-200">+{betAmount} coins</p></div>)}
              {!isSpinning && gambleResult === 'lose' && (<div className="text-center"><p className="text-red-500 font-black text-3xl">LOSS...</p><p className="text-red-400">-{betAmount} coins</p></div>)}
              {!isSpinning && !gambleResult && <p className="text-slate-500 italic">Place bet and spin.</p>}
            </div>
            <div className="w-full bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Set Bet</label>
              <div className="flex gap-2 mb-4">
                <input type="number" value={betAmount} onChange={(e) => setBetAmount(e.target.value)} className="flex-1 bg-slate-800 border border-slate-700 text-white p-3 rounded-lg font-mono text-lg focus:outline-none focus:border-pink-500" min="1"/>
                <div className="bg-slate-800 border border-slate-700 text-yellow-400 p-3 rounded-lg font-mono flex items-center">🟡</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button onClick={() => setBetPercentage(0.1)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-xs font-bold">10%</button>
                <button onClick={() => setBetPercentage(0.5)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-xs font-bold">50%</button>
                <button onClick={() => setBetPercentage(1.0)} className="bg-slate-800 hover:bg-slate-700 text-pink-400 py-2 rounded text-xs font-bold border border-pink-900/50">ALL IN</button>
              </div>
              <button onClick={handleSpin} disabled={isSpinning || parseInt(betAmount) > coins || parseInt(betAmount) <= 0} className={`w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest transition-all shadow-lg ${isSpinning ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-500 text-white shadow-pink-900/50 active:scale-95'}`}>{isSpinning ? '...' : 'FLIP COIN'}</button>
            </div>
          </div>
      </div>
    </div>
  );
}