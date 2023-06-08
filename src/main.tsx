import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

import "./tailwind.css";
import { worker } from "./mocks/worker";

if (import.meta.env.DEV) {
    worker.start();
}
const router = createBrowserRouter(routes);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
