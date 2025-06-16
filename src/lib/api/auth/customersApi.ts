import { createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance from '@/lib/axios/axiosInstance';

export const createCustomer = createAsyncThunk('create/customer', async (formData: FormData, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.post('/api/customer', formData);
    return result;
  } catch (err: any) {
    const errorMessage = err?.response.data.message || err.message || 'Something Went Wrong';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const fetchCustomer = createAsyncThunk('fetch/customers', async (_, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.get('/api/customer');
    return result;
  } catch (err: any) {
    const errorMessage = err?.response.data.message || err.message;
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const updateCustomers = createAsyncThunk(
  'update/customers',
  async ({ id, data }: { id: string; data: any }, thunkAPI) => {
    try {
      const { data: result } = await axiosInstance.put(`/api/customer/${id}`, data);
      return result;
    } catch (err: any) {
      const errorMessage = err?.response.data.message || err.message || 'Something Went Wrong';
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const deleteCustomer = createAsyncThunk('delete/customer', async (id: string, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.delete(`/api/customer/${id}`);
    return result;
  } catch (err: any) {
    const errorMessage = err?.response.data.message || err.message || 'SomeThing Went Wrong';
    return thunkAPI.rejectWithValue(errorMessage);
  }
});
