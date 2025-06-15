import React from 'react';

interface PaginationComponentProps {
  page: number;
  count: number;
  onChange: (event: React.MouseEvent<HTMLButtonElement>, value: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ page, count, onChange }) => {
  // 페이지 버튼을 생성하는 함수
  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5; // 최대 표시할 페이지 버튼 수
    
    // 시작 페이지와 끝 페이지 계산
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > count) {
      endPage = count;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // 첫 페이지 버튼
    if (startPage > 1) {
      buttons.push(
        <button
          key="first"
          onClick={(e) => onChange(e, 1)}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">처음</span>
          <span aria-hidden="true">&laquo;&laquo;</span>
        </button>
      );
    }
    
    // 이전 페이지 버튼
    if (page > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={(e) => onChange(e, page - 1)}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">이전</span>
          <span aria-hidden="true">&laquo;</span>
        </button>
      );
    }
    
    // 페이지 번호 버튼
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={(e) => onChange(e, i)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            i === page
              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    // 다음 페이지 버튼
    if (page < count) {
      buttons.push(
        <button
          key="next"
          onClick={(e) => onChange(e, page + 1)}
          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">다음</span>
          <span aria-hidden="true">&raquo;</span>
        </button>
      );
    }
    
    // 마지막 페이지 버튼
    if (endPage < count) {
      buttons.push(
        <button
          key="last"
          onClick={(e) => onChange(e, count)}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
        >
          <span className="sr-only">마지막</span>
          <span aria-hidden="true">&raquo;&raquo;</span>
        </button>
      );
    }
    
    return buttons;
  };

  return (
    <div className="flex justify-center mt-4">
      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {renderPageButtons()}
      </nav>
    </div>
  );
};

export default PaginationComponent; 