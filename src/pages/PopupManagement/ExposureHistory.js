import React, { useState, useEffect } from 'react';
import {
    Table,
    Typography,
    Space,
    Card,
    DatePicker,
    Input,
    Button,
    Tooltip,
    Tag
} from 'antd';
import {
    EyeOutlined,
    CalendarOutlined,
    UserOutlined,
    SearchOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Sample Data
const initialExposureHistory = [
    { key: '1', popupId: 'pop001', popupName: '신규 기능 출시 안내', exposureTime: '2023-11-10 09:00:05', userId: 'user123', device: 'PC Web', pageUrl: '/main' },
    { key: '2', popupId: 'pop002', popupName: '블랙프라이데이 할인', exposureTime: '2023-11-10 09:01:15', userId: 'user456', device: 'Mobile App', pageUrl: '/products/sale' },
    { key: '3', popupId: 'pop001', popupName: '신규 기능 출시 안내', exposureTime: '2023-11-10 09:02:30', userId: 'user789', device: 'Mobile Web', pageUrl: '/main' },
    { key: '4', popupId: 'pop003', popupName: '긴급 시스템 점검', exposureTime: '2023-11-09 18:00:00', userId: 'admin01', device: 'PC Web', pageUrl: '/admin' },
    // ... more data
];

const ExposureHistory = () => {
    const [data, setData] = useState(initialExposureHistory);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    let searchInput = null;

    // Fetch data based on filters
    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = () => {
        setLoading(true);
        console.log("Fetching exposure history with filters:", filters);
        // TODO: Replace with API call
        // Example: /api/popup-exposure-history?startDate=...&endDate=...&popupId=...&userId=...
        setTimeout(() => { // Simulate API delay
            // Apply filters client-side for demo
            let filteredData = initialExposureHistory;
            if (filters.dateRange) {
                const [start, end] = filters.dateRange;
                filteredData = filteredData.filter(item => {
                    const itemDate = new Date(item.exposureTime);
                    return itemDate >= start && itemDate <= end;
                });
            }
            if (filters.popupId) {
                 filteredData = filteredData.filter(item =>
                     item.popupId.toLowerCase().includes(filters.popupId.toLowerCase())
                 );
             }
             if (filters.userId) {
                 filteredData = filteredData.filter(item =>
                     item.userId.toLowerCase().includes(filters.userId.toLowerCase())
                 );
             }
            setData(filteredData);
            setLoading(false);
        }, 500);
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const handleResetFilters = () => {
        setFilters({});
        // Need to clear input refs if using getColumnSearchProps
        setSearchText('');
        setSearchedColumn('');
        fetchData(); // Refetch with empty filters
    };

     // --- Search Logic (Similar to other tables) ---
     const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        handleFilterChange(dataIndex, selectedKeys[0]); // Use handleFilterChange
    };

    const handleReset = (clearFilters, dataIndex) => {
        clearFilters();
        setSearchText('');
        // Update filters state
        setFilters(prev => {
            const newFilters = { ...prev };
            delete newFilters[dataIndex];
            return newFilters;
        });
        // No need to call fetchData here, useEffect handles it
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
         // Filter logic is handled by useEffect based on filters state
         // onFilter: (value, record) => ...
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

    // --- Table Columns ---
    const columns = [
        {
            title: '팝업 ID',
            dataIndex: 'popupId',
            key: 'popupId',
             ...getColumnSearchProps('popupId', '팝업 ID'),
        },
        {
            title: '팝업명',
            dataIndex: 'popupName',
            key: 'popupName',
            ellipsis: true,
        },
        {
            title: '노출 시각',
            dataIndex: 'exposureTime',
            key: 'exposureTime',
            sorter: (a, b) => new Date(a.exposureTime) - new Date(b.exposureTime),
            defaultSortOrder: 'descend',
            width: 180,
        },
        {
            title: '노출 사용자 ID',
            dataIndex: 'userId',
            key: 'userId',
             ...getColumnSearchProps('userId', '사용자 ID'),
             render: (text) => <><UserOutlined style={{ marginRight: 5 }} />{text}</>
        },
        {
            title: '디바이스',
            dataIndex: 'device',
            key: 'device',
            filters: [
                 { text: 'PC Web', value: 'PC Web' },
                 { text: 'Mobile Web', value: 'Mobile Web' },
                 { text: 'Mobile App', value: 'Mobile App' },
            ],
            onFilter: (value, record) => record.device.indexOf(value) === 0,
             render: (device) => {
                let color = 'geekblue';
                if (device === 'Mobile App') color = 'volcano';
                if (device === 'Mobile Web') color = 'green';
                return <Tag color={color}>{device}</Tag>;
            }
        },
        {
            title: '노출 페이지 URL',
            dataIndex: 'pageUrl',
            key: 'pageUrl',
            ellipsis: true,
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><EyeOutlined /> 팝업 노출 내역</Title>
            <Text>팝업이 사용자에게 노출된 기록을 조회합니다.</Text>

            <Card>
                <Space style={{ marginBottom: 16 }} wrap>
                     <Text>노출 기간:</Text>
                     <RangePicker
                         showTime
                         onChange={(dates) => handleFilterChange('dateRange', dates)}
                         value={filters.dateRange || null}
                     />
                     {/* Keep the individual search inputs or remove if using getColumnSearchProps */}
                     {/*
                     <Text>팝업 ID:</Text>
                     <Input
                         placeholder="팝업 ID 검색"
                         value={filters.popupId || ''}
                         onChange={(e) => handleFilterChange('popupId', e.target.value)}
                         style={{ width: 150 }}
                         allowClear
                     />
                     <Text>사용자 ID:</Text>
                     <Input
                         placeholder="사용자 ID 검색"
                         value={filters.userId || ''}
                         onChange={(e) => handleFilterChange('userId', e.target.value)}
                         style={{ width: 150 }}
                         allowClear
                     />
                     */}
                     <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>초기화</Button>
                     {/* <Button type="primary" icon={<SearchOutlined />} onClick={fetchData}>검색</Button> */}
                 </Space>

                <Table
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{ pageSize: 15 }}
                    scroll={{ x: 1000 }}
                    bordered
                    size="small"
                />
            </Card>
        </Space>
    );
};

export default ExposureHistory; 