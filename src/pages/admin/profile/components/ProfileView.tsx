import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/models/user";
import { formatDate } from "@/lib/utils";

interface ProfileViewProps {
    profile: UserProfile;
}

const getInitials = (profile: UserProfile) => {
    const first = profile.first_name?.[0] || "";
    const last = profile.last_name?.[0] || "";
    return (first + last).toUpperCase() || profile.name?.[0]?.toUpperCase() || "?";
};

const ProfileView = ({ profile }: ProfileViewProps) => {
    return (
        <div className="space-y-6 pt-4">
            <Card>
                <CardContent className="flex items-center gap-6 pt-6">
                    <Avatar className="size-24">
                        <AvatarImage
                            src={profile.avatar_url || undefined}
                            alt={profile.name}
                        />
                        <AvatarFallback className="text-2xl">
                            {getInitials(profile)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold">{profile.name}</h2>
                        <p className="text-muted-foreground text-sm">{profile.email}</p>
                        <Badge variant="secondary">{profile.role_name}</Badge>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Личная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoRow label="Фамилия" value={profile.last_name} />
                    <InfoRow label="Имя" value={profile.first_name} />
                    <InfoRow label="Отчество" value={profile.middle_name} />
                    <Separator />
                    <InfoRow label="Телефон" value={profile.phone} />
                    <InfoRow label="Дата рождения" value={formatDate(profile.date_of_birth ?? null)} />
                    <Separator />
                    <InfoRow label="Дата регистрации" value={formatDate(profile.created_at)} />
                </CardContent>
            </Card>
        </div>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="flex justify-between">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="text-sm font-medium">{value || "—"}</span>
    </div>
);

export default ProfileView;
