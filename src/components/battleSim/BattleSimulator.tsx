import { useState, useMemo } from "react";
import { useGameStore } from "../../store/useGameStore";
import { COMBAT_DATA } from "../../data/combat";
import { getItemDetails } from "../../data";
import type { CombatStyle } from "../../types";
import {
  calculateHit,
  getPlayerStats,
  getEnemyStats,
} from "../../utils/combatMechanics";

interface SimResult {
  winRate: number;
  avgTimeMs: number;
  avgPotsUsed: number;
  avgPlayerDps: number;
  avgEnemyDps: number;
  avgStrikeDamage: number;
}

const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export default function BattleSimulator() {
  const store = useGameStore();
  const [selectedMapId, setSelectedMapId] = useState<number>(1);
  const [iterations, setIterations] = useState<number>(100);
  const [result, setResult] = useState<SimResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const playerStats = useMemo(() => {
    let weaponDmg = 1;
    let totalArmor = 0;
    let hpBonus = 0;
    let weaponSpeed = 2400;
    let critC = 0;
    let critM = 1.5;
    let combatStyle: CombatStyle = "melee";

    Object.entries(store.equipment).forEach(([slot, itemId]) => {
      if (!itemId) return;
      const item = getItemDetails(itemId);
      if (!item || !item.stats) return;

      if (slot === "weapon") {
        weaponDmg = item.stats.attack || 1;
        weaponSpeed = item.stats.attackSpeed || 2400;
        combatStyle = item.combatStyle || "melee";
      } else {
        weaponDmg += item.stats.attack || 0;
      }

      totalArmor += item.stats.defense || 0;
      hpBonus += item.stats.hpBonus || 0;
      critC += item.stats.critChance || 0;
      critM = Math.max(critM, item.stats.critMulti || 1.5);
    });

    return getPlayerStats(store.skills, combatStyle, {
      damage: weaponDmg,
      armor: totalArmor,
      attackSpeed: weaponSpeed,
      critChance: critC,
      critMulti: critM,
      hpBonus: hpBonus,
    });
  }, [store.equipment, store.skills]);

  const runSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const map = COMBAT_DATA.find((m) => m.id === selectedMapId)!;
      const baseEnemyStats = getEnemyStats({
        level: map.world,
        attack: map.enemyAttack,
        maxHp: map.enemyHp,
        currentHp: map.enemyHp,
      });

      let wins = 0;
      let totalTimeMs = 0;
      let totalPotsUsed = 0;
      let totalDamageDone = 0;
      let totalDamageTaken = 0;
      let totalPlayerHits = 0;

      const foodHealAmount = store.equippedFood
        ? getItemDetails(store.equippedFood.itemId)?.healing || 0
        : 0;
      const maxFoodAvailable = store.equippedFood
        ? store.equippedFood.count
        : 0;
      const autoEatThreshold = store.combatSettings.autoEatThreshold / 100;

      // KORJAUS 1: Oikea pelin sisäinen kovakoodattu cooldown
      const FOOD_COOLDOWN_MS = 10000;

      for (let i = 0; i < iterations; i++) {
        const pStats = { ...playerStats };
        const eStats = { ...baseEnemyStats };

        let timeMs = 0;
        // KORJAUS 2: Oikeat taistelun aloitusajat kuten combatSystem.ts tiedostossa
        let pNextAttack = Math.min(1000, pStats.attackSpeed);
        let eNextAttack = Math.min(1500, eStats.attackSpeed);

        let potsUsed = 0;
        let nextFoodReadyTime = 0;

        const MAX_BATTLE_TIME_MS = 1000 * 60 * 60 * 24; // 24h aikaraja

        while (pStats.hp > 0 && eStats.hp > 0 && timeMs < MAX_BATTLE_TIME_MS) {
          let nextTick = Math.min(pNextAttack, eNextAttack);

          // Jos ollaan thresholdin alla ja potionin cooldown vapautuu ennen seuraavaa iskua, hypätään siihen hetkeen
          const needsFood = pStats.hp / pStats.maxHp <= autoEatThreshold;
          if (
            needsFood &&
            nextFoodReadyTime <= nextTick &&
            foodHealAmount > 0 &&
            potsUsed < maxFoodAvailable
          ) {
            nextTick = Math.max(timeMs, nextFoodReadyTime);
          }

          timeMs = nextTick;

          // Pelaaja syö tällä sekunnilla, JOS cooldown on ohi ja tarve on todellinen
          if (
            needsFood &&
            timeMs >= nextFoodReadyTime &&
            pStats.hp > 0 &&
            foodHealAmount > 0 &&
            potsUsed < maxFoodAvailable
          ) {
            pStats.hp = Math.min(pStats.maxHp, pStats.hp + foodHealAmount);
            potsUsed++;
            nextFoodReadyTime = timeMs + FOOD_COOLDOWN_MS;
          }

          // Pelaaja iskee
          if (timeMs === pNextAttack) {
            const hit = calculateHit(pStats, eStats);
            eStats.hp -= hit.finalDamage;
            totalDamageDone += hit.finalDamage;
            totalPlayerHits++;
            pNextAttack += pStats.attackSpeed;
          }

          if (eStats.hp <= 0) {
            wins++;
            break;
          }

          // Vihollinen iskee
          if (timeMs === eNextAttack) {
            const hit = calculateHit(eStats, pStats);
            pStats.hp -= hit.finalDamage;
            totalDamageTaken += hit.finalDamage;
            eNextAttack += eStats.attackSpeed;
          }
        }

        totalTimeMs += timeMs;
        totalPotsUsed += potsUsed;
      }

      setResult({
        winRate: (wins / iterations) * 100,
        avgTimeMs: totalTimeMs / iterations,
        avgPotsUsed: totalPotsUsed / iterations,
        avgPlayerDps: totalDamageDone / (totalTimeMs / 1000) || 0,
        avgEnemyDps: totalDamageTaken / (totalTimeMs / 1000) || 0,
        avgStrikeDamage: totalDamageDone / Math.max(1, totalPlayerHits) || 0,
      });
      setIsSimulating(false);
    }, 50);
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-md p-4 text-slate-300 text-xs font-mono space-y-4 shadow-xl">
      <h3 className="text-accent font-black tracking-widest uppercase border-b border-slate-700 pb-2 flex items-center justify-between">
        <span>Combat Simulator Tool</span>
        <span className="text-slate-500 text-[10px]">
          v1.5 (Strict 10s Potion CD + Init Timers)
        </span>
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1 text-[10px]">
          <div className="text-accent mb-1 font-bold flex justify-between">
            <span>YOUR STATS</span>
            <span className="text-yellow-500">
              Food: {store.equippedFood ? `${store.equippedFood.count}x` : "0x"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Max HP:</span> <span>{playerStats.maxHp}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Dmg:</span> <span>{playerStats.weaponBase}</span>
          </div>
          <div className="flex justify-between">
            <span>Armor:</span> <span>{playerStats.armor}</span>
          </div>
          <div className="flex justify-between">
            <span>Crit Chance:</span>{" "}
            <span>{(playerStats.critChance * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Attack Spd:</span> <span>{playerStats.attackSpeed}ms</span>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">
              Target Enemy
            </label>
            <select
              value={selectedMapId}
              onChange={(e) => setSelectedMapId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-accent outline-none"
            >
              {COMBAT_DATA.map((map) => (
                <option key={map.id} value={map.id}>
                  {map.isBoss ? "👑 " : ""}W{map.world} Z
                  {map.id % 10 === 0 ? 10 : map.id % 10} - {map.enemyName} (HP:{" "}
                  {map.enemyHp.toLocaleString()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-1">
              Iterations (Battles)
            </label>
            <select
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 outline-none"
            >
              <option value={10}>10 Battles (Fast)</option>
              <option value={100}>100 Battles</option>
              <option value={1000}>1,000 Battles (Accurate)</option>
            </select>
          </div>
          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="w-full bg-accent text-black font-bold py-1.5 rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {isSimulating ? "SIMULATING..." : "RUN SIMULATION"}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-black/50 p-3 rounded border border-accent/30 animate-in fade-in slide-in-from-top-2">
          <div
            className="text-center font-black text-sm mb-2"
            style={{
              color:
                result.winRate === 100
                  ? "#4ade80"
                  : result.winRate > 0
                    ? "#facc15"
                    : "#f87171",
            }}
          >
            WIN RATE: {result.winRate.toFixed(1)}%
          </div>
          <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
            <div className="bg-slate-900 p-1.5 rounded flex flex-col justify-center">
              <div className="text-slate-500">AVG TIME</div>
              <div className="text-white font-bold">
                {formatTime(result.avgTimeMs)}
              </div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded flex flex-col justify-center">
              <div className="text-slate-500">FOOD USED</div>
              <div className="text-white font-bold">
                {result.avgPotsUsed.toFixed(1)}
              </div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-accent/30 flex flex-col justify-center">
              <div className="text-accent/70">AVG STRIKE</div>
              <div className="text-accent font-bold">
                {Math.floor(result.avgStrikeDamage).toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded flex flex-col justify-center">
              <div className="text-slate-500">YOUR DPS</div>
              <div className="text-white font-bold">
                {Math.floor(result.avgPlayerDps).toLocaleString()}
              </div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-red-900/50 flex flex-col justify-center">
              <div className="text-red-500/70">ENEMY DPS</div>
              <div className="text-red-400 font-bold">
                {Math.floor(result.avgEnemyDps).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
