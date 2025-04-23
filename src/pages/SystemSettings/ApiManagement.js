import React, { useState } from 'react';

const ApiManagement = () => {
  // 예시 API 키 데이터
  const [apiKeys, setApiKeys] = useState([
    { id: 'key_abc123', name: '외부 연동 서비스 A', keyPrefix: 'sk_live_abc...', createdDate: '2024-06-01', lastUsed: '2024-07-26', isActive: true },
    { id: 'key_def456', name: '모바일 앱 백엔드', keyPrefix: 'pk_test_def...', createdDate: '2024-05-15', lastUsed: '2024-07-20', isActive: true },
    { id: 'key_ghi789', name: '레거시 시스템 연동', keyPrefix: 'sk_live_ghi...', createdDate: '2023-01-10', lastUsed: '2024-01-05', isActive: false },
  ]);

  const [newKeyName, setNewKeyName] = useState('');

  const handleGenerateKey = () => {
    if (!newKeyName) {
      alert('새 API 키의 이름을 입력해주세요.');
      return;
    }
    // 실제 API 키 생성 로직 (백엔드 호출)
    const generatedKey = `sk_live_${Math.random().toString(36).substring(2, 15)}`; // 실제 키는 백엔드에서 생성
    const newKeyEntry = {
      id: `key_${Math.random().toString(36).substring(2, 8)}`,
      name: newKeyName,
      keyPrefix: `${generatedKey.substring(0, 10)}...`,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: '-',
      isActive: true
    };
    setApiKeys([newKeyEntry, ...apiKeys]);
    setNewKeyName('');
    alert(`새 API 키가 생성되었습니다: ${generatedKey}\n(실제 키는 안전하게 별도 보관하세요)`);
  };

  const handleToggleActive = (keyId) => {
    setApiKeys(apiKeys.map(key => key.id === keyId ? { ...key, isActive: !key.isActive } : key));
    // 실제 백엔드 상태 변경 로직 호출
  };

  const handleDeleteKey = (keyId) => {
    if (window.confirm('정말로 이 API 키를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        setApiKeys(apiKeys.filter(key => key.id !== keyId));
        // 실제 백엔드 삭제 로직 호출
    }
  }

  return (
    <div>
      <h1>API 키 관리</h1>

      {/* 새 API 키 생성 */}
      <div style={{ marginBottom: '2rem', border: '1px solid #eee', padding: '1rem', maxWidth: '500px' }}>
        <h2>새 API 키 생성</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="API 키 이름 (용도)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            style={{ padding: '8px', flexGrow: 1 }}
          />
          <button onClick={handleGenerateKey} style={{ padding: '8px' }}>키 생성</button>
        </div>
      </div>

      {/* API 키 목록 */}
      <h2>API 키 목록</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>이름 (용도)</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>키 (Prefix)</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>생성일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>마지막 사용</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>상태</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id} style={{ borderBottom: '1px solid #eee', backgroundColor: key.isActive ? 'transparent' : '#f9f9f9' }}>
              <td style={{ padding: '8px' }}>{key.name}</td>
              <td style={{ padding: '8px' }}>{key.keyPrefix}</td>
              <td style={{ padding: '8px' }}>{key.createdDate}</td>
              <td style={{ padding: '8px' }}>{key.lastUsed}</td>
              <td style={{ padding: '8px' }}>{key.isActive ? '활성' : '비활성'}</td>
              <td style={{ padding: '8px' }}>
                <button onClick={() => handleToggleActive(key.id)} style={{ marginRight: '5px' }}>
                  {key.isActive ? '비활성화' : '활성화'}
                </button>
                <button onClick={() => handleDeleteKey(key.id)} style={{ color: 'red' }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApiManagement; 