import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Typography,
    message,
    Popconfirm,
    Tooltip,
    Tag, // 필드 타입 표시용
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    OrderedListOutlined, // 순서 관련 아이콘
    TagOutlined, // 타입 관련 아이콘
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- Sample Data ---
const initialFields = [
    { key: '1', id: 1, name: '저자', fieldKey: 'author', type: 'text', description: '도서 또는 콘텐츠의 저자/제작자 이름', required: true, order: 1 },
    { key: '2', id: 2, name: '출판사', fieldKey: 'publisher', type: 'text', description: '콘텐츠를 출판/배급한 회사', required: false, order: 2 },
    { key: '3', id: 3, name: '출판일', fieldKey: 'publishDate', type: 'date', description: '콘텐츠가 공식적으로 출판된 날짜', required: true, order: 3 },
    { key: '4', id: 4, name: 'ISBN', fieldKey: 'isbn', type: 'text', description: '국제 표준 도서 번호 (10자리 또는 13자리)', required: false, order: 4 },
    { key: '5', id: 5, name: '페이지 수', fieldKey: 'pages', type: 'number', description: '도서의 총 페이지 수', required: false, order: 5 },
    { key: '6', id: 6, name: '키워드', fieldKey: 'keywords', type: 'tags', description: '콘텐츠 검색 및 분류에 사용될 키워드 (쉼표로 구분)', required: false, order: 6 },
    { key: '7', id: 7, name: '소개글', fieldKey: 'introduction', type: 'textarea', description: '콘텐츠에 대한 간략한 소개 또는 요약', required: true, order: 7 },
];

// --- Helper Function ---
const getFieldTypeTag = (type) => {
    switch (type) {
        case 'text': return <Tag color="blue">텍스트</Tag>;
        case 'number': return <Tag color="green">숫자</Tag>;
        case 'date': return <Tag color="orange">날짜</Tag>;
        case 'tags': return <Tag color="purple">태그</Tag>;
        case 'textarea': return <Tag color="cyan">장문텍스트</Tag>;
        case 'select': return <Tag color="geekblue">선택</Tag>; // 예시: 선택형 타입
        default: return <Tag>{type}</Tag>;
    }
};

// --- Component ---
const MetadataManagement = () => {
    const [fields, setFields] = useState(initialFields);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [form] = Form.useForm();

    // --- Modal Handling ---
    const showAddModal = () => {
        setEditingField(null);
        form.resetFields();
        const nextOrder = fields.length > 0 ? Math.max(...fields.map(f => f.order)) + 1 : 1;
        form.setFieldsValue({ type: 'text', required: false, order: nextOrder }); // 기본값 설정
        setIsModalOpen(true);
    };

    const showEditModal = (field) => {
        setEditingField(field);
        form.setFieldsValue(field);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingField(null);
        form.resetFields();
    };

    // --- Form Submission ---
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                 // Generate fieldKey from name if not provided (simple example)
                 const generatedKey = values.name.toLowerCase().replace(/\s+/g, '_'); // 공백을 _로
                 const processedValues = {
                     ...values,
                     fieldKey: values.fieldKey || generatedKey, // 키가 없으면 이름 기반 생성
                     order: Number(values.order) || 0,
                 };

                if (editingField) {
                    setFields(prevFields =>
                        prevFields
                            .map(f => f.key === editingField.key ? { ...f, ...processedValues } : f)
                            .sort((a, b) => a.order - b.order)
                    );
                    message.success('메타데이터 필드가 수정되었습니다.');
                } else {
                    const newField = {
                        key: (fields.length + 1).toString(),
                        id: fields.length > 0 ? Math.max(...fields.map(f => f.id)) + 1 : 1,
                        ...processedValues,
                    };
                    setFields(prevFields =>
                        [...prevFields, newField].sort((a, b) => a.order - b.order)
                    );
                    message.success('새 메타데이터 필드가 추가되었습니다.');
                }
                form.resetFields();
                setIsModalOpen(false);
                setEditingField(null);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('폼 입력값을 확인해주세요.');
            });
    };

    // --- Delete Handling ---
    const handleDelete = (key) => {
        setFields(prevFields => prevFields.filter(f => f.key !== key));
        message.success('메타데이터 필드가 삭제되었습니다.');
        // TODO: API Call to delete field. Also consider impact on existing content using this field.
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '순서', dataIndex: 'order', key: 'order', width: 80, sorter: (a, b) => a.order - b.order, defaultSortOrder: 'ascend' },
        { title: '필드명', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: '필드 키', dataIndex: 'fieldKey', key: 'fieldKey', width: 150, render: (text) => <code>{text}</code> },
        {
            title: '타입', dataIndex: 'type', key: 'type', width: 120, align: 'center',
            render: getFieldTypeTag,
            filters: [
                { text: '텍스트', value: 'text' },
                { text: '숫자', value: 'number' },
                { text: '날짜', value: 'date' },
                { text: '태그', value: 'tags' },
                { text: '장문텍스트', value: 'textarea' },
                { text: '선택', value: 'select' },
            ],
            onFilter: (value, record) => record.type === value,
        },
        { title: '설명', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: '필수', dataIndex: 'required', key: 'required', width: 80, align: 'center',
            render: (required) => (required ? <Tag color="red">필수</Tag> : <Tag>선택</Tag>)
        },
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
                    <Popconfirm
                        title={`'${record.name}' 필드를 삭제하시겠습니까? 이 필드를 사용하는 기존 콘텐츠 데이터에 영향을 줄 수 있습니다.`}
                        onConfirm={() => handleDelete(record.key)}
                        okText="삭제"
                        cancelText="취소"
                        placement="topRight"
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
            <Title level={2}>메타데이터 필드 관리</Title>
            <Text type="secondary">콘텐츠 등록 시 사용할 메타데이터 필드를 정의하고 관리합니다. 필드 키는 시스템 내부적으로 사용됩니다.</Text>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                >
                    새 메타데이터 필드 추가
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={fields}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 1000 }}
            />

            {/* Add/Edit Field Modal */}
            <Modal
                title={editingField ? "메타데이터 필드 수정" : "새 메타데이터 필드 추가"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingField ? "수정" : "추가"}
                cancelText="취소"
                destroyOnClose
                width={700}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="metadata_field_form"
                >
                    <Form.Item
                        name="name"
                        label="필드명"
                        rules={[{ required: true, message: '필드명을 입력해주세요!' }]}
                        tooltip="관리자 및 사용자에게 보여질 이름입니다."
                    >
                        <Input />
                    </Form.Item>
                     <Form.Item
                        name="fieldKey"
                        label="필드 키 (영문/숫자/_)"
                        rules={[
                            { required: true, message: '시스템에서 사용할 고유 키를 입력해주세요!' },
                            { pattern: /^[a-z0-9_]+$/, message: '소문자, 숫자, 밑줄(_)만 사용 가능합니다.' }
                        ]}
                        tooltip="시스템 내부적으로 사용될 고유한 키입니다. 한번 저장 후 변경하지 않는 것이 좋습니다."
                    >
                        <Input placeholder="예: author_name, publish_year" />
                    </Form.Item>
                    <Form.Item
                        name="type"
                        label="데이터 타입"
                        rules={[{ required: true, message: '데이터 타입을 선택해주세요!' }]}
                    >
                        <Select style={{ width: 150 }}>
                            <Option value="text">텍스트</Option>
                            <Option value="textarea">장문텍스트</Option>
                            <Option value="number">숫자</Option>
                            <Option value="date">날짜</Option>
                            <Option value="tags">태그 (복수 입력)</Option>
                            <Option value="select">선택 (옵션 정의 필요)</Option>
                            {/* Add more types like 'checkbox', 'radio', 'file' if needed */}
                        </Select>
                    </Form.Item>
                    {/* If type is 'select', show options input */}
                    {/* {form.getFieldValue('type') === 'select' && <Form.Item name="options" ... />} */}
                    <Form.Item
                        name="description"
                        label="설명"
                        rules={[{ required: true, message: '필드 설명을 입력해주세요!' }]}
                    >
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item
                        name="required"
                        label="필수 여부"
                        valuePropName="checked"
                    >
                        <Select style={{ width: 100 }}>
                            <Option value={true}>필수</Option>
                            <Option value={false}>선택</Option>
                        </Select>
                    </Form.Item>
                     <Form.Item
                        name="order"
                        label="노출 순서"
                        rules={[{ required: true, message: '노출 순서를 입력해주세요!' }, { type: 'number', message: '숫자만 입력 가능합니다.', transform: value => Number(value) }]}
                        tooltip="콘텐츠 등록/수정 화면에서의 필드 노출 순서입니다."
                    >
                        <Input type="number" min={1} style={{ width: '100px' }}/>
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default MetadataManagement; 