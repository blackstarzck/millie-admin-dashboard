import React, { useState, useMemo } from 'react';
import {
    Table,
    Tag,
    Space,
    Typography,
    Input,
    Select,
    DatePicker,
    Button,
    Tooltip,
    Avatar,
} from 'antd';
import {
    HistoryOutlined, // History Icon
    UserOutlined,
    SearchOutlined,
    FilterOutlined,
    PlusCircleOutlined, // 생성
    EditOutlined, // 수정
    DeleteOutlined, // 삭제
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// --- Sample Data ---
const initialHistory = [
    { key: 'nh1', noticeId: 1, noticeTitle: '서비스 점검 안내 (AntD 적용)', actionType: 'create', changedBy: 'admin01', changeDate: '2024-07-26 09:00:00', summary: '신규 공지 생성' },
    { key: 'nh2', noticeId: 2, noticeTitle: '새로운 기능 업데이트 소식', actionType: 'create', changedBy: 'admin01', changeDate: '2024-07-25 14:00:00', summary: '신규 공지 생성' },
    { key: 'nh3', noticeId: 3, noticeTitle: '이용약관 변경 안내', actionType: 'create', changedBy: 'system', changeDate: '2024-07-24 11:00:00', summary: '신규 공지 생성' },
    { key: 'nh4', noticeId: 2, noticeTitle: '새로운 기능 업데이트 소식 (AntD 적용)', actionType: 'edit', changedBy: 'admin02', changeDate: '2024-07-27 10:30:00', summary: '제목 수정, 내용 일부 수정' },
    { key: 'nh5', noticeId: 4, noticeTitle: '임시 공지 (삭제됨)', actionType: 'delete', changedBy: 'admin01', changeDate: '2024-07-28 16:00:00', summary: '공지 삭제 처리' },
];

// --- Helper Functions ---
const getActionTag = (actionType) => {
    switch (actionType) {
        case 'create': return <Tag icon={<PlusCircleOutlined />} color="success">생성</Tag>;
        case 'edit': return <Tag icon={<EditOutlined />} color="processing">수정</Tag>;
        case 'delete': return <Tag icon={<DeleteOutlined />} color="error">삭제</Tag>;
        default: return <Tag>{actionType}</Tag>;
    }
};

// --- Component ---
const NoticeHistory = () => {
    const [history, setHistory] = useState(initialHistory);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ actionType: null, dateRange: null, changedBy: null });

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

     // --- Filtering Logic ---
    const filteredHistory = useMemo(() => {
        return history.filter(item => {
            const matchesSearch = searchText
                ? item.noticeTitle.toLowerCase().includes(searchText) || item.noticeId.toString().includes(searchText)
                : true;
            const matchesActionType = filters.actionType ? item.actionType === filters.actionType : true;
            const matchesChangedBy = filters.changedBy ? item.changedBy.toLowerCase().includes(filters.changedBy.toLowerCase()) : true;
            const matchesDate = filters.dateRange
                ? moment(item.changeDate).isBetween(filters.dateRange[0], filters.dateRange[1], 'day', '[]')
                : true;
            return matchesSearch && matchesActionType && matchesChangedBy && matchesDate;
        });
    }, [history, searchText, filters]);

    // --- Table Columns Definition ---
    const columns = [
        {
            title: '공지사항 ID', dataIndex: 'noticeId', key: 'noticeId', width: 120,
            render: (id, record) => <Link>{id}</Link>, // Link to notice detail or list filtered by ID
            sorter: (a, b) => a.noticeId - b.noticeId,
        },
        { title: '공지사항 제목', dataIndex: 'noticeTitle', key: 'noticeTitle', ellipsis: true },
        {
            title: '변경 유형', dataIndex: 'actionType', key: 'actionType', width: 100, align: 'center',
            render: getActionTag,
            filters: [
                { text: '생성', value: 'create' },
                { text: '수정', value: 'edit' },
                { text: '삭제', value: 'delete' },
            ],
            onFilter: (value, record) => record.actionType === value,
        },
        { title: '변경 내용 요약', dataIndex: 'summary', key: 'summary', ellipsis: true },
        {
            title: '변경자', dataIndex: 'changedBy', key: 'changedBy', width: 120,
            render: (user) => <><Avatar size="small" icon={<UserOutlined />} style={{ marginRight: 5 }} />{user}</>
        },
        {
            title: '변경 일시', dataIndex: 'changeDate', key: 'changeDate', width: 170,
            sorter: (a, b) => moment(a.changeDate).unix() - moment(b.changeDate).unix(),
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
            defaultSortOrder: 'descend'
        },
        // Add '관리' column for viewing details if needed
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><HistoryOutlined /> 공지사항 변경 이력</Title>
            <Text type="secondary">공지사항의 생성, 수정, 삭제 등 변경 내역을 확인합니다.</Text>

            {/* Search and Filter Controls */}
            <Space wrap style={{ marginBottom: 16 }}>
                <Search
                    placeholder="공지 제목, ID 검색"
                    allowClear
                    enterButton={<><SearchOutlined /> 검색</>}
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
                <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                <Select
                    defaultValue="all"
                    style={{ width: 120 }}
                    onChange={(value) => handleFilterChange('actionType', value)}
                    aria-label="변경 유형 필터"
                >
                    <Option value="all">전체 유형</Option>
                    <Option value="create">생성</Option>
                    <Option value="edit">수정</Option>
                    <Option value="delete">삭제</Option>
                </Select>
                <Input
                     placeholder="변경자 ID 검색"
                     allowClear
                     style={{ width: 150 }}
                     onChange={(e) => handleFilterChange('changedBy', e.target.value)}
                 />
                <RangePicker onChange={handleDateChange} placeholder={['변경 시작일', '변경 종료일']} />
            </Space>

            {/* History Table */}
            <Table
                columns={columns}
                dataSource={filteredHistory}
                pagination={{ pageSize: 15 }}
                rowKey="key"
                scroll={{ x: 1200 }}
                bordered
                size="small"
            />
        </Space>
    );
};

export default NoticeHistory; 