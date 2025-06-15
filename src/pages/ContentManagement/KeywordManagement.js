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
    Tooltip,
    Tag,
    Select,
    Popconfirm,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DownOutlined,
    CloseOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

// --- Sample Data ---
const initialKeywords = [
    { 
        key: '1', 
        id: 1, 
        name: '모험', 
        description: '모험과 도전을 주제로 한 키워드', 
        order: 1, 
        subKeywords: [
            { key: 'adv_sub_1', name: '탐험', description: '새로운 장소나 영역을 발견하는 모험', order: 1 },
            { key: 'adv_sub_2', name: '여행', description: '다양한 장소를 방문하며 경험하는 모험', order: 2 },
            { key: 'adv_sub_3', name: '생존', description: '극한의 상황에서 살아남는 모험', order: 3 },
        ] 
    },
    { 
        key: '2', 
        id: 2, 
        name: '로맨스', 
        description: '사랑과 관계를 주제로 한 키워드', 
        order: 2, 
        subKeywords: [
            { key: 'rom_sub_1', name: '첫사랑', order: 1 },
            { key: 'rom_sub_2', name: '운명적 사랑', order: 2 },
            { key: 'rom_sub_3', name: '삼각관계', order: 3 },
        ] 
    },
    { 
        key: '3', 
        id: 3, 
        name: '성장', 
        description: '인간의 성장과 발전을 다루는 키워드', 
        order: 3, 
        subKeywords: [
            { key: 'growth_sub_1', name: '자아 발견', order: 1 },
            { key: 'growth_sub_2', name: '청춘', order: 2 },
            { key: 'growth_sub_3', name: '극복', order: 3 },
        ] 
    },
    { 
        key: '4', 
        id: 4, 
        name: '미스터리', 
        description: '추리와 비밀을 다루는 키워드', 
        order: 4, 
        subKeywords: [
            { key: 'mys_sub_1', name: '추리', order: 1 },
            { key: 'mys_sub_2', name: '스릴러', order: 2 },
            { key: 'mys_sub_3', name: '반전', order: 3 },
        ] 
    },
    { 
        key: '5', 
        id: 5, 
        name: '판타지', 
        description: '상상의 세계와 마법을 다루는 키워드', 
        order: 5, 
        subKeywords: [
            { key: 'fan_sub_1', name: '마법', order: 1 },
            { key: 'fan_sub_2', name: '신화', order: 2 },
            { key: 'fan_sub_3', name: '이세계', order: 3 },
        ] 
    },
    { 
        key: '6', 
        id: 6, 
        name: '가족', 
        description: '가족 관계와 정을 다루는 키워드', 
        order: 6, 
        subKeywords: [
            { key: 'fam_sub_1', name: '부모와 자식', order: 1 },
            { key: 'fam_sub_2', name: '형제애', order: 2 },
            { key: 'fam_sub_3', name: '가정 회복', order: 3 },
        ] 
    },
    { 
        key: '7', 
        id: 7, 
        name: '역사', 
        description: '역사적 사건과 인물을 다루는 키워드', 
        order: 7, 
        subKeywords: [
            { key: 'his_sub_1', name: '시대극', order: 1 },
            { key: 'his_sub_2', name: '실존 인물', order: 2 },
            { key: 'his_sub_3', name: '전쟁', order: 3 },
        ] 
    },
    { 
        key: '8', 
        id: 8, 
        name: '공상과학', 
        description: '미래와 과학을 다루는 키워드', 
        order: 8, 
        subKeywords: [
            { key: 'sci_sub_1', name: '우주', order: 1 },
            { key: 'sci_sub_2', name: '시간 여행', order: 2 },
            { key: 'sci_sub_3', name: '디스토피아', order: 3 },
        ] 
    },
    { 
        key: '9', 
        id: 9, 
        name: '자기계발', 
        description: '개인의 성장과 발전을 다루는 키워드', 
        order: 9, 
        subKeywords: [
            { key: 'dev_sub_1', name: '동기부여', order: 1 },
            { key: 'dev_sub_2', name: '습관', order: 2 },
            { key: 'dev_sub_3', name: '성공', order: 3 },
        ] 
    },
    { 
        key: '10', 
        id: 10, 
        name: '유머', 
        description: '웃음과 재미를 다루는 키워드', 
        order: 10, 
        subKeywords: [
            { key: 'hum_sub_1', name: '코미디', order: 1 },
            { key: 'hum_sub_2', name: '풍자', order: 2 },
            { key: 'hum_sub_3', name: '가벼운 일상', order: 3 },
        ] 
    },
];

const KeywordManagement = () => {
    const [keywords, setKeywords] = useState(initialKeywords);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubKeywordModalOpen, setIsSubKeywordModalOpen] = useState(false);
    const [editingKeyword, setEditingKeyword] = useState(null);
    const [editingSubKeyword, setEditingSubKeyword] = useState(null);
    const [form] = Form.useForm();
    const [subKeywordForm] = Form.useForm();
    const [subKeywordInput, setSubKeywordInput] = useState('');
    const [subKeywordDescription, setSubKeywordDescription] = useState('');
    const [expandedRowKey, setExpandedRowKey] = useState(null);

    const showAddModal = () => {
        setEditingKeyword(null);
        form.resetFields();
        const nextOrder = keywords.length > 0 ? Math.max(...keywords.map(k => k.order)) + 1 : 1;
        form.setFieldsValue({ 
            order: nextOrder,
            subKeywords: []
        });
        setIsModalOpen(true);
    };

    const showEditModal = (keyword) => {
        setEditingKeyword(keyword);
        form.setFieldsValue({ 
            ...keyword,
            subKeywords: keyword.subKeywords || []
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingKeyword(null);
        form.resetFields();
        setSubKeywordInput('');
        setSubKeywordDescription('');
    };

    const handleAddSubKeyword = () => {
        if (!subKeywordInput.trim()) {
            message.warning('하위 키워드를 입력해주세요.');
            return;
        }

        const currentSubKeywords = form.getFieldValue('subKeywords') || [];
        const isDuplicate = currentSubKeywords.some(
            sub => sub.name.toLowerCase() === subKeywordInput.toLowerCase()
        );

        if (isDuplicate) {
            message.warning('이미 존재하는 하위 키워드입니다.');
            return;
        }

        const newSubKeyword = {
            key: `sub_${Date.now()}`,
            name: subKeywordInput.trim(),
            description: subKeywordDescription.trim(),
            order: currentSubKeywords.length + 1
        };

        form.setFieldsValue({
            subKeywords: [...currentSubKeywords, newSubKeyword]
        });
        setSubKeywordInput('');
        setSubKeywordDescription('');
    };

    const handleRemoveSubKeyword = (key) => {
        const currentSubKeywords = form.getFieldValue('subKeywords') || [];
        const updatedSubKeywords = currentSubKeywords
            .filter(sub => sub.key !== key)
            .map((sub, index) => ({
                ...sub,
                order: index + 1
            }));
        form.setFieldsValue({ subKeywords: updatedSubKeywords });
        message.success('하위 키워드가 삭제되었습니다.');
    };

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const processedValues = {
                    ...values,
                    order: Number(values.order) || 0,
                    subKeywords: (values.subKeywords || []).map((sub, index) => ({
                        ...sub,
                        order: index + 1
                    }))
                };

                if (editingKeyword) {
                    setKeywords(prevKeywords =>
                        prevKeywords
                            .map(kw => kw.key === editingKeyword.key ? { ...kw, ...processedValues } : kw)
                            .sort((a, b) => a.order - b.order)
                    );
                    message.success('키워드가 수정되었습니다.');
                } else {
                    const newKeyword = {
                        key: (keywords.length + 1).toString(),
                        id: keywords.length > 0 ? Math.max(...keywords.map(k => k.id)) + 1 : 1,
                        ...processedValues,
                    };
                    setKeywords(prevKeywords =>
                        [...prevKeywords, newKeyword].sort((a, b) => a.order - b.order)
                    );
                    message.success('새 키워드가 추가되었습니다.');
                }
                handleCancel();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('폼 입력값을 확인해주세요.');
            });
    };

    const handleEditSubKeyword = (subKeyword) => {
        setEditingSubKeyword(subKeyword);
        subKeywordForm.setFieldsValue({
            name: subKeyword.name,
            description: subKeyword.description
        });
        setIsSubKeywordModalOpen(true);
    };

    const handleSubKeywordModalOk = () => {
        subKeywordForm.validateFields().then(values => {
            const currentSubKeywords = form.getFieldValue('subKeywords');
            const updatedSubKeywords = currentSubKeywords.map(s => 
                s.key === editingSubKeyword.key ? { ...s, description: values.description } : s
            );
            form.setFieldsValue({ subKeywords: updatedSubKeywords });
            setIsSubKeywordModalOpen(false);
            setEditingSubKeyword(null);
            subKeywordForm.resetFields();
        });
    };

    const handleSubKeywordModalCancel = () => {
        setIsSubKeywordModalOpen(false);
        setEditingSubKeyword(null);
        subKeywordForm.resetFields();
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '순서', dataIndex: 'order', key: 'order', width: 80, sorter: (a, b) => a.order - b.order, defaultSortOrder: 'ascend' },
        { title: '키워드', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
        { title: '설명', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: '하위 키워드 수',
            key: 'subKeywordsCount',
            width: 120,
            render: (_, record) => (
                <Text>{record.subKeywords?.length || 0}개</Text>
            ),
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
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>키워드 관리</Title>
            <Text type="secondary">콘텐츠 분류에 사용될 키워드를 관리합니다. 순서를 조정하여 노출 순서를 변경할 수 있습니다.</Text>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                >
                    새 키워드 추가
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={keywords}
                pagination={false}
                rowKey="key"
                expandable={{
                    expandedRowRender: (record) => (
                        <div>
                            <Space wrap>
                                {record.subKeywords?.sort((a, b) => a.order - b.order).map(sub => (
                                    <Tooltip 
                                        key={sub.key}
                                        title={sub.description || '설명 없음'}
                                    >
                                        <Tag 
                                            color="blue"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleEditSubKeyword(sub)}
                                        >
                                            {sub.name}
                                        </Tag>
                                    </Tooltip>
                                ))}
                            </Space>
                        </div>
                    ),
                    expandRowByClick: true,
                    expandedRowKeys: [expandedRowKey],
                    onExpand: (expanded, record) => {
                        setExpandedRowKey(expanded ? record.key : null);
                    },
                }}
            />

            <Modal
                title={editingKeyword ? "키워드 수정" : "새 키워드 추가"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingKeyword ? "수정" : "추가"}
                cancelText="취소"
                destroyOnClose
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="keyword_form"
                >
                    <Form.Item
                        name="name"
                        label="키워드"
                        rules={[
                            { required: true, message: '키워드를 입력해주세요!' },
                            {
                                validator: (_, value) => {
                                    const lowerCaseValue = value && value.toLowerCase();
                                    const isDuplicate = keywords.some(
                                        keyword => 
                                            keyword.name.toLowerCase() === lowerCaseValue &&
                                            (!editingKeyword || keyword.key !== editingKeyword.key)
                                    );
                                    if (isDuplicate) {
                                        return Promise.reject(new Error('이미 사용 중인 키워드입니다.'));
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
                        rules={[{ required: true, message: '키워드 설명을 입력해주세요!' }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="order"
                        label="노출 순서"
                        rules={[{ required: true, message: '노출 순서를 입력해주세요!' }, { type: 'number', message: '숫자만 입력 가능합니다.', transform: value => Number(value) }]}
                        tooltip="숫자가 작을수록 먼저 노출됩니다."
                    >
                        <Input type="number" min={1} style={{ width: '100px' }}/>
                    </Form.Item>

                    <Form.Item
                        label="하위 키워드 관리"
                        required
                        tooltip="하위 키워드명과 설명을 입력하고 추가 버튼을 클릭하세요."
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Input
                                    value={subKeywordInput}
                                    onChange={(e) => setSubKeywordInput(e.target.value)}
                                    onPressEnter={() => document.getElementById('subKeywordDescription').focus()}
                                    placeholder="하위 키워드명"
                                    style={{ width: '100%' }}
                                />
                                <Input.TextArea
                                    id="subKeywordDescription"
                                    value={subKeywordDescription}
                                    onChange={(e) => setSubKeywordDescription(e.target.value)}
                                    onPressEnter={(e) => {
                                        if (!e.shiftKey) {
                                            e.preventDefault();
                                            handleAddSubKeyword();
                                        }
                                    }}
                                    placeholder="하위 키워드 설명"
                                    autoSize={{ minRows: 2, maxRows: 4 }}
                                    style={{ width: '100%' }}
                                />
                                <Button 
                                    type="primary" 
                                    onClick={handleAddSubKeyword}
                                    style={{ width: '100%' }}
                                >
                                    하위 키워드 추가
                                </Button>
                            </Space>
                            <div style={{ marginTop: '8px' }}>
                                <Form.Item
                                    name="subKeywords"
                                    rules={[{ required: true, message: '하위 키워드를 추가해주세요!' }]}
                                    noStyle
                                >
                                    <Space wrap>
                                        {form.getFieldValue('subKeywords')?.map((sub, index) => (
                                            <Tag
                                                key={sub.key}
                                                color="blue"
                                                style={{ marginBottom: '8px', cursor: 'pointer' }}
                                                onClick={() => handleEditSubKeyword(sub)}
                                            >
                                                {sub.name}
                                            </Tag>
                                        ))}
                                    </Space>
                                </Form.Item>
                            </div>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 하위 키워드 수정 모달 */}
            <Modal
                title="하위 키워드 수정"
                open={isSubKeywordModalOpen}
                onOk={handleSubKeywordModalOk}
                onCancel={handleSubKeywordModalCancel}
                okText="수정"
                cancelText="취소"
                destroyOnClose
                footer={[
                    <div key="footer" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Popconfirm
                            title="하위 키워드 삭제"
                            description="정말로 이 하위 키워드를 삭제하시겠습니까?"
                            onConfirm={() => {
                                handleRemoveSubKeyword(editingSubKeyword.key);
                                handleSubKeywordModalCancel();
                            }}
                            okText="삭제"
                            cancelText="취소"
                            okButtonProps={{ danger: true }}
                        >
                            <Button 
                                danger 
                                icon={<DeleteOutlined />}
                            >
                                삭제
                            </Button>
                        </Popconfirm>
                        <Button type="primary" onClick={handleSubKeywordModalOk}>
                            수정
                        </Button>
                    </div>
                ]}
            >
                <Form
                    form={subKeywordForm}
                    layout="vertical"
                    name="sub_keyword_form"
                >
                    <Form.Item
                        name="name"
                        label="하위 키워드명"
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="설명"
                    >
                        <Input.TextArea
                            autoSize={{ minRows: 2, maxRows: 4 }}
                            placeholder="하위 키워드에 대한 설명을 입력하세요"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default KeywordManagement; 