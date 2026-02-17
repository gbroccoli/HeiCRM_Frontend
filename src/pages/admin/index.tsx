import type {RouteObject} from "react-router";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminProfilePage from "./profile/AdminProfilePage";
import AdminUsersPage from "./users/AdminUsersPage";
import AdminUserCreatePage from "./users/AdminUserCreatePage";
import AdminUserEditPage from "./users/AdminUserEditPage";
import AdminHousingPage from "./housing/AdminHousingPage";
import AdminHousingCreatePage from "./housing/AdminHousingCreatePage";
import AdminHousingEditPage from "./housing/AdminHousingEditPage";
import AdminRoomsPage from "./housing/rooms/AdminRoomsPage";
import AdminRoomCreatePage from "./housing/rooms/AdminRoomCreatePage";
import AdminRoomEditPage from "./housing/rooms/AdminRoomEditPage";
import AdminRoomDetailPage from "./housing/rooms/AdminRoomDetailPage";
import AdminResidentCreatePage from "./housing/residents/AdminResidentCreatePage";
import AdminResidentEditPage from "./housing/residents/AdminResidentEditPage";
import AdminTasksPage from "./tasks/AdminTasksPage";
import AdminTaskCreatePage from "./tasks/AdminTaskCreatePage";
import AdminTaskDetailPage from "./tasks/AdminTaskDetailPage";
import AdminTaskEditPage from "./tasks/AdminTaskEditPage";

const admin_router: RouteObject[] = [
    {
        index: true,
        element: <AdminDashboardPage />
    },
    {
        path: "profile",
        element: <AdminProfilePage />
    },
    // Users
    {
        path: "users",
        element: <AdminUsersPage />
    },
    {
        path: "users/create",
        element: <AdminUserCreatePage />
    },
    {
        path: "users/:id/edit",
        element: <AdminUserEditPage />
    },
    // Housing
    {
        path: "housing",
        element: <AdminHousingPage />
    },
    {
        path: "housing/create",
        element: <AdminHousingCreatePage />
    },
    {
        path: "housing/:id/edit",
        element: <AdminHousingEditPage />
    },
    // Rooms
    {
        path: "housing/:id/rooms",
        element: <AdminRoomsPage />
    },
    {
        path: "housing/:id/rooms/create",
        element: <AdminRoomCreatePage />
    },
    {
        path: "housing/:id/rooms/:roomId",
        element: <AdminRoomDetailPage />
    },
    {
        path: "housing/:id/rooms/:roomId/edit",
        element: <AdminRoomEditPage />
    },
    // Residents
    {
        path: "housing/:id/rooms/:roomId/residents/create",
        element: <AdminResidentCreatePage />
    },
    {
        path: "housing/:id/rooms/:roomId/residents/:residentId/edit",
        element: <AdminResidentEditPage />
    },
    // Tasks
    {
        path: "tasks",
        element: <AdminTasksPage />
    },
    {
        path: "tasks/create",
        element: <AdminTaskCreatePage />
    },
    {
        path: "tasks/:taskId",
        element: <AdminTaskDetailPage />
    },
    {
        path: "tasks/:taskId/edit",
        element: <AdminTaskEditPage />
    }
]

export { admin_router };
