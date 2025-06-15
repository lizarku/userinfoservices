// 사용자 상세정보 모달 컴포넌트 - Redux 연동 버전
// - 공통 ModalLayout을 사용하여 일관된 UI 제공
// - Redux에서 선택된 사용자 정보 사용

'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { User } from '../../../types/user';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateUser, UserUpdateParams } from '../redux/userSlice';

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'view' | 'edit'; // 'view': 상세보기, 'edit': 수정 모드
}

/**
 * 사용자 상세 정보 모달 (Redux 연동)
 * - view 모드: 사용자 정보를 읽기 전용으로 표시
 * - edit 모드: 사용자 정보를 수정할 수 있는 입력 필드로 표시
 */
const UserDetailModal: React.FC<UserDetailModalProps> = ({ 
  open, 
  onClose,
  mode = 'view' 
}) => {
  const dispatch = useAppDispatch();
  const { selectedUser: user, isLoading } = useAppSelector(state => state.users);
  
  const [formData, setFormData] = useState<Partial<User>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  // 모달이 열릴 때마다 사용자 데이터로 폼 초기화
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        job_rank: user.job_rank,
        position: user.position,
        email: user.email,
        ip_address: user.ip_address || '',
        active: user.active,
        join_date: user.join_date || ''
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'active') {
      // 문자열 'true'/'false'를 boolean으로 변환
      setFormData(prev => ({
        ...prev,
        [name]: value === 'true'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  // 수정 버튼 클릭 핸들러
  const handleUpdate = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // Redux 액션 디스패치
      const updateData: UserUpdateParams = {
        name: formData.name,
        email: formData.email,
        status: formData.active ? 'active' : 'inactive'
      };
      
      await dispatch(updateUser({ id: user.id, data: updateData })).unwrap();
      
      setMessage({
        text: '사용자 정보가 성공적으로 수정되었습니다.',
        type: 'success'
      });
      
      // 3초 후 메시지 숨기기
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error updating user:', error);
      setMessage({
        text: '사용자 정보 수정 중 오류가 발생했습니다.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 사용자 정보를 표시할 필드 정의
  const userFields = [
    { id: 'id', label: '사용자 ID', value: user.id, editable: false },
    { id: 'name', label: '사용자명', value: formData.name || user.name, editable: true },
    { id: 'job_rank', label: '직급', value: formData.job_rank || user.job_rank, editable: true },
    { id: 'position', label: '직책', value: formData.position || user.position, editable: true },
    { id: 'email', label: '이메일', value: formData.email || user.email, editable: true },
    { id: 'ip_address', label: 'IP 주소', value: formData.ip_address || user.ip_address || '-', editable: true },
    { id: 'active', label: '활성 상태', value: formData.active !== undefined ? (formData.active ? '활성' : '비활성') : (user.active ? '활성' : '비활성'), editable: true },
    { id: 'join_date', label: '가입일', value: formData.join_date || user.join_date || '-', editable: true },
    { id: 'created_at', label: '생성일', value: user.created_at?.replace('T', ' ').replace('Z', '') || '-', editable: false },
    { id: 'updated_at', label: '수정일', value: user.updated_at?.replace('T', ' ').replace('Z', '') || '-', editable: false },
  ];

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 border-b pb-3"
                >
                  {mode === 'view' ? '사용자 상세 정보' : '사용자 정보 수정'}
                </Dialog.Title>
                
                {message && (
                  <div className={`mt-2 p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {message.text}
                  </div>
                )}
                
                <div className="mt-4">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <dl className="divide-y divide-gray-200">
                      {userFields.map((field) => (
                        <div key={field.id} className="py-3 grid grid-cols-3 gap-4">
                          <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                          <dd className="text-sm text-gray-900 col-span-2">
                            {mode === 'edit' && field.editable ? (
                              field.id === 'active' ? (
                                <select
                                  name="active"
                                  value={formData.active === undefined ? (user.active ? 'true' : 'false') : (formData.active ? 'true' : 'false')}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="true">활성</option>
                                  <option value="false">비활성</option>
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  name={field.id}
                                  value={field.value}
                                  onChange={handleChange}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                              )
                            ) : (
                              field.value
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  {mode === 'edit' && (
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleUpdate}
                      disabled={isSubmitting || isLoading}
                    >
                      {isSubmitting ? '처리 중...' : '수정'}
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    닫기
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserDetailModal; 