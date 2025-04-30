import React, { useState, useEffect } from 'react';
import {
    Typography,
    Input,
    Select,
    Card,
    List,
    Avatar,
    Tooltip,
    Tag,
    Space,
    Button,
    Dropdown,
    Menu,
    DatePicker,
    Row,
    Col,
    Spin, // 로딩 표시
    Empty, // 데이터 없을 때 표시
    Descriptions, // 사용자 정보 표시에 추가
    message, // 액션 결과 표시
    Modal, // 배지 부여/회수 확인
} from 'antd';
import {
    UserOutlined,
    SearchOutlined,
    ReloadOutlined,
    DownOutlined,
    TrophyOutlined,
    CalendarOutlined,
    FilterOutlined,
    PlusOutlined,
    DeleteOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons';
// import dayjs from 'dayjs'; // 날짜 필터링에 필요 시 추가

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// --- Sample Data (API 호출로 대체 필요) ---
const sampleUsers = [
    { userId: 'user001', name: '홍길동' },
    { userId: 'user002', name: '김철수' },
    { userId: 'user003', name: '박영희' },
    { userId: 'user005', name: '강민준' },
    { userId: 'user006', name: '오서아' },
];

// 전체 배지 마스터 정보 (ID를 키로 사용)
const allBadgesMaster = {
    'welcome': { name: '첫 방문 환영', description: '처음으로 밀리 서비스를 이용해주셔서 감사합니다.', icon: 'https://via.placeholder.com/48/FFBF00/000000?text=W' },
    'reader': { name: '다독가', description: '이번 달 10권 이상 읽으셨습니다.', icon: 'https://via.placeholder.com/48/87d068/ffffff?text=R' },
    'reviewer': { name: '리뷰어', description: '5개의 리뷰를 작성했습니다.', icon: 'https://via.placeholder.com/48/108ee9/ffffff?text=RV' },
    'sharer': { name: '공유왕', description: '콘텐츠를 3회 이상 공유했습니다.', icon: 'https://via.placeholder.com/48/f50/ffffff?text=S' },
    'perfect_attendance': { name: '출석왕', description: '한 달 동안 매일 출석했습니다.', icon: 'https://via.placeholder.com/48/722ed1/ffffff?text=PA' },
    'early_bird': { name: '얼리버드', description: '오전 6시 이전에 접속했습니다.', icon: 'https://via.placeholder.com/48/eb2f96/ffffff?text=EB' },
};

// 사용자별 보유 배지 데이터 (사용자 ID를 키로 사용)
const userBadgesData = {
    'user001': [
        { badgeId: 'welcome', acquisitionDate: '2024-07-01 10:30:00' },
        { badgeId: 'reader', acquisitionDate: '2024-07-15 11:00:00' },
        { badgeId: 'reviewer', acquisitionDate: '2024-07-20 18:05:00' },
    ],
    'user002': [
        { badgeId: 'welcome', acquisitionDate: '2024-06-15 09:00:00' },
    ],
    'user005': [
        { badgeId: 'welcome', acquisitionDate: '2024-07-22 16:00:00' },
        { badgeId: 'sharer', acquisitionDate: '2024-07-25 10:15:00' },
        { badgeId: 'reader', acquisitionDate: '2024-07-28 20:30:00' },
        { badgeId: 'early_bird', acquisitionDate: '2024-07-29 05:55:00' },
    ],
    'user006': [
        { badgeId: 'welcome', acquisitionDate: '2024-04-01 12:00:00' },
        { badgeId: 'perfect_attendance', acquisitionDate: '2024-05-01 00:00:00' },
    ],
};
// --- End Sample Data ---

const BadgeManagement = () => {
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [users, setUsers] = useState([]); // 사용자 목록
    const [selectedUserId, setSelectedUserId] = useState(null); // 선택된 사용자 ID
    const [selectedUser, setSelectedUser] = useState(null); // 선택된 사용자 정보
    const [loadingBadges, setLoadingBadges] = useState(false); // 배지 로딩 상태
    const [userBadges, setUserBadges] = useState([]); // 사용자의 보유 배지 목록 (상세 정보 포함)
    const [filters, setFilters] = useState({}); // 필터 상태 { badgeType: 'reader', dateRange: [dayjs, dayjs] }

    // 초기 사용자 목록 로드
    useEffect(() => {
        setLoadingUsers(true);
        // TODO: API 호출하여 실제 사용자 목록 가져오기
        setTimeout(() => {
            setUsers(sampleUsers);
            setLoadingUsers(false);
        }, 300);
    }, []);

    // 선택된 사용자가 변경되거나 필터가 변경되면 해당 사용자의 배지 목록 로드
    useEffect(() => {
        if (selectedUserId) {
            fetchUserBadges(selectedUserId, filters);
            // 선택된 사용자 정보 업데이트
            const userDetails = users.find(u => u.userId === selectedUserId);
            setSelectedUser(userDetails);
        } else {
            setUserBadges([]); // 사용자 선택 해제 시 배지 목록 초기화
            setSelectedUser(null); // 사용자 정보 초기화
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUserId, filters, users]); // users 추가: 사용자 목록 로드 후 선택된 사용자 정보 업데이트

    // 사용자 배지 데이터 가져오기 (필터링 포함)
    const fetchUserBadges = (userId, currentFilters) => {
        setLoadingBadges(true);
        console.log(`Fetching badges for ${userId} with filters:`, currentFilters);
        // TODO: API 호출하여 특정 사용자의 배지 목록 가져오기 (필터링은 백엔드에서 처리하는 것이 효율적)
        setTimeout(() => {
            let badges = userBadgesData[userId] || [];

            // --- 클라이언트 사이드 필터링 (예시) ---
            // 배지 종류 필터
            if (currentFilters.badgeType) {
                badges = badges.filter(b => b.badgeId === currentFilters.badgeType);
            }
            // 획득 기간 필터
            if (currentFilters.dateRange && currentFilters.dateRange.length === 2) {
                 const [start, end] = currentFilters.dateRange;
                 // 날짜 비교를 위해 dayjs 또는 Date 객체 사용 권장 (여기서는 문자열 비교로 단순화)
                 const startDate = start ? start.startOf('day').toISOString() : null;
                 const endDate = end ? end.endOf('day').toISOString() : null;

                 badges = badges.filter(b => {
                     const acqDate = b.acquisitionDate; // 'YYYY-MM-DD HH:mm:ss' 형태 가정
                     const isAfterStart = startDate ? acqDate >= startDate.substring(0, 10) : true; // 날짜 부분만 비교
                     const isBeforeEnd = endDate ? acqDate <= endDate.substring(0, 10) : true; // 날짜 부분만 비교
                     return isAfterStart && isBeforeEnd;
                 });
            }
            // --- 필터링 끝 ---

            // 배지 마스터 정보와 결합하여 상세 정보 생성
            const detailedBadges = badges.map(ub => ({
                ...ub, // badgeId, acquisitionDate
                ...(allBadgesMaster[ub.badgeId] || { name: ub.badgeId, description: '알 수 없는 배지', icon: '' }), // name, description, icon 추가
            })).sort((a, b) => new Date(b.acquisitionDate) - new Date(a.acquisitionDate)); // 최신 획득 순으로 정렬

            setUserBadges(detailedBadges);
            setLoadingBadges(false);
        }, 500);
    };

    // 사용자 선택 핸들러
    const handleUserChange = (value) => {
        setSelectedUserId(value);
        // 사용자 변경 시 필터 초기화 (선택 사항)
        // setFilters({});
    };

    // 필터 변경 핸들러
    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    // 필터 초기화 핸들러
    const handleResetFilters = () => {
        setFilters({});
    };

     // 배지 부여 버튼 클릭 핸들러 (구현 필요)
     const handleGrantBadge = () => {
         if (!selectedUserId) return;
         // TODO: 배지 선택 및 부여 로직 구현 (예: 모달 창 표시)
         message.info(`'${selectedUser?.name}'님에게 배지 부여 기능은 구현 예정입니다.`);
         // 예시: 부여할 배지 선택 모달 열기
         // showGrantBadgeModal(selectedUserId);
     };

     // 배지 회수 확인 및 처리 핸들러
     const handleRevokeBadge = (badge) => {
         if (!selectedUserId || !badge) return;
         Modal.confirm({
             title: `'${selectedUser?.name}'님의 '${badge.name}' 배지를 회수하시겠습니까?`,
             icon: <DeleteOutlined />,
             content: `획득일: ${badge.acquisitionDate}`,
             okText: '회수',
             okType: 'danger',
             cancelText: '취소',
             onOk() {
                 console.log(`Revoking badge ${badge.badgeId} (acquired ${badge.acquisitionDate}) for user: ${selectedUserId}`);
                 // TODO: API 호출하여 배지 회수 처리
                 message.loading({ content: '배지 회수 중...', key: 'revoke' });
                 setTimeout(() => {
                     // 성공 시
                     message.success({ content: '배지가 회수되었습니다.', key: 'revoke' });
                     // 배지 목록 다시 로드
                     fetchUserBadges(selectedUserId, filters);
                     // 실패 시
                     // message.error({ content: '배지 회수에 실패했습니다.', key: 'revoke' });
                 }, 500);
             },
         });
     };

    // 각 배지 카드에 표시될 액션 메뉴
    const badgeActionMenu = (badgeRecord) => (
        <Menu onClick={({ key }) => {
            if (key === 'revoke') {
                handleRevokeBadge(badgeRecord);
            }
        }}>
            <Menu.Item key="info" icon={<InfoCircleOutlined />} disabled>
                획득 조건 보기 (예정)
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="revoke" icon={<DeleteOutlined />} danger>
                배지 회수
            </Menu.Item>
        </Menu>
    );

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><TrophyOutlined /> 회원 배지 관리</Title>
            <Text>회원별 보유 배지 현황을 확인하고 관리합니다.</Text>

            {/* 사용자 선택 섹션 */}
            <Card>
                <Row gutter={[16, 16]} align="bottom">
                    <Col>
                        <Text strong>회원 선택:</Text><br/>
                        <Select
                            showSearch
                            style={{ width: 250 }}
                            placeholder="회원 ID 또는 이름 검색"
                            optionFilterProp="children" // 이름 또는 ID로 검색 가능하도록 설정
                            onChange={handleUserChange}
                            onSearch={(value) => console.log('Search:', value)} // 필요 시 서버사이드 검색 구현
                            filterOption={(input, option) =>
                                // option.children이 배열일 수 있으므로 join하여 검색
                                (option.children?.join('') ?? '').toLowerCase().includes(input.toLowerCase()) ||
                                (option.value ?? '').toLowerCase().includes(input.toLowerCase()) // option.value 추가
                            }
                            loading={loadingUsers}
                            value={selectedUserId}
                            allowClear // 선택 해제 가능
                            onClear={() => setSelectedUserId(null)}
                        >
                            {users.map(user => (
                                // Option의 children으로 이름과 ID 함께 표시
                                <Option key={user.userId} value={user.userId}>
                                   {user.name} <Text type="secondary">({user.userId})</Text>
                                </Option>
                            ))}
                        </Select>
                    </Col>
                     {/* 선택된 사용자 정보 간략 표시 */}
                    <Col flex="auto">
                        {selectedUser && (
                             <Descriptions size="small" column={1} style={{ paddingBottom: '8px' }}>
                                 <Descriptions.Item label="선택된 회원" labelStyle={{width: '80px'}}>
                                     <Text strong>{selectedUser.name}</Text> ({selectedUser.userId})
                                </Descriptions.Item>
                             </Descriptions>
                         )}
                    </Col>
                </Row>
            </Card>

            {/* 배지 목록 및 관리 섹션 (사용자 선택 시 표시) */}
             {selectedUserId ? (
                <Card>
                     {/* 카드 제목 및 필터/액션 버튼 */}
                     <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                         <Col>
                             <Title level={4} style={{ margin: 0 }}>
                                 <UserOutlined /> {selectedUser?.name || selectedUserId}님의 보유 배지
                            </Title>
                         </Col>
                         <Col>
                             <Button
                                 type="primary"
                                 icon={<PlusOutlined />}
                                 onClick={handleGrantBadge}
                                 disabled={!selectedUserId} // 사용자 선택 시 활성화
                             >
                                 배지 부여 (구현 예정)
                             </Button>
                         </Col>
                     </Row>

                     {/* 필터링 옵션 */}
                     <Space style={{ marginBottom: 16 }} wrap>
                         <FilterOutlined />
                         <Text>필터:</Text>
                         <Select
                             placeholder="배지 종류"
                             allowClear
                             style={{ width: 180 }}
                             onChange={(value) => handleFilterChange('badgeType', value)}
                             value={filters.badgeType || undefined}
                             options={Object.entries(allBadgesMaster).map(([id, { name }]) => ({
                                 value: id,
                                 label: name,
                             }))}
                         />
                         <Text>획득 기간:</Text>
                         <RangePicker
                             onChange={(dates) => handleFilterChange('dateRange', dates)}
                             value={filters.dateRange || null}
                         />
                         <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>초기화</Button>
                     </Space>

                    {/* 배지 목록 */}
                    <Spin spinning={loadingBadges}>
                         {userBadges.length > 0 ? (
                             <List
                                // 그리드 반응형 설정
                                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }}
                                dataSource={userBadges}
                                renderItem={badge => (
                                    <List.Item>
                                        <Card
                                             hoverable // 마우스 오버 시 효과
                                             size="small"
                                             // 배지 카드 하단에 액션 버튼 (드롭다운 형태)
                                             actions={[
                                                 <Dropdown overlay={() => badgeActionMenu(badge)} trigger={['click']}>
                                                    <a onClick={e => e.preventDefault()}>
                                                        <Space> 관리 <DownOutlined /> </Space>
                                                    </a>
                                                 </Dropdown>
                                             ]}
                                         >
                                            {/* Card.Meta로 아이콘, 제목, 설명 구조화 */}
                                            <Card.Meta
                                                 avatar={
                                                     <Avatar
                                                        src={badge.icon}
                                                        shape="square" // 배지 모양에 맞게 square 또는 circle
                                                        size={48}
                                                        alt={badge.name}
                                                    />
                                                 }
                                                 title={
                                                      <Tooltip title={badge.description}>
                                                         {badge.name}
                                                     </Tooltip>
                                                 }
                                                description={
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                         <CalendarOutlined style={{ marginRight: 4 }}/>
                                                         {/* 날짜 형식 변환 필요 시 dayjs 등 사용 */}
                                                         {badge.acquisitionDate.substring(0, 10)} {/* 날짜 부분만 표시 */}
                                                     </Text>
                                                 }
                                            />
                                        </Card>
                                    </List.Item>
                                )}
                                // 페이지네이션 추가 (선택 사항)
                                pagination={{
                                    pageSize: 12, // 한 페이지에 보여줄 배지 수
                                    size: 'small',
                                    showSizeChanger: false,
                                }}
                            />
                         ) : (
                             // 데이터가 없을 때 표시될 컴포넌트
                             <Empty description={
                                 loadingBadges ? "배지 정보를 불러오는 중..." : "보유한 배지가 없거나 필터 결과가 없습니다."
                             } />
                         )}
                     </Spin>
                 </Card>
             ) : (
                 // 사용자가 선택되지 않았을 때 안내 메시지
                 <Card>
                     <Empty description="상단에서 관리할 회원을 선택해주세요." />
                 </Card>
             )}
        </Space>
    );
};

export default BadgeManagement; 