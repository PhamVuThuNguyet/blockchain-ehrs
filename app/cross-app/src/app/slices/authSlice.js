import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuth: false,
  user: {},
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      return {
        isAuth: true,
        user: action.payload,
      };
    },
    logout: (state, action) => {
      return {
        isAuth: false,
        user: {},
      };
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authReducer = authSlice.reducer;