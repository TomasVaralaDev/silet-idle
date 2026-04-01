import type { StateCreator } from "zustand";
import type {
  GameState,
  SocialState,
  Friend,
  FriendRequest,
  GlobalChatMessage,
} from "../../types";

export interface SocialSlice {
  social: SocialState;
  setFriends: (friends: Friend[]) => void;
  setIncomingRequests: (requests: FriendRequest[]) => void;
  setOutgoingRequests: (requests: FriendRequest[]) => void;
  setGlobalMessages: (messages: GlobalChatMessage[]) => void;
  setActiveChat: (friendUid: string | null) => void;
  addFriendLocally: (friend: Friend) => void;
  removeFriendLocally: (friendUid: string) => void;
}

/**
 * createSocialSlice
 * Local interface caching data received from Firebase Realtime Database and Firestore.
 * Facilitates instantaneous UI updates before cloud syncing is complete.
 */
export const createSocialSlice: StateCreator<
  GameState & SocialSlice,
  [],
  [],
  SocialSlice
> = (set) => ({
  social: {
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    globalMessages: [],
    activeChatFriendId: null,
    unreadMessages: {},
    unlockedChatColors: ["default"],
  },

  setFriends: (friends) =>
    set((state) => ({ social: { ...state.social, friends } })),

  setIncomingRequests: (requests) =>
    set((state) => ({
      social: { ...state.social, incomingRequests: requests },
    })),

  setOutgoingRequests: (requests) =>
    set((state) => ({
      social: { ...state.social, outgoingRequests: requests },
    })),

  // Modifies transient array, excluded from permanent Firestore saves
  setGlobalMessages: (messages) =>
    set((state) => ({ social: { ...state.social, globalMessages: messages } })),

  // Local-first addition ensures the UI updates instantly, bypassing network latency
  addFriendLocally: (friend) =>
    set((state) => ({
      social: { ...state.social, friends: [...state.social.friends, friend] },
    })),

  // Local-first deletion, cleanly dropping active chats if applicable
  removeFriendLocally: (friendUid) =>
    set((state) => ({
      social: {
        ...state.social,
        friends: state.social.friends.filter((f) => f.uid !== friendUid),
        activeChatFriendId:
          state.social.activeChatFriendId === friendUid
            ? null // Boot user out of active chat window if friend is deleted
            : state.social.activeChatFriendId,
      },
    })),

  setActiveChat: (friendUid) =>
    set((state) => ({
      social: { ...state.social, activeChatFriendId: friendUid },
    })),
});
