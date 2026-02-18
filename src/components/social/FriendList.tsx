import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/useGameStore';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  subscribeToFriendRequests,
} from '../../services/socialServices';

export default function FriendList({ myUid }: { myUid: string }) {
  // 1. Varmistetaan, että social on olemassa ja annetaan defaultit
  const { social, setActiveChat, setIncomingRequests, setOutgoingRequests } =
    useGameStore();

  // TURVATARKISTUS: Jos social-tila on jostain syystä rikki, käytetään tyhjiä listoja
  const friends = social?.friends || [];
  const incoming = social?.incomingRequests || [];
  const outgoing = social?.outgoingRequests || [];

  const [activeTab, setActiveTab] = useState<'friends' | 'pending'>('friends');
  const [addInput, setAddInput] = useState('');
  const [status, setStatus] = useState('');

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
    setStatus('Sending...');
    try {
      const myName = useGameStore.getState().username || 'Player';
      await sendFriendRequest(myUid, myName, addInput);
      setStatus('Request sent!');
      setAddInput('');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus(err.message);
      } else {
        setStatus('Error sending request');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 text-white">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 text-sm font-bold ${activeTab === 'friends' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:bg-slate-700/50'}`}
        >
          {/* KÄYTETÄÄN TURVALLISIA MUUTTUJIA */}
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 text-sm font-bold ${activeTab === 'pending' ? 'bg-slate-700 text-blue-400' : 'text-slate-400 hover:bg-slate-700/50'}`}
        >
          {/* KÄYTETÄÄN TURVALLISIA MUUTTUJIA */}
          Pending ({incoming.length})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* VIEW: FRIENDS */}
        {activeTab === 'friends' && (
          <>
            <div className="p-2 mb-2 bg-slate-700/30 rounded border border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={addInput}
                  onChange={(e) => setAddInput(e.target.value)}
                  placeholder="Friend's User ID..."
                  className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white"
                />
                <button
                  onClick={handleSendRequest}
                  className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs font-bold"
                >
                  ADD
                </button>
              </div>
              {status && (
                <p className="text-[10px] mt-1 text-yellow-400">{status}</p>
              )}
            </div>

            {friends.length === 0 && (
              <p className="text-center text-slate-500 text-xs mt-4">
                No friends added.
              </p>
            )}

            {friends.map((friend) => (
              <div
                key={friend.uid}
                onClick={() => setActiveChat(friend.uid)}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded cursor-pointer flex justify-between items-center transition-colors border border-slate-600"
              >
                <span className="font-bold text-sm">{friend.username}</span>
                <span className="text-xs text-green-400">CHAT &rarr;</span>
              </div>
            ))}
          </>
        )}

        {/* VIEW: PENDING */}
        {activeTab === 'pending' && (
          <>
            {/* Incoming */}
            {incoming.length > 0 && (
              <h4 className="text-xs font-bold text-slate-400 uppercase mt-2 mb-1">
                Incoming
              </h4>
            )}
            {incoming.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-slate-700/50 border border-slate-600 rounded flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-white">
                    {req.fromUsername}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    wants to add you
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptFriendRequest(myUid, req)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-xs py-1 rounded font-bold"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => rejectFriendRequest(req.id)}
                    className="flex-1 bg-red-600/50 hover:bg-red-600 text-xs py-1 rounded font-bold"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}

            {/* Outgoing */}
            {outgoing.length > 0 && (
              <h4 className="text-xs font-bold text-slate-400 uppercase mt-4 mb-1">
                Sent
              </h4>
            )}
            {outgoing.map((req) => (
              <div
                key={req.id}
                className="p-2 bg-slate-800 border border-slate-700 rounded flex justify-between items-center opacity-70"
              >
                <span className="text-xs text-slate-300">
                  To: {req.toUid.slice(0, 8)}...
                </span>
                <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
                  Waiting
                </span>
              </div>
            ))}

            {incoming.length === 0 && outgoing.length === 0 && (
              <p className="text-center text-slate-500 text-xs mt-10">
                No pending requests.
              </p>
            )}
          </>
        )}
      </div>

      <div className="p-2 border-t border-slate-700 text-center text-[10px] text-slate-500">
        Your ID:{' '}
        <span className="text-blue-400 cursor-pointer hover:underline select-all">
          {myUid}
        </span>
      </div>
    </div>
  );
}
