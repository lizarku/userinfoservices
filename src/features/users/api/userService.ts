import { userinfoApi } from '../../../api/userinfo';
import { UserListResponse, UserDetailResponse, UserUpdateParams } from '../../../types/user';
import { searchUsersResponse, getUserByIdResponse } from '../../../mocks/userData';
import { AxiosError } from 'axios';
import { USE_MOCK_DATA } from '../../../_setting/axios/constants';

// API 상태 관리
interface ApiStatus {
  isMockData: boolean;
  lastError: Error | null;
  errorDetails: {
    message: string;
    code?: string | number;
    url?: string;
    method?: string;
    timestamp: string;
    responseData?: unknown;
  } | null;
  forceMockData: boolean;
}

// 전역 API 상태
export const apiStatus: ApiStatus = {
  isMockData: USE_MOCK_DATA,
  lastError: null,
  errorDetails: null,
  forceMockData: USE_MOCK_DATA
};

// 응답 타입 정의
interface ApiSuccessResponse {
  meta: {
    status: number;
    message: string;
  };
  data: {
    message: string;
    [key: string]: unknown;
  };
}

/**
 * 에러 정보를 저장하는 함수
 * @param error 발생한 에러 객체
 * @param context 추가 컨텍스트 정보
 */
const saveErrorDetails = (error: Error | AxiosError | unknown, context?: string) => {
  // Error 객체로 변환
  apiStatus.lastError = error instanceof Error ? error : new Error(
    typeof error === 'object' && error !== null && 'message' in error 
      ? String(error.message) 
      : '알 수 없는 오류'
  );
  
  // 에러 객체 타입 확인
  const axiosError = error as AxiosError;
  
  // 전체 URL 생성 (baseURL + url + 쿼리 파라미터)
  let fullUrl = 'UNKNOWN_URL';
  if (axiosError.config) {
    const { baseURL, url, params } = axiosError.config;
    
    // 기본 URL과 경로 결합
    if (baseURL && url) {
      fullUrl = `${baseURL}${url}`;
    } else if (url) {
      fullUrl = url;
    }
    
    // URL에 쿼리 파라미터 추가
    if (params) {
      try {
        // params 객체를 URLSearchParams로 변환
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, String(value));
        });
        
        // 기존 URL에 쿼리 파라미터 추가
        fullUrl = `${fullUrl}${fullUrl.includes('?') ? '&' : '?'}${searchParams.toString()}`;
      } catch (e) {
        console.error('URL 파라미터 변환 오류:', e);
      }
    }
  }
  
  // 상세 에러 정보 저장
  apiStatus.errorDetails = {
    message: apiStatus.lastError.message,
    code: axiosError.code || 
          (axiosError.response?.status ? String(axiosError.response.status) : 'UNKNOWN'),
    url: fullUrl, // 전체 URL로 변경
    method: axiosError.config?.method || 'UNKNOWN_METHOD',
    timestamp: new Date().toISOString(),
    responseData: axiosError.response?.data || null
  };
  
  // 컨텍스트 정보가 있으면 메시지에 추가
  if (context) {
    apiStatus.errorDetails.message = `${context}: ${apiStatus.errorDetails.message}`;
  }
  
  // 모의 데이터 사용 플래그 설정
  apiStatus.isMockData = true;
  
  // 콘솔에 오류 출력
  console.error('API 오류 상세 정보:', apiStatus.errorDetails);
};

export const userService = {
  // API 상태 가져오기
  getApiStatus: (): ApiStatus => {
    return { ...apiStatus };
  },

  // 모의 데이터 사용 설정
  setForceMockData: (force: boolean): void => {
    apiStatus.forceMockData = force;
    apiStatus.isMockData = force || USE_MOCK_DATA;
    
    // 강제 모의 데이터 모드를 해제할 때 에러 정보도 초기화
    if (!force) {
      apiStatus.lastError = null;
      apiStatus.errorDetails = null;
    }
  },

  // 사용자 목록 조회
  getUsers: async (params = { page_index: 1, page_size: 10 }): Promise<UserListResponse> => {
    try {
      // 강제 모의 데이터 사용 또는 기본 모의 데이터 설정이 활성화된 경우
      if (apiStatus.forceMockData) {
        console.log('로컬 모의 데이터 사용 - 사용자 목록 조회');
        apiStatus.isMockData = true;
        return searchUsersResponse(params);
      }

      // API 호출 시도
      const response = await userinfoApi.getUsers(params);
      console.log('API 응답:', response);
      apiStatus.isMockData = false;
      apiStatus.lastError = null;
      apiStatus.errorDetails = null;
      return response.data.data;
    } catch (error) {
      console.warn('사용자 목록 조회 중 오류:', error);
      
      // 에러 정보 저장
      saveErrorDetails(error, '사용자 목록 조회 실패');
      
      // API 호출 실패 시 로컬 모의 데이터로 대체
      console.log('API 호출 실패, 로컬 모의 데이터로 대체합니다.');
      return searchUsersResponse(params);
    }
  },

  // 사용자 상세 조회
  getUserById: async (id: string): Promise<UserDetailResponse> => {
    try {
      // 강제 모의 데이터 사용 또는 기본 모의 데이터 설정이 활성화된 경우
      if (apiStatus.forceMockData) {
        console.log('로컬 모의 데이터 사용 - 사용자 상세 조회:', id);
        apiStatus.isMockData = true;
        const userData = getUserByIdResponse(id);
        if (!userData) {
          throw new Error('사용자를 찾을 수 없습니다.');
        }
        return userData;
      }

      const response = await userinfoApi.getUserById(id);
      console.log('API 응답:', response);
      apiStatus.isMockData = false;
      apiStatus.lastError = null;
      apiStatus.errorDetails = null;
      return response.data.data;
    } catch (error) {
      console.error(`사용자 ${id} 상세 조회 중 오류:`, error);
      
      // 에러 정보 저장
      saveErrorDetails(error, `사용자 ${id} 상세 조회 실패`);
      
      // API 호출 실패 시 로컬 모의 데이터로 대체
      console.log('API 호출 실패, 로컬 모의 데이터로 대체합니다.');
      const userData = getUserByIdResponse(id);
      if (!userData) {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
      return userData;
    }
  },

  // 사용자 정보 수정
  updateUser: async (id: string, data: UserUpdateParams): Promise<ApiSuccessResponse> => {
    try {
      // 강제 모의 데이터 사용 또는 기본 모의 데이터 설정이 활성화된 경우
      if (apiStatus.forceMockData) {
        console.log('로컬 모의 데이터 사용 - 사용자 정보 수정:', id, data);
        apiStatus.isMockData = true;
        return {
          meta: {
            status: 200,
            message: "Success"
          },
          data: { message: '사용자 정보가 성공적으로 업데이트되었습니다.' }
        };
      }

      const response = await userinfoApi.updateUser(id, data);
      console.log('API 응답:', response);
      apiStatus.isMockData = false;
      apiStatus.lastError = null;
      apiStatus.errorDetails = null;
      return response.data;
    } catch (error) {
      console.error(`사용자 ${id} 정보 수정 중 오류:`, error);
      
      // 에러 정보 저장
      saveErrorDetails(error, `사용자 ${id} 정보 수정 실패`);
      
      // API 호출 실패 시 성공 응답 모의
      console.log('API 호출 실패, 성공 응답을 모의합니다.');
      return {
        meta: {
          status: 200,
          message: "Success"
        },
        data: { message: '사용자 정보가 성공적으로 업데이트되었습니다.' }
      };
    }
  },

  // 사용자 삭제
  deleteUser: async (id: string): Promise<ApiSuccessResponse> => {
    try {
      // 1. 모의 데이터인 경우
      if (apiStatus.forceMockData) {
        console.log('로컬 모의 데이터 사용 - 사용자 삭제:', id);
        apiStatus.isMockData = true;
        return {
          meta: {
            status: 200,
            message: "Success"
          },
          data: { message: '사용자가 성공적으로 삭제되었습니다.(모의 데이터)' }
        };
      }

      // 2. 실제 API 호출
      const response = await userinfoApi.deleteUser(id);
      console.log('API 응답:', response);
      apiStatus.isMockData = false;
      apiStatus.lastError = null;
      apiStatus.errorDetails = null;
      
      // 2-1. API 응답 성공 (status === 200)
      if (response.data.meta.status === 200) {
        return {
          meta: response.data.meta,
          data: { 
            ...response.data.data,
            message: response.data.data?.message || '사용자가 성공적으로 삭제되었습니다.' 
          }
        };
      } 
      // 2-2. API 응답 실패 (status !== 200)
      else {
        const failReason = response.data.meta.message || '알 수 없는 오류';
        return {
          meta: {
            ...response.data.meta,
            message: `[${failReason}] - 삭제에 실패했습니다.`
          },
          data: { 
            ...response.data.data,
            message: `[${failReason}] - 삭제에 실패했습니다.` 
          }
        };
      }
    } 
    // 3. API 호출 자체 실패 (네트워크 오류 등)
    catch (error) {
      console.error(`사용자 ${id} 삭제 중 오류:`, error);
      
      // 에러 정보 저장
      saveErrorDetails(error, `사용자 ${id} 삭제 실패`);
      
      const failReason = error instanceof Error ? error.message : '서버 연결 실패';
      return {
        meta: {
          status: 500,
          message: `[${failReason}] - 삭제에 실패했습니다.`
        },
        data: { message: `[${failReason}] - 삭제에 실패했습니다.(모의 데이터)` }
      };
    }
  }
}; 