import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
    return (
        <div className="p-6 space-y-4">
            {/* Заголовок */}
            <Skeleton className="h-8 w-64" />

            {/* Карточка с информацией о пользователе */}
            <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex flex-col gap-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-20" />
            </div>
        </div>
    );
};

export default DashboardSkeleton;
