export type TaskStatus = "new" | "assigned" | "in_progress" | "completed" | "closed";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface Task {
    id: number;
    author_id: number;
    author_name: string;
    assignee_id: number | null;
    assignee_name: string | null;
    room_id: number | null;
    room_number: string | null;
    building_address: string | null;
    task_type: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
}

export interface TaskCreatePayload {
    task_type: string;
    description: string;
    priority: TaskPriority;
    room_id: number;
}

export interface TaskUpdatePayload {
    task_type?: string;
    description?: string;
    priority?: TaskPriority;
}

export interface TaskComment {
    id: number;
    task_id: number;
    author_id: number;
    author_name: string;
    comment_text: string;
    created_at: string;
}

export interface TaskHistoryEntry {
    id: number;
    task_id: number;
    user_id: number;
    user_name: string;
    old_status: TaskStatus;
    new_status: TaskStatus;
    comment: string | null;
    created_at: string;
}

export interface TaskAttachment {
    id: number;
    task_id: number;
    file_name: string;
    file_size: number;
    uploaded_by: number;
    uploaded_by_name: string;
    url: string;
    created_at: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
    new: "Новая",
    assigned: "Назначена",
    in_progress: "В работе",
    completed: "Завершена",
    closed: "Закрыта",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий",
    critical: "Критический",
};

export const PRIORITY_VARIANT: Record<TaskPriority, "default" | "secondary" | "destructive" | "outline"> = {
    critical: "destructive",
    high: "destructive",
    medium: "default",
    low: "secondary",
};

export const STATUS_VARIANT: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline"> = {
    new: "outline",
    assigned: "secondary",
    in_progress: "default",
    completed: "secondary",
    closed: "outline",
};

export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
    new: ["assigned", "in_progress"],
    assigned: ["in_progress", "closed"],
    in_progress: ["completed", "closed"],
    completed: ["closed"],
    closed: [],
};
