import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';
import productReducer from './slices/productSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer,
  products: productReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
