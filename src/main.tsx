import { StrictMode } from 'react'
import {createRoot} from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import './index.css'
import LoginPage from "@/pages/Login/LoginPage.tsx";
import Layout, { dashboardLoader } from "@/pages/Layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/dashboard",
        element: <Layout />,
        loader: dashboardLoader,
        children: [
            {
                path: "admin",
                element: <div>Админ</div>
            },
            {
                path: "user",
                element: <div>Юзер</div>,
                children: [
                    {
                        path: "profile",
                        element: <div>профиль</div>
                    }
                ]
            },
            {
                path: "operation",
                element: <div>Оператор</div>
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
