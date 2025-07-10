import { createRoot } from "react-dom/client";
import App from "./App";
import SimpleApp from "./SimpleApp";
import "./index.css";

// Use SimpleApp para debug se houver problemas
const AppToRender = window.location.search.includes('simple') ? SimpleApp : App;

createRoot(document.getElementById("root")!).render(<AppToRender />);
