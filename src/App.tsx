import { Suspense, useEffect } from "react";
import AppRoutes from "./routes";
import useAppState from "./state/app";
import { Toaster } from "./design-system/toaster";

export default function App() {
  const theme = useAppState((state) => state.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <Suspense fallback={<>Loading</>}>
      <AppRoutes />
      <Toaster />
    </Suspense>
  );
}
