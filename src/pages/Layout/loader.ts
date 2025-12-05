import $api from "@/api/axios";

/**
 * Loader для dashboard layout
 * Загружает роль пользователя перед рендерингом
 */
export async function dashboardLoader() {
  try {
    const res = await $api.get('/auth/role');

    if (res.status === 200) {
      return {
        userRole: res.data,
      };
    }

    // Если статус не 200, возвращаем null
    return { userRole: null };
  } catch (error) {
    // В случае ошибки (например, 401) можно редиректить на логин
    // throw redirect('/');

    // Или вернуть ошибку для обработки в компоненте
    return { userRole: null, error: 'Failed to load user role' };
  }
}
