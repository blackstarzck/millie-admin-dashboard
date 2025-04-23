import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import {
    Row,
    Col,
    Card,
    Statistic,
    Button,
    Typography,
    Table,
    Space,
    Tag,
    List,
    Descriptions,
} from 'antd';
import {
    ArrowUpOutlined,
    ArrowDownOutlined,
    BookOutlined,
    UserOutlined,
    HighlightOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    QuestionCircleOutlined,
    PlusOutlined, // Icon for Add buttons
    MessageOutlined, // Icon for Quick Action: 이야기 보내기
    SoundOutlined, // Icon for Quick Action: 공지 올리기
  GiftOutlined, // Icon for Quick Action: 이벤트 시작
    PictureOutlined
} from '@ant-design/icons';

// --- Chart Component (Keep as is) ---
const ChartComponent = ({ chartId, type, data, options }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      chartInstance.current = new Chart(chartRef.current, {
        type: type,
        data: data,
        options: options,
      });
    }
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartId, type, data, options]);

  return <canvas ref={chartRef} id={chartId} style={{ display: 'block', width: '100%', height: '100%' }} />;
};


// --- Main Dashboard Component (Reorganized with AntD) ---

const Dashboard = () => {

  // --- Dummy Data (Slightly adjusted for AntD components) ---
  const coreMetrics = {
    todayReaders: { title: '오늘의 독서 인원', value: 12500, change: 1200, changeType: 'increase', link: '/analysis/users', icon: <UserOutlined/> },
    readingTimeAvg: { title: '평균 독서 시간', value: 58, change: 5, changeType: 'increase', suffix: '분', link: '/analysis/reading', icon: <ClockCircleOutlined/> },
    completionRateAvg: { title: '평균 완독률', value: 72, change: 2, changeType: 'increase', suffix: '%', link: '/analysis/content', icon: <CheckCircleOutlined/> },
    sharedHighlights: { title: '공유된 하이라이트', value: 5200, change: 150, changeType: 'increase', suffix: '건', link: '/community/highlights', icon: <HighlightOutlined/> },
    subscriptions: { title: '구독자 수', value: 80500, change: 500, changeType: 'increase', link: '/users/subscribers', icon: <UserOutlined/> },
    unansweredInquiries: { title: '미답변 문의', value: 45, change: 5, changeType: 'increase', suffix: '건', link: '/inquiries/list', icon: <QuestionCircleOutlined/> },
  };

  // Quick Actions
  const quickActions = [
    { label: "새 책 추가", icon: <BookOutlined />, link: "/content/add-book" },
    { label: "이야기 보내기", icon: <MessageOutlined />, link: "/notifications/send" },
    { label: "팝업 열기", icon: <PictureOutlined />, link: "/popups/create" }, // Assuming PictureOutlined exists or import it
    { label: "공지 올리기", icon: <SoundOutlined />, link: "/notices/create" },
    { label: "이벤트 시작", icon: <GiftOutlined />, link: "/events/create" },
    { label: "문의 답변하기", icon: <QuestionCircleOutlined />, link: "/inquiries/respond" },
  ];

  // Viewer & Reading Insights Data (Keep chart data as is)
  const readingTimeData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    datasets: [{ label: '주간 평균 독서 시간(분)', data: [55, 56, 58, 57, 62, 65, 58], borderColor: '#1890ff', backgroundColor: 'rgba(24, 144, 255, 0.1)', fill: true, tension: 0.3, }]
  };
  const emotionTagData = {
    labels: ['힐링', '성장', '스릴', '로맨스', '지식'],
    datasets: [{ label: '인기 감성 태그', data: [38, 25, 15, 12, 10], backgroundColor: ['#1890ff', '#52c41a', '#ffadd2', '#faad14', '#bfbfbf'], borderWidth: 0, }]
  };

  // Data for AntD Table
  const bookCompletionData = [
      { key: '1', rank: 1, title: '달러구트 꿈 백화점', rate: '92%' },
      { key: '2', rank: 2, title: '시간을 파는 상점', rate: '85%' },
      { key: '3', rank: 3, title: '팩트풀니스', rate: '81%' },
      { key: '4', rank: 4, title: '어린이라는 세계', rate: '78%' },
      { key: '5', rank: 5, title: '불편한 편의점', rate: '75%' },
  ];
  const bookCompletionColumns = [
    { title: '순위', dataIndex: 'rank', key: 'rank' },
    { title: '도서명', dataIndex: 'title', key: 'title' },
    { title: '완독률', dataIndex: 'rate', key: 'rate', align: 'right', render: (rate) => <strong>{rate}</strong> },
  ];

  // Marketing & Community Data (Keep chart data as is)
  const notificationOpenRateData = {
      labels: ['푸시알림', '카카오톡', '이메일'],
      datasets: [{ label: '채널별 알림 오픈율 (%)', data: [78, 88, 62], backgroundColor: ['rgba(24, 144, 255, 0.7)', 'rgba(255, 173, 210, 0.7)', 'rgba(191, 191, 191, 0.7)'], borderRadius: 4, }]
  };

   const recentCampaigns = [
    { key: 'camp1', type: '신간 알림', target: '로맨스 선호', result: '오픈율 15%, 독서 전환 8%', date: '오늘 10:00' },
    { key: 'camp2', type: '이벤트 팝업', target: '전체 사용자', result: '클릭률 12%, 참여 전환 5%', date: '어제 09:30' },
    { key: 'camp3', type: '맞춤 추천', target: '자기계발 관심', result: '오픈율 25%, 독서 전환 15%', date: '3일 전' },
  ];

  const communityHighlights = {
      postsToday: 380,
      popularHashtag: '#밀리독서루틴',
      commentsToday: '2.1k'
  };

  const ongoingEvents = [
      { key: 'event1', title: '나만의 책장 꾸미기', endDate: '8/31' },
      { key: 'event2', title: '여름밤 독서 챌린지', endDate: '8/15' },
  ];
  const recentNotices = [
      { key: 'notice1', title: '개인정보처리방침 개정 안내', date: '7/25' },
      { key: 'notice2', title: '8월 정기 시스템 점검', date: '8/1 예정' },
  ];

  // Inquiry & System Data (Keep chart data as is)
  const inquiryTypeData = {
      labels: ['결제', '콘텐츠', '기술', '계정', '기타'],
      datasets: [{ label: '문의 유형 분포', data: [35, 30, 18, 12, 5], backgroundColor: ['#1890ff', '#ffadd2', '#722ed1', '#fa8c16', '#bfbfbf'], borderWidth: 0, }]
  };

  const systemStatus = {
      serverStatus: '정상',
      securityAlerts: 0,
  };

  // Chart options (Keep as is)
  const commonChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } };
  const doughnutChartOptions = { ...commonChartOptions, cutout: '60%', plugins: { legend: { position: 'bottom' } } };
  const barChartOptions = { ...commonChartOptions, indexAxis: 'y', plugins: { legend: { display: false } } };


  // --- Render with AntD Components ---
  const { Title, Text, Link: AntLink } = Typography; // Using AntLink to avoid confusion

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>

      {/* Header */}
      <Title level={2} style={{ margin: 0 }}>밀리의 서재 대시보드</Title>
      <Text type="secondary">관리자님, 사용자들의 독서 여정을 함께 만들어가요.</Text>

      {/* 1. 핵심 지표 */}
      <section>
        <Title level={4} style={{ marginBottom: 16 }}>핵심 지표</Title>
        <Row gutter={[16, 16]}>
          {Object.entries(coreMetrics).map(([key, metric]) => (
            <Col key={key} xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card hoverable onClick={() => metric.link && console.log(`Navigating to ${metric.link}`)}>
                <Statistic
                  title={metric.title}
                  value={metric.value}
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={metric.icon}
                  suffix={metric.suffix}
                />
                {metric.change && (
                   <div style={{ marginTop: 8, fontSize: '0.85em', color: 'rgba(0, 0, 0, 0.45)' }}>
                     <Text type={metric.changeType === 'increase' ? 'success' : 'danger'}>
                       {metric.changeType === 'increase' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                       {` ${metric.change}${metric.suffix || ''} `}
                     </Text>
                     <Text type="secondary"> (최근)</Text>
                   </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* 2. 빠른 액션 */}
      <section>
        <Title level={4} style={{ marginBottom: 16 }}>지금 시작하기</Title>
         <Card>
             <Row gutter={[16, 16]} justify="center">
               {quickActions.map((action) => (
                 <Col key={action.label} xs={12} sm={8} md={6} lg={4}>
                   <Button
                     type="primary" // Use primary button style
                     icon={action.icon}
                     size="large"
                     block // Make button fill column width
                     style={{ height: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                     onClick={() => console.log(`Navigating to ${action.link}...`)}
                   >
                     {action.label}
                   </Button>
                 </Col>
               ))}
             </Row>
         </Card>
      </section>

      {/* 3. 뷰어 & 독서 인사이트 */}
      <section>
        <Title level={4} style={{ marginBottom: 16 }}>뷰어 & 독서 인사이트</Title>
        <Row gutter={[16, 16]}>
           <Col xs={24} md={12} lg={8}>
               <Card title="주간 독서 시간 추세">
                   <div style={{ height: '300px', position: 'relative' }}>
                     <ChartComponent chartId="readingTimeChart" type="line" data={readingTimeData} options={commonChartOptions} />
                   </div>
               </Card>
           </Col>
           <Col xs={24} md={12} lg={8}>
               <Card title="인기 감성 태그">
                   <div style={{ height: '300px', position: 'relative' }}>
                     <ChartComponent chartId="emotionTagChart" type="doughnut" data={emotionTagData} options={doughnutChartOptions} />
                   </div>
               </Card>
           </Col>
           <Col xs={24} md={24} lg={8}> {/* Full width on medium, 1/3 on large */} 
               <Card title="도서 완독률 Top 5" bodyStyle={{ padding: '0 16px 16px' }}>
                   <Table
                     columns={bookCompletionColumns}
                     dataSource={bookCompletionData}
                     pagination={false} // Disable pagination for short list
                     size="small"
                     style={{ marginTop: 8 }}
                     // scroll={{ y: 240 }} // Optional: if list can get long
                   />
                   {/* Optional Link: <AntLink href="/analysis/content/completion" style={{ float: 'right' }}>더보기</AntLink> */}
               </Card>
           </Col>
        </Row>
      </section>

       {/* 4. 마케팅 & 커뮤니티 */}
       <section>
         <Title level={4} style={{ marginBottom: 16 }}>마케팅 & 커뮤니티</Title>
         <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
                 <Card title="채널별 알림 오픈율">
                     <div style={{ height: '250px', position: 'relative' }}>
                      <ChartComponent chartId="notificationOpenRateChart" type="bar" data={notificationOpenRateData} options={barChartOptions} />
                    </div>
                 </Card>
            </Col>
            <Col xs={24} lg={8}>
                 <Card title="최근 캠페인 하이라이트">
                    <List
                       itemLayout="horizontal"
                       dataSource={recentCampaigns}
                       renderItem={item => (
                         <List.Item>
                           <List.Item.Meta
                             title={<Text strong><Tag color="blue">{item.type}</Tag> {item.date}</Text>}
                             description={`타겟: ${item.target} | 결과: ${item.result}`}
                           />
                         </List.Item>
                       )}
                       style={{ maxHeight: 250, overflowY: 'auto' }} // Limit height and scroll
                    />
                 </Card>
            </Col>
             <Col xs={24} lg={8}>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                     <Card title="커뮤니티 현황">
                         <Descriptions size="small" column={1}>
                           <Descriptions.Item label="오늘 포스트">{communityHighlights.postsToday}개</Descriptions.Item>
                           <Descriptions.Item label="오늘 댓글">{communityHighlights.commentsToday}</Descriptions.Item>
                           <Descriptions.Item label="인기 해시태그"><Tag color="processing">{communityHighlights.popularHashtag}</Tag></Descriptions.Item>
                         </Descriptions>
                     </Card>
                     <Row gutter={16}>
                         <Col span={12}>
                              <Card size="small" title="진행중 이벤트">
                                 <List
                                    dataSource={ongoingEvents}
                                    renderItem={item => <List.Item style={{padding: '4px 0'}}><Text style={{fontSize: '0.85em'}}>{item.title} (~{item.endDate})</Text></List.Item>}
                                    size="small"
                                />
                              </Card>
                         </Col>
                          <Col span={12}>
                              <Card size="small" title="최신 공지">
                                  <List
                                      dataSource={recentNotices}
                                      renderItem={item => <List.Item style={{padding: '4px 0'}}><Text style={{fontSize: '0.85em'}}>{item.title} ({item.date})</Text></List.Item>}
                                      size="small"
                                  />
                              </Card>
                          </Col>
                     </Row>
                </Space>
             </Col>
         </Row>
       </section>

      {/* 5. 문의 & 시스템 상태 */}
       <section>
         <Title level={4} style={{ marginBottom: 16 }}>문의 & 시스템 상태</Title>
         <Row gutter={[16, 16]}>
           <Col xs={24} md={12}>
               <Card title="문의 현황">
                 <Row align="middle" gutter={16}>
                   <Col flex="auto">
                     <Statistic
                       title="미답변 문의"
                       value={coreMetrics.unansweredInquiries.value}
                       valueStyle={{ color: '#cf1322' }} // Red for danger
                       prefix={<QuestionCircleOutlined />}
                       suffix={<span>건 <Text type="danger" style={{ fontSize: '0.8em' }}>(+{coreMetrics.unansweredInquiries.change})</Text></span>}
                     />
                   </Col>
                   <Col flex="250px"> {/* Chart takes fixed space */}
                     <div style={{ height: '150px', position: 'relative' }}>
                       <ChartComponent chartId="inquiryTypeChart" type="doughnut" data={inquiryTypeData} options={{...doughnutChartOptions, plugins: { legend: { display: false }}}} />
                     </div>
                   </Col>
                 </Row>
               </Card>
           </Col>
           <Col xs={24} md={12}>
               <Card title="시스템 상태" style={{ height: '100%' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '150px' }}>
                        <Tag color={systemStatus.serverStatus === '정상' ? 'success' : 'error'} style={{ padding: '8px 16px', fontSize: '1rem', marginBottom: 16 }}>
                           {systemStatus.serverStatus}
                       </Tag>
                       <Text type="secondary">보안 경고: {systemStatus.securityAlerts} 건</Text>
                   </div>
               </Card>
           </Col>
         </Row>
       </section>

    </Space> // End of main Space component
  );
};

export default Dashboard; 