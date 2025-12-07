import $api from "@/api/axios";
import { redirect } from "react-router";

/**
 * Loader для dashboard layout
 * Загружает роль пользователя и редиректит на соответствующую страницу
 */
export async function dashboardLoader({ request }: { request: Request }) {
  try {
    const res = await $api.get('/auth/me');

    if (res.status === 200) {
      const userRole = res.data;
      const currentUrl = new URL(request.url);
      const currentPath = currentUrl.pathname;

      // Определяем правильный путь для роли
      let correctPath = '';
      if (userRole?.role === "admin") {
        correctPath = "/dashboard/admin";
      } else if (userRole?.role === "user") {
        correctPath = "/dashboard/user";
      } else if (userRole?.role === "manager") {
        correctPath = "/dashboard/operation";
      }

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
