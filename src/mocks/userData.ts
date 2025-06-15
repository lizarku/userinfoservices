import { User, UserListResponse, UserDetailResponse } from '../types/user';

// 직급 목록
const jobRanks = ['사원', '대리', '과장', '차장', '부장', '이사', '상무', '전무', '사장'];

// 부서/직책 목록
const positions = ['개발팀', '영업팀', '마케팅팀', '인사팀', '재무팀', '기획팀', 'IT팀', '디자인팀', '고객지원팀', '연구개발팀'];

// 한국 성씨 목록
const lastNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '전', '홍'];

// 이름 뒷부분 목록
const firstNames = ['민준', '서준', '도윤', '예준', '시우', '하준', '주원', '지호', '지후', '준서', '서연', '서현', '지우', '하은', '민서', '지유', '채원', '지민', '수아', '지아'];

// 이메일 도메인 목록
const emailDomains = ['gmail.com', 'naver.com', 'daum.net', 'kakao.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'company.co.kr', 'hanmail.net'];

// 랜덤 날짜 생성 (startYear부터 endYear 사이)
const getRandomDate = (startYear: number, endYear: number): string => {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1; // 28일로 제한하여 월별 일수 차이 문제 방지
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};

// 랜덤 IP 주소 생성
const getRandomIP = (): string => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

// 랜덤 사용자 데이터 생성
const generateRandomUser = (index: number): User => {
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const name = `${lastName}${firstName}`;
  
  const jobRank = jobRanks[Math.floor(Math.random() * jobRanks.length)];
  const position = positions[Math.floor(Math.random() * positions.length)];
  
  // 이메일 생성 (한글 이름을 로마자로 변환하는 대신 간단한 영문 아이디 사용)
  const emailId = `user${index + 1}`;
  const emailDomain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
  const email = `${emailId}@${emailDomain}`;
  
  const joinDate = getRandomDate(2015, 2024);
  const createdAt = joinDate + 'T09:00:00Z';
  const updatedAt = getRandomDate(parseInt(joinDate.split('-')[0]), 2024) + 'T14:30:00Z';
  
  return {
    seq_no: (index + 1).toString(),
    id: `user${index + 1}`,
    name,
    job_rank: jobRank,
    position,
    email,
    ip_address: getRandomIP(),
    active: Math.random() > 0.2, // 80% 확률로 활성 상태
    join_date: joinDate,
    created_at: createdAt,
    updated_at: updatedAt
  };
};

// 100명의 사용자 데이터 생성
export const mockUsers: User[] = Array.from({ length: 100 }, (_, index) => generateRandomUser(index));

// 페이징된 사용자 목록 가져오기
export const getUsersResponse = (pageIndex: number = 1, pageSize: number = 10): UserListResponse => {
  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = mockUsers.slice(startIndex, endIndex);
  
  return {
    result_list: paginatedUsers,
    total_count: mockUsers.length,
    page_index: pageIndex,
    page_size: pageSize
  };
};

// 사용자 ID로 상세 정보 가져오기
export const getUserByIdResponse = (id: string): UserDetailResponse | null => {
  const user = mockUsers.find(user => user.id === id);
  
  if (!user) {
    return null;
  }
  
  return {
    user
  };
};

// 검색 조건에 맞는 사용자 목록 가져오기
export const searchUsersResponse = (
  params: {
    page_index?: number;
    page_size?: number;
    id?: string;
    name?: string;
    email?: string;
    job_rank?: string;
    position?: string;
    active?: boolean;
  }
): UserListResponse => {
  const { page_index = 1, page_size = 10, ...searchParams } = params;
  
  // 검색 조건에 맞는 사용자 필터링
  let filteredUsers = [...mockUsers];
  
  if (searchParams.id) {
    filteredUsers = filteredUsers.filter(user => 
      user.id.toLowerCase().includes(searchParams.id!.toLowerCase())
    );
  }
  
  if (searchParams.name) {
    filteredUsers = filteredUsers.filter(user => 
      user.name.includes(searchParams.name!)
    );
  }
  
  if (searchParams.email) {
    filteredUsers = filteredUsers.filter(user => 
      user.email.toLowerCase().includes(searchParams.email!.toLowerCase())
    );
  }
  
  if (searchParams.job_rank) {
    filteredUsers = filteredUsers.filter(user => 
      user.job_rank === searchParams.job_rank
    );
  }
  
  if (searchParams.position) {
    filteredUsers = filteredUsers.filter(user => 
      user.position === searchParams.position
    );
  }
  
  if (searchParams.active !== undefined) {
    filteredUsers = filteredUsers.filter(user => 
      user.active === searchParams.active
    );
  }
  
  // 페이징 처리
  const startIndex = (page_index - 1) * page_size;
  const endIndex = startIndex + page_size;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return {
    result_list: paginatedUsers,
    total_count: filteredUsers.length,
    page_index,
    page_size
  };
};

// API 응답 형식
export const apiResponse = <T>(data: T) => {
  return {
    meta: {
      status: 200,
      message: "Success"
    },
    data
  };
};

// 에러 응답 형식
export const apiErrorResponse = (status: number, message: string) => {
  return {
    meta: {
      status,
      message
    },
    data: null
  };
}; 