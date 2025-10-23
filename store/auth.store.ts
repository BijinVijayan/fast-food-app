import { create } from "zustand";
import { User } from "@/type";
import { appwriteLogout, getCurrentUser } from "@/lib/appwrite";
type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;

  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;

  fetchAuthenticatedUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  setUser: (user) => set({ user }),
  setIsLoading: (value) => set({ isLoading: value }),

  fetchAuthenticatedUser: async () => {
    set({ isLoading: true });

    try {
      let user = await getCurrentUser();
      if (!user) {
        // sometimes session syncs slightly late
        await new Promise((r) => setTimeout(r, 300));
        user = await getCurrentUser();
      }

      if (user) set({ isAuthenticated: true, user: user as unknown as User });
      else set({ isAuthenticated: false, user: null });
    } catch (error) {
      // console.error("fetchAuthenticatedUser error", error);
      set({ isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await appwriteLogout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  },
}));
export default useAuthStore;
