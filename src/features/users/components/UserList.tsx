// 사용자 목록 테이블 컴포넌트 - Redux 연동 버전
// - 사용자 리스트, 페이지네이션, 상세/수정/삭제 버튼을 표시
// - 공통 PaginationComponent 사용
// - Redux 상태 관리 사용

'use client';

import React, { useEffect } from 'react';
import { User } from '../../../types/user';
import PaginationComponent from '../../../components/common/PaginationComponent';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { fetchUsers, setSearchParams, setSelectedUser, deleteUser } from '../redux/userSlice';
import '../../../styles/common.css';

export interface UserListProps {
  onDetail: (id: string) => void;
  onEdit: (id: string, userData: User) => void;
  onDelete: (id: string) => void;
}

/**
 * 사용자 목록 테이블을 렌더링하는 컴포넌트 (Redux 연동)
 * - 각 행마다 상세/수정/삭제 버튼 제공
 * - 하단에 공통 페이지네이션 컴포넌트 사용
 * - 로딩 상태와 에러 상태 처리
 */
export default function UserList({ 
  onDetail, 
  onEdit, 
  onDelete
}: UserListProps) {
  const dispatch = useAppDispatch();
  
  // Redux 상태 가져오기
  const { users, totalCount, isLoading, error, searchParams } = useAppSelector(state => state.users);
  const { page_index = 1, page_size = 10 } = searchParams;
  
  // 전체 페이지 수 계산
  const pageCount = Math.ceil(totalCount / page_size);
  
  // 컴포넌트 마운트 시 사용자 목록 조회
  useEffect(() => {
    dispatch(fetchUsers(searchParams));
  }, [dispatch, searchParams]);

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    dispatch(setSearchParams({ ...searchParams, page_index: page }));
  };

  // 상세 조회 핸들러
  const handleDetail = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user) {
      dispatch(setSelectedUser(user));
      onDetail(id);
    }
  };

  // 수정 버튼 핸들러
  const handleEditClick = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      dispatch(setSelectedUser(user));
      onEdit(userId, user);
    }
  };

  // 삭제 버튼 핸들러
  const handleDeleteClick = (userId: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      dispatch(deleteUser(userId));
      onDelete(userId);
    }
  };

  // 로딩 상태 표시
  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">로딩 중...</span>
      </div>
    );
  }

  // 에러 상태 표시
  if (error && users.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-red-500">사용자 정보를 불러오는 중 오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] bg-gray-50 rounded-lg p-6">
        <p className="text-gray-500 text-lg">검색 결과가 없습니다</p>
        <p className="text-gray-400 text-sm mt-2">다른 검색어로 다시 시도해보세요</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* 사용자 목록 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자 ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직급</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">직책</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">활성상태</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user: User) => (
              <tr key={user.seq_no} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.job_rank}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                    user.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? '활성' : '비활성'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDetail(user.id)}
                      className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      상세조회
                    </button>
                    <button
                      onClick={() => handleEditClick(user.id)}
                      className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      정보수정
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user.id)}
                      className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* 페이지네이션 */}
      <div className="py-3 px-6 border-t border-gray-200 bg-gray-50">
        <PaginationComponent
          page={page_index}
          count={pageCount}
          onChange={(_, value) => handlePageChange(value)}
        />
      </div>
    </div>
  );
} 