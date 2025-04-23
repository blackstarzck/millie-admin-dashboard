import React, { useState, useMemo } from 'react';
import {
    Table,
    DatePicker,
    Select,
    Space,
    Typography,
    Card,
    Row, Col,
    Statistic,
} from 'antd';
import moment from 'moment';
// import { Line } from '@ant-design/plots'; // Ant Design Charts 사용 예시 (설치 필요)

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// --- Sample Data ---
// 실제로는 API를 통해 조회 기간, 팝업 ID 등에 따라 필터링된 데이터를 가져와야 합니다.
const samplePopups = [
    { key: 'pop1', id: 'P001', name: '여름맞이 특별 이벤트 팝업' },
    { key: 'pop2', id: 'P002', name: '신규 기능 안내 (템플릿)' },
    { key: 'pop3', id: 'P003', name: '마케팅 수신 동의 팝업' },
    { key: 'pop4', id: 'P004', name: '서버 점검 안내' },
];

// 날짜별, 팝업별 통계 데이터 예시
const sampleAnalysisData = [
    { date: '2024-07-20', popupId: 'P001', impressions: 1500, clicks: 35 },
    { date: '2024-07-21', popupId: 'P001', impressions: 1800, clicks: 42 },
    { date: '2024-07-22', popupId: 'P001', impressions: 1650, clicks: 38 },
    { date: '2024-07-25', popupId: 'P002', impressions: 2000, clicks: 80 },
    { date: '2024-07-26', popupId: 'P002', impressions: 2100, clicks: 95 },
    { date: '2024-07-20', popupId: 'P003', impressions: 500, clicks: 5 }, // 비활성 팝업도 데이터는 있을 수 있음
    { date: '2024-07-21', popupId: 'P003', impressions: 550, clicks: 7 },
];

// --- Component ---
const PopupAnalysis = () => {
    const [dateRange, setDateRange] = useState([
        moment().subtract(7, 'days'),
        moment(),
    ]);
    const [selectedPopupId, setSelectedPopupId] = useState('all');

    // --- Data Filtering & Processing ---
    const filteredData = useMemo(() => {
        const [startDate, endDate] = dateRange || [null, null];
        return sampleAnalysisData.filter(item => {
            const itemDate = moment(item.date);
            const isAfterStart = startDate ? itemDate.isSameOrAfter(startDate, 'day') : true;
            const isBeforeEnd = endDate ? itemDate.isSameOrBefore(endDate, 'day') : true;
            const matchesPopup = selectedPopupId === 'all' || item.popupId === selectedPopupId;
            return isAfterStart && isBeforeEnd && matchesPopup;
        });
    }, [dateRange, selectedPopupId]);

    // 집계 데이터 계산 (선택된 기간 및 팝업 기준)
    const aggregatedStats = useMemo(() => {
        const stats = filteredData.reduce((acc, item) => {
            const popupKey = item.popupId;
            if (!acc[popupKey]) {
                acc[popupKey] = {
                    popupId: item.popupId,
                    popupName: samplePopups.find(p => p.id === item.popupId)?.name || item.popupId,
                    totalImpressions: 0,
                    totalClicks: 0,
                };
            }
            acc[popupKey].totalImpressions += item.impressions;
            acc[popupKey].totalClicks += item.clicks;
            return acc;
        }, {});

        return Object.values(stats).map(item => ({
            ...item,
            ctr: item.totalImpressions > 0 ? ((item.totalClicks / item.totalImpressions) * 100).toFixed(2) + '%' : '0.00%',
        }));
    }, [filteredData]);

    // 전체 요약 통계
    const summaryStats = useMemo(() => {
      const totalImpressions = aggregatedStats.reduce((sum, item) => sum + item.totalImpressions, 0);
      const totalClicks = aggregatedStats.reduce((sum, item) => sum + item.totalClicks, 0);
      const averageCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
      return { totalImpressions, totalClicks, averageCtr }; 
    }, [aggregatedStats]);

    // --- Chart Data Preparation (Ant Design Charts 예시) ---
    /*
    const chartData = useMemo(() => {
        // 날짜별 집계 또는 팝업별 시계열 데이터 가공 로직
        const dailySummary = filteredData.reduce((acc, item) => {
            const date = item.date;
            if (!acc[date]) {
                acc[date] = { date, impressions: 0, clicks: 0 };
            }
            acc[date].impressions += item.impressions;
            acc[date].clicks += item.clicks;
            return acc;
        }, {});
        return Object.values(dailySummary).sort((a, b) => moment(a.date).unix() - moment(b.date).unix());
    }, [filteredData]);

    const lineConfig = {
        data: chartData,
        padding: 'auto',
        xField: 'date',
        yField: 'impressions', // 또는 'clicks', 'ctr'
        // seriesField: 'popupName', // 여러 팝업 비교 시
        xAxis: { tickCount: 5 },
        slider: { start: 0.1, end: 0.9 },
        tooltip: { showMarkers: false },
        point: { size: 3, shape: 'dot' },
        legend: { position: 'top-right' },
    };
    */

    // --- Table Columns Definition ---
    const columns = [
        { title: '팝업 ID', dataIndex: 'popupId', key: 'popupId', width: 100 },
        { title: '팝업 이름', dataIndex: 'popupName', key: 'popupName', ellipsis: true },
        {
            title: '총 노출 수', dataIndex: 'totalImpressions', key: 'totalImpressions', align: 'right',
            render: (text) => text.toLocaleString(),
            sorter: (a, b) => a.totalImpressions - b.totalImpressions,
        },
        {
            title: '총 클릭 수', dataIndex: 'totalClicks', key: 'totalClicks', align: 'right',
            render: (text) => text.toLocaleString(),
            sorter: (a, b) => a.totalClicks - b.totalClicks,
        },
        {
            title: '클릭률 (CTR)', dataIndex: 'ctr', key: 'ctr', align: 'right',
            sorter: (a, b) => parseFloat(a.ctr) - parseFloat(b.ctr),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>팝업 통계 분석</Title>
            <Text type="secondary">기간별, 팝업별 노출 수, 클릭 수, 클릭률(CTR) 통계를 확인합니다.</Text>

            {/* Filter Controls */}
            <Card size="small">
                <Space wrap>
                    <Text strong>조회 기간:</Text>
                    <RangePicker
                        value={dateRange}
                        onChange={setDateRange}
                        allowClear={false}
                        ranges={{
                            '최근 7일': [moment().subtract(7, 'days'), moment()],
                            '이번 달': [moment().startOf('month'), moment().endOf('month')],
                            '지난 달': [
                                moment().subtract(1, 'month').startOf('month'),
                                moment().subtract(1, 'month').endOf('month'),
                            ],
                        }}
                    />
                    <Text strong style={{ marginLeft: 16 }}>팝업 선택:</Text>
                    <Select
                        value={selectedPopupId}
                        onChange={setSelectedPopupId}
                        style={{ width: 250 }}
                    >
                        <Option value="all">전체 팝업</Option>
                        {samplePopups.map(popup => (
                            <Option key={popup.key} value={popup.id}>{popup.name} ({popup.id})</Option>
                        ))}
                    </Select>
                </Space>
            </Card>

            {/* Summary Statistics */}
            <Row gutter={16}>
                <Col span={8}>
                    <Card size="small">
                        <Statistic title="총 노출 수 (선택 기간)" value={summaryStats.totalImpressions} valueStyle={{ color: '#3f8600' }} suffix="회" />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small">
                        <Statistic title="총 클릭 수 (선택 기간)" value={summaryStats.totalClicks} valueStyle={{ color: '#cf1322' }} suffix="회" />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card size="small">
                        <Statistic title="평균 CTR (선택 기간)" value={summaryStats.averageCtr} precision={2} valueStyle={{ color: '#1890ff' }} suffix="%" />
                    </Card>
                </Col>
            </Row>

            {/* Chart Section (Placeholder) */}
            {/*
            <Card title="기간별 추이" size="small">
                {chartData && chartData.length > 0 ? (
                     <Line {...lineConfig} />
                 ) : (
                     <Text type="secondary">선택된 기간 및 팝업에 대한 데이터가 없습니다.</Text>
                 )}
            </Card>
            */}
            <Text type="secondary" style={{textAlign: 'center', margin: '2rem 0'}}>(차트 라이브러리 연동 시 여기에 기간별/팝업별 통계 추이 시각화 표시)</Text>

            {/* Detailed Table */}
            <Title level={4} style={{ marginTop: 16 }}>팝업별 상세 통계 (선택 기간)</Title>
            <Table
                columns={columns}
                dataSource={aggregatedStats}
                pagination={{ pageSize: 10 }}
                rowKey="popupId"
                size="middle"
                scroll={{ x: 600 }}
            />
        </Space>
    );
};

export default PopupAnalysis; 