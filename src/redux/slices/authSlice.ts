import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { loginUser, logoutUser, otpVerification, registerUser, resetPassword } from '@/lib/api/auth/authApi';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  accountVerified: boolean;
  phone: string;
}

interface AuthResponse {
  user: User;
  token: string;
  message?: string;
  success?: boolean;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(otpVerification.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = false;
      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Registration failed';
    });

    builder.addCase(otpVerification.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(otpVerification.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'otpVerification Failed';
    });

    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Login Failed';
    });

    builder.addCase(resetPassword.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.user = action.payload?.user;
      state.token = action.payload?.token;
    });

    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Token Invalid';
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
      state.token = null;
      state.user = null;
    });

    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Logout Failed';
    });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
