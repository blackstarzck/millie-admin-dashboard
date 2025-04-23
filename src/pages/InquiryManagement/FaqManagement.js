import React, { useState, useMemo } from 'react';
import {
    Collapse,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Space,
    Typography,
    Tag,
    message,
    Popconfirm,
    InputNumber, // For order
    Tooltip,
    Row,
    Col,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    QuestionCircleOutlined, // For FAQ icon
    ArrowUpOutlined,
    ArrowDownOutlined,
} from '@ant-design/icons';
import moment from 'moment'; // Although not used directly in this basic version

const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- Sample Data ---
const initialFaqs = [
    { key: 'faq1', id: 'F001', category: '계정', question: '비밀번호는 어떻게 변경하나요?', answer: '로그인 후 [마이페이지] > [회원정보 수정] 메뉴에서 변경할 수 있습니다.', isVisible: true, order: 1, createdAt: '2024-01-10 10:00:00' },
    { key: 'faq2', id: 'F002', category: '결제', question: '사용 가능한 결제 수단은 무엇인가요?', answer: '신용카드, 계좌이체, 휴대폰 소액결제를 이용할 수 있습니다.', isVisible: true, order: 3, createdAt: '2024-01-15 11:00:00' },
    { key: 'faq3', id: 'F003', category: '서비스', question: '환불 규정은 어떻게 되나요?', answer: '구매 후 7일 이내 미사용 시 전액 환불 가능합니다. 자세한 내용은 이용약관을 참고해주세요.', isVisible: false, order: 4, createdAt: '2024-02-01 14:00:00' },
    { key: 'faq4', id: 'F004', category: '계정', question: '아이디를 잊어버렸어요.', answer: '로그인 페이지 하단의 [아이디 찾기] 메뉴를 이용해주세요.', isVisible: true, order: 2, createdAt: '2024-03-05 16:00:00' },
];

// --- Helper Functions ---
const getVisibilityTag = (isVisible) => {
    return isVisible
        ? <Tag icon={<EyeOutlined />} color="processing">노출 중</Tag>
        : <Tag icon={<EyeInvisibleOutlined />} color="default">숨김</Tag>;
};

// --- Component ---
const FaqManagement = () => {
    const [faqs, setFaqs] = useState(initialFaqs);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null); // null for new, object for edit
    const [form] = Form.useForm();
    const [activeKey, setActiveKey] = useState([]); // To control collapse panels

    // --- Group FAQs by Category ---
    const groupedFaqs = useMemo(() => {
        const groups = faqs.reduce((acc, faq) => {
            const category = faq.category || '미분류';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(faq);
            // Sort FAQs within each category by order
            acc[category].sort((a, b) => a.order - b.order);
            return acc;
        }, {});
        // Sort categories (optional)
        return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
    }, [faqs]);

    // --- Modal Handling ---
    const showModal = (faq = null) => {
        setEditingFaq(faq);
        if (faq) {
            form.setFieldsValue({ ...faq });
        } else {
            // Default values for new FAQ
            form.resetFields();
             form.setFieldsValue({ isVisible: true, order: (faqs.length + 1) * 10 }); // Default order far end
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingFaq(null);
        form.resetFields();
    };

    // --- Add/Edit Logic ---
    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const faqData = {
                    ...values,
                    order: values.order ?? 0, // Ensure order is a number
                };

                if (editingFaq) {
                    // Update existing FAQ
                    setFaqs(prevFaqs =>
                        prevFaqs.map(f => f.key === editingFaq.key ? { ...f, ...faqData } : f)
                    );
                    message.success(`FAQ(ID: ${editingFaq.id})가 수정되었습니다.`);
                    // TODO: API call to update FAQ
                    console.log('Updated FAQ:', { ...editingFaq, ...faqData });
                } else {
                    // Add new FAQ
                    const newKey = `faq${Date.now()}`;
                    const newId = `F${String(Date.now()).slice(-3)}`;
                    const newFaq = {
                         ...faqData,
                         key: newKey,
                         id: newId,
                         createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    };
                    setFaqs(prevFaqs => [...prevFaqs, newFaq]);
                    message.success('새 FAQ가 등록되었습니다.');
                    // TODO: API call to add FAQ
                    console.log('Added FAQ:', newFaq);
                }
                handleCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('필수 입력 항목을 확인해주세요.');
            });
    };

    // --- Delete Logic ---
    const handleDelete = (key, question) => {
        setFaqs(prevFaqs => prevFaqs.filter(f => f.key !== key));
        message.success(`FAQ '${question}'이(가) 삭제되었습니다.`);
        // TODO: API call to delete FAQ
        console.log('Deleted FAQ key:', key);
    };

    // --- Toggle Visibility Logic ---
    const handleVisibilityToggle = (key, isVisible) => {
         setFaqs(prevFaqs =>
            prevFaqs.map(f => f.key === key ? { ...f, isVisible: !isVisible } : f)
        );
        message.success(`FAQ 노출 상태가 ${!isVisible ? '노출' : '숨김'}(으)로 변경되었습니다.`);
         // TODO: API call to update visibility
    };

     // --- Change Order Logic (Simple up/down within category) ---
     // More sophisticated drag-and-drop could be implemented
     const handleChangeOrder = (key, direction) => {
         const currentFaq = faqs.find(f => f.key === key);
         if (!currentFaq) return;

         const categoryFaqs = faqs
            .filter(f => f.category === currentFaq.category)
            .sort((a, b) => a.order - b.order);

         const currentIndex = categoryFaqs.findIndex(f => f.key === key);

         if (direction === 'up' && currentIndex > 0) {
             const prevFaq = categoryFaqs[currentIndex - 1];
             // Swap orders
             setFaqs(prevFaqs =>
                 prevFaqs.map(f => {
                     if (f.key === key) return { ...f, order: prevFaq.order };
                     if (f.key === prevFaq.key) return { ...f, order: currentFaq.order };
                     return f;
                 })
             );
             message.success('순서가 변경되었습니다.');
             // TODO: API Call to update orders
         } else if (direction === 'down' && currentIndex < categoryFaqs.length - 1) {
             const nextFaq = categoryFaqs[currentIndex + 1];
             // Swap orders
             setFaqs(prevFaqs =>
                 prevFaqs.map(f => {
                     if (f.key === key) return { ...f, order: nextFaq.order };
                     if (f.key === nextFaq.key) return { ...f, order: currentFaq.order };
                     return f;
                 })
             );
             message.success('순서가 변경되었습니다.');
             // TODO: API Call to update orders
        }
    };

    // --- Collapse Panel Header ---
    const renderPanelHeader = (faq) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Space size="small">
                 <Text style={{ flexGrow: 1 }}>{faq.question}</Text>
                 {getVisibilityTag(faq.isVisible)}
                 <Tag>순서: {faq.order}</Tag>
             </Space>
             <Space onClick={(e) => e.stopPropagation()} size="small">
                 <Tooltip title="순서 올림">
                    <Button size="small" icon={<ArrowUpOutlined />} onClick={() => handleChangeOrder(faq.key, 'up')} />
                 </Tooltip>
                 <Tooltip title="순서 내림">
                    <Button size="small" icon={<ArrowDownOutlined />} onClick={() => handleChangeOrder(faq.key, 'down')} />
                 </Tooltip>
                 <Tooltip title="수정">
                     <Button size="small" icon={<EditOutlined />} onClick={() => showModal(faq)} />
                 </Tooltip>
                 <Tooltip title={faq.isVisible ? '숨김 처리' : '노출 처리'}>
                     <Button
                        size="small"
                        icon={faq.isVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                        onClick={() => handleVisibilityToggle(faq.key, faq.isVisible)}
                    />
                 </Tooltip>
                <Popconfirm
                    title={`'${faq.question}' FAQ를 삭제하시겠습니까?`}
                    onConfirm={() => handleDelete(faq.key, faq.question)}
                    okText="삭제"
                    cancelText="취소"
                >
                     <Tooltip title="삭제">
                        <Button size="small" danger icon={<DeleteOutlined />} />
                     </Tooltip>
                </Popconfirm>
            </Space>
        </div>
    );

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>FAQ 관리</Title>
            <Text type="secondary">자주 묻는 질문과 답변을 관리합니다. 카테고리별로 확인하고 순서를 조정할 수 있습니다.</Text>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: 16, alignSelf: 'flex-end' }}
            >
                새 FAQ 추가
            </Button>

            <Collapse activeKey={activeKey} onChange={setActiveKey} accordion={false}>
                {groupedFaqs.map(([category, faqsInCategory]) => (
                    <Panel header={`${category} (${faqsInCategory.length})`} key={category}>
                        <Collapse ghost accordion={false}>
                            {faqsInCategory.map(faq => (
                                <Panel header={renderPanelHeader(faq)} key={faq.key}>
                                    <Paragraph style={{ whiteSpace: 'pre-wrap', background: '#fafafa', padding: '10px' }}>
                                        {faq.answer}
                                    </Paragraph>
                                </Panel>
                            ))}
                        </Collapse>
                    </Panel>
                ))}
             </Collapse>
             {groupedFaqs.length === 0 && <Text>등록된 FAQ가 없습니다.</Text>}

            {/* Add/Edit FAQ Modal */}
            <Modal
                title={editingFaq ? `FAQ 수정 (ID: ${editingFaq.id})` : '새 FAQ 추가'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingFaq ? '수정' : '추가'}
                cancelText="취소"
                destroyOnClose
                width={700}
            >
                <Form form={form} layout="vertical" name="faq_form">
                     <Form.Item
                        name="category"
                        label="카테고리"
                        rules={[{ required: true, message: '카테고리를 입력하거나 선택해주세요.' }]}
                        tooltip="기존 카테고리를 입력하거나 새로운 카테고리를 입력할 수 있습니다."
                    >
                        {/* Consider using a Select with Creatable option or separate category management */}
                        <Input placeholder="예: 계정, 결제, 서비스" />
                    </Form.Item>
                    <Form.Item
                        name="question"
                        label="질문"
                        rules={[{ required: true, message: '질문을 입력해주세요.' }]}
                    >
                        <Input placeholder="예: 비밀번호는 어떻게 변경하나요?" />
                    </Form.Item>
                    <Form.Item
                        name="answer"
                        label="답변"
                        rules={[{ required: true, message: '답변을 입력해주세요.' }]}
                    >
                        <TextArea rows={5} placeholder="질문에 대한 답변을 상세하게 입력해주세요." />
                    </Form.Item>
                     <Row gutter={16}>
                         <Col span={12}>
                             <Form.Item
                                name="order"
                                label="노출 순서"
                                rules={[{ required: true, type: 'number', message: '노출 순서를 숫자로 입력해주세요.' }]}
                                tooltip="숫자가 낮을수록 해당 카테고리 내에서 먼저 노출됩니다."
                            >
                                <InputNumber min={0} style={{ width: '100%' }}/>
                            </Form.Item>
                         </Col>
                         <Col span={12}>
                            <Form.Item name="isVisible" label="노출 여부" valuePropName="checked">
                                <Switch checkedChildren="노출" unCheckedChildren="숨김" />
                             </Form.Item>
                         </Col>
                     </Row>
                </Form>
            </Modal>
        </Space>
    );
};

export default FaqManagement; 