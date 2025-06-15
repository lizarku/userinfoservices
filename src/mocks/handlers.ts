import { http, HttpResponse } from 'msw';
import { getUserByIdResponse, searchUsersResponse, apiResponse, apiErrorResponse } from './userData';
import { UserUpdateParams } from '../types/user';

// API 기본 URL - 정확한 경로로 수정
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '55351d39-8898-41eb-aa52-15c63e4f738d';
const BASE_URL = `https://fabricate.mockaroo.com/api/v1/workspaces/danal/databases/${API_KEY}/api`;

// 디버깅을 위한 핸들러 경로 출력
console.log('[MSW] 핸들러 등록 경로:', `${BASE_URL}/users`);

export const handlers = [
  // 사용자 목록 조회 API - 정확한 경로 패턴 사용
  // API 명세에 따라 params 매개변수 유지 (현재는 사용하지 않지만 향후 확장성을 위해 유지)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  http.get(`${BASE_URL}/users`, async ({ request, params }) => {
    try {
      console.log('[MSW 인터셉트] 사용자 목록 조회 API');
      console.log('[MSW 인터셉트] URL:', request.url);
      
      const url = new URL(request.url);
      console.log('[MSW 인터셉트] 파라미터:', url.searchParams.toString());
      
      const pageIndex = parseInt(url.searchParams.get('page_index') || '1');
      const pageSize = parseInt(url.searchParams.get('page_size') || '10');
      const id = url.searchParams.get('id') || undefined;
      const name = url.searchParams.get('name') || undefined;
      const email = url.searchParams.get('email') || undefined;
      const jobRank = url.searchParams.get('job_rank') || undefined;
      const position = url.searchParams.get('position') || undefined;
      const active = url.searchParams.get('active') ? url.searchParams.get('active') === 'true' : undefined;

      const searchParams = {
        page_index: pageIndex,
        page_size: pageSize,
        id,
        name,
        email,
        job_rank: jobRank,
        position,
        active
      };

      const response = searchUsersResponse(searchParams);
      console.log('[MSW 인터셉트] 응답 데이터:', response);
      
      return HttpResponse.json(apiResponse(response), { status: 200 });
    } catch (error) {
      console.error('[MSW 인터셉트] 사용자 목록 조회 API 에러:', error);
      return HttpResponse.json(apiErrorResponse(500, '서버 오류가 발생했습니다.'), { status: 500 });
    }
  }),

  // 사용자 상세 조회 API
  http.get(`${BASE_URL}/users/:id`, async ({ request, params }) => {
    try {
      console.log('[MSW 인터셉트] 사용자 상세 조회 API');
      console.log('[MSW 인터셉트] URL:', request.url);
      console.log('[MSW 인터셉트] ID:', params.id);
      
      const { id } = params;
      const response = getUserByIdResponse(id as string);

      if (!response) {
        return HttpResponse.json(apiErrorResponse(404, '사용자를 찾을 수 없습니다.'), { status: 404 });
      }

      console.log('[MSW 인터셉트] 응답 데이터:', response);
      
      return HttpResponse.json(apiResponse(response), { status: 200 });
    } catch (error) {
      console.error('[MSW 인터셉트] 사용자 상세 조회 API 에러:', error);
      return HttpResponse.json(apiErrorResponse(500, '서버 오류가 발생했습니다.'), { status: 500 });
    }
  }),

  // 사용자 정보 수정 API
  http.post(`${BASE_URL}/users/:id`, async ({ request, params }) => {
    try {
      console.log('[MSW 인터셉트] 사용자 정보 수정 API');
      console.log('[MSW 인터셉트] URL:', request.url);
      console.log('[MSW 인터셉트] ID:', params.id);
      
      const { id } = params;
      // 요청 데이터 사용 (실제로는 업데이트 작업 수행하지 않음)
      const userData = await request.json() as UserUpdateParams;
      console.log('[MSW 인터셉트] 요청 데이터:', userData);
      
      const user = getUserByIdResponse(id as string);
      
      if (!user) {
        return HttpResponse.json(apiErrorResponse(404, '사용자를 찾을 수 없습니다.'), { status: 404 });
      }

      // 실제로는 데이터를 업데이트하지 않고 성공 응답만 반환
      const response = {
        meta: {
          status: 200,
          message: '사용자 정보가 성공적으로 업데이트되었습니다.'
        }
      };
      
      console.log('[MSW 인터셉트] 응답 데이터:', response);
      
      return HttpResponse.json(response, { status: 200 });
    } catch (error) {
      console.error('[MSW 인터셉트] 사용자 정보 수정 API 에러:', error);
      return HttpResponse.json(apiErrorResponse(500, '서버 오류가 발생했습니다.'), { status: 500 });
    }
  }),

  // 사용자 삭제 API
  http.delete(`${BASE_URL}/users/:id`, async ({ request, params }) => {
    try {
      console.log('[MSW 인터셉트] 사용자 삭제 API');
      console.log('[MSW 인터셉트] URL:', request.url);
      console.log('[MSW 인터셉트] ID:', params.id);
      
      const { id } = params;
      const user = getUserByIdResponse(id as string);
      
      if (!user) {
        return HttpResponse.json(apiErrorResponse(404, '사용자를 찾을 수 없습니다.'), { status: 404 });
      }

      // 실제로는 데이터를 삭제하지 않고 성공 응답만 반환
      const response = {
        meta: {
          status: 200,
          message: '사용자가 성공적으로 삭제되었습니다.'
        }
      };
      
      console.log('[MSW 인터셉트] 응답 데이터:', response);
      
      return HttpResponse.json(response, { status: 200 });
    } catch (error) {
      console.error('[MSW 인터셉트] 사용자 삭제 API 에러:', error);
      return HttpResponse.json(apiErrorResponse(500, '서버 오류가 발생했습니다.'), { status: 500 });
    }
  })
]; 