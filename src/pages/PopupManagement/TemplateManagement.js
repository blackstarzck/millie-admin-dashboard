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
    MinusCircleOutlined, // For Form.List remove button
} from '@ant-design/icons';
import moment from 'moment';
import { usePopupTemplates } from '../../context/PopupTemplateContext'; // Import the hook

const { Title } = Typography;
const { TextArea } = Input;

// Initial Data - Removed, now managed by Context
/*
const initialTemplates = [
    { key: 'popupTpl001', id: 'popupTpl001', name: '긴급 공지 팝업 템플릿', description: '화면 중앙에 표시되는 긴급 공지 스타일', lastModified: '2024-07-21', content: '<div class="popup-urgent"><h1>긴급 공지</h1><p>{content}</p><button>닫기</button></div>', variables: [{ key: '{content}', label: '공지 내용' }] }, // Example variable
    { key: 'popupTpl002', id: 'popupTpl002', name: '이벤트 홍보 팝업 템플릿', description: '이미지와 버튼이 포함된 이벤트 안내 스타일', lastModified: '2024-07-22', content: '<div class="popup-event"><img src="{imageUrl}" alt="Event"><p>{text}</p><button>자세히 보기</button><button>닫기</button></div>', variables: [{ key: '{imageUrl}', label: '이미지 URL' }, { key: '{text}', label: '이벤트 문구' }] }, // Example variables
];
*/

const TemplateManagement = () => {
    // Use context instead of local state
    const { templates, addTemplate, updateTemplate, deleteTemplate } = usePopupTemplates();
    // const [templates, setTemplates] = useState(initialTemplates); // Removed local state
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
                if (editingTemplate) {
                    // Call context update function
                    updateTemplate(editingTemplate.key, values);
                    message.success('템플릿이 수정되었습니다.');
                } else {
                    // Call context add function
                    addTemplate(values);
                    message.success('새 템플릿이 추가되었습니다.');
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
        deleteTemplate(key);
        message.success('템플릿이 삭제되었습니다.');
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
                        label="템플릿 내용 (HTML/CSS, 아래 정의된 변수 사용 가능)"
                        rules={[{ required: true, message: '템플릿 내용을 입력해주세요!' }]}
                    >
                        <TextArea rows={15} placeholder='<div>...팝업 HTML 구조...</div>' />
                    </Form.Item>

                    {/* Variables Management Section */}
                    <Title level={5} style={{ marginTop: '20px' }}>템플릿 변수 정의</Title>
                     <Form.List name="variables">
                         {(fields, { add, remove }) => (
                             <>
                                 {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'key']}
                                            label="변수 키"
                                            rules={[{ required: true, message: '변수 키를 입력하세요 (예: {variable_name})' }]}
                                            style={{ flex: 1 }}
                                        >
                                             <Input placeholder="{variable_name}" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'label']}
                                            label="변수 설명"
                                            rules={[{ required: true, message: '팝업 생성 시 표시될 변수 설명을 입력하세요' }]}
                                            style={{ flex: 2 }}
                                        >
                                            <Input placeholder="예: 상품명" />
                                        </Form.Item>
                                         <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Space>
                                 ))}
                                 <Form.Item>
                                     <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                         변수 추가
                                     </Button>
                                 </Form.Item>
                             </>
                         )}
                     </Form.List>
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