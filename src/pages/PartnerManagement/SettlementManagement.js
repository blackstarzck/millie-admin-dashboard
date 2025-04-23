import React, { useState } from 'react';

const SettlementManagement = () => {
  // 예시 정산 데이터
  const [settlements, setSettlements] = useState([
    { id: 'settle001', partnerId: 'partner001', partnerName: '(주)콘텐츠프로바이더', period: '2024-06', amount: 1500000, status: '지급완료', paymentDate: '2024-07-10' },
    { id: 'settle002', partnerId: 'partner002', partnerName: '(주)솔루션링크', period: '2024-06', amount: 850000, status: '지급완료', paymentDate: '2024-07-10' },
    { id: 'settle003', partnerId: 'partner001', partnerName: '(주)콘텐츠프로바이더', period: '2024-07', amount: 1750000, status: '대기중', paymentDate: '-' },
    { id: 'settle004', partnerId: 'partner002', partnerName: '(주)솔루션링크', period: '2024-07', amount: 920000, status: '대기중', paymentDate: '-' },
  ]);

  // TODO: 정산 생성/수정/삭제 및 상태 변경 기능 구현
  // TODO: 검색/필터링 기능 (파트너별, 기간별, 상태별)

  return (
    <div>
      <h1>파트너 정산 관리</h1>

      {/* 검색/필터 영역 추가 가능 */}
      {/* 정산 생성 기능 추가 가능 */}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>정산 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>파트너명</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>정산 기간</th>
            <th style={{ padding: '8px', textAlign: 'right' }}>정산 금액</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>상태</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>지급일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {settlements.map((settlement) => (
            <tr key={settlement.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{settlement.id}</td>
              <td style={{ padding: '8px' }}>{settlement.partnerName} ({settlement.partnerId})</td>
              <td style={{ padding: '8px' }}>{settlement.period}</td>
              <td style={{ padding: '8px', textAlign: 'right' }}>{settlement.amount.toLocaleString()} 원</td>
              <td style={{ padding: '8px' }}>{settlement.status}</td>
              <td style={{ padding: '8px' }}>{settlement.paymentDate}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>상세</button>
                {settlement.status === '대기중' && (
                  <button>지급 처리</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 페이지네이션 등 추가 가능 */}
    </div>
  );
};

export default SettlementManagement; 