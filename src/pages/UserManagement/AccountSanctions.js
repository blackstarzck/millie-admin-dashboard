import React, { useState, useMemo, useRef } from 'react';
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
    AutoComplete,
    Row,
    Col,
    Upload,
    Empty,
    Popover,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UnlockOutlined,
    SearchOutlined,
    FilterOutlined,
    UserOutlined,
    WarningFilled,
    UploadOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Search } = Input;
const { RangePicker } = DatePicker;

const mockUsersForSelect = [
    { userId: 'user001', name: '김민지', avatar: '...' },
    { userId: 'user002', name: '이수현', avatar: null },
    { userId: 'user003', name: '박서준 (admin001)', avatar: '...' },
    { userId: 'user004', name: '최유나', avatar: null },
    { userId: 'user005', name: '박채영', avatar: '...' },
];

const initialSanctions = [
    {
        key: '1', id: 1, userId: 'user004', userName: '최유나',
        reason: '스팸성 도배 게시물 반복 작성 (3회 경고 누적)', type: 'temporary_ban',
        startDate: '2024-07-20', endDate: '2024-07-27', status: 'expired',
        adminMemo: '관리자 A가 처리',
        processedByAdmin: 'admin_A',
        evidence: [
            { uid: '-1', name: 'spam_evidence_01.png', status: 'done', url: '#' },
            { uid: '-2', name: 'user_log_extract.txt', status: 'done', url: '#' },
            { uid: '-3', name: 'screenshot_20240719_1.jpg', status: 'done', url: '#' },
            { uid: '-4', name: 'screenshot_20240719_2.jpg', status: 'done', url: '#' },
            { uid: '-5', name: 'related_user_report.pdf', status: 'done', url: '#' },
            { uid: '-6', name: 'violation_pattern_analysis.docx', status: 'done', url: '#' },
            { uid: '-7', name: 'previous_warning_record.txt', status: 'done', url: '#' },
            { uid: '-8', name: 'additional_evidence_1.png', status: 'done', url: '#' },
            { uid: '-9', name: 'additional_evidence_2.log', status: 'done', url: '#' },
            { uid: '-10', name: 'internal_discussion_summary.txt', status: 'done', url: '#' },
            { uid: '-11', name: 'final_review.pdf', status: 'done', url: '#' },
        ]
    },
    { key: '2', id: 2, userId: 'user005', userName: '박채영', reason: '심한 욕설 및 비방으로 인한 커뮤니티 가이드라인 위반', type: 'permanent_ban', startDate: '2024-07-15', endDate: null, status: 'active', adminMemo: '관리자 B 확인', evidence: null, processedByAdmin: 'admin_B' },
    { key: '3', id: 3, userId: 'user001', userName: '김민지', reason: '저작권 침해 콘텐츠 공유 시도', type: 'write_limit', startDate: '2024-07-29', endDate: '2024-08-05', status: 'active', adminMemo: '', evidence: null, processedByAdmin: 'admin_A' },
    { key: '4', id: 4, userId: 'user002', userName: '이수현', reason: '단순 경고 (가이드라인 안내)', type: 'warning', startDate: '2024-07-30', endDate: null, status: 'active', adminMemo: '재발 시 제재 강화 예정', evidence: null, processedByAdmin: 'admin_C' },
    { key: '5', id: 5, userId: 'user003', userName: '박서준', reason: '밀어주기 시스템 악용 의심', type: 'function_restriction', startDate: '2024-08-01', endDate: '2024-08-15', status: 'active', adminMemo: '로그 확인 필요', evidence: null, processedByAdmin: 'admin_B' },
];

const maskUserId = (userId) => userId ? userId.substring(0, 3) + '****' : '';
const maskUserName = (name) => name ? name.substring(0, 1) + '**' : '';

const getSanctionTypeTag = (type) => {
    switch (type) {
        case 'temporary_ban': return <Tag color="orange">기간 이용정지</Tag>;
        case 'permanent_ban': return <Tag color="red">영구 이용정지</Tag>;
        case 'write_limit': return <Tag color="gold">글쓰기 제한</Tag>;
        case 'read_limit': return <Tag color="lime">읽기 제한</Tag>;
        case 'function_restriction': return <Tag color="purple">기능 제한</Tag>;
        case 'post_deletion': return <Tag color="blue">게시물 삭제</Tag>;
        case 'warning': return <Tag color="default">주의/경고</Tag>;
        default: return <Tag>{type}</Tag>;
    }
};

const calculateSanctionStatus = (sanction) => {
    if (sanction.status === 'released') {
        return 'released';
    }
    if (sanction.type === 'permanent_ban' || sanction.type === 'warning' || sanction.type === 'post_deletion') {
        return 'active';
    }
    if (sanction.endDate && moment().isAfter(moment(sanction.endDate))) {
        return 'expired';
    }
    return 'active';
};

const getSanctionStatusTag = (status) => {
    switch (status) {
        case 'active': return <Tag icon={<WarningFilled />} color="error">제재중</Tag>;
        case 'released': return <Tag color="success">해제됨</Tag>;
        case 'expired': return <Tag color="default">기간만료</Tag>;
        default: return <Tag>알 수 없음</Tag>;
    }
};

// Popover에 표시할 제재 유형 안내 콘텐츠 (컴포넌트 외부로 이동)
const sanctionTypeGuideContent = (
    <div style={{ maxWidth: '300px' }}>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px', marginLeft: 4 }}>{getSanctionTypeTag('temporary_ban')} : 일정 기간 서비스 이용 정지</li>
            <li style={{ marginBottom: '8px', marginLeft: 4 }}>{getSanctionTypeTag('permanent_ban')} : 계정 영구 정지</li>
            <li style={{ marginBottom: '8px', marginLeft: 4 }}>{getSanctionTypeTag('write_limit')} : 콘텐츠 작성 제한</li>
            <li style={{ marginBottom: '8px', marginLeft: 4 }}>{getSanctionTypeTag('read_limit')} : 콘텐츠 조회 제한</li>
            <li style={{ marginBottom: '8px', marginLeft: 4 }}>{getSanctionTypeTag('function_restriction')} : 특정 기능 사용 제한</li>
            <li style={{ marginBottom: '8px', marginLeft: 4 }}>{getSanctionTypeTag('post_deletion')} : 특정 게시물 삭제 조치</li>
            <li style={{ marginLeft: 4 }}>{getSanctionTypeTag('warning')} : 주의/경고 알림</li>
        </ul>
    </div>
);

const AccountSanctions = () => {
    const [sanctions, setSanctions] = useState(initialSanctions.map(s => ({ ...s, calculatedStatus: calculateSanctionStatus(s) })));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSanction, setEditingSanction] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ type: null, status: null });
    const [userSearchOptions, setUserSearchOptions] = useState([]);
    const [fileList, setFileList] = useState([]);
    const uploadRef = useRef(null);

    const handleUserSearch = (value) => {
        if (value) {
            const filteredUsers = mockUsersForSelect.filter(user =>
                user.name.toLowerCase().includes(value.toLowerCase()) ||
                user.userId.toLowerCase().includes(value.toLowerCase())
            ).map(user => ({
                value: user.userId,
                label: (
                    <Space>
                        <Avatar size="small" src={user.avatar} icon={<UserOutlined />} />
                        {user.name} ({user.userId})
                    </Space>
                ),
                key: user.userId,
                userName: user.name
            }));
            setUserSearchOptions(filteredUsers);
        } else {
            setUserSearchOptions([]);
        }
    };

    const onUserSelect = (value, option) => {
        form.setFieldsValue({ userId: value, userName: option.userName });
    };

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value === 'all' ? null : value }));
    };

    const filteredSanctions = useMemo(() => {
        return sanctions.filter(item => {
            const matchesSearch = searchText
                ? item.userId.toLowerCase().includes(searchText) || item.userName.toLowerCase().includes(searchText) || (item.reason && item.reason.toLowerCase().includes(searchText))
                : true;
            const matchesType = filters.type ? item.type === filters.type : true;

            let matchesStatus = true;
            if (filters.status) {
                const currentStatus = item.calculatedStatus;
                if (filters.status === 'active') {
                    matchesStatus = currentStatus === 'active';
                } else if (filters.status === 'inactive') {
                    matchesStatus = currentStatus === 'released' || currentStatus === 'expired';
                }
            }

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [sanctions, searchText, filters]);

    const showAddModal = () => {
        setEditingSanction(null);
        form.resetFields();
        setFileList([]);
        form.setFieldsValue({ type: 'warning', startDate: moment() });
        setIsModalOpen(true);
    };

    const showEditModal = (sanction) => {
        setEditingSanction(sanction);
        form.setFieldsValue({
            ...sanction,
            startDate: sanction.startDate ? moment(sanction.startDate) : null,
            endDate: sanction.endDate ? moment(sanction.endDate) : null,
        });
        const existingFiles = sanction.evidence?.map(file => ({
            uid: file.uid || file.name,
            name: file.name,
            status: 'done',
            url: file.url,
        })) || [];
        setFileList(existingFiles);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingSanction(null);
        form.resetFields();
        setFileList([]);
    };

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const handleTriggerClick = () => {
        uploadRef.current?.input?.click();
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const selectedUser = mockUsersForSelect.find(u => u.userId === values.userId);

                const currentAdmin = 'admin_current'; // TODO: 실제 로그인한 관리자 정보 가져오기

                const processedValues = {
                    ...values,
                    userName: selectedUser ? selectedUser.name : values.userId,
                    startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
                    endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
                    processedByAdmin: currentAdmin,
                };

                if (['permanent_ban', 'warning', 'post_deletion'].includes(processedValues.type)) {
                    processedValues.endDate = null;
                }
                if (processedValues.type === 'post_deletion') {
                }

                Modal.confirm({
                    title: `${editingSanction ? '수정' : '등록'} 확인`,
                    content: `'${maskUserName(processedValues.userName)}'(${maskUserId(processedValues.userId)}) 사용자에게 ${getSanctionTypeTag(processedValues.type)} 제재를 ${editingSanction ? '수정' : '등록'}하시겠습니까?`,
                    okText: editingSanction ? '수정' : '등록',
                    cancelText: '취소',
                    onOk: () => {
                        if (editingSanction) {
                            setSanctions(prevSanctions =>
                                prevSanctions.map(s =>
                                    s.key === editingSanction.key
                                        ? { ...s, ...processedValues, processedByAdmin: currentAdmin, calculatedStatus: calculateSanctionStatus({ ...s, ...processedValues }) }
                                        : s
                                )
                            );
                            message.success('계정 제재 정보가 수정되었습니다.');
                        } else {
                            const newSanction = {
                                key: Date.now().toString(),
                                id: Math.max(0, ...sanctions.map(s => s.id)) + 1,
                                ...processedValues,
                                processedByAdmin: currentAdmin,
                                status: 'active',
                                calculatedStatus: calculateSanctionStatus({ ...processedValues, status: 'active' }),
                            };
                            setSanctions(prevSanctions => [newSanction, ...prevSanctions]);
                            message.success('새 계정 제재가 등록되었습니다.');
                        }
                        form.resetFields();
                        setIsModalOpen(false);
                        setEditingSanction(null);
                        setFileList([]);
                    }
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('폼 입력값을 확인해주세요.');
            });
    };

    const handleRelease = (key) => {
        console.log(`Releasing sanction key: ${key}`);
        setSanctions(prevSanctions =>
            prevSanctions.map(s => s.key === key ? { ...s, status: 'released', endDate: moment().format('YYYY-MM-DD'), calculatedStatus: 'released' } : s)
        );
        message.success('계정 제재가 해제되었습니다.');
    };

    const columns = [
        { title: '번호', dataIndex: 'id', key: 'id', width: 70, sorter:(a,b)=>a.id-b.id },
        {
            title: '이름',
            dataIndex: 'userName',
            key: 'userName',
            width: 180,
            render: (_, record) => (
                <Text>{maskUserName(record.userName)}</Text>
            ),
        },
        {
            title: '사용자 ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 150,
            render: (userId) => (
                <Link onClick={() => message.info(`사용자 ${userId} 상세 정보 보기 구현 필요`)}>
                    {maskUserId(userId)}
                </Link>
            )
        },
        { title: '제재 사유', dataIndex: 'reason', key: 'reason', ellipsis: true },
        {
            title: (
                <Popover content={sanctionTypeGuideContent} title="제재 유형 안내" trigger="hover">
                    <span style={{ cursor: 'help' }}>제재 유형 <FilterOutlined style={{ color: '#888', marginLeft: 4 }}/></span>
                </Popover>
            ),
            dataIndex: 'type', key: 'type', width: 150, align: 'center',
            render: getSanctionTypeTag,
            filters: [
                 { text: '기간 이용정지', value: 'temporary_ban' },
                 { text: '영구 이용정지', value: 'permanent_ban' },
                 { text: '글쓰기 제한', value: 'write_limit' },
                 { text: '읽기 제한', value: 'read_limit' },
                 { text: '기능 제한', value: 'function_restriction' },
                 { text: '게시물 삭제', value: 'post_deletion' },
                 { text: '주의/경고', value: 'warning' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: '제재 기간', key: 'duration', width: 240,
            render: (_, record) => {
                if (['permanent_ban', 'warning', 'post_deletion'].includes(record.type)) {
                    return `${record.startDate} ~ 영구/별도해제`;
                }
                return `${record.startDate} ~ ${record.endDate || '진행중'}`;
            },
            sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
             defaultSortOrder: 'descend'
        },
         {
            title: '상태', key: 'status', width: 100, align: 'center',
            render: (_, record) => getSanctionStatusTag(record.calculatedStatus),
            filters: [
                 { text: '제재중', value: 'active' },
                 { text: '해제/만료', value: 'inactive' },
            ],
        },
         { title: '관리자 메모', dataIndex: 'adminMemo', key: 'adminMemo', width: 150, ellipsis: true },
         { title: '처리 관리자', dataIndex: 'processedByAdmin', key: 'processedByAdmin', width: 120, align: 'center' },
        {
            title: '관리',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
                const currentStatus = record.calculatedStatus;
                const isReleasable = currentStatus === 'active' && !['permanent_ban'].includes(record.type);

                return (
                    <Space size="small">
                        <Tooltip title="수정">
                            <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} size="small" />
                        </Tooltip>
                        {isReleasable && (
                            <Popconfirm
                                title={`'${maskUserName(record.userName)}'(${maskUserId(record.userId)}) 사용자의 제재를 해제하시겠습니까?`}
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
                );
            }
        },
    ];

    const [isLoading, setIsLoading] = useState(false);

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>계정 제재 관리</Title>
            <Text type="secondary">서비스 이용 약관 위반 등으로 제재 조치된 계정 목록을 관리합니다. 개인정보(이름, ID)는 마스킹 처리되어 표시됩니다.</Text>

            <Space style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }} >
                 <Space wrap>
                     <Search
                        placeholder="사용자 ID, 이름, 사유 검색"
                        allowClear
                        enterButton={<><SearchOutlined /> 검색</>}
                        onSearch={handleSearch}
                        style={{ width: 250 }}
                     />
                    <FilterOutlined style={{ color: '#888', marginLeft: 8, marginRight: 4 }} />
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
                         <Option value="function_restriction">기능 제한</Option>
                         <Option value="post_deletion">게시물 삭제</Option>
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
                loading={isLoading}
                pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'] }}
                rowKey="key"
                scroll={{ x: 1400 }}
            />

            <Modal
                title={editingSanction ? "계정 제재 수정" : "새 계정 제재 등록"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingSanction ? "수정" : "등록"}
                cancelText="취소"
                destroyOnClose
                width={700}
                confirmLoading={false}
                centered
            >
                <Form
                    centered
                    form={form}
                    layout="vertical"
                    name="account_sanction_form"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                >
                     <Form.Item
                        name="userId"
                        label="대상 사용자"
                        rules={[{ required: true, message: '제재 대상 사용자를 선택해주세요!' }]}
                    >
                        <AutoComplete
                            options={userSearchOptions}
                            onSelect={onUserSelect}
                            onSearch={handleUserSearch}
                            placeholder="사용자 이름 또는 ID 검색하여 선택"
                            disabled={!!editingSanction}
                            allowClear
                        >
                            <Input suffix={<SearchOutlined />} />
                        </AutoComplete>
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="제재 유형"
                        rules={[{ required: true, message: '제재 유형을 선택해주세요!' }]}
                    >
                        <Select placeholder="제재 유형 선택">
                             <Option value="temporary_ban">기간 이용정지</Option>
                             <Option value="permanent_ban">영구 이용정지</Option>
                             <Option value="write_limit">글쓰기 제한</Option>
                             <Option value="read_limit">읽기 제한</Option>
                             <Option value="function_restriction">기능 제한 (예: 밀어주기)</Option>
                             <Option value="post_deletion">게시물 삭제</Option>
                             <Option value="warning">주의/경고</Option>
                        </Select>
                    </Form.Item>

                     <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
                     >
                         {({ getFieldValue }) => {
                             const type = getFieldValue('type');
                             const needsDuration = ['temporary_ban', 'write_limit', 'read_limit', 'function_restriction'].includes(type);
                             const needsStartDateOnly = ['permanent_ban', 'warning'].includes(type);

                             return (
                                 <>
                                     {needsDuration ? (
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="startDate"
                                                    label="제재 시작일"
                                                    rules={[{ required: true, message: '제재 시작일을 지정해주세요!' }]}
                                                >
                                                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="시작일 선택" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    name="endDate"
                                                    label="제재 종료일"
                                                    rules={[
                                                        { required: true, message: '기간제 제재는 종료일을 지정해야 합니다!' },
                                                        ({ getFieldValue }) => ({
                                                            validator(_, value) {
                                                                if (!value || !getFieldValue('startDate') || getFieldValue('startDate').isBefore(value)) {
                                                                    return Promise.resolve();
                                                                }
                                                                return Promise.reject(new Error('종료일은 시작일보다 이후여야 합니다!'));
                                                            },
                                                        }),
                                                    ]}
                                                >
                                                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="종료일 선택" />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ) : needsStartDateOnly ? (
                                        <Form.Item
                                            name="startDate"
                                            label="제재 시작일"
                                            rules={[{ required: true, message: '제재 시작일을 지정해주세요!' }]}
                                        >
                                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} placeholder="시작일 선택" />
                                        </Form.Item>
                                    ) : null}
                                 </>
                             );
                         }}
                     </Form.Item>

                    <Form.Item
                        name="reason"
                        label="제재 사유"
                        rules={[{ required: true, message: '제재 사유를 명확히 입력해주세요!' }]}
                    >
                        <TextArea rows={4} placeholder="예: 커뮤니티 가이드라인 위반 (반복적인 스팸성 밀어주기), 저작권 침해 콘텐츠 게시 등 구체적인 사유 명시"/>
                    </Form.Item>

                     <Form.Item
                        name="evidence"
                        label={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                <span>증거 자료 첨부 (선택)</span>
                                <Button icon={<UploadOutlined />} onClick={handleTriggerClick} size="small">파일 선택</Button>
                            </div>
                        }
                        tooltip="제재의 근거가 되는 스크린샷, 로그 파일 등을 첨부할 수 있습니다."
                     >
                         <div style={{
                             minHeight: '60px',
                             maxHeight: '100px',
                             overflowY: 'auto',
                             border: '1px solid #d9d9d9',
                             borderRadius: '4px',
                             padding: '8px',
                             marginTop: '8px',
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                         }}>
                             {fileList.length > 0 ? (
                                 <Upload
                                    ref={uploadRef}
                                    fileList={fileList}
                                    onChange={handleFileChange}
                                    beforeUpload={() => false}
                                    showUploadList={true}
                                    itemRender={(originNode, file, currFileList) => {
                                        return originNode;
                                    }}
                                 />
                             ) : (
                                 <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="첨부된 증거 자료가 없습니다." />
                             )}
                         </div>
                     </Form.Item>

                     {/* 처리 관리자 정보 (수정 시 표시) */}
                     {editingSanction && (
                         <Form.Item label="마지막 처리 관리자">
                             <Text type="secondary">{editingSanction.processedByAdmin || '-'}</Text>
                         </Form.Item>
                     )}

                     <Form.Item
                        name="adminMemo"
                        label="관리자 메모 (선택)"
                    >
                        <Input placeholder="처리 담당자(예: admin_hong), 특이사항, 참고 로그 위치 등 내부 기록용"/>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default AccountSanctions; 