import React, { useState } from 'react';

const InquiryFiltering = () => {
  // 예시 필터링 규칙 데이터
  const [filters, setFilters] = useState([
    { id: 'filter01', name: '결제 오류 문의 자동 분류', condition: 'title contains \'결제 오류\'', action: 'Assign to Payment Team', isActive: true },
    { id: 'filter02', name: '긴급 키워드 포함 시 우선순위 높음', condition: 'content contains \'긴급\' or content contains \'장애\'', action: 'Set Priority High', isActive: true },
    { id: 'filter03', name: '스팸 메일 필터링', condition: 'sender email matches regex /.*@spamdomain\.com/', action: 'Mark as Spam', isActive: false },
  ]);

  // TODO: 필터 추가/수정/삭제 기능 구현

  return (
    <div>
      <h1>문의사항 필터링/분류 규칙</h1>
      <p>접수되는 문의사항을 자동으로 분류하거나 특정 조건을 만족할 때 액션을 수행하는 규칙을 설정합니다.</p>

      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <button>새 필터 규칙 추가</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>필터 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>규칙명</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>조건</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>액션</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>활성 상태</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {filters.map((filter) => (
            <tr key={filter.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{filter.id}</td>
              <td style={{ padding: '8px' }}>{filter.name}</td>
              <td style={{ padding: '8px' }}>{filter.condition}</td>
              <td style={{ padding: '8px' }}>{filter.action}</td>
              <td style={{ padding: '8px' }}>{filter.isActive ? '활성' : '비활성'}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>수정</button>
                <button style={{ marginRight: '5px' }}>{filter.isActive ? '비활성화' : '활성화'}</button>
                <button>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InquiryFiltering; 