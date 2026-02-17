import { useState } from "react";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS, STATUS_TRANSITIONS } from "@/models/task";
import type { TaskStatus } from "@/models/task";

interface TaskStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskId: number;
    currentStatus: TaskStatus;
    onUpdated: () => void;
}

export default function TaskStatusDialog({ open, onOpenChange, taskId, currentStatus, onUpdated }: TaskStatusDialogProps) {
    const [newStatus, setNewStatus] = useState<string>("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const allowedStatuses = STATUS_TRANSITIONS[currentStatus] ?? [];

    const handleSubmit = async () => {
        if (!newStatus) return;
        setLoading(true);
        try {
            await $api.put(`/tasks/${taskId}/status`, {
                status: newStatus,
                comment: comment.trim() || undefined,
            });
            toast.success("Статус обновлён");
            onOpenChange(false);
            setNewStatus("");
            setComment("");
            onUpdated();
        } catch {
            toast.error("Ошибка при смене статуса");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Сменить статус</DialogTitle>
                    <DialogDescription>
                        Текущий статус: {STATUS_LABELS[currentStatus]}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Выберите новый статус" />
                        </SelectTrigger>
                        <SelectContent>
                            {allowedStatuses.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {STATUS_LABELS[s]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Textarea
                        placeholder="Комментарий (необязательно)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !newStatus}>
                        {loading ? "Сохранение..." : "Сохранить"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
