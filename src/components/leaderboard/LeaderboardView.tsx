import { useState, useEffect } from "react";
import {
  getTopPlayersByMap,
  getMyRankData,
} from "../../services/leaderboardService";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import type { LeaderboardEntry } from "../../types";

export default function LeaderboardView() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  /**
   * OPTIMOINTI: Haetaan UID suoraan auth-tilasta.
   * Tämä varmistaa, ettei kutsuja tehdä ennen kuin käyttäjä on tunnistettu.
   */
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid);
      } else {
        // Jos käyttäjä ei ole kirjautunut, ladataan vain yleinen lista
        setCurrentUid(null);
      }
    });
    return () => unsubscribe();
  }, []);

  /**
   * DATA-FETCH: Kutsutaan Firebasea vain, kun currentUid muuttuu tai komponentti ladataan.
   */
  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      try {
        // Ajetaan kutsut rinnakkain suorituskyvyn parantamiseksi
        const [top50, personalData] = await Promise.all([
          getTopPlayersByMap(),
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
  }, [currentUid]);

  // Tarkistus: Onko pelaaja jo Top 50 -listalla
  const isPlayerInTop50 =
    myRank && typeof myRank.rank === "number" && myRank.rank <= 50;

  return (
    <div className="h-full flex flex-col bg-app-base font-sans overflow-hidden italic-none">
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-border/50 bg-panel/50 flex items-center gap-6 sticky top-0 z-20 backdrop-blur-sm shrink-0 text-left">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-accent/20 border border-accent/30 shadow-lg shrink-0">
          <img
            src="/assets/ui/icon_leaderboard.png"
            className="w-10 h-10 pixelated"
            alt="Hall of Records"
          />
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-black uppercase tracking-widest text-accent mb-1">
            Hall of Records
          </h1>
          <p className="text-tx-muted text-sm font-medium">
            Global operative synchronization and world stability rankings.
          </p>
        </div>

        <div className="text-right hidden md:block">
          {/* RANK DISPLAY: Näyttää sijoituksen heti kun se on ladattu */}
          <div className="text-2xl font-black text-tx-main uppercase tracking-tighter">
            {myRank?.rank ? `#${myRank.rank}` : loading ? "..." : "---"}
          </div>
          <div className="text-xs font-mono text-tx-muted mt-1 uppercase tracking-widest">
            Your Rank
          </div>
        </div>
      </div>

      {/* DECORATIVE ACCENT LINE */}
      <div className="h-1 bg-panel w-full shrink-0">
        <div className="h-full bg-accent shadow-[0_0_10px_rgb(var(--color-accent)/0.5)] w-full"></div>
      </div>

      {/* MAIN LIST CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-3 pb-24">
          {loading ? (
            <div className="py-20 text-center font-mono text-xs uppercase tracking-[0.4em] text-tx-muted animate-pulse">
              Querying Central Archives...
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
            <div className="py-20 text-center text-tx-muted/40 font-mono uppercase text-xs tracking-widest">
              No operative records found in this sector.
            </div>
          )}
        </div>
      </div>

      {/* PERSISTENT FOOTER: Näytetään vain jos pelaaja on Top 50:n ulkopuolella */}
      {!loading && myRank && !isPlayerInTop50 && (
        <div className="p-4 bg-panel/90 backdrop-blur-md border-t border-accent/40 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-30 animate-in slide-in-from-bottom duration-500">
          <div className="max-w-4xl mx-auto">
            <div className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2 px-2 flex justify-between">
              <span>Your Current Position</span>
              <span className="text-tx-muted italic font-mono">
                Out of Range
              </span>
            </div>
            <LeaderboardRow entry={myRank} isMe={true} />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * ROW COMPONENT: Eriytetty näkymälogiikka optimointia varten
 */
function LeaderboardRow({
  entry,
  isMe,
}: {
  entry: LeaderboardEntry;
  isMe: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
        isMe
          ? "bg-accent/20 border-accent shadow-[0_0_20px_rgba(var(--color-accent),0.15)]"
          : entry.rank === 1
            ? "bg-panel/70 border-accent/30 shadow-sm"
            : "bg-panel/40 border-border/40"
      }`}
    >
      {/* RANK NUMBER */}
      <div
        className={`w-12 text-center font-mono text-2xl font-black italic ${
          isMe || entry.rank === 1 ? "text-accent" : "text-tx-muted/40"
        }`}
      >
        #{entry.rank}
      </div>

      {/* AVATAR & NAME */}
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <img
          src={entry.avatar}
          className={`w-12 h-12 pixelated rounded-lg bg-app-base border p-1 shrink-0 ${
            isMe ? "border-accent" : "border-border/50"
          }`}
          alt=""
        />
        <div className="truncate">
          <div
            className={`text-lg font-bold uppercase tracking-tight truncate ${
              isMe ? "text-accent" : "text-tx-main"
            }`}
          >
            {entry.username}
            {isMe && (
              <span className="text-[10px] bg-accent/20 px-1.5 py-0.5 rounded ml-2 text-accent font-black">
                YOU
              </span>
            )}
          </div>
          <div className="text-[9px] font-mono text-tx-muted uppercase tracking-widest">
            Confirmed Operative
          </div>
        </div>
      </div>

      {/* PERFORMANCE STATS */}
      <div className="text-right shrink-0">
        <div className="text-2xl font-black text-tx-main font-mono leading-none">
          W{entry.maxMapCompleted}
        </div>
        <div
          className={`text-[10px] uppercase font-black tracking-tighter mt-1 ${
            isMe ? "text-accent" : "text-tx-muted"
          }`}
        >
          Zone Clearance
        </div>
      </div>
    </div>
  );
}
