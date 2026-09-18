import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import { queryClient } from "./api/queryClient";
import store, { persistor } from "./store/store.ts";
import { AppThemeProvider } from "./theme/AppThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <AppThemeProvider>
            <BrowserRouter basename="/">
              <App />
            </BrowserRouter>
          </AppThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
