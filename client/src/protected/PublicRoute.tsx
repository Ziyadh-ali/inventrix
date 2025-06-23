import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export const PublicRoute = () => {
    const { user } = useSelector((state: RootState) => state.user)

    if (!user) {
        return <Outlet />
    }

    return <Navigate to="/dashboard/customers" replace/>
}