import { Outlet, useLoaderData } from "react-router";

const Layout = () => {
    // Получаем данные из loader'а
    const data = useLoaderData() as {
        userRole: string;
        error?: string;
    };

    // Можете использовать data.userRole для условного рендеринга или передачи в дочерние компоненты
    // Например через context или props

    if (data.error) {
        console.error('Error loading user role:', data.error);
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default Layout