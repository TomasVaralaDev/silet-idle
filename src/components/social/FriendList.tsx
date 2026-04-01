import { useState, useEffect, useRef } from "react";
import { useGameStore } from "../../store/useGameStore";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  subscribeToFriendRequests,
  removeFriend,
} from "../../services/socialServices";

export default function FriendList({ myUid }: { myUid: string }) {
  const {
    social,
    setActiveChat,
    setIncomingRequests,
    setOutgoingRequests,
    addFriendLocally,
    removeFriendLocally,
  } = useGameStore();

  const friends = social?.friends || [];
  const incoming = social?.incomingRequests || [];
  const outgoing = social?.outgoingRequests || [];

  const [activeTab, setActiveTab] = useState<"friends" | "pending">("friends");
  const [addInput, setAddInput] = useState("");
  const [status, setStatus] = useState("");

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unsub = subscribeToFriendRequests(
      myUid,
      (inc) => setIncomingRequests(inc),
      (out) => setOutgoingRequests(out),
      (newFriend) => addFriendLocally(newFriend),
    );
    return () => unsub();
  }, [myUid, setIncomingRequests, setOutgoingRequests, addFriendLocally]);

  const handleSendRequest = async () => {
    if (!addInput) return;
    setStatus("Sending...");
    try {
      const myName = useGameStore.getState().username || "Player";
      await sendFriendRequest(myUid, myName, addInput);
      setStatus("Request sent!");
      setAddInput("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus(err.message);
      } else {
        setStatus("Error sending request");
      }
    }
  };

  const handleRemoveFriend = async (friendUid: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenuId(null);

    try {
      removeFriendLocally(friendUid);
      await removeFriend(myUid, friendUid);
    } catch (err) {
      console.error("Failed to remove friend", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-tx-main font-sans">
      {
        // NAVIGATION TABS
      }
      <div className="flex border-b border-border/50 shrink-0">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex-1 py-2 text-sm font-bold transition-colors ${
            activeTab === "friends"
              ? "bg-panel/50 text-accent border-b border-accent"
              : "text-tx-muted hover:bg-panel-hover/50"
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex-1 py-2 text-sm font-bold transition-colors ${
            activeTab === "pending"
              ? "bg-panel/50 text-accent border-b border-accent"
              : "text-tx-muted hover:bg-panel-hover/50"
          }`}
        >
          Pending ({incoming.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {
          // FRIENDS LIST VIEW
        }
        {activeTab === "friends" && (
          <>
            <div className="p-2 mb-2 bg-panel/30 rounded border border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={addInput}
                  onChange={(e) => setAddInput(e.target.value)}
                  placeholder="Friend's User ID..."
                  className="w-full bg-app-base/50 border border-border rounded px-2 py-1 text-xs text-tx-main focus:outline-none focus:border-accent/50"
                />
                <button
                  onClick={handleSendRequest}
                  className="bg-accent text-app-base hover:opacity-90 px-3 py-1 rounded text-xs font-bold transition-all"
                >
                  ADD
                </button>
              </div>
              {status && (
                <p className="text-[10px] mt-1 text-warning font-mono">
                  {status}
                </p>
              )}
            </div>

            {friends.length === 0 && (
              <p className="text-center text-tx-muted/50 text-xs mt-4 italic">
                No friends added.
              </p>
            )}

            {friends.map((friend) => (
              <div
                // Individual friend entry with chat navigation
                key={friend.uid}
                onClick={() => setActiveChat(friend.uid)}
                className="relative p-3 bg-panel/50 hover:bg-panel-hover/80 rounded cursor-pointer flex justify-between items-center transition-all border border-border group"
              >
                <span className="font-bold text-sm text-tx-main">
                  {friend.username}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-success font-bold group-hover:scale-105 transition-transform mr-1">
                    CHAT &rarr;
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(
                        activeMenuId === friend.uid ? null : friend.uid,
                      );
                    }}
                    className="w-6 h-6 rounded flex items-center justify-center text-tx-muted hover:bg-app-base hover:text-tx-main border border-transparent hover:border-border transition-colors font-bold tracking-widest leading-none pb-1"
                    title="More options"
                  >
                    ...
                  </button>

                  {activeMenuId === friend.uid && (
                    <div
                      ref={menuRef}
                      className="absolute right-2 top-10 bg-panel border border-border shadow-2xl rounded-sm z-50 flex flex-col min-w-[120px] animate-in fade-in zoom-in-95 duration-100"
                    >
                      <button
                        onClick={(e) => handleRemoveFriend(friend.uid, e)}
                        className="text-left px-3 py-2 text-xs font-bold text-danger hover:bg-danger/10 transition-colors w-full"
                      >
                        Remove Friend
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {
          // PENDING REQUESTS VIEW
        }
        {activeTab === "pending" && (
          <>
            {incoming.length > 0 && (
              <h4 className="text-xs font-bold text-tx-muted uppercase mt-2 mb-1 px-1">
                Incoming
              </h4>
            )}
            {incoming.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-panel/50 border border-border rounded flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-tx-main">
                    {req.fromUsername}
                  </span>
                  <span className="text-[10px] text-tx-muted">
                    wants to add you
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        await acceptFriendRequest(myUid, req);
                        addFriendLocally({
                          uid: req.fromUid,
                          username: req.fromUsername,
                          addedAt: Date.now(),
                        });
                      } catch (err) {
                        console.error("Failed to accept:", err);
                      }
                    }}
                    className="flex-1 bg-success text-app-base hover:opacity-90 text-xs py-1 rounded font-bold transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(req.id)}
                    className="flex-1 bg-danger/20 border border-danger/50 text-danger hover:bg-danger hover:text-tx-main text-xs py-1 rounded font-bold transition-all"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}

            {outgoing.length > 0 && (
              <h4 className="text-xs font-bold text-tx-muted uppercase mt-4 mb-1 px-1">
                Sent
              </h4>
            )}
            {outgoing.map((req) => (
              <div
                key={req.id}
                className="p-2 bg-app-base/50 border border-border rounded flex justify-between items-center opacity-70"
              >
                <span className="text-xs text-tx-muted">
                  To: {req.toUid.slice(0, 8)}...
                </span>
                <span className="text-[10px] text-warning bg-warning/10 px-2 py-0.5 rounded border border-warning/20">
                  Waiting
                </span>
              </div>
            ))}

            {incoming.length === 0 && outgoing.length === 0 && (
              <p className="text-center text-tx-muted/50 text-xs mt-10 italic">
                No pending requests.
              </p>
            )}
          </>
        )}
      </div>

      <div className="p-2 border-t border-border/50 bg-panel/20 text-center text-[10px] text-tx-muted shrink-0">
        Your ID:{" "}
        <span className="text-accent cursor-pointer hover:underline select-all font-mono">
          {myUid}
        </span>
      </div>
    </div>
  );
}
