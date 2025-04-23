import React, { useState, useMemo } from 'react';
import {
    Table,
    Tag,
    Space,
    Typography,
    message,
    Input,
    Select,
    DatePicker,
    Button,
    Tooltip,
    Modal,
    Popconfirm,
    Divider,
} from 'antd';
import {
    CheckCircleOutlined, // 성공
    CloseCircleOutlined, // 실패
    ClockCircleOutlined, // 예약됨
    StopOutlined, // 취소됨
    EyeOutlined, // 상세 보기
    SearchOutlined,
    FilterOutlined,
    MailOutlined,
    MessageOutlined,
    BellOutlined,
    DeleteOutlined, // 예약 취소 (삭제 개념)
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph, Link } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// --- Sample Data ---
const initialHistory = [
    { key: 'h1', id: 'N20240730-001', title: '7월 신간 알림', channel: 'push', targetType: 'group', targetValue: 'G003', status: 'sent', dispatchTime: '2024-07-30 10:00:00', successCount: 315, failureCount: 5 },
    { key: 'h2', id: 'N20240729-003', title: '클린 코드 (개정판) 출간!', channel: 'email', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-07-29 14:30:00', successCount: 12530, failureCount: 120 },
    { key: 'h3', id: 'N20240728-001', title: 'React Hooks 심층 분석 리뷰 이벤트', channel: 'push', targetType: 'individual', targetValue: 'user001', status: 'failed', dispatchTime: '2024-07-28 11:00:00', successCount: 0, failureCount: 1, failureReason: 'Invalid device token' },
    { key: 'h4', id: 'N20240801-001', title: '8월 특별 할인 쿠폰', channel: 'sms', targetType: 'group', targetValue: 'G001', status: 'scheduled', dispatchTime: '2024-08-01 09:00:00', successCount: 0, failureCount: 0 },
    { key: 'h5', id: 'N20240725-002', title: '서비스 점검 안내 (취소됨)', channel: 'email', targetType: 'all', targetValue: null, status: 'cancelled', dispatchTime: '2024-07-25 18:00:00', successCount: 0, failureCount: 0 },
];

// --- Helper Functions ---
const getChannelTag = (channel) => {
    switch (channel?.toLowerCase()) {
        case 'email': return <Tag icon={<MailOutlined />} color="blue">이메일</Tag>;
        case 'sms': return <Tag icon={<MessageOutlined />} color="green">SMS</Tag>;
        case 'push': return <Tag icon={<BellOutlined />} color="purple">앱 푸시</Tag>;
        default: return <Tag>{channel || '-'}</Tag>;
    }
};

const getStatusTag = (status) => {
    switch (status) {
        case 'sent': return <Tag icon={<CheckCircleOutlined />} color="success">발송완료</Tag>;
        case 'failed': return <Tag icon={<CloseCircleOutlined />} color="error">발송실패</Tag>;
        case 'scheduled': return <Tag icon={<ClockCircleOutlined />} color="processing">예약됨</Tag>;
        case 'cancelled': return <Tag icon={<StopOutlined />} color="default">취소됨</Tag>;
        default: return <Tag>{status}</Tag>;
    }
};

const formatTarget = (targetType, targetValue) => {
    if (targetType === 'all') return '전체 사용자';
    if (targetType === 'group') return `그룹 (${targetValue || '-'})`; // Fetch group name later
    if (targetType === 'individual') return `개별 (${targetValue || '-'})`;
    return targetValue || '-';
};

// --- Component ---
const NotificationHistory = () => {
    const [history, setHistory] = useState(initialHistory);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ channel: null, status: null, dateRange: null });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

    // --- Search & Filter ---
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value === 'all' ? null : value }));
    };

    const handleDateChange = (dates) => {
        setFilters(prev => ({ ...prev, dateRange: dates }));
    };

    const filteredHistory = useMemo(() => {
        return history.filter(item => {
            const matchesSearch = searchText
                ? item.title.toLowerCase().includes(searchText)
                : true;
            const matchesChannel = filters.channel ? item.channel === filters.channel : true;
            const matchesStatus = filters.status ? item.status === filters.status : true;
            const matchesDate = filters.dateRange
                ? moment(item.dispatchTime).isBetween(filters.dateRange[0], filters.dateRange[1], 'day', '[]')
                : true;
            return matchesSearch && matchesChannel && matchesStatus && matchesDate;
        });
    }, [history, searchText, filters]);

    // --- Actions ---
    const showDetailModal = (item) => {
        setSelectedHistoryItem(item);
        setIsDetailModalOpen(true);
    };

    const handleDetailModalCancel = () => {
        setIsDetailModalOpen(false);
        setSelectedHistoryItem(null);
    };

    const handleCancelScheduled = (key) => {
        setHistory(prev =>
            prev.map(item => item.key === key ? { ...item, status: 'cancelled' } : item)
        );
        message.success('예약된 알림 발송이 취소되었습니다.');
        // TODO: API Call to cancel scheduled notification
        console.log(`Cancelled scheduled notification key: ${key}`);
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: '발송 ID', dataIndex: 'id', key: 'id', width: 150, sorter: (a, b) => a.id.localeCompare(b.id) },
        { title: '알림 제목', dataIndex: 'title', key: 'title', ellipsis: true },
        {
            title: '채널', dataIndex: 'channel', key: 'channel', width: 120, align: 'center',
            render: getChannelTag,
            filters: [
                { text: '이메일', value: 'email' },
                { text: 'SMS', value: 'sms' },
                { text: '앱 푸시', value: 'push' },
            ],
            onFilter: (value, record) => record.channel === value,
        },
        {
            title: '발송 대상', key: 'target', width: 180,
            render: (_, record) => formatTarget(record.targetType, record.targetValue)
        },
        {
            title: '발송(예약) 시간', dataIndex: 'dispatchTime', key: 'dispatchTime', width: 170,
            sorter: (a, b) => moment(a.dispatchTime).unix() - moment(b.dispatchTime).unix(),
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
            defaultSortOrder: 'descend'
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 120, align: 'center',
            render: (status, record) => (
                record.status === 'failed' && record.failureReason
                ? <Tooltip title={`실패사유: ${record.failureReason}`}>{getStatusTag(status)}</Tooltip>
                : getStatusTag(status)
            ),
            filters: [
                { text: '발송완료', value: 'sent' },
                { text: '발송실패', value: 'failed' },
                { text: '예약됨', value: 'scheduled' },
                { text: '취소됨', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
             title: '결과 (성공/실패)', key: 'result', width: 150, align: 'center',
             render: (_, record) => (
                 record.status === 'sent' || record.status === 'failed' ? (
                     <Space split={<Divider type="vertical" />}>
                         <Text type="success">{record.successCount?.toLocaleString() || 0}</Text>
                         <Text type="danger">{record.failureCount?.toLocaleString() || 0}</Text>
                     </Space>
                 ) : (
                     <Text type="secondary">-</Text>
                 )
             )
        },
        {
            title: '관리', key: 'action', width: 100, align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="상세 보기">
                        <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} size="small" />
                    </Tooltip>
                    {record.status === 'scheduled' && (
                         <Popconfirm
                            title="이 예약 발송을 취소하시겠습니까?"
                            onConfirm={() => handleCancelScheduled(record.key)}
                            okText="예약 취소"
                            cancelText="닫기"
                        >
                            <Tooltip title="예약 취소">
                                <Button icon={<DeleteOutlined />} danger size="small" />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>알림 발송 내역</Title>
            <Text type="secondary">발송되었거나 예약된 알림 목록과 결과를 확인합니다.</Text>

            {/* Search and Filter Controls */}
            <Space wrap style={{ marginBottom: 16 }}>
                 <Search
                    placeholder="알림 제목 검색"
                    allowClear
                    enterButton={<><SearchOutlined /> 검색</>}
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                 />
                <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={(value) => handleFilterChange('channel', value)}
                    aria-label="채널 필터"
                >
                    <Option value="all">전체 채널</Option>
                    <Option value="push">앱 푸시</Option>
                    <Option value="email">이메일</Option>
                    <Option value="sms">SMS</Option>
                </Select>
                <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={(value) => handleFilterChange('status', value)}
                    aria-label="상태 필터"
                >
                    <Option value="all">전체 상태</Option>
                    <Option value="sent">발송완료</Option>
                    <Option value="failed">발송실패</Option>
                    <Option value="scheduled">예약됨</Option>
                    <Option value="cancelled">취소됨</Option>
                </Select>
                <RangePicker onChange={handleDateChange} placeholder={['시작일', '종료일']} />
            </Space>

            {/* History Table */}
            <Table
                columns={columns}
                dataSource={filteredHistory}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 1200 }}
            />

            {/* Detail Modal */}
            <Modal
                title="알림 발송 상세 정보"
                open={isDetailModalOpen}
                onCancel={handleDetailModalCancel}
                footer={[
                    <Button key="close" onClick={handleDetailModalCancel}>
                        닫기
                    </Button>,
                ]}
                width={600}
            >
                {selectedHistoryItem && (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Paragraph><strong>발송 ID:</strong> {selectedHistoryItem.id}</Paragraph>
                        <Paragraph><strong>채널:</strong> {getChannelTag(selectedHistoryItem.channel)}</Paragraph>
                        <Paragraph><strong>대상:</strong> {formatTarget(selectedHistoryItem.targetType, selectedHistoryItem.targetValue)}</Paragraph>
                        <Paragraph><strong>발송(예약) 시간:</strong> {moment(selectedHistoryItem.dispatchTime).format('YYYY-MM-DD HH:mm:ss')}</Paragraph>
                        <Paragraph><strong>상태:</strong> {getStatusTag(selectedHistoryItem.status)}</Paragraph>
                        {(selectedHistoryItem.status === 'sent' || selectedHistoryItem.status === 'failed') && (
                            <Paragraph>
                                <strong>결과:</strong> 성공 {selectedHistoryItem.successCount?.toLocaleString() || 0} / 실패 {selectedHistoryItem.failureCount?.toLocaleString() || 0}
                                {selectedHistoryItem.status === 'failed' && selectedHistoryItem.failureReason && <><br/><Text type="danger">실패사유: {selectedHistoryItem.failureReason}</Text></>}
                            </Paragraph>
                        )}
                        <Divider />
                        <Paragraph><strong>제목:</strong> {selectedHistoryItem.title}</Paragraph>
                        <Paragraph><strong>내용:</strong></Paragraph>
                        <Paragraph style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                            {/* Fetch full content if needed, for now assume it's available */}
                            {`[${selectedHistoryItem.title}] 알림 내용입니다... (상세 내용 로드 필요)`}
                        </Paragraph>
                    </Space>
                )}
            </Modal>
        </Space>
    );
};

export default NotificationHistory; 