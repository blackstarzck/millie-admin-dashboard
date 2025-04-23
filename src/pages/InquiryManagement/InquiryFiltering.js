import React, { useState } from 'react';
import {
    Typography,
    Table,
    Button,
    Space,
    Switch,
    Popconfirm,
    Card,
    message
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const InquiryFiltering = () => {
  // 예시 필터링 규칙 데이터
  const [filters, setFilters] = useState([
    { key: 'filter01', id: 'filter01', name: '결제 오류 문의 자동 분류', condition: 'title contains \'결제 오류\'', action: 'Assign to Payment Team', isActive: true },
    { key: 'filter02', id: 'filter02', name: '긴급 키워드 포함 시 우선순위 높음', condition: 'content contains \'긴급\' or content contains \'장애\'', action: 'Set Priority High', isActive: true },
    { key: 'filter03', id: 'filter03', name: '스팸 메일 필터링', condition: 'sender email matches regex /.*@spamdomain\.com/', action: 'Mark as Spam', isActive: false },
  ]);

  // --- 핸들러 함수 (추가/수정/삭제 로직은 콘솔 로그로 대체) ---
  const handleAddFilter = () => {
      console.log("새 필터 규칙 추가 기능 구현 필요");
      // TODO: 모달 등을 이용한 규칙 추가 폼
  };

  const handleEditFilter = (filterId) => {
      console.log(`필터 규칙 [${filterId}] 수정 기능 구현 필요`);
       // TODO: 모달 등을 이용한 규칙 수정 폼
  };

  const handleToggleActive = (filterId, checked) => {
      console.log(`Toggling filter ${filterId} to ${checked}`);
      setFilters(filters.map(f => f.id === filterId ? { ...f, isActive: checked } : f));
      // TODO: 실제 백엔드 상태 변경 로직 호출
      message.success(`필터 규칙 상태가 ${checked ? '활성' : '비활성'}(으)로 변경되었습니다.`);
  };

  const handleDeleteFilter = (filterId) => {
      console.log(`Deleting filter ${filterId}`);
      setFilters(filters.filter(f => f.id !== filterId));
      // TODO: 실제 백엔드 삭제 로직 호출
      message.success('필터 규칙이 삭제되었습니다.');
  };

  // --- 테이블 컬럼 정의 ---
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '규칙명', dataIndex: 'name', key: 'name' },
    { title: '조건', dataIndex: 'condition', key: 'condition' },
    { title: '액션', dataIndex: 'action', key: 'action' },
    {
        title: '활성 상태',
        dataIndex: 'isActive',
        key: 'isActive',
        width: 120,
        align: 'center',
        render: (isActive, record) => (
            <Switch
                checked={isActive}
                onChange={(checked) => handleToggleActive(record.id, checked)}
            />
        )
    },
    {
      title: '관리',
      key: 'actionButtons',
      width: 180,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEditFilter(record.id)}>수정</Button>
          <Popconfirm
              title="정말로 이 필터 규칙을 삭제하시겠습니까?"
              onConfirm={() => handleDeleteFilter(record.id)}
              okText="삭제"
              cancelText="취소"
           >
            <Button size="small" danger icon={<DeleteOutlined />}>삭제</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>문의사항 필터링/분류 규칙</Title>
      <Paragraph>접수되는 문의사항을 자동으로 분류하거나 특정 조건을 만족할 때 액션을 수행하는 규칙을 설정합니다.</Paragraph>

      <Card>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
             <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFilter}>새 필터 규칙 추가</Button>
          </div>
          <Table
            columns={columns}
            dataSource={filters}
            rowKey="key"
            pagination={{ pageSize: 10 }}
            rowClassName={(record) => !record.isActive ? 'disabled-row' : ''} // 비활성 행 스타일링 예시
           />
      </Card>

       {/* 비활성 행 스타일 (선택사항 - ApiManagement.js 와 동일) */}
       <style>{`
         .disabled-row td {
           color: rgba(0, 0, 0, 0.25);
         }
         .disabled-row .ant-tag {
            background-color: #f5f5f5;
            border-color: #d9d9d9;
            color: rgba(0, 0, 0, 0.25);
         }
       `}</style>

    </Space>
  );
};

export default InquiryFiltering; 