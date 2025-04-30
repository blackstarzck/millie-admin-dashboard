import React, { useState } from 'react';
import { Typography, Table, Input, Button, Space, Modal, Descriptions, Tag, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { Search } = Input;

// 예시 도서 데이터 (각 작가에 연결)
const exampleBooks = {
  author001: [
    { key: 'book001', title: '곰의 첫 겨울', category: '동화', publicationDate: '2024-01-10', status: '승인완료', contentType: '종이책' },
    { key: 'book002', title: '숲 속 친구들', category: '동화', publicationDate: '2024-03-22', status: '승인완료', contentType: '전자책' },
    { key: 'book003', title: '배고픈 곰', category: '그림책', publicationDate: '', status: '승인대기', contentType: '종이책' },
  ],
  author002: [
    { key: 'book004', title: '나무의 노래', category: '시', publicationDate: '2024-06-15', status: '승인완료', contentType: '전자책' },
  ],
  author003: [
    { key: 'book005', title: '별 헤는 밤', category: '판타지', publicationDate: '2023-11-01', status: '승인완료', contentType: '종이책' },
    { key: 'book006', title: '구름 위 산책', category: '판타지', publicationDate: '', status: '반려', contentType: '전자책' },
    { key: 'book007', title: '시간 여행자의 일기', category: 'SF', publicationDate: '2024-04-01', status: '승인완료', contentType: '종이책' },
    { key: 'book008', title: '꿈꾸는 로봇', category: 'SF', publicationDate: '2024-05-12', status: '승인완료', contentType: '전자책' },
    { key: 'book009', title: '마법의 지도', category: '판타지', publicationDate: '', status: '승인대기', contentType: '종이책' },
    { key: 'book010', title: '사라진 도시', category: '미스터리', publicationDate: '', status: '승인대기', contentType: '전자책' },
    { key: 'book011', title: '미래 탐험', category: 'SF', publicationDate: '2024-08-15', status: '승인완료', contentType: '종이책' },
  ],
};


const AuthorInfoManagement = () => {
  // 예시 작가 데이터 (추후 API 연동)
  const authors = [
    { key: 'author001', userId: 'user001', authorName: '글쓰는곰', bookCount: 3, registrationDate: '2024-06-15', lastLoginDate: '2024-07-30 14:20:11', status: '활동중', email: 'bear@example.com', introduction: '안녕하세요, 글쓰는 곰입니다. 재미있는 이야기를 만들어요.', books: exampleBooks['author001'] || [] },
    { key: 'author002', userId: 'user008', authorName: '책짓는나무', bookCount: 1, registrationDate: '2024-07-01', lastLoginDate: '2024-07-29 09:05:30', status: '활동중', email: 'tree@example.com', introduction: '자연과 함께하는 따뜻한 글을 씁니다.', books: exampleBooks['author002'] || [] },
    { key: 'author003', userId: 'user015', authorName: '상상여행자', bookCount: 7, registrationDate: '2024-05-20', lastLoginDate: '2024-06-10 11:00:00', status: '휴면', email: 'traveler@example.com', introduction: '상상 속 세계를 탐험하는 여행자.', books: exampleBooks['author003'] || [] },
    { key: 'author004', userId: 'user022', authorName: '준비중인작가', bookCount: 0, registrationDate: '2024-08-01', lastLoginDate: null, status: '활동중', email: 'ready@example.com', introduction: '첫 작품을 준비하고 있습니다.', books: [] },
  ];
// 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);

  const showModal = (author) => {
    setSelectedAuthor(author);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedAuthor(null);
  };

  // 작가 정보 테이블 컬럼 정의
  const authorColumns = [
    { title: '작가 ID', dataIndex: 'key', key: 'key' },
    { title: '회원 ID', dataIndex: 'userId', key: 'userId' },
    { title: '작가명', dataIndex: 'authorName', key: 'authorName' },
    { title: '출판 도서 수', dataIndex: 'bookCount', key: 'bookCount', sorter: (a, b) => a.bookCount - b.bookCount },
    { title: '등록일', dataIndex: 'registrationDate', key: 'registrationDate', sorter: (a, b) => new Date(a.registrationDate) - new Date(b.registrationDate) },
    {
      title: '마지막 접속일',
      dataIndex: 'lastLoginDate',
      key: 'lastLoginDate',
      render: (date) => date ? moment(date).format('YYYY-MM-DD HH:mm') : '-',
      sorter: (a, b) => {
        const dateA = a.lastLoginDate ? moment(a.lastLoginDate).unix() : 0;
        const dateB = b.lastLoginDate ? moment(b.lastLoginDate).unix() : 0;
        return dateA - dateB;
      },
    },
    {
      title: (
        <Space size={4}>
          <span>상태</span>
          <Tooltip title="휴면 상태는 작가가 60일 이상 활동하지 않았을때를 의미합니다">
            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)' }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag>{status}</Tag>
    },
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>상세</Button>
          {/* 필요한 액션 버튼 추가 (예: 상태 변경) */}
        </Space>
      ),
    },
  ];

  // 모달 내 도서 목록 테이블 컬럼 정의
  const bookColumns = [
    { title: '도서명', dataIndex: 'title', key: 'title' },
    { title: '카테고리', dataIndex: 'category', key: 'category' },
    { title: '콘텐츠 타입', dataIndex: 'contentType', key: 'contentType' },
    { title: '출판일', dataIndex: 'publicationDate', key: 'publicationDate' },
    {
      title: '상태', dataIndex: 'status', key: 'status',
      render: (status) => {
        let color;
        if (status === '승인완료') color = 'success';
        else if (status === '반려') color = 'error';
        else color = 'processing'; // 승인대기
        return <Tag color={color}>{status}</Tag>;
      }
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={2}>작가 정보 관리</Title>
      <style>
        {`
          .book-list-table .ant-table-thead > tr > th {
            font-weight: normal; /* 헤더 폰트 굵기 보통으로 */
            background: #fafafa; /* Descriptions 헤더와 유사한 배경색 */
          }
          .book-list-table .ant-table-tbody > tr > td {
             /* 기본 폰트 크기 및 색상 상속 (AntD 기본값 사용) */
          }
          .book-list-title {
            font-size: 14px; /* Descriptions 제목과 유사한 크기 */
            font-weight: 600; /* 약간 굵게 */
            color: rgba(0, 0, 0, 0.88); /* AntD v5 기본 텍스트 색상 */
          }
        `}
      </style>
      <Space>
        <Search placeholder="회원 ID 또는 작가명 검색" style={{ width: 300 }} />
        {/* 추가 필터링 옵션 (예: 상태) */}
      </Space>
      <Table columns={authorColumns} dataSource={authors} rowKey="key" />

      {selectedAuthor && (
        <Modal
          title="작가 상세 정보"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="close" onClick={handleCancel}>
              닫기
            </Button>,
          ]}
          width={800} // 모달 너비 조정
        >
          <Descriptions bordered column={1} size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="작가 ID">{selectedAuthor.key}</Descriptions.Item>
            <Descriptions.Item label="회원 ID">{selectedAuthor.userId}</Descriptions.Item>
            <Descriptions.Item label="작가명">{selectedAuthor.authorName}</Descriptions.Item>
            <Descriptions.Item label="이메일">{selectedAuthor.email}</Descriptions.Item>
            {/* <Descriptions.Item label="출판 도서 수">{selectedAuthor.bookCount}</Descriptions.Item> */}
            <Descriptions.Item label="등록일">{selectedAuthor.registrationDate}</Descriptions.Item>
            <Descriptions.Item label="마지막 접속일">{selectedAuthor.lastLoginDate ? moment(selectedAuthor.lastLoginDate).format('YYYY-MM-DD HH:mm:ss') : '-'}</Descriptions.Item>
            <Descriptions.Item label="상태"><Tag>{selectedAuthor.status}</Tag></Descriptions.Item>
            <Descriptions.Item label="소개">{selectedAuthor.introduction}</Descriptions.Item>
          </Descriptions>

          <Title level={4} className="book-list-title" style={{ marginTop: 0, marginBottom: 16 }}>출판 도서 목록 ({selectedAuthor.bookCount}권)</Title>
          <Table
            className="book-list-table"
            columns={bookColumns}
            dataSource={selectedAuthor.books}
            rowKey="key"
            pagination={{ pageSize: 5 }} // 페이지네이션 추가 및 페이지 크기 설정
            size="small"
          />
        </Modal>
      )}
    </Space>
  );
};

export default AuthorInfoManagement; 