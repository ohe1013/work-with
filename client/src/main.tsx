import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

import "./tailwind.css";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import React from "react";
import ReactDOM from "react-dom/client";
const router = createBrowserRouter(routes);
const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>
);
