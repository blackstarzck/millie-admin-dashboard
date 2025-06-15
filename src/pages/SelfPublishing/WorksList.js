import React, { useState, useMemo } from 'react';
import {
    Table,
    Space,
    Typography,
    Input,
    Select,
    DatePicker,
    Tag,
    Button,
    Tooltip,
    Image,
    Modal,
    Spin,
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    FileOutlined,
    FileImageOutlined,
    FilePdfOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// --- Sample Data ---
const initialWorks = [
    {
        key: 'book001',
        id: 1,
        title: '곰의 첫 겨울',
        author: '글쓰는곰',
        category: '동화',
        subCategory: '동화',
        publishDate: '2024-01-10',
        sales: 156,
        views: 1250,
        coverFile: 'bear_winter.jpg',
        fileName: 'bear_winter.epub',
        contentType: '종이책'
    },
    {
        key: 'book002',
        id: 2,
        title: '숲 속 친구들',
        author: '글쓰는곰',
        category: '동화',
        subCategory: '동화',
        publishDate: '2024-03-22',
        sales: 89,
        views: 980,
        coverFile: 'forest_friends.jpg',
        fileName: 'forest_friends.epub',
        contentType: '전자책'
    },
    {
        key: 'book003',
        id: 3,
        title: '배고픈 곰',
        author: '글쓰는곰',
        category: '그림책',
        subCategory: '그림책',
        publishDate: null,
        sales: 0,
        views: 0,
        coverFile: 'hungry_bear.jpg',
        fileName: 'hungry_bear.epub',
        contentType: '종이책'
    },
    {
        key: 'book004',
        id: 4,
        title: '나무의 노래',
        author: '책짓는나무',
        category: '시',
        subCategory: '시',
        publishDate: '2024-06-15',
        sales: 45,
        views: 320,
        coverFile: 'tree_song.jpg',
        fileName: 'tree_song.epub',
        contentType: '전자책'
    },
    {
        key: 'book005',
        id: 5,
        title: '별 헤는 밤',
        author: '상상여행자',
        category: '판타지',
        subCategory: '판타지',
        publishDate: '2023-11-01',
        sales: 234,
        views: 2100,
        coverFile: 'starry_night.jpg',
        fileName: 'starry_night.epub',
        contentType: '종이책'
    },
    {
        key: 'book006',
        id: 6,
        title: '구름 위 산책',
        author: '상상여행자',
        category: '판타지',
        subCategory: '판타지',
        publishDate: null,
        sales: 0,
        views: 0,
        coverFile: 'cloud_walk.jpg',
        fileName: 'cloud_walk.epub',
        contentType: '전자책'
    },
    {
        key: 'book007',
        id: 7,
        title: '시간 여행자의 일기',
        author: '상상여행자',
        category: 'SF',
        subCategory: 'SF',
        publishDate: '2024-04-01',
        sales: 167,
        views: 1450,
        coverFile: 'time_traveler.jpg',
        fileName: 'time_traveler.epub',
        contentType: '종이책'
    },
    {
        key: 'book008',
        id: 8,
        title: '꿈꾸는 로봇',
        author: '상상여행자',
        category: 'SF',
        subCategory: 'SF',
        publishDate: '2024-05-12',
        sales: 145,
        views: 1320,
        coverFile: 'dreaming_robot.jpg',
        fileName: 'dreaming_robot.epub',
        contentType: '전자책'
    },
    {
        key: 'book009',
        id: 9,
        title: '마법의 지도',
        author: '상상여행자',
        category: '판타지',
        subCategory: '판타지',
        publishDate: null,
        sales: 0,
        views: 0,
        coverFile: 'magic_map.jpg',
        fileName: 'magic_map.epub',
        contentType: '종이책'
    },
    {
        key: 'book010',
        id: 10,
        title: '사라진 도시',
        author: '상상여행자',
        category: '미스터리',
        subCategory: '미스터리',
        publishDate: null,
        sales: 0,
        views: 0,
        coverFile: 'lost_city.jpg',
        fileName: 'lost_city.epub',
        contentType: '전자책'
    },
    {
        key: 'book011',
        id: 11,
        title: '미래 탐험',
        author: '상상여행자',
        category: 'SF',
        subCategory: 'SF',
        publishDate: '2024-08-15',
        sales: 78,
        views: 890,
        coverFile: 'future_exploration.jpg',
        fileName: 'future_exploration.epub',
        contentType: '종이책'
    }
];

// --- Sample Cover Images ---
const sampleCoverImageUrls = [
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-1.png?alt=media&token=3bd34326-431b-4654-aef3-7db0f2738972",
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-10.png?alt=media&token=d3452afd-608a-4529-87a9-c8871872ff7f",
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-3.png?alt=media&token=cd0f35a8-a09c-4cd5-a527-2c229066d279",
];

const WorksList = () => {
    const [works, setWorks] = useState(initialWorks);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ category: null, dateRange: null });
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [selectedCover, setSelectedCover] = useState(null);

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

    const handleCoverClick = (coverFile, e) => {
        e.stopPropagation();
        if (!coverFile) return;
        
        const randomImage = sampleCoverImageUrls[Math.floor(Math.random() * sampleCoverImageUrls.length)];
        setSelectedCover(randomImage);
        setIsCoverModalOpen(true);
    };

    const handleCoverModalClose = () => {
        setIsCoverModalOpen(false);
        
        setSelectedCover(null);
    };

    // --- Filtering Logic ---
    const filteredWorks = useMemo(() => {
        return works.filter(work => {
            const matchesSearch = searchText
                ? work.title.toLowerCase().includes(searchText) || work.author.toLowerCase().includes(searchText)
                : true;
            const matchesCategory = filters.category ? work.category === filters.category : true;
            const matchesDate = filters.dateRange && work.publishDate
                ? moment(work.publishDate).isBetween(filters.dateRange[0], filters.dateRange[1], 'day', '[]')
                : true;
            return matchesSearch && matchesCategory && matchesDate;
        });
    }, [works, searchText, filters]);

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: '표지',
            dataIndex: 'coverFile',
            key: 'coverFile',
            align: 'center',
            width: 100,
            render: (coverFile) => {
                if (!coverFile) return '-';
                const randomImage = sampleCoverImageUrls[Math.floor(Math.random() * sampleCoverImageUrls.length)];
                return (
                    <Tooltip title={coverFile}>
                        <div 
                            style={{ 
                                width: '60px', 
                                height: '80px', 
                                cursor: 'pointer',
                                overflow: 'hidden',
                                borderRadius: '4px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            onClick={(e) => handleCoverClick(coverFile, e)}
                        >
                            <Image
                                src={randomImage}
                                alt={coverFile}
                                style={{ 
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                                preview={false}
                            />
                        </div>
                    </Tooltip>
                );
            },
        },
        { title: '제목', dataIndex: 'title', key: 'title', ellipsis: true },
        { title: '작가', dataIndex: 'author', key: 'author' },
        { title: '카테고리', dataIndex: 'category', key: 'category' },
        { title: '세부 카테고리', dataIndex: 'subCategory', key: 'subCategory' },
        {
            title: '출간일',
            dataIndex: 'publishDate',
            key: 'publishDate',
            render: (date) => date || '-',
            sorter: (a, b) => moment(a.publishDate || 0).unix() - moment(b.publishDate || 0).unix(),
        },
        {
            title: '판매량',
            dataIndex: 'sales',
            key: 'sales',
            sorter: (a, b) => a.sales - b.sales,
        },
        {
            title: '조회수',
            dataIndex: 'views',
            key: 'views',
            render: (views) => views ? views.toLocaleString() : '-',
            sorter: (a, b) => a.views - b.views,
        },
        {
            title: '관리',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="상세보기">
                        <Button type="text" icon={<EyeOutlined />} />
                    </Tooltip>
                    <Tooltip title="수정">
                        <Button type="text" icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title="삭제">
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Space align="center">
                <Title level={2}>작품 목록</Title>
            </Space>
            <Text type="secondary">자가출판 작품들의 목록을 확인하고 관리할 수 있습니다.</Text>

            {/* Search and Filter Controls */}
            <Space wrap style={{ marginBottom: 16, justifyContent: 'space-between', width: '100%' }}>
                <Space wrap>
                    <Search
                        placeholder="제목 또는 작가 검색"
                        allowClear
                        enterButton={<><SearchOutlined /> 검색</>}
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                    />
                    <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                    <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={(value) => handleFilterChange('category', value)}
                    >
                        <Option value="all">전체 카테고리</Option>
                        <Option value="소설">소설</Option>
                        <Option value="교육">교육</Option>
                        <Option value="요리">요리</Option>
                    </Select>
                    <RangePicker onChange={handleDateChange} placeholder={['출간 시작일', '출간 종료일']} />
                </Space>
            </Space>

            {/* Works Table */}
            <Table
                columns={columns}
                dataSource={filteredWorks}
                pagination={{ pageSize: 10 }}
                rowKey="key"
            />

            {/* Cover Image Modal */}
            <Modal
                title="표지 이미지"
                open={isCoverModalOpen}
                onCancel={handleCoverModalClose}
                footer={null}
                width={400}
                destroyOnClose={true}
                bodyStyle={{ 
                    padding: '24px',
                    height: '500px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {selectedCover && (
                    <Image
                        src={selectedCover}
                        alt="표지 이미지"
                        style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                        preview={false}
                        placeholder={
                            <div style={{ 
                                width: '100%', 
                                height: '100%', 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                background: '#f5f5f5'
                            }}>
                                <Spin size="large" />
                            </div>
                        }
                    />
                )}
            </Modal>
        </Space>
    );
};

export default WorksList; 