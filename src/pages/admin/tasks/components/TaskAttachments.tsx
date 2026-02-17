import { useCallback, useEffect, useRef, useState } from "react";
import { $api } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Download, Trash2, Upload } from "lucide-react";
import type { TaskAttachment } from "@/models/task";
import { formatDate } from "@/lib/utils";

interface TaskAttachmentsProps {
    taskId: number;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function TaskAttachments({ taskId }: TaskAttachmentsProps) {
    const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const fetchAttachments = useCallback(async () => {
        try {
            const { data } = await $api.get(`/tasks/${taskId}/attachments`);
            setAttachments(data.data ?? []);
        } catch {
            setAttachments([]);
        } finally {
            setLoading(false);
        }
    }, [taskId]);

    useEffect(() => {
        fetchAttachments();
    }, [fetchAttachments]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_SIZE) {
            toast.error("Файл слишком большой. Максимум 10 МБ.");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            await $api.post(`/tasks/${taskId}/attachments`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Файл загружен");
            fetchAttachments();
        } catch {
            toast.error("Ошибка при загрузке файла");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const handleDownload = (attachment: TaskAttachment) => {
        window.open(attachment.url, "_blank");
    };

    const handleDelete = async (attachment: TaskAttachment) => {
        try {
            await $api.delete(`/tasks/${taskId}/attachments/${attachment.id}`);
            toast.success("Файл удалён");
            fetchAttachments();
        } catch {
            toast.error("Ошибка при удалении файла");
        }
    };

    if (loading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    onChange={handleUpload}
                />
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                >
                    <Upload className="size-4" />
                    {uploading ? "Загрузка..." : "Загрузить файл"}
                </Button>
            </div>

            {attachments.length === 0 && (
                <p className="text-muted-foreground text-center py-6">Вложений пока нет</p>
            )}

            {attachments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border p-3">
                    <div className="space-y-0.5">
                        <p className="text-sm font-medium">{a.file_name}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatFileSize(a.file_size)} · {a.uploaded_by_name} · {formatDate(a.created_at)}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDownload(a)}>
                            <Download className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(a)}>
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
