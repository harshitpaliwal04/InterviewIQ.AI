import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
        name: 'user',
        initialState: {
                userData: null
        },
        reducers: {
                setuserdata: (state, action) => {
                        state.userData = action.payload
                },
                clearuserdata: (state) => {
                        state.userData = null
                }
        }
});

export const { setuserdata, clearuserdata } = userSlice.actions
export default userSlice.reducer