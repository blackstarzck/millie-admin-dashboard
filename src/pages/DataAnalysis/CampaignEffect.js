import React from 'react';
import {
    Typography,
    Row,
    Col,
    Card,
    Table,
    Tag,
    Space,
    Statistic // 필요한 경우 Statistic 사용
} from 'antd';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Example using recharts

const { Title, Text } = Typography;

const CampaignEffect = () => {
  // 예시 데이터
  const campaignData = [
    { key: 'CP001', campaignId: 'CP001', name: '여름 할인 프로모션 (SNS)', cost: 300000, impressions: 50000, clicks: 1200, conversions: 150, revenue: 1500000 },
    { key: 'CP002', campaignId: 'CP002', name: '신규가입 유도 (검색광고)', cost: 500000, impressions: 80000, clicks: 2500, conversions: 200, revenue: 0 }, // 가입만 측정
    { key: 'CP003', campaignId: 'CP003', name: '콘텐츠 구독 캠페인 (이메일)', cost: 100000, impressions: 20000, clicks: 800, conversions: 80, revenue: 400000 },
  ];

  // Recharts 사용 예시
  /*
  const chartData = campaignData.map(c => ({ name: c.name, 비용: c.cost, 수익: c.revenue, 전환수: c.conversions }));
  */

  // AntD Table 컬럼 정의
  const columns = [
    { title: 'ID', dataIndex: 'campaignId', key: 'campaignId', width: 80 },
    { title: '캠페인명', dataIndex: 'name', key: 'name' },
    {
      title: '비용(원)',
      dataIndex: 'cost',
      key: 'cost',
      align: 'right',
      sorter: (a, b) => a.cost - b.cost,
      render: (cost) => cost.toLocaleString()
    },
    {
      title: '노출수',
      dataIndex: 'impressions',
      key: 'impressions',
      align: 'right',
      sorter: (a, b) => a.impressions - b.impressions,
      render: (imp) => imp.toLocaleString()
    },
    {
      title: '클릭수',
      dataIndex: 'clicks',
      key: 'clicks',
      align: 'right',
      sorter: (a, b) => a.clicks - b.clicks,
      render: (clicks) => clicks.toLocaleString()
    },
    {
      title: '전환수',
      dataIndex: 'conversions',
      key: 'conversions',
      align: 'right',
      sorter: (a, b) => a.conversions - b.conversions,
      render: (conv) => conv.toLocaleString()
    },
    {
      title: '수익(원)',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right',
      sorter: (a, b) => a.revenue - b.revenue,
      render: (rev) => rev.toLocaleString()
    },
    {
      title: 'CPA',
      key: 'cpa',
      align: 'right',
      render: (_, record) => {
        const { cost, conversions } = record;
        return conversions > 0 ? (cost / conversions).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 'N/A';
      }
    },
    {
      title: 'ROAS',
      key: 'roas',
      align: 'right',
      render: (_, record) => {
        const { revenue, cost } = record;
        return cost > 0 ? ((revenue / cost) * 100).toFixed(1) + '%' : 'N/A';
      }
    },
  ];


  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>캠페인 효과 분석</Title>

      {/* 캠페인별 주요 지표 비교 차트 */}
       <Card title="캠페인별 주요 지표 비교">
         <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text type="secondary">(차트 라이브러리 연동 필요)</Text>
         </div>
          {/* Recharts 또는 Ant Design Charts 연동 영역 */}
       </Card>

      {/* 캠페인 상세 데이터 테이블 */}
      <Card title="캠페인 상세 데이터">
         <Table
           columns={columns}
           dataSource={campaignData}
           rowKey="key"
           scroll={{ x: 1200 }} // 가로 스크롤 필요시
           pagination={{ pageSize: 10 }}
         />
      </Card>

       {/* 추가 통계 카드 예시 */}
       <Row gutter={[16, 16]}>
           <Col xs={24} sm={12} md={8}>
               <Card>
                   <Statistic title="총 캠페인 비용" value={campaignData.reduce((sum, c) => sum + c.cost, 0)} suffix="원" />
               </Card>
           </Col>
           <Col xs={24} sm={12} md={8}>
               <Card>
                   <Statistic title="총 전환수" value={campaignData.reduce((sum, c) => sum + c.conversions, 0)} />
               </Card>
           </Col>
           <Col xs={24} sm={12} md={8}>
               <Card>
                   <Statistic title="평균 ROAS" value="150.5%" />{/* 예시 값 */}
               </Card>
           </Col>
       </Row>

    </Space>
  );
};

export default CampaignEffect; 