import React from 'react';
import {
    Typography,
    Row,
    Col,
    Card,
    Table,
    Tag,
    Space,
    Statistic // Statistic 추가
} from 'antd';
// import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Example using recharts

const { Title, Text } = Typography;

const ContentStatistics = () => {
  // 예시 데이터
  const topContentViews = [
    { key: 'book001', contentId: 'book001', title: 'React 마스터하기', views: 15200, likes: 350 },
    { key: 'book005', contentId: 'book005', title: '실용 데이터 분석', views: 12800, likes: 420 },
    { key: 'course002', contentId: 'course002', title: 'Node.js 백엔드 개발', views: 11500, likes: 280 },
    { key: 'book003', contentId: 'book003', title: 'UI/UX 디자인 원칙', views: 9800, likes: 150 },
  ];

  const categoryDistribution = [
    { key: 'it', name: 'IT/기술', value: 450 },
    { key: 'literature', name: '문학', value: 250 },
    { key: 'self-dev', name: '자기계발', value: 300 },
    { key: 'etc', name: '기타', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // 인기 콘텐츠 테이블 컬럼 정의
  const topContentColumns = [
    { title: '콘텐츠 ID', dataIndex: 'contentId', key: 'contentId' },
    { title: '제목', dataIndex: 'title', key: 'title' },
    {
      title: '조회수',
      dataIndex: 'views',
      key: 'views',
      align: 'right',
      sorter: (a, b) => a.views - b.views,
      render: (views) => views.toLocaleString()
    },
    {
      title: '좋아요 수',
      dataIndex: 'likes',
      key: 'likes',
      align: 'right',
      sorter: (a, b) => a.likes - b.likes,
      render: (likes) => likes.toLocaleString()
    },
  ];

  // 카테고리 분포 테이블 컬럼 정의
   const categoryColumns = [
     {
       title: '카테고리',
       dataIndex: 'name',
       key: 'name',
       render: (name, record, index) => (
         <Space>
           <Tag color={COLORS[index % COLORS.length]} style={{ marginRight: 0 }}> </Tag>
           {name}
         </Space>
       )
     },
     {
       title: '콘텐츠 수',
       dataIndex: 'value',
       key: 'value',
       align: 'right',
       render: (value) => value.toLocaleString()
     },
   ];


  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>콘텐츠 통계 분석</Title>

      {/* 인기 콘텐츠 (조회수 기준) */}
      <Card title="인기 콘텐츠 (조회수 기준)">
         <Table
           columns={topContentColumns}
           dataSource={topContentViews}
           rowKey="key"
           pagination={{ pageSize: 5 }} // 페이지 사이즈 조절
         />
      </Card>

      {/* 카테고리별 콘텐츠 분포 */}
      <Card title="카테고리별 콘텐츠 분포">
        <Row gutter={[16, 16]} align="middle">
           <Col xs={24} md={12}>
             <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">(차트 라이브러리 연동 필요)</Text>
             </div>
              {/* Recharts 또는 Ant Design Charts 연동 영역 */}
           </Col>
           <Col xs={24} md={12}>
              <Table
                  columns={categoryColumns}
                  dataSource={categoryDistribution}
                  rowKey="key"
                  pagination={false}
                  size="small"
               />
           </Col>
        </Row>
      </Card>

      {/* 추가 통계 예시 */}
      <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
              <Card>
                  <Statistic title="총 등록 콘텐츠 수" value={categoryDistribution.reduce((sum, item) => sum + item.value, 0)} />
              </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
              <Card>
                  <Statistic title="평균 완독률" value={75} suffix="%" />
              </Card>
          </Col>
           <Col xs={24} sm={12} md={8}>
              <Card>
                  <Statistic title="인기 검색 키워드" value="#React" />
              </Card>
           </Col>
      </Row>

    </Space>
  );
};

export default ContentStatistics; 