import { createBrowserRouter } from "react-router-dom";
import LaunchPage from "./app/pages/LaunchPage";
import ModeSelection from "./app/pages/ModeSelection";
import WorkMode from "./app/pages/WorkMode";
import DestressMode from "./app/pages/DestressMode";
import ZenGarden from "./app/pages/ZenGarden";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LaunchPage />,
  },
  {
    path: "/mode-selection",
    element: <ModeSelection />,
  },
  {
    path: "/work-mode",
    element: <WorkMode />,
  },
  {
    path: "/destress-mode",
    element: <DestressMode />,
  },
  {
    path: "/zen-garden",
    element: <ZenGarden />,
  },
]);