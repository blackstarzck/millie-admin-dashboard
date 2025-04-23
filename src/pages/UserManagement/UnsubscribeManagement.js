import React, { useState, useMemo } from 'react';
import {
    Table,
    Input,
    Select,
    Tag,
    Space,
    Typography,
    message,
    Tooltip,
    DatePicker,
    Avatar, // For user info
    Button, // For potential actions
    Popconfirm, // For potential actions
} from 'antd';
import {
    UserOutlined,
    SearchOutlined,
    FilterOutlined,
    MailOutlined, // 이메일 아이콘
    MessageOutlined, // SMS 아이콘
    BellOutlined, // 푸시 알림 아이콘
    UndoOutlined, // 재동의 아이콘 (예시)
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// --- Sample Data ---
const initialUnsubscribes = [
    { key: '1', userId: 'user005', name: '박채영', email: 'chaeyoung.park@test.com', channel: 'email', unsubscribeDate: '2024-07-15 10:30:00', avatar: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png' },
    { key: '2', userId: 'user002', name: '이수현', email: 'suhyun.lee@example.com', channel: 'sms', unsubscribeDate: '2024-06-20 15:00:00', avatar: null },
    { key: '3', userId: 'user008', name: '정예린', email: 'yerin.jung@sample.org', channel: 'push', unsubscribeDate: '2024-07-28 09:00:00', avatar: null },
    { key: '4', userId: 'user015', name: '황은비', email: 'eunbi.hwang@email.net', channel: 'email', unsubscribeDate: '2024-05-01 18:45:00', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
    { key: '5', userId: 'user002', name: '이수현', email: 'suhyun.lee@example.com', channel: 'email', unsubscribeDate: '2024-06-25 11:00:00', avatar: null }, // Same user, different channel
];

// --- Helper Functions ---
const getChannelTag = (channel) => {
    switch (channel.toLowerCase()) {
        case 'email': return <Tag icon={<MailOutlined />} color="blue">이메일</Tag>;
        case 'sms': return <Tag icon={<MessageOutlined />} color="green">SMS</Tag>;
        case 'push': return <Tag icon={<BellOutlined />} color="purple">앱 푸시</Tag>;
        // Add more channels like 'kakao', 'marketing', etc.
        default: return <Tag>{channel}</Tag>;
    }
};

// --- Component ---
const UnsubscribeManagement = () => {
    const [unsubscribes, setUnsubscribes] = useState(initialUnsubscribes);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ channel: null, dateRange: null });

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

    // Placeholder for re-subscribe action (handle with care)
    const handleReSubscribe = (key) => {
        const item = unsubscribes.find(u => u.key === key);
        message.loading({ content: `'${item?.name}' 사용자의 '${item?.channel}' 수신 동의 처리 중... (구현 필요)`, key: 'resubscribe' });
        // Simulate API call
        setTimeout(() => {
            // Remove from unsubscribe list if successful
            // setUnsubscribes(prev => prev.filter(u => u.key !== key));
            message.success({ content: `수신 동의 처리 완료 (실제 기능 구현 시 목록에서 제거됨)`, key: 'resubscribe', duration: 2 });
            // TODO: API Call to update user's subscription status
             console.log(`Attempting to re-subscribe user for key: ${key}`);
        }, 1500);
    };

     const handleViewUser = (userId) => {
        message.info(`사용자 상세 정보 보기 (${userId}) - 구현 필요`);
        // Link to UserList page or open user detail modal
        console.log(`View user details for userId: ${userId}`);
    };

    // --- Filtering Logic ---
    const filteredUnsubscribes = useMemo(() => {
        return unsubscribes.filter(item => {
            const matchesSearch = searchText
                ? item.name.toLowerCase().includes(searchText) || item.email.toLowerCase().includes(searchText) || item.userId.toLowerCase().includes(searchText)
                : true;
            const matchesChannel = filters.channel ? item.channel === filters.channel : true;
            const matchesDate = filters.dateRange
                ? moment(item.unsubscribeDate).isBetween(filters.dateRange[0], filters.dateRange[1], 'day', '[]')
                : true;
            return matchesSearch && matchesChannel && matchesDate;
        });
    }, [unsubscribes, searchText, filters]);

    // --- Table Columns Definition ---
    const columns = [
         {
            title: '사용자 정보',
            key: 'userInfo',
            width: 250,
            render: (_, record) => (
                 <Space>
                     <Avatar size={40} src={record.avatar} icon={<UserOutlined />} />
                     <div>
                         {/* Link to user detail page? */}
                         <Link onClick={() => handleViewUser(record.userId)}>{record.name}</Link> <br />
                         <Text type="secondary">{record.email}</Text> <br />
                         <Text type="secondary" style={{ fontSize: '12px' }}>ID: {record.userId}</Text>
                    </div>
                 </Space>
            ),
        },
        {
            title: '수신 거부 채널', dataIndex: 'channel', key: 'channel', width: 150, align: 'center',
            render: getChannelTag,
            filters: [
                { text: '이메일', value: 'email' },
                { text: 'SMS', value: 'sms' },
                { text: '앱 푸시', value: 'push' },
            ],
            onFilter: (value, record) => record.channel === value,
        },
        {
            title: '수신 거부 일시', dataIndex: 'unsubscribeDate', key: 'unsubscribeDate', width: 180,
            sorter: (a, b) => moment(a.unsubscribeDate).unix() - moment(b.unsubscribeDate).unix(),
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm:ss'),
            defaultSortOrder: 'descend'
        },
        {
            title: '관리',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                 // Re-subscribe action should be carefully considered and implemented
                 // based on company policy and legal requirements.
                 <Popconfirm
                    title={`'${record.name}' 사용자의 '${record.channel}' 수신 거부 상태를 해제(재동의)하시겠습니까?`}
                    description="사용자 의사에 반할 수 있으니 신중하게 처리해주세요."
                    onConfirm={() => handleReSubscribe(record.key)}
                    okText="재동의 처리"
                    cancelText="취소"
                    placement="left"
                    disabled // Disable by default, enable only if feature is approved and implemented
                 >
                     <Tooltip title="수신 재동의 처리 (주의)">
                        {/* Button is disabled until the feature is confirmed */}
                         <Button icon={<UndoOutlined />} size="small" disabled />
                     </Tooltip>
                 </Popconfirm>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>수신거부 관리</Title>
            <Text type="secondary">알림 수신을 거부한 사용자 목록을 확인합니다.</Text>

            {/* Search and Filter Controls */}
            <Space wrap style={{ marginBottom: 16 }}>
                 <Search
                    placeholder="사용자명, 이메일, ID 검색"
                    allowClear
                    enterButton={<><SearchOutlined /> 검색</>}
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                 />
                <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                 <Select
                    defaultValue="all"
                    style={{ width: 150 }}
                    onChange={(value) => handleFilterChange('channel', value)}
                    aria-label="채널 필터"
                >
                    <Option value="all">전체 채널</Option>
                    <Option value="email">이메일</Option>
                    <Option value="sms">SMS</Option>
                    <Option value="push">앱 푸시</Option>
                    {/* Add more channels */}
                </Select>
                <RangePicker onChange={handleDateChange} placeholder={['거부 시작일', '거부 종료일']} />
            </Space>

             {/* Unsubscribe Table */}
            <Table
                columns={columns}
                dataSource={filteredUnsubscribes}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 800 }}
            />
        </Space>
    );
};

export default UnsubscribeManagement; 