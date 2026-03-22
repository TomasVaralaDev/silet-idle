import { useMemo } from "react";

interface Props {
  value: number; // Minuutteina
  onChange: (val: number) => void;
}

const TIME_STEPS = [1, 10, 30, 60, 120, 240, 360, 480, 720];

export default function DurationSlider({ value, onChange }: Props) {
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
    return `${hours} hr${hours > 1 ? "s" : ""}`;
  };

  return (
    <div className="bg-app-base border border-border rounded-sm p-3">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] uppercase text-tx-muted font-bold tracking-widest">
          Duration
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest text-success bg-success/10 px-2 py-0.5 rounded-sm border border-success/20">
          {formatTime(value)}
        </span>
      </div>

      <input
        type="range"
        min="0"
        max={TIME_STEPS.length - 1}
        step="1"
        value={sliderIndex}
        onChange={handleChange}
        className="w-full h-1 bg-border rounded-none appearance-none cursor-pointer accent-success outline-none"
      />

      <div className="flex justify-between mt-2 text-[9px] text-tx-muted/60 font-mono font-bold">
        <span>1m</span>
        <span>12h</span>
      </div>
    </div>
  );
}
