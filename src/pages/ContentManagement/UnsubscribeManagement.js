import React, { useState, useEffect } from 'react';
import {
    Table,
    Input,
    Button,
    Space,
    Typography,
    Card,
    Tag,
    Tooltip,
    message,
    Popconfirm,
    Row,
    Col,
    Select
} from 'antd';
import {
    SearchOutlined,
    UndoOutlined,
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    BellOutlined,
    StopOutlined, // Represents unsubscribed
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const { Title, Text } = Typography;
const { Option } = Select;

// --- Sample Data (Replace with actual API data) ---
const initialData = [
    {
        key: '1',
        userId: 'user001',
        email: 'user001@example.com',
        name: '김민준',
        phone: '010-1234-5678',
        unsubscribeDate: '2023-10-26 10:00:00',
        reason: '알림 빈도가 잦음',
        channel: 'Push',
    },
    {
        key: '2',
        userId: 'user002',
        email: 'user002@sample.net',
        name: '이서연',
        phone: '010-9876-5432',
        unsubscribeDate: '2023-10-25 15:30:00',
        reason: '콘텐츠 불만족',
        channel: 'Email',
    },
    {
        key: '3',
        userId: 'user003',
        email: 'user003@test.org',
        name: '박지훈',
        phone: '010-1111-2222',
        unsubscribeDate: '2023-11-01 09:00:00',
        reason: '기타',
        channel: 'Push',
    },
    // ... more data
];

// --- Component ---
const UnsubscribeManagement = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [filters, setFilters] = useState({});
    let searchInput = null;

    // Simulate fetching data
    useEffect(() => {
        // In a real app, fetch data here based on filters
        // setLoading(true);
        // fetch('/api/unsubscribed-users?...').then(...).finally(() => setLoading(false));
        console.log("Current Filters:", filters);
        // For demo, filtering is done client-side within getColumnSearchProps
    }, [filters]);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setFilters(prev => ({ ...prev, [dataIndex]: selectedKeys[0] }));
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText('');
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[dataIndex];
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
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
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

    const handleResubscribe = (key) => {
        setLoading(true);
        // TODO: API call to resubscribe user
        console.log('Resubscribing user with key:', key);
        setTimeout(() => { // Simulate API delay
            setData(prevData => prevData.filter(item => item.key !== key));
            message.success('사용자의 수신 거부가 해제되었습니다.');
            setSelectedRowKeys(prevKeys => prevKeys.filter(k => k !== key));
            setLoading(false);
        }, 500);
    };

    const handleBatchResubscribe = () => {
        if (selectedRowKeys.length === 0) {
            message.warning('수신 거부를 해제할 사용자를 선택해주세요.');
            return;
        }
        setLoading(true);
        // TODO: API call to batch resubscribe users
        console.log('Batch resubscribing users with keys:', selectedRowKeys);
        setTimeout(() => { // Simulate API delay
            setData(prevData => prevData.filter(item => !selectedRowKeys.includes(item.key)));
            message.success(`${selectedRowKeys.length}명의 사용자 수신 거부가 해제되었습니다.`);
            setSelectedRowKeys([]);
            setLoading(false);
        }, 800);
    };

    const columns = [
        {
            title: '사용자 ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 120,
            ...getColumnSearchProps('userId', '사용자 ID'),
             render: (text) => <><UserOutlined style={{ marginRight: 8 }} />{text}</>
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
            ...getColumnSearchProps('email', '이메일'),
             render: (text) => <><MailOutlined style={{ marginRight: 8 }} />{text}</>
        },
        {
            title: '연락처',
            dataIndex: 'phone',
            key: 'phone',
            width: 150,
            ...getColumnSearchProps('phone', '연락처'),
             render: (text) => <><PhoneOutlined style={{ marginRight: 8 }} />{text}</>
        },
        {
            title: '수신 거부 채널',
            dataIndex: 'channel',
            key: 'channel',
            width: 130,
             filters: [
                 { text: 'Push', value: 'Push' },
                 { text: 'Email', value: 'Email' },
                 { text: 'SMS', value: 'SMS' }, // Add other relevant channels
             ],
            onFilter: (value, record) => record.channel.indexOf(value) === 0,
            render: (channel) => (
                <Tag icon={<BellOutlined />} color={channel === 'Push' ? "blue" : channel === 'Email' ? "green" : "orange"}>
                    {channel}
                </Tag>
            )
        },
        {
            title: '수신 거부 사유',
            dataIndex: 'reason',
            key: 'reason',
            width: 180,
            ellipsis: true,
        },
        {
            title: '수신 거부 일시',
            dataIndex: 'unsubscribeDate',
            key: 'unsubscribeDate',
            width: 180,
            sorter: (a, b) => new Date(a.unsubscribeDate) - new Date(b.unsubscribeDate),
            defaultSortOrder: 'descend',
        },
        {
            title: '관리',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Popconfirm
                    title={`'${record.name}' 사용자의 ${record.channel} 수신 거부를 해제하시겠습니까?`}
                    onConfirm={() => handleResubscribe(record.key)}
                    okText="해제"
                    cancelText="취소"
                >
                    <Tooltip title="수신 거부 해제">
                        <Button icon={<UndoOutlined />} type="link" danger />
                    </Tooltip>
                </Popconfirm>
            ),
        },
    ];

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><StopOutlined style={{ marginRight: 8 }}/>수신 거부 관리</Title>
            <Text>사용자의 알림 채널별 수신 거부 내역을 관리합니다.</Text>

            <Card>
                <Row justify="space-between" style={{ marginBottom: 16 }}>
                     <Col>
                         {/* Add any global filters if needed, e.g., by channel */}
                         {/* <Select defaultValue="all" style={{ width: 150 }} onChange={(value) => console.log(value)}> */}
                         {/*     <Option value="all">모든 채널</Option> */}
                         {/*     <Option value="Push">Push</Option> */}
                         {/*     <Option value="Email">Email</Option> */}
                         {/* </Select> */}
                     </Col>
                     <Col>
                        <Popconfirm
                            title={`${selectedRowKeys.length}명의 수신 거부를 해제하시겠습니까?`}
                            onConfirm={handleBatchResubscribe}
                            okText="일괄 해제"
                            cancelText="취소"
                            disabled={!hasSelected || loading}
                        >
                            <Button
                                type="primary"
                                danger
                                icon={<UndoOutlined />}
                                disabled={!hasSelected || loading}
                                loading={loading && hasSelected} // Show loading only when batch action is running
                            >
                                선택 해제 ({selectedRowKeys.length})
                            </Button>
                         </Popconfirm>
                    </Col>
                </Row>

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data} // Use filtered data if applying filters server-side
                    loading={loading && !hasSelected} // Show loading only when fetching/globally changing
                    pagination={{ pageSize: 10, showSizeChanger: true }}
                    scroll={{ x: 1300 }}
                    bordered
                    size="small"
                />
            </Card>
        </Space>
    );
};

export default UnsubscribeManagement; 