import {Outlet} from "react-router";
import {useEffect} from "react";
import $api from "@/api/axios.ts";


const Layout = () => {

    const userRole = async () => {
        const res = await $api.get('/auth/role')

        if (res.status === 200) {
            return res.data;
        }
    }

    useEffect(() => {
        userRole().then()
    }, []);

    return (
        <>
            <Outlet />
        </>
    )
}

export default Layout