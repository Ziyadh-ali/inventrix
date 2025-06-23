import type { User, UserLogin } from "@/utils/interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



interface UserState {
    user: User | null;
}

const initialState: UserState = {
    user: JSON.parse(localStorage.getItem("user_details") || "null"),
}

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        userLogin: (state, action: PayloadAction<UserLogin>) => {
            state.user = action.payload;
            localStorage.setItem("user_details", JSON.stringify({ id: action.payload.id, email: action.payload.email }));
            localStorage.setItem("access_token", action.payload.accessToken);
        },
        userLogout: (state) => {
            state.user = null;
            localStorage.removeItem("user_details")
            localStorage.removeItem("access_token")
        }
    }
});

export const { userLogin, userLogout } = userSlice.actions;
export default userSlice.reducer;