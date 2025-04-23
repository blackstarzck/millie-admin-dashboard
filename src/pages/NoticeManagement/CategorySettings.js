import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Space,
    Typography,
    Tooltip,
    InputNumber,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UnorderedListOutlined, // Category Icon
    QuestionCircleOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// --- Sample Data ---
const initialCategories = [
    { key: 'cat1', id: 1, name: '서비스 공지', description: '서비스 관련 중요 업데이트 및 점검 공지', order: 1 },
    { key: 'cat2', id: 2, name: '이벤트 안내', description: '진행 중이거나 예정된 이벤트 정보', order: 2 },
    { key: 'cat3', id: 3, name: '일반 공지', description: '기타 일반적인 안내사항', order: 3 },
];

// --- Component ---
const CategorySettings = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    // --- Modal Handlers ---
    const showModal = (category = null) => {
        setEditingCategory(category);
        form.setFieldsValue(category ? category : { name: '', description: '', order: categories.length + 1 });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const key = editingCategory ? editingCategory.key : `cat_${Date.now()}`;
                const id = editingCategory ? editingCategory.id : Date.now(); // Replace with actual ID generation
                const messageKey = 'categorySave';
                message.loading({ content: '카테고리 저장 중...', key: messageKey });

                const newCategoryData = { ...values, key, id };
                console.log('Saving category:', newCategoryData);

                // TODO: API Call for create/update
                setTimeout(() => { // Simulate API delay
                    if (editingCategory) {
                        setCategories(categories.map(cat => cat.key === editingCategory.key ? { ...cat, ...values } : cat));
                        message.success({ content: `'${values.name}' 카테고리가 수정되었습니다.`, key: messageKey });
                    } else {
                        setCategories([...categories, newCategoryData].sort((a, b) => a.order - b.order));
                        message.success({ content: `'${values.name}' 카테고리가 추가되었습니다.`, key: messageKey });
                    }
                    handleCancel();
                }, 500);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    // --- Delete Handler ---
    const handleDelete = (key, name) => {
        const messageKey = 'categoryDelete';
        message.loading({ content: `'${name}' 카테고리 삭제 중...`, key: messageKey });
        // TODO: Check if category is in use before deleting / API call for delete
        console.log('Deleting category key:', key);
        setTimeout(() => { // Simulate API delay
            setCategories(categories.filter(cat => cat.key !== key));
            message.success({ content: `'${name}' 카테고리가 삭제되었습니다.`, key: messageKey });
        }, 500);
    };

    // --- Table Columns ---
    const columns = [
        {
            title: '순서',
            dataIndex: 'order',
            key: 'order',
            width: 80,
            sorter: (a, b) => a.order - b.order,
        },
        {
            title: '카테고리명',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '설명',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '관리',
            key: 'action',
            width: 150,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="수정">
                        <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                    </Tooltip>
                    <Popconfirm
                        title={`'${record.name}' 카테고리를 삭제하시겠습니까?`}
                        description="삭제 시 복구가 불가능하며, 해당 카테고리의 공지사항 처리 방안을 확인해야 합니다."
                        onConfirm={() => handleDelete(record.key, record.name)}
                        okText="삭제"
                        cancelText="취소"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                    >
                        <Tooltip title="삭제 (주의)">
                            <Button icon={<DeleteOutlined />} danger />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><UnorderedListOutlined /> 공지사항 카테고리 설정</Title>
            <Text>공지사항을 분류할 카테고리를 관리합니다.</Text>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ alignSelf: 'flex-start' }}
            >
                새 카테고리 추가
            </Button>

            <Table
                columns={columns}
                dataSource={categories.sort((a, b) => a.order - b.order)} // Ensure data is sorted by order
                pagination={false} // No pagination usually for category lists
                rowKey="key"
                bordered
                size="small"
                // Add drag-and-drop functionality here if needed later (e.g., using dnd-kit or react-beautiful-dnd)
            />

            {/* Add/Edit Modal */}
            <Modal
                title={editingCategory ? `카테고리 수정: ${editingCategory.name}` : '새 카테고리 추가'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingCategory ? '수정' : '추가'}
                cancelText="취소"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="category_form">
                    <Form.Item
                        name="name"
                        label="카테고리명"
                        rules={[{ required: true, message: '카테고리명을 입력해주세요.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="설명"
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="order"
                        label="순서"
                        rules={[{ required: true, type:'number', message: '순서를 입력해주세요.' }]}
                    >
                        <InputNumber min={1} style={{width: '100px'}}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default CategorySettings; 