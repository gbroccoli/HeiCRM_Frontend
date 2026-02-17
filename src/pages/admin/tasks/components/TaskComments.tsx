import { useCallback, useEffect, useState } from "react";
import { $api } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Send } from "lucide-react";
import type { TaskComment } from "@/models/task";
import { formatDateTime } from "@/lib/utils";

interface TaskCommentsProps {
    taskId: number;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
    const [comments, setComments] = useState<TaskComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const { data } = await $api.get(`/tasks/${taskId}/comments`);
            setComments(data.data ?? []);
        } catch {
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSend = async () => {
        if (!text.trim()) return;
        setSending(true);
        try {
            await $api.post(`/tasks/${taskId}/comments`, { comment_text: text.trim() });
            setText("");
            toast.success("Комментарий добавлен");
            fetchComments();
        } catch {
            toast.error("Ошибка при добавлении комментария");
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comments.length === 0 && (
                <p className="text-muted-foreground text-center py-6">Комментариев пока нет</p>
            )}

            {comments.map((c) => (
                <div key={c.id} className="rounded-md border p-3 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{c.author_name}</span>
                        <span className="text-muted-foreground">
                            {formatDateTime(c.created_at)}
                        </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{c.comment_text}</p>
                </div>
            ))}

            <div className="flex gap-2">
                <Textarea
                    placeholder="Написать комментарий..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={2}
                    className="flex-1"
                />
                <Button onClick={handleSend} disabled={sending || !text.trim()} size="icon" className="shrink-0 self-end">
                    <Send className="size-4" />
                </Button>
            </div>
        </div>
    );
}
