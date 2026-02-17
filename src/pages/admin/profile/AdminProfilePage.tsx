import { useEffect, useState } from "react";
import { $api } from "@/api/axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileView from "./components/ProfileView";
import ProfileEditForm from "./components/ProfileEditForm";
import type { UserProfile } from "@/models/user";
import type { ApiResponse } from "@/models/api";

const AdminProfilePage = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await $api.get<ApiResponse<UserProfile>>("/users/me");
            setProfile(response.data.data);
            setError(null);
        } catch {
            setError("Не удалось загрузить данные профиля");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="p-6">
                <p className="text-destructive">{error || "Профиль не найден"}</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Профиль</h1>
            <Tabs defaultValue="view">
                <TabsList>
                    <TabsTrigger value="view">Профиль</TabsTrigger>
                    <TabsTrigger value="edit">Настройки</TabsTrigger>
                </TabsList>
                <TabsContent value="view">
                    <ProfileView profile={profile} />
                </TabsContent>
                <TabsContent value="edit">
                    <ProfileEditForm
                        profile={profile}
                        onUpdated={fetchProfile}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminProfilePage;
