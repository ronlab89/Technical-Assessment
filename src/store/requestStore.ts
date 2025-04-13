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

export type AssignedDesigner = {
  projectId: string;
  designerId: string | null;
};

interface RequestStore {
  requests: Request[] | [] | null | undefined;
  selectedDesignerId: AssignedDesigner[];
  setRequests: (data: Request[] | null) => void;
  setSelectedDesignerId: (projectId: string, designerId: string | null) => void;
  resetRequest: () => void;
}

const initialState = {
  requests: [],
  selectedDesignerId: [],
};

export const useRequestStore = create<RequestStore>()(
  persist(
    (set) => ({
      ...initialState,

      setRequests: (data) => set({ requests: data }),
      setSelectedDesignerId: (projectId, designerId) =>
        set((state) => {
          const existing = state.selectedDesignerId.find(
            (item) => item.projectId === projectId
          );

          let updated;

          if (existing) {
            updated = state.selectedDesignerId.map((item) =>
              item.projectId === projectId ? { projectId, designerId } : item
            );
          } else {
            updated = [...state.selectedDesignerId, { projectId, designerId }];
          }

          return { selectedDesignerId: updated };
        }),

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
