import React, { useState, useMemo } from 'react';
import {
    Table,
    Tag,
    Button,
    Input,
    Select,
    DatePicker,
    Space,
    Typography,
    Tooltip,
    Modal,
    Form,
    message,
    Descriptions, // For modal detail view
    Radio, // For status update in modal
    Input as AntInput, // Rename to avoid conflict
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    EyeOutlined,
    EditOutlined, // For reply button
    CheckCircleOutlined, // For answered status
    ClockCircleOutlined, // For pending status
    QuestionCircleOutlined, // For inquiry type icon
    SettingOutlined, // For inquiry type icon (e.g., technical)
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = AntInput;

// --- Sample Data ---
const initialInquiries = [
    { key: 'inq1', id: 'INQ001', type: 'account', title: '비밀번호 변경 문의', author: 'user123', userId: 'u001', createdAt: '2024-07-28 10:30:15', status: 'pending', content: '비밀번호를 변경하고 싶은데 방법을 모르겠습니다. 자세히 알려주세요.', answer: null, answeredAt: null, adminResponder: null },
    { key: 'inq2', id: 'INQ002', type: 'service', title: 'OO 기능 오류 리포트', author: 'tester01', userId: 'u002', createdAt: '2024-07-27 15:05:00', status: 'answered', content: 'XX 화면에서 버튼 클릭 시 에러 메시지가 발생합니다. 확인 부탁드립니다. 스크린샷 첨부합니다.', answer: '안녕하세요, tester01님. 문의주신 오류는 확인 후 금일 패치를 통해 수정 완료되었습니다. 이용에 불편을 드려 죄송합니다.', answeredAt: '2024-07-28 09:15:30', adminResponder: 'admin_A' },
    { key: 'inq3', id: 'INQ003', type: 'payment', title: '결제 취소 요청', author: 'customer', userId: 'u003', createdAt: '2024-07-26 09:00:45', status: 'pending', content: '실수로 잘못 결제했습니다. 취소 부탁드립니다. 주문번호: ORD12345', answer: null, answeredAt: null, adminResponder: null },
    { key: 'inq4', id: 'INQ004', type: 'etc', title: '기타 문의사항', author: 'anonymous', userId: null, createdAt: '2024-07-25 18:20:00', status: 'answered', content: '앱 디자인이 너무 예뻐요!', answer: '칭찬 감사합니다! 더 좋은 서비스를 위해 노력하겠습니다.', answeredAt: '2024-07-26 11:00:00', adminResponder: 'admin_B' },
];

// --- Helper Functions ---
const getStatusTag = (status) => {
    switch (status) {
        case 'pending':
            return <Tag icon={<ClockCircleOutlined />} color="warning">답변 대기</Tag>;
        case 'answered':
            return <Tag icon={<CheckCircleOutlined />} color="success">답변 완료</Tag>;
        default:
            return <Tag>{status}</Tag>;
    }
};

const getTypeDisplay = (type) => {
    // Could use icons or specific text based on type
    switch (type) {
        case 'account': return <><UserOutlined /> 계정 관련</>;
        case 'service': return <><SettingOutlined /> 서비스 이용</>;
        case 'payment': return <><CreditCardOutlined /> 결제/환불</>;
        case 'etc': return <><QuestionCircleOutlined /> 기타</>;
        default: return type;
    }
};

// --- Component ---
const InquiryList = () => {
    const [inquiries, setInquiries] = useState(initialInquiries);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({
        type: 'all',
        status: 'all',
        dateRange: null,
    });
    const [form] = Form.useForm(); // Form for the reply modal

    // --- Search & Filter Logic ---
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        if (type === 'dateRange') {
            setFilters(prev => ({ ...prev, dateRange: value }));
        } else {
            setFilters(prev => ({ ...prev, [type]: value }));
        }
    };

    const filteredInquiries = useMemo(() => {
        const [startDate, endDate] = filters.dateRange || [null, null];
        return inquiries.filter(inquiry => {
            const matchesSearch = searchText
                ? inquiry.title.toLowerCase().includes(searchText) ||
                  inquiry.author.toLowerCase().includes(searchText) ||
                  (inquiry.userId && inquiry.userId.toLowerCase().includes(searchText)) ||
                  inquiry.content.toLowerCase().includes(searchText)
                : true;
            const matchesType = filters.type === 'all' || inquiry.type === filters.type;
            const matchesStatus = filters.status === 'all' || inquiry.status === filters.status;
            const inquiryDate = moment(inquiry.createdAt);
            const matchesDate = (!startDate || inquiryDate.isSameOrAfter(startDate, 'day')) &&
                              (!endDate || inquiryDate.isSameOrBefore(endDate, 'day'));

            return matchesSearch && matchesType && matchesStatus && matchesDate;
        });
    }, [inquiries, searchText, filters]);

    // --- Modal Handling ---
    const showDetailModal = (inquiry) => {
        setSelectedInquiry(inquiry);
        form.setFieldsValue({
            answer: inquiry.answer || '',
            status: inquiry.status,
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedInquiry(null);
        form.resetFields();
    };

    // --- Reply/Status Update Logic ---
    const handleOk = () => {
        if (!selectedInquiry) return;

        form.validateFields()
            .then(values => {
                const updatedInquiry = {
                    ...selectedInquiry,
                    answer: values.answer,
                    status: values.status,
                    // Only update answeredAt and adminResponder if status changes to answered
                    answeredAt: values.status === 'answered' && !selectedInquiry.answeredAt ? moment().format('YYYY-MM-DD HH:mm:ss') : selectedInquiry.answeredAt,
                    adminResponder: values.status === 'answered' && !selectedInquiry.adminResponder ? 'current_admin' : selectedInquiry.adminResponder, // Replace with actual admin ID
                };

                setInquiries(prevInquiries =>
                    prevInquiries.map(inq =>
                        inq.key === updatedInquiry.key ? updatedInquiry : inq
                    )
                );

                message.success(`문의사항(ID: ${selectedInquiry.id}) 정보가 업데이트되었습니다.`);
                // TODO: API call to update inquiry details
                console.log('Updated Inquiry:', updatedInquiry);
                handleCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('답변 내용을 확인해주세요.');
            });
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
        {
            title: '유형', dataIndex: 'type', key: 'type', width: 120,
            render: getTypeDisplay,
            filters: [
                { text: '계정 관련', value: 'account' },
                { text: '서비스 이용', value: 'service' },
                { text: '결제/환불', value: 'payment' },
                { text: '기타', value: 'etc' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        {
            title: '제목', dataIndex: 'title', key: 'title',
            render: (text, record) => (
                <Button type="link" onClick={() => showDetailModal(record)} style={{ padding: 0, height: 'auto' }}>
                    {text}
                </Button>
            ),
        },
        { title: '작성자', dataIndex: 'author', key: 'author', width: 120 },
        { title: '사용자 ID', dataIndex: 'userId', key: 'userId', width: 100, render: (id) => id || '-' },
        {
            title: '작성일', dataIndex: 'createdAt', key: 'createdAt', width: 150,
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
            defaultSortOrder: 'descend',
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 120,
            render: getStatusTag,
            filters: [
                { text: '답변 대기', value: 'pending' },
                { text: '답변 완료', value: 'answered' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: '관리',
            key: 'action',
            width: 80,
            align: 'center',
            render: (_, record) => (
                <Tooltip title="상세 보기 및 답변">
                    <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} size="small" />
                </Tooltip>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>문의 목록 관리</Title>
            <Text type="secondary">사용자가 등록한 문의사항을 확인하고 답변을 관리합니다.</Text>

            {/* Filter Controls */}
            <Space wrap style={{ marginBottom: 16 }}>
                <Search
                    placeholder="제목, 작성자, 내용 등 검색"
                    allowClear
                    enterButton={<><SearchOutlined /> 검색</>}
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
                <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                <Select
                    value={filters.type}
                    onChange={(value) => handleFilterChange('type', value)}
                    style={{ width: 150 }}
                    aria-label="문의 유형 필터"
                >
                    <Option value="all">전체 유형</Option>
                    <Option value="account">계정 관련</Option>
                    <Option value="service">서비스 이용</Option>
                    <Option value="payment">결제/환불</Option>
                    <Option value="etc">기타</Option>
                </Select>
                <Select
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    style={{ width: 120 }}
                    aria-label="답변 상태 필터"
                >
                    <Option value="all">전체 상태</Option>
                    <Option value="pending">답변 대기</Option>
                    <Option value="answered">답변 완료</Option>
                </Select>
                <RangePicker
                    value={filters.dateRange}
                    onChange={(dates) => handleFilterChange('dateRange', dates)}
                    placeholder={['시작일', '종료일']}
                />
            </Space>

            <Table
                columns={columns}
                dataSource={filteredInquiries}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 1000 }}
                size="middle"
            />

            {/* Detail & Reply Modal */}
            <Modal
                title={`문의 상세 정보 (ID: ${selectedInquiry?.id})`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText="답변 저장 및 상태 변경"
                cancelText="닫기"
                destroyOnClose
            >
                {selectedInquiry && (
                    <Form form={form} layout="vertical">
                        <Descriptions bordered column={2} size="small">
                            <Descriptions.Item label="문의 유형">{getTypeDisplay(selectedInquiry.type)}</Descriptions.Item>
                            <Descriptions.Item label="작성자">{selectedInquiry.author} ({selectedInquiry.userId || '비회원'})</Descriptions.Item>
                            <Descriptions.Item label="작성일">{moment(selectedInquiry.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                            <Descriptions.Item label="현재 상태">{getStatusTag(selectedInquiry.status)}</Descriptions.Item>
                            <Descriptions.Item label="제목" span={2}>{selectedInquiry.title}</Descriptions.Item>
                            <Descriptions.Item label="문의 내용" span={2}>
                                <Paragraph style={{ maxHeight: 150, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                                    {selectedInquiry.content}
                                </Paragraph>
                            </Descriptions.Item>
                            {selectedInquiry.answeredAt && (
                                <Descriptions.Item label="답변자">{selectedInquiry.adminResponder || '-'}</Descriptions.Item>
                            )}
                            {selectedInquiry.answeredAt && (
                                <Descriptions.Item label="답변일">{moment(selectedInquiry.answeredAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
                            )}
                        </Descriptions>

                        <Form.Item
                            name="answer"
                            label="답변 내용"
                            rules={[{ required: form.getFieldValue('status') === 'answered', message: '답변 완료 상태로 변경 시 답변 내용은 필수입니다.' }]}
                            style={{ marginTop: 24 }}
                        >
                            <TextArea rows={6} placeholder="답변 내용을 입력하세요." />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="답변 상태 변경"
                            rules={[{ required: true }]}
                        >
                            <Radio.Group>
                                <Radio value="pending">답변 대기</Radio>
                                <Radio value="answered">답변 완료</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </Space>
    );
};

export default InquiryList; 