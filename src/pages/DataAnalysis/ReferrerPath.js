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
    Tag,
    Progress, // For visualizing percentages
} from 'antd';
import {
    LinkOutlined, // Referrer Icon
    GlobalOutlined, // Direct visit icon
    SearchOutlined, // Search engine icon
    ShareAltOutlined, // Social media icon
} from '@ant-design/icons';
import moment from 'moment';
// import Chart from 'chart.js/auto'; // If using Chart.js

const { Title, Text, Link } = Typography;
const { RangePicker } = DatePicker;

// Chart Component Placeholder (Similar to Dashboard)
const ChartComponent = ({ chartId, type, data, options }) => {
    const chartRef = useRef(null);
    // Add Chart.js logic here if needed later
    useEffect(() => {
        if (chartRef.current) {
            console.log(`Chart placeholder initialized for ${chartId}`);
        }
    }, [chartId, type, data, options]);

    return (
        <div style={{ height: '250px', position: 'relative', border: '1px dashed #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text type="secondary">( {data?.datasets?.[0]?.label || '유입 경로 분포'} 차트 영역 )</Text>
            <canvas ref={chartRef} id={chartId} style={{ display: 'none' }} />
        </div>
    );
};

// --- Sample Data ---
const sampleReferrerData = [
    { key: '1', type: 'search', domain: 'google.com', url: 'https://www.google.com/', visits: 3500, percentage: 35 },
    { key: '2', type: 'direct', domain: '(직접 유입)', url: '-', visits: 2500, percentage: 25 },
    { key: '3', type: 'social', domain: 'facebook.com', url: 'https://www.facebook.com/', visits: 1800, percentage: 18 },
    { key: '4', type: 'search', domain: 'naver.com', url: 'https://www.naver.com/', visits: 1200, percentage: 12 },
    { key: '5', type: 'referrer', domain: 'exampleblog.com', url: 'https://exampleblog.com/review', visits: 500, percentage: 5 },
    { key: '6', type: 'social', domain: 'instagram.com', url: 'https://www.instagram.com/', visits: 500, percentage: 5 },
];

const sampleReferrerChartData = {
    labels: ['검색', '직접 유입', '소셜', '기타'], // Simplified categories for chart
    datasets: [{
        label: '유입 경로 분포',
        data: [47, 25, 23, 5], // Sum percentages from sampleReferrerData (35+12, 25, 18+5, 5)
        backgroundColor: ['#1890ff', '#52c41a', '#ffadd2', '#bfbfbf'],
        borderWidth: 0,
    }]
};

const getReferrerIcon = (type) => {
    switch(type) {
        case 'search': return <SearchOutlined style={{ color: '#1890ff' }}/>;
        case 'direct': return <GlobalOutlined style={{ color: '#52c41a' }}/>;
        case 'social': return <ShareAltOutlined style={{ color: '#ffadd2' }}/>;
        case 'referrer':
        default: return <LinkOutlined style={{ color: '#faad14' }}/>;
    }
};

// --- Component ---
const ReferrerPath = () => {
    const [dateRange, setDateRange] = useState([moment().subtract(6, 'days'), moment()]);
    const [tableData, setTableData] = useState(sampleReferrerData);
    const [chartData, setChartData] = useState(sampleReferrerChartData);

    // TODO: Fetch data based on dateRange
    useEffect(() => {
        console.log("Fetching referrer data for range:", dateRange);
        // API Call
        // setTableData(fetchedTableData);
        // setChartData(fetchedChartData);
    }, [dateRange]);

    const handleDateChange = (dates) => {
        if (dates) {
            setDateRange(dates);
        } else {
             setDateRange([moment().subtract(6, 'days'), moment()]);
         }
    };

    const columns = [
        {
            title: '유형',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (type) => getReferrerIcon(type),
            filters: [
                 { text: '검색', value: 'search' },
                 { text: '직접', value: 'direct' },
                 { text: '소셜', value: 'social' },
                 { text: '기타', value: 'referrer' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: '유입 경로 (도메인/URL)',
            dataIndex: 'domain',
            key: 'domain',
            render: (text, record) => (
                record.url && record.url !== '-' ? <Link href={record.url} target="_blank" rel="noopener noreferrer">{text}</Link> : text
            ),
            // sorter: (a, b) => a.domain.localeCompare(b.domain), // Sorting might be tricky
        },
        {
            title: '방문수',
            dataIndex: 'visits',
            key: 'visits',
            align: 'right',
            width: 150,
            sorter: (a, b) => a.visits - b.visits,
            render: (text) => text.toLocaleString(),
        },
        {
            title: '비율 (%)',
            dataIndex: 'percentage',
            key: 'percentage',
            align: 'right',
            width: 150,
            sorter: (a, b) => a.percentage - b.percentage,
            render: (text) => <Progress percent={text} size="small" />
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><LinkOutlined /> 유입 경로 분석</Title>

            {/* Filters */}
             <Card size="small">
                <Space wrap>
                    <Text>기간:</Text>
                    <RangePicker value={dateRange} onChange={handleDateChange} allowClear />
                    {/* <Button onClick={() => console.log("Refetch data")}>조회</Button> */}
                </Space>
            </Card>

             {/* Referrer Overview & Chart */}
            <Row gutter={[16, 16]}>
                 <Col xs={24} md={8}>
                    {/* Placeholder for key referrer stats */}
                     <Card title="주요 유입 경로">
                        <Space direction="vertical" style={{width: '100%'}}>
                            <Statistic title="검색 엔진" value={`${chartData.datasets[0].data[0]}%`} prefix={<SearchOutlined />} />
                             <Statistic title="직접 유입" value={`${chartData.datasets[0].data[1]}%`} prefix={<GlobalOutlined />} />
                             <Statistic title="소셜 미디어" value={`${chartData.datasets[0].data[2]}%`} prefix={<ShareAltOutlined />} />
                             {/* Add more stats if needed */}
                         </Space>
                     </Card>
                 </Col>
                 <Col xs={24} md={16}>
                    <Card title="유입 경로 분포">
                         <ChartComponent chartId="referrerChart" type="doughnut" data={chartData} options={{ responsive: true, maintainAspectRatio: false, cutout: '60%' }} />
                     </Card>
                 </Col>
             </Row>

             {/* Detailed Referrer Table */}
             <Card title="상세 유입 경로">
                 <Table
                    columns={columns}
                    dataSource={tableData}
                    size="small"
                    pagination={{ pageSize: 10 }}
                    bordered
                    rowKey="key"
                 />
            </Card>
        </Space>
    );
};

export default ReferrerPath; 