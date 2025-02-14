import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light";

type AppState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const useAppState = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme: Theme) => set(() => ({ theme })),
    }),
    {
      name: "app-theme",
    }
  )
);

export default useAppState;
