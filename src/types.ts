/**
 * Global Type Definitions
 * Centralizes all data structures, enums, and state interfaces used across the game engine.
 */

// --- CORE IDENTIFIERS ---

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type AchievementCategory =
  | "general"
  | "combat"
  | "skills"
  | "wealth"
  | "collection";

export type SkillType =
  | "woodcutting"
  | "mining"
  | "fishing"
  | "foraging"
  | "crafting"
  | "smithing"
  | "alchemy"
  | "hitpoints"
  | "attack"
  | "defense"
  | "melee"
  | "ranged"
  | "magic"
  | "combat"
  | "scavenging";

// Routing enumerator determining the active viewport component
export type ViewType =
  | SkillType
  | "inventory"
  | "shop"
  | "gamble"
  | "achievements"
  | "scavenger"
  | "enchanting"
  | "worldmarket"
  | "marketplace"
  | "roadmap"
  | "patch_notes"
  | "faq"
  | "guide"
  | "privacy_policy"
  | "leaderboard"
  | "wiki"
  | "premium_shop";

// Hardware equipping restrictions
export type EquipmentSlot =
  | "head"
  | "body"
  | "legs"
  | "weapon"
  | "shield"
  | "necklace"
  | "ring"
  | "rune"
  | "skill"
  | "food";

export type CombatStyle = "melee" | "ranged" | "magic";

// --- EVENT TYPES ---
export type GameEventType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "loot"
  | "combat"
  | "levelUp";

// Defines transient notifications that appear globally over the UI
export interface GameEvent {
  id: string;
  type: GameEventType;
  message: string;
  icon?: string;
  timestamp: number;
}

export interface GameSettings {
  notifications: boolean;
  sound: boolean;
  music: boolean;
  particles: boolean;
  theme: string;
  chatColor: string;
  lastNameChange?: number;
}

// Describes a continuous, time-based task the player is currently executing
export interface ActiveAction {
  skill: SkillType;
  resourceId: string;
  progress: number;
  targetTime: number;
}

// --- COMBAT TYPES ---

export interface Enemy {
  id: string;
  name: string;
  icon: string;
  maxHp: number;
  currentHp: number;
  level: number;
  attack: number;
  defense: number;
  xpReward: number;
}

// History feed used in the Combat View
export interface CombatLogEntry {
  message: string;
  timestamp: string;
  type?: "damage" | "heal" | "info" | "loot";
}

// The active, tick-by-tick state of the combat engine
export interface CombatState {
  hp: number;
  currentMapId: number | null;
  maxMapCompleted: number;
  enemyCurrentHp: number;
  respawnTimer: number;
  foodTimer: number;
  combatLog: string[];
  playerAttackTimer: number;
  enemyAttackTimer: number;
  cooldownUntil: number;
  damagePopUps: DamagePopUp[];
  cooldownReason?: "death" | "retreat" | null;
}

// Mathematical combat profile compiled from skills and equipment
export interface CalculatedStats {
  attackDamage: number;
  armor: number;
  attackSpeed: number;
  maxHp: number;
  critChance: number;
  critMultiplier: number;
}

// --- ITEM & RESOURCE TYPES ---

export interface Ingredient {
  id: string;
  count: number;
}

// Base definition for practically every physical item in the game database
export interface Resource {
  id: string;
  name: string;
  actionImage?: string;
  icon: string;
  value: number;
  rarity: Rarity;
  color?: string;
  description?: string;
  category?: string;
  level?: number;
  xpReward?: number;
  interval?: number;
  area?: number;
  inputs?: Ingredient[];
  slot?: EquipmentSlot;
  isUnique?: boolean;
  nonEnchantable?: boolean;
  stats?: {
    attack?: number;
    defense?: number;
    strength?: number;
    attackSpeed?: number;
    critChance?: number;
    critMulti?: number;
    hpBonus?: number;
  };
  combatStyle?: CombatStyle;
  healing?: number;
  drops?: ResourceDrop[];
  skillModifiers?: {
    miningSpeed?: number;
    miningXp?: number;
    woodcuttingSpeed?: number;
    woodcuttingXp?: number;
    foragingSpeed?: number;
    foragingXp?: number;
    smithingSpeed?: number;
    smithingXp?: number;
    craftingSpeed?: number;
    craftingXp?: number;
    alchemySpeed?: number;
    alchemyXp?: number;
  };
}

export interface Drop {
  itemId: string;
  chance: number;
  amount: [number, number];
}

// Used for complex drop tables where items compete against each other via probability weights
export interface WeightedDrop {
  itemId: string;
  weight: number;
  amount?: [number, number];
  chance?: number;
}

export interface CombatMap {
  id: number;
  world: number;
  name: string;
  enemyName: string;
  enemyHp: number;
  enemyAttack: number;
  xpReward: number;
  image?: string;
  drops: WeightedDrop[];
  isBoss?: boolean;
  keyRequired?: string;
}

// --- SHOP & ACHIEVEMENTS ---

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  requires?: string;
}

export interface AchievementReward {
  coins?: number;
  xpMap?: Partial<Record<SkillType, number>>;
  items?: { itemId: string; amount: number }[];
  chatColorId?: string;
}

export interface Achievement {
  id: string;
  name: string;
  category: AchievementCategory;
  icon: string;
  description: string;
  // Function evaluated against the global state to verify completion
  condition: (state: GameState) => boolean;
  rewards?: AchievementReward;
}

// --- EXPEDITIONS (Scavenger) ---

export interface Expedition {
  id: string;
  mapId: number;
  startTime: number;
  duration: number; // in milliseconds
  rewards?: { itemId: string; amount: number }[];
}

export interface ScavengerState {
  activeExpeditions: Expedition[];
  unlockedSlots: number;
}

// --- SETTINGS & CONFIG ---

export interface CombatSettings {
  autoEatThreshold: number;
  autoProgress: boolean;
  autoRetreat: boolean;
}

export interface SkillData {
  xp: number;
  level: number;
}

// --- QUEST TYPES ---
export type QuestType = "GATHER" | "KILL" | "CRAFT";

export interface QuestReward {
  coins?: number;
  xpMap?: Partial<Record<SkillType, number>>;
  items?: { itemId: string; amount: number }[];
}

export interface QuestTemplate {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  targetId: string;
  targetAmount: number;
  requiredLevel: number;
  requiredSkill: SkillType;
  reward: QuestReward;
}

export interface ActiveQuest extends QuestTemplate {
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface QuestState {
  dailyQuests: ActiveQuest[];
  lastResetTime: number; // Used to track 00:00 UTC resets
}

// --- REWARDS ---
export interface RewardEntry {
  itemId: string;
  amount: number;
}

export interface RewardModalState {
  isOpen: boolean;
  title: string;
  rewards: RewardEntry[];
}

// --- WORLD ITEM VENDOR ---
export interface MaterialRequirement {
  itemId: string;
  amount: number;
}

// Used for vendor items requiring regional currency and materials
export interface WorldShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  costCoins: number;
  costMaterials: MaterialRequirement[];
  worldId: number;
  resultItemId: string;
  resultAmount: number;
  dailyLimit?: number;
}

export interface WorldShopState {
  purchases: Record<string, number>;
  lastResetTime: number;
}

export interface ResourceDrop {
  itemId: string;
  chance: number;
  amountMin: number;
  amountMax: number;
}

// --- SOCIAL FEATURES ---
export interface Friend {
  uid: string;
  username: string;
  addedAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface FriendRequest {
  id: string;
  fromUid: string;
  fromUsername: string;
  toUid: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: number;
}

export interface GlobalChatMessage {
  id: string;
  senderUid: string;
  senderUsername: string;
  senderColor?: string;
  text: string;
  timestamp: number;
}

// Aggregates all live Firebase DB feeds into local state
export interface SocialState {
  friends: Friend[];
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  globalMessages: GlobalChatMessage[];
  activeChatFriendId: string | null;
  unreadMessages: Record<string, number>;
  unlockedChatColors: string[];
}

// Marketplace transaction record
export interface MarketListing {
  id: string;
  sellerUid: string;
  sellerName: string;
  itemId: string;
  amount: number;
  pricePerItem: number;
  totalPrice: number;
  createdAt: number;
  status: "active" | "sold" | "expired" | "cancelled";
}

// Mail system structure for payouts
export interface MailMessage {
  id: string;
  type: "market_sale" | "system_gift";
  title: string;
  message: string;
  coinsAttached?: number;
  itemsAttached?: { itemId: string; amount: number }[];
  timestamp: number;
  isClaimed: boolean;
}

// ==========================================
// --- ROOT GAME STATE ---
// The master interface defining the entire payload saved to Firestore
// ==========================================

export interface GameState {
  username: string;
  avatar: string;
  unlockedQueueSlots: number;
  settings: GameSettings;
  marketListingLimit: number;
  inventory: Record<string, number>; // ID -> Count
  skills: Record<SkillType, SkillData>;
  equipment: Record<Exclude<EquipmentSlot, "food">, string | null>;
  equippedFood: { itemId: string; count: number } | null;
  combatSettings: CombatSettings;
  scavenger: ScavengerState;
  activeAction: ActiveAction | null;
  coins: number;
  gems: number;
  upgrades: string[];
  premiumPurchases: Record<string, number>;
  maxOfflineHoursIncrement?: number;
  unlockedAchievements: string[];
  claimedAchievements: string[];
  combatStats: CombatState;
  enemy: Enemy | null;
  lastTimestamp: number;
  events: GameEvent[]; // Transient UI notifications
  social: SocialState; // Live RTDB feeds
  quests: QuestState;
  worldShop: WorldShopState;
  queue: QueueItem[];
  tutorial: TutorialState;
}

export interface QueueItem {
  id: string;
  skill: SkillType;
  resourceId: string;
  amount: number;
  completed: number;
}

// --- DAMAGE POP UP ---
export interface DamagePopUp {
  id: string;
  amount: number | string;
  isCrit: boolean;
  type: "player" | "enemy";
  createdAt: number; // Used for cleanup
}

// --- META VIEW DATA ---
export interface PatchNote {
  version: string;
  date: string;
  changes: string[];
  isMajor?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface GuideSection {
  title: string;
  content: string;
  icon?: string;
}

export type LeaderboardFilter = "totalLevel" | "maxMapCompleted";

export interface LeaderboardEntry {
  uid: string;
  username: string;
  avatar: string;
  totalLevel: number;
  maxMapCompleted: number;
  rank?: number;
}

export interface PremiumShopRewards {
  rewardGems?: number;
  stats?: {
    expeditionSlotsIncrement?: number;
    queueSlotsSet?: number;
    inventorySlots?: number;
    offlineHoursIncrement?: number;
  };
  items?: Record<string, number>;
}

export interface PremiumShopItem {
  id: string;
  name: string;
  description: string;
  priceGems: number;
  icon: string;
  category: "Boosts" | "Cosmetics" | "Utility" | "Bundles";
  isOneTime?: boolean;
  maxPurchases?: number;
  rewards?: PremiumShopRewards;
}

// --- TUTORIAL ---
export interface TutorialState {
  step: number;
  isComplete: boolean;
  isActive: boolean;
}
