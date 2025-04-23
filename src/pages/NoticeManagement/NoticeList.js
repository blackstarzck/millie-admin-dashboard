import React, { useState } from 'react';
import { Table, Button, Input, Space, Typography, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // 날짜 형식을 위해 dayjs 사용

const { Title } = Typography;
const { Search } = Input;

// 예시 데이터 (실제로는 API 호출 등을 통해 데이터를 가져옵니다)
const initialData = [
  { id: 1, title: '서비스 점검 안내 (AntD 적용)', author: '관리자', date: '2024-07-26', views: 150, content: '서비스 안정화를 위한 점검이 예정되어 있습니다.' },
  { id: 2, title: '새로운 기능 업데이트 소식 (AntD 적용)', author: '관리자', date: '2024-07-25', views: 320, content: '사용자 편의성을 위한 새로운 기능이 추가되었습니다.' },
  { id: 3, title: '이용약관 변경 안내 (AntD 적용)', author: '관리자', date: '2024-07-24', views: 50, content: '개인정보 처리방침 관련 이용약관이 변경됩니다.' },
];

const NoticeList = () => {
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = dataSource.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      item.author.toLowerCase().includes(value.toLowerCase()) ||
      item.content.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = (id) => {
    const newData = dataSource.filter(item => item.id !== id);
    setDataSource(newData);
    const newFilteredData = filteredData.filter(item => item.id !== id);
    setFilteredData(newFilteredData);
    // 실제 API 호출 로직 추가
    console.log(`Deleting notice with id: ${id}`);
  };

  // TODO: 새 공지 작성 페이지로 이동하는 로직 구현
  const handleAddNotice = () => {
    console.log('Navigate to Notice Creation Page');
    // 예시: navigate('/notice-management/create');
  };

  // TODO: 공지 수정 페이지로 이동하는 로직 구현
  const handleEditNotice = (id) => {
    console.log(`Navigate to Notice Edit Page for id: ${id}`);
     // 예시: navigate(`/notice-management/edit/${id}`);
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: 80,
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      // 검색 하이라이팅 등 추가 가능
    },
    {
      title: '작성자',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
      width: 120,
    },
    {
      title: '등록일',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      width: 150,
    },
    {
      title: '조회수',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
      width: 100,
    },
    {
      title: '관리',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEditNotice(record.id)}>
            수정
          </Button>
          <Popconfirm
            title="정말로 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="예"
            cancelText="아니오"
          >
            <Button icon={<DeleteOutlined />} danger>
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={2}>공지사항 목록 관리</Title>
      <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="제목, 작성자, 내용 검색"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNotice}>
          새 공지 작성
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }} // 페이지네이션 설정
        bordered // 테이블 테두리 추가
      />
    </Space>
  );
};

export default NoticeList; 