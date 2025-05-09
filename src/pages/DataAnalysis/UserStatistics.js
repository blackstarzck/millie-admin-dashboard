import React, { useState, useMemo } from 'react';
import {
    Typography,
    Row,
    Col,
    Card,
    Table,
    Tag,
    Space,
    Statistic,
    List,
    Dropdown,
    Button,
    Menu,
} from 'antd';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Example using recharts
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartJsTitle, // Ant Design의 Title과 충돌 방지
  Tooltip as ChartJsTooltip,
  Legend as ChartJsLegend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { DownOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartJsTitle,
  ChartJsTooltip,
  ChartJsLegend,
  ArcElement
);

// 도넛 차트 중앙 텍스트 플러그인
const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart) => {
    if (chart.config.type === 'doughnut' && chart.config.options.plugins && chart.config.options.plugins.centerText && chart.config.options.plugins.centerText.display) {
      const { ctx, data, chartArea: { top, bottom, left, right } } = chart;
      const config = chart.config.options.plugins.centerText;
      const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);

      ctx.save();
      const centerX = (left + right) / 2;
      const centerY = (top + bottom) / 2;

      // 메인 텍스트 (예: "합계")
      ctx.font = config.mainTextFont || '12px sans-serif';
      ctx.fillStyle = config.mainTextColor || '#666';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.mainText || 'Total', centerX, centerY - 10); // 기본값 'Total'

      // 값 텍스트 (예: 숫자)
      ctx.font = config.valueTextFont || 'bold 18px sans-serif';
      ctx.fillStyle = config.valueTextColor || '#333';
      ctx.fillText(total.toLocaleString(), centerX, centerY + 10);
      
      ctx.restore();
    }
  }
};
ChartJS.register(centerTextPlugin); // 플러그인 등록

const { Title, Text } = Typography;

const UserStatistics = () => {
  const [dauTimeRange, setDauTimeRange] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [userStatusPeriod, setUserStatusPeriod] = useState('30d');
  const [genderPeriod, setGenderPeriod] = useState('30d');
  const [ageGroupPeriod, setAgeGroupPeriod] = useState('30d');

  const dailyLabels = ['07-20', '07-21', '07-22', '07-23', '07-24', '07-25', '07-26'];
  const dailyDauValues = [1000, 1050, 1020, 1100, 1150, 1120, 1180];

  const weeklyDauLabels = ['3주 전', '2주 전', '지난 주', '이번 주'];
  const weeklyDauValues = [1050, 1100, 1120, 1150];

  const monthlyDauLabels = ['2개월 전', '지난 달', '이번 달'];
  const monthlyDauValues = [1100, 1180, 1250];

  const getDauChartDisplayData = () => {
    let currentLabels;
    let currentDataValues;
    let chartTitleText;

    switch (dauTimeRange) {
      case 'weekly':
        currentLabels = weeklyDauLabels;
        currentDataValues = weeklyDauValues;
        chartTitleText = '주별 DAU 추이';
        break;
      case 'monthly':
        currentLabels = monthlyDauLabels;
        currentDataValues = monthlyDauValues;
        chartTitleText = '월별 DAU 추이';
        break;
      default: // daily
        currentLabels = dailyLabels;
        currentDataValues = dailyDauValues;
        chartTitleText = '일별 DAU 추이';
        break;
    }

    const data = {
      labels: currentLabels,
      datasets: [
        {
          label: 'DAU',
          data: currentDataValues,
          borderColor: 'rgb(255, 205, 86)',
          backgroundColor: 'rgba(255, 205, 86, 0.5)',
        },
        { label: '일별', data: [], hidden: false, borderColor: 'grey', backgroundColor: 'transparent', borderWidth: 0, pointRadius: 0 },
        { label: '주별', data: [], hidden: false, borderColor: 'grey', backgroundColor: 'transparent', borderWidth: 0, pointRadius: 0 },
        { label: '월별', data: [], hidden: false, borderColor: 'grey', backgroundColor: 'transparent', borderWidth: 0, pointRadius: 0 },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            filter: function(legendItem) {
              return legendItem.text !== 'DAU';
            }
          },
          onClick: (e, legendItem, legend) => {
            const chart = legend.chart;
            const text = legendItem.text;
            let newRange = dauTimeRange;

            if (text === '일별') newRange = 'daily';
            else if (text === '주별') newRange = 'weekly';
            else if (text === '월별') newRange = 'monthly';
            
            if (newRange !== dauTimeRange) {
              setDauTimeRange(newRange);
              if (!chart.isDatasetVisible(0)) {
                chart.show(0);
              }
            }
          }
        },
        title: { display: true, text: chartTitleText }
      },
      scales: { 
        y: { beginAtZero: true, title: { display: true, text: 'DAU' } },
        x: { title: { display: true, text: '기간' } } 
      }
    };
    return { data, options };
  };

  const { data: currentDauChartData, options: currentDauChartOptions } = getDauChartDisplayData();

  // 통합 사용자 활동 차트 옵션 및 데이터
  const combinedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { 
        position: 'top',
        labels: { usePointStyle: true } 
      },
      title: { display: true, text: '주요 사용자 지표 통합 추이' }
    },
    scales: {
      y: { type: 'linear', display: true, position: 'left', beginAtZero: true, title: { display: true, text: '사용자 수 (총, 재방문)' } },
      y1: { type: 'linear', display: true, position: 'right', beginAtZero: true, title: { display: true, text: '신규 가입자 수' }, grid: { drawOnChartArea: false } },
      x: { title: { display: true, text: '날짜' } }
    }
  };

  const combinedUserActivityChartData = {
    labels: dailyLabels,
    datasets: [
      { label: '총 사용자 수', data: [1200, 1250, 1230, 1300, 1350, 1400, 1420], borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', yAxisID: 'y' },
      { label: '일별 신규 가입자 수', data: dailyDauValues, borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', yAxisID: 'y1' },
      { label: '일별 재방문 사용자 수', data: [800, 850, 820, 880, 900, 910, 930], borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)', yAxisID: 'y' },
    ],
  };

  // 예시 데이터
  const dailySignupData = [
    { date: '07-20', count: 15 }, { date: '07-21', count: 22 }, { date: '07-22', count: 18 },
    { date: '07-23', count: 25 }, { date: '07-24', count: 30 }, { date: '07-25', count: 28 },
    { date: '07-26', count: 35 },
  ];

  // 사용자 상태 데이터 (기간별)
  const userStatusData30d = [
    { key: 'active', name: '활성 사용자', value: 1234 }, { key: 'dormant', name: '휴면 사용자', value: 345 }, { key: 'withdrawn', name: '탈퇴 사용자', value: 123 },
  ];
  const userStatusData3m = [
    { key: 'active', name: '활성 사용자', value: 1500 }, { key: 'dormant', name: '휴면 사용자', value: 400 }, { key: 'withdrawn', name: '탈퇴 사용자', value: 150 },
  ];
  const userStatusData6m = [
    { key: 'active', name: '활성 사용자', value: 1800 }, { key: 'dormant', name: '휴면 사용자', value: 450 }, { key: 'withdrawn', name: '탈퇴 사용자', value: 180 },
  ];

  // 성별 분포 데이터 (기간별)
  const genderData30d = [ { name: '남성', value: 680 }, { name: '여성', value: 950 }, { name: '기타/미응답', value: 55 }, ];
  const genderData3m = [ { name: '남성', value: 720 }, { name: '여성', value: 1000 }, { name: '기타/미응답', value: 60 }, ];
  const genderData6m = [ { name: '남성', value: 750 }, { name: '여성', value: 1050 }, { name: '기타/미응답', value: 65 }, ];

  // 연령대별 분포 데이터 (기간별)
  const ageGroupData30d = [ { name: '10대', value: 120 }, { name: '20대', value: 550 }, { name: '30대', value: 620 }, { name: '40대', value: 310 }, { name: '50대 이상', value: 85 }, ];
  const ageGroupData3m = [ { name: '10대', value: 130 }, { name: '20대', value: 580 }, { name: '30대', value: 650 }, { name: '40대', value: 330 }, { name: '50대 이상', value: 90 }, ];
  const ageGroupData6m = [ { name: '10대', value: 140 }, { name: '20대', value: 600 }, { name: '30대', value: 680 }, { name: '40대', value: 350 }, { name: '50대 이상', value: 95 }, ];

  // 차트별 새로운 색상 팔레트 정의
  const userStatusColors = ['#36A2EB', '#7FBCEC', '#C2DAF2']; // 파란색 계열
  const genderColors = ['#FF6384', '#FF93A9', '#FFC4D0'];     // 분홍색 계열
  const ageGroupColors = ['#4BC0C0', '#7CD1D1', '#AEE2E2', '#D0F3F3', '#E8FFFF']; // 녹색/청록색 계열

  // 도넛 차트 공통 기본 옵션 (범례 등)
  const baseDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) { label += ': '; }
            if (context.parsed !== null) {
              label += context.parsed.toLocaleString() + ' (' + ((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1) + '%)';
            }
            return label;
          }
        }
      }
    }
  };

  // 각 도넛 차트별 옵션 (centerText.display를 false로 설정하여 중앙 텍스트 숨김)
  const userStatusDoughnutOptions = {
    ...baseDoughnutOptions,
    plugins: {
      ...baseDoughnutOptions.plugins,
      centerText: { display: false, mainText: '총 계정 수' }
    }
  };
  const genderDoughnutOptions = {
    ...baseDoughnutOptions,
    plugins: {
      ...baseDoughnutOptions.plugins,
      centerText: { display: false, mainText: '응답자 합계' }
    }
  };
  const ageGroupDoughnutOptions = {
    ...baseDoughnutOptions,
    plugins: {
      ...baseDoughnutOptions.plugins,
      centerText: { display: false, mainText: '응답자 합계' }
    }
  };

  // 기간 변경 핸들러
  const handlePeriodChange = (chartType, periodKey) => {
    if (chartType === 'userStatus') setUserStatusPeriod(periodKey);
    else if (chartType === 'gender') setGenderPeriod(periodKey);
    else if (chartType === 'ageGroup') setAgeGroupPeriod(periodKey);
  };

  // 드롭다운 메뉴 렌더링 함수
  const renderPeriodDropdown = (chartType, currentPeriod) => {
    const periodText = {
      '30d': '30일',
      '3m': '3개월',
      '6m': '6개월',
    };
    return (
      <Dropdown
        overlay={(
          <Menu onClick={({ key }) => handlePeriodChange(chartType, key)}>
            <Menu.Item key="30d">30일</Menu.Item>
            <Menu.Item key="3m">3개월</Menu.Item>
            <Menu.Item key="6m">6개월</Menu.Item>
          </Menu>
        )}
      >
        <Button size="small">
          {periodText[currentPeriod]} <DownOutlined />
        </Button>
      </Dropdown>
    );
  };

  // 동적 데이터 선택 로직 (useMemo 사용)
  const currentUserStatusArray = useMemo(() => {
    switch (userStatusPeriod) {
      case '3m': return userStatusData3m;
      case '6m': return userStatusData6m;
      default: return userStatusData30d;
    }
  }, [userStatusPeriod]);

  const currentGenderArray = useMemo(() => {
    switch (genderPeriod) {
      case '3m': return genderData3m;
      case '6m': return genderData6m;
      default: return genderData30d;
    }
  }, [genderPeriod]);

  const currentAgeGroupArray = useMemo(() => {
    switch (ageGroupPeriod) {
      case '3m': return ageGroupData3m;
      case '6m': return ageGroupData6m;
      default: return ageGroupData30d;
    }
  }, [ageGroupPeriod]);

  // 도넛 차트 데이터 객체 (useMemo 사용)
  const userStatusDoughnutData = useMemo(() => ({ 
    labels: currentUserStatusArray.map(item => item.name), 
    datasets: [{ data: currentUserStatusArray.map(item => item.value), backgroundColor: userStatusColors.slice(0, currentUserStatusArray.length) }] 
  }), [currentUserStatusArray]);

  const genderDoughnutData = useMemo(() => ({ 
    labels: currentGenderArray.map(item => item.name), 
    datasets: [{ data: currentGenderArray.map(item => item.value), backgroundColor: genderColors.slice(0, currentGenderArray.length) }] 
  }), [currentGenderArray]);

  const ageGroupDoughnutData = useMemo(() => ({ 
    labels: currentAgeGroupArray.map(item => item.name), 
    datasets: [{ data: currentAgeGroupArray.map(item => item.value), backgroundColor: ageGroupColors.slice(0, currentAgeGroupArray.length) }] 
  }), [currentAgeGroupArray]);

  // 신규 사용자 및 재방문 사용자 오늘/어제 데이터 (더미)
  const todayNewUsers = dailySignupData.length > 0 ? dailySignupData[dailySignupData.length - 1].count : 0;
  const yesterdayNewUsers = 28; 
  const todayReturningUsers = 850; 
  const yesterdayReturningUsers = 820;

  // 변화량 및 아이콘 렌더링 함수
  const renderTrend = (currentValue, previousValue) => {
    const diff = currentValue - previousValue;
    let color = 'rgba(0, 0, 0, 0.85)'; // 기본값 (변동 없음)
    let icon = null;
    let trendText = `${Math.abs(diff)}`;

    if (diff > 0) {
      color = '#52c41a'; 
      icon = <ArrowUpOutlined />;
    } else if (diff < 0) {
      color = '#f5222d'; 
      icon = <ArrowDownOutlined />;
    } else {
      trendText = '-'; // 변동 없을 시 0 대신 '-'
      icon = null; // 변동 없을 시 아이콘 없음
    }

    return (
      <Text style={{ color, marginLeft: 8, fontSize: 14 }}>
        {icon} {trendText}
      </Text>
    );
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>사용자 통계 분석</Title>

      {/* 4개 통계 카드 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card><Statistic title="총 사용자 수" value={currentUserStatusArray.reduce((sum, item) => sum + item.value, 0)} /></Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card>
            <div style={{ marginBottom: 4 }}> {/* 제목과 수치 그룹 간격 조정 */}
              <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.45)' }}>신규 사용자 (오늘)</Text>
            </div>
            <div>
              <Text style={{ fontSize: 24, marginRight: 0 }}>{todayNewUsers.toLocaleString()}</Text>
              {renderTrend(todayNewUsers, yesterdayNewUsers)}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card>
            <div style={{ marginBottom: 4 }}> {/* 제목과 수치 그룹 간격 조정 */}
              <Text style={{ fontSize: 14, color: 'rgba(0, 0, 0, 0.45)' }}>재방문 사용자 (오늘)</Text>
            </div>
            <div>
              <Text style={{ fontSize: 24, marginRight: 0 }}>{todayReturningUsers.toLocaleString()}</Text>
              {renderTrend(todayReturningUsers, yesterdayReturningUsers)}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Card><Statistic title="평균 DAU (최근 7일)" value={Math.round(dailyDauValues.reduce((a,b)=>a+b,0)/dailyDauValues.length)} /></Card>
        </Col>
      </Row>

      {/* 통합 라인 차트 및 DAU 라인 차트 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="주요 사용자 지표 통합 추이">
            <div style={{ height: 350 }}><Line options={combinedChartOptions} data={combinedUserActivityChartData} /></div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={currentDauChartOptions.plugins.title.text}> 
            <div style={{ height: 350 }}><Line options={currentDauChartOptions} data={currentDauChartData} /></div>
          </Card>
        </Col>
      </Row>

      {/* 도넛 차트 섹션 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card title="사용자 상태 분포" extra={renderPeriodDropdown('userStatus', userStatusPeriod)}>
            <div style={{ height: 300 }}><Doughnut options={userStatusDoughnutOptions} data={userStatusDoughnutData} /></div>
            <List
              itemLayout="horizontal"
              dataSource={currentUserStatusArray}
              renderItem={(item, index) => {
                const total = currentUserStatusArray.reduce((sum, i) => sum + i.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                return (
                  <List.Item style={{ padding: '8px 0' }}>
                    <List.Item.Meta
                      avatar={<Tag color={userStatusColors[index % userStatusColors.length]} style={{ marginRight: 8, borderRadius: '50%', width: 10, height: 10, padding:0 }} />} 
                      title={<Text>{item.name}</Text>}
                    />
                    <Text>{item.value.toLocaleString()} ({percentage}%)</Text>
                  </List.Item>
                );
              }}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="성별 분포" extra={renderPeriodDropdown('gender', genderPeriod)}>
            <div style={{ height: 300 }}><Doughnut options={genderDoughnutOptions} data={genderDoughnutData} /></div>
            <List
              itemLayout="horizontal"
              dataSource={currentGenderArray}
              renderItem={(item, index) => {
                const total = currentGenderArray.reduce((sum, i) => sum + i.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                return (
                  <List.Item style={{ padding: '8px 0' }}>
                    <List.Item.Meta
                      avatar={<Tag color={genderColors[index % genderColors.length]} style={{ marginRight: 8, borderRadius: '50%', width: 10, height: 10, padding:0 }} />} 
                      title={<Text>{item.name}</Text>}
                    />
                    <Text>{item.value.toLocaleString()} ({percentage}%)</Text>
                  </List.Item>
                );
              }}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card title="연령대별 분포" extra={renderPeriodDropdown('ageGroup', ageGroupPeriod)}>
            <div style={{ height: 300 }}><Doughnut options={ageGroupDoughnutOptions} data={ageGroupDoughnutData} /></div>
            <List
              itemLayout="horizontal"
              dataSource={currentAgeGroupArray}
              renderItem={(item, index) => {
                const total = currentAgeGroupArray.reduce((sum, i) => sum + i.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                return (
                  <List.Item style={{ padding: '8px 0' }}>
                    <List.Item.Meta
                      avatar={<Tag color={ageGroupColors[index % ageGroupColors.length]} style={{ marginRight: 8, borderRadius: '50%', width: 10, height: 10, padding:0 }} />} 
                      title={<Text>{item.name}</Text>}
                    />
                    <Text>{item.value.toLocaleString()} ({percentage}%)</Text>
                  </List.Item>
                );
              }}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
      </Row>

    </Space>
  );
};

export default UserStatistics; 