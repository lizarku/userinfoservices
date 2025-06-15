/**
 * API 관련 상수 정의
 * 모든 API 관련 상수는 이 파일에서 관리합니다.
 */

// API 키 및 인증 관련 상수
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '55351d39-8898-41eb-aa52-15c63e4f738d';
export const AUTH_KEY = process.env.NEXT_PUBLIC_AUTH_KEY || 'c1f190aa-e615-4497-99c7-5de1732f4bfb';

// 환경 설정 관련 상수
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
export const USE_MSW = process.env.NEXT_PUBLIC_USE_MSW === 'true';

// API 기본 URL
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  `https://fabricate.mockaroo.com/api/v1/workspaces/danal/databases/${API_KEY}/api`;

// 기타 API 관련 상수
export const API_TIMEOUT = 30000; // 30초 