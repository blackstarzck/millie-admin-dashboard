import React, { useState } from 'react';

const InquiryManagementPartner = () => {
  // 예시 데이터
  const inquiries = [
    { id: 'pinq001', partnerId: 'partner001', partnerName: '(주)콘텐츠프로바이더', category: '정산', title: '6월 정산금액 관련 문의', date: '2024-07-05', status: '답변완료' },
    { id: 'pinq002', partnerId: 'partner002', partnerName: '(주)솔루션링크', category: '계약', title: '계약 연장 조건 문의', date: '2024-07-15', status: '답변대기' },
    { id: 'pinq003', partnerId: 'partner001', partnerName: '(주)콘텐츠프로바이더', category: '기술지원', title: '콘텐츠 업로드 API 오류 문의', date: '2024-07-20', status: '답변대기' },
  ];

  // TODO: 검색/필터링 기능 구현
  // TODO: 답변 작성/관리 기능 구현

  return (
    <div>
      <h1>파트너 문의 관리</h1>

      {/* 검색 및 필터링 영역 추가 가능 */}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>문의 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>파트너명</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>카테고리</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>제목</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>문의일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>상태</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <tr key={inquiry.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{inquiry.id}</td>
              <td style={{ padding: '8px' }}>{inquiry.partnerName} ({inquiry.partnerId})</td>
              <td style={{ padding: '8px' }}>{inquiry.category}</td>
              <td style={{ padding: '8px' }}>{inquiry.title}</td>
              <td style={{ padding: '8px' }}>{inquiry.date}</td>
              <td style={{ padding: '8px' }}>{inquiry.status}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>상세/답변</button>
                {/* 상태 변경 등 */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 등 추가 가능 */}
    </div>
  );
};

export default InquiryManagementPartner; 