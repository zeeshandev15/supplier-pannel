import { Product } from '@/redux/slices/productSlice';
import { createAsyncThunk, unwrapResult } from '@reduxjs/toolkit';

import axiosInstance from '@/lib/axios/axiosInstance';

export const createProduct = createAsyncThunk('create/products', async (formData: FormData, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.post('/api/products', formData);
    return result;
  } catch (err: any) {
    const errMessage = err?.response.data.messsage || err.messsage || 'Something Went Wrong';
    return thunkAPI.rejectWithValue(errMessage);
  }
});
export const fetchProducts = createAsyncThunk('fetch/products', async (_, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.get('/api/products');
    return result;
  } catch (err: any) {
    const errmessage = err?.response.data.message || err.message || 'something went wrong';
    return thunkAPI.rejectWithValue(errmessage);
  }
});

export const updateProducts = createAsyncThunk(
  'update/product',
  async ({ id, data }: { id: string; data: FormData }, thunkAPI) => {
    try {
      const { data: result } = await axiosInstance.put(`/api/products/${id}`, data);
      return result;
    } catch (err: any) {
      const errmessage = err?.response.data.image || err.message || 'something went wrong';
      return thunkAPI.rejectWithValue(errmessage);
    }
  }
);

export const deleteProduct = createAsyncThunk('delete/product', async (id: string, thunkAPI) => {
  try {
    const { data: result } = await axiosInstance.delete(`/api/products/${id}`);
    return result;
  } catch (err: any) {
    const errmessage = err?.response.data.message || err.message || 'something Went Wrong';
    return thunkAPI.rejectWithValue(errmessage);
  }
});
