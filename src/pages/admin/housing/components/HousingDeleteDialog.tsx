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
import type { Housing } from "@/models/housing";
import { useState } from "react";

interface HousingDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    item: Housing | null;
    onDeleted: () => void;
}

export default function HousingDeleteDialog({ open, onOpenChange, item, onDeleted }: HousingDeleteDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!item) return;
        setLoading(true);
        try {
            await $api.delete(`/housing/${item.id}`);
            toast.success("Здание удалено");
            onOpenChange(false);
            onDeleted();
        } catch {
            toast.error("Ошибка при удалении здания");
        } finally {
            setLoading(false);
        }
    };

    if (!item) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить здание?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы уверены, что хотите удалить здание <strong>{item.address}</strong>?
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
