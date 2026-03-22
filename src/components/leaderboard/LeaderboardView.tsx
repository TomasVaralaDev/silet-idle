import { useState, useEffect } from "react";
import {
  getTopPlayersByLevel,
  getMyRankData,
} from "../../services/leaderboardService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useGameStore } from "../../store/useGameStore";
import { calculateTotalLevel } from "../../utils/gameUtils";
import type { LeaderboardEntry } from "../../types";

export default function LeaderboardView() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  const skills = useGameStore((state) => state.skills);
  const localTotalLevel = calculateTotalLevel(skills);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid);
      } else {
        setCurrentUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        const [top50, personalData] = await Promise.all([
          getTopPlayersByLevel(),
          currentUid ? getMyRankData(currentUid) : Promise.resolve(null),
        ]);

        setEntries(top50);
        setMyRank(personalData);
      } catch (err) {
        console.error("Archive Link Failure:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [currentUid, localTotalLevel]);

  const isPlayerInTop50 =
    myRank && typeof myRank.rank === "number" && myRank.rank <= 50;

  return (
    <div className="h-full flex flex-col bg-app-base font-sans overflow-hidden text-left relative">
      {/* HEADER SECTION - Mobiiliskaalautuva */}
      <div className="p-4 md:p-6 border-b border-border/50 bg-panel/50 flex items-center gap-4 md:gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0">
          <img
            src="/assets/ui/icon_leaderboard.png"
            className="w-8 h-8 md:w-10 md:h-10 pixelated"
            alt="Hall of Legends"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-3xl font-black uppercase tracking-widest text-accent mb-0.5 md:mb-1 truncate">
            Hall of Legends
          </h1>
          <p className="text-tx-muted text-[10px] md:text-sm font-medium truncate hidden sm:block">
            The most renowned adventurers across the world.
          </p>
        </div>

        <div className="text-right shrink-0">
          <div className="text-lg md:text-2xl font-black text-tx-main uppercase tracking-tighter">
            {myRank?.rank ? `#${myRank.rank}` : loading ? "..." : "---"}
          </div>
          <div className="text-[9px] md:text-xs font-mono text-tx-muted mt-0.5 md:mt-1 uppercase tracking-widest">
            Your Rank
          </div>
        </div>
      </div>

      {/* DECORATIVE ACCENT LINE */}
      <div className="h-1 bg-panel w-full shrink-0">
        <div className="h-full bg-accent w-full opacity-80"></div>
      </div>

      {/* MAIN LIST CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-32">
        <div className="max-w-4xl mx-auto space-y-2 md:space-y-3">
          {loading ? (
            <div className="py-20 text-center font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-tx-muted animate-pulse">
              Consulting the legends...
            </div>
          ) : (
            entries.map((entry) => (
              <LeaderboardRow
                key={entry.uid}
                entry={entry}
                isMe={entry.uid === currentUid}
              />
            ))
          )}

          {!loading && entries.length === 0 && (
            <div className="py-20 text-center text-tx-muted/40 font-mono uppercase text-[10px] md:text-xs tracking-widest">
              No heroes found.
            </div>
          )}
        </div>
      </div>

      {/* PERSISTENT FOOTER - Näkyy jos pelaaja ei ole Top 50 */}
      {!loading && myRank && !isPlayerInTop50 && (
        <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-panel/95 backdrop-blur-md border-t border-border z-30 animate-in slide-in-from-bottom duration-300">
          <div className="max-w-4xl mx-auto">
            <div className="text-[9px] md:text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 px-1 flex justify-between">
              <span>Your Standing</span>
              <span className="text-tx-muted font-mono tracking-tighter">
                Out of Range
              </span>
            </div>
            <LeaderboardRow entry={myRank} isMe={true} isFooter={true} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ROW COMPONENT
 */
function LeaderboardRow({
  entry,
  isMe,
  isFooter = false,
}: {
  entry: LeaderboardEntry;
  isMe: boolean;
  isFooter?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-sm border transition-all duration-300 ${
        isMe
          ? "bg-accent/10 border-accent/50"
          : entry.rank === 1
            ? "bg-warning/5 border-warning/30"
            : "bg-panel/40 border-border"
      } ${isFooter ? "bg-app-base" : ""}`}
    >
      {/* RANK NUMBER */}
      <div
        className={`w-8 md:w-12 text-center font-mono text-lg md:text-2xl font-black italic shrink-0 ${
          isMe
            ? "text-accent"
            : entry.rank === 1
              ? "text-warning"
              : "text-tx-muted/40"
        }`}
      >
        #{entry.rank}
      </div>

      {/* AVATAR & NAME */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={entry.avatar}
          className={`w-10 h-10 md:w-12 md:h-12 pixelated rounded-sm bg-app-base border p-0.5 shrink-0 ${
            isMe ? "border-accent/50" : "border-border"
          }`}
          alt=""
        />
        <div className="truncate pr-2">
          <div
            className={`text-sm md:text-lg font-bold uppercase tracking-tight truncate flex items-center gap-2 ${
              isMe ? "text-accent" : "text-tx-main"
            }`}
          >
            <span className="truncate">{entry.username}</span>
            {isMe && (
              <span className="text-[8px] md:text-[10px] bg-accent/20 px-1.5 py-0.5 rounded-sm text-accent font-black tracking-widest shrink-0">
                YOU
              </span>
            )}
          </div>
          <div className="text-[8px] md:text-[9px] font-mono text-tx-muted uppercase tracking-widest mt-0.5 truncate">
            {entry.rank === 1 ? "Champion" : "Hero"}
          </div>
        </div>
      </div>

      {/* TOTAL LEVEL */}
      <div className="text-right shrink-0 pl-2 border-l border-border/50">
        <div className="text-lg md:text-2xl font-black text-tx-main font-mono leading-none">
          {entry.totalLevel}
        </div>
        <div
          className={`text-[8px] md:text-[10px] uppercase font-black tracking-tighter mt-1 ${
            isMe ? "text-accent" : "text-tx-muted"
          }`}
        >
          Total Level
        </div>
      </div>
    </div>
  );
}
