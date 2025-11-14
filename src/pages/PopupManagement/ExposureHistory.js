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
    Tag,
    Modal,
    Descriptions,
    Switch
} from 'antd';
import {
    EyeOutlined,
    CalendarOutlined,
    UserOutlined,
    SearchOutlined,
    ReloadOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Sample Data - PopupCreation.js와 일치하는 필드 구조 사용
const pageList = [
    { id: 'platform_main', name: '메인' },
    { id: 'search_result', name: '검색 결과' },
    { id: 'book_detail', name: '도서 상세' },
    { id: 'viewer', name: '뷰어' },
    { id: 'my_library', name: '내 서재' },
    { id: 'category_best', name: '카테고리/베스트' },
    { id: 'event_detail', name: '이벤트 상세' },
    { id: 'user_profile', name: '사용자 프로필' },
    { id: 'subscription_info', name: '구독 정보' },
];

const initialExposureHistory = [
    { key: '1', popupId: 'pop001', popupName: '신규 기능 출시 안내', exposureTime: '2023-11-10 09:00:05', userId: 'user123', device: 'PC Web', pageUrl: '/main', priority: 1, creationDate: '2024-06-30', status: true, startDate: '2024-07-01 00:00', endDate: '2024-07-31 23:59', contentType: 'template', templateId: '신규 기능 안내 템플릿', linkUrl: null, imageUrl: null, title: '신규 기능 출시!', exposurePages: ['platform_main'], hideOptions: ['day'], frequencyType: 'once_per_day', variables: { '[feature_name]': 'AI 추천 기능', '[link]': 'https://example.com/feature' } },
    { key: '2', popupId: 'pop002', popupName: '블랙프라이데이 할인', exposureTime: '2023-11-10 09:01:15', userId: 'user456', device: 'Mobile App', pageUrl: '/products/sale', priority: 5, creationDate: '2024-11-01', status: false, startDate: '2024-11-20 00:00', endDate: '2024-11-30 23:59', contentType: 'image', imageUrl: 'https://via.placeholder.com/300x200.png?text=Black+Friday', linkUrl: 'https://example.com/sale', templateId: null, title: null, exposurePages: ['category_best', 'event_detail'], hideOptions: ['day', 'week'], frequencyType: 'once_per_session', variables: null },
    { key: '3', popupId: 'pop001', popupName: '신규 기능 출시 안내', exposureTime: '2023-11-10 09:02:30', userId: 'user789', device: 'Mobile Web', pageUrl: '/main', priority: 1, creationDate: '2024-06-30', status: true, startDate: '2024-07-01 00:00', endDate: '2024-07-31 23:59', contentType: 'template', templateId: '신규 기능 안내 템플릿', linkUrl: null, imageUrl: null, title: '신규 기능 출시!', exposurePages: ['platform_main'], hideOptions: ['day'], frequencyType: 'once_per_day', variables: { '[feature_name]': 'AI 추천 기능', '[link]': 'https://example.com/feature' } },
    { key: '4', popupId: 'pop003', popupName: '긴급 시스템 점검', exposureTime: '2023-11-09 18:00:00', userId: 'admin01', device: 'PC Web', pageUrl: '/admin', priority: 10, creationDate: '2024-07-28', status: true, startDate: '2024-07-28 18:00', endDate: '2024-07-29 06:00', contentType: 'image', imageUrl: 'https://via.placeholder.com/300x150.png?text=System+Maintenance', linkUrl: null, templateId: null, title: null, exposurePages: [], hideOptions: [], frequencyType: 'every_time', variables: null },
    { key: '5', popupId: 'pop005', popupName: '대시보드 전용 공지', exposureTime: '2024-08-15 14:30:20', userId: 'user999', device: 'Mobile App', pageUrl: '/dashboard', priority: 2, creationDate: '2024-08-14', status: true, startDate: '2024-08-15 00:00', endDate: '2024-08-16 23:59', contentType: 'template', templateId: '긴급 공지 팝업 템플릿', linkUrl: null, imageUrl: null, title: '중요 공지사항', exposurePages: ['my_library'], hideOptions: ['week'], frequencyType: 'once_per_session', variables: null },
    // ... more data
];

const ExposureHistory = () => {
    const [data, setData] = useState(initialExposureHistory);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
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

    // --- Preview Modal Logic ---
    const showPreviewModal = (item) => {
        setSelectedHistoryItem(item);
        setIsPreviewModalOpen(true);
    };

    const handlePreviewCancel = () => {
        setIsPreviewModalOpen(false);
        setSelectedHistoryItem(null);
    };

    // --- Table Columns ---
    const columns = [
        {
            title: 'ID',
            dataIndex: 'popupId',
            key: 'popupId',
             ...getColumnSearchProps('popupId', '팝업 ID'),
            width: 100,
        },
        {
            title: '팝업 이름',
            dataIndex: 'popupName',
            key: 'popupName',
            width: 200,
            ellipsis: true,
        },
        {
            title: '등록일',
            dataIndex: 'creationDate',
            key: 'creationDate',
            width: 120,
            render: (date) => moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : '-',
            sorter: (a, b) => moment(a.creationDate).unix() - moment(b.creationDate).unix(),
        },
        {
            title: '노출 기간',
            key: 'period',
            width: 220,
            render: (_, record) => (
                record.startDate && record.endDate
                 ? `${moment(record.startDate).format('YY/MM/DD HH:mm')} ~ ${moment(record.endDate).format('YY/MM/DD HH:mm')}`
                 : '-'
            )
        },
        {
            title: '우선순위',
            dataIndex: 'priority',
            key: 'priority',
            width: 80,
            align: 'right',
            sorter: (a, b) => (a.priority || 0) - (b.priority || 0),
        },
        {
            title: '관리',
            key: 'action',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Tooltip title="팝업 정보 보기">
                    <Button icon={<EyeOutlined />} onClick={() => showPreviewModal(record)} size="small" />
                </Tooltip>
            ),
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
                    scroll={{ x: 1600 }}
                    bordered
                    size="small"
                    rowKey="key"
                />
            </Card>

            {/* Preview Modal Definition */}
            <Modal
                title="팝업 노출 상세 정보 (참고용)"
                open={isPreviewModalOpen}
                onCancel={handlePreviewCancel}
                footer={[
                    <Button key="close" onClick={handlePreviewCancel}>
                        닫기
                    </Button>,
                ]}
                width={600}
            >
                {selectedHistoryItem && (
                    <Descriptions bordered column={1} size="small">
                        {/* 팝업 생성 페이지의 입력 항목 순서대로 표시 */}
                        <Descriptions.Item label="팝업 ID">{selectedHistoryItem.popupId || '-'}</Descriptions.Item>
                        <Descriptions.Item label="등록일">{selectedHistoryItem.creationDate ? moment(selectedHistoryItem.creationDate).format('YYYY-MM-DD') : '-'}</Descriptions.Item>
                        <Descriptions.Item label="팝업 이름 (관리용)">{selectedHistoryItem.popupName}</Descriptions.Item>

                        {selectedHistoryItem.imageUrl && (
                            <Descriptions.Item label="팝업 이미지">
                                <a href={selectedHistoryItem.imageUrl} target="_blank" rel="noopener noreferrer">{selectedHistoryItem.imageUrl}</a>
                            </Descriptions.Item>
                        )}

                        <Descriptions.Item label="연결 URL (클릭 시 이동)">
                            {selectedHistoryItem.linkUrl ? (
                                <a href={selectedHistoryItem.linkUrl} target="_blank" rel="noopener noreferrer">{selectedHistoryItem.linkUrl}</a>
                            ) : '-'}
                        </Descriptions.Item>

                        <Descriptions.Item label="노출 기간">
                            {selectedHistoryItem.startDate && selectedHistoryItem.endDate
                                ? `${moment(selectedHistoryItem.startDate).format('YYYY-MM-DD HH:mm')} ~ ${moment(selectedHistoryItem.endDate).format('YYYY-MM-DD HH:mm')}`
                                : '-'}
                        </Descriptions.Item>

                        <Descriptions.Item label="노출 페이지">
                            {selectedHistoryItem.exposurePages && Array.isArray(selectedHistoryItem.exposurePages) && selectedHistoryItem.exposurePages.length > 0
                                ? selectedHistoryItem.exposurePages.map(pageId => {
                                    const page = pageList.find(p => p.id === pageId);
                                    return page ? page.name : pageId;
                                }).join(', ')
                                : '전체 노출'}
                        </Descriptions.Item>

                        <Descriptions.Item label="페이지 내 초기 우선순위">{selectedHistoryItem.priority ?? '-'}</Descriptions.Item>

                        <Descriptions.Item label="다시 보지 않기 옵션">
                            {(() => {
                                const hideOption = Array.isArray(selectedHistoryItem.hideOptions) && selectedHistoryItem.hideOptions.length > 0
                                    ? selectedHistoryItem.hideOptions[0]
                                    : (selectedHistoryItem.hideOptions || null);

                                if (hideOption === 'day') return '하루 동안 보지 않기';
                                if (hideOption === 'week') return '일주일 동안 보지 않기';
                                return hideOption || '없음';
                            })()}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </Space>
    );
};

export default ExposureHistory;
