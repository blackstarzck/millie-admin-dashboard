import {
  AreaChartOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  GiftOutlined,
  HighlightOutlined,
  LockOutlined,
  MessageOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  SettingOutlined,
  ShoppingOutlined,
  SoundOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  List,
  Radio,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import Chart from 'chart.js/auto';
import React, { useEffect, useRef, useState } from 'react';

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

  const [visitorChartRange, setVisitorChartRange] = useState('daily');

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
    { label: "팝업 열기", icon: <PictureOutlined />, link: "/popups/create" },
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

  // --- Popular Search Terms Data for Table ---
  const popularSearchTermsData = [
    { key: '1', rank: 1, term: '로맨스 소설', count: 152 },
    { key: '2', rank: 2, term: '베스트셀러', count: 118 },
    { key: '3', rank: 3, term: '자기계발 책 추천', count: 95 },
    { key: '4', rank: 4, term: '판타지 웹소설', count: 77 },
    { key: '5', rank: 5, term: '신간 알림', count: 61 },
  ];

  const popularSearchTermsColumns = [
    { title: '순위', dataIndex: 'rank', key: 'rank' },
    { title: '검색어', dataIndex: 'term', key: 'term' },
    { title: '검색 수', dataIndex: 'count', key: 'count', align: 'right', render: (count) => <strong>{count}</strong> },
  ];

  // --- Dummy Visitor Data ---
  const generateHourlyData = (base) => Array.from({ length: 24 }, (_, i) => Math.max(0, base + Math.floor(Math.random() * 20 - 10 + (i > 6 && i < 22 ? i : 0))));
  const generateDailyData = (base) => Array.from({ length: 7 }, (_, i) => Math.max(0, base + Math.floor(Math.random() * 500 - 250)));
  const generateMonthlyData = (base) => Array.from({ length: 30 }, (_, i) => Math.max(0, base + Math.floor(Math.random() * 500 - 250)));

  const visitorData = {
    daily: {
      labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`),
      datasets: [
        { label: '오늘', data: generateHourlyData(150), borderColor: '#1890ff', tension: 0.1, pointRadius: 0 },
        { label: '어제', data: generateHourlyData(140), borderColor: '#52c41a', tension: 0.1, pointRadius: 0 },
      ]
    },
    weekly: {
      labels: ['7일 전', '6일 전', '5일 전', '4일 전', '3일 전', '어제', '오늘'],
      datasets: [{ label: '주간 접속자', data: generateDailyData(3000), borderColor: '#faad14', tension: 0.1, backgroundColor: 'rgba(250, 173, 20, 0.1)', fill: true }]
    },
    monthly: {
      labels: Array.from({ length: 30 }, (_, i) => `${i + 1}일`), // Simplified label
      datasets: [{ label: '월간 접속자', data: generateMonthlyData(3500), borderColor: '#ff4d4f', tension: 0.1, backgroundColor: 'rgba(255, 77, 79, 0.1)', fill: true }]
    }
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
  const { Title, Text, Link: AntLink } = Typography;

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
                     type="primary"
                     icon={action.icon}
                     size="large"
                     block
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
               <Card title="인기 검색어" bodyStyle={{ padding: '0 16px 16px' }}>
                 <Table
                   columns={popularSearchTermsColumns}
                   dataSource={popularSearchTermsData}
                   pagination={false}
                   size="small"
                   style={{ marginTop: 8 }}
                 />
               </Card>
           </Col>
           <Col xs={24} md={24} lg={8}>
               <Card title="도서 완독률 Top 5" bodyStyle={{ padding: '0 16px 16px' }}>
                   <Table
                     columns={bookCompletionColumns}
                     dataSource={bookCompletionData}
                     pagination={false}
                     size="small"
                     style={{ marginTop: 8 }}
                   />
               </Card>
           </Col>
        </Row>
      </section>

       {/* NEW: 이용자 분석 섹션 추가 (원래 뷰어 & 독서 인사이트 아래에 추가) */}
       <section>
         <Title level={4} style={{ marginBottom: 16 }}>이용자 분석</Title>
         <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
                 <Card title="접속자 수 추이">
                    <Radio.Group
                       onChange={(e) => setVisitorChartRange(e.target.value)}
                       value={visitorChartRange}
                       style={{ marginBottom: 16 }}
                    >
                      <Radio.Button value="daily">일간</Radio.Button>
                      <Radio.Button value="weekly">주간</Radio.Button>
                      <Radio.Button value="monthly">월간</Radio.Button>
                    </Radio.Group>
                    <div style={{ height: '300px', position: 'relative' }}>
                       <ChartComponent
                           chartId="visitorCountChart"
                           type="line"
                           data={visitorData[visitorChartRange]}
                           options={{
                             ...commonChartOptions,
                             scales: {
                               y: {
                                 beginAtZero: true
                               }
                             },
                             interaction: { intersect: false, mode: 'index' }, // 툴팁 향상
                             plugins: {
                               tooltip: {
                                 enabled: true,
                                 mode: 'index',
                                 intersect: false,
                               }
                             }
                           }}
                       />
                    </div>
                 </Card>
            </Col>
            {/* 여기에 추가적인 이용자 분석 카드(예: 재방문율, 이탈률 등) 추가 가능 */}
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
                       style={{ maxHeight: 250, overflowY: 'auto' }}
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
                       valueStyle={{ color: '#cf1322' }}
                       prefix={<QuestionCircleOutlined />}
                       suffix={<span>건 <Text type="danger" style={{ fontSize: '0.8em' }}>(+{coreMetrics.unansweredInquiries.change})</Text></span>}
                     />
                   </Col>
                   <Col flex="250px">
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

       {/* 6. 도서 메타데이터 및 콘텐츠 관리 (Metadata & Content Management) */}
       <section>
         <Title level={3} style={{ marginBottom: 16 }}><DatabaseOutlined /> 도서 메타데이터 및 콘텐츠 관리</Title>
         <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card title="등록 도서 현황">
                <Descriptions layout="vertical" size="small">
                  <Descriptions.Item label="EPUB">15,280</Descriptions.Item>
                  <Descriptions.Item label="PDF">3,150</Descriptions.Item>
                  <Descriptions.Item label="오디오북">1,820</Descriptions.Item>
                </Descriptions>
                 <Button icon={<BookOutlined />} type="link" style={{paddingLeft: 0}}>전체 목록 보기</Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card title="메타데이터 관리 상태">
                 <Descriptions column={1} size="small">
                    <Descriptions.Item label="ISBN 미입력">120건</Descriptions.Item>
                    <Descriptions.Item label="카테고리 오류">55건</Descriptions.Item>
                    <Descriptions.Item label="표지/요약 누락">80건</Descriptions.Item>
                 </Descriptions>
                 <Button icon={<TagsOutlined />} type="link" style={{paddingLeft: 0}}>상세 확인</Button>
              </Card>
            </Col>
             <Col xs={24} sm={12} md={12} lg={6}>
               <Card title="콘텐츠 검수">
                 <Statistic title="미승인/검수 대기" value={35} suffix="건" />
                 <Button icon={<FileTextOutlined />} style={{ marginTop: 16 }}>검수하기</Button>
               </Card>
             </Col>
              <Col xs={24} sm={12} md={12} lg={6}>
                 <Card title="빠른 수정">
                    <Space direction="vertical" align="start">
                       <Button icon={<SettingOutlined />}>메타데이터 일괄 수정</Button>
                       <Button icon={<PictureOutlined />}>표지 이미지 변경</Button>
                    </Space>
                 </Card>
              </Col>
         </Row>
       </section>

       <Divider />

       {/* 7. B2B·B2G 기관용 라이선스 관리 (B2B/B2G License Management) */}
       <section>
         <Title level={3} style={{ marginBottom: 16 }}><ShoppingOutlined /> B2B·B2G 기관용 라이선스 관리</Title>
         <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card title="계약 기관 현황">
                <Statistic title="총 계약 기관 수" value={120} />
                 <Button icon={<TeamOutlined />} style={{ marginTop: 16 }}>기관 목록 보기</Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
               <Card title="라이선스 이용 현황">
                 <Descriptions column={1} size="small">
                     <Descriptions.Item label="동시 접속 허용 초과">5건</Descriptions.Item>
                     <Descriptions.Item label="만료 예정 (7일 이내)">12건</Descriptions.Item>
                 </Descriptions>
                 <Button icon={<UserOutlined />} type="link" style={{paddingLeft: 0}}>이용 현황 상세</Button>
               </Card>
            </Col>
            <Col xs={24} sm={12} md={12} lg={6}>
              <Card title="기관별 리포트">
                 <Text type="secondary">최근 생성: OO대학교 (7/28)</Text><br />
                 <Button icon={<FileTextOutlined />} style={{ marginTop: 8 }}>리포트 생성/조회</Button>
              </Card>
            </Col>
             <Col xs={24} sm={12} md={12} lg={6}>
               <Card title="정산 관리">
                  <Statistic title="이번달 정산 예정" value={25} suffix="기관" />
                 <Button icon={<CreditCardOutlined />} style={{ marginTop: 16 }}>정산 내역 확인</Button>
               </Card>
            </Col>
         </Row>
       </section>

       <Divider />

        {/* 8. DRM 및 보안 이슈 관리 (DRM & Security) */}
       <section>
         <Title level={3} style={{ marginBottom: 16 }}><SafetyCertificateOutlined /> DRM 및 보안 이슈 관리</Title>
          <Row gutter={[16, 16]}>
             <Col xs={24} md={12} lg={8}>
                 <Card title="시스템 상태" style={{ height: '100%' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '150px' }}>
                          <Tag color={systemStatus.serverStatus === '정상' ? 'success' : 'error'} style={{ padding: '8px 16px', fontSize: '1rem', marginBottom: 16 }}>
                             {systemStatus.serverStatus}
                         </Tag>
                         <Text type="secondary">보안 경고: {systemStatus.securityAlerts} 건</Text>
                     </div>
                 </Card>
             </Col>
             <Col xs={24} md={12} lg={8}>
                <Card title="DRM 적용 상태">
                  <Descriptions column={1} size="small">
                     <Descriptions.Item label="DRM 오류 의심">5건</Descriptions.Item>
                     <Descriptions.Item label="미적용 콘텐츠">150건</Descriptions.Item>
                   </Descriptions>
                   <Button icon={<LockOutlined />} type="link" style={{paddingLeft: 0}}>상태 확인하기</Button>
                </Card>
             </Col>
             <Col xs={24} md={12} lg={8}>
                <Card title="보안 로그">
                  <Statistic title="불법 다운로드 의심 로그 (24h)" value={8} suffix="건" />
                  <Statistic title="API 비정상 접근 시도 (24h)" value={2} suffix="건" style={{marginTop: 16}} />
                  <Button icon={<SecurityScanOutlined />} style={{ marginTop: 16 }}>로그 상세 보기</Button>
                </Card>
             </Col>
          </Row>
        </section>

       <Divider />

       {/* 9. 보고서 및 시각화 (Reports & Visualization) */}
       <section>
         <Title level={3} style={{ marginBottom: 16 }}><AreaChartOutlined /> 보고서 및 시각화</Title>
         <Row gutter={[16, 16]}>
             <Col xs={24} sm={12} md={8} lg={6}>
                <Card title="리포트 생성">
                   <Button icon={<SettingOutlined />} block>맞춤형 리포트 만들기</Button>
                </Card>
             </Col>
             <Col xs={24} sm={12} md={8} lg={6}>
                <Card title="정기 리포트">
                   <Button icon={<DownloadOutlined />} block>월간/분기별 리포트 다운로드</Button>
                 </Card>
             </Col>
         </Row>
       </section>

    </Space>
  );
};

export default Dashboard;
