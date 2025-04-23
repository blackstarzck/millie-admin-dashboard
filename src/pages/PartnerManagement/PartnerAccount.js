import React, { useState } from 'react';

const PartnerAccount = () => {
  // 예시 파트너 데이터
  const [partners, setPartners] = useState([
    { id: 'partner001', name: '(주)콘텐츠프로바이더', contactName: '김담당', contactEmail: 'kim@provider.com', contractDate: '2023-01-15', status: '활성' },
    { id: 'partner002', name: '(주)솔루션링크', contactName: '박대표', contactEmail: 'park@solutionlink.net', contractDate: '2023-05-20', status: '활성' },
    { id: 'partner003', name: '개인 작가 이창작', contactName: '이창작', contactEmail: 'lee@creator.org', contractDate: '2024-02-10', status: '비활성' },
  ]);

  // TODO: 파트너 추가/수정/상세보기 기능 구현

  return (
    <div>
      <h1>파트너 계정 관리</h1>

      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <button>신규 파트너 등록</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>파트너 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>파트너명</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>담당자</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>이메일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>계약일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>상태</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id} style={{ borderBottom: '1px solid #eee', backgroundColor: partner.status === '활성' ? 'transparent' : '#f9f9f9' }}>
              <td style={{ padding: '8px' }}>{partner.id}</td>
              <td style={{ padding: '8px' }}>{partner.name}</td>
              <td style={{ padding: '8px' }}>{partner.contactName}</td>
              <td style={{ padding: '8px' }}>{partner.contactEmail}</td>
              <td style={{ padding: '8px' }}>{partner.contractDate}</td>
              <td style={{ padding: '8px' }}>{partner.status}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>상세</button>
                <button style={{ marginRight: '5px' }}>수정</button>
                <button>{partner.status === '활성' ? '비활성화' : '활성화'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 등 추가 가능 */}
    </div>
  );
};

export default PartnerAccount; 