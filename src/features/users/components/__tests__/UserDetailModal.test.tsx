import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserDetailModal from '../UserDetailModal';

// Mock store 설정
const mockStore = configureStore([]);

// Mock 사용자 데이터
const mockUser = {
  id: 'user1',
  name: '홍길동',
  job_rank: '대리',
  position: '개발자',
  email: 'hong@example.com',
  ip_address: '192.168.1.1',
  active: true,
  join_date: '2023-01-01',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-02T00:00:00Z',
  seq_no: 1
};

describe('UserDetailModal Component', () => {
  // Mock 함수 생성
  const mockOnClose = jest.fn();
  let store: ReturnType<typeof mockStore>;
  
  beforeEach(() => {
    // 테스트마다 새로운 store 생성
    store = mockStore({
      users: {
        selectedUser: mockUser,
        isLoading: false,
        error: null
      }
    });
  });
  
  test('renders modal when open is true', () => {
    render(
      <Provider store={store}>
        <UserDetailModal 
          open={true}
          onClose={mockOnClose}
        />
      </Provider>
    );
    
    // 모달 제목이 렌더링되는지 확인
    expect(screen.getByText('사용자 상세 정보')).toBeInTheDocument();
    
    // 사용자 정보가 렌더링되는지 확인
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('대리')).toBeInTheDocument();
    expect(screen.getByText('개발자')).toBeInTheDocument();
    expect(screen.getByText('hong@example.com')).toBeInTheDocument();
  });
  
  test('does not render modal when open is false', () => {
    render(
      <Provider store={store}>
        <UserDetailModal 
          open={false}
          onClose={mockOnClose}
        />
      </Provider>
    );
    
    // 모달이 렌더링되지 않으므로 제목도 보이지 않음
    expect(screen.queryByText('사용자 상세 정보')).not.toBeInTheDocument();
  });
  
  test('calls onClose when close button is clicked', () => {
    render(
      <Provider store={store}>
        <UserDetailModal 
          open={true}
          onClose={mockOnClose}
        />
      </Provider>
    );
    
    // 닫기 버튼 찾기
    const closeButton = screen.getByText('닫기');
    
    // 닫기 버튼 클릭
    fireEvent.click(closeButton);
    
    // onClose 콜백이 호출되었는지 확인
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
  
  test('renders not available message when user is null', () => {
    // 사용자가 null인 스토어 생성
    const nullUserStore = mockStore({
      users: {
        selectedUser: null,
        isLoading: false,
        error: null
      }
    });
    
    render(
      <Provider store={nullUserStore}>
        <UserDetailModal 
          open={true}
          onClose={mockOnClose}
        />
      </Provider>
    );
    
    // 사용자 정보가 없을 때는 모달 자체가 렌더링되지 않음
    expect(screen.queryByText('사용자 상세 정보')).not.toBeInTheDocument();
  });
  
  test('displays active status correctly', () => {
    render(
      <Provider store={store}>
        <UserDetailModal 
          open={true}
          onClose={mockOnClose}
        />
      </Provider>
    );
    
    // 활성 상태가 올바르게 표시되는지 확인
    expect(screen.getByText('활성')).toBeInTheDocument();
    
    // 비활성 상태의 사용자가 있는 스토어 생성
    const inactiveUserStore = mockStore({
      users: {
        selectedUser: { ...mockUser, active: false },
        isLoading: false,
        error: null
      }
    });
    
    render(
      <Provider store={inactiveUserStore}>
        <UserDetailModal 
          open={true}
          onClose={mockOnClose}
        />
      </Provider>
    );
    
    // 비활성 상태가 올바르게 표시되는지 확인
    expect(screen.getByText('비활성')).toBeInTheDocument();
  });
  
  test('shows edit mode when mode prop is edit', () => {
    render(
      <Provider store={store}>
        <UserDetailModal 
          open={true}
          onClose={mockOnClose}
          mode="edit"
        />
      </Provider>
    );
    
    // 수정 모드 제목이 표시되는지 확인
    expect(screen.getByText('사용자 정보 수정')).toBeInTheDocument();
    
    // 수정 버튼이 표시되는지 확인
    expect(screen.getByText('수정')).toBeInTheDocument();
    
    // 입력 필드가 표시되는지 확인
    expect(screen.getByDisplayValue('홍길동')).toBeInTheDocument();
  });
}); 