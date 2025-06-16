import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createCustomer, deleteCustomer, fetchCustomer, updateCustomers } from '@/lib/api/auth/customersApi';

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  location: string;
  phone: string;
  image: string;
}

interface CustomerResponse {
  customers: User[];
  message?: string;
  success?: boolean;
}

interface customerState {
  customers: User[];
  loading: boolean;
  error: string | null;
}
const initialState: customerState = {
  customers: [],
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    clearCustomerState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCustomers.pending, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deleteCustomer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCustomer.fulfilled, (state, action: PayloadAction<CustomerResponse>) => {
      state.loading = false;
      state.customers = action.payload.customers;
    });
    builder.addCase(createCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Failed to Create Customer';
    });

    builder.addCase(fetchCustomer.fulfilled, (state, action: PayloadAction<CustomerResponse>) => {
      state.loading = false;
      state.customers = action.payload.customers;
    });
    builder.addCase(fetchCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Failed to fetch';
    });

    builder.addCase(updateCustomers.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      const index = state.customers.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    });

    builder.addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
      state.loading = false;
      if (Array.isArray(state.customers)) {
        state.customers = state.customers.filter((customer) => customer._id !== action.payload.id);
      }
    });

    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Failed to delete customer';
    });
  },
});

export const { clearCustomerState } = customerSlice.actions;
export default customerSlice.reducer;
