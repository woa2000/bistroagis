import { createRoot } from "react-dom/client";
import App from "./App";
import SimpleApp from "./SimpleApp";
import "./index.css";

// Use SimpleApp para debug se houver problemas
const AppToRender = window.location.search.includes('simple') ? SimpleApp : App;

console.log("Main.tsx loading...", {
  isSimple: window.location.search.includes('simple'),
  AppToRender: AppToRender.name
});

try {
  createRoot(document.getElementById("root")!).render(<AppToRender />);
  console.log("App rendered successfully");
} catch (error) {
  console.error("Error rendering app:", error);
  // Fallback para app simples em caso de erro
  createRoot(document.getElementById("root")!).render(<SimpleApp />);
}
