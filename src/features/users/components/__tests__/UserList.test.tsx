import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserList from '../UserList';
import { setSelectedUser } from '../../redux/userSlice';

// fetchUsers 액션 모킹
jest.mock('../../redux/userSlice', () => ({
  ...jest.requireActual('../../redux/userSlice'),
  fetchUsers: jest.fn().mockReturnValue({ type: 'users/fetchUsers/pending' })
}));

// Mock store 설정
const mockStore = configureStore([]);

// Mock 함수 생성
const mockOnDetail = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

// Mock 사용자 데이터
const mockUsers = [
  {
    id: 'user1',
    name: '홍길동',
    job_rank: '대리',
    position: '개발자',
    email: 'hong@example.com',
    active: true,
    seq_no: 1
  },
  {
    id: 'user2',
    name: '김철수',
    job_rank: '과장',
    position: '디자이너',
    email: 'kim@example.com',
    active: false,
    seq_no: 2
  }
];

// 기본 스토어 상태 생성 함수
const createMockState = (overrides = {}) => ({
  users: {
    users: mockUsers,
    selectedUser: null,
    totalCount: 10,
    isLoading: false,
    error: null,
    searchParams: {
      page_index: 1,
      page_size: 10
    },
    ...overrides
  }
});

describe('UserList Component', () => {
  let store: ReturnType<typeof mockStore>;
  
  beforeEach(() => {
    // 테스트마다 새로운 store 생성
    store = mockStore(createMockState());
    
    // dispatch 메서드를 모킹하여 액션 추적
    store.dispatch = jest.fn().mockReturnValue({ type: 'mocked_dispatch' });
    
    // 각 테스트 전에 모든 mock 함수 초기화
    jest.clearAllMocks();
  });

  test('renders user list correctly', () => {
    render(
      <Provider store={store}>
        <UserList 
          onDetail={mockOnDetail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </Provider>
    );
    
    // 테이블 헤더가 렌더링되는지 확인
    expect(screen.getByText('사용자 ID')).toBeInTheDocument();
    expect(screen.getByText('이름')).toBeInTheDocument();
    expect(screen.getByText('직급')).toBeInTheDocument();
    
    // 사용자 데이터가 렌더링되는지 확인
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('김철수')).toBeInTheDocument();
    expect(screen.getByText('hong@example.com')).toBeInTheDocument();
    
    // 활성 상태가 올바르게 표시되는지 확인
    expect(screen.getByText('활성')).toBeInTheDocument();
    expect(screen.getByText('비활성')).toBeInTheDocument();
  });

  test('calls onDetail when detail button is clicked', () => {
    render(
      <Provider store={store}>
        <UserList 
          onDetail={mockOnDetail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </Provider>
    );
    
    // 첫 번째 사용자의 상세 조회 버튼 클릭
    const detailButtons = screen.getAllByText('상세조회');
    fireEvent.click(detailButtons[0]);
    
    // setSelectedUser 액션이 디스패치되었는지 확인
    expect(store.dispatch).toHaveBeenCalledWith(setSelectedUser(mockUsers[0]));
    
    // onDetail 콜백이 호출되었는지 확인
    expect(mockOnDetail).toHaveBeenCalledWith('user1');
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <Provider store={store}>
        <UserList 
          onDetail={mockOnDetail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </Provider>
    );
    
    // 첫 번째 사용자의 정보 수정 버튼 클릭
    const editButtons = screen.getAllByText('정보수정');
    fireEvent.click(editButtons[0]);
    
    // setSelectedUser 액션이 디스패치되었는지 확인
    expect(store.dispatch).toHaveBeenCalledWith(setSelectedUser(mockUsers[0]));
    
    // onEdit 콜백이 호출되었는지 확인
    expect(mockOnEdit).toHaveBeenCalledWith('user1', mockUsers[0]);
  });

  test('calls onDelete when delete button is clicked and confirmed', () => {
    // window.confirm 모킹
    window.confirm = jest.fn().mockImplementation(() => true);
    
    render(
      <Provider store={store}>
        <UserList 
          onDetail={mockOnDetail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </Provider>
    );
    
    // 첫 번째 사용자의 삭제 버튼 클릭
    const deleteButtons = screen.getAllByText('삭제');
    fireEvent.click(deleteButtons[0]);
    
    // confirm 대화상자가 표시되었는지 확인
    expect(window.confirm).toHaveBeenCalledWith('정말 삭제하시겠습니까?');
    
    // onDelete 콜백이 호출되었는지 확인
    expect(mockOnDelete).toHaveBeenCalledWith('user1');
  });

  test('does not call onDelete when delete is canceled', () => {
    // window.confirm 모킹 - 취소 선택
    window.confirm = jest.fn().mockImplementation(() => false);
    
    render(
      <Provider store={store}>
        <UserList 
          onDetail={mockOnDetail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </Provider>
    );
    
    // 첫 번째 사용자의 삭제 버튼 클릭
    const deleteButtons = screen.getAllByText('삭제');
    fireEvent.click(deleteButtons[0]);
    
    // confirm 대화상자가 표시되었는지 확인
    expect(window.confirm).toHaveBeenCalledWith('정말 삭제하시겠습니까?');
    
    // deleteUser 액션이 디스패치되지 않았는지 확인 - 함수 자체가 아닌 함수 호출 결과를 확인
    expect(store.dispatch).not.toHaveBeenCalledWith(expect.any(Function));
    
    // onDelete 콜백이 호출되지 않았는지 확인
    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  test('shows loading state when isLoading is true', () => {
    // 로딩 상태의 스토어 생성
    const loadingStore = mockStore({
      users: {
        users: [],
        selectedUser: null,
        totalCount: 0,
        isLoading: true,
        error: null,
        searchParams: {
          page_index: 1,
          page_size: 10
        }
      }
    });
    
    // dispatch 메서드를 모킹하여 액션 추적
    loadingStore.dispatch = jest.fn().mockReturnValue({ type: 'mocked_dispatch' });
    
    render(
      <Provider store={loadingStore}>
        <UserList 
          onDetail={mockOnDetail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </Provider>
    );
    
    // 로딩 메시지가 표시되는지 확인
    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  test('shows error message when there is an error', () => {
    // 에러 상태의 스토어 생성
    const errorStore = mockStore({
      users: {
        users: [],
        selectedUser: null,
        totalCount: 0,
        isLoading: false,
        error: '데이터를 불러오는 중 오류가 발생했습니다.',
        searchParams: {
          page_index: 1,
          page_size: 10
        }
      }
    });
    
    // dispatch 메서드를 모킹하여 액션 추적
    errorStore.dispatch = jest.fn().mockReturnValue({ type: 'mocked_dispatch' });
    
    render(
      <Provider store={errorStore}>
        <UserList 
          onDetail={mockOnDetail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </Provider>
    );
    
    // 에러 메시지가 표시되는지 확인
    expect(screen.getByText(/사용자 정보를 불러오는 중 오류가 발생했습니다/)).toBeInTheDocument();
  });

  test('shows empty state when no users are found', () => {
    // 빈 결과의 스토어 생성
    const emptyStore = mockStore({
      users: {
        users: [],
        selectedUser: null,
        totalCount: 0,
        isLoading: false,
        error: null,
        searchParams: {
          page_index: 1,
          page_size: 10
        }
      }
    });
    
    // dispatch 메서드를 모킹하여 액션 추적
    emptyStore.dispatch = jest.fn().mockReturnValue({ type: 'mocked_dispatch' });
    
    render(
      <Provider store={emptyStore}>
        <UserList 
          onDetail={mockOnDetail} 
          onEdit={mockOnEdit} 
          onDelete={mockOnDelete} 
        />
      </Provider>
    );
    
    // 빈 결과 메시지가 표시되는지 확인
    expect(screen.getByText('검색 결과가 없습니다')).toBeInTheDocument();
  });
}); 