import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $api } from "@/api/axios";
import { toast } from "sonner";
import type { Resident } from "@/models/resident";

const transferSchema = z.object({
    new_building_id: z.string().min(1, "Обязательное поле"),
    new_room_id: z.string().min(1, "Обязательное поле"),
});

type TransferFormValues = z.infer<typeof transferSchema>;

interface ResidentTransferDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    buildingId: string;
    roomId: string;
    resident: Resident | null;
    onTransferred: () => void;
}

export default function ResidentTransferDialog({
    open, onOpenChange, buildingId, roomId, resident, onTransferred,
}: ResidentTransferDialogProps) {
    const form = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema),
        defaultValues: { new_building_id: "", new_room_id: "" },
    });

    const onSubmit = async (values: TransferFormValues) => {
        if (!resident) return;
        try {
            await $api.post(
                `/housing/${buildingId}/rooms/${roomId}/residents/transfer`,
                {
                    resident_id: resident.id,
                    new_building_id: Number(values.new_building_id),
                    new_room_id: Number(values.new_room_id),
                },
            );
            toast.success("Жилец переведён");
            onOpenChange(false);
            form.reset();
            onTransferred();
        } catch {
            toast.error("Ошибка при переводе жильца");
        }
    };

    if (!resident) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Перевод жильца</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Перевод: <strong>{resident.full_name}</strong>
                </p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="new_building_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ID нового здания</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} placeholder="1" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="new_room_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>ID новой комнаты</FormLabel>
                                    <FormControl>
                                        <Input type="number" min={1} placeholder="5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Отмена
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Перевод..." : "Перевести"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
