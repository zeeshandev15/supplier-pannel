import { createAsyncThunk } from '@reduxjs/toolkit';

import { LoginFormValues, ResetFormValues } from '@/lib/(schemas)/auth.schema';
import axiosInstance from '@/lib/axios/axiosInstance';

// registerUser
export const registerUser = createAsyncThunk('users/register', async (updatedValues: any, thunkApi) => {
  try {
    const { data: result } = await axiosInstance.post('/api/auth/register', updatedValues);
    return result;
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || err.message || 'Something went Wrong';
    return thunkApi.rejectWithValue(errorMessage);
  }
});

// otpVerification
export const otpVerification = createAsyncThunk('user/otpverification', async (otp: string, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.post('/api/auth/otpverification', {
      otp,
    });
    return result;
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || err.message || 'Something Went Wrong';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// loginUser
export const loginUser = createAsyncThunk('user/login', async (credentials: LoginFormValues, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.post('/api/auth/login', credentials);
    return result;
  } catch (err: any) {
    const errorMessage = err?.response.data.message || err.message || 'SomeThing Went Wrong';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// resetPassword
export const resetPassword = createAsyncThunk('user/reset', async (values: ResetFormValues, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.put('/api/auth/password/reset', values);
    return result;
  } catch (err: any) {
    const errorMessage = err?.response.data.message || err.message || 'SomeThing Went Wrong';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// logoutUser
export const logoutUser = createAsyncThunk('user/logout', async (_, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.get('/api/auth/logout', {
      withCredentials: true,
    });
    return result;
  } catch (err: any) {
    const errorMessage = err?.response.data.message || err.message || 'SomeThing Went Wrong';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});
