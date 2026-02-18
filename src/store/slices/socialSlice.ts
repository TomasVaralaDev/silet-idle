import type { StateCreator } from 'zustand';
import type {
  GameState,
  SocialState,
  Friend,
  FriendRequest,
  GlobalChatMessage,
} from '../../types';

export interface SocialSlice {
  social: SocialState;
  setFriends: (friends: Friend[]) => void;
  setIncomingRequests: (requests: FriendRequest[]) => void;
  setOutgoingRequests: (requests: FriendRequest[]) => void;
  setGlobalMessages: (messages: GlobalChatMessage[]) => void; // UUSI
  setActiveChat: (friendUid: string | null) => void;
  addFriendLocally: (friend: Friend) => void;
}

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
    globalMessages: [], // ALUSTUS
    activeChatFriendId: null,
    unreadMessages: {},
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

  // UUSI ACTION
  setGlobalMessages: (messages) =>
    set((state) => ({ social: { ...state.social, globalMessages: messages } })),

  addFriendLocally: (friend) =>
    set((state) => ({
      social: { ...state.social, friends: [...state.social.friends, friend] },
    })),
  setActiveChat: (friendUid) =>
    set((state) => ({
      social: { ...state.social, activeChatFriendId: friendUid },
    })),
});
