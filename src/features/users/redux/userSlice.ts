import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../../types/user';
import { userService } from '../api/userService';

// 검색 파라미터 타입 정의
interface SearchParams {
  page_index?: number;
  page_size?: number;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
}

// 사용자 업데이트 파라미터 타입 정의
interface UserUpdateParams {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  address?: string;
}

// 상태 타입 정의
interface UserState {
  users: User[];
  selectedUser: User | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  searchParams: SearchParams;
}

// 초기 상태
const initialState: UserState = {
  users: [],
  selectedUser: null,
  totalCount: 0,
  isLoading: false,
  error: null,
  searchParams: {
    page_index: 1,
    page_size: 10
  }
};

// 비동기 액션 생성
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: SearchParams, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers({
        page_index: params.page_index || 1,
        page_size: params.page_size || 10,
        ...params
      });
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '사용자 목록 조회 실패');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '사용자 상세 조회 실패');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: UserUpdateParams }, { rejectWithValue, getState }) => {
    try {
      const response = await userService.updateUser(id, data);
      
      // 목업 데이터인 경우에도 UI에 반영할 수 있도록 현재 상태에서 사용자 정보 가져오기
      const state = getState() as { users: UserState };
      const currentUser = state.users.users.find(user => user.id === id) || 
                          state.users.selectedUser;
      
      if (!currentUser) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
      
      // 업데이트된 사용자 정보 생성
      const updatedUser: User = {
        ...currentUser,
        name: data.name || currentUser.name,
        email: data.email || currentUser.email,
        active: data.status === 'active' ? true : (data.status === 'inactive' ? false : currentUser.active),
        updated_at: new Date().toISOString()
      };
      
      return { id, response, updatedUser };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '사용자 수정 실패');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.deleteUser(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : '사용자 삭제 실패');
    }
  }
);

// 슬라이스 생성
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.searchParams = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 사용자 목록 조회
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.result_list;
        state.totalCount = action.payload.total_count;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 사용자 상세 조회
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 사용자 수정
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // 목록에서 해당 사용자 업데이트
        if (state.users.length > 0) {
          const index = state.users.findIndex(user => user.id === action.payload.id);
          if (index !== -1) {
            // 업데이트된 사용자 정보로 목록 갱신
            state.users[index] = action.payload.updatedUser;
          }
        }
        
        // 선택된 사용자가 수정된 사용자인 경우 업데이트
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser = action.payload.updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // 사용자 삭제
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // 목록에서 삭제된 사용자 제거
        state.users = state.users.filter(user => user.id !== action.payload.id);
        // 선택된 사용자가 삭제된 사용자라면 선택 해제
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

// 액션 생성자 내보내기
export const { setSearchParams, setSelectedUser, clearError } = userSlice.actions;

// 리듀서 내보내기
export default userSlice.reducer;

// 타입 내보내기
export type { SearchParams, UserUpdateParams }; 