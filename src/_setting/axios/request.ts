import axios, { AxiosError } from 'axios';
import { ApiError } from '../../types/user';
import { API_KEY, AUTH_KEY, BASE_URL, USE_MOCK_DATA, USE_MSW, API_TIMEOUT } from './constants';

// 디버깅을 위해 API 키와 인증 토큰 출력
console.debug('debug - API_KEY:', API_KEY);
console.debug('debug - AUTH_KEY:', AUTH_KEY);
console.debug('debug - BASE_URL:', BASE_URL);

// Axios 인스턴스 생성
const request = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_KEY}`
  }
});

// 요청 인터셉터
request.interceptors.request.use(
  (config) => {
    // 요청 전에 수행할 작업
    console.debug('debug - Request URL:', config.url);
    console.debug('debug - Request Method:', config.method);
    console.debug('debug - Request Headers:', config.headers);
    console.debug('debug - Full URL:', `${BASE_URL}${config.url}`);
    
    if (config.data) {
      console.debug('debug - Request Data:', config.data);
    }
    
    if (config.params) {
      console.debug('debug - Request Params:', config.params);
    }
    
    return config;
  },
  (error) => {
    // 요청 에러 처리
    console.error('debug - Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
request.interceptors.response.use(
  (response) => {
    // 응답 데이터를 가공
    console.debug('debug - Response status:', response.status);
    console.debug('debug - Response headers:', response.headers);
    console.debug('debug - Response data:', response.data);
    
    // 응답 상태 코드가 200이 아닌 경우 오류 출력
    if (response.status !== 200) {
      console.error('API 응답 오류 (비정상 상태 코드):', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        method: response.config.method,
        data: response.data
      });
    }
    
    // 응답 데이터의 메타 정보가 있고, 상태 코드가 200이 아닌 경우 오류 출력
    if (response.data?.meta && response.data.meta.status !== 200) {
      console.error('API 응답 오류 (메타 데이터):', {
        metaStatus: response.data.meta.status,
        metaMessage: response.data.meta.message,
        url: response.config.url,
        method: response.config.method
      });
    }
    
    return response;
  },
  (error: AxiosError<ApiError>) => {
    // 에러 응답 처리 - 상세 로그로 변경
    console.error('API 오류 발생:', {
      name: error.name,
      message: error.message,
      code: error.code,
      url: error.config?.url,
      method: error.config?.method,
      fullUrl: error.config?.baseURL ? `${error.config.baseURL}${error.config.url}` : error.config?.url
    });
    
    // 로컬 모의 데이터 사용 알림
    if (USE_MOCK_DATA || USE_MSW) {
      console.debug('API 호출 실패, 로컬 모의 데이터로 대체합니다.');
    }
    
    // 네트워크 오류 또는 타임아웃 오류 처리
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.error('네트워크 타임아웃 발생:', {
        url: error.config?.url,
        timeout: error.config?.timeout
      });
      
      // MSW 사용 중이면 로컬 모의 데이터로 대체 가능함을 알림
      if (process.env.NODE_ENV === 'development') {
        console.info('개발 환경에서는 MSW를 활성화하여 로컬 모의 데이터를 사용할 수 있습니다.');
      }
      
      return Promise.reject(error);
    }
    
    // 응답 오류 처리 (서버에서 응답이 온 경우)
    if (error.response) {
      const statusCode = error.response.status;
      console.error(`API 응답 오류 (${statusCode}):`, {
        url: error.config?.url,
        method: error.config?.method,
        status: statusCode,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    // 요청 오류 처리 (서버에서 응답이 오지 않은 경우)
    else if (error.request) {
      console.error('API 요청 오류 (서버 응답 없음):', {
        url: error.config?.url,
        method: error.config?.method,
        request: error.request
      });
      
      // 개발 환경에서 MSW 대체 안내
      if (process.env.NODE_ENV === 'development') {
        console.info('개발 환경에서는 MSW를 활성화하여 로컬 모의 데이터를 사용할 수 있습니다.');
      }
    }
    
    return Promise.reject(error);
  }
);

export default request; 