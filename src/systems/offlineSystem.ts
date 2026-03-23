import { processCombatTick } from "./combatSystem";
import { calculateXpGain, getSpeedMultiplier } from "../utils/gameUtils";
import { GAME_DATA } from "../data";
import type { GameState, SkillType, Resource, Ingredient } from "../types";

export interface OfflineSummary {
  seconds: number;
  xpGained: Partial<Record<SkillType, number>>;
  itemsGained: Record<string, number>;
}

export const calculateOfflineProgress = (
  initialState: GameState,
  elapsedSeconds: number,
): { updatedState: GameState; summary: OfflineSummary } => {
  // --- UUSI LASKENTA: Offline aikaraja ---
  const baseOfflineHours = 12; // Perusaika on 12 tuntia
  const extraOfflineHours = initialState.maxOfflineHoursIncrement || 0; // Luetaan ostettu lisäaika statesta
  const maxSeconds = (baseOfflineHours + extraOfflineHours) * 3600; // Muutetaan tunnit sekunneiksi

  // Rajoitetaan pelaajan poissaoloaika maksimiaikaan
  let remainingSeconds = Math.min(elapsedSeconds, maxSeconds);
  const simulatedSeconds = remainingSeconds;

  const currentState: GameState = JSON.parse(JSON.stringify(initialState));

  // TURVA: Varmistetaan että queue on olemassa (estää vanhojen testien ja savejen kaatumisen)
  currentState.queue = currentState.queue || [];

  const summary: OfflineSummary = {
    seconds: simulatedSeconds,
    xpGained: {},
    itemsGained: {},
  };

  if (!currentState.activeAction && currentState.queue.length === 0) {
    return { updatedState: currentState, summary };
  }

  // =====================================================================
  // SKENAARIO 1: JONON KÄSITTELY (Pelaaja on jonottanut asioita)
  // =====================================================================
  if (currentState.queue.length > 0) {
    while (remainingSeconds > 0 && currentState.queue.length > 0) {
      const currentItem = currentState.queue[0];
      const skillData = GAME_DATA[currentItem.skill as keyof typeof GAME_DATA];
      const resource = skillData?.find(
        (r: Resource) => r.id === currentItem.resourceId,
      );

      if (!resource) {
        currentState.queue.shift(); // Viallinen item, siirrytään seuraavaan
        continue;
      }

      // --- MATERIAALITARKISTUS ---
      let maxByMaterials = Infinity;
      if (resource.inputs && resource.inputs.length > 0) {
        resource.inputs.forEach((input: Ingredient) => {
          const available = currentState.inventory[input.id] || 0;
          const possibleWithThisInput = Math.floor(available / input.count);
          maxByMaterials = Math.min(maxByMaterials, possibleWithThisInput);
        });
      }

      if (maxByMaterials === 0 && resource.inputs) {
        // Materiaalit loppu, tätä ei voi tehdä enää yhtään.
        // Pysäytetään jono tähän (ei poisteta, jotta pelaaja näkee mihin se jäi).
        break;
      }

      const speedMult = getSpeedMultiplier(
        currentItem.skill,
        currentState.upgrades,
      );
      const intervalSeconds = (resource.interval || 3000) / speedMult / 1000;

      const todoCount = currentItem.amount - currentItem.completed;
      const possibleByTime = Math.floor(remainingSeconds / intervalSeconds);

      // Valmistetaan niin monta kuin aika JA materiaalit sallivat
      const actualCompletions = Math.min(
        todoCount,
        possibleByTime,
        maxByMaterials,
      );

      if (actualCompletions > 0) {
        // 1. KULUTETAAN MATERIAALIT
        if (resource.inputs) {
          resource.inputs.forEach((input: Ingredient) => {
            currentState.inventory[input.id] -= input.count * actualCompletions;
          });
        }

        const xpReward = actualCompletions * (resource.xpReward || 0);
        const skillId = currentItem.skill;

        // 2. Päivitetään XP
        const sd = currentState.skills[skillId];
        currentState.skills[skillId] = calculateXpGain(
          sd.level,
          sd.xp,
          xpReward,
        );
        summary.xpGained[skillId] = (summary.xpGained[skillId] || 0) + xpReward;

        // 3. Päivitetään Tavarat (tuotokset)
        currentState.inventory[resource.id] =
          (currentState.inventory[resource.id] || 0) + actualCompletions;
        summary.itemsGained[resource.id] =
          (summary.itemsGained[resource.id] || 0) + actualCompletions;

        // 4. Kulutetaan aika
        remainingSeconds -= actualCompletions * intervalSeconds;
        currentItem.completed += actualCompletions;
      }

      // Jos tehtävä tuli täyteen, poistetaan se
      if (currentItem.completed >= currentItem.amount) {
        currentState.queue.shift();
      } else {
        break; // Aika tai materiaalit loppui kesken
      }
    }

    // Synkronoidaan activeAction uuden jonon tilan mukaiseksi
    if (currentState.queue.length > 0) {
      const next = currentState.queue[0];
      const skillData = GAME_DATA[next.skill as keyof typeof GAME_DATA];
      const res = skillData?.find((r: Resource) => r.id === next.resourceId);
      const speedMult = getSpeedMultiplier(next.skill, currentState.upgrades);

      currentState.activeAction = {
        skill: next.skill,
        resourceId: next.resourceId,
        progress: 0,
        targetTime: (res?.interval || 3000) / speedMult,
      };
    } else {
      currentState.activeAction = null;
    }
  }
  // =====================================================================
  // SKENAARIO 2: LOPUTON TOIMINTO (Pelaaja painoi "START", ei käyttänyt jonoa)
  // =====================================================================
  else if (currentState.activeAction) {
    const { skill, resourceId } = currentState.activeAction;

    if (skill !== "combat") {
      const skillData = GAME_DATA[skill as keyof typeof GAME_DATA];
      const resource = skillData?.find((r: Resource) => r.id === resourceId);

      if (resource) {
        const speedMult = getSpeedMultiplier(
          skill as SkillType,
          currentState.upgrades,
        );
        const intervalSeconds = (resource.interval || 3000) / speedMult / 1000;
        const completions = Math.floor(remainingSeconds / intervalSeconds);

        if (completions > 0) {
          const totalXpReward = completions * (resource.xpReward || 0);
          const sd = currentState.skills[skill as SkillType];

          currentState.skills[skill as SkillType] = calculateXpGain(
            sd.level,
            sd.xp,
            totalXpReward,
          );
          currentState.inventory[resource.id] =
            (currentState.inventory[resource.id] || 0) + completions;

          summary.xpGained[skill as SkillType] = totalXpReward;
          summary.itemsGained[resource.id] = completions;
        }
      }
    } else {
      // COMBAT SIMULAATIO
      const xpAtStart = { ...initialState.skills };
      for (let i = 0; i < remainingSeconds; i++) {
        if (!currentState.activeAction) break;
        const updates = processCombatTick(currentState, 1000);
        Object.assign(currentState, updates);

        if (updates.combatStats)
          currentState.combatStats = {
            ...currentState.combatStats,
            ...updates.combatStats,
          };
        if (updates.inventory)
          currentState.inventory = {
            ...currentState.inventory,
            ...updates.inventory,
          };
        if (updates.skills)
          currentState.skills = { ...currentState.skills, ...updates.skills };
      }

      summary.xpGained = calculateXpDifference(xpAtStart, currentState.skills);
      summary.itemsGained = calculateItemDifference(
        initialState.inventory,
        currentState.inventory,
      );
    }
  }

  currentState.lastTimestamp = Date.now();
  return { updatedState: currentState, summary };
};

// Apufunktiot
function calculateXpDifference(
  oldSkills: GameState["skills"],
  newSkills: GameState["skills"],
) {
  const diff: Partial<Record<SkillType, number>> = {};
  (Object.keys(oldSkills) as SkillType[]).forEach((skillId) => {
    const xpDiff = newSkills[skillId].xp - oldSkills[skillId].xp;
    if (xpDiff > 0) diff[skillId] = xpDiff;
  });
  return diff;
}

function calculateItemDifference(
  oldInv: GameState["inventory"],
  newInv: GameState["inventory"],
) {
  const diff: Record<string, number> = {};
  for (const itemId in newInv) {
    const countDiff = (newInv[itemId] || 0) - (oldInv[itemId] || 0);
    if (countDiff > 0) diff[itemId] = countDiff;
  }
  return diff;
}
