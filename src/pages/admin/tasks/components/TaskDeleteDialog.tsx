import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import type { Task } from "@/models/task";
import { useState } from "react";

interface TaskDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
    onDeleted: () => void;
}

export default function TaskDeleteDialog({ open, onOpenChange, task, onDeleted }: TaskDeleteDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!task) return;
        setLoading(true);
        try {
            await $api.delete(`/tasks/${task.id}`);
            toast.success("Заявка удалена");
            onOpenChange(false);
            onDeleted();
        } catch {
            toast.error("Ошибка при удалении заявки");
        } finally {
            setLoading(false);
        }
    };

    if (!task) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить заявку?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы уверены, что хотите удалить заявку <strong>#{task.id}</strong> ({task.task_type})?
                        Будут удалены все комментарии, история и вложения. Это действие нельзя отменить.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {loading ? "Удаление..." : "Удалить"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
