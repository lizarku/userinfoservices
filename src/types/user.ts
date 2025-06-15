// API 응답 타입
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 사용자 정보 타입 정의
 */
export interface User {
  id: string;
  name: string;
  job_rank: string;
  position: string;
  email: string;
  ip_address?: string;
  active: boolean;
  join_date?: string;
  created_at?: string;
  updated_at?: string;
  seq_no?: number;
}

// 사용자 목록 조회 응답
export interface UserListResponse {
  result_list: User[];
  total_count: number;
  page_index: number;
  page_size: number;
}

// 사용자 상세 조회 응답
export interface UserDetailResponse {
  user: User;
}

/**
 * 사용자 검색 파라미터 타입 정의
 */
export interface SearchParams {
  name?: string;
  email?: string;
  job_rank?: string;
  position?: string;
  [key: string]: string | undefined;
}

// 사용자 정보 수정 파라미터
export interface UserUpdateParams {
  name?: string;
  job_rank?: string;
  position?: string;
  email?: string;
  ip_address?: string;
  active?: boolean;
}

// API 에러 응답
export interface ApiError {
  code: number;
  message: string;
  details?: string;
}

export interface UserListProps {
  users: User[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onUserClick: (userId: string) => void;
}

export interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
} 