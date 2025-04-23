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
    Tooltip, // For icon buttons
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined, // For Preview
} from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

// Initial Data
const initialTemplates = [
    { key: 'popupTpl001', id: 'popupTpl001', name: '긴급 공지 팝업 템플릿', description: '화면 중앙에 표시되는 긴급 공지 스타일', lastModified: '2024-07-21', content: '<div class="popup-urgent"><h1>긴급 공지</h1><p>{content}</p><button>닫기</button></div>' },
    { key: 'popupTpl002', id: 'popupTpl002', name: '이벤트 홍보 팝업 템플릿', description: '이미지와 버튼이 포함된 이벤트 안내 스타일', lastModified: '2024-07-22', content: '<div class="popup-event"><img src="{imageUrl}" alt="Event"><p>{text}</p><button>자세히 보기</button><button>닫기</button></div>' },
];

const TemplateManagement = () => {
    const [templates, setTemplates] = useState(initialTemplates);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
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
                    lastModified: moment().format('YYYY-MM-DD'), // Update last modified date
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
                        key: `popupTpl${(templates.length + 1).toString().padStart(3, '0')}`, // Simple key generation
                        id: `popupTpl${(templates.length + 1).toString().padStart(3, '0')}`,
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
     const showPreview = (content) => {
        // Basic preview - render HTML content directly (Use with caution!)
        // In a real application, use a safer method like an iframe or a dedicated preview component.
        setPreviewContent(content);
        setIsPreviewModalOpen(true);
     };

     const handlePreviewCancel = () => {
         setIsPreviewModalOpen(false);
         setPreviewContent('');
     };


    // --- Table Columns Definition ---
    const columns = [
        { title: '템플릿 ID', dataIndex: 'id', key: 'id', width: 150 },
        { title: '템플릿명', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: '설명', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: '최종 수정일', dataIndex: 'lastModified', key: 'lastModified', width: 120,
            sorter: (a, b) => moment(a.lastModified).unix() - moment(b.lastModified).unix(),
            defaultSortOrder: 'descend'
        },
        {
            title: '관리', key: 'action', width: 180, align: 'center',
            render: (_, record) => (
                <Space size="small">
                     <Tooltip title="미리보기">
                        <Button icon={<EyeOutlined />} onClick={() => showPreview(record.content)} size="small" />
                    </Tooltip>
                    <Tooltip title="수정">
                         <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} size="small" />
                    </Tooltip>
                    <Tooltip title="삭제">
                        <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} danger size="small" />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>팝업 템플릿 관리</Title>
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
                title={editingTemplate ? "팝업 템플릿 수정" : "새 팝업 템플릿 추가"}
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
                    name="template_form"
                >
                    <Form.Item
                        name="name"
                        label="템플릿명"
                        rules={[{ required: true, message: '템플릿명을 입력해주세요!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="설명"
                    >
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="템플릿 내용 (HTML/CSS, 변수 사용 가능: {content}, {imageUrl} 등)"
                        rules={[{ required: true, message: '템플릿 내용을 입력해주세요!' }]}
                    >
                        {/* In a real app, consider a dedicated code editor like Monaco Editor */}
                        <TextArea rows={15} placeholder='<div>...팝업 HTML 구조...</div>' />
                    </Form.Item>
                </Form>
            </Modal>

             {/* Preview Modal */}
             <Modal
                title="템플릿 미리보기"
                open={isPreviewModalOpen}
                onCancel={handlePreviewCancel}
                footer={null} // No OK/Cancel buttons
                width={600}
             >
                {/* WARNING: dangerouslySetInnerHTML is unsafe if content comes from users */}
                {/* Consider using a sandboxed iframe for safe preview */}
                <div dangerouslySetInnerHTML={{ __html: previewContent }} />
             </Modal>

        </Space>
    );
};

export default TemplateManagement; 