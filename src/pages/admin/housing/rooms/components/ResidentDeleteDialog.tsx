import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import type { Resident } from "@/models/resident";
import { useState } from "react";

interface ResidentDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    buildingId: string;
    roomId: string;
    resident: Resident | null;
    onDeleted: () => void;
}

export default function ResidentDeleteDialog({ open, onOpenChange, buildingId, roomId, resident, onDeleted }: ResidentDeleteDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!resident) return;
        setLoading(true);
        try {
            await $api.delete(`/housing/${buildingId}/rooms/${roomId}/residents`, {
                data: { resident_id: resident.id },
            });
            toast.success("Жилец выселен");
            onOpenChange(false);
            onDeleted();
        } catch {
            toast.error("Ошибка при выселении жильца");
        } finally {
            setLoading(false);
        }
    };

    if (!resident) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Выселить жильца?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы уверены, что хотите выселить <strong>{resident.full_name}</strong>?
                        Дата выселения будет установлена на сегодня.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Отмена</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive text-white hover:bg-destructive/90"
                    >
                        {loading ? "Выселение..." : "Выселить"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
