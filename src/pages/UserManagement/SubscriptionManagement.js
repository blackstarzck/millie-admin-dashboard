import React from 'react';

const SubscriptionManagement = () => {
  // 예시 데이터
  const subscriptions = [
    { userId: 'user001', email: 'gildong@example.com', subscribed: true, subscriptionDate: '2024-07-01' },
    { userId: 'user002', email: 'chulsoo@example.com', subscribed: true, subscriptionDate: '2024-06-15' },
    { userId: 'user003', email: 'younghee@example.com', subscribed: false, unsubscriptionDate: '2024-07-10' },
  ];

  return (
    <div>
      <h1>구독/탈퇴 관리</h1>
      {/* 검색/필터링 UI 추가 가능 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>사용자 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>이메일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>구독 상태</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>최근 변경일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.userId} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{sub.userId}</td>
              <td style={{ padding: '8px' }}>{sub.email}</td>
              <td style={{ padding: '8px' }}>{sub.subscribed ? '구독중' : '탈퇴'}</td>
              <td style={{ padding: '8px' }}>{sub.subscribed ? sub.subscriptionDate : sub.unsubscriptionDate}</td>
              <td style={{ padding: '8px' }}>
                <button>
                  {sub.subscribed ? '구독 해지 처리' : '구독 상태 변경'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionManagement; 