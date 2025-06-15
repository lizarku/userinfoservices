'use client';

import React, { useState, ReactNode, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { apiStatus } from '../../features/users/api/userService';
import { BASE_URL } from '../../_setting/axios/constants';

// apiStatus에 있는 errorDetails 타입과 일치시킴
interface ErrorDetails {
  message: string;
  code?: string | number;
  url?: string;
  method?: string;
  timestamp: string;
  responseData?: unknown;
}

interface MockDataAlertProps {
  isMockData: boolean;
  errorDetails?: ErrorDetails | Error | string | null;
}

/**
 * 목업 데이터 사용 시 알림을 표시하는 공통 컴포넌트
 * @param isMockData 목업 데이터 사용 여부
 * @param errorDetails API 호출 실패 시 에러 상세 정보
 */
const MockDataAlert: React.FC<MockDataAlertProps> = ({ isMockData, errorDetails }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 목업 데이터를 사용하지 않는 경우 렌더링하지 않음
  if (!isMockData) {
    return null;
  }

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // 응답 데이터를 문자열로 안전하게 변환하는 함수
  const safeStringify = (data: unknown): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return '[데이터를 문자열로 변환할 수 없습니다]';
    }
  };

  // 에러 상세 정보 처리
  let formattedErrorDetails: ReactNode = null;
  
  if (!errorDetails) {
    // 전역 API 상태에서 에러 정보 가져오기
    if (apiStatus.errorDetails) {
      const responseDataString = apiStatus.errorDetails.responseData 
        ? safeStringify(apiStatus.errorDetails.responseData) 
        : null;
      
      // URL에서 파라미터 추출 시도
      const params: Record<string, string> = {};
      const url = apiStatus.errorDetails.url || '';
      
      // URL에서 쿼리 파라미터 부분 추출
      const queryStringIndex = url.indexOf('?');
      if (queryStringIndex !== -1) {
        const queryString = url.substring(queryStringIndex + 1);
        // URLSearchParams 객체로 변환
        try {
          const searchParams = new URLSearchParams(queryString);
          // params 객체에 값 복사
          searchParams.forEach((value, key) => {
            params[key] = value;
          });
        } catch (e) {
          console.error('URL 쿼리 파라미터 파싱 오류:', e);
        }
      }
      
      const paramsString = Object.keys(params).length > 0 ? safeStringify(params) : null;
      
      formattedErrorDetails = (
        <div className="space-y-2">
          <div>
            <span className="font-semibold">메시지:</span> {apiStatus.errorDetails.message}
          </div>
          <div>
            <span className="font-semibold">코드:</span> {apiStatus.errorDetails.code || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">Base URL:</span> {BASE_URL}
          </div>
          <div>
            <span className="font-semibold">Path URL:</span> {apiStatus.errorDetails.url ? apiStatus.errorDetails.url.replace(/^https:\/\/fabricate\.mockaroo\.com\/api\/v1\/workspaces\/danal\/databases\/[^/]+\/api/, '') : 'N/A'}
          </div>
          {paramsString && (
            <div>
              <span className="font-semibold">파라미터:</span>
              <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {paramsString}
              </pre>
            </div>
          )}
          <div>
            <span className="font-semibold">전체 URL:</span> {apiStatus.errorDetails.url || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">메서드:</span> {apiStatus.errorDetails.method || 'N/A'}
          </div>
          <div>
            <span className="font-semibold">시간:</span> {new Date(apiStatus.errorDetails.timestamp).toLocaleString()}
          </div>
          {responseDataString && (
            <div>
              <span className="font-semibold">응답 데이터:</span>
              <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {responseDataString}
              </pre>
            </div>
          )}
        </div>
      );
    } else {
      formattedErrorDetails = '자세한 에러 정보가 없습니다.';
    }
  } else if (typeof errorDetails === 'string') {
    formattedErrorDetails = errorDetails;
  } else if (errorDetails instanceof Error) {
    formattedErrorDetails = errorDetails.message;
  } else {
    // ErrorDetails 타입인 경우
    const responseDataString = errorDetails.responseData 
      ? safeStringify(errorDetails.responseData) 
      : null;
    
    // URL에서 파라미터 추출 시도
    const params: Record<string, string> = {};
    const url = errorDetails.url || '';
    
    // URL에서 쿼리 파라미터 부분 추출
    const queryStringIndex = url.indexOf('?');
    if (queryStringIndex !== -1) {
      const queryString = url.substring(queryStringIndex + 1);
      // URLSearchParams 객체로 변환
      try {
        const searchParams = new URLSearchParams(queryString);
        // params 객체에 값 복사
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
      } catch (e) {
        console.error('URL 쿼리 파라미터 파싱 오류:', e);
      }
    }
    
    const paramsString = Object.keys(params).length > 0 ? safeStringify(params) : null;
    
    formattedErrorDetails = (
      <div className="space-y-2">
        <div>
          <span className="font-semibold">메시지:</span> {errorDetails.message}
        </div>
        <div>
          <span className="font-semibold">코드:</span> {errorDetails.code || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">Base URL:</span> {BASE_URL}
        </div>
        <div>
          <span className="font-semibold">Path URL:</span> {errorDetails.url ? errorDetails.url.replace(/^https:\/\/fabricate\.mockaroo\.com\/api\/v1\/workspaces\/danal\/databases\/[^/]+\/api/, '') : 'N/A'}
        </div>
        {paramsString && (
          <div>
            <span className="font-semibold">파라미터:</span>
            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {paramsString}
            </pre>
          </div>
        )}
        <div>
          <span className="font-semibold">전체 URL:</span> {errorDetails.url || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">메서드:</span> {errorDetails.method || 'N/A'}
        </div>
        <div>
          <span className="font-semibold">시간:</span> {new Date(errorDetails.timestamp).toLocaleString()}
        </div>
        {responseDataString && (
          <div>
            <span className="font-semibold">응답 데이터:</span>
            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {responseDataString}
            </pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={openModal}
        className="ml-3 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      >
        <span className="font-bold mr-1">ⓘ</span>
        {apiStatus.errorDetails ? 
          `[${apiStatus.errorDetails.code || '통신오류'} - API 응답 없음]` : 
          '[개발모드 - 목업데이터]'}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                    className="flex items-center text-lg font-medium leading-6 text-amber-800"
                  >
                    <span className="text-xl font-bold mr-2">⚠️</span>
                    API 통신 오류로 목업 데이터 사용 중
                  </Dialog.Title>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">
                      현재 API 서버와의 통신이 원활하지 않아 목업 데이터를 사용하고 있습니다.
                      이로 인해 실제 데이터와 차이가 있을 수 있습니다.
                    </p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-900">오류 상세 정보:</h4>
                      <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700 break-words overflow-auto max-h-96">
                        {formattedErrorDetails}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      확인
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MockDataAlert; 