'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { setSelectedUser, deleteUser } from '../redux/userSlice';
import { MockDataAlert } from '../../../components/common';
import UserList from './UserList';
import SearchForm from './SearchForm';
import UserDetailModal from './UserDetailModal';
import { apiStatus } from '../api/userService';
import { User } from '../../../types/user';

/**
 * 사용자 관리 메인 페이지 (Redux 연동)
 * - 검색, 목록, 상세, 페이지네이션 등 사용자 관리의 모든 기능을 담당
 * - Redux를 통한 상태 관리
 */
export default function UserPage() {
  // 모달 상태
  const [detailOpen, setDetailOpen] = useState(false);
  // 모달 모드 (view/edit)
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  // 알림 상태
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const dispatch = useAppDispatch();
  
  // API 상태 정보 (모의 데이터 사용 여부, 에러 정보)
  const isMockData = apiStatus.isMockData;
  const errorDetails = apiStatus.errorDetails;

  // 상세조회 버튼 클릭 시 호출
  const handleDetail = () => {
    setModalMode('view');
    setDetailOpen(true);
  };

  // 정보수정 버튼 클릭 시 호출
  const handleEdit = (_id: string, userData: User) => {
    dispatch(setSelectedUser(userData));
    setModalMode('edit');
    setDetailOpen(true);
  };

  // 삭제 버튼 클릭 시 호출
  const handleDelete = (id: string) => {
    dispatch(deleteUser(id))
      .unwrap()
      .then((response) => {
        showNotification(response.response.data.message, 'success');
      })
      .catch((error) => {
        const errorMessage = error?.message || '삭제 중 오류가 발생했습니다.';
        showNotification(errorMessage, 'error');
      });
  };

  // 알림 표시 함수
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 타이틀과 목업 데이터 알림 */}
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">사전과제 - 사용자 조회</h1>
        <MockDataAlert isMockData={isMockData} errorDetails={errorDetails} />
      </div>
      
      {/* 검색 영역 */}
      <div className="bg-white rounded-lg shadow mb-6 p-5">
        <SearchForm />
      </div>

      {/* 목록/로딩 표시 */}
      <div className="bg-white rounded-lg shadow">
        <UserList
          onDetail={handleDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* 상세 모달 */}
      <UserDetailModal 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)} 
        mode={modalMode}
      />
      
      {/* 알림 토스트 */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded shadow-lg transition-opacity duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}
    </div>
  );
} 