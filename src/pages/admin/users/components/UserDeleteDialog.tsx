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
import type { UserProfile } from "@/models/user";
import { useState } from "react";

interface UserDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: UserProfile | null;
    onDeleted: () => void;
}

export default function UserDeleteDialog({ open, onOpenChange, user, onDeleted }: UserDeleteDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await $api.delete(`/users/${user.id}`);
            toast.success("Пользователь удалён");
            onOpenChange(false);
            onDeleted();
        } catch {
            toast.error("Ошибка при удалении пользователя");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const fullName = [user.last_name, user.first_name, user.middle_name].filter(Boolean).join(" ");

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы уверены, что хотите удалить пользователя <strong>{fullName}</strong>?
                        Это действие нельзя отменить.
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
