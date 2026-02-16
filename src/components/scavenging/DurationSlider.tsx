import { useMemo } from 'react';

interface Props {
  value: number; // Minuutteina
  onChange: (val: number) => void;
}

// Määritellään sallitut askeleet: 1min (testi), 10min, 30min, 1h, ... 12h
const TIME_STEPS = [1, 10, 30, 60, 120, 240, 360, 480, 720];

export default function DurationSlider({ value, onChange }: Props) {
  
  // Etsitään lähin indeksi sliderille
  const sliderIndex = useMemo(() => {
    return TIME_STEPS.indexOf(value) !== -1 ? TIME_STEPS.indexOf(value) : 0;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value);
    onChange(TIME_STEPS[newIndex]);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = minutes / 60;
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
      <div className="flex justify-between mb-2">
        <span className="text-xs uppercase text-slate-500 font-bold">Duration</span>
        <span className="text-sm font-bold text-emerald-400">{formatTime(value)}</span>
      </div>
      
      <input 
        type="range"
        min="0"
        max={TIME_STEPS.length - 1}
        step="1"
        value={sliderIndex}
        onChange={handleChange}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      
      <div className="flex justify-between mt-2 text-[10px] text-slate-600">
        <span>1m</span>
        <span>12h</span>
      </div>
    </div>
  );
}