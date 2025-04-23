import React, { useState, useMemo, useEffect } from 'react';
import {
    Table,
    Tag,
    Input,
    Select,
    DatePicker,
    Space,
    Typography,
    Modal,
    Descriptions,
    Spin,
    Alert,
    Button,
    Tooltip,
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    InfoCircleOutlined,
    WarningOutlined,
    CloseCircleOutlined,
    BugOutlined, // Debug level
    EyeOutlined, // Detail view
    ReloadOutlined, // Refresh
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// --- Sample Log Data (Replace with actual API fetch) ---
const generateSampleLogs = (count = 50) => {
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const components = ['AuthService', 'UserAPI', 'NotificationService', 'PaymentGateway', 'Scheduler', 'FrontendUI'];
    const adminUsers = ['admin001', 'dev001', 'cs001', null]; // null for system logs
    const messages = [
        'User login successful', 'Password validation failed', 'Notification sent', 'Payment processed', 'Scheduled job started', 'API request timeout', 'Database connection error', 'Component rendered', 'Configuration loaded', 'Permission denied'
    ];
    const logs = [];
    let currentTime = moment();

    for (let i = 0; i < count; i++) {
        const level = levels[Math.floor(Math.random() * levels.length)];
        const timestamp = currentTime.subtract(Math.random() * 60 * 5, 'minutes').format('YYYY-MM-DD HH:mm:ss.SSS');
        const component = components[Math.floor(Math.random() * components.length)];
        const adminUser = adminUsers[Math.floor(Math.random() * adminUsers.length)];
        const message = messages[Math.floor(Math.random() * messages.length)];
        let details = { ipAddress: `192.168.0.${Math.floor(Math.random() * 255)}` };
        if (level === 'ERROR') {
             details.stackTrace = `Error: ${message} at ${component}.js:${Math.floor(Math.random() * 100) + 1}\n    at functionA (service.js:50)\n    at main (app.js:10)`;
             details.errorCode = `ERR_${Math.floor(Math.random() * 1000)}`;
        } else if (adminUser) {
            details.userId = adminUser;
            details.action = 'performed some action';
        }

        logs.push({
            key: `log${i}`,
            timestamp,
            level,
            component,
            message: `${message}${adminUser ? ` by ${adminUser}` : ''}`,
            adminUser,
            details: JSON.stringify(details, null, 2), // Store details as string for simplicity
        });
    }
    return logs.sort((a, b) => moment(b.timestamp).valueOf() - moment(a.timestamp).valueOf());
};

// --- Mock API ---
const fetchLogs = async (params) => {
    console.log('Fetching logs with params:', params);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay
    // In a real app, the API would handle filtering based on params
    return generateSampleLogs(100); // Generate new set each time for refresh effect
};

// --- Helper Functions ---
const getLevelTag = (level) => {
    switch (level) {
        case 'ERROR':
            return <Tag icon={<CloseCircleOutlined />} color="error">ERROR</Tag>;
        case 'WARN':
            return <Tag icon={<WarningOutlined />} color="warning">WARN</Tag>;
        case 'INFO':
            return <Tag icon={<InfoCircleOutlined />} color="processing">INFO</Tag>;
        case 'DEBUG':
            return <Tag icon={<BugOutlined />} color="default">DEBUG</Tag>;
        default:
            return <Tag>{level}</Tag>;
    }
};

// --- Component ---
const SystemLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({
        level: 'all',
        component: 'all',
        adminUser: 'all',
        dateRange: null,
    });

    // Function to load logs
    const loadLogs = () => {
        setLoading(true);
        // Pass current filters to fetch function (though mock doesn't use them)
        fetchLogs({ ...filters, search: searchText })
            .then(data => {
                setLogs(data);
            })
            .catch(error => {
                message.error('로그를 불러오는 데 실패했습니다.');
                console.error('Fetch logs error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Initial load
    useEffect(() => {
        loadLogs();
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Load only once initially

    // Filter logs based on state (client-side filtering for demo)
     const filteredLogs = useMemo(() => {
         const [startDate, endDate] = filters.dateRange || [null, null];
         return logs.filter(log => {
             const matchesSearch = searchText
                 ? log.message.toLowerCase().includes(searchText) ||
                   log.component.toLowerCase().includes(searchText) ||
                   (log.adminUser && log.adminUser.toLowerCase().includes(searchText)) ||
                   log.details.toLowerCase().includes(searchText)
                 : true;
             const matchesLevel = filters.level === 'all' || log.level === filters.level;
             const matchesComponent = filters.component === 'all' || log.component === filters.component;
             const matchesAdmin = filters.adminUser === 'all' || log.adminUser === filters.adminUser;
             const logDate = moment(log.timestamp);
             const matchesDate = (!startDate || logDate.isSameOrAfter(startDate, 'day')) &&
                               (!endDate || logDate.isSameOrBefore(endDate, 'day'));

             return matchesSearch && matchesLevel && matchesComponent && matchesAdmin && matchesDate;
         });
     }, [logs, searchText, filters]);

    // --- Modal Handling ---
    const showDetailModal = (log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedLog(null);
    };

     // --- Filter Change Handler ---
     const handleFilterChange = (type, value) => {
         setFilters(prev => ({ ...prev, [type]: value }));
         // Note: In a real app, you might trigger loadLogs() here instead of client-side filtering
    };

     // --- Search Handler ---
     const handleSearch = (value) => {
         setSearchText(value.toLowerCase());
         // Note: In a real app, you might trigger loadLogs() here
    };

    // --- Table Columns Definition ---
    const columns = [
        {
            title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', width: 200,
            render: (ts) => moment(ts).format('YYYY-MM-DD HH:mm:ss.SSS'),
            sorter: (a, b) => moment(a.timestamp).valueOf() - moment(b.timestamp).valueOf(),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Level', dataIndex: 'level', key: 'level', width: 100,
            render: getLevelTag,
            filters: [
                { text: 'ERROR', value: 'ERROR' },
                { text: 'WARN', value: 'WARN' },
                { text: 'INFO', value: 'INFO' },
                { text: 'DEBUG', value: 'DEBUG' },
            ],
            // Client-side filtering example (remove if using server-side)
            // onFilter: (value, record) => record.level === value,
        },
        { title: 'Component', dataIndex: 'component', key: 'component', width: 180 },
        { title: 'Message', dataIndex: 'message', key: 'message', ellipsis: true },
        { title: 'Admin User', dataIndex: 'adminUser', key: 'adminUser', width: 120, render: (user) => user || 'System' },
        {
            title: 'Details',
            key: 'action',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Tooltip title="상세 정보 보기">
                    <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} size="small" />
                </Tooltip>
            ),
        },
    ];

    // Extract unique components and admin users for filter dropdowns
    const uniqueComponents = useMemo(() => [...new Set(logs.map(log => log.component))], [logs]);
    const uniqueAdminUsers = useMemo(() => [...new Set(logs.map(log => log.adminUser).filter(Boolean))], [logs]);

    return (
        <Spin spinning={loading} tip="로그 로딩 중...">
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                <Title level={2}>시스템 로그</Title>
                <Text type="secondary">시스템 운영 중 발생하는 주요 이벤트 및 오류 로그를 확인합니다.</Text>

                {/* Filter Controls */}
                <Space wrap style={{ marginBottom: 16 }}>
                     <Search
                        placeholder="메시지, 컴포넌트, 사용자 등 검색"
                        allowClear
                        enterButton={<><SearchOutlined /> 검색</>}
                         onSearch={handleSearch} // Trigger search on enter/click
                         onChange={(e) => !e.target.value && handleSearch('')} // Clear search state on input clear
                        style={{ width: 300 }}
                    />
                    <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                    <Select
                        value={filters.level}
                        onChange={(value) => handleFilterChange('level', value)}
                        style={{ width: 120 }}
                    >
                        <Option value="all">전체 레벨</Option>
                        <Option value="ERROR">ERROR</Option>
                        <Option value="WARN">WARN</Option>
                        <Option value="INFO">INFO</Option>
                        <Option value="DEBUG">DEBUG</Option>
                    </Select>
                     <Select
                        value={filters.component}
                        onChange={(value) => handleFilterChange('component', value)}
                        style={{ width: 180 }}
                        showSearch
                        optionFilterProp="children"
                    >
                        <Option value="all">전체 컴포넌트</Option>
                        {uniqueComponents.map(comp => <Option key={comp} value={comp}>{comp}</Option>)}
                    </Select>
                     <Select
                        value={filters.adminUser}
                        onChange={(value) => handleFilterChange('adminUser', value)}
                        style={{ width: 150 }}
                         showSearch
                        optionFilterProp="children"
                    >
                        <Option value="all">전체 사용자</Option>
                         <Option value="System">System</Option>
                        {uniqueAdminUsers.map(user => <Option key={user} value={user}>{user}</Option>)}
                    </Select>
                    <RangePicker
                        value={filters.dateRange}
                        onChange={(dates) => handleFilterChange('dateRange', dates)}
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['시작일시', '종료일시']}
                    />
                     <Button icon={<ReloadOutlined />} onClick={loadLogs} loading={loading}>새로고침</Button>
                </Space>

                <Table
                    columns={columns}
                     dataSource={filteredLogs} // Use client-filtered data for demo
                    pagination={{ pageSize: 20, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                    rowKey="key"
                    scroll={{ x: 1000, y: 'calc(100vh - 400px)' }} // Adjust scroll height as needed
                    size="small"
                    sticky // Make header sticky on scroll
                 />

                {/* Log Detail Modal */}
                <Modal
                    title="로그 상세 정보"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null} // No OK/Cancel buttons needed
                    width={800}
                    destroyOnClose
                >
                    {selectedLog && (
                        <Descriptions bordered layout="vertical" size="small">
                            <Descriptions.Item label="Timestamp" span={2}>{moment(selectedLog.timestamp).format('YYYY-MM-DD HH:mm:ss.SSS')}</Descriptions.Item>
                            <Descriptions.Item label="Level">{getLevelTag(selectedLog.level)}</Descriptions.Item>
                            <Descriptions.Item label="Component">{selectedLog.component}</Descriptions.Item>
                            <Descriptions.Item label="Admin User">{selectedLog.adminUser || 'System'}</Descriptions.Item>
                            <Descriptions.Item label="Message" span={3}>{selectedLog.message}</Descriptions.Item>
                            <Descriptions.Item label="Details" span={3}>
                                {/* Use pre-wrap to preserve formatting of JSON string */}
                                <Paragraph code copyable style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflowY: 'auto', background: '#f5f5f5', padding: '10px' }}>
                                    {selectedLog.details}
                                 </Paragraph>
                             </Descriptions.Item>
                         </Descriptions>
                     )}
                </Modal>
            </Space>
        </Spin>
    );
};

export default SystemLog; 