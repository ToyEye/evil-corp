import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store, { persistor } from "./store/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { AppThemeProvider } from "./theme/AppThemeProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <AppThemeProvider>
          <BrowserRouter basename="/">
            <App />
          </BrowserRouter>
        </AppThemeProvider>
      </Provider>
    </PersistGate>
  </StrictMode>,
);
