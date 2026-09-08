import "./App.css";
import { PreviewSwitcher } from "./components/PreviewSwitcher/PreviewSwitcher";
import { Router } from "./routing/Router";

function App() {
  return (
    <>
      <PreviewSwitcher />
      <Router />
    </>
  );
}

export default App;
