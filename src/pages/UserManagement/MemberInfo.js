import React, { useState, useEffect } from 'react';
import {
    Table,
    Input,
    Button,
    Space,
    Typography,
    Card,
    Tag,
    Select,
    DatePicker,
    Modal,
    Descriptions,
    message,
    Avatar,
    Tooltip,
    Dropdown,
    Menu
} from 'antd';
import {
    UserOutlined,
    SearchOutlined,
    ReloadOutlined,
    MailOutlined,
    PhoneOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    StopOutlined,
    EyeOutlined,
    EditOutlined,
    LockOutlined, // For suspend/sanction
    UnlockOutlined, // For unsuspend
    MoreOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Sample Data
const initialUsers = [
    { key: '1', userId: 'user001', name: '홍길동', email: 'gildong@example.com', phone: '010-1234-5678', signupDate: '2024-07-01 10:30:00', lastLogin: '2024-07-25 15:00:00', status: 'active', userGroup: ' 일반', purchaseAmount: 50000 },
    { key: '2', userId: 'user002', name: '김철수', email: 'chulsoo@example.com', phone: '010-9876-5432', signupDate: '2024-06-15 09:00:00', lastLogin: '2024-07-20 11:20:00', status: 'active', userGroup: 'VIP', purchaseAmount: 250000 },
    { key: '3', userId: 'user003', name: '박영희', email: 'younghee@example.com', phone: '010-1111-2222', signupDate: '2024-05-20 14:00:00', lastLogin: '2024-06-10 08:00:00', status: 'dormant', userGroup: '일반', purchaseAmount: 10000 },
    { key: '4', userId: 'user004', name: '이지은', email: 'jieun@test.net', phone: '010-5555-4444', signupDate: '2024-07-10 11:00:00', lastLogin: '2024-07-15 10:00:00', status: 'suspended', userGroup: '일반', purchaseAmount: 0 },
];

const statusMap = {
    active: { color: 'success', text: '활성', icon: <CheckCircleOutlined /> },
    dormant: { color: 'default', text: '휴면', icon: <StopOutlined /> },
    suspended: { color: 'error', text: '정지', icon: <LockOutlined /> },
    pending: { color: 'warning', text: '대기', icon: <ClockCircleOutlined /> },
};

const MemberInfo = () => {
    const [users, setUsers] = useState(initialUsers);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    let searchInput = null;

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = () => {
        setLoading(true);
        console.log("Fetching users with filters:", filters);
        // TODO: Replace with API call
        setTimeout(() => {
            let filteredData = initialUsers;
            // Apply filters (example)
            if (filters.status) {
                filteredData = filteredData.filter(user => user.status === filters.status);
            }
            if (filters.search) {
                const term = filters.search.toLowerCase();
                filteredData = filteredData.filter(user =>
                    user.userId.toLowerCase().includes(term) ||
                    user.name.toLowerCase().includes(term) ||
                    user.email.toLowerCase().includes(term)
                );
            }
             if (filters.signupDateRange) {
                 const [start, end] = filters.signupDateRange;
                 filteredData = filteredData.filter(user => {
                     const signup = new Date(user.signupDate);
                     return signup >= start && signup <= end;
                 });
             }
            setUsers(filteredData);
            setLoading(false);
        }, 500);
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const handleResetFilters = () => {
        setFilters({});
        setSearchText(''); // Reset search text as well
        setSearchedColumn('');
        // Refetch - handled by useEffect
    };

    // --- Search Logic ---
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        handleFilterChange('search', selectedKeys[0]); // Trigger fetch via filter change
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText('');
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters['search']; // Remove search filter
            return newFilters;
        });
    };

    const getColumnSearchProps = (dataIndex, placeholder) => ({
         filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={node => { searchInput = node; }}
                    placeholder={`${placeholder} 검색`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    // Use onFilterChange for live filtering if needed, or keep search button
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        검색
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters, dataIndex)} size="small" style={{ width: 90 }}>
                        초기화
                    </Button>
                </Space>
            </div>
         ),
         filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
         onFilterDropdownOpenChange: visible => {
             if (visible) {
                 setTimeout(() => searchInput?.select(), 100);
             }
         },
         render: text =>
             searchedColumn === dataIndex ? (
                 <Highlighter
                     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                     searchWords={[searchText]}
                     autoEscape
                     textToHighlight={text ? text.toString() : ''}
                 />
             ) : (
                 text
             ),
     });

    // --- Modal Logic ---
    const showDetailModal = (user) => {
        setSelectedUser(user);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedUser(null);
    };

    // --- Action Logic ---
    const handleChangeStatus = (userId, currentStatus, newStatus) => {
        console.log(`Change status for ${userId} from ${currentStatus} to ${newStatus}`);
        // TODO: API Call to change status
         message.loading({ content: `'${userId}' 상태 변경 중...`, key: userId });
         setTimeout(() => {
            setUsers(prevUsers => prevUsers.map(u => u.userId === userId ? { ...u, status: newStatus } : u));
            message.success({ content: `'${userId}' 상태가 '${statusMap[newStatus]?.text || newStatus}' (으)로 변경되었습니다.`, key: userId });
         }, 500);
    };

    const handleMenuClick = (e, record) => {
        switch(e.key) {
            case 'detail':
                showDetailModal(record);
                break;
            case 'edit':
                message.info(`Edit function for ${record.userId} needs implementation.`);
                // navigate(`/users/edit/${record.userId}`); // Example navigation
                break;
            case 'suspend':
                handleChangeStatus(record.userId, record.status, 'suspended');
                break;
            case 'activate':
                 handleChangeStatus(record.userId, record.status, 'active');
                 break;
            case 'unsuspend': // Handle unsuspending to active
                 handleChangeStatus(record.userId, record.status, 'active');
                 break;
             case 'sanction':
                 message.info(`Sanction page/modal for ${record.userId} needs implementation.`);
                 // navigate(`/users/sanctions/${record.userId}`); // Example navigation
                 break;
            default:
                break;
        }
    };

    const columns = [
        {
            title: '사용자 ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 120,
            render: (text, record) => <><Avatar size="small" icon={<UserOutlined />} style={{marginRight: 8}}/> {text}</>,
             ...getColumnSearchProps('userId', '사용자 ID'),
        },
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            width: 100,
             ...getColumnSearchProps('name', '이름'),
        },
        {
            title: '이메일',
            dataIndex: 'email',
            key: 'email',
            width: 200,
             render: (text) => <><MailOutlined style={{ marginRight: 8 }} />{text}</>,
             ...getColumnSearchProps('email', '이메일'),
        },
         {
             title: '연락처',
             dataIndex: 'phone',
             key: 'phone',
             width: 150,
             render: (text) => <><PhoneOutlined style={{ marginRight: 8 }} />{text}</>
         },
        {
            title: '가입일',
            dataIndex: 'signupDate',
            key: 'signupDate',
            width: 160,
            sorter: (a, b) => new Date(a.signupDate) - new Date(b.signupDate),
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            filters: Object.entries(statusMap).map(([key, { text }]) => ({ text, value: key })),
            onFilter: (value, record) => record.status === value,
            render: (status) => {
                const statusInfo = statusMap[status] || { color: 'default', text: status, icon: null };
                return <Tag color={statusInfo.color} icon={statusInfo.icon}>{statusInfo.text}</Tag>;
            },
        },
         {
             title: '사용자 그룹',
             dataIndex: 'userGroup',
             key: 'userGroup',
             width: 100,
             // Add filtering if needed
         },
        {
            title: '관리',
            key: 'action',
            width: 80,
            align: 'center',
            render: (_, record) => {
                const menu = (
                    <Menu onClick={(e) => handleMenuClick(e, record)}>
                        <Menu.Item key="detail" icon={<EyeOutlined />}>상세 보기</Menu.Item>
                        <Menu.Item key="edit" icon={<EditOutlined />}>정보 수정</Menu.Item>
                        <Menu.Divider />
                        {record.status !== 'suspended' && (
                             <Menu.Item key="suspend" icon={<LockOutlined />} danger>계정 정지</Menu.Item>
                         )}
                         {record.status === 'suspended' && (
                             <Menu.Item key="unsuspend" icon={<UnlockOutlined />}>정지 해제</Menu.Item>
                         )}
                         {record.status === 'dormant' && (
                             <Menu.Item key="activate" icon={<CheckCircleOutlined />}>활성 전환</Menu.Item>
                         )}
                         {/* Add more actions like force password reset, view sanctions, etc. */}
                         <Menu.Item key="sanction" icon={<StopOutlined/>}>제재 관리 이동</Menu.Item>
                    </Menu>
                );
                return (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button icon={<MoreOutlined />} type="text" />
                    </Dropdown>
                );
            }
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><UserOutlined /> 회원 정보 관리</Title>
            <Text>시스템에 등록된 회원 정보를 조회하고 관리합니다.</Text>

            <Card>
                <Space style={{ marginBottom: 16 }} wrap>
                    {/* Replace Input.Search with getColumnSearchProps usage if preferred */}
                     <Input.Search
                         placeholder="ID, 이름, 이메일 검색"
                         allowClear
                         onSearch={(value) => handleFilterChange('search', value)}
                         onChange={(e) => !e.target.value && handleFilterChange('search', '')}
                         style={{ width: 250 }}
                         value={filters.search || ''} // Bind value for controlled component
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
                     <Text>가입일:</Text>
                     <RangePicker
                         onChange={(dates) => handleFilterChange('signupDateRange', dates)}
                         value={filters.signupDateRange || null}
                     />
                    <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>초기화</Button>
                    {/* <Button type="primary" icon={<SearchOutlined />} onClick={fetchData}>검색</Button> */}
                </Space>

                <Table
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    scroll={{ x: 1200 }}
                    bordered
                    size="small"
                    rowKey="key"
                />
            </Card>

            <Modal
                title="회원 상세 정보"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={[
                    <Button key="close" onClick={handleModalClose}>
                        닫기
                    </Button>,
                    // Add Edit button if needed
                    <Button key="edit" icon={<EditOutlined />} onClick={() => message.info('Edit function needs implementation')} >
                         정보 수정
                     </Button>,
                ]}
                width={600}
            >
                {selectedUser && (
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="사용자 ID">{selectedUser.userId}</Descriptions.Item>
                        <Descriptions.Item label="이름">{selectedUser.name}</Descriptions.Item>
                        <Descriptions.Item label="이메일">{selectedUser.email}</Descriptions.Item>
                        <Descriptions.Item label="연락처">{selectedUser.phone}</Descriptions.Item>
                        <Descriptions.Item label="가입일시">{selectedUser.signupDate}</Descriptions.Item>
                        <Descriptions.Item label="최근 로그인">{selectedUser.lastLogin}</Descriptions.Item>
                         <Descriptions.Item label="상태">
                             <Tag color={statusMap[selectedUser.status]?.color} icon={statusMap[selectedUser.status]?.icon}>
                                 {statusMap[selectedUser.status]?.text || selectedUser.status}
                             </Tag>
                         </Descriptions.Item>
                        <Descriptions.Item label="사용자 그룹">{selectedUser.userGroup}</Descriptions.Item>
                        <Descriptions.Item label="총 구매액">{selectedUser.purchaseAmount.toLocaleString()} 원</Descriptions.Item>
                         {/* Add more relevant details */}
                    </Descriptions>
                )}
            </Modal>
        </Space>
    );
};

export default MemberInfo; 