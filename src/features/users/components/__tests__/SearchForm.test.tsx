import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SearchForm from '../SearchForm';

// fetchUsers 액션 모킹
jest.mock('../../redux/userSlice', () => ({
  ...jest.requireActual('../../redux/userSlice'),
  fetchUsers: jest.fn().mockReturnValue({ type: 'users/fetchUsers/pending' }),
  setSearchParams: jest.fn().mockImplementation((params) => ({
    type: 'users/setSearchParams',
    payload: params
  }))
}));

// Mock store 설정
const mockStore = configureStore([]);

describe('SearchForm Component', () => {
  let store: ReturnType<typeof mockStore>;
  
  beforeEach(() => {
    // 테스트마다 새로운 store 생성
    store = mockStore({
      users: {
        searchParams: {
          page_index: 1,
          page_size: 10,
          name: '',
          email: '',
          job_rank: ''
        }
      }
    });
    
    // dispatch 메서드를 모킹하여 액션 추적
    store.dispatch = jest.fn().mockReturnValue({ type: 'mocked_dispatch' });
    
    // 각 테스트 전에 모든 mock 함수 초기화
    jest.clearAllMocks();
  });

  test('renders search form correctly', () => {
    render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );
    
    // 폼 요소들이 렌더링되는지 확인
    expect(screen.getByLabelText('이름')).toBeInTheDocument();
    expect(screen.getByLabelText('이메일')).toBeInTheDocument();
    expect(screen.getByLabelText('직급')).toBeInTheDocument();
    expect(screen.getByText('검색')).toBeInTheDocument();
    expect(screen.getByText('초기화')).toBeInTheDocument();
  });

  test('updates input values when typing', () => {
    render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );
    
    // 이름 입력 필드 찾기
    const nameInput = screen.getByLabelText('이름') as HTMLInputElement;
    
    // 이름 입력 필드에 값 입력
    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    
    // 입력 값이 업데이트되었는지 확인
    expect(nameInput.value).toBe('홍길동');
    
    // 이메일 입력 필드 찾기
    const emailInput = screen.getByLabelText('이메일') as HTMLInputElement;
    
    // 이메일 입력 필드에 값 입력
    fireEvent.change(emailInput, { target: { value: 'hong@example.com' } });
    
    // 입력 값이 업데이트되었는지 확인
    expect(emailInput.value).toBe('hong@example.com');
  });

  test('dispatches search action when form is submitted', () => {
    render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );
    
    // 이름 입력 필드에 값 입력
    const nameInput = screen.getByLabelText('이름');
    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    
    // 이메일 입력 필드에 값 입력
    const emailInput = screen.getByLabelText('이메일');
    fireEvent.change(emailInput, { target: { value: 'hong@example.com' } });
    
    // 검색 버튼 클릭
    const searchButton = screen.getByText('검색');
    fireEvent.click(searchButton);
    
    // setSearchParams 액션이 디스패치되었는지 확인
    expect(store.dispatch).toHaveBeenCalledTimes(2); // setSearchParams와 fetchUsers 두 번 호출
    
    // 첫 번째 호출이 setSearchParams인지 확인
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'users/setSearchParams',
      payload: expect.objectContaining({
        page_index: 1,
        page_size: 10,
        name: '홍길동',
        email: 'hong@example.com'
      })
    }));
  });

  test('resets form values when reset button is clicked', () => {
    render(
      <Provider store={store}>
        <SearchForm />
      </Provider>
    );
    
    // 이름 입력 필드에 값 입력
    const nameInput = screen.getByLabelText('이름') as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: '홍길동' } });
    
    // 이메일 입력 필드에 값 입력
    const emailInput = screen.getByLabelText('이메일') as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'hong@example.com' } });
    
    // 초기화 버튼 클릭
    const resetButton = screen.getByText('초기화');
    fireEvent.click(resetButton);
    
    // 입력 필드가 초기화되었는지 확인
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    
    // setSearchParams 액션이 디스패치되었는지 확인
    expect(store.dispatch).toHaveBeenCalledTimes(2); // setSearchParams와 fetchUsers 두 번 호출
    
    // 첫 번째 호출이 setSearchParams인지 확인
    expect(store.dispatch).toHaveBeenNthCalledWith(1, expect.objectContaining({
      type: 'users/setSearchParams',
      payload: expect.objectContaining({
        page_index: 1,
        page_size: 10,
        name: '',
        email: '',
        job_rank: ''
      })
    }));
  });
}); 