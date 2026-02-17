import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Парсит дату из API, поддерживая форматы:
 *  - ISO 8601: "2025-01-15T10:30:00Z"
 *  - yyyy-mm-dd: "2025-01-15"
 *  - dd.mm.yyyy: "15.01.2025"
 *  - dd.mm.yyyy HH:MM:SS: "15.01.2025 10:30:00"
 */
export function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null

  // dd.mm.yyyy или dd.mm.yyyy HH:MM:SS
  const dotMatch = value.match(/^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}):?(\d{2})?)?$/)
  if (dotMatch) {
    const [, dd, mm, yyyy, hh, min, ss] = dotMatch
    return new Date(
      Number(yyyy), Number(mm) - 1, Number(dd),
      Number(hh || 0), Number(min || 0), Number(ss || 0)
    )
  }

  // ISO или yyyy-mm-dd — Date конструктор справится
  const d = new Date(value)
  if (!isNaN(d.getTime())) return d

  return null
}

/** Форматирует дату как "15.01.2025" */
export function formatDate(value: string | null | undefined): string {
  const d = parseDate(value)
  if (!d) return "—"
  return d.toLocaleDateString("ru-RU")
}

/** Форматирует дату-время как "15.01.2025, 10:30:00" */
export function formatDateTime(value: string | null | undefined): string {
  const d = parseDate(value)
  if (!d) return "—"
  return d.toLocaleString("ru-RU")
}

/**
 * Конвертирует дату API в формат для input[type="date"] (yyyy-mm-dd).
 * Нужно для корректного отображения в полях ввода.
 */
export function toInputDate(value: string | null | undefined): string {
  const d = parseDate(value)
  if (!d) return ""
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}
