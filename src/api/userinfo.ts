import request from '../_setting/axios/request';
import { UserUpdateParams } from '../types/user';

// 기능정의서에 맞게 API 엔드포인트 설정
const BASE_URL = '/users';

export const userinfoApi = {
  // 사용자 목록 조회 - 기능정의서에 맞게 수정
  getUsers: (params = { page_index: 1, page_size: 10 }) => {
    console.log('API 요청 파라미터:', params);
    return request.get(BASE_URL, { 
      params: params 
    });
  },

  // 사용자 상세 조회
  getUserById: (id: string) => {
    console.log('API 요청 ID:', id);
    return request.get(`${BASE_URL}/${id}`);
  },

  // 사용자 정보 수정
  updateUser: (id: string, data: UserUpdateParams) => {
    console.log('API 수정 요청:', { id, data });
    return request.post(`${BASE_URL}/${id}`, data);
  },

  // 사용자 삭제
  deleteUser: (id: string) => {
    console.log('API 삭제 요청:', id);
    return request.delete(`${BASE_URL}/${id}`);
  }
}; 