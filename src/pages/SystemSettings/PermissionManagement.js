import React, { useState } from 'react';
import {
    Typography,
    Table,
    Button,
    Space,
    Tag,
    Card,
    Popconfirm
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const PermissionManagement = () => {
  // 예시 데이터: 역할 기반 권한
  const [roles, setRoles] = useState([
    { key: 'admin', id: 'admin', name: '관리자', permissions: ['*.*.*.*.*.*'] }, // 예: CRUD 모든 리소스
    { key: 'editor', id: 'editor', name: '편집자', permissions: ['content.books.create', 'content.books.update', 'content.categories.create', 'content.categories.update'] },
    { key: 'viewer', id: 'viewer', name: '뷰어', permissions: ['content.*.read', 'analysis.*.read'] },
  ]);

  // 예시 데이터: 특정 사용자 추가 권한 (역할 외)
  const [userPermissions, setUserPermissions] = useState([
    { key: 'perm1', userId: 'special_user', permission: 'content.approval.approve', grantedBy: 'admin', date: '2024-07-25' },
  ]);

  // --- 핸들러 함수 (추가/수정/삭제 로직은 콘솔 로그로 대체) ---
  const handleAddRole = () => {
    console.log("새 역할 추가 기능 구현 필요");
    // TODO: 모달 등을 이용한 역할 추가 로직
  };

  const handleEditPermissions = (roleId) => {
    console.log(`역할 [${roleId}] 권한 편집 기능 구현 필요`);
    // TODO: 모달 등을 이용한 권한 편집 로직
  };

  const handleEditRole = (roleId) => {
    console.log(`역할 [${roleId}] 수정 기능 구현 필요`);
    // TODO: 모달 등을 이용한 역할 수정 로직
  };

  const handleDeleteRole = (roleId) => {
    console.log(`역할 [${roleId}] 삭제 기능 구현 필요`);
    setRoles(roles.filter(role => role.id !== roleId)); // UI에서만 제거 (임시)
  };

  const handleAddUserPermission = () => {
    console.log("사용자 권한 추가 기능 구현 필요");
    // TODO: 모달 등을 이용한 사용자 권한 추가 로직
  };

  const handleRevokeUserPermission = (key) => {
    console.log(`사용자 권한 [${key}] 회수 기능 구현 필요`);
    setUserPermissions(userPermissions.filter(perm => perm.key !== key)); // UI에서만 제거 (임시)
  };

  // --- 테이블 컬럼 정의 ---
  const roleColumns = [
    { title: '역할 ID', dataIndex: 'id', key: 'id', width: 150 },
    { title: '역할명', dataIndex: 'name', key: 'name' },
    {
      title: '주요 권한 (예시)',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions) => (
         <>
           {permissions.slice(0, 3).map(p => <Tag key={p}>{p}</Tag>)}
           {permissions.length > 3 && '...'}
         </>
      )
    },
    {
      title: '관리',
      key: 'action',
      width: 250,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditPermissions(record.id)}>권한 편집</Button>
          {/* <Button size="small" onClick={() => handleEditRole(record.id)}>역할 수정</Button> */}
          <Popconfirm title="정말로 이 역할을 삭제하시겠습니까?" onConfirm={() => handleDeleteRole(record.id)} okText="예" cancelText="아니오">
            <Button size="small" danger icon={<DeleteOutlined />}>삭제</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const userPermissionColumns = [
    { title: '사용자 ID', dataIndex: 'userId', key: 'userId' },
    { title: '권한', dataIndex: 'permission', key: 'permission', render: perm => <Tag>{perm}</Tag> },
    { title: '부여자', dataIndex: 'grantedBy', key: 'grantedBy' },
    { title: '부여일', dataIndex: 'date', key: 'date' },
    {
      title: '관리',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
         <Popconfirm title="정말로 이 권한을 회수하시겠습니까?" onConfirm={() => handleRevokeUserPermission(record.key)} okText="예" cancelText="아니오">
            <Button size="small" danger>권한 회수</Button>
         </Popconfirm>
      ),
    },
  ];


  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>권한 관리</Title>

      {/* 역할 기반 권한 관리 */}
      <Card title="역할별 권한 설정">
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
           <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRole}>새 역할 추가</Button>
        </div>
        <Table
          columns={roleColumns}
          dataSource={roles}
          rowKey="key"
          pagination={false}
        />
      </Card>

      {/* 특정 사용자 권한 관리 */}
      <Card title="사용자별 추가 권한">
         <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUserPermission}>사용자 권한 추가</Button>
         </div>
         <Table
           columns={userPermissionColumns}
           dataSource={userPermissions}
           rowKey="key"
           pagination={{ pageSize: 10 }}
         />
      </Card>

    </Space>
  );
};

export default PermissionManagement; 