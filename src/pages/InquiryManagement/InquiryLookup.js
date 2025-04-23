import React, { useState } from 'react';

const InquiryLookup = () => {
  // 예시 데이터
  const inquiries = [
    { id: 'inq001', category: '결제', title: '결제가 제대로 안됩니다.', user: 'user001', date: '2024-07-26', status: '답변대기' },
    { id: 'inq002', category: '계정', title: '비밀번호를 잊어버렸어요.', user: 'user008', date: '2024-07-25', status: '답변완료' },
    { id: 'inq003', category: '콘텐츠', title: '오류가 있는 것 같습니다.', user: 'user015', date: '2024-07-25', status: '답변대기' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = (
      inq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.user.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || (filterStatus === 'pending' && inq.status === '답변대기') || (filterStatus === 'completed' && inq.status === '답변완료');
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <h1>문의사항 조회</h1>

      {/* 검색 및 필터링 */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="제목 또는 사용자 ID 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', flexGrow: 1 }}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '8px' }}>
          <option value="all">전체 상태</option>
          <option value="pending">답변 대기</option>
          <option value="completed">답변 완료</option>
        </select>
      </div>

      {/* 문의 목록 테이블 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>문의 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>카테고리</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>제목</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>문의자</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>문의일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>상태</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredInquiries.map((inquiry) => (
            <tr key={inquiry.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{inquiry.id}</td>
              <td style={{ padding: '8px' }}>{inquiry.category}</td>
              <td style={{ padding: '8px' }}>{inquiry.title}</td>
              <td style={{ padding: '8px' }}>{inquiry.user}</td>
              <td style={{ padding: '8px' }}>{inquiry.date}</td>
              <td style={{ padding: '8px' }}>{inquiry.status}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>상세/답변</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 등 추가 가능 */}
    </div>
  );
};

export default InquiryLookup; 