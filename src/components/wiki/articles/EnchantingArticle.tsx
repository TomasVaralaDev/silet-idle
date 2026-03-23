import { Sparkles, ScrollText, Skull } from "lucide-react";

export default function EnchantingArticle() {
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-12 text-left relative z-10">
      {/* HEADER */}
      <header className="border-b-2 border-accent/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-accent font-mono text-sm tracking-widest">
            CHAPTER 04
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-tx-main uppercase tracking-tighter drop-shadow-md">
          The Great Forge
        </h2>
        <p className="text-tx-muted text-sm md:text-base leading-relaxed mt-4 max-w-2xl">
          Raw materials can only take you so far. To face the true horrors of
          the realms, you must learn to infuse your equipment with magical
          catalysts.
        </p>
      </header>

      {/* LAWS OF AUGMENTATION */}
      <section>
        <div className="p-6 md:p-10 bg-panel border-2 border-border rounded-3xl relative overflow-hidden shadow-2xl">
          {/* Koristeellinen taustaikoni */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <Sparkles size={250} />
          </div>

          <h3 className="text-xl md:text-2xl font-black uppercase text-accent mb-8 flex items-center gap-3 relative z-10">
            <ScrollText size={24} />
            Laws of Augmentation
          </h3>

          <ul className="space-y-6 relative z-10">
            {/* Rule 1 */}
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-black text-sm">
                I
              </div>
              <div>
                <h4 className="text-tx-main font-bold uppercase tracking-wider text-sm mb-1">
                  The Rule of Power
                </h4>
                <p className="text-sm text-tx-muted leading-relaxed">
                  Every successful enchantment increases the item's base stats
                  by exactly <strong className="text-success">+20%</strong>.
                </p>
              </div>
            </li>

            {/* Rule 2 */}
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-black text-sm">
                II
              </div>
              <div>
                <h4 className="text-tx-main font-bold uppercase tracking-wider text-sm mb-1">
                  The Rule of Limits
                </h4>
                <p className="text-sm text-tx-muted leading-relaxed">
                  The forge can only stabilize mortal equipment up to{" "}
                  <strong className="text-warning">Level +5</strong> before the
                  magic becomes too volatile to contain.
                </p>
              </div>
            </li>

            {/* Rule 3 (Boss Items) */}
            <li className="flex items-start gap-4 p-4 mt-8 bg-danger/10 border border-danger/20 rounded-xl shadow-inner">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center text-danger">
                <Skull size={16} />
              </div>
              <div>
                <h4 className="text-danger font-black uppercase tracking-wider text-sm mb-1">
                  The Ancient Exception
                </h4>
                <p className="text-xs text-danger/80 leading-relaxed uppercase italic font-bold">
                  Ancient artifacts (Boss Drops) cannot be enchanted. Their
                  power is absolute and their magic is already sealed.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
