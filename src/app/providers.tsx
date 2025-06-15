'use client';

import { Provider } from 'react-redux';
import { store } from './store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">사전과제 - 사용자 조회</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">관리자</span>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow bg-gray-50 min-h-screen">
        {children}
      </main>
      <footer className="bg-white border-t mt-auto py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} 사전과제 - 사용자 조회. All rights reserved.
          </p>
        </div>
      </footer>
    </Provider>
  );
} 