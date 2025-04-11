import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Profile = {
  role: string;
};

export type User = {
  id: string;
  aud: string;
  email: string | undefined;
  created_at: string;
};

export type Session = {
  access_token: string;
  expires_at: number | undefined;
  expires_in: number;
  refresh_token: string;
  token_type: string;
};

interface SessionStore {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  resetSession: () => void;
}

const initialState = {
  session: null,
  user: null,
  profile: null,
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      ...initialState,

      setSession: (session) => set({ session }),
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),

      resetSession: () => set(initialState),
    }),
    {
      name: "session",
      // onRehydrateStorage: () => (state) => {
      //   // console.log("Rehydrating session state...", state);
      // },
    }
  )
);
