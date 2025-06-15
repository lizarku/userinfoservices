# 사전과제 - 사용자 조회

사용자 정보 관리 서비스를 위한 관리자 웹 애플리케이션입니다. 이 프로젝트는 React, TypeScript, Next.js를 기반으로 구현되었습니다.

## 목차

- [기능 소개](#기능-소개)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
  - [사전 요구사항](#사전-요구사항)
  - [설치 방법](#설치-방법)
  - [개발 서버 실행](#개발-서버-실행)
  - [프로덕션 빌드](#프로덕션-빌드)
- [프로젝트 구조](#프로젝트-구조)
- [API 연동](#api-연동)
  - [로컬 모의 데이터 사용](#로컬-모의-데이터-사용)
- [테스트](#테스트)
- [트러블슈팅](#트러블슈팅)
  - [API 연결 문제](#api-연결-문제)
  - [AxiosError 해결 방법](#axioserror-해결-방법)
- [기여 방법](#기여-방법)
- [라이센스](#라이센스)

## 기능 소개

본 애플리케이션은 다음과 같은 기능을 제공합니다:

- 사용자 목록 조회 및 검색
- 사용자 상세 정보 조회
- 사용자 정보 수정
- 사용자 삭제
- 페이지네이션 및 필터링

## 기술 스택

- **프론트엔드**: React 18, TypeScript, Next.js 15
- **상태 관리**: Redux (Redux Toolkit)
- **UI 컴포넌트**: Tailwind CSS, Headless UI
- **API 통신**: Axios
- **개발 환경**: Node.js, npm
- **테스트**: Jest, React Testing Library
- **코드 품질**: ESLint, Prettier

## 시작하기

### 사전 요구사항

- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치 방법

1. 저장소를 클론합니다:

```bash
git clone https://github.com/your-username/userinfoservices.git
cd userinfoservices
```

2. 의존성 패키지를 설치합니다:

```bash
npm install
```

3. 환경 변수 설정:

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 내용을 추가합니다:

```
# API 키 설정
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_AUTH_KEY=your_auth_key

# 로컬 모의 데이터 사용 설정 (true/false)
NEXT_PUBLIC_USE_MOCK_DATA=true
```

> **참고**: 실제 API 키와 인증 키는 별도로 제공됩니다. 기본값은 코드에 포함되어 있습니다.
> **중요**: API 서버 연결 문제가 있을 경우 `NEXT_PUBLIC_USE_MOCK_DATA=true`로 설정하여 로컬 모의 데이터를 사용할 수 있습니다.

### 개발 서버 실행

개발 서버를 실행하려면 다음 명령어를 사용합니다:

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드

프로덕션용 빌드를 생성하려면 다음 명령어를 실행합니다:

```bash
npm run build
```

빌드된 애플리케이션을 실행하려면:

```bash
npm start
```

## 프로젝트 구조

```
userinfoservices/
├── public/                 # 정적 파일
├── src/                    # 소스 코드
│   ├── _setting/           # 설정 파일 (Axios, 환경 설정 등)
│   │   └── axios/          # Axios 설정 및 인터셉터
│   ├── api/                # API 호출 관련 코드
│   ├── app/                # Next.js 애플리케이션 라우팅
│   │   ├── api-test/       # API 테스트 페이지
│   │   ├── hooks.ts        # Redux hooks
│   │   ├── layout.tsx      # 레이아웃 컴포넌트
│   │   ├── page.tsx        # 메인 페이지
│   │   ├── providers.tsx   # 프로바이더 컴포넌트
│   │   └── store.ts        # Redux 스토어 설정
│   ├── components/         # 공통 컴포넌트
│   │   └── common/         # 공통 UI 컴포넌트
│   ├── features/           # 기능별 모듈화된 코드
│   │   └── users/          # 사용자 관련 기능
│   │       ├── api/        # 사용자 API 서비스
│   │       ├── components/ # 사용자 관련 컴포넌트
│   │       └── redux/      # 사용자 관련 Redux 코드
│   ├── mocks/              # 목업 데이터 및 서비스
│   ├── styles/             # 전역 스타일
│   └── types/              # TypeScript 타입 정의
├── .eslintrc.json          # ESLint 설정
├── .gitignore              # Git 무시 파일 목록
├── next.config.js          # Next.js 설정
├── package.json            # 프로젝트 메타데이터 및 의존성
├── tailwind.config.js      # Tailwind CSS 설정
├── tsconfig.json           # TypeScript 설정
└── README.md               # 프로젝트 문서
```

## API 연동

이 프로젝트는 Mockaroo API를 사용하여 사용자 데이터를 관리합니다. API 연동에 관한 세부 정보는 다음과 같습니다:

- **기본 URL**: `https://fabricate.mockaroo.com/api/v1/workspaces/danal/databases/{api_key}/api`
- **인증 방식**: Bearer Token (`Authorization: Bearer {auth_key}`)
- **주요 엔드포인트**:
  - 사용자 목록 조회: `GET /users`
  - 사용자 상세 조회: `GET /users/:id`
  - 사용자 정보 수정: `POST /users/:id`
  - 사용자 삭제: `DELETE /users/:id`

### 구현된 API 기능

모든 API는 기능정의서에 명시된 스펙에 따라 구현되었으며, 다음과 같은 기능을 제공합니다:

1. **사용자 목록 조회 API**
   - 페이지네이션 지원 (page_index, page_size)
   - 검색 필터링 지원 (이름, 이메일, 직급)
   - 정렬 기능

2. **사용자 상세 조회 API**
   - 사용자 ID 기반 상세 정보 조회
   - 모달 형태로 표시

3. **사용자 정보 수정 API**
   - 사용자 정보 업데이트
   - 실시간 목록 반영

4. **사용자 삭제 API**
   - 사용자 ID 기반 삭제
   - 삭제 전 확인 대화상자 표시

### 로컬 모의 데이터 사용

API 서버가 불안정하거나 연결이 불가능한 경우, 로컬 모의 데이터를 사용하여 개발을 계속할 수 있습니다:

1. `.env.local` 파일에서 `NEXT_PUBLIC_USE_MOCK_DATA=true`로 설정합니다.
2. 이 설정을 통해 API 호출 실패 시 자동으로 로컬 모의 데이터를 사용합니다.
3. 모의 데이터는 `src/mocks/userData.ts` 파일에 정의되어 있으며, 필요에 따라 수정할 수 있습니다.

## 상태 관리

이 프로젝트는 Redux Toolkit을 사용하여 상태 관리를 구현했습니다:

1. **Redux 스토어**: `src/app/store.ts`에 정의
2. **사용자 관련 상태**: `src/features/users/redux/userSlice.ts`에서 관리
3. **비동기 액션**: Redux Toolkit의 `createAsyncThunk`를 사용하여 API 호출 처리
4. **상태 접근**: `useAppSelector`와 `useAppDispatch` 훅을 통해 컴포넌트에서 상태 접근

## 테스트

테스트를 실행하려면 다음 명령어를 사용합니다:

```bash
# 모든 테스트 실행
npm test

# 특정 테스트 파일 실행
npm test -- src/features/users/components/UserList.test.tsx

# 테스트 커버리지 보고서 생성
npm test -- --coverage
```

## 트러블슈팅

### API 연결 문제

API 서버 연결에 문제가 있을 경우:

1. 환경 변수 설정을 확인합니다 (`.env.local`).
2. 네트워크 연결을 확인합니다.
3. `.env.local` 파일에서 `NEXT_PUBLIC_USE_MOCK_DATA=true`로 설정하여 로컬 모의 데이터를 사용합니다.
4. 네트워크 요청 타임아웃 설정을 확인합니다 (`src/_setting/axios/request.ts`의 `timeout` 값).

### AxiosError 해결 방법

"AxiosError" 오류가 발생하는 경우 다음 해결 방법을 시도해 보세요:

1. **타임아웃 설정 확인**: 
   - `src/_setting/axios/request.ts` 파일에서 `timeout` 값이 충분히 큰지 확인합니다 (기본값: 30000ms).

2. **네트워크 연결 확인**:
   - 브라우저 개발자 도구의 네트워크 탭에서 API 요청 상태를 확인합니다.
   - CORS 정책 오류가 있는지 확인합니다.

3. **로컬 모의 데이터 사용**:
   - `.env.local` 파일에서 `NEXT_PUBLIC_USE_MOCK_DATA=true`로 설정합니다.
   - 이 설정은 API 호출이 실패할 경우 자동으로 로컬 모의 데이터를 사용하도록 합니다.

4. **API 키 확인**:
   - 올바른 API 키와 인증 토큰을 사용하고 있는지 확인합니다.
   - 콘솔에 출력된 디버깅 정보를 확인합니다.

### 개발 서버 실행 문제

개발 서버 실행 중 문제가 발생할 경우:

1. Node.js 버전이 18.0.0 이상인지 확인합니다.
2. `npm install`을 다시 실행하여 의존성을 재설치합니다.
3. `.next` 폴더를 삭제한 후 다시 시도합니다.

## 기여 방법

1. 이 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`).
3. 변경 사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`).
5. Pull Request를 생성합니다.

## 라이센스

이 프로젝트는 내부용으로 제작되었으며, 모든 권리는 회사에 귀속됩니다.

