import React, { useState, useMemo } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Tag,
    Space,
    Typography,
    message,
    Popconfirm,
    Tooltip,
    Avatar,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined, // Or UnlockOutlined for releasing sanction
    UnlockOutlined,
    SearchOutlined,
    FilterOutlined,
    UserOutlined,
    WarningFilled, // 제재 아이콘
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;
const { RangePicker } = DatePicker;

// --- Sample Data ---
// Assuming we might need user info
const mockUsersForSelect = [
    { userId: 'user001', name: '김민지', avatar: '...' },
    { userId: 'user002', name: '이수현', avatar: null },
    { userId: 'user003', name: '박서준 (admin001)', avatar: '...' },
    { userId: 'user004', name: '최유나', avatar: null },
    { userId: 'user005', name: '박채영', avatar: '...' },
];

const initialSanctions = [
    { key: '1', id: 1, userId: 'user004', userName: '최유나', reason: '스팸성 도배 게시물 반복 작성 (3회 경고 누적)', type: 'temporary_ban', startDate: '2024-07-20', endDate: '2024-07-27', status: 'expired', adminMemo: '관리자 A가 처리' },
    { key: '2', id: 2, userId: 'user005', userName: '박채영', reason: '심한 욕설 및 비방으로 인한 커뮤니티 가이드라인 위반', type: 'permanent_ban', startDate: '2024-07-15', endDate: null, status: 'active', adminMemo: '관리자 B 확인' },
    { key: '3', id: 3, userId: 'user001', userName: '김민지', reason: '저작권 침해 콘텐츠 공유 시도', type: 'write_limit', startDate: '2024-07-29', endDate: '2024-08-05', status: 'active', adminMemo: '' },
    { key: '4', id: 4, userId: 'user002', userName: '이수현', reason: '단순 경고 (가이드라인 안내)', type: 'warning', startDate: '2024-07-30', endDate: null, status: 'active', adminMemo: '재발 시 제재 강화 예정' },
];

// --- Helper Functions ---
const getSanctionTypeTag = (type) => {
    switch (type) {
        case 'temporary_ban': return <Tag color="orange">기간 이용정지</Tag>;
        case 'permanent_ban': return <Tag color="red">영구 이용정지</Tag>;
        case 'write_limit': return <Tag color="gold">글쓰기 제한</Tag>;
        case 'read_limit': return <Tag color="lime">읽기 제한</Tag>; // Example
        case 'warning': return <Tag color="default">주의/경고</Tag>;
        default: return <Tag>{type}</Tag>;
    }
};

const getSanctionStatus = (sanction) => {
    if (sanction.status === 'released') {
        return <Tag color="success">해제됨</Tag>;
    }
    if (sanction.type === 'permanent_ban' || sanction.type === 'warning') {
         return <Tag icon={<WarningFilled />} color="error">제재중</Tag>;
    }
    if (sanction.endDate && moment().isAfter(moment(sanction.endDate))) {
        // Update status in data source if needed, for now just display logic
        // This logic might be better handled server-side
        return <Tag color="default">기간만료</Tag>;
    }
    return <Tag icon={<WarningFilled />} color="error">제재중</Tag>;
};

// --- Component ---
const AccountSanctions = () => {
    const [sanctions, setSanctions] = useState(initialSanctions);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSanction, setEditingSanction] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ type: null, status: null });

    // --- Search & Filter --- 
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value === 'all' ? null : value }));
    };

     // --- Filtering Logic ---
     const filteredSanctions = useMemo(() => {
        // Function to determine the active status based on dates for filtering
        const isActive = (sanc) => {
            if (sanc.status === 'released') return false;
            if (sanc.type === 'permanent_ban' || sanc.type === 'warning') return true;
            if (sanc.endDate && moment().isAfter(moment(sanc.endDate))) return false;
            return true;
        };

        return sanctions.filter(item => {
            const matchesSearch = searchText
                ? item.userId.toLowerCase().includes(searchText) || item.userName.toLowerCase().includes(searchText)
                : true;
            const matchesType = filters.type ? item.type === filters.type : true;
            
            let matchesStatus = true;
            if (filters.status) {
                if (filters.status === 'active') {
                    matchesStatus = isActive(item);
                } else if (filters.status === 'inactive') {
                    matchesStatus = !isActive(item);
                }
            }

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [sanctions, searchText, filters]);


    // --- Modal Handling ---
    const showAddModal = () => {
        setEditingSanction(null);
        form.resetFields();
        form.setFieldsValue({ type: 'warning', startDate: moment() }); // Default values
        setIsModalOpen(true);
    };

    const showEditModal = (sanction) => {
        setEditingSanction(sanction);
        form.setFieldsValue({
            ...sanction,
            startDate: sanction.startDate ? moment(sanction.startDate) : null,
            endDate: sanction.endDate ? moment(sanction.endDate) : null,
            // If using RangePicker:
            // dateRange: (sanction.startDate && sanction.endDate) ? [moment(sanction.startDate), moment(sanction.endDate)] : null,
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingSanction(null);
        form.resetFields();
    };

    // --- Form Submission ---
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                // Find user name based on selected userId
                const selectedUser = mockUsersForSelect.find(u => u.userId === values.userId);

                const processedValues = {
                    ...values,
                    userName: selectedUser ? selectedUser.name : values.userId, // Fallback to userId if name not found
                    startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
                    endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
                    status: 'active', // Assume new/edited sanctions are active initially
                     // If using RangePicker:
                     // startDate: values.dateRange ? values.dateRange[0].format('YYYY-MM-DD') : null,
                     // endDate: values.dateRange ? values.dateRange[1].format('YYYY-MM-DD') : null,
                     // dateRange: undefined, // Remove range picker value
                };
                 // Clear end date for permanent ban or warning
                 if (processedValues.type === 'permanent_ban' || processedValues.type === 'warning') {
                     processedValues.endDate = null;
                 }

                if (editingSanction) {
                    setSanctions(prevSanctions =>
                        prevSanctions.map(s => s.key === editingSanction.key ? { ...s, ...processedValues } : s)
                    );
                    message.success('계정 제재 정보가 수정되었습니다.');
                } else {
                    const newSanction = {
                        key: (sanctions.length + 1).toString(),
                        id: sanctions.length > 0 ? Math.max(...sanctions.map(s => s.id)) + 1 : 1,
                        ...processedValues,
                    };
                    setSanctions(prevSanctions => [newSanction, ...prevSanctions]);
                    message.success('새 계정 제재가 등록되었습니다.');
                }
                form.resetFields();
                setIsModalOpen(false);
                setEditingSanction(null);
                 // TODO: API Call to add/update sanction
                 console.log('Sanction saved:', processedValues);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('폼 입력값을 확인해주세요.');
            });
    };

    // --- Release Sanction --- 
    const handleRelease = (key) => {
         setSanctions(prevSanctions =>
            prevSanctions.map(s => s.key === key ? { ...s, status: 'released', endDate: moment().format('YYYY-MM-DD') } : s)
         );
         message.success('계정 제재가 해제되었습니다.');
         // TODO: API Call to update sanction status
         console.log(`Released sanction key: ${key}`);
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80, sorter:(a,b)=>a.id-b.id },
        {
            title: '사용자', key: 'user', width: 180,
            render: (_, record) => (
                 <Link onClick={() => message.info(`사용자 ${record.userId} 상세 보기`)}>{record.userName} ({record.userId})</Link>
            )
        },
        { title: '제재 사유', dataIndex: 'reason', key: 'reason', ellipsis: true },
        {
            title: '제재 유형', dataIndex: 'type', key: 'type', width: 150, align: 'center',
            render: getSanctionTypeTag,
            filters: [
                 { text: '기간 이용정지', value: 'temporary_ban' },
                 { text: '영구 이용정지', value: 'permanent_ban' },
                 { text: '글쓰기 제한', value: 'write_limit' },
                 { text: '읽기 제한', value: 'read_limit' },
                 { text: '주의/경고', value: 'warning' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: '제재 기간', key: 'duration', width: 240,
            render: (_, record) => (
                record.type === 'permanent_ban' || record.type === 'warning'
                    ? `${record.startDate} ~ 영구/별도해제`
                    : `${record.startDate} ~ ${record.endDate || '진행중'}`
            ),
            sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
             defaultSortOrder: 'descend'
        },
         {
            title: '상태', key: 'status', width: 100, align: 'center',
            render: getSanctionStatus,
            filters: [
                 { text: '제재중', value: 'active' },
                 { text: '해제/만료', value: 'inactive' }, // Combines released and expired
            ],
            // onFilter is handled in useMemo based on status filter value
        },
         { title: '관리자 메모', dataIndex: 'adminMemo', key: 'adminMemo', width: 150, ellipsis: true },
        {
            title: '관리',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="수정">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} size="small" />
                    </Tooltip>
                    {getSanctionStatus(record).props.children !== '해제됨' && getSanctionStatus(record).props.children !== '기간만료' && (
                        <Popconfirm
                            title={`'${record.userName}'(${record.userId}) 사용자의 제재를 해제하시겠습니까?`}
                            onConfirm={() => handleRelease(record.key)}
                            okText="해제"
                            cancelText="취소"
                        >
                            <Tooltip title="제재 해제">
                                <Button icon={<UnlockOutlined />} size="small" />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>계정 제재 관리</Title>
            <Text type="secondary">서비스 이용 약관 위반 등으로 제재 조치된 계정 목록을 관리합니다.</Text>

             {/* Search, Filter, Add Button */}
             <Space style={{ display: 'flex', justifyContent: 'space-between' }} wrap>
                 <Space wrap>
                     <Search
                        placeholder="사용자 ID 또는 이름 검색"
                        allowClear
                        enterButton={<><SearchOutlined /> 검색</>}
                        onSearch={handleSearch}
                        style={{ width: 250 }}
                     />
                    <FilterOutlined style={{ color: '#888' }} />
                     <Select
                        defaultValue="all"
                        style={{ width: 150 }}
                        onChange={(value) => handleFilterChange('type', value)}
                        aria-label="제재 유형 필터"
                    >
                        <Option value="all">전체 유형</Option>
                         <Option value="temporary_ban">기간 이용정지</Option>
                         <Option value="permanent_ban">영구 이용정지</Option>
                         <Option value="write_limit">글쓰기 제한</Option>
                         <Option value="read_limit">읽기 제한</Option>
                         <Option value="warning">주의/경고</Option>
                    </Select>
                    <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={(value) => handleFilterChange('status', value)}
                        aria-label="상태 필터"
                    >
                        <Option value="all">전체 상태</Option>
                        <Option value="active">제재중</Option>
                        <Option value="inactive">해제/만료</Option>
                    </Select>
                 </Space>
                 <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                >
                    새 제재 등록
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredSanctions}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 1200 }}
            />

            {/* Add/Edit Sanction Modal */}
            <Modal
                title={editingSanction ? "계정 제재 수정" : "새 계정 제재 등록"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingSanction ? "수정" : "등록"}
                cancelText="취소"
                destroyOnClose
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="account_sanction_form"
                >
                     <Form.Item
                        name="userId"
                        label="대상 사용자"
                        rules={[{ required: true, message: '제재 대상 사용자를 선택해주세요!' }]}
                    >
                         {/* Replace Select with a better User Search component in real app */}
                         <Select
                            showSearch
                            placeholder="사용자 ID 또는 이름 검색/선택"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                         >
                             {mockUsersForSelect.map(user => (
                                <Option key={user.userId} value={user.userId}>{user.name} ({user.userId})</Option>
                             ))}
                         </Select>
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="제재 유형"
                        rules={[{ required: true, message: '제재 유형을 선택해주세요!' }]}
                    >
                        <Select>
                             <Option value="temporary_ban">기간 이용정지</Option>
                             <Option value="permanent_ban">영구 이용정지</Option>
                             <Option value="write_limit">글쓰기 제한</Option>
                             <Option value="read_limit">읽기 제한</Option>
                             <Option value="warning">주의/경고</Option>
                             {/* Add more sanction types */} 
                        </Select>
                    </Form.Item>
                     <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                     >
                         {({ getFieldValue }) =>
                             getFieldValue('type') === 'temporary_ban' || getFieldValue('type') === 'write_limit' || getFieldValue('type') === 'read_limit' ? (
                                 <Form.Item
                                     name="endDate"
                                     label="제재 종료일"
                                     rules={[{ required: true, message: '기간제 제재는 종료일을 지정해야 합니다!' }]}
                                 >
                                     <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                                 </Form.Item>
                             ) : null
                         }
                     </Form.Item>
                     <Form.Item
                         name="startDate"
                         label="제재 시작일"
                         rules={[{ required: true, message: '제재 시작일을 지정해주세요!' }]}
                         initialValue={moment()} // Default to today
                     >
                         <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                     </Form.Item>
                     {/* If using RangePicker instead 
                     <Form.Item name="dateRange" label="제재 기간">
                         <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                     </Form.Item>
                     */}
                    <Form.Item
                        name="reason"
                        label="제재 사유"
                        rules={[{ required: true, message: '제재 사유를 입력해주세요!' }]}
                    >
                        <TextArea rows={4} placeholder="예: 커뮤니티 가이드라인 위반 (욕설 사용)"/>
                    </Form.Item>
                     <Form.Item
                        name="adminMemo"
                        label="관리자 메모 (선택)"
                    >
                        <Input placeholder="처리 담당자, 특이사항 등 기록"/>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default AccountSanctions; 