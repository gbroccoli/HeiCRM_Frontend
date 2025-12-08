import { StrictMode } from 'react'
import {createRoot} from "react-dom/client";
import {createBrowserRouter, Outlet} from "react-router";
import { RouterProvider } from "react-router/dom";
import './index.css'
import LoginPage from "@/pages/Login/LoginPage.tsx";
import Layout, { dashboardLoader } from "@/pages/Layout";
import UserInfo from "@/components/UserInfo.tsx";

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
                element: <div><Outlet /></div>,
                children: [
                    {
                      path: "",
                      element: (
                          <div className="p-6 space-y-4">
                              <h1 className="text-2xl font-bold">Панель администратора</h1>
                              <UserInfo />
                          </div>
                      )
                    },
                    {
                        path: "profile",
                        element: (
                            <div className="p-6 space-y-4">
                                <h1 className="text-2xl font-bold">Профиль администратора</h1>
                                <UserInfo />
                            </div>
                        )
                    }
                ]
            },
            {
                path: "user",
                element: (
                    <div className="p-6 space-y-4">
                        <h1 className="text-2xl font-bold">Панель пользователя</h1>
                        <UserInfo />
                    </div>
                ),
                children: [
                    {
                        path: "profile",
                        element: (
                            <div className="p-6 space-y-4">
                                <h1 className="text-2xl font-bold">Профиль пользователя</h1>
                                <UserInfo />
                            </div>
                        )
                    }
                ]
            },
            {
                path: "operation",
                element: <Outlet />,
                children: [
                    {
                        path: "",
                        element: (
                            <div className="p-6 space-y-4">
                                <h1 className="text-2xl font-bold">Панель оператора</h1>
                                <UserInfo />
                            </div>
                        )
                    },
                    {
                        path: "profile",
                        element: (
                            <div className="p-6 space-y-4">
                                <h1 className="text-2xl font-bold">Панель оператора 1</h1>
                                <UserInfo />
                            </div>
                        )
                    }
                ]
            }
        ]
    }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
