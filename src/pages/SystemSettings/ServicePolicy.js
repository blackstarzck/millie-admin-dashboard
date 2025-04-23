import React, { useState } from 'react';

const ServicePolicy = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('terms_of_service'); // terms_of_service, privacy_policy
  const [policyContent, setPolicyContent] = useState('');
  const [policyVersion, setPolicyVersion] = useState('1.0');
  const [lastUpdated, setLastUpdated] = useState('2024-01-01');

  // 선택된 정책에 따라 내용을 로드하는 가상 로직
  React.useEffect(() => {
    console.log(`Loading content for policy: ${selectedPolicy}`);
    if (selectedPolicy === 'terms_of_service') {
      setPolicyContent('제 1 조 (목적)\n이 약관은...'); // 실제 약관 내용 로드
      setPolicyVersion('1.5');
      setLastUpdated('2024-07-01');
    } else if (selectedPolicy === 'privacy_policy') {
      setPolicyContent('개인정보 처리방침\n1. 수집하는 개인정보 항목...'); // 실제 방침 내용 로드
      setPolicyVersion('2.1');
      setLastUpdated('2024-06-15');
    }
  }, [selectedPolicy]);

  const handleSavePolicy = () => {
    // 실제 정책 내용 및 버전 저장 로직 (API 호출)
    console.log(`Saving policy ${selectedPolicy} version ${policyVersion}:`, policyContent);
    alert('서비스 정책이 저장되었습니다.');
    setLastUpdated(new Date().toISOString().split('T')[0]); // 저장 시 최종 수정일 업데이트
  };

  return (
    <div>
      <h1>서비스 정책 관리</h1>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="policySelect">관리할 정책 선택:</label>
        <select
          id="policySelect"
          value={selectedPolicy}
          onChange={(e) => setSelectedPolicy(e.target.value)}
          style={{ marginLeft: '8px', padding: '4px' }}
        >
          <option value="terms_of_service">이용약관</option>
          <option value="privacy_policy">개인정보 처리방침</option>
          {/* 다른 정책 추가 가능 */}
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p><strong>현재 버전:</strong> {policyVersion} (최종 수정일: {lastUpdated})</p>
        {/* 버전 히스토리 보기 기능 추가 가능 */}
      </div>

      {/* 정책 내용 에디터 */}
      <div>
        <label htmlFor="policyContent">정책 내용:</label>
        <textarea
          id="policyContent"
          value={policyContent}
          onChange={(e) => setPolicyContent(e.target.value)}
          rows={20}
          style={{ width: '100%', padding: '8px', marginTop: '4px', border: '1px solid #ccc' }}
          placeholder="여기에 정책 내용을 입력하세요..."
        />
      </div>

      {/* 버전 정보 입력 (옵션) */}
      <div style={{ marginTop: '1rem' }}>
        <label htmlFor="newVersion">새 버전 번호 (선택 사항):</label>
        <input
          id="newVersion"
          type="text"
          value={policyVersion} // 현재 버전을 보여주고 수정 가능하게 할 수도 있음
          onChange={(e) => setPolicyVersion(e.target.value)}
          placeholder="예: 1.6"
          style={{ marginLeft: '8px', padding: '4px' }}
        />
      </div>

      <button onClick={handleSavePolicy} style={{ padding: '10px 15px', cursor: 'pointer', marginTop: '1rem' }}>
        정책 저장 (버전: {policyVersion})
      </button>
    </div>
  );
};

export default ServicePolicy; 