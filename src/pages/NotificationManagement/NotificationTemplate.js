import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Typography,
    message,
    Popconfirm,
    Tooltip,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// Initial Data
const initialTemplates = [
    { key: 'tpl001', id: 'tpl001', name: '환영 메시지', title: '회원가입을 환영합니다!', content: '[이름]님, 밀리의 서재에 오신 것을 환영합니다! 지금 바로 첫 달 무료 혜택을 확인해보세요.', lastModified: '2024-07-20' },
    { key: 'tpl002', id: 'tpl002', name: '이벤트 안내 (신간)', title: '[신간 제목] 출간 기념 이벤트! ', content: '독자님의 취향을 저격할 [신간 제목]이 출간되었습니다! 지금 바로 특별 이벤트에 참여하고 혜택을 받아가세요. [링크]', lastModified: '2024-07-25' },
    { key: 'tpl003', id: 'tpl003', name: '독서 루틴 알림', title: '오늘의 독서, 시작하셨나요? 📚', content: '[이름]님, 잠시 밀리의 서재와 함께 마음의 양식을 쌓아보는 건 어때요? 꾸준한 독서는 성장의 밑거름이 됩니다.', lastModified: '2024-07-28' },
];

const NotificationTemplate = () => {
    const [templates, setTemplates] = useState(initialTemplates);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [form] = Form.useForm();

    // --- Modal Handling (Add/Edit) ---
    const showAddModal = () => {
        setEditingTemplate(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const showEditModal = (template) => {
        setEditingTemplate(template);
        form.setFieldsValue(template);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingTemplate(null);
        form.resetFields();
    };

    // --- Form Submission (Add/Edit) ---
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const processedValues = {
                    ...values,
                    lastModified: moment().format('YYYY-MM-DD HH:mm'), // Include time
                };

                if (editingTemplate) {
                    const updatedTemplates = templates.map(tpl =>
                        tpl.key === editingTemplate.key ? { ...tpl, ...processedValues } : tpl
                    );
                    setTemplates(updatedTemplates);
                    message.success('템플릿이 수정되었습니다.');
                    console.log('Updating template:', editingTemplate.key, processedValues);
                } else {
                    const newTemplate = {
                        key: `tpl${(templates.length + 1).toString().padStart(3, '0')}`,
                        id: `tpl${(templates.length + 1).toString().padStart(3, '0')}`,
                        ...processedValues,
                    };
                    setTemplates([newTemplate, ...templates]);
                    message.success('새 템플릿이 추가되었습니다.');
                    console.log('Adding new template:', processedValues);
                }
                form.resetFields();
                setIsModalOpen(false);
                setEditingTemplate(null);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('폼 입력값을 확인해주세요.');
            });
    };

    // --- Delete Handling ---
    const handleDelete = (key) => {
        setTemplates(templates.filter(tpl => tpl.key !== key));
        message.success('템플릿이 삭제되었습니다.');
        console.log('Deleting template key:', key);
    };

    // --- Preview Handling ---
    const showPreview = (template) => {
        setPreviewTemplate(template);
        setIsPreviewModalOpen(true);
    };

    const handlePreviewCancel = () => {
        setIsPreviewModalOpen(false);
        setPreviewTemplate(null);
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: '템플릿 ID', dataIndex: 'id', key: 'id', width: 120 },
        { title: '템플릿명', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        {
            title: '제목 미리보기', dataIndex: 'title', key: 'title',
            ellipsis: true, // Prevent long titles from breaking layout
        },
        {
            title: '최종 수정일', dataIndex: 'lastModified', key: 'lastModified', width: 150,
            sorter: (a, b) => moment(a.lastModified).unix() - moment(b.lastModified).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: '관리', key: 'action', width: 180, align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="미리보기">
                        <Button icon={<EyeOutlined />} onClick={() => showPreview(record)} size="small" />
                    </Tooltip>
                    <Tooltip title="수정">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} size="small" />
                    </Tooltip>
                    <Popconfirm
                        title="이 템플릿을 삭제하시겠습니까?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="삭제"
                        cancelText="취소"
                    >
                         <Tooltip title="삭제">
                             <Button icon={<DeleteOutlined />} danger size="small" />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>알림 템플릿 관리</Title>
            <Text type="secondary">사용자에게 발송될 알림 메시지의 템플릿을 관리합니다. 변수(예: [이름], [신간 제목])를 사용하여 개인화된 메시지를 작성할 수 있습니다.</Text>
             <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                >
                    새 템플릿 추가
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={templates}
                pagination={{ pageSize: 10 }}
                rowKey="key"
            />

            {/* Add/Edit Template Modal */}
            <Modal
                title={editingTemplate ? "알림 템플릿 수정" : "새 알림 템플릿 추가"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingTemplate ? "수정" : "추가"}
                cancelText="취소"
                width={720}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="notification_template_form"
                >
                    <Form.Item
                        name="name"
                        label="템플릿명"
                        rules={[{ required: true, message: '템플릿명을 입력해주세요!' }]}
                        tooltip="관리자가 식별하기 위한 이름입니다 (예: 신규 가입 환영)"
                    >
                        <Input />
                    </Form.Item>
                     <Form.Item
                        name="title"
                        label="알림 제목"
                        rules={[{ required: true, message: '알림 제목을 입력해주세요!' }]}
                        tooltip="푸시 알림, 카카오톡 알림 등에서 제목으로 표시됩니다."
                    >
                        <Input placeholder="예: [이름]님, 새로운 이벤트가 도착했어요!" />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="알림 내용"
                        rules={[{ required: true, message: '알림 내용을 입력해주세요!' }]}
                        tooltip="실제 발송될 메시지 내용입니다. 사용 가능한 변수: [이름], [도서제목], [이벤트명], [링크] 등"
                    >
                        <TextArea rows={6} placeholder="예: [이름]님, 즐거운 독서 경험을 위해 밀리의 서재가 특별한 이벤트를 준비했어요! 지금 확인해보세요. [링크]" />
                    </Form.Item>
                    {/* Add template type selection (Push, Email, SMS, Kakao...) if needed */}
                     {/* <Form.Item name="type" label="템플릿 타입"><Select><Option value="push">푸시 알림</Option>...</Select></Form.Item> */}
                </Form>
            </Modal>

            {/* Preview Modal */}
            <Modal
                title="템플릿 미리보기"
                open={isPreviewModalOpen}
                onCancel={handlePreviewCancel}
                footer={[
                   <Button key="back" onClick={handlePreviewCancel}>
                     닫기
                   </Button>,
                 ]}
                width={400}
            >
                {previewTemplate && (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Text strong>템플릿명:</Text>
                        <Paragraph>{previewTemplate.name}</Paragraph>
                        <Text strong>알림 제목:</Text>
                        <Paragraph code style={{ whiteSpace: 'pre-wrap' }}>{previewTemplate.title}</Paragraph>
                        <Text strong>알림 내용:</Text>
                        <Paragraph style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                            {previewTemplate.content}
                        </Paragraph>
                    </Space>
                )}
            </Modal>

        </Space>
    );
};

export default NotificationTemplate; 