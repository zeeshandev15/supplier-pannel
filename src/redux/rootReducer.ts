import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import customerReducer from './slices/customerSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
