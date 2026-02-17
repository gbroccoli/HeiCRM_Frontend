import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import type { Room } from "@/models/room";
import { useState } from "react";

interface RoomDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    buildingId: string;
    room: Room | null;
    onDeleted: () => void;
}

export default function RoomDeleteDialog({ open, onOpenChange, buildingId, room, onDeleted }: RoomDeleteDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!room) return;
        setLoading(true);
        try {
            await $api.delete(`/housing/${buildingId}/rooms/${room.id}`);
            toast.success("Комната удалена");
            onOpenChange(false);
            onDeleted();
        } catch {
            toast.error("Ошибка при удалении комнаты");
        } finally {
            setLoading(false);
        }
    };

    if (!room) return null;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Удалить комнату?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы уверены, что хотите удалить комнату <strong>{room.room_number}</strong>?
                        Все жильцы будут удалены. Это действие нельзя отменить.
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
