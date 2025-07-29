import { getTokenFromLS } from "@/utils/utils";
import { create } from "zustand";

type AuthenticatedStore = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

export const useAuthenticatedStore = create<AuthenticatedStore>((set) => ({
  isAuthenticated: Boolean(getTokenFromLS()),
  setIsAuthenticated: (nextAuthenticated) =>
    set({ isAuthenticated: nextAuthenticated }),
}));
