import { createBrowserRouter } from "react-router";
import LaunchPage from "./pages/LaunchPage";
import ModeSelection from "./pages/ModeSelection";
import WorkMode from "./pages/WorkMode";
import DestressMode from "./pages/DestressMode";
import ZenGarden from "./pages/ZenGarden";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LaunchPage,
  },
  {
    path: "/mode-selection",
    Component: ModeSelection,
  },
  {
    path: "/work-mode",
    Component: WorkMode,
  },
  {
    path: "/destress-mode",
    Component: DestressMode,
  },
  {
    path: "/zen-garden",
    Component: ZenGarden,
  },
]);
