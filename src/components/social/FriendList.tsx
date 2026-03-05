import { useState, useEffect } from "react";
import { useGameStore } from "../../store/useGameStore";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  subscribeToFriendRequests,
} from "../../services/socialServices";

export default function FriendList({ myUid }: { myUid: string }) {
  const { social, setActiveChat, setIncomingRequests, setOutgoingRequests } =
    useGameStore();

  const friends = social?.friends || [];
  const incoming = social?.incomingRequests || [];
  const outgoing = social?.outgoingRequests || [];

  const [activeTab, setActiveTab] = useState<"friends" | "pending">("friends");
  const [addInput, setAddInput] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const unsub = subscribeToFriendRequests(
      myUid,
      (inc) => setIncomingRequests(inc),
      (out) => setOutgoingRequests(out),
    );
    return () => unsub();
  }, [myUid, setIncomingRequests, setOutgoingRequests]);

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

  return (
    <div className="flex flex-col h-full bg-transparent text-tx-main font-sans">
      {/* Tabs */}
      <div className="flex border-b border-border/50">
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
        {/* VIEW: FRIENDS */}
        {activeTab === "friends" && (
          <>
            <div className="p-2 mb-2 bg-panel/30 rounded border border-border">
              <div className="flex gap-2">
                {/* MUUTOS 2: Inputin tausta bg-app-base -> bg-app-base/50 */}
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
                key={friend.uid}
                onClick={() => setActiveChat(friend.uid)}
                // MUUTOS 3: bg-panel -> bg-panel/50, jotta kuultaa läpi
                className="p-3 bg-panel/50 hover:bg-panel-hover/80 rounded cursor-pointer flex justify-between items-center transition-all border border-border"
              >
                <span className="font-bold text-sm text-tx-main">
                  {friend.username}
                </span>
                <span className="text-xs text-success font-bold">
                  CHAT &rarr;
                </span>
              </div>
            ))}
          </>
        )}

        {/* VIEW: PENDING */}
        {activeTab === "pending" && (
          <>
            {/* Incoming */}
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
                    onClick={() => acceptFriendRequest(myUid, req)}
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

            {/* Outgoing */}
            {outgoing.length > 0 && (
              <h4 className="text-xs font-bold text-tx-muted uppercase mt-4 mb-1 px-1">
                Sent
              </h4>
            )}
            {outgoing.map((req) => (
              <div
                key={req.id}
                // MUUTOS 4: bg-app-base -> bg-app-base/50
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

      <div className="p-2 border-t border-border/50 bg-panel/20 text-center text-[10px] text-tx-muted">
        Your ID:{" "}
        <span className="text-accent cursor-pointer hover:underline select-all font-mono">
          {myUid}
        </span>
      </div>
    </div>
  );
}
