import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/users/redux/userSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
  },
  // 개발 환경에서 직렬화 검사 비활성화 (개발 편의성)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: process.env.NODE_ENV !== 'production',
    }),
});

// 스토어의 RootState와 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 