import React, { useState } from 'react';
import {
  Table, 
  Input, 
  Select, 
  Button, 
  Space, 
  Typography, 
  Tag 
} from 'antd';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const InquiryLookup = () => {
  // 예시 데이터 (AntD Table의 dataSource로 사용)
  const inquiries = [
    { key: 'inq001', id: 'inq001', category: '결제', title: '결제가 제대로 안됩니다.', user: 'user001', date: '2024-07-26', status: '답변대기' },
    { key: 'inq002', id: 'inq002', category: '계정', title: '비밀번호를 잊어버렸어요.', user: 'user008', date: '2024-07-25', status: '답변완료' },
    { key: 'inq003', id: 'inq003', category: '콘텐츠', title: '오류가 있는 것 같습니다.', user: 'user015', date: '2024-07-25', status: '답변대기' },
    // ... 더 많은 문의 데이터
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = (
      inq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.user.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'pending' && inq.status === '답변대기') || 
                          (filterStatus === 'completed' && inq.status === '답변완료');
    return matchesSearch && matchesStatus;
  });

  // AntD Table 컬럼 정의
  const columns = [
    { title: '문의 ID', dataIndex: 'id', key: 'id' },
    { title: '카테고리', dataIndex: 'category', key: 'category' },
    { title: '제목', dataIndex: 'title', key: 'title' },
    { title: '문의자', dataIndex: 'user', key: 'user' },
    { title: '문의일', dataIndex: 'date', key: 'date' },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === '답변대기' ? 'warning' : 'success'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: '답변 대기', value: '답변대기' },
        { text: '답변 완료', value: '답변완료' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => console.log('상세/답변 처리:', record.id)}>
          상세/답변
        </Button>
      ),
    },
  ];


  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>문의사항 조회</Title>

      {/* 검색 및 필터링 */}
      <Space wrap>
        <Search
          placeholder="제목 또는 사용자 ID 검색..."
          allowClear
          onSearch={setSearchTerm}
          onChange={(e) => !e.target.value && setSearchTerm('')} // Clear 버튼 클릭 시 검색어 초기화
          style={{ width: 300 }}
        />
        <Select 
          defaultValue="all" 
          style={{ width: 150 }} 
          onChange={setFilterStatus}
        >
          <Option value="all">전체 상태</Option>
          <Option value="pending">답변 대기</Option>
          <Option value="completed">답변 완료</Option>
        </Select>
        {/* 추가 필터 (예: 카테고리) */} 
        {/* <Select placeholder="카테고리 선택" style={{ width: 150 }} allowClear> ... </Select> */}
      </Space>

      {/* 문의 목록 테이블 */}
      <Table 
        columns={columns} 
        dataSource={filteredInquiries} 
        rowKey="key" // 각 행의 고유 key 설정
        pagination={{ pageSize: 10 }} // 페이지네이션 설정
      />

    </Space>
  );
};

export default InquiryLookup; 