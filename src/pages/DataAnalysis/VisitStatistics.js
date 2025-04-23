import React, { useState, useEffect, useRef } from 'react';
import {
    Row,
    Col,
    Card,
    Statistic,
    DatePicker,
    Table,
    Typography,
    Space,
    Button,
    Select,
    List,
    Tag,
    Modal,
    Descriptions,
    Image,
} from 'antd';
import {
    LineChartOutlined,
    AreaChartOutlined,
    UserOutlined,
    EyeOutlined,
    BookOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import moment from 'moment';
// import Chart from 'chart.js/auto'; // If using Chart.js

const { Title, Text, Link } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Chart Component Placeholder (similar to Dashboard)
const ChartComponent = ({ chartId, type, data, options }) => {
    const chartRef = useRef(null);
    // Add Chart.js logic here if needed later
    useEffect(() => {
        // Placeholder effect
        if (chartRef.current) {
            console.log(`Chart placeholder initialized for ${chartId}`);
        }
    }, [chartId, type, data, options]);

    return (
        <div style={{ height: '300px', position: 'relative', border: '1px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text type="secondary">( {data?.datasets?.[0]?.label || '방문 추이'} 차트 영역 )</Text>
            <canvas ref={chartRef} id={chartId} style={{ display: 'none' }} /> {/* Hidden canvas for potential future use */}
        </div>
    );
};


// --- Sample Data ---
const initialStats = {
    totalVisits: 125830,
    todayVisits: 850,
    yesterdayVisits: 780,
    totalPageViews: 480200,
    todayPageViews: 2100,
};

// Sample data generation for daily visits
const generateDailyData = (startDate, endDate) => {
    const data = [];
    let current = moment(startDate);
    while (current.isSameOrBefore(endDate, 'day')) {
        const visits = 500 + Math.floor(Math.random() * 500);
        const pageViews = visits * (1.5 + Math.random() * 3);
        data.push({
            key: current.format('YYYY-MM-DD'),
            date: current.format('YYYY-MM-DD (ddd)'),
            visits: Math.max(50, visits),
            pageViews: Math.floor(pageViews),
        });
        current.add(1, 'day');
    }
    return data;
};

const initialDateRange = [moment().subtract(6, 'days'), moment()];
const initialDailyData = generateDailyData(initialDateRange[0], initialDateRange[1]);

const initialVisitTrendData = {
    labels: initialDailyData.map(d => d.date.substring(0, 10)),
    datasets: [{
        label: '일별 방문수',
        data: initialDailyData.map(d => d.visits),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        fill: true,
        tension: 0.3,
    }]
};

// Sample Popular Book Data with more details for modal
const popularBookData = [
    { key: 'b1', id: 1, title: '달러구트 꿈 백화점', author: '이미예', publisher: '팩토리나인', category: '소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book1', description: '잠들어야만 입장 가능한 꿈 백화점에서 일어나는 비밀스럽고도 기묘하며 가슴 뭉클한 판타지 소설', visits: 580, link: '/content/books/1' },
    { key: 'b2', id: 2, title: '시간을 파는 상점', author: '김선영', publisher: '자음과모음', category: '청소년 소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book2', description: '시간을 파는 특별한 상점을 둘러싼 흥미로운 이야기', visits: 450, link: '/content/books/2' },
    { key: 'b3', id: 3, title: '팩트풀니스', author: '한스 로슬링', publisher: '김영사', category: '사회과학', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book3', description: '우리가 세상을 오해하는 10가지 이유와 세상이 생각보다 괜찮은 이유', visits: 320, link: '/content/books/3' },
    { key: 'b4', id: 4, title: '어린이라는 세계', author: '김소영', publisher: '사계절', category: '에세이', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book4', description: '어린이들의 시선으로 세상을 바라보는 따뜻한 이야기', visits: 210, link: '/content/books/4' },
    { key: 'b5', id: 5, title: '불편한 편의점', author: '김호연', publisher: '나무옆의자', category: '소설', coverUrl: 'https://via.placeholder.com/100x150.png?text=Book5', description: '서울역 뒤편 골목길의 작은 편의점에서 벌어지는 이야기', visits: 150, link: '/content/books/5' },
];

// --- Component ---
const VisitStatistics = () => {
    const [stats, setStats] = useState(initialStats);
    const [dateRange, setDateRange] = useState(initialDateRange);
    const [tableData, setTableData] = useState(initialDailyData);
    const [chartData, setChartData] = useState(initialVisitTrendData);
    const [isBookDetailModalVisible, setIsBookDetailModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    // Update data when dateRange changes (Simulated fetch)
    useEffect(() => {
        console.log("Fetching stats for range:", dateRange[0].format('YYYY-MM-DD'), "to", dateRange[1].format('YYYY-MM-DD'));
        // --- Simulate fetching new data based on date range ---
        const newData = generateDailyData(dateRange[0], dateRange[1]);
        setTableData(newData);
        setChartData({
            labels: newData.map(d => d.date.substring(0, 10)),
            datasets: [{
                ...initialVisitTrendData.datasets[0],
                label: `방문수 (${dateRange[0].format('MM/DD')}~${dateRange[1].format('MM/DD')})`,
                data: newData.map(d => d.visits),
            }]
        });
        // Usually, you'd also refetch overview stats (today, yesterday, total) based on the range
        // setStats(fetchedStats);
    }, [dateRange]);

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            setDateRange(dates);
        } else {
            setDateRange(initialDateRange); // Reset to default if cleared
        }
    };

    const setPresetDateRange = (type) => {
        let start, end = moment();
        switch(type) {
            case 'today':
                start = moment();
                break;
            case 'yesterday':
                start = moment().subtract(1, 'day');
                end = moment().subtract(1, 'day');
                break;
            case '7days':
                start = moment().subtract(6, 'days');
                break;
            case 'thisMonth':
                start = moment().startOf('month');
                break;
            case 'lastMonth':
                start = moment().subtract(1, 'month').startOf('month');
                end = moment().subtract(1, 'month').endOf('month');
                break;
            default:
                start = moment().subtract(6, 'days');
        }
        setDateRange([start, end]);
    };

    const detailTableColumns = [
        {
            title: '날짜',
            dataIndex: 'date',
            key: 'date',
            width: 150,
        },
        {
            title: '방문수',
            dataIndex: 'visits',
            key: 'visits',
            align: 'right',
            sorter: (a, b) => a.visits - b.visits,
            render: (text) => text.toLocaleString(),
        },
        {
            title: '페이지뷰',
            dataIndex: 'pageViews',
            key: 'pageViews',
            align: 'right',
            sorter: (a, b) => a.pageViews - b.pageViews,
            render: (text) => text.toLocaleString(),
        },
    ];

    // --- Modal Functions ---
    const showBookDetailModal = (book) => {
        setSelectedBook(book);
        setIsBookDetailModalVisible(true);
    };

    const handleBookDetailModalClose = () => {
        setIsBookDetailModalVisible(false);
        setSelectedBook(null);
    };

    // Updated columns for popular books to trigger modal
    const popularBookColumns = [
        {
            title: '도서명',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Link onClick={() => showBookDetailModal(record)}>{text}</Link> // Trigger modal on click
            ),
        },
        {
            title: '방문자 수',
            dataIndex: 'visits',
            key: 'visits',
            align: 'right',
            width: 100,
            render: (text) => text.toLocaleString(),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><AreaChartOutlined /> 방문 통계</Title>

            {/* Stats Overview Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small"><Statistic title="총 방문" value={stats.totalVisits} prefix={<UserOutlined />} formatter={(value) => value.toLocaleString()} /></Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small"><Statistic title="오늘 방문" value={stats.todayVisits} prefix={<UserOutlined />} formatter={(value) => value.toLocaleString()} /></Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small"><Statistic title="어제 방문" value={stats.yesterdayVisits} prefix={<UserOutlined />} formatter={(value) => value.toLocaleString()} /></Card>
                </Col>
                <Col xs={12} sm={12} md={6}>
                    <Card size="small"><Statistic title="오늘 페이지뷰" value={stats.todayPageViews} prefix={<EyeOutlined />} formatter={(value) => value.toLocaleString()} /></Card>
                </Col>
            </Row>

             {/* Filters with Presets */}
             <Card size="small">
                <Space wrap align="center">
                    <CalendarOutlined style={{ marginRight: 8 }}/>
                    <Button.Group>
                        <Button onClick={() => setPresetDateRange('today')}>오늘</Button>
                        <Button onClick={() => setPresetDateRange('yesterday')}>어제</Button>
                        <Button onClick={() => setPresetDateRange('7days')}>7일</Button>
                        <Button onClick={() => setPresetDateRange('thisMonth')}>이번달</Button>
                        <Button onClick={() => setPresetDateRange('lastMonth')}>지난달</Button>
                    </Button.Group>
                    <RangePicker value={dateRange} onChange={handleDateChange} allowClear />
                </Space>
            </Card>

            {/* Visit Trend Chart and Popular Books */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}> {/* Chart takes more space */}
                    <Card title="방문 추이">
                         <ChartComponent chartId="visitTrendChart" type="line" data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </Card>
                </Col>
                 <Col xs={24} lg={8}> {/* Popular Books List */}
                     <Card title={<><BookOutlined /> 인기 도서</>} style={{ height: '100%' }}>
                         <Table
                             columns={popularBookColumns}
                             dataSource={popularBookData}
                             size="small"
                             pagination={false}
                             rowKey="key"
                             scroll={{ y: 280 }}
                         />
                     </Card>
                 </Col>
            </Row>

             {/* Detailed Statistics Table */}
             <Card title="상세 통계">
                 <Table
                    columns={detailTableColumns}
                    dataSource={tableData}
                    size="small"
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    bordered
                    rowKey="key"
                 />
            </Card>

            {/* Book Detail Modal */}
            <Modal
                title="도서 상세 정보"
                open={isBookDetailModalVisible}
                onCancel={handleBookDetailModalClose}
                footer={[
                    <Button key="close" onClick={handleBookDetailModalClose}>
                        닫기
                    </Button>,
                    // Optional: Link to Book Management Edit page
                    <Button key="edit" type="primary" href={selectedBook?.link ? `/content/books/edit/${selectedBook.id}` : '#'} >
                        도서 관리로 이동
                    </Button>,
                ]}
                width={600}
            >
                {selectedBook && (
                    <Row gutter={16}>
                        <Col span={8}>
                             <Image
                                width="100%"
                                src={selectedBook.coverUrl || 'https://via.placeholder.com/150?text=No+Image'} // Placeholder if no image
                                alt={selectedBook.title}
                                fallback="https://via.placeholder.com/150?text=Error"
                            />
                        </Col>
                        <Col span={16}>
                            <Descriptions bordered column={1} size="small">
                                <Descriptions.Item label="제목">{selectedBook.title}</Descriptions.Item>
                                <Descriptions.Item label="저자">{selectedBook.author}</Descriptions.Item>
                                <Descriptions.Item label="출판사">{selectedBook.publisher}</Descriptions.Item>
                                <Descriptions.Item label="카테고리">{selectedBook.category}</Descriptions.Item>
                                <Descriptions.Item label="설명">{selectedBook.description}</Descriptions.Item>
                                <Descriptions.Item label="방문자 수 (선택 기간)">{selectedBook.visits?.toLocaleString()}</Descriptions.Item>
                                {/* Add more fields as needed from BookManagement */}
                            </Descriptions>
                        </Col>
                    </Row>
                )}
            </Modal>

        </Space>
    );
};

export default VisitStatistics; 