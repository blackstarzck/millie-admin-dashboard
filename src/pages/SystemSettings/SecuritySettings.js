import React, { useState } from 'react';

const SecuritySettings = () => {
  // 예시 설정값 (실제로는 API 등에서 로드 및 저장)
  const [settings, setSettings] = useState({
    passwordPolicy: 'medium', // none, medium, strong
    passwordExpiryDays: 90,
    mfaEnabled: true,
    allowedIPs: '192.168.1.0/24, 10.0.0.1',
    sessionTimeoutMinutes: 60,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = () => {
    // 실제 설정 저장 로직 (API 호출)
    console.log('Saving security settings:', settings);
    alert('보안 설정이 저장되었습니다.');
  };

  const inputStyle = { padding: '8px', marginTop: '4px', width: '250px' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold' };
  const sectionStyle = { marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eee' };

  return (
    <div>
      <h1>보안 설정</h1>

      <div style={sectionStyle}>
        <h2>로그인 및 비밀번호 정책</h2>
        <div>
          <label htmlFor="passwordPolicy" style={labelStyle}>비밀번호 복잡도 요구 수준:</label>
          <select id="passwordPolicy" name="passwordPolicy" value={settings.passwordPolicy} onChange={handleInputChange} style={inputStyle}>
            <option value="none">없음 (권장하지 않음)</option>
            <option value="medium">중간 (영문, 숫자 조합)</option>
            <option value="strong">강함 (영문, 숫자, 특수문자 조합, 길이 제한)</option>
          </select>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label htmlFor="passwordExpiryDays" style={labelStyle}>비밀번호 만료 기간 (일):</label>
          <input
            id="passwordExpiryDays"
            name="passwordExpiryDays"
            type="number"
            value={settings.passwordExpiryDays}
            onChange={handleInputChange}
            style={inputStyle}
            placeholder="0일 경우 만료 없음"
          />
        </div>
      </div>

      <div style={sectionStyle}>
        <h2>2단계 인증 (MFA)</h2>
        <div>
          <label htmlFor="mfaEnabled" style={labelStyle}>모든 관리자에게 2단계 인증 강제:</label>
          <input
            id="mfaEnabled"
            name="mfaEnabled"
            type="checkbox"
            checked={settings.mfaEnabled}
            onChange={handleInputChange}
          />
          <span style={{ marginLeft: '8px' }}>활성화</span>
        </div>
        {/* MFA 관련 추가 설정 (예: 복구 코드 관리) UI 추가 가능 */}
      </div>

      <div style={sectionStyle}>
        <h2>접근 제어</h2>
        <div>
          <label htmlFor="allowedIPs" style={labelStyle}>관리자 페이지 접근 허용 IP (쉼표로 구분, CIDR 지원):</label>
          <textarea
            id="allowedIPs"
            name="allowedIPs"
            value={settings.allowedIPs}
            onChange={handleInputChange}
            rows={3}
            style={{ ...inputStyle, width: '400px' }}
            placeholder="예: 192.168.1.1, 10.0.0.0/16"
          />
        </div>
      </div>

      <div style={sectionStyle}>
          <h2>세션 관리</h2>
          <div>
              <label htmlFor="sessionTimeoutMinutes" style={labelStyle}>자동 로그아웃 시간 (분):</label>
              <input
                  id="sessionTimeoutMinutes"
                  name="sessionTimeoutMinutes"
                  type="number"
                  value={settings.sessionTimeoutMinutes}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="0일 경우 자동 로그아웃 없음"
              />
          </div>
      </div>

      <button onClick={handleSave} style={{ padding: '10px 15px', cursor: 'pointer' }}>설정 저장</button>
    </div>
  );
};

export default SecuritySettings; 