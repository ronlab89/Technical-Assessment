import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Profile = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  full_name: string;
  email: string;
  profile_id: string | Profile;
  created_at: string;
};

interface UserStore {
  users: User[] | [] | null | undefined;
  setUsers: (data: User[] | [] | null | undefined) => void;
  resetUser: () => void;
}

const initialState = {
  users: [],
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,

      setUsers: (data) => set({ users: data }),

      resetUser: () => set(initialState),
    }),
    {
      name: "user",
      // onRehydrateStorage: () => (state) => {
      //   // console.log("Rehydrating users state...", state);
      // },
    }
  )
);
