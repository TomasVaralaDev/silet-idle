import { useState } from "react";
import { useGameStore } from "../../store/useGameStore";
import { GAME_DATA } from "../../data/skills";
import { getItemDetails } from "../../data";
import { SKILL_DEFINITIONS } from "../../config/skillDefinitions";
import { getRequiredXpForLevel } from "../../utils/gameUtils";
import { MAX_LEVEL } from "../../utils/skillScaling";
import QuantityModal from "../modals/QuantityModal";
import type { SkillType, Resource } from "../../types";

interface SkillViewProps {
  skill: SkillType;
}

const SKILL_CATEGORIES: Record<
  string,
  { id: string; label: string; filter: (r: Resource) => boolean }[]
> = {
  smithing: [
    { id: "all", label: "All", filter: () => true },
    {
      id: "smelting",
      label: "Smelting",
      filter: (r) => !r.slot && !r.category?.includes("refining"),
    },
    { id: "head", label: "Helmets", filter: (r) => r.slot === "head" },
    { id: "body", label: "Body", filter: (r) => r.slot === "body" },
    { id: "legs", label: "Legs", filter: (r) => r.slot === "legs" },
    { id: "shield", label: "Shields", filter: (r) => r.slot === "shield" },
    { id: "ring", label: "Rings", filter: (r) => r.slot === "ring" },
  ],
  crafting: [
    { id: "all", label: "All", filter: () => true },
    {
      id: "refining",
      label: "Wood Refining",
      filter: (r) => r.category === "plank",
    },
    { id: "swords", label: "Swords", filter: (r) => r.combatStyle === "melee" },
    { id: "bows", label: "Bows", filter: (r) => r.combatStyle === "ranged" },
    {
      id: "necklace",
      label: "Necklaces",
      filter: (r) => r.slot === "necklace",
    },
  ],
};

export default function SkillView({ skill }: SkillViewProps) {
  const {
    skills,
    activeAction,
    inventory,
    setState,
    equipment,
    addToQueue,
    cancelResourceFromQueue,
    queue,
    unlockedQueueSlots,
  } = useGameStore();

  const [activeCategory, setActiveCategory] = useState("all");
  const [showAffordableOnly, setShowAffordableOnly] = useState(false);
  const [prevSkill, setPrevSkill] = useState(skill);

  const [selectedForQueue, setSelectedForQueue] = useState<Resource | null>(
    null,
  );

  if (skill !== prevSkill) {
    setPrevSkill(skill);
    setActiveCategory("all");
  }

  const definition = SKILL_DEFINITIONS.find((d) => d.id === skill);
  const resources = GAME_DATA[skill] || [];

  if (!definition)
    return <div className="p-10 text-danger font-bold">Config missing</div>;

  const skillState = skills[skill] || { level: 1, xp: 0 };
  const currentLevel = skillState.level;

  const isMaxLevel = currentLevel >= MAX_LEVEL;
  const nextLevelXp = isMaxLevel ? 0 : getRequiredXpForLevel(currentLevel);
  const progressPercent = isMaxLevel
    ? 100
    : Math.min(100, Math.max(0, (skillState.xp / (nextLevelXp || 1)) * 100));

  const categories = SKILL_CATEGORIES[skill];

  const filteredResources = resources.filter((resource) => {
    if (categories) {
      const currentFilter = categories.find((c) => c.id === activeCategory);
      if (currentFilter && !currentFilter.filter(resource)) return false;
    }
    if (showAffordableOnly && resource.inputs) {
      const canAfford = resource.inputs.every(
        (input) => (inventory[input.id] || 0) >= input.count,
      );
      if (!canAfford) return false;
    }
    return true;
  });

  const runeDetails = equipment.rune ? getItemDetails(equipment.rune) : null;
  let globalSpeedMultiplier = 1;
  let globalXpMultiplier = 1;

  if (runeDetails?.skillModifiers) {
    const speedKey = `${skill}Speed` as keyof typeof runeDetails.skillModifiers;
    const xpKey = `${skill}Xp` as keyof typeof runeDetails.skillModifiers;
    globalSpeedMultiplier += runeDetails.skillModifiers[speedKey] || 0;
    globalXpMultiplier += runeDetails.skillModifiers[xpKey] || 0;
  }

  const handleStartAction = (resourceId: string, interval: number) => {
    if (activeAction?.resourceId === resourceId) {
      setState({ activeAction: null });
    } else {
      setState({
        activeAction: { skill, resourceId, progress: 0, targetTime: interval },
        queue: [],
      });
    }
  };

  const maxSlots = unlockedQueueSlots;
  const isQueueFull = queue.length >= maxSlots;

  return (
    <div className="h-full flex flex-col bg-app-base text-tx-main relative">
      {/* HEADER - Skaalattu mobiiliin (pienemmät paddigit ja fontit) */}
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex items-center gap-3 md:gap-6 sticky top-0 z-20 backdrop-blur-sm">
        <div
          className={`w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center ${definition.bgColor} shadow-lg shrink-0`}
        >
          <img
            src={definition.icon}
            className="w-8 h-8 md:w-10 md:h-10 pixelated"
            alt={definition.sidebarLabel}
          />
        </div>
        <div className="flex-1 text-left">
          <h1
            className={`text-xl md:text-3xl font-bold uppercase tracking-widest ${definition.color} mb-0.5 md:mb-1`}
          >
            {definition.sidebarLabel}
          </h1>
          <p className="text-tx-muted text-[10px] md:text-sm font-medium hidden sm:block">
            {definition.description}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg md:text-2xl font-black text-tx-main">
            Level {currentLevel}
          </div>
          <div className="text-[9px] md:text-xs font-mono text-tx-muted mt-0.5 md:mt-1">
            {isMaxLevel ? (
              <span className="text-success font-bold">MAX LEVEL</span>
            ) : (
              `${Math.floor(skillState.xp).toLocaleString()} / ${nextLevelXp.toLocaleString()} XP`
            )}
          </div>
        </div>
      </div>

      <div className="h-1 bg-panel w-full shrink-0">
        <div
          className={`h-full ${definition.bgColor} transition-all duration-300 shadow-[0_0_10px_currentColor]`}
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* FILTERIT JA NAPIT - Pinoituu mobiilissa allekkain */}
      <div className="px-4 md:px-6 pt-3 md:pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-border/20 pb-3">
        {/* TABS - Scrollaa sivuttain mobiilissa */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar w-full pb-1 snap-x">
          {categories?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`snap-start shrink-0 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-tx-main text-app-base shadow-sm"
                  : "bg-panel text-tx-muted hover:bg-panel-hover hover:text-tx-main border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* TOGGLE BUTTON - Venyy koko leveyteen mobiilissa */}
        {["smithing", "crafting", "alchemy"].includes(skill) && (
          <button
            onClick={() => setShowAffordableOnly(!showAffordableOnly)}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-black uppercase tracking-tighter transition-all shrink-0 ${
              showAffordableOnly
                ? "bg-success/20 border-success text-success shadow-[0_0_10px_rgba(var(--color-success)/0.2)]"
                : "bg-panel border-border text-tx-muted hover:text-tx-main"
            }`}
          >
            <span className={showAffordableOnly ? "animate-pulse" : ""}>
              🛠️
            </span>
            {showAffordableOnly ? "Showing Affordable" : "Show All Unlocked"}
          </button>
        )}
      </div>

      {/* ESINERUUDUKKO - Skaalattu mobiiliin sm:grid-cols-2 */}
      <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredResources.map((resource) => {
            const isUnlocked = currentLevel >= (resource.level || 1);
            const isActive = activeAction?.resourceId === resource.id;

            const queueCount = queue
              .filter((q) => q.resourceId === resource.id)
              .reduce((sum, item) => sum + (item.amount - item.completed), 0);

            const effectiveInterval =
              (resource.interval || 3000) / globalSpeedMultiplier;
            const effectiveXp = (resource.xpReward || 0) * globalXpMultiplier;
            const progress =
              isActive && activeAction
                ? (activeAction.progress / activeAction.targetTime) * 100
                : 0;

            let canAfford = true;
            if (resource.inputs) {
              canAfford = resource.inputs.every(
                (input) => (inventory[input.id] || 0) >= input.count,
              );
            }
            const hasDrops = resource.drops && resource.drops.length > 0;
            const isDisabled = !isUnlocked || (!canAfford && queueCount === 0);

            return (
              <div
                key={resource.id}
                className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 flex flex-col h-full group ${
                  isActive
                    ? `bg-panel border-accent shadow-[0_0_20px_rgb(var(--color-accent)/0.2)] scale-[1.02] z-10`
                    : !isUnlocked
                      ? "bg-app-base border-panel opacity-50 grayscale"
                      : !canAfford && queueCount === 0
                        ? "bg-panel/60 border-border/50 opacity-90"
                        : "bg-panel/40 border-border hover:border-border-hover hover:bg-panel"
                }`}
              >
                <div className="flex items-start justify-between mb-4 w-full relative">
                  <div
                    className={`min-w-[3.5rem] min-h-[3.5rem] rounded-lg bg-app-base flex flex-wrap items-center justify-center border border-border shrink-0 relative overflow-hidden gap-1 p-1`}
                  >
                    {hasDrops ? (
                      resource.drops!.map((drop, index) => {
                        const itemDetails = getItemDetails(drop.itemId);
                        return (
                          <div
                            key={index}
                            className="relative group/drop"
                            title={`${itemDetails?.name || drop.itemId} (${drop.chance}%)`}
                          >
                            <img
                              src={
                                itemDetails?.icon ||
                                "/assets/ui/icon_missing.png"
                              }
                              className="w-5 h-5 pixelated object-contain"
                              alt={drop.itemId}
                            />
                          </div>
                        );
                      })
                    ) : (
                      <img
                        src={resource.icon}
                        className={`w-10 h-10 pixelated transition-transform duration-500 ${
                          isActive ? "scale-110 rotate-3" : ""
                        }`}
                        alt={resource.name}
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 items-end">
                    {isActive && (
                      <span className="px-2 py-1 rounded bg-success/10 text-success text-[10px] font-bold border border-success/20 animate-pulse">
                        ACTIVE
                      </span>
                    )}
                    {queueCount > 0 && (
                      <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                        {queueCount} IN QUEUE
                      </span>
                    )}
                    {!isUnlocked && (
                      <span className="px-2 py-1 rounded bg-danger/20 text-danger text-[10px] font-bold border border-danger/30">
                        LVL {resource.level}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4 flex-1">
                  <h3
                    className={`font-bold text-sm ${
                      isUnlocked ? "text-tx-main" : "text-tx-muted/60"
                    }`}
                  >
                    {resource.name}
                  </h3>
                  <p className="text-xs text-tx-muted mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                </div>

                {resource.inputs && (
                  <div
                    className={`mb-3 p-2 rounded border shadow-inner transition-colors ${
                      canAfford
                        ? "bg-panel/60 border-accent/20"
                        : "bg-warning/5 border-warning/20"
                    }`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {resource.inputs.map((input) => {
                        const item = getItemDetails(input.id);
                        const have = inventory[input.id] || 0;
                        const hasEnough = have >= input.count;
                        return (
                          <div
                            key={input.id}
                            className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded-md bg-app-base/80 border ${
                              hasEnough
                                ? "border-success/30 text-success"
                                : "border-danger/30 text-danger"
                            }`}
                            title={item?.name || "Unknown Material"}
                          >
                            <img
                              src={item?.icon}
                              className="w-4 h-4 pixelated object-contain"
                              alt=""
                            />
                            <span className="font-mono font-bold">
                              {have}/{input.count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isUnlocked && (
                  <div className="mt-auto pt-3 border-t border-border/50 w-full">
                    <div className="flex gap-2 mb-3">
                      {queueCount > 0 ? (
                        <button
                          onClick={() => cancelResourceFromQueue(resource.id)}
                          className="flex-1 py-1.5 rounded text-[10px] font-black transition-all bg-danger text-white hover:bg-danger/80 tracking-wider"
                        >
                          CANCEL QUEUE
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleStartAction(
                              resource.id,
                              resource.interval || 3000,
                            )
                          }
                          disabled={isDisabled}
                          className={`flex-1 py-1.5 rounded text-xs font-black transition-all ${
                            isActive
                              ? "bg-danger text-white hover:bg-danger/80"
                              : "bg-accent/20 text-accent hover:bg-accent hover:text-app-base border border-accent/30"
                          }`}
                        >
                          {isActive ? "STOP" : "START"}
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedForQueue(resource)}
                        disabled={!isUnlocked || isQueueFull}
                        className={`px-3 py-1.5 rounded text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                          isQueueFull
                            ? "bg-panel border-danger/30 text-danger/50 cursor-not-allowed"
                            : "bg-panel border-border hover:bg-panel-hover text-tx-main"
                        }`}
                        title={isQueueFull ? "Queue Full!" : "Add to Queue"}
                      >
                        {isQueueFull ? (
                          <>
                            <img
                              src="/assets/ui/icon_locked.png"
                              className="w-3.5 h-3.5 pixelated opacity-50"
                              alt=""
                            />
                            <span>FULL</span>
                          </>
                        ) : (
                          "+ QUEUE"
                        )}
                      </button>
                    </div>

                    <div className="flex justify-between items-center text-[10px] mb-1">
                      <span
                        className={`font-bold ${
                          globalXpMultiplier > 1
                            ? "text-success"
                            : "text-tx-muted"
                        }`}
                      >
                        +{effectiveXp.toFixed(1)} XP
                      </span>
                      <span
                        className={`font-bold ${
                          globalSpeedMultiplier > 1
                            ? "text-success"
                            : "text-tx-muted"
                        }`}
                      >
                        {(effectiveInterval / 1000).toFixed(1)}s
                      </span>
                    </div>
                    <div className="w-full h-1 bg-app-base rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          isActive ? definition.bgColor : "bg-transparent"
                        } transition-all duration-100 ease-linear`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedForQueue && !isQueueFull && (
        <QuantityModal
          itemId={selectedForQueue.id}
          title={`Queue: ${selectedForQueue.name}`}
          maxAmount={9999}
          onClose={() => setSelectedForQueue(null)}
          onConfirm={(amount) => {
            addToQueue(skill, selectedForQueue.id, amount);
            setSelectedForQueue(null);
          }}
        />
      )}
    </div>
  );
}
