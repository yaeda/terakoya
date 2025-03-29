// prettier-ignore : react-scan must be imported before React and React DOM
import { scan } from "react-scan";

import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

if (process.env.NODE_ENV === "development") {
  scan();
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider className="h-full">
        <main className="h-full">
          <App />
        </main>
      </HeroUIProvider>
    </QueryClientProvider>
  </StrictMode>,
);
