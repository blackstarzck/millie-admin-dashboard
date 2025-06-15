import React, { useState, useMemo } from 'react';
import {
    Table,
    Button,
    Tag,
    Space,
    Typography,
    message,
    Popconfirm,
    Tooltip,
    Input,
    Select,
    DatePicker, // For filtering by request date
    Modal,
    Descriptions,
    Image,
    Spin,
} from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    SearchOutlined,
    FilterOutlined,
    ClockCircleOutlined, // 승인대기 아이콘
    CheckSquareOutlined, // 승인 아이콘
    CloseSquareOutlined, // 반려 아이콘
    FileOutlined,
    FileImageOutlined, // JPG 아이콘
    FilePdfOutlined,   // PDF 아이콘
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

// --- Sample Data ---
const initialApprovals = [
    { key: '1', id: 1, contentType: '전자책', title: 'React Hooks 심층 분석', subtitle: '상태 관리부터 최적화까지', requester: '김현수', requestDate: '2024-07-28', status: 'pending', categoryName: 'g29', isAdult: 'all', productionPurpose: 'external', fileName: 'React_Hooks_Deep_Dive.epub', coverFile: 'react_hooks_cover.jpg' },
    { key: '2', id: 2, contentType: '오디오북', title: '미움받을 용기', subtitle: '(요약본)', requester: '최다희', requestDate: '2024-07-26', status: 'approved', categoryName: 'g21', isAdult: 'all', productionPurpose: 'external', fileName: 'Courage_to_be_Disliked_Summary.mp3', coverFile: 'courage_cover.jpg' },
    { key: '3', id: 3, contentType: '전자책', title: '알고리즘 문제 해결 전략', subtitle: '종합편', requester: '이정훈', requestDate: '2024-07-25', status: 'rejected', rejectReason: '표지 이미지 품질 미달', categoryName: 'g29', isAdult: 'all', productionPurpose: 'external', fileName: null, coverFile: null },
    { key: '4', id: 4, contentType: '전자책', title: '클린 코드', subtitle: '(개정판)', requester: '김현수', requestDate: '2024-07-29', status: 'pending', categoryName: 'g29', isAdult: 'all', productionPurpose: 'external', fileName: 'CleanCode_Revised.epub', coverFile: 'clean_code_cover.jpg' },
    { key: '5', id: 5, contentType: '오디오북', title: '부자 아빠 가난한 아빠', subtitle: '재테크의 시작', requester: '박지성', requestDate: '2024-07-30', status: 'pending', categoryName: 'g17', isAdult: 'all', productionPurpose: 'external', fileName: 'Rich_Dad_Poor_Dad.mp3', coverFile: 'rich_dad_cover.jpg' },
    { key: '6', id: 6, contentType: '전자책', title: '인간관계의 심리학', subtitle: '성공적인 대인관계를 위한 가이드', requester: '이미영', requestDate: '2024-07-31', status: 'pending', categoryName: 'g21', isAdult: 'all', productionPurpose: 'external', fileName: 'Psychology_of_Relationships.epub', coverFile: 'psychology_cover.jpg' },
    { key: '7', id: 7, contentType: '오디오북', title: '마음의 평화를 찾아서', subtitle: '명상과 마음챙김', requester: '정민수', requestDate: '2024-08-01', status: 'approved', categoryName: 'g21', isAdult: 'all', productionPurpose: 'external', fileName: 'Finding_Peace_of_Mind.mp3', coverFile: 'peace_cover.jpg' },
    { key: '8', id: 8, contentType: '전자책', title: '스타트업 성공 전략', subtitle: '실패 없는 창업 가이드', requester: '김태호', requestDate: '2024-08-02', status: 'pending', categoryName: 'g17', isAdult: 'all', productionPurpose: 'external', fileName: 'Startup_Success_Guide.epub', coverFile: 'startup_cover.jpg' },
    { key: '9', id: 9, contentType: '오디오북', title: '영어 회화 마스터', subtitle: '실전 대화 중심 학습법', requester: '최유진', requestDate: '2024-08-03', status: 'rejected', rejectReason: '음성 품질 미달', categoryName: 'g34', isAdult: 'all', productionPurpose: 'external', fileName: 'English_Conversation_Master.mp3', coverFile: 'english_cover.jpg' },
    { key: '10', id: 10, contentType: '전자책', title: '건강한 식습관', subtitle: '영양사가 알려주는 식단 관리', requester: '박소연', requestDate: '2024-08-04', status: 'pending', categoryName: 'g33', isAdult: 'all', productionPurpose: 'external', fileName: 'Healthy_Eating_Habits.epub', coverFile: 'health_cover.jpg' },
    { key: '11', id: 11, contentType: '오디오북', title: '주식 투자 기초', subtitle: '초보자를 위한 가이드', requester: '이준호', requestDate: '2024-08-05', status: 'pending', categoryName: 'g19', isAdult: 'all', productionPurpose: 'external', fileName: 'Stock_Investment_Basics.mp3', coverFile: 'stock_cover.jpg' },
    { key: '12', id: 12, contentType: '전자책', title: '디지털 마케팅 전략', subtitle: '온라인 비즈니스 성공법', requester: '김지원', requestDate: '2024-08-06', status: 'approved', categoryName: 'g18', isAdult: 'all', productionPurpose: 'external', fileName: 'Digital_Marketing_Strategy.epub', coverFile: 'marketing_cover.jpg' },
    { key: '13', id: 13, contentType: '오디오북', title: '행복한 부모되기', subtitle: '자녀 교육의 모든 것', requester: '이수진', requestDate: '2024-08-07', status: 'pending', categoryName: 'g33', isAdult: 'all', productionPurpose: 'external', fileName: 'Happy_Parenting.mp3', coverFile: 'parenting_cover.jpg' },
    { key: '14', id: 14, contentType: '전자책', title: '프로그래밍 입문', subtitle: '코딩의 첫걸음', requester: '박민준', requestDate: '2024-08-08', status: 'pending', categoryName: 'g29', isAdult: 'all', productionPurpose: 'external', fileName: 'Programming_Basics.epub', coverFile: 'programming_cover.jpg' },
];

// --- Sample Cover Images ---
const sampleCoverImageUrls = [
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-1.png?alt=media&token=3bd34326-431b-4654-aef3-7db0f2738972",
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-10.png?alt=media&token=d3452afd-608a-4529-87a9-c8871872ff7f",
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-3.png?alt=media&token=cd0f35a8-a09c-4cd5-a527-2c229066d279",
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FM-AG1-1.png?alt=media&token=21827222-9c14-4828-8918-3569b2c08ce5",
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/HP1%2FF-HP1-10.png?alt=media&token=1d7d51d6-78d6-4bba-b5db-a96453e605ab",
    "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/HP1%2FF-HP1-12.png?alt=media&token=3292f705-5a04-4201-8fe3-4cabbbf1998a",
];

// --- Helper Functions ---
const getStatusTag = (status) => {
    switch (status) {
        case 'pending': return <Tag icon={<ClockCircleOutlined />} color="warning">승인대기</Tag>;
        case 'approved': return <Tag icon={<CheckSquareOutlined />} color="success">승인완료</Tag>;
        case 'rejected': return <Tag icon={<CloseSquareOutlined />} color="error">반려</Tag>;
        default: return <Tag>{status}</Tag>;
    }
};

// --- Category Mapping ---
const categoryMap = {
    'g1': '시·에세이',
    'g2': '　 시집',
    'g3': '　 에세이',
    'g4': '　 기타도서',
    'g5': '소설',
    'g6': '　 일반',
    'g7': '　 로맨스',
    'g8': '　 판타지',
    'g9': '　 BL',
    'g10': '　 무협',
    'g11': '　 추리·스릴러·미스터리',
    'g12': '　 기타',
    'g13': '　 SF소설',
    'g14': '전기·회고록',
    'g15': '　 자서전',
    'g16': '　 기타',
    'g17': '경영·경제·자기계발',
    'g18': '　 경영',
    'g19': '　 경제',
    'g20': '　 기타',
    'g21': '인문사회',
    'g22': '　 인문',
    'g23': '　 정치·사회',
    'g24': '　 역사',
    'g25': '　 종교',
    'g26': '　 예술·문화·기타',
    'g27': '　 SF장르',
    'g28': '기타',
    'g29': '　 과학·IT',
    'g30': '　 어린이·청소년',
    'g31': '　 진학·진로',
    'g32': '　 여행',
    'g33': '　 가정·생활',
    'g34': '　 교재·참고서',
    'g35': '무료·체험판',
};

// --- Component ---
const ContentApproval = () => {
    const [approvals, setApprovals] = useState(initialApprovals);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ status: null, contentType: null, dateRange: null, categoryName: null });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
    const [selectedCover, setSelectedCover] = useState(null);

    // 각 작품의 표지 이미지를 고정하기 위한 useMemo
    const worksWithCoverImages = useMemo(() => {
        return approvals.map(work => ({
            ...work,
            coverImageUrl: work.coverFile ? sampleCoverImageUrls[Math.floor(Math.random() * sampleCoverImageUrls.length)] : null
        }));
    }, [approvals]);

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

    const handleApprove = (key) => {
        setApprovals(prev =>
            prev.map(item => item.key === key ? { ...item, status: 'approved', rejectReason: undefined } : item)
        );
        message.success('콘텐츠가 승인되었습니다.');
        // TODO: API Call to update status
        console.log(`Approved item key: ${key}`);
    };

    const handleReject = (key, reason = '관리자에 의해 반려됨') => {
        // For simplicity, using a default reason. In reality, might prompt for a reason.
        setApprovals(prev =>
            prev.map(item => item.key === key ? { ...item, status: 'rejected', rejectReason: reason } : item)
        );
        message.error('콘텐츠가 반려되었습니다.');
        handleModalClose(); // Close modal after action
        // TODO: API Call to update status
        console.log(`Rejected item key: ${key}, Reason: ${reason}`);
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
        console.log('View details for:', item);
    };

    // Added function to close modal
    const handleModalClose = () => {
        setIsDetailModalOpen(false);
        setSelectedItem(null);
    };

    const handleCoverClick = (coverImageUrl, e) => {
        e.stopPropagation();
        if (!coverImageUrl) return;
        setSelectedCover(coverImageUrl);
        setIsCoverModalOpen(true);
    };

    const handleCoverModalClose = () => {
        setIsCoverModalOpen(false);
        setSelectedCover(null);
    };

    // --- Filtering Logic ---
    const filteredApprovals = useMemo(() => {
        return worksWithCoverImages.filter(item => {
            const matchesSearch = searchText
                ? item.title.toLowerCase().includes(searchText) || item.requester.toLowerCase().includes(searchText)
                : true;
            const matchesStatus = filters.status ? item.status === filters.status : true;
            const matchesCategory = filters.categoryName ? item.categoryName === filters.categoryName : true;
            const matchesDate = filters.dateRange
                ? moment(item.requestDate).isBetween(filters.dateRange[0], filters.dateRange[1], 'day', '[]')
                : true;
            return matchesSearch && matchesStatus && matchesCategory && matchesDate;
        });
    }, [worksWithCoverImages, searchText, filters]);

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        {
            title: '표지',
            dataIndex: 'coverFile',
            key: 'coverFile',
            align: 'center',
            width: 100,
            render: (coverFile, record) => {
                if (!coverFile) return '-';
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
                            onClick={(e) => handleCoverClick(record.coverImageUrl, e)}
                        >
                            <Image
                                src={record.coverImageUrl}
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
        { title: '카테고리', dataIndex: 'categoryName', key: 'categoryName',
            filters: [
                { text: '시·에세이', value: 'g1' },
                { text: '\u3000 시집', value: 'g2' },
                { text: '\u3000 에세이', value: 'g3' },
                { text: '\u3000 기타도서', value: 'g4' },
                { text: '소설', value: 'g5' },
                { text: '\u3000 일반', value: 'g6' },
                { text: '\u3000 로맨스', value: 'g7' },
                { text: '\u3000 판타지', value: 'g8' },
                { text: '\u3000 BL', value: 'g9' },
                { text: '\u3000 무협', value: 'g10' },
                { text: '\u3000 추리·스릴러·미스터리', value: 'g11' },
                { text: '\u3000 기타', value: 'g12' },
                { text: '\u3000 SF소설', value: 'g13' },
                { text: '전기·회고록', value: 'g14' },
                { text: '\u3000 자서전', value: 'g15' },
                { text: '\u3000 기타', value: 'g16' },
                { text: '경영·경제·자기계발', value: 'g17' },
                { text: '\u3000 경영', value: 'g18' },
                { text: '\u3000 경제', value: 'g19' },
                { text: '\u3000 기타', value: 'g20' },
                { text: '인문사회', value: 'g21' },
                { text: '\u3000 인문', value: 'g22' },
                { text: '\u3000 정치·사회', value: 'g23' },
                { text: '\u3000 역사', value: 'g24' },
                { text: '\u3000 종교', value: 'g25' },
                { text: '\u3000 예술·문화·기타', value: 'g26' },
                { text: '\u3000 SF장르', value: 'g27' },
                { text: '기타', value: 'g28' },
                { text: '\u3000 과학·IT', value: 'g29' },
                { text: '\u3000 어린이·청소년', value: 'g30' },
                { text: '\u3000 진학·진로', value: 'g31' },
                { text: '\u3000 여행', value: 'g32' },
                { text: '\u3000 가정·생활', value: 'g33' },
                { text: '\u3000 교재·참고서', value: 'g34' },
                { text: '무료·체험판', value: 'g35' },
            ],
            onFilter: (value, record) => record.categoryName === value,
            render: (categoryValue) => categoryMap[categoryValue] || categoryValue || '-',
        },
        { title: '콘텐츠 타입', dataIndex: 'contentType', key: 'contentType' },
        { title: '제목', dataIndex: 'title', key: 'title', ellipsis: true, render: (text) => <Link onClick={() => message.info('콘텐츠 상세 링크 클릭 (구현 필요)')}>{text}</Link> },
        { title: '부제', dataIndex: 'subtitle', key: 'subtitle', ellipsis: true },
        { title: '작가', dataIndex: 'requester', key: 'requester' },
        {
            title: '파일',
            dataIndex: 'fileName',
            key: 'fileName',
            align: 'center',
            render: (fileName) => fileName 
                ? <Tooltip title={fileName}><FileOutlined style={{ fontSize: '16px' }} /></Tooltip> // Wrap icon with Tooltip
                : '-',
        },
        {
            title: '요청일', dataIndex: 'requestDate', key: 'requestDate',
            sorter: (a, b) => moment(a.requestDate).unix() - moment(b.requestDate).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', align: 'center',
            render: (status) => getStatusTag(status),
             filters: [
                { text: '승인대기', value: 'pending' },
                { text: '승인완료', value: 'approved' },
                { text: '반려', value: 'rejected' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: '성인도서', 
            dataIndex: 'isAdult', 
            key: 'isAdult', 
            align: 'center',
            render: (isAdult) => isAdult === 'adult' ? <Tag color="red">성인</Tag> : <Tag color="blue">전연령</Tag>
        },
        {
            title: '제작목적', 
            dataIndex: 'productionPurpose', 
            key: 'productionPurpose', 
            ellipsis: true,
            render: (purpose) => purpose === 'external' ? 'ISBN 판매용' : (purpose === 'internal' ? '일반 판매용' : '-')
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Space align="center">
                <Title level={2}>심사 관리</Title>
            </Space>
            <Text type="secondary">등록 요청된 콘텐츠를 검토하고 승인 또는 반려합니다.</Text>

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
                        onChange={(value) => handleFilterChange('status', value)}
                        aria-label="상태 필터"
                    >
                        <Option value="all">전체 상태</Option>
                        <Option value="pending">승인대기</Option>
                        <Option value="approved">승인완료</Option>
                        <Option value="rejected">반려</Option>
                    </Select>
                    <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={(value) => handleFilterChange('contentType', value)}
                        aria-label="콘텐츠 타입 필터"
                    >
                        <Option value="all">전체 타입</Option>
                        <Option value="전자책">전자책</Option>
                        <Option value="오디오북">오디오북</Option>
                    </Select>
                    <RangePicker onChange={handleDateChange} placeholder={['요청 시작일', '요청 종료일']} />
                </Space>
                <Space style={{ background: '#fffbe6', padding: '8px 16px', borderRadius: '4px', border: '1px solid #ffe58f' }}>
                    <ClockCircleOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                    <Text strong style={{ fontSize: '16px', color: '#d48806' }}>
                        승인대기 {approvals.filter(item => item.status === 'pending').length}건
                    </Text>
                </Space>
            </Space>

            {/* Approval Table */}
            <Table
                columns={columns}
                dataSource={filteredApprovals}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                onRow={(record) => {
                    return {
                        onClick: () => {
                            handleViewDetails(record);
                        },
                    };
                }}
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

            {/* Detail Modal Implementation */}
            <Modal
                title="콘텐츠 상세 정보"
                open={isDetailModalOpen}
                onCancel={handleModalClose}
                footer={
                    selectedItem && selectedItem.status === 'pending' ? [
                        <Button key="reject" danger onClick={() => handleReject(selectedItem.key)} icon={<CloseCircleOutlined />}>
                            반려
                        </Button>,
                        <Button key="approve" type="primary" onClick={() => handleApprove(selectedItem.key)} icon={<CheckCircleOutlined />}>
                            승인
                        </Button>,
                    ] : null
                }
                width={600}
            >
                {selectedItem && (
                    <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="ID">{selectedItem.id}</Descriptions.Item>
                        <Descriptions.Item label="제목">{selectedItem.title}</Descriptions.Item>
                        <Descriptions.Item label="부제">{selectedItem.subtitle || '-'}</Descriptions.Item>
                        <Descriptions.Item label="작가">{selectedItem.requester}</Descriptions.Item>
                        <Descriptions.Item label="카테고리">{categoryMap[selectedItem.categoryName] || selectedItem.categoryName || '-'}</Descriptions.Item>
                        <Descriptions.Item label="콘텐츠 타입">{selectedItem.contentType}</Descriptions.Item>
                        <Descriptions.Item label="파일명">{selectedItem.fileName || '첨부파일 없음'}</Descriptions.Item>
                        <Descriptions.Item label="성인도서">{selectedItem.isAdult === 'adult' ? '성인' : '전연령'}</Descriptions.Item>
                        <Descriptions.Item label="제작목적">{selectedItem.productionPurpose === 'external' ? 'ISBN 판매용' : '일반 판매용'}</Descriptions.Item>
                        <Descriptions.Item label="요청일">{selectedItem.requestDate}</Descriptions.Item>
                        <Descriptions.Item label="상태">{getStatusTag(selectedItem.status)}</Descriptions.Item>
                        {selectedItem.status === 'rejected' && selectedItem.rejectReason && (
                            <Descriptions.Item label="반려사유">{selectedItem.rejectReason}</Descriptions.Item>
                        )}
                    </Descriptions>
                )}
            </Modal>
        </Space>
    );
};

export default ContentApproval; 