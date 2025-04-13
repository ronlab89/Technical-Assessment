import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Request = {
  id: string;
  title: string;
  description: string;
  client_id: string;
  designer_id: string;
  files: string[] | undefined;
  created_at: string;
  updated_at: string;
};

interface RequestStore {
  requests: Request[] | [] | null | undefined;
  setRequests: (data: Request[] | null) => void;
  resetRequest: () => void;
}

const initialState = {
  requests: [],
};

export const useRequestStore = create<RequestStore>()(
  persist(
    (set) => ({
      ...initialState,

      setRequests: (data) => set({ requests: data }),

      resetRequest: () => set(initialState),
    }),
    {
      name: "request",
      // onRehydrateStorage: () => (state) => {
      //   // console.log("Rehydrating requests state...", state);
      // },
    }
  )
);
