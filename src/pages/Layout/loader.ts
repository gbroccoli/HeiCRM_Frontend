import $api from "@/api/axios";
import { redirect } from "react-router";
import type { AuthMeResponse } from "@/models/api";

function getRoleBasedPath(role: string): string {
  if (role === "admin") return "/dashboard/admin";
  if (role === "manager") return "/dashboard/operation";
  return "/dashboard/user";
}

/**
 * Loader для страницы логина — если уже авторизован, редиректит на dashboard
 */
export async function loginLoader() {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const res = await $api.get<AuthMeResponse>("/auth/me");
    if (res.status === 200 && res.data?.role) {
      throw redirect(getRoleBasedPath(res.data.role));
    }
  } catch (error) {
    if (error instanceof Response) throw error;
    // Токен невалиден — остаёмся на логине
  }
  return null;
}

/**
 * Loader для dashboard layout
 * Загружает роль пользователя и редиректит на соответствующую страницу
 */
export async function dashboardLoader({ request }: { request: Request }) {
  try {
    const res = await $api.get<AuthMeResponse>('/auth/me');

    if (res.status === 200) {
      const userRole = res.data;
      const currentUrl = new URL(request.url);
      const currentPath = currentUrl.pathname;

      const correctPath = userRole?.role ? getRoleBasedPath(userRole.role) : '';

      // Если пользователь на /dashboard (без вложенного пути), редиректим на его роль
      if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
        if (correctPath) {
          throw redirect(correctPath);
        }
      }

      // Проверяем, имеет ли пользователь доступ к текущей странице
      // Если пользователь не на своей странице и не на дочерних путях своей роли
      if (correctPath && !currentPath.startsWith(correctPath)) {
        throw redirect(correctPath);
      }

      return {
        userRole: userRole,
      };
    }

    // Если статус не 200, редиректим на логин
    throw redirect('/');
  } catch (error) {
    // Если это redirect, пробрасываем дальше
    if (error instanceof Response) {
      throw error;
    }

    // В случае ошибки (например, 401) редиректим на логин
    throw redirect('/');
  }
}
