// 개발 환경에서만 MSW 초기화
// MSW 활성화 여부 확인 (기본값은 비활성화)
const useMsw = process.env.NEXT_PUBLIC_USE_MSW === 'true';

// MSW 초기화 함수
async function initMsw() {
  try {
    // 브라우저 환경이 아닌 경우 초기화하지 않음
    if (typeof window === 'undefined') {
      return;
    }

    console.log('[MSW] 초기화 시작...');
    
    // 동적 임포트를 사용하여 서버 사이드 렌더링 문제 해결
    const { worker } = await import('./browser');
    
    // MSW 시작
    await worker.start({
      onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 무시 (warn에서 bypass로 변경)
      serviceWorker: {
        url: '/mockServiceWorker.js',
        options: {
          scope: '/',
        },
      },
    }).catch((error: Error) => {
      console.error('[MSW] 서비스 워커 시작 실패:', error);
      // 실패해도 앱은 계속 실행되도록 함
    });
    
    console.log('[MSW] Mock Service Worker가 활성화되었습니다.');
  } catch (error) {
    console.error('[MSW] 초기화 중 오류 발생:', error);
    // 오류가 발생해도 앱은 계속 실행되도록 함
  }
}

// 개발 환경이고 MSW가 활성화된 경우에만 초기화
if (process.env.NODE_ENV === 'development' && useMsw) {
  // 초기화 시도
  initMsw().catch((error: Error) => {
    console.error('[MSW] 초기화 함수 실행 중 오류 발생:', error);
  });
} else {
  if (process.env.NODE_ENV === 'development') {
    console.log('[MSW] MSW가 비활성화되어 있습니다. 활성화하려면 NEXT_PUBLIC_USE_MSW=true로 설정하세요.');
  }
} 