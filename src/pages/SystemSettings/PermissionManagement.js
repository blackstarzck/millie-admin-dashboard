import React, { useState } from 'react';

const PermissionManagement = () => {
  // 예시 데이터: 역할 기반 권한
  const [roles, setRoles] = useState([
    { id: 'admin', name: '관리자', permissions: ['*.*.*.*.*.*'] }, // 예: CRUD 모든 리소스
    { id: 'editor', name: '편집자', permissions: ['content.books.create', 'content.books.update', 'content.categories.create', 'content.categories.update'] },
    { id: 'viewer', name: '뷰어', permissions: ['content.*.read', 'analysis.*.read'] },
  ]);

  // 예시 데이터: 특정 사용자 추가 권한 (역할 외)
  const [userPermissions, setUserPermissions] = useState([
    { userId: 'special_user', permission: 'content.approval.approve', grantedBy: 'admin', date: '2024-07-25' },
  ]);

  // TODO: 역할/권한 추가/수정/삭제 기능 구현
  // TODO: 사용자별 권한 부여/회수 기능 구현

  return (
    <div>
      <h1>권한 관리</h1>

      {/* 역할 기반 권한 관리 */}
      <h2>역할별 권한 설정</h2>
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <button>새 역할 추가</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>역할 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>역할명</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>주요 권한 (예시)</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{role.id}</td>
              <td style={{ padding: '8px' }}>{role.name}</td>
              <td style={{ padding: '8px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role.permissions.join(', ')}</td>
              <td style={{ padding: '8px' }}>
                <button style={{ marginRight: '5px' }}>권한 편집</button>
                <button style={{ marginRight: '5px' }}>역할 수정</button>
                <button>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 특정 사용자 권한 관리 */}
      <h2>사용자별 추가 권한</h2>
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <button>사용자 권한 추가</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f8f8f8' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>사용자 ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>권한</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>부여자</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>부여일</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {userPermissions.map((perm, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px' }}>{perm.userId}</td>
              <td style={{ padding: '8px' }}>{perm.permission}</td>
              <td style={{ padding: '8px' }}>{perm.grantedBy}</td>
              <td style={{ padding: '8px' }}>{perm.date}</td>
              <td style={{ padding: '8px' }}>
                <button>권한 회수</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionManagement; 