import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoute = () => {
    const { user } = useSelector((state: RootState) => state.user)
    console.log(user)
    if (!user) {
        return <Navigate to="/login" replace/>
    }

    return <Outlet />
}