import React, { useState, useMemo } from 'react';
import {
    Table,
    Input,
    Select,
    Tag,
    Switch,
    Button,
    Space,
    Typography,
    message,
    Tooltip,
    Avatar, // For user representation
} from 'antd';
import { UserOutlined, SearchOutlined, FilterOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// --- Sample Data ---
const initialUsers = [
    {
        key: '1',
        userId: 'user001',
        name: '김민지',
        email: 'minji.kim@example.com',
        registrationDate: '2023-01-15',
        status: 'active', // active, inactive, suspended
        role: 'user', // user, admin, partner
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png', // Example avatar URL
    },
    {
        key: '2',
        userId: 'user002',
        name: '이수현',
        email: 'suhyun.lee@example.com',
        registrationDate: '2023-03-22',
        status: 'inactive',
        role: 'user',
        avatar: null, // No avatar
    },
    {
        key: '3',
        userId: 'admin001',
        name: '박서준',
        email: 'seo.park@example.com',
        registrationDate: '2022-11-01',
        status: 'active',
        role: 'admin',
        avatar: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        key: '4',
        userId: 'user003',
        name: '최유나',
        email: 'yuna.choi@sample.net',
        registrationDate: '2024-05-10',
        status: 'suspended',
        role: 'user',
        avatar: null,
    },
     {
        key: '5',
        userId: 'user004',
        name: '정다빈',
        email: 'dabin.jung@email.org',
        registrationDate: '2024-06-01',
        status: 'active',
        role: 'user',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    },
];

// --- Helper Functions ---
const getStatusTag = (status) => {
    switch (status) {
        case 'active': return <Tag color="success">활성</Tag>;
        case 'inactive': return <Tag color="default">비활성</Tag>;
        case 'suspended': return <Tag color="error">정지</Tag>;
        default: return <Tag>{status}</Tag>;
    }
};

const getRoleTag = (role) => {
    switch (role) {
        case 'admin': return <Tag color="purple">관리자</Tag>;
        case 'user': return <Tag color="blue">일반 사용자</Tag>;
        case 'partner': return <Tag color="orange">파트너</Tag>; // Assuming partner role exists
        default: return <Tag>{role}</Tag>;
    }
};

// --- Component ---
const UserList = () => {
    const [users, setUsers] = useState(initialUsers);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ status: null, role: null });

    // --- Event Handlers ---
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value === 'all' ? null : value }));
    };

    const handleStatusChange = (userId, checked) => {
        const newStatus = checked ? 'active' : 'inactive';
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.key === userId ? { ...user, status: newStatus } : user
            )
        );
        message.success(`사용자 ${userId} 상태가 ${newStatus === 'active' ? '활성' : '비활성'}으로 변경되었습니다.`);
        // TODO: API Call to update user status
        console.log(`Changed status for user ${userId} to ${newStatus}`);
    };

     const handleViewDetails = (userId) => {
        message.info(`사용자 ${userId} 상세 정보 보기 (구현 필요)`);
        // TODO: Navigate to user detail page or open a detail modal
        console.log(`View details for user ${userId}`);
    };


    // --- Filtering Logic ---
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = searchText
                ? user.name.toLowerCase().includes(searchText) || user.email.toLowerCase().includes(searchText)
                : true;
            const matchesStatus = filters.status ? user.status === filters.status : true;
            const matchesRole = filters.role ? user.role === filters.role : true;
            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [users, searchText, filters]);

    // --- Table Columns Definition ---
    const columns = [
        {
            title: '사용자',
            key: 'userInfo',
            width: 250,
            render: (_, record) => (
                 <Space>
                     <Avatar size={40} src={record.avatar} icon={<UserOutlined />} />
                     <div>
                         <Text strong>{record.name}</Text> <br />
                         <Text type="secondary">{record.email}</Text>
                    </div>
                 </Space>
            ),
        },
        { title: '사용자 ID', dataIndex: 'userId', key: 'userId', width: 120, sorter: (a, b) => a.userId.localeCompare(b.userId) },
        {
            title: '가입일', dataIndex: 'registrationDate', key: 'registrationDate', width: 130,
            sorter: (a, b) => moment(a.registrationDate).unix() - moment(b.registrationDate).unix(),
            render: (date) => moment(date).format('YYYY-MM-DD'),
            defaultSortOrder: 'descend'
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 100, align: 'center',
            render: (status, record) => (
                 // Allow changing only between active/inactive for simplicity now
                 record.status === 'suspended' ? getStatusTag(status) : (
                    <Switch
                        checked={status === 'active'}
                        onChange={(checked) => handleStatusChange(record.key, checked)}
                        checkedChildren="활성"
                        unCheckedChildren="비활성"
                        disabled={record.status === 'suspended'} // Can't change suspended status here
                     />
                 )
            ),
            filters: [ // Add filters to the column definition
                { text: '활성', value: 'active' },
                { text: '비활성', value: 'inactive' },
                { text: '정지', value: 'suspended' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: '역할', dataIndex: 'role', key: 'role', width: 120, align: 'center',
            render: getRoleTag,
             filters: [
                { text: '일반 사용자', value: 'user' },
                { text: '관리자', value: 'admin' },
                { text: '파트너', value: 'partner' },
            ],
            onFilter: (value, record) => record.role === value,
        },
        {
            title: '관리', key: 'action', width: 100, align: 'center',
            render: (_, record) => (
                <Tooltip title="상세 정보 보기">
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record.userId)}
                        size="small"
                    />
                </Tooltip>
                 // Add more actions like 'Edit Role', 'Force Logout', 'Delete User' if needed
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>사용자 목록 관리</Title>
            <Text type="secondary">서비스 사용자 목록을 조회하고 관리합니다.</Text>

            {/* Search and Filter Controls */}
            <Space wrap style={{ marginBottom: 16 }}>
                 <Search
                    placeholder="이름 또는 이메일 검색"
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
                    <Option value="active">활성</Option>
                    <Option value="inactive">비활성</Option>
                    <Option value="suspended">정지</Option>
                </Select>
                <Select
                    defaultValue="all"
                    style={{ width: 140 }}
                    onChange={(value) => handleFilterChange('role', value)}
                     aria-label="역할 필터"
                >
                    <Option value="all">전체 역할</Option>
                    <Option value="user">일반 사용자</Option>
                    <Option value="admin">관리자</Option>
                     <Option value="partner">파트너</Option>
                </Select>
            </Space>

             {/* User Table */}
            <Table
                columns={columns}
                dataSource={filteredUsers}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 800 }} // Enable horizontal scroll if needed
            />
        </Space>
    );
};

export default UserList; 