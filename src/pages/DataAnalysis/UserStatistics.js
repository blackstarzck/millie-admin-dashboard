import React from 'react';
import {
    Typography,
    Row,
    Col,
    Card,
    Table,
    Tag,
    Space,
    Statistic
} from 'antd';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Example using recharts

const { Title, Text } = Typography;

const UserStatistics = () => {
  // 예시 데이터
  const dailySignupData = [
    { date: '07-20', count: 15 }, { date: '07-21', count: 22 }, { date: '07-22', count: 18 },
    { date: '07-23', count: 25 }, { date: '07-24', count: 30 }, { date: '07-25', count: 28 },
    { date: '07-26', count: 35 },
  ];

  const userStatusData = [
    { key: 'active', name: '활성 사용자', value: 1234 },
    { key: 'dormant', name: '휴면 사용자', value: 345 },
    { key: 'withdrawn', name: '탈퇴 사용자', value: 123 },
  ];

  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

  // 사용자 상태 테이블 컬럼 정의
  const userStatusColumns = [
    {
      title: '상태',
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
      title: '사용자 수',
      dataIndex: 'value',
      key: 'value',
      align: 'right',
      render: (value) => value.toLocaleString()
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>사용자 통계 분석</Title>

      <Row gutter={[16, 16]}>
        {/* 일별 신규 가입자 추이 */}
        <Col xs={24} lg={12}>
          <Card title="일별 신규 가입자 추이">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Text type="secondary">(차트 라이브러리 연동 필요)</Text>
            </div>
            {/* Recharts 또는 Ant Design Charts 연동 영역 */}
             {/* 예시: 
             <ResponsiveContainer width="100%" height={300}>
               <LineChart data={dailySignupData}>...
             </ResponsiveContainer> 
             */}
          </Card>
        </Col>

        {/* 사용자 상태 분포 */}
        <Col xs={24} lg={12}>
          <Card title="사용자 상태 분포">
             <Row gutter={16} align="middle">
                <Col xs={24} md={12}>
                    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Text type="secondary">(차트 라이브러리 연동 필요)</Text>
                    </div>
                     {/* Recharts 또는 Ant Design Charts 연동 영역 */}
                     {/* 예시:
                     <ResponsiveContainer width="100%" height={300}>
                       <PieChart>...
                     </ResponsiveContainer>
                     */}
                </Col>
                 <Col xs={24} md={12}>
                     <Table
                         columns={userStatusColumns}
                         dataSource={userStatusData}
                         rowKey="key"
                         pagination={false}
                         size="small"
                      />
                 </Col>
             </Row>
          </Card>
        </Col>

         {/* 추가 통계 예시 (Statistic 컴포넌트 활용) */}
         <Col xs={24} sm={12} md={8}>
             <Card>
                 <Statistic title="총 사용자 수" value={userStatusData.reduce((sum, item) => sum + item.value, 0)} />
             </Card>
         </Col>
         <Col xs={24} sm={12} md={8}>
             <Card>
                 <Statistic title="평균 DAU (최근 7일)" value={1150} />
             </Card>
         </Col>
         <Col xs={24} sm={12} md={8}>
             <Card>
                 <Statistic title="주요 유입 경로" value="검색엔진" />
             </Card>
         </Col>

      </Row>

    </Space>
  );
};

export default UserStatistics; 