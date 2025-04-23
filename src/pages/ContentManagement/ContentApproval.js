import React, { useState, useMemo } from 'react';
import {
    Table,
    Button,
    Tag,
    Space,
    Typography,
    message,
    Popconfirm,
    Tooltip,
    Input,
    Select,
    DatePicker, // For filtering by request date
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    SearchOutlined,
    FilterOutlined,
    ClockCircleOutlined, // 승인대기 아이콘
    CheckSquareOutlined, // 승인 아이콘
    CloseSquareOutlined, // 반려 아이콘
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// --- Sample Data ---
const initialApprovals = [
    { key: '1', id: 1, contentType: '도서', title: 'React Hooks 심층 분석', requester: '김현수', requestDate: '2024-07-28', status: 'pending' }, // pending, approved, rejected
    { key: '2', id: 2, contentType: '오디오북', title: '성공하는 사람들의 7가지 습관 (오디오)', requester: '박지민', requestDate: '2024-07-27', status: 'pending' },
    { key: '3', id: 3, contentType: '이북', title: '미움받을 용기 (요약본)', requester: '최다희', requestDate: '2024-07-26', status: 'approved' },
    { key: '4', id: 4, contentType: '도서', title: '알고리즘 문제 해결 전략', requester: '이정훈', requestDate: '2024-07-25', status: 'rejected', rejectReason: '표지 이미지 품질 미달' },
    { key: '5', id: 5, contentType: '도서', title: '클린 코드 (개정판)', requester: '김현수', requestDate: '2024-07-29', status: 'pending' },
    { key: '6', id: 6, contentType: '웹소설', title: '회귀했더니 재벌 3세', requester: '소설작가1', requestDate: '2024-07-30', status: 'pending' },
];

// --- Helper Functions ---
const getStatusTag = (status) => {
    switch (status) {
        case 'pending': return <Tag icon={<ClockCircleOutlined />} color="warning">승인대기</Tag>;
        case 'approved': return <Tag icon={<CheckSquareOutlined />} color="success">승인완료</Tag>;
        case 'rejected': return <Tag icon={<CloseSquareOutlined />} color="error">반려</Tag>;
        default: return <Tag>{status}</Tag>;
    }
};

// --- Component ---
const ContentApproval = () => {
    const [approvals, setApprovals] = useState(initialApprovals);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ status: null, contentType: null, dateRange: null });
    // Add state for detail modal if needed
    // const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    // const [selectedItem, setSelectedItem] = useState(null);

    // --- Event Handlers ---
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value === 'all' ? null : value }));
    };

    const handleDateChange = (dates) => {
        setFilters(prev => ({ ...prev, dateRange: dates }));
    };

    const handleApprove = (key) => {
        setApprovals(prev =>
            prev.map(item => item.key === key ? { ...item, status: 'approved', rejectReason: undefined } : item)
        );
        message.success('콘텐츠가 승인되었습니다.');
        // TODO: API Call to update status
        console.log(`Approved item key: ${key}`);
    };

    const handleReject = (key, reason = '관리자에 의해 반려됨') => {
        // For simplicity, using a default reason. In reality, might prompt for a reason.
        setApprovals(prev =>
            prev.map(item => item.key === key ? { ...item, status: 'rejected', rejectReason: reason } : item)
        );
        message.error('콘텐츠가 반려되었습니다.');
        // TODO: API Call to update status
        console.log(`Rejected item key: ${key}, Reason: ${reason}`);
    };

    const handleViewDetails = (item) => {
        message.info(`콘텐츠 상세 보기 (${item.title}) - 구현 필요`);
        // Example: Open a modal with item details
        // setSelectedItem(item);
        // setIsDetailModalOpen(true);
        console.log('View details for:', item);
    };

    // --- Filtering Logic ---
    const filteredApprovals = useMemo(() => {
        return approvals.filter(item => {
            const matchesSearch = searchText
                ? item.title.toLowerCase().includes(searchText) || item.requester.toLowerCase().includes(searchText)
                : true;
            const matchesStatus = filters.status ? item.status === filters.status : true;
            const matchesContentType = filters.contentType ? item.contentType === filters.contentType : true;
            const matchesDate = filters.dateRange
                ? moment(item.requestDate).isBetween(filters.dateRange[0], filters.dateRange[1], 'day', '[]')
                : true;
            return matchesSearch && matchesStatus && matchesContentType && matchesDate;
        });
    }, [approvals, searchText, filters]);

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80, sorter: (a, b) => a.id - b.id },
        {
            title: '타입', dataIndex: 'contentType', key: 'contentType', width: 100,
            filters: [
                { text: '도서', value: '도서' },
                { text: '오디오북', value: '오디오북' },
                { text: '이북', value: '이북' },
                { text: '웹소설', value: '웹소설' },
            ],
            onFilter: (value, record) => record.contentType === value,
        },
        { title: '제목', dataIndex: 'title', key: 'title', ellipsis: true, render: (text) => <Link onClick={() => message.info('콘텐츠 상세 링크 클릭 (구현 필요)')}>{text}</Link> }, // Link to content detail?
        { title: '요청자', dataIndex: 'requester', key: 'requester', width: 100 },
        {
            title: '요청일', dataIndex: 'requestDate', key: 'requestDate', width: 120,
            sorter: (a, b) => moment(a.requestDate).unix() - moment(b.requestDate).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 120, align: 'center',
            render: (status, record) => (
                record.status === 'rejected' && record.rejectReason
                    ? <Tooltip title={`반려사유: ${record.rejectReason}`}>{getStatusTag(status)}</Tooltip>
                    : getStatusTag(status)
            ),
             filters: [
                { text: '승인대기', value: 'pending' },
                { text: '승인완료', value: 'approved' },
                { text: '반려', value: 'rejected' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: '관리',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="상세 보기">
                        <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} size="small" />
                    </Tooltip>
                    {record.status === 'pending' && (
                        <>
                            <Popconfirm
                                title="이 콘텐츠를 승인하시겠습니까?"
                                onConfirm={() => handleApprove(record.key)}
                                okText="승인"
                                cancelText="취소"
                            >
                                <Tooltip title="승인">
                                    <Button icon={<CheckCircleOutlined style={{ color: '#52c41a' }}/>} size="small" />
                                </Tooltip>
                            </Popconfirm>
                            <Popconfirm
                                title="이 콘텐츠를 반려하시겠습니까?"
                                description="반려 사유는 시스템에 기록됩니다."
                                onConfirm={() => handleReject(record.key)} // Add reason input later if needed
                                okText="반려"
                                cancelText="취소"
                            >
                                <Tooltip title="반려">
                                    <Button icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }}/>} danger size="small" />
                                </Tooltip>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>콘텐츠 승인 관리</Title>
            <Text type="secondary">등록 요청된 콘텐츠를 검토하고 승인 또는 반려합니다.</Text>

            {/* Search and Filter Controls */}
            <Space wrap style={{ marginBottom: 16 }}>
                <Search
                    placeholder="제목 또는 요청자 검색"
                    allowClear
                    enterButton={<><SearchOutlined /> 검색</>}
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
                <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={(value) => handleFilterChange('status', value)}
                    aria-label="상태 필터"
                >
                    <Option value="all">전체 상태</Option>
                    <Option value="pending">승인대기</Option>
                    <Option value="approved">승인완료</Option>
                    <Option value="rejected">반려</Option>
                </Select>
                <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={(value) => handleFilterChange('contentType', value)}
                    aria-label="타입 필터"
                >
                    <Option value="all">전체 타입</Option>
                    <Option value="도서">도서</Option>
                    <Option value="오디오북">오디오북</Option>
                    <Option value="이북">이북</Option>
                    <Option value="웹소설">웹소설</Option>
                    {/* Add more content types as needed */}
                </Select>
                <RangePicker onChange={handleDateChange} placeholder={['요청 시작일', '요청 종료일']} />
            </Space>

            {/* Approval Table */}
            <Table
                columns={columns}
                dataSource={filteredApprovals}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 1000 }}
            />

            {/* Detail Modal (Example Structure) */}
            {/* // REMOVED the commented out Modal block below to fix JSX error */}
            {/* The following lines containing the problematic multi-line comment are removed:
            <Modal
                title="콘텐츠 상세 정보"
                ...
            >
                {selectedItem && (
                    <div>
                        ...
                        /*  <-- Start of problematic comment
                        <p>...</p>
                    </div>
                )}
            </Modal>
            */}
         {/* This closing tag should be correctly parsed now */}
        </Space>
    );
};

export default ContentApproval; 