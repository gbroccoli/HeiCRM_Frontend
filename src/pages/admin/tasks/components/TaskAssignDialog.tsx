import { useEffect, useState } from "react";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import type { UserProfile } from "@/models/user";
import type { PaginatedResponse } from "@/models/api";

interface TaskAssignDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskId: number;
    onUpdated: () => void;
}

export default function TaskAssignDialog({ open, onOpenChange, taskId, onUpdated }: TaskAssignDialogProps) {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [usersLoading, setUsersLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        setUsersLoading(true);
        const STAFF_ROLE_IDS = [1, 2]; // Администратор, Менеджер
        $api.get<PaginatedResponse<UserProfile>>("/users/", { params: { page: 1, page_size: 100 } })
            .then(({ data }) => {
                const staff = (data.data.items ?? []).filter((u) => STAFF_ROLE_IDS.includes(u.role_id));
                setUsers(staff);
            })
            .catch(() => setUsers([]))
            .finally(() => setUsersLoading(false));
    }, [open]);

    const handleSubmit = async () => {
        if (!selectedUserId) return;
        setLoading(true);
        try {
            await $api.put(`/tasks/${taskId}/assign`, {
                assignee_id: Number(selectedUserId),
            });
            toast.success("Исполнитель назначен");
            onOpenChange(false);
            setSelectedUserId("");
            onUpdated();
        } catch {
            toast.error("Ошибка при назначении исполнителя");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Назначить исполнителя</DialogTitle>
                    <DialogDescription>
                        Выберите сотрудника для назначения на заявку
                    </DialogDescription>
                </DialogHeader>
                <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={usersLoading}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={usersLoading ? "Загрузка..." : "Выберите пользователя"} />
                    </SelectTrigger>
                    <SelectContent>
                        {users.map((u) => {
                            const fullName = [u.last_name, u.first_name].filter(Boolean).join(" ") || u.email;
                            return (
                                <SelectItem key={u.id} value={String(u.id)}>
                                    {fullName} ({u.role_name})
                                </SelectItem>
                            );
                        })}
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Отмена
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading || !selectedUserId}>
                        {loading ? "Назначение..." : "Назначить"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
