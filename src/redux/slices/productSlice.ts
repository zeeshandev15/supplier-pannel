import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { createProduct, deleteProduct, fetchProducts, updateProducts } from '@/lib/api/auth/productsApi';

export interface Product {
  _id: string;
  title: string;
  description: string;
  date: string;
  price: string;
  image: string;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

interface productResponse {
  product: Product[];
  message?: string;
  success?: boolean;
}
const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(updateProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action: PayloadAction<productResponse>) => {
      state.loading = false;
      state.products = action.payload.product;
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Failed to create Product';
    });
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<productResponse>) => {
      state.loading = false;
      state.products = action.payload.product;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Failed to fetch Products';
    });

    builder.addCase(updateProducts.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      const index = state.products.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) state.products[index] = action.payload;
    });
    builder.addCase(updateProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Failed to Update product';
    });
    builder.addCase(deleteProduct.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
      state.loading = false;
      if (Array.isArray(state.products)) {
        state.products = state.products.filter((p) => p._id !== action.payload.id);
      }
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error.message || 'Failed to delete product';
    });
  },
});

export const { clearAuthState } = productSlice.actions;
export default productSlice.reducer;
