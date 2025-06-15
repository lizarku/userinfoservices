// 사용자 검색 폼 컴포넌트 - Redux 연동 버전
// - 이름, 이메일, 직급 등으로 사용자를 검색할 수 있는 폼
// - 검색 버튼 클릭 시 Redux 액션 디스패치

'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setSearchParams, fetchUsers, SearchParams } from '../redux/userSlice';
import '../../../styles/common.css';

/**
 * 사용자 검색 폼 컴포넌트 (Redux 연동)
 * 이름, 이메일, 직급으로 사용자를 검색할 수 있는 폼을 제공합니다.
 */
const SearchForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentSearchParams = useAppSelector(state => state.users.searchParams);
  
  const [searchParams, setLocalSearchParams] = useState<SearchParams>({
    name: currentSearchParams.name || '',
    email: currentSearchParams.email || '',
    job_rank: currentSearchParams.job_rank || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 기존 페이지네이션 정보 유지하면서 검색 파라미터 업데이트
    const newParams = {
      ...currentSearchParams,
      ...searchParams,
      page_index: 1, // 검색 시 첫 페이지로 이동
    };
    
    dispatch(setSearchParams(newParams));
    dispatch(fetchUsers(newParams));
  };

  const handleReset = () => {
    const emptyParams = {
      name: '',
      email: '',
      job_rank: '',
    };
    
    setLocalSearchParams(emptyParams);
    
    // 검색 조건은 초기화하되 페이지네이션 정보는 유지
    const resetParams = {
      ...currentSearchParams,
      ...emptyParams,
      page_index: 1, // 검색 초기화 시 첫 페이지로 이동
    };
    
    dispatch(setSearchParams(resetParams));
    dispatch(fetchUsers(resetParams));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">사용자 검색</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={searchParams.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="이름으로 검색"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={searchParams.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="이메일로 검색"
            />
          </div>
          
          <div>
            <label htmlFor="job_rank" className="block text-sm font-medium text-gray-700 mb-1">
              직급
            </label>
            <input
              type="text"
              id="job_rank"
              name="job_rank"
              value={searchParams.job_rank}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="직급으로 검색"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            초기화
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            검색
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm; 