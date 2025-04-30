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
    Descriptions,
    Spin,
    Row,
    Col,
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
    UserOutlined, // 사용자 아이콘
    LoadingOutlined, // 로딩 아이콘
    DownloadOutlined, // 다운로드 아이콘 추가
    ReloadOutlined, // 재발송 아이콘 추가
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph, Link } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// --- Sample Data ---
const initialHistory = [
    {
        key: 'h1', id: 'N20240730-001', title: '7월 신간 알림', channel: 'push', targetType: 'group', targetValue: 'G003', status: 'sent', dispatchTime: '2024-07-30 10:00:00', successCount: 315, failureCount: 5, adminName: '김관리',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 320,
        templateName: '[신간] 독서의 계절, 7월의 새로운 책들을 만나보세요! 지금 바로 확인하기 >',
        linkUrl: 'https://example.com/books/new/july'
    },
    {
        key: 'h2', id: 'N20240729-003', title: '클린 코드 (개정판) 출간!', channel: 'email', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-07-29 14:30:00', successCount: 12530, failureCount: 120, adminName: '이운영',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 12650,
        templateName: '더욱 강력해진 클린 코드 개정판 출간! 지금 구매 시 10% 할인 + 특별 굿즈 증정!',
        linkUrl: 'https://example.com/books/cleancode-revised'
    },
    {
        key: 'h3', id: 'N20240728-001', title: 'React Hooks 심층 분석 리뷰 이벤트', channel: 'push', targetType: 'individual', targetValue: 'user001', status: 'failed', dispatchTime: '2024-07-28 11:00:00', successCount: 0, failureCount: 1, failureReason: 'Invalid device token', adminName: '박테스트',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 1,
        templateName: 'React Hooks 심층 분석 도서 리뷰 작성하고 커피 쿠폰 받아가세요! 참여 기간: ~7/31',
        linkUrl: 'https://example.com/events/react-hooks-review'
    },
    {
        key: 'h4', id: 'N20240801-001', title: '8월 특별 할인 쿠폰', channel: 'sms', targetType: 'group', targetValue: 'G001', status: 'scheduled', dispatchTime: '2024-08-01 09:00:00', successCount: 0, failureCount: 0, adminName: '김관리',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 50,
        templateName: '무더운 8월을 시원하게! 전 도서 15% 할인 쿠폰 도착! (~8/15)',
        linkUrl: null
    },
    {
        key: 'h5', id: 'N20240725-002', title: '서비스 점검 안내 (취소됨)', channel: 'email', targetType: 'all', targetValue: null, status: 'cancelled', dispatchTime: '2024-07-25 18:00:00', successCount: 0, failureCount: 0, adminName: '시스템',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 0,
        templateName: '(취소됨) [점검] 더 나은 서비스를 위한 시스템 점검 안내 (7/26 02:00 ~ 04:00)',
        linkUrl: null
    },
    {
        key: 'h6', id: 'E20240731-001', title: '긴급 서버 점검 안내', channel: 'push', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-07-31 08:00:00', successCount: 15000, failureCount: 0, adminName: '시스템',
        noticeType: 'emergency',
        level: 'critical',
        recipients: null,
        recipientCount: 15000,
        templateName: '[긴급] 서비스 안정화를 위한 긴급 서버 점검을 진행합니다. (08:00 ~ 08:30)',
        linkUrl: null
    },
    {
        key: 'h7', id: 'E20240802-001', title: '로그인 지연 현상 안내', channel: 'push', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-08-02 11:00:00', successCount: 14800, failureCount: 200, adminName: '김모니터',
        noticeType: 'emergency',
        level: 'warning',
        recipients: null,
        recipientCount: 15000,
        templateName: '[안내] 현재 간헐적으로 로그인이 지연되는 현상이 있어 확인 중입니다. 이용에 불편을 드려 죄송합니다.',
        linkUrl: null
    },
    {
        key: 'h8', id: 'E20240803-001', title: '결제 시스템 임시 점검 완료', channel: 'email', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-08-03 16:30:00', successCount: 15100, failureCount: 0, adminName: '시스템',
        noticeType: 'emergency',
        level: 'info',
        recipients: null,
        recipientCount: 15100,
        templateName: '[정보] 결제 시스템 임시 점검이 완료되어 현재 정상 이용 가능합니다. 감사합니다.',
        linkUrl: null
    },
    {
        key: 'h9', id: 'E20240805-001', title: '예정된 시스템 업데이트 사전 공지', channel: 'push', targetType: 'all', targetValue: null, status: 'scheduled', dispatchTime: '2024-08-05 00:00:00', successCount: 0, failureCount: 0, adminName: '박공지',
        noticeType: 'emergency',
        level: 'info',
        recipients: null,
        recipientCount: 15200,
        templateName: '[사전 공지] 8월 5일 02시부터 03시까지 시스템 업데이트가 진행될 예정입니다. 서비스 이용에 참고 부탁드립니다.',
        linkUrl: null
    },
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

// --- Recipient Status Tag (Potentially keep if used elsewhere, otherwise remove) ---
// const getRecipientStatusTag = (status, reason) => {
//     switch (status) {
//         case 'sent': return <Tag icon={<CheckCircleOutlined />} color="success">성공</Tag>;
//         case 'failed': return <Tooltip title={reason || '실패'}><Tag icon={<CloseCircleOutlined />} color="error">실패</Tag></Tooltip>;
//         case 'pending': return <Tag icon={<LoadingOutlined />} color="processing">처리중</Tag>; // 예시 상태
//         default: return <Tag>알수없음</Tag>; // 예약 상태 등
//     }
// };

// --- Component ---
const DispatchHistory = () => {
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

    // --- Download Handlers (Simulation) ---
    const handleDownloadFailures = (historyId) => {
        message.loading({ content: `실패 목록 다운로드 준비 중 (ID: ${historyId})...`, key: 'download-failure' });
        // TODO: API call to fetch and download failure list as CSV
        console.log(`Requesting failure list CSV for history ID: ${historyId}`);
        setTimeout(() => {
            message.success({ content: '실패 목록 다운로드가 시작됩니다. (구현 필요)', key: 'download-failure', duration: 3 });
        }, 1500);
    };

    const handleDownloadSuccesses = (historyId) => {
        message.loading({ content: `성공 목록 다운로드 준비 중 (ID: ${historyId})...`, key: 'download-success' });
        // TODO: API call to fetch and download success list as CSV
        console.log(`Requesting success list CSV for history ID: ${historyId}`);
        setTimeout(() => {
            message.success({ content: '성공 목록 다운로드가 시작됩니다. (구현 필요)', key: 'download-success', duration: 3 });
        }, 1500);
    };

    // --- Resend Failures Handler (Simulation & State Update) ---
    const handleResendFailures = (originalItem) => {
        if (!originalItem) return;

        const historyId = originalItem.id;
        message.loading({ content: `실패 건 재발송 요청 중 (ID: ${historyId})...`, key: 'resend' });

        // TODO: API call to trigger resend for failures
        console.log(`Requesting resend for failures of history ID: ${historyId}`);

        setTimeout(() => { // Simulate API response
            message.success({ content: '실패 건에 대한 재발송 요청이 완료되었습니다.', key: 'resend', duration: 3 });

            // --- Simulate adding a new history entry for the resend ---
            const now = moment();
            const newResendEntry = {
                key: `resend-${originalItem.key}-${now.valueOf()}`,
                id: `R-${originalItem.id.substring(2)}`, // Example new ID convention
                title: `${originalItem.title} (재발송)`,
                channel: originalItem.channel,
                templateName: originalItem.templateName,
                linkUrl: originalItem.linkUrl,
                targetType: originalItem.targetType, // Resending to the same target group/individual implicitly
                targetValue: originalItem.targetValue,
                adminName: originalItem.adminName, // Or the current logged-in admin
                status: 'scheduled', // Start as scheduled or processing
                dispatchTime: now.format('YYYY-MM-DD HH:mm:ss'),
                successCount: 0,
                failureCount: 0,
                failureReason: null,
                recipientCount: originalItem.failureCount, // Target count is the number of failures
                recipients: null, // Recipient details would be populated upon actual send
            };

            setHistory(prevHistory => [newResendEntry, ...prevHistory]); // Add to the top of the list
            // --- End of simulation ---

            handleDetailModalCancel(); // Close the modal after initiating resend

        }, 2000);
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: '발송 ID', dataIndex: 'id', key: 'id', width: 150, sorter: (a, b) => a.id.localeCompare(b.id) },
        { title: '알림 제목', dataIndex: 'title', key: 'title', width: 250, ellipsis: true },
        {
            title: '알림 종류', dataIndex: 'noticeType', key: 'noticeType', width: 120, align: 'center',
            render: (type, record) => {
                if (type === 'emergency') {
                    // Use a consistent color for all emergency notices
                    return <Tag color="volcano">긴급 공지</Tag>;
                } else {
                    return '일반 알림';
                }
            },
        },
        { title: '알림내용', dataIndex: 'templateName', key: 'templateName', width: 150, ellipsis: true, render: (text) => text || '-' },
        {
            title: '채널', dataIndex: 'channel', key: 'channel', width: 100, align: 'center',
            render: getChannelTag,
            filters: [
                { text: '이메일', value: 'email' },
                { text: 'SMS', value: 'sms' },
                { text: '앱 푸시', value: 'push' },
            ],
            onFilter: (value, record) => record.channel === value,
        },
        {
            title: '발송 대상', key: 'target', width: 150,
            render: (_, record) => formatTarget(record.targetType, record.targetValue)
        },
        {
            title: '발송(예약) 시간', dataIndex: 'dispatchTime', key: 'dispatchTime', width: 160,
            sorter: (a, b) => moment(a.dispatchTime).unix() - moment(b.dispatchTime).unix(),
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
            defaultSortOrder: 'descend'
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 110, align: 'center',
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
             title: '결과 (성공/실패)', key: 'result', width: 140, align: 'center',
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
            title: '관리자', dataIndex: 'adminName', key: 'adminName', width: 100, align: 'center'
        },
        {
            title: '관리', key: 'action', width: 100, align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="상세 보기">
                        <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} size="small" />
                    </Tooltip>
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
                scroll={{ x: 1500 }}
                bordered
                size="small"
            />

            {/* Detail Modal - Recipient section removed */}
            <Modal
                title={`발송 내역 상세 (ID: ${selectedHistoryItem?.id})`}
                open={isDetailModalOpen}
                onCancel={handleDetailModalCancel}
                footer={[
                    <Button key="back" onClick={handleDetailModalCancel}>
                        닫기
                    </Button>,
                ]}
                width={800} // Width might be adjustable now
            >
                {selectedHistoryItem && (
                    <>
                        <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="알림 제목" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.title}
                            </Descriptions.Item>
                            <Descriptions.Item label="알림 종류" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.noticeType === 'emergency'
                                    ? <Tag color="volcano">긴급 공지</Tag>
                                    : '일반 알림'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="알림내용" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.templateName || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="첨부 링크" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.linkUrl ? (
                                    <Link href={selectedHistoryItem.linkUrl} target="_blank" rel="noopener noreferrer">
                                        {selectedHistoryItem.linkUrl}
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="관리자" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.adminName || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="채널" labelStyle={{ minWidth: '120px' }}>
                                {getChannelTag(selectedHistoryItem.channel)}
                            </Descriptions.Item>
                            <Descriptions.Item label="발송 대상" labelStyle={{ minWidth: '120px' }}>
                                {formatTarget(selectedHistoryItem.targetType, selectedHistoryItem.targetValue)} ({selectedHistoryItem.recipientCount?.toLocaleString() || 0}명)
                            </Descriptions.Item>
                            <Descriptions.Item label="발송(예약) 시간" labelStyle={{ minWidth: '120px' }}>
                                {moment(selectedHistoryItem.dispatchTime).format('YYYY-MM-DD HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="상태" labelStyle={{ minWidth: '120px' }}>
                                {getStatusTag(selectedHistoryItem.status)}
                            </Descriptions.Item>
                            {(selectedHistoryItem.status === 'sent' || selectedHistoryItem.status === 'failed') && (
                                <Descriptions.Item label="결과 요약" labelStyle={{ minWidth: '120px' }}>
                                    {/* Use Row/Col for button alignment */}
                                    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                                        <Col>
                                            <span>
                                                성공 {selectedHistoryItem.successCount?.toLocaleString() || 0}건 /
                                                실패 {selectedHistoryItem.failureCount?.toLocaleString() || 0}건
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row justify="space-between" align="middle" style={{ width: '100%', marginTop: '8px' }}>
                                        <Col>
                                            {/* Success Button */}
                                            {selectedHistoryItem.successCount > 0 && (
                                                <Button
                                                    icon={<DownloadOutlined />}
                                                    size="small"
                                                    onClick={() => handleDownloadSuccesses(selectedHistoryItem.id)}
                                                >
                                                    성공 목록 (CSV)
                                                </Button>
                                            )}
                                        </Col>
                                        <Col>
                                            {/* Failure Buttons grouped */}
                                            <Space wrap size="small">
                                                {selectedHistoryItem.failureCount > 0 && (
                                                    <Button
                                                        icon={<DownloadOutlined />}
                                                        size="small"
                                                        onClick={() => handleDownloadFailures(selectedHistoryItem.id)}
                                                        
                                                    >
                                                        실패 목록 (CSV)
                                                    </Button>
                                                )}
                                                {/* Resend Button for Failures */}
                                                {selectedHistoryItem.failureCount > 0 && (
                                                    <Popconfirm
                                                        title="실패한 사용자에게 재발송하시겠습니까?"
                                                        onConfirm={() => handleResendFailures(selectedHistoryItem)}
                                                        okText="재발송"
                                                        cancelText="취소"
                                                    >
                                                        <Button
                                                            icon={<ReloadOutlined />}
                                                            size="small"
                                                        >
                                                            실패 건 재발송
                                                        </Button>
                                                    </Popconfirm>
                                                )}
                                            </Space>
                                        </Col>
                                    </Row>
                                </Descriptions.Item>
                            )}
                            {selectedHistoryItem.status === 'failed' && selectedHistoryItem.failureReason && (
                                <Descriptions.Item label="실패 사유 (대표)" labelStyle={{ minWidth: '120px' }}>
                                    {selectedHistoryItem.failureReason}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </>
                 )}
             </Modal>
        </Space>
    );
};

export default DispatchHistory; 