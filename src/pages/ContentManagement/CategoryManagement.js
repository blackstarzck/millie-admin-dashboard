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
    AppstoreAddOutlined, // 카테고리 관련 아이콘
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

// --- Sample Data ---
const initialCategories = [
    { key: '1', id: 1, name: 'IT/기술', description: '프로그래밍, 네트워크, OS, 데이터베이스, 디자인 등 기술 관련 도서', order: 1, subCategories: [
        { key: 'it_sub_1', name: '프로그래밍 언어', order: 1 },
        { key: 'it_sub_2', name: '웹 개발', order: 2 },
        { key: 'it_sub_3', name: '데이터 분석', order: 3 },
    ] },
    { key: '2', id: 2, name: '문학', description: '소설, 시, 희곡, 에세이, 고전 등', order: 2, subCategories: [
        { key: 'lit_sub_1', name: '한국 소설', order: 1 },
        { key: 'lit_sub_2', name: '영미 소설', order: 2 },
    ] },
    { key: '3', id: 3, name: '자기계발', description: '성공학, 리더십, 시간 관리, 인간관계, 심리학 등', order: 3, subCategories: [] },
    { key: '4', id: 4, name: '경제/경영', description: '경영 전략, 마케팅, 재테크, 투자, 무역 등', order: 4, subCategories: [] },
    { key: '5', id: 5, name: '인문/사회/역사', description: '철학, 종교, 사회학, 정치, 역사, 문화 등', order: 5, subCategories: [] },
];

// --- Component ---
const CategoryManagement = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [form] = Form.useForm();

    // --- Modal Handling ---
    const showAddModal = () => {
        setEditingCategory(null);
        form.resetFields();
        // Set default order for new category
        const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 1;
        form.setFieldsValue({ order: nextOrder, subCategories: [{ name: '', order: 1, key: Date.now() }] }); // 기본 하위 카테고리 필드 1개 추가
        setIsModalOpen(true);
    };

    const showEditModal = (category) => {
        setEditingCategory(category);
        // 하위 카테고리에 고유 key가 없으면 생성 (Form.List 키 문제 방지)
        const subCategoriesWithKeys = (category.subCategories || []).map((sub, index) => ({
            ...sub,
            key: sub.key || `sub_key_${index}_${Date.now()}` 
        }));
        form.setFieldsValue({ ...category, subCategories: subCategoriesWithKeys });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        form.resetFields();
    };

    // --- Form Submission ---
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                // Ensure order is a number
                const processedValues = {
                    ...values,
                    order: Number(values.order) || 0,
                    subCategories: (values.subCategories || []).map(sub => ({ ...sub, order: Number(sub.order) || 0 })).sort((a,b) => a.order - b.order),
                };

                if (editingCategory) {
                    // Update existing category
                    setCategories(prevCategories =>
                        prevCategories
                            .map(cat => cat.key === editingCategory.key ? { ...cat, ...processedValues } : cat)
                            .sort((a, b) => a.order - b.order) // Sort after update
                    );
                    message.success('카테고리가 수정되었습니다.');
                } else {
                    // Add new category
                    const newCategory = {
                        key: (categories.length + 1).toString(), // Ensure key is string for AntD Table
                        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
                        ...processedValues,
                    };
                    setCategories(prevCategories =>
                        [...prevCategories, newCategory].sort((a, b) => a.order - b.order) // Sort after adding
                    );
                    message.success('새 카테고리가 추가되었습니다.');
                }
                form.resetFields();
                setIsModalOpen(false);
                setEditingCategory(null);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('폼 입력값을 확인해주세요.');
            });
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '순서', dataIndex: 'order', key: 'order', width: 80, sorter: (a, b) => a.order - b.order, defaultSortOrder: 'ascend' },
        { title: '카테고리명', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: '설명', dataIndex: 'description', key: 'description', ellipsis: true },
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
                    {/* Add drag-and-drop handle for reordering if using a Tree or specific Table setup */}
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>카테고리 관리</Title>
            <Text type="secondary">도서 분류에 사용될 카테고리를 관리합니다. 순서를 조정하여 노출 순서를 변경할 수 있습니다.</Text>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                >
                    새 카테고리 추가
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={categories}
                pagination={false} // Assuming not too many categories, otherwise configure pagination
                rowKey="key"
                // Add drag-and-drop functionality here if needed using libraries like react-dnd
            />

            {/* Add/Edit Category Modal */}
            <Modal
                title={editingCategory ? "카테고리 수정" : "새 카테고리 추가"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingCategory ? "수정" : "추가"}
                cancelText="취소"
                destroyOnClose // Reset form state when modal is closed
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="category_form"
                >
                    <Form.Item
                        name="name"
                        label="카테고리명"
                        rules={[
                            { required: true, message: '카테고리명을 입력해주세요!' },
                            {
                                validator: (_, value) => {
                                    const lowerCaseValue = value && value.toLowerCase();
                                    const isDuplicate = categories.some(
                                        category => 
                                            category.name.toLowerCase() === lowerCaseValue &&
                                            (!editingCategory || category.key !== editingCategory.key)
                                    );
                                    if (isDuplicate) {
                                        return Promise.reject(new Error('이미 사용 중인 카테고리명입니다.'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="설명"
                        rules={[{ required: true, message: '카테고리 설명을 입력해주세요!' }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                     <Form.Item
                        name="order"
                        label="노출 순서 (카테고리)"
                        rules={[{ required: true, message: '노출 순서를 입력해주세요!' }, { type: 'number', message: '숫자만 입력 가능합니다.', transform: value => Number(value) }]}
                        tooltip="숫자가 작을수록 먼저 노출됩니다."
                    >
                        <Input type="number" min={1} style={{ width: '100px' }}/>
                    </Form.Item>

                    <Title level={5} style={{ marginTop: '20px', marginBottom: '10px' }}>하위 카테고리 관리</Title>
                    <Form.List name="subCategories">
                        {(fields, { add, remove }) => (
                            <>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #d9d9d9', padding: '8px', borderRadius: '2px' }}>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8, alignItems: 'baseline' }} align="baseline">
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'name']}
                                                rules={[{ required: true, message: '하위 카테고리명을 입력하세요.' }]}
                                                style={{ width: '300px' }}
                                            >
                                                <Input placeholder="하위 카테고리명" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'order']}
                                                rules={[{ required: true, message: '순서를 입력하세요.' }, { type: 'number', message: '숫자만 입력 가능', transform: value => Number(value)}]}
                                                style={{ width: '100px' }}
                                            >
                                                <Input type="number" min={1} placeholder="순서" />
                                            </Form.Item>
                                            <Button type="link" danger onClick={() => remove(name)}>
                                                삭제
                                            </Button>
                                        </Space>
                                    ))}
                                </div>
                                <Form.Item style={{ marginTop: '12px' }}>
                                    <Button type="dashed" onClick={() => add({ name: '', order: (form.getFieldValue(['subCategories'])?.length || 0) + 1, key: Date.now() })} block icon={<PlusOutlined />}>
                                        하위 카테고리 추가
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                    {/* Add parent category selection if hierarchical structure is needed */}
                    {/* <Form.Item name="parentId" label="상위 카테고리"><Select>...</Select></Form.Item> */}
                </Form>
            </Modal>
        </Space>
    );
};

export default CategoryManagement; 