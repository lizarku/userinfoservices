import { userinfoApi } from './userinfo';
import { UserUpdateParams } from '../types/user';

// API 유틸리티 함수

// 사용자 데이터 샘플
const sampleUser: UserUpdateParams = {
  name: 'Sample User',
  job_rank: '사원',
  position: '개발팀',
  email: 'sample@example.com',
  ip_address: '192.168.1.1',
  active: true
};

// 1. 사용자 목록 조회
const fetchUsers = async () => {
  try {
    const params = {
      page_index: 1,
      page_size: 10
    };
    const response = await userinfoApi.getUsers(params);
    console.log('사용자 목록:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    throw error;
  }
};

// 2. 사용자 상세 조회
const fetchUserById = async (id: string) => {
  try {
    const response = await userinfoApi.getUserById(id);
    console.log('사용자 상세 정보:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 상세 조회 실패:', error);
    throw error;
  }
};

// 3. 사용자 정보 수정
const updateUserData = async (id: string, data: UserUpdateParams = sampleUser) => {
  try {
    const response = await userinfoApi.updateUser(id, data);
    console.log('사용자 정보 수정 결과:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 정보 수정 실패:', error);
    throw error;
  }
};

// 4. 사용자 삭제
const deleteUserData = async (id: string) => {
  try {
    const response = await userinfoApi.deleteUser(id);
    console.log('사용자 삭제 결과:', response.data);
    return response.data;
  } catch (error) {
    console.error('사용자 삭제 실패:', error);
    throw error;
  }
};

// 전체 API 실행
const runAllApiOperations = async () => {
  console.log('=== API 작업 시작 ===');
  
  try {
    // 1. 사용자 목록 조회
    const userList = await fetchUsers();
    
    if (userList.data.result_list.length > 0) {
      const firstUserId = userList.data.result_list[0].id;
      
      // 2. 첫 번째 사용자 상세 조회
      await fetchUserById(firstUserId);
      
      // 3. 사용자 정보 수정
      await updateUserData(firstUserId);
      
      // 4. 사용자 삭제
      await deleteUserData(firstUserId);
    } else {
      console.log('작업할 사용자가 없습니다.');
    }
  } catch (error) {
    console.error('API 작업 중 오류 발생:', error);
  }
  
  console.log('=== API 작업 완료 ===');
};

export {
  fetchUsers,
  fetchUserById,
  updateUserData,
  deleteUserData,
  runAllApiOperations,
  sampleUser
}; 