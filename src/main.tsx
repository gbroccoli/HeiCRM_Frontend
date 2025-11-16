import { StrictMode } from 'react'
import {createRoot} from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import './index.css'
import LoginPage from "@/pages/Login/LoginPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
