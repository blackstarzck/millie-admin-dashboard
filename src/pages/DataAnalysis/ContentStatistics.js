import React, { useState, useEffect, useMemo } from 'react';
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
    Avatar,
    Skeleton,
    Tooltip,
    DatePicker,
    Select,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title as ChartTitle,
    Tooltip as ChartTooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import {
    ReadOutlined,
    AudioOutlined,
} from '@ant-design/icons';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ChartTitle,
    ChartTooltip,
    Legend,
    ArcElement,
);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 더미 데이터 생성 함수 수정
const generateDummyContent = (count = 20, daysRange = 365) => { // 아이템 수 줄이고, 생성일 범위 지정
    const items = [];
    const today = new Date();

    for (let i = 1; i <= count; i++) {
        const dailyMetrics = [];
        // 기본 트렌드 값을 위한 초기값 (아이템마다 다르게)
        let baseViews = Math.floor(Math.random() * 500) + 50; 
        let baseLikes = Math.floor(Math.random() * 50) + 5;
        let baseShares = Math.floor(Math.random() * 10) + 1;
        let basePosts = Math.floor(Math.random() * 5) + 0;
        let baseReviews = Math.floor(Math.random() * 20) + 1;

        for (let d = 0; d < daysRange; d++) {
            const date = new Date(today);
            date.setDate(today.getDate() - d);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD

            // 약간의 변동성 추가 (예: +/- 10~30%)
            dailyMetrics.push({
                date: dateStr,
                views: Math.max(0, baseViews + Math.floor((Math.random() - 0.5) * baseViews * 0.4)),
                likes: Math.max(0, baseLikes + Math.floor((Math.random() - 0.5) * baseLikes * 0.5)),
                shares: Math.max(0, baseShares + Math.floor((Math.random() - 0.5) * baseShares * 0.6)),
                posts: Math.max(0, basePosts + Math.floor((Math.random() - 0.5) * (basePosts * 0.8) + (Math.random() > 0.8 ? 1: 0))),
                reviews: Math.max(0, baseReviews + Math.floor((Math.random() - 0.5) * baseReviews * 0.5)),
            });
            
            // 다음 날짜의 기본값에 약간의 트렌드 반영 (매우 단순화된 방식)
            if (d % 30 === 0 && Math.random() > 0.3) { // 한 달에 한 번 정도 트렌드 변경 시도
                baseViews += Math.floor((Math.random() - 0.4) * 50); 
                baseLikes += Math.floor((Math.random() - 0.4) * 5);
            }
        }

        items.push({
            key: `content_${i}`,
            title: `인기 콘텐츠 ${i}`,
            contentType: Math.random() < 0.5 ? '10' : '20', // '10' (전자책), '20' (오디오북)으로 변경
            dailyMetrics: dailyMetrics.sort((a,b) => new Date(a.date) - new Date(b.date)), // 날짜순 정렬
            completionRate: Math.floor(Math.random() * 81) + 20, // 20% ~ 100% 사이의 완독률
            estimatedReadingTime: Math.floor(Math.random() * 56) + 5, // 5분 ~ 60분 사이의 예상 완독 시간
            // 테이블 표시에 사용할 대표값 (예: 최근 30일 합계 또는 평균) - loadInitialData에서 계산하도록 변경
        });
    }
    // 초기 아이템 정렬 기준은 일단 제거 (테이블별로 loadInitialData에서 처리)
    return items; 
};

const allDummyContent = generateDummyContent(50); // 아이템 수 증가 예시
const ITEMS_PER_PAGE = 15; // 페이지당 아이템 수 조정 가능

// 차트 데이터셋에 사용할 색상 배열 (라인 차트에 맞게 단일 색상 또는 조정)
const LINE_CHART_COLOR = 'rgba(54, 162, 235, 0.7)';
const LINE_CHART_BORDER_COLOR = 'rgba(54, 162, 235, 1)';
// 막대 차트용 색상도 필요하면 여기에 추가 (예: 이전 CHART_COLORS 일부 활용)
const BAR_CHART_COLORS = [
    'rgba(255, 159, 64, 0.7)', // Likes
    'rgba(75, 192, 192, 0.7)',  // Shares
    'rgba(153, 102, 255, 0.7)', // Posts
    'rgba(255, 206, 86, 0.7)',  // Reviews
];

// 선택된 아이템의 조회수 라인에 사용할 별도 색상
const SELECTED_ITEM_VIEWS_LINE_COLOR = 'rgba(255, 99, 132, 1)'; // 밝은 빨간색 계열
const SELECTED_ITEM_VIEWS_BG_COLOR = 'rgba(255, 99, 132, 0.2)';

// BookManagement.js의 getContentTypeTag와 유사한 함수 추가
const getContentTypeTagForStats = (contentType) => {
    if (contentType === '10') { // 전자책
        return <Tag icon={<ReadOutlined />} color="blue">전자책</Tag>;
    } else if (contentType === '20') { // 오디오북
        return <Tag icon={<AudioOutlined />} color="purple">오디오북</Tag>;
    } else {
        return <Tag>{contentType || '알 수 없음'}</Tag>;
    }
};

const metricDisplayNames = {
    views: '조회수',
    likes: '관심등록',
    shares: '공유',
    posts: '포스트',
    reviews: '리뷰',
    completionRate: '완독률',
    estimatedReadingTime: '평균 완독 시간',
};

// Define colors for table header bullets (matching chart series)
const metricChartColors = {
    views: LINE_CHART_BORDER_COLOR,
    likes: BAR_CHART_COLORS[0],
    shares: BAR_CHART_COLORS[1],
    posts: BAR_CHART_COLORS[2],
    reviews: BAR_CHART_COLORS[3],
    completionRate: 'rgba(255, 99, 71, 0.7)',
    estimatedReadingTime: 'rgba(60, 179, 113, 0.7)',
};

// BookManagement.js의 subCategoryMap을 기반으로 새로운 rawCategoryData 생성
const subCategoryMapForStats = {
    '소설': ['한국 소설', '영미 소설', '일본 소설', '추리/미스터리', 'SF', '판타지', '역사 소설', '로맨스'],
    '시/에세이': ['한국 시', '해외 시', '에세이', '여행 에세이', '인물/자전적'],
    '인문': ['철학', '심리학', '역사일반', '동양사상', '서양사상', '종교', '예술/문화'],
    '사회과학': ['정치/사회', '법률', '경제학(일반)', '사회학', '교육학', '언론/미디어'],
    '경영/경제': ['경영일반', '마케팅/세일즈', '재테크/투자', '창업/취업', '경제이론'],
    '자기계발': ['성공/처세', '인간관계', '시간관리', '리더십', '코칭'], // BookManagement.js에 따르면 '자기계발'도 하위 카테고리가 있습니다.
    'IT/컴퓨터': ['프로그래밍 언어', 'OS/데이터베이스', '네트워크/보안', '웹 개발', '모바일 앱 개발', 'AI/머신러닝', '데이터 분석', 'IT자격증'],
    // 예시: 하위 카테고리가 없는 단독 상위 카테고리가 있다면
    // '단독카테고리': [], // 또는 null
};

const generateNewRawCategoryData = () => {
    const newRawData = [];
    Object.entries(subCategoryMapForStats).forEach(([parentCatName, childCatNames], parentIndex) => {
        const parentKey = `cat-parent-${parentIndex}-${parentCatName.replace(/\s|\//g, '')}`;
        if (childCatNames && childCatNames.length > 0) {
            newRawData.push({
                key: parentKey,
                name: parentCatName,
                directValue: Math.floor(Math.random() * 15) + 5, // 상위 카테고리 자체 값 (랜덤)
                children: childCatNames.map((childName, childIndex) => ({
                    key: `${parentKey}-child-${childIndex}-${childName.replace(/\s|\//g, '')}`,
                    name: childName,
                    value: Math.floor(Math.random() * 30) + 10, // 하위 카테고리 값 (랜덤)
                })),
            });
        } else { // 하위 카테고리가 없는 경우 (childCatNames가 빈 배열이거나 null일 때)
            newRawData.push({
                key: parentKey,
                name: parentCatName,
                directValue: Math.floor(Math.random() * 50) + 10, // 이 자체가 값이 됨 (랜덤)
            });
        }
    });
    return newRawData;
};

const rawCategoryData = generateNewRawCategoryData();

// Updated category data with hierarchical structure and summed parent values
const categoryDistribution = rawCategoryData.map(category => {
  let childrenSum = 0;
  if (category.children) {
    category.children.forEach(child => {
      childrenSum += (child.value || 0);
    });
  }
  return {
    ...category,
    value: (category.directValue || 0) + childrenSum,
    // children은 그대로 유지하여 트리 구조를 만듦
  };
});

// Updated categoryColumns for tree data (simplified tags for now)
const categoryColumns = [
    { title: '카테고리', dataIndex: 'name', key: 'name' }, // Ant Table handles indentation for tree data
    { title: '콘텐츠 수', dataIndex: 'value', key: 'value', align: 'right', render: (value) => value != null ? value.toLocaleString() : '0' },
];

const categoryChartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF69EE', '#FF6384']; // 색상 추가 가능

const ContentStatistics = () => {
    const [combinedTableData, setCombinedTableData] = useState({ items: [], loading: false, hasMore: false });
    const [tableSortConfig, setTableSortConfig] = useState({ metricKey: 'views', order: 'desc' });
    const [globalDateRange, setGlobalDateRange] = useState([null, null]);
    const [selectedChartItem, setSelectedChartItem] = useState(null);
    const [selectedMetricKey, setSelectedMetricKey] = useState(null);

    const loadCombinedTableData = () => {
        setCombinedTableData(prev => ({ ...prev, loading: true, items: [] }));

        let processedItems = allDummyContent.map(item => {
            let views = 0, likes = 0, shares = 0, posts = 0, reviews = 0;
            let filteredMetrics = item.dailyMetrics;

            if (globalDateRange && globalDateRange[0] && globalDateRange[1] && 
                globalDateRange[0].isValid() && globalDateRange[1].isValid()) {
                const startDate = globalDateRange[0].startOf('day').toDate();
                const endDate = globalDateRange[1].endOf('day').toDate();
                
                filteredMetrics = item.dailyMetrics.filter(metric => {
                    const metricDate = new Date(metric.date);
                    return metricDate >= startDate && metricDate <= endDate;
                });
            }
            
            filteredMetrics.forEach(metric => {
                views += metric.views;
                likes += metric.likes;
                shares += metric.shares;
                posts += metric.posts;
                reviews += metric.reviews;
            });

            return {
                ...item,
                totalViews: views,
                totalLikes: likes,
                totalShares: shares,
                totalPosts: posts,
                totalReviews: reviews,
                completionRate: item.completionRate,
                estimatedReadingTime: item.estimatedReadingTime,
            };
        });
        
        const { metricKey: sortKey, order: sortOrder } = tableSortConfig;
        const sortDataIndex = `total${sortKey.charAt(0).toUpperCase() + sortKey.slice(1)}`;

        processedItems.sort((a, b) => {
            const valA = a[sortDataIndex];
            const valB = b[sortDataIndex];
            return sortOrder === 'desc' ? valB - valA : valA - valB;
        });

        const rankedItems = processedItems.map((item, index) => ({ ...item, rank: index + 1 }));

        setCombinedTableData({
            items: rankedItems.map(i=>({...i, dailyMetrics:undefined})),
            loading: false,
            hasMore: false,
        });
    };
    
    useEffect(() => {
        setSelectedChartItem(null);
        // selectedMetricKey will be derived from tableSortConfig for chart context
        loadCombinedTableData();
    }, [globalDateRange, tableSortConfig]);

    const { combinedChartData, combinedChartOptions } = useMemo(() => {
        let chartLabels = [];
        if (globalDateRange && globalDateRange[0] && globalDateRange[1] &&
            globalDateRange[0].isValid() && globalDateRange[1].isValid()) {
            const startDate = globalDateRange[0].startOf('day').toDate();
            const endDate = globalDateRange[1].endOf('day').toDate();
            let currentDate = new Date(startDate);
            while(currentDate <= endDate) {
                chartLabels.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else { // Default to last 30 days if no range
            const today = new Date();
            for (let i = 29; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                chartLabels.push(d.toISOString().split('T')[0]);
            }
        }

        const datasets = [];
        let chartTitleText = '테이블에서 항목을 선택하여 상세 데이터를 확인하세요.';
        let legendDisplay = false;
        let yViewsDisplay = false;
        let ySelectedDisplay = false;
        let ySelectedTitleText = '';

        if (selectedChartItem) { // No longer directly using selectedMetricKey to filter metrics for chart
            legendDisplay = true;
            const originalItemDetails = allDummyContent.find(item => item.key === selectedChartItem.key);

            if (originalItemDetails) {
                // selectedChartItem에서 completionRate와 estimatedReadingTime을 가져옵니다.
                const completionInfo = selectedChartItem.completionRate !== undefined ? `완독률: ${selectedChartItem.completionRate}%` : '';
                const readingTimeInfo = selectedChartItem.estimatedReadingTime !== undefined ? `예상 시간: ${selectedChartItem.estimatedReadingTime}분` : '';
                const additionalInfo = [completionInfo, readingTimeInfo].filter(Boolean).join(', ');

                chartTitleText = `'${originalItemDetails.title}' - 지표 분석`;
                if (additionalInfo) {
                    chartTitleText += ` (${additionalInfo})`;
                }
                yViewsDisplay = true; // Views will always be shown for a selected item

                // 1. Selected Item's Views Line
                const viewsData = chartLabels.map(dateStr => originalItemDetails.dailyMetrics.find(m => m.date === dateStr)?.views ?? null);
                datasets.push({
                    label: `${metricDisplayNames.views}`,
                    data: viewsData,
                    type: 'line',
                    borderColor: metricChartColors.views,
                    backgroundColor: metricChartColors.views.replace('1', '0.2'),
                    yAxisID: 'yViews',
                    tension: 0.1,
                    order: 0,
                });

                // 2. Other metrics as Bars (Likes, Shares, Posts, Reviews)
                const otherMetricKeys = ['likes', 'shares', 'posts', 'reviews'];
                let hasOtherMetrics = false;

                otherMetricKeys.forEach((metricKey, index) => {
                    const metricData = chartLabels.map(dateStr => originalItemDetails.dailyMetrics.find(m => m.date === dateStr)?.[metricKey] ?? null);
                    // Check if there's any data for this metric to avoid empty datasets
                    if (metricData.some(d => d !== null && d > 0)) {
                        hasOtherMetrics = true;
                        datasets.push({
                            label: `${metricDisplayNames[metricKey]}`,
                            data: metricData,
                            type: 'bar',
                            backgroundColor: metricChartColors[metricKey],
                            borderColor: metricChartColors[metricKey].replace('0.7', '1'),
                            yAxisID: 'yOthers', // New Y-axis for these bars
                            order: index + 1, // Stagger order slightly
                        });
                    }
                });

                if (hasOtherMetrics) {
                    ySelectedDisplay = true;
                    ySelectedTitleText = '기타 지표 수치';
                } else {
                    ySelectedDisplay = false; // Hide if no bar data
                }

            } else {
                 chartTitleText = '선택된 항목의 상세 데이터를 불러올 수 없습니다.';
                 yViewsDisplay = false;
                 ySelectedDisplay = false;
            }
        } else { // No item selected
             yViewsDisplay = false;
             ySelectedDisplay = false;
        }


        const data = { labels: chartLabels, datasets: datasets };
        const options = { 
            responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false, },
            plugins: {
                legend: { display: legendDisplay, labels: { filter: null } },
                title: { display: true, text: chartTitleText, font: { size: 16 } },
                tooltip: { callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) { label += ': '; } if (context.parsed.y !== null) { label += context.parsed.y.toLocaleString(); } return label; } } }
            },
            scales: {
                x: { 
                    title: { display: true, text: '날짜' }, 
                    ticks: { 
                        autoSkip: true, 
                        maxTicksLimit: chartLabels.length > 30 ? 15 : 30,
                        callback: function(value, index, ticks) {
                            const label = this.getLabelForValue(value); 
                            if (typeof label === 'string' && label.includes('-')) {
                                const parts = label.split('-'); 
                                if (parts.length === 3) {
                                    return `${parts[1]}/${parts[2]}`; 
                                }
                            }
                            return label; 
                        }
                    } 
                },
                yViews: { type: 'linear', display: yViewsDisplay, position: 'left', title: { display: true, text: metricDisplayNames.views }, ticks: { callback: function(value) { return value.toLocaleString(); } }, beginAtZero: true },
                yOthers: { 
                    type: 'linear', 
                    display: ySelectedDisplay, 
                    position: 'right', 
                    title: { display: true, text: ySelectedTitleText }, 
                    ticks: { callback: function(value) { return value.toLocaleString(); } }, 
                    beginAtZero: true, 
                    grid: { drawOnChartArea: false } 
                }
            },
        };
        return { combinedChartData: data, combinedChartOptions: options };
    }, [globalDateRange, selectedChartItem]); // Removed selectedMetricKey and tableSortConfig, as chart is now solely driven by selectedChartItem for multi-metric view

    const combinedTableColumns = [
        { title: '순위', dataIndex: 'rank', key: 'rank', width: 60, align: 'center' },
        {
            title: '타입',
            dataIndex: 'contentType',
            key: 'contentType',
            width: 120, 
            render: (contentType) => getContentTypeTagForStats(contentType),
        },
        { 
            title: '제목', 
            dataIndex: 'title', 
            key: 'title', 
            ellipsis: true, 
            fixed: 'left', 
            width: 180,
            onCell: (record) => {
                const isSelected = selectedChartItem?.key === record.key;
                return {
                    style: isSelected ? { backgroundColor: '#e6f7ff' } : {},
                };
            }
        },
        ...Object.keys(metricDisplayNames).map(metricKey => ({
            title: (
                <Space size={4}>
                    <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: metricChartColors[metricKey] || '#ccc', 
                    }} />
                    {metricDisplayNames[metricKey]}
                </Space>
            ),
            dataIndex: metricKey === 'completionRate' || metricKey === 'estimatedReadingTime' 
                       ? metricKey 
                       : `total${metricKey.charAt(0).toUpperCase() + metricKey.slice(1)}`,
            key: metricKey, 
            render: (text, record) => {
                if (metricKey === 'completionRate') return record.completionRate !== undefined ? `${record.completionRate}%` : '-';
                if (metricKey === 'estimatedReadingTime') return record.estimatedReadingTime !== undefined ? `${record.estimatedReadingTime} 분` : '-';
                return text?.toLocaleString() ?? '-';
            },
            align: 'right',
            width: metricKey === 'views' ? 110 : 
                   metricKey === 'estimatedReadingTime' ? 140 :
                   metricKey === 'completionRate' ? 100 : 110, 
        })),
    ];

    // Memo for Category Distribution Chart
    const { categoryChartData, categoryChartOptions } = useMemo(() => {
        const labels = categoryDistribution.map(cat => cat.name);
        const dataValues = categoryDistribution.map(cat => cat.value);

        const data = {
            labels: labels,
            datasets: [
                {
                    label: '콘텐츠 수',
                    data: dataValues,
                    backgroundColor: categoryDistribution.map((cat, index) => categoryChartColors[index % categoryChartColors.length]),
                    borderColor: categoryDistribution.map((cat, index) => categoryChartColors[index % categoryChartColors.length].replace('0.7', '1').replace('0.2','1')), // Adapting from bar chart colors if needed
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: '상위 카테고리별 콘텐츠 분포',
                    font: { size: 14 }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed.toLocaleString();
                            }
                            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) + '%' : '0%';
                            label += ` (${percentage})`;
                            return label;
                        }
                    }
                }
            },
        };
        return { categoryChartData: data, categoryChartOptions: options };
    }, [categoryDistribution]); // Dependency is the categoryDistribution data itself

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>콘텐츠 통계 분석</Title>

            <Card title="콘텐츠 데이터 분석 차트">
                 <Row justify="end" style={{ marginBottom: 16 }}>
                    <Col>
                        <Text style={{ marginRight: 8 }}>기간 선택:</Text>
                        <RangePicker 
                            value={globalDateRange}
                            onChange={(dates) => setGlobalDateRange(dates)} 
                        />
                    </Col>
                </Row>
                 <div style={{ height: '350px' }}>
                    <Bar options={combinedChartOptions} data={combinedChartData} />
                </div>
            </Card>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card title="콘텐츠 데이터 테이블">
                        <Space style={{ marginBottom: 16 }}>
                            <Text>정렬 기준:</Text>
                            <Select
                                value={tableSortConfig.metricKey}
                                onChange={(value) => setTableSortConfig(prev => ({ ...prev, metricKey: value, order: prev.order }))}
                                style={{ width: 150 }}
                            >
                                {Object.entries(metricDisplayNames).map(([key, name]) => (
                                    <Option key={key} value={key}>{name}</Option>
                                ))}
                            </Select>
                            <Select
                                value={tableSortConfig.order}
                                onChange={(value) => setTableSortConfig(prev => ({ ...prev, order: value }))}
                                style={{ width: 120 }}
                            >
                                <Option value="desc">내림차순</Option>
                                <Option value="asc">오름차순</Option>
                            </Select>
                        </Space>
         <Table
                            columns={combinedTableColumns}
                            dataSource={combinedTableData.items}
           rowKey="key"
                            pagination={false}
                            size="small"
                            loading={combinedTableData.loading && combinedTableData.items.length === 0}
                            scroll={{ x: 980, y: 410 }}
                            onRow={(record) => {
                                const isSelected = selectedChartItem?.key === record.key;
                                return {
                                    onClick: () => {
                                        setSelectedChartItem(record);
                                        setSelectedMetricKey(tableSortConfig.metricKey);
                                    },
                                    style: isSelected ? { backgroundColor: '#e6f7ff' } : {},
                                };
                            }}
         />
      </Card>
                </Col>
            </Row>

      {/* 카테고리별 콘텐츠 분포 */}
      <Card title="카테고리별 콘텐츠 분포">
        <Row gutter={[16, 16]} align="middle">
           <Col xs={24} md={12}>
                   <div style={{ height: 300, position: 'relative' }}> {/* maintainAspectRatio:false needs relative parent */}
                       {/* 기존 차트 플레이스홀더 유지 */}
                       {/* <Text type="secondary">(카테고리 차트 라이브러리 연동 필요)</Text> */}
                       <Pie data={categoryChartData} options={categoryChartOptions} />
             </div>
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

            {/* 추가 통계 예시 (기존 유지) */}
      <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
                    <Card><Statistic title="총 등록 콘텐츠 수" value={allDummyContent.length} /></Card>
          </Col>
                <Col xs={24} sm={12} md={8}><Card><Statistic title="평균 완독률" value={75} suffix="%" /></Card></Col>
                <Col xs={24} sm={12} md={8}><Card><Statistic title="인기 검색 키워드" value="#React" /></Card></Col>
      </Row>
    </Space>
  );
};

export default ContentStatistics; 