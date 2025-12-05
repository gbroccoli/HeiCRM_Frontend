import { useEffect, useState } from "react";

/**
 * Hook для работы с media queries
 * @param query - CSS media query строка (например: "(min-width: 768px)")
 * @returns boolean - true если media query совпадает, false если нет
 *
 * @example
 * const isMobile = useMediaQuery("(max-width: 768px)");
 * const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
 * const isDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Проверяем поддержку window.matchMedia на сервере
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Проверяем поддержку
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // Обновляем состояние при изменении
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Устанавливаем начальное значение
    setMatches(mediaQuery.matches);

    // Подписываемся на изменения
    mediaQuery.addEventListener("change", handleChange);

    // Очищаем подписку
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
