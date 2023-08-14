import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

import "./tailwind.css";
// import { worker } from "./mocks/worker";

// if (import.meta.env.DEV) {
//     worker.start();
// }
import { RecoilRoot } from "recoil";

const router = createBrowserRouter(routes);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
);
