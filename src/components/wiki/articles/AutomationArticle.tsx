export default function AutomationArticle() {
  return (
    <div className="animate-in fade-in duration-500 space-y-12 text-left font-sans max-w-2xl mx-auto">
      {/* HEADER - RPG-henkinen ja asiallinen */}
      <header className="border-b border-border pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-border text-tx-main text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">
            Chapter 02
          </span>
        </div>
        <h2 className="text-3xl font-bold text-tx-main uppercase tracking-tight">
          The Automatic Queue
        </h2>
        <p className="text-tx-muted text-sm leading-relaxed mt-4">
          Efficiency is the mark of a seasoned adventurer. By mastering the
          Action Queue, you can ensure your character continues to gather,
          craft, and progress even while you are resting at the tavern.
        </p>
      </header>

      {/* THE ACTION QUEUE - RPG-termit */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="./assets/ui/icon_equipment.png"
            alt="Queue"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Task Sequencing
          </h3>
        </div>
        <p className="text-xs text-tx-muted leading-relaxed">
          The queue system allows you to string together multiple actions. Once
          a target quantity is reached, your character automatically moves to
          the next task without requiring manual input.
        </p>

        {/* Example Queue - Simuloitu UI-elementti */}
        <div className="border border-border rounded-lg overflow-hidden max-w-md bg-panel/5">
          <div className="bg-panel/10 p-2 border-b border-border flex justify-between items-center">
            <span className="text-[9px] font-bold text-tx-muted uppercase tracking-widest pl-2">
              Active Sequence
            </span>
            <div className="flex items-center gap-2 pr-2">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
              <span className="text-[9px] font-bold text-success uppercase">
                Working
              </span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center text-[11px] bg-panel/20 p-2.5 rounded border border-border">
              <div className="flex items-center gap-3">
                <img
                  src="./assets/resources/tree/pine_log.png"
                  alt="Log"
                  className="w-4 h-4 pixelated"
                />
                <span className="text-tx-main font-medium">
                  01. Chop Pine Logs
                </span>
              </div>
              <span className="text-tx-muted font-mono">99 / 100</span>
            </div>
            <div className="flex justify-between items-center text-[11px] p-2.5 rounded border border-border/50 opacity-60">
              <div className="flex items-center gap-3">
                <img
                  src="./assets/resources/tree/pine_plank.png"
                  alt="Plank"
                  className="w-4 h-4 pixelated grayscale"
                />
                <span className="text-tx-main">02. Craft Pine Planks</span>
              </div>
              <span className="text-tx-muted font-mono">0 / 50</span>
            </div>
          </div>
        </div>
      </section>

      {/* OFFLINE PROGRESSION - Scifi vaihdettu fantasiaan */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <img
            src="./assets/items/timeCrystal.png"
            alt="Offline"
            className="w-5 h-5 pixelated opacity-80"
          />
          <h3 className="text-lg font-bold text-tx-main uppercase tracking-wider">
            Offline Progression
          </h3>
        </div>

        <div className="bg-panel/5 border border-border p-6 rounded-lg space-y-4">
          <h4 className="text-xs font-bold text-tx-main uppercase tracking-widest">
            Continuous Journey
          </h4>
          <p className="text-xs text-tx-muted leading-relaxed">
            Your journey doesn't stop when you close the game. Your character
            will faithfully continue performing the current task and any queued
            actions while you are away. They will only stop if they run out of
            required resources or finish the entire list.
          </p>

          <div className="p-4 bg-panel/10 border-l border-border mt-2">
            <p className="text-xs text-tx-muted leading-relaxed">
              Upon your return, an{" "}
              <span className="text-tx-main font-bold">Offline Summary</span>{" "}
              will greet you, detailing all materials gathered, items crafted,
              and experience gained during your absence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
