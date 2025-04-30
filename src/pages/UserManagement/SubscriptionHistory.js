import React, { useState } from 'react';
import {
    Table,
    Typography,
    Tag,
    Input,
    DatePicker,
    Select,
    Space,
    Button,
    Card
} from 'antd';
import { HistoryOutlined, SearchOutlined, ReloadOutlined, CalendarOutlined, FilterOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Sample Subscription Data
const initialSubscriptions = [
    { key: 'sub1', subscriptionId: 'S001', userId: 'user001', userName: '홍길동', plan: '월간', startDate: '2024-07-01', endDate: '2024-08-01', status: 'active', amount: 9900, paymentMethod: '신용카드' },
    { key: 'sub2', subscriptionId: 'S002', userId: 'user002', userName: '김철수', plan: '연간', startDate: '2024-01-15', endDate: '2025-01-15', status: 'active', amount: 99000, paymentMethod: '계좌이체' },
    { key: 'sub3', subscriptionId: 'S003', userId: 'user003', userName: '박영희', plan: '월간', startDate: '2024-06-10', endDate: '2024-07-10', status: 'expired', amount: 9900, paymentMethod: '신용카드' },
    { key: 'sub4', subscriptionId: 'S004', userId: 'user001', userName: '홍길동', plan: '월간', startDate: '2024-06-01', endDate: '2024-07-01', status: 'expired', amount: 9900, paymentMethod: '신용카드' },
    { key: 'sub7', subscriptionId: 'S007', userId: 'user007', userName: '오일남', plan: '월간', startDate: moment().subtract(25, 'days').format('YYYY-MM-DD'), endDate: moment().add(5, 'days').format('YYYY-MM-DD'), status: 'active', amount: 12900, paymentMethod: '네이버페이' },
    // Remove pending and canceled entries again
    // { key: 'sub5', subscriptionId: 'S005', userId: 'user005', userName: '강민준', plan: '월간', startDate: '2024-07-22', endDate: '2024-08-22', status: 'pending', amount: 14900, paymentMethod: '카카오페이' },
    // { key: 'sub6', subscriptionId: 'S006', userId: 'user002', userName: '김철수', plan: '월간', startDate: '2023-12-15', endDate: '2024-01-15', status: 'canceled', amount: 19900, paymentMethod: '계좌이체' },
];

const statusMap = {
    active: { color: 'success', text: '구독중' },
    expired: { color: 'default', text: '만료' },
    // pending: { color: 'warning', text: '결제대기' }, // Removed again
    // canceled: { color: 'error', text: '취소됨' }, // Removed again
};

const SubscriptionHistory = () => {
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState('');

    // TODO: Implement filtering logic based on filters and searchText

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
        // TODO: Trigger data fetch or filtering
    };

    const handleSearch = (value) => {
        setSearchText(value);
         // TODO: Trigger data fetch or filtering
    };

    const handleResetFilters = () => {
        setFilters({});
        setSearchText('');
        // TODO: Trigger data fetch or filtering
    };

    const columns = [
        { title: '구독ID', dataIndex: 'subscriptionId', key: 'subscriptionId', width: 100 },
        {
            title: '이름',
            dataIndex: 'userName',
            key: 'userName',
            width: 120,
            render: (text) => {
                if (!text) return '-';
                if (text.length > 2) {
                    return `${text[0]}*${text.substring(text.length - 1)}`;
                }
                return text;
            }
        },
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 120,
        },
        { title: '플랜', dataIndex: 'plan', key: 'plan', width: 150 },
        {
            title: '구독기간', key: 'duration', width: 220,
            render: (_, record) => `${record.startDate} ~ ${record.endDate}`,
            sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 110, align: 'center',
            render: (status, record) => {
                const today = moment().startOf('day');
                const endDate = record.endDate ? moment(record.endDate).startOf('day') : null;

                if (status === 'active' && endDate && endDate.isSameOrAfter(today)) {
                    const diffDays = endDate.diff(today, 'days');
                    return <Tag color="success">{diffDays + 1}일 남음</Tag>;
                } else {
                    // Treat active but past endDate as expired
                    return <Tag>만료</Tag>;
                }
            },
            filters: [
                 { text: '구독중', value: 'active' }, // Keep filter for active status
                 { text: '만료', value: 'expired' },
            ],
            // Filter logic needs adjustment: Filter for 'active' should check remaining days > 0
            // Or simply filter by status field, and render handles the display
             onFilter: (value, record) => {
                if (value === 'expired') {
                    const today = moment().startOf('day');
                    const endDate = record.endDate ? moment(record.endDate).startOf('day') : null;
                     return record.status === 'expired' || (record.status === 'active' && endDate && endDate.isBefore(today));
                }
                 if (value === 'active') {
                     const today = moment().startOf('day');
                     const endDate = record.endDate ? moment(record.endDate).startOf('day') : null;
                     return record.status === 'active' && endDate && endDate.isSameOrAfter(today);
                 }
                return false; // Should not happen with current filters
             },
        },
        {
            title: '결제금액', dataIndex: 'amount', key: 'amount', width: 120, align: 'right',
            render: (amount) => `${amount.toLocaleString()} 원`,
            sorter: (a, b) => a.amount - b.amount,
        },
        { title: '결제수단', dataIndex: 'paymentMethod', key: 'paymentMethod', width: 120 },
        // Add more columns like next payment date, actions etc. if needed
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><HistoryOutlined /> 구독 내역 관리</Title>
            <Text>사용자들의 구독 신청, 갱신, 만료 내역을 확인하고 관리합니다.</Text>

            <Card>
                 <Space style={{ marginBottom: 16 }} wrap>
                     <Input.Search
                         placeholder="사용자 ID 또는 이름 검색"
                         allowClear
                         onSearch={handleSearch}
                         style={{ width: 250 }}
                     />
                     <FilterOutlined />
                     <Select
                         placeholder="상태 필터"
                         allowClear
                         style={{ width: 120 }}
                         onChange={(value) => handleFilterChange('status', value)}
                         value={filters.status || undefined}
                     >
                         {/* Update filter options */}
                         <Option value="active">구독중</Option>
                         <Option value="expired">만료</Option>
                     </Select>
                      <Text>구독 시작일:</Text>
                      <RangePicker
                          onChange={(dates) => handleFilterChange('dateRange', dates)}
                          value={filters.dateRange || null}
                      />
                     <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>초기화</Button>
                     {/* <Button type="primary" icon={<SearchOutlined />} onClick={fetchData}>검색</Button> */}
                 </Space>

                <Table
                    columns={columns}
                    dataSource={subscriptions} // TODO: Use filtered data
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    scroll={{ x: 1000 }}
                    bordered
                    size="small"
                    rowKey="key"
                />
            </Card>
        </Space>
    );
};

export default SubscriptionHistory; 