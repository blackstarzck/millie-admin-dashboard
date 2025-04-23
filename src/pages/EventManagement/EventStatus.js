import React, { useState, useEffect } from 'react';
import {
    Table,
    Tag,
    Button,
    Space,
    Typography,
    Card,
    Input,
    Select,
    DatePicker,
    message,
    Tooltip
} from 'antd';
import {
    CalendarOutlined,
    CheckCircleOutlined, // Ongoing
    ClockCircleOutlined, // Scheduled/Planned
    CloseCircleOutlined, // Finished/Cancelled
    EditOutlined,
    SearchOutlined,
    ReloadOutlined,
    PlayCircleOutlined, // Start event
    PauseCircleOutlined, // Pause/Finish event
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Sample Data
const initialEvents = [
    { key: '1', eventId: 'evt001', title: '여름맞이 특별 할인', startDate: '2024-07-01 00:00', endDate: '2024-07-31 23:59', status: 'active', target: '전체 사용자' },
    { key: '2', eventId: 'evt002', title: '신규 가입자 웰컴 이벤트', startDate: '2024-08-01 00:00', endDate: '2024-08-31 23:59', status: 'scheduled', target: '신규 가입자' },
    { key: '3', eventId: 'evt003', title: '친구 추천 이벤트', startDate: '2024-06-15 10:00', endDate: '2024-07-15 23:59', status: 'finished', target: '기존 사용자' },
    { key: '4', eventId: 'evt004', title: '설문 조사 참여 이벤트', startDate: '2024-07-10 00:00', endDate: '2024-07-20 23:59', status: 'cancelled', target: 'VIP 등급' },
    // ... more data
];

// Status Tag mapping
const statusMap = {
    active: { color: 'green', text: '진행 중', icon: <CheckCircleOutlined /> },
    scheduled: { color: 'blue', text: '예정', icon: <ClockCircleOutlined /> },
    planned: { color: 'cyan', text: '계획됨', icon: <ClockCircleOutlined /> }, // Alias for scheduled perhaps
    finished: { color: 'default', text: '종료', icon: <CloseCircleOutlined /> },
    cancelled: { color: 'red', text: '취소됨', icon: <CloseCircleOutlined /> },
};

const EventStatus = () => {
    const [events, setEvents] = useState(initialEvents);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});

    // Fetch data based on filters
    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = () => {
        setLoading(true);
        console.log("Fetching events with filters:", filters);
        // TODO: Replace with API call
        // Example: /api/events?status=...&search=...&startDate=...&endDate=...
        setTimeout(() => { // Simulate API delay
            let filteredData = initialEvents;
            if (filters.status) {
                filteredData = filteredData.filter(item => item.status === filters.status);
            }
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                filteredData = filteredData.filter(item =>
                    item.eventId.toLowerCase().includes(searchTerm) ||
                    item.title.toLowerCase().includes(searchTerm)
                );
            }
             if (filters.dateRange) {
                 const [start, end] = filters.dateRange;
                 // Adjust logic based on how you want to filter by date (start, end, or overlap)
                 filteredData = filteredData.filter(item => {
                     const itemStart = new Date(item.startDate);
                     const itemEnd = new Date(item.endDate);
                     // Example: Events active within the selected range
                     return itemStart <= end && itemEnd >= start;
                 });
             }
            setEvents(filteredData);
            setLoading(false);
        }, 500);
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const handleResetFilters = () => {
        setFilters({});
        // Refetch with empty filters - handled by useEffect
    };

    const handleChangeStatus = (eventId, newStatus) => {
        // TODO: Implement API call to change event status
        console.log(`Changing status of ${eventId} to ${newStatus}`);
        message.info(`'${eventId}' 이벤트 상태 변경 요청 중...`); // Placeholder
        // Simulate update
         setTimeout(() => {
             setEvents(prevEvents =>
                 prevEvents.map(evt => evt.eventId === eventId ? { ...evt, status: newStatus } : evt)
             );
             message.success(`'${eventId}' 이벤트 상태가 '${statusMap[newStatus]?.text || newStatus}'(으)로 변경되었습니다.`);
         }, 500);

    };

    const columns = [
        {
            title: '이벤트 ID',
            dataIndex: 'eventId',
            key: 'eventId',
            width: 120,
        },
        {
            title: '이벤트명',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: '시작일시',
            dataIndex: 'startDate',
            key: 'startDate',
            width: 160,
        },
        {
            title: '종료일시',
            dataIndex: 'endDate',
            key: 'endDate',
            width: 160,
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status) => {
                const statusInfo = statusMap[status] || { color: 'default', text: status, icon: null };
                return <Tag color={statusInfo.color} icon={statusInfo.icon}>{statusInfo.text}</Tag>;
            },
        },
        {
            title: '대상',
            dataIndex: 'target',
            key: 'target',
            width: 120,
            ellipsis: true,
        },
        {
            title: '관리',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    {record.status === 'scheduled' || record.status === 'planned' ? (
                        <Tooltip title="이벤트 시작">
                            <Button icon={<PlayCircleOutlined />} onClick={() => handleChangeStatus(record.eventId, 'active')} />
                        </Tooltip>
                    ) : record.status === 'active' ? (
                        <Tooltip title="이벤트 종료">
                            <Button icon={<PauseCircleOutlined />} onClick={() => handleChangeStatus(record.eventId, 'finished')} />
                        </Tooltip>
                    ) : null}
                     <Tooltip title="수정 (내용/기간 등)">
                        {/* Link to registration page or open modal */}
                         <Button icon={<EditOutlined />} onClick={() => message.info('수정 기능 구현 필요')} />
                     </Tooltip>
                     {record.status !== 'cancelled' && record.status !== 'finished' && (
                         <Tooltip title="이벤트 취소">
                            <Button danger icon={<CloseCircleOutlined />} onClick={() => handleChangeStatus(record.eventId, 'cancelled')} />
                         </Tooltip>
                     )}
                 </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><CalendarOutlined /> 이벤트 상태 관리</Title>
            <Text>등록된 이벤트의 진행 상태를 확인하고 관리합니다.</Text>

            <Card>
                <Space style={{ marginBottom: 16 }} wrap>
                    <Input.Search
                        placeholder="이벤트 ID 또는 이름 검색"
                        allowClear
                        onSearch={(value) => handleFilterChange('search', value)}
                         onChange={(e) => !e.target.value && handleFilterChange('search', '')} // Clear filter on empty input
                        style={{ width: 250 }}
                    />
                    <Select
                        placeholder="상태 필터"
                        allowClear
                        style={{ width: 120 }}
                        onChange={(value) => handleFilterChange('status', value)}
                         value={filters.status || undefined}
                    >
                        {Object.entries(statusMap).map(([key, { text }]) => (
                            <Option key={key} value={key}>{text}</Option>
                        ))}
                    </Select>
                     <RangePicker
                         onChange={(dates) => handleFilterChange('dateRange', dates)}
                         value={filters.dateRange || null}
                     />
                    <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>초기화</Button>
                    {/* <Button type="primary" icon={<SearchOutlined />} onClick={fetchData}>검색</Button> */}
                </Space>

                <Table
                    columns={columns}
                    dataSource={events}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1000 }}
                    bordered
                    size="small"
                    rowKey="key"
                />
            </Card>
        </Space>
    );
};

export default EventStatus; 