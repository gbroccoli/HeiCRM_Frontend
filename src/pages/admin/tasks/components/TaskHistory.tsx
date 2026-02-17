import { useCallback, useEffect, useState } from "react";
import { $api } from "@/api/axios";
import { Skeleton } from "@/components/ui/skeleton";
import { STATUS_LABELS } from "@/models/task";
import type { TaskHistoryEntry } from "@/models/task";

interface TaskHistoryProps {
    taskId: number;
}

export default function TaskHistory({ taskId }: TaskHistoryProps) {
    const [history, setHistory] = useState<TaskHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = useCallback(async () => {
        try {
            const { data } = await $api.get(`/tasks/${taskId}/history`);
            setHistory(data.data ?? []);
        } catch {
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (history.length === 0) {
        return <p className="text-muted-foreground text-center py-6">История изменений пуста</p>;
    }

    return (
        <div className="space-y-4">
            {history.map((entry) => (
                <div key={entry.id} className="relative flex gap-4 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                        <div className="size-3 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="w-px flex-1 bg-border" />
                    </div>
                    <div className="space-y-1 pb-2">
                        <div className="text-sm">
                            <span className="font-medium">{entry.user_name}</span>{" "}
                            изменил статус:{" "}
                            <span className="text-muted-foreground">
                                {STATUS_LABELS[entry.old_status] ?? entry.old_status}
                            </span>
                            {" → "}
                            <span className="font-medium">
                                {STATUS_LABELS[entry.new_status] ?? entry.new_status}
                            </span>
                        </div>
                        {entry.comment && (
                            <p className="text-sm text-muted-foreground">{entry.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            {new Date(entry.created_at).toLocaleString("ru-RU")}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
