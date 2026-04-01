import { useEffect, useState } from "react";
import { useGameStore } from "../store/useGameStore";
import { useTooltipStore } from "../store/useToolTipStore";
import { ChevronRight, HelpCircle } from "lucide-react";
import type { EquipmentSlot } from "../types";

type TriggerType =
  | "manual"
  | "has_item"
  | "has_equipped"
  | "combat_cleared"
  | "expedition_active";

interface TutorialStepData {
  title: string;
  content: string;
  buttonText?: string;
  trigger: TriggerType;
  targetId?: string;
  targetAmount?: number;
  targetSlot?: Exclude<EquipmentSlot, "food">;
  targetItems?: { id: string; amount: number }[];
  targetEquips?: { slot: Exclude<EquipmentSlot, "food">; id: string }[];
  targetLevel?: number;
  highlightElementId?: string;
}

const TUTORIAL_STEPS: TutorialStepData[] = [
  {
    title: "Welcome to the Nexus!",
    content:
      "Your destiny is to defeat the Nexus Lord and reclaim the realms. First, you must master the basics of survival in these wild lands.",
    buttonText: "Let's Go",
    trigger: "manual",
  },
  {
    title: "1. Gathering Materials",
    content:
      "First, we need raw materials. Go to 'Woodcutting' from the sidebar and chop trees until you have at least 2 Pine Logs.",
    trigger: "has_item",
    targetId: "pine_log",
    targetAmount: 2,
    highlightElementId: "nav-woodcutting",
  },
  {
    title: "2. Processing Materials",
    content:
      "Raw wood isn't very useful. Go to 'Crafting' and refine your logs into 2 Pine Planks.",
    trigger: "has_item",
    targetId: "pine_plank",
    targetAmount: 2,
    highlightElementId: "nav-crafting",
  },
  {
    title: "3. Mining for Metal",
    content:
      "Excellent. Now we need metal for weapons. Go to 'Mining' and mine 5 Copper Ores.",
    trigger: "has_item",
    targetId: "ore_copper",
    targetAmount: 5,
    highlightElementId: "nav-mining",
  },
  {
    title: "4. Smelting Metal",
    content:
      "Take your Copper Ore to 'Smithing' and smelt them into 5 Copper Ingots.",
    trigger: "has_item",
    targetId: "ore_copper_smelted",
    targetAmount: 5,
    highlightElementId: "nav-smithing",
  },
  {
    title: "5. Forging a Weapon",
    content:
      "You have the materials! Go to 'Crafting', switch to the Weapons tab, and forge a Bronze Sword.",
    trigger: "has_item",
    targetId: "weapon_sword_bronze",
    targetAmount: 1,
    highlightElementId: "nav-crafting",
  },
  {
    title: "6. Mining for Armor",
    content:
      "A warrior needs protection before fighting. Go back to 'Mining' and gather 18 Copper Ores for a full armor set.",
    trigger: "has_item",
    targetId: "ore_copper",
    targetAmount: 18,
    highlightElementId: "nav-mining",
  },
  {
    title: "7. Smelting for Armor",
    content: "Now smelt those ores into 18 Copper Ingots in 'Smithing'.",
    trigger: "has_item",
    targetId: "ore_copper_smelted",
    targetAmount: 18,
    highlightElementId: "nav-smithing",
  },
  {
    title: "8. Forging Armor",
    content:
      "Stay in 'Smithing', switch to the Armor tab, and forge a Bronze Helm, Bronze Body, and Bronze Legs.",
    trigger: "has_item",
    targetItems: [
      { id: "armor_bronze_helm", amount: 1 },
      { id: "armor_bronze_body", amount: 1 },
      { id: "armor_bronze_legs", amount: 1 },
    ],
    highlightElementId: "nav-smithing",
  },
  {
    title: "9. Equipping Gear",
    content:
      "Armor does no good in your backpack. Go to 'Storage', find your new Sword and Armors, and click 'Equip' on all of them.",
    trigger: "has_equipped",
    targetEquips: [
      { slot: "weapon", id: "weapon_sword_bronze" },
      { slot: "head", id: "armor_bronze_helm" },
      { slot: "body", id: "armor_bronze_body" },
      { slot: "legs", id: "armor_bronze_legs" },
    ],
    highlightElementId: "nav-inventory",
  },
  {
    title: "10. First Blood",
    content:
      "You are fully armed and protected! Navigate to 'Worlds' and defeat your first enemy.",
    trigger: "combat_cleared",
    targetLevel: 1,
    highlightElementId: "nav-combat",
  },
  {
    title: "11. Idle Expeditions",
    content:
      "You survived! You can't be everywhere at once. Go to 'Expeditions' and send out your first troop of scouts.",
    trigger: "expedition_active",
    highlightElementId: "nav-scavenger",
  },
  {
    title: "You're Ready",
    content:
      "Gather, Process, Craft, Equip, and Fight. This is the core loop of Nexus Idle. Here are 5000 Coins to kickstart your journey. Good luck!",
    buttonText: "Finish Tutorial",
    trigger: "manual",
  },
];

export default function TutorialOverlay() {
  const {
    tutorial,
    nextTutorialStep,
    completeTutorial,
    emitEvent,
    inventory,
    equipment,
    combatStats,
    scavenger,
  } = useGameStore();

  const hideTooltip = useTooltipStore((state) => state.hideTooltip);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const currentData = TUTORIAL_STEPS[tutorial?.step];

  // Prevent tooltips from sticking during step transition
  useEffect(() => {
    hideTooltip();
  }, [tutorial?.step, hideTooltip]);

  // Real-time highlight position update and visibility check
  useEffect(() => {
    let animationFrameId: number;

    const updateRect = () => {
      if (!currentData?.highlightElementId || !tutorial?.isActive) {
        setHighlightRect(null);
      } else {
        const el = document.getElementById(currentData.highlightElementId);
        if (el) {
          const rect = el.getBoundingClientRect();

          // Checking if the target element is truly visible and not obscured by headers
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const topEl = document.elementFromPoint(centerX, centerY);

          const isVisible = topEl && (el.contains(topEl) || el === topEl);

          if (isVisible) {
            setHighlightRect((prev) => {
              if (
                !prev ||
                prev.top !== rect.top ||
                prev.left !== rect.left ||
                prev.width !== rect.width ||
                prev.height !== rect.height
              ) {
                return rect;
              }
              return prev;
            });
          } else {
            setHighlightRect(null);
          }
        } else {
          setHighlightRect(null);
        }
      }
      animationFrameId = requestAnimationFrame(updateRect);
    };

    updateRect();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentData?.highlightElementId, tutorial?.isActive]);

  // Logic for progress label display
  const getProgressText = () => {
    if (!currentData) return null;

    if (currentData.trigger === "has_item") {
      if (currentData.targetItems) {
        const total = currentData.targetItems.reduce(
          (acc, req) => acc + req.amount,
          0,
        );
        const current = currentData.targetItems.reduce(
          (acc, req) => acc + Math.min(inventory[req.id] || 0, req.amount),
          0,
        );
        return `${current} / ${total}`;
      } else if (currentData.targetId) {
        const current = Math.min(
          inventory[currentData.targetId] || 0,
          currentData.targetAmount || 1,
        );
        return `${current} / ${currentData.targetAmount || 1}`;
      }
    }

    if (currentData.trigger === "has_equipped") {
      if (currentData.targetEquips) {
        const total = currentData.targetEquips.length;
        const current = currentData.targetEquips.reduce(
          (acc, req) => acc + (equipment[req.slot] === req.id ? 1 : 0),
          0,
        );
        return `${current} / ${total}`;
      } else if (currentData.targetSlot && currentData.targetId) {
        const isEquipped =
          equipment[currentData.targetSlot] === currentData.targetId;
        return `${isEquipped ? 1 : 0} / 1`;
      }
    }

    return null;
  };

  // Auto-advance trigger logic
  useEffect(() => {
    if (!tutorial?.isActive || tutorial?.isComplete || !currentData) return;

    let shouldAdvance = false;

    switch (currentData.trigger) {
      case "has_item":
        if (currentData.targetItems) {
          shouldAdvance = currentData.targetItems.every(
            (req) => (inventory[req.id] || 0) >= req.amount,
          );
        } else if (currentData.targetId) {
          shouldAdvance =
            (inventory[currentData.targetId] || 0) >=
            (currentData.targetAmount || 1);
        }
        break;
      case "has_equipped":
        if (currentData.targetEquips) {
          shouldAdvance = currentData.targetEquips.every(
            (req) => equipment[req.slot] === req.id,
          );
        } else if (currentData.targetSlot && currentData.targetId) {
          shouldAdvance =
            equipment[currentData.targetSlot] === currentData.targetId;
        }
        break;
      case "combat_cleared":
        if (
          currentData.targetLevel &&
          combatStats.maxMapCompleted >= currentData.targetLevel
        ) {
          shouldAdvance = true;
        }
        break;
      case "expedition_active":
        if (scavenger.activeExpeditions.length > 0) {
          shouldAdvance = true;
        }
        break;
    }

    if (shouldAdvance) {
      nextTutorialStep();
    }
  }, [
    currentData,
    inventory,
    equipment,
    combatStats,
    scavenger,
    tutorial,
    nextTutorialStep,
  ]);

  const handleFinish = () => {
    completeTutorial();
    emitEvent(
      "success",
      "Tutorial completed! +5000 Coins awarded.",
      "./assets/ui/coins.png",
    );
  };

  if (!tutorial?.isActive || tutorial?.isComplete || !currentData) return null;

  const progressText = getProgressText();

  return (
    <>
      {
        // HIGHLIGHT OVERLAY: Accurate pulsing border around the targeted element
      }
      {highlightRect && (
        <div
          className="fixed z-[150] pointer-events-none"
          style={{
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
          }}
        >
          <div className="absolute inset-0 border-[3px] border-accent rounded-lg animate-pulse shadow-[0_0_15px_rgba(228,54,54,0.6)]" />
        </div>
      )}

      {
        // TUTORIAL WINDOW
      }
      <div className="fixed bottom-6 left-6 md:left-[312px] z-[200] w-[calc(100%-3rem)] md:w-96 pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
        <div className="bg-panel border-2 border-accent p-6 rounded-xl shadow-[0_10px_40px_rgba(228,54,54,0.2)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center text-accent shrink-0">
              <HelpCircle size={18} />
            </div>
            <h3 className="text-tx-main font-black uppercase tracking-widest text-sm leading-tight">
              {currentData.title}
            </h3>
            <div className="ml-auto text-[10px] font-mono text-tx-muted uppercase shrink-0">
              Step {tutorial.step + 1} / {TUTORIAL_STEPS.length}
            </div>
          </div>

          <p className="text-tx-muted/90 text-sm leading-relaxed mb-6 font-medium">
            {currentData.content}
          </p>

          <div className="flex gap-3">
            {currentData.trigger === "manual" ? (
              <button
                onClick={
                  tutorial.step === TUTORIAL_STEPS.length - 1
                    ? handleFinish
                    : nextTutorialStep
                }
                className="flex-1 py-3 bg-accent hover:bg-accent-hover text-white font-black uppercase tracking-widest text-[11px] rounded-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-accent/20"
              >
                {currentData.buttonText} <ChevronRight size={16} />
              </button>
            ) : (
              <div className="flex-1 py-3 bg-app-base text-warning font-black uppercase tracking-widest text-[10px] rounded-sm flex items-center justify-center border border-warning/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-warning/5 animate-pulse" />
                <span className="relative z-10 flex items-center gap-2">
                  Task in progress...
                  {progressText && (
                    <span className="bg-warning/20 text-warning px-1.5 py-0.5 rounded font-mono text-[9px]">
                      {progressText}
                    </span>
                  )}
                </span>
              </div>
            )}

            <button
              onClick={handleFinish}
              className="px-4 py-3 text-tx-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/30 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
