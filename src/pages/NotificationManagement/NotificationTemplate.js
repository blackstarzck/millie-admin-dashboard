import {
    BellOutlined, // PUSH
    CommentOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined, // Kakao
    MobileOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import {
    Button,
    Descriptions,
    Form,
    Input,
    message,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Tabs,
    Tag,
    Tooltip,
    Typography,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const channelConfigs = {
    PUSH: { name: '앱 PUSH', icon: <BellOutlined /> },
    알림톡: { name: '카카오 알림톡', icon: <CommentOutlined /> },
    알림: { name: '알림', icon: <MobileOutlined /> },
};


// Initial Data
const initialTemplates = [
    { key: 'tpl001', id: 'tpl001', name: '환영 메시지', title: '회원가입을 환영합니다!', content: '[이름]님, 밀리의 서재에 오신 것을 환영합니다! 지금 바로 첫 달 무료 혜택을 확인해보세요.', lastModified: '2024-07-20', channels: ['알림', 'PUSH'] },
    { key: 'tpl003', id: 'tpl003', name: '독서 루틴 알림', title: '오늘의 독서, 시작하셨나요? 📚', content: '[이름]님, 잠시 밀리의 서재와 함께 마음의 양식을 쌓아보는 건 어때요? 꾸준한 독서는 성장의 밑거름이 됩니다.', lastModified: '2024-07-28', channels: ['알림', 'PUSH'] },
    { key: 'tpl004', id: 'tpl004', name: '다른 기기 접속', title: '다른 기기에서 로그인이 감지되었습니다.', content: '[이름]님, 다른 기기에서의 로그인이 감지되었습니다. 본인이 아닐 경우 비밀번호를 변경해주세요.', lastModified: '2024-07-29', channels: ['알림톡'] },
    { key: 'tpl005', id: 'tpl005', name: '구독 완료', title: '구독이 완료되었습니다.', content: '결제 금액: [결제금액]원\\n구독 기간: [구독기간]\\n다음 결제일: [다음결제일]', lastModified: '2024-07-29', channels: ['알림톡'] },
    { key: 'tpl006', id: 'tpl006', name: '쿠폰 만료 D-DAY', title: '쿠폰이 7일 후 만료됩니다.', content: '[이름]님, 보유하신 쿠폰이 7일 후 만료될 예정입니다. 잊지 말고 사용하세요!', lastModified: '2024-07-29', channels: ['알림', 'PUSH'] },
    { key: 'tpl007', id: 'tpl007', name: '구독 만료 D-DAY', title: '구독이 7일 후 만료됩니다.', content: '[이름]님, 구독 기간이 7일 남았습니다. 구독을 연장하고 밀리의 서재를 계속 이용해보세요.', lastModified: '2024-07-29', channels: ['알림', 'PUSH'] },
    { key: 'tpl008', id: 'tpl008', name: '커뮤니티 조회수 달성', title: '내 게시글의 조회수가 [조회수]회를 돌파했습니다!', content: '[이름]님의 게시글이 많은 관심을 받고 있습니다! "커뮤니티에서 확인해보세요.', lastModified: '2024-07-29', channels: ['알림', 'PUSH'] },
    { key: 'tpl009', id: 'tpl009', name: '문의 답변 등록', title: '문의하신 내용에 답변이 등록되었습니다.', content: '[이름]님, 문의하신 내용에 대한 답변이 등록되었습니다. 지금 바로 확인해보세요.', lastModified: '2024-07-29', channels: ['알림'] },
    { key: 'tpl010', id: 'tpl010', name: '팔로우 응답', title: '[상대방이름]님이 팔로우를 수락했습니다.', content: '[상대방이름]님과 이제 친구입니다. 지금 바로 [상대방이름]님의 서재를 구경해보세요!', lastModified: '2024-07-29', channels: ['PUSH'] },
    { key: 'tpl011', id: 'tpl011', name: '구독 해지', title: '구독이 해지되었습니다.', content: '[이름]님의 구독이 정상적으로 해지되었습니다. 다음에 더 좋은 모습으로 만나요.', lastModified: '2024-07-29', channels: ['알림톡'] },
    { key: 'tpl012', id: 'tpl012', name: '신고 접수 (신고자)', title: '신고가 정상적으로 접수되었습니다.', content: '[이름]님의 신고가 정상적으로 접수되었습니다. 검토 후 빠르게 처리하겠습니다.', lastModified: '2024-07-29', channels: ['알림'] },
    { key: 'tpl013', id: 'tpl013', name: '신고 접수 (피신고자)', title: '신고가 접수되었습니다.', content: '[이름]님, 회원님의 활동에 대해 신고가 접수되었습니다. 자세한 내용은 고객센터로 문의해주세요.', lastModified: '2024-07-29', channels: ['알림'] },
    { key: 'tpl014', id: 'tpl014', name: '신간 도서 추가', title: '새로운 책이 밀리의 서재에 도착했어요!', content: '기다리시던 신간 [도서명]이 밀리의 서재에 추가되었습니다. 지금 바로 만나보세요!', lastModified: '2024-07-29', channels: ['알림', 'PUSH'] },
    { key: 'tpl015', id: 'tpl015', name: '시리즈 신규 에피소드', title: '[시리즈명]의 새로운 이야기가 업데이트되었습니다.', content: '구독하신 시리즈 [시리즈명]의 신규 에피소드가 업데이트되었습니다. 지금 바로 감상해보세요!', lastModified: '2024-07-29', channels: ['알림', 'PUSH'] },
];

const NotificationTemplate = () => {
    const [templates, setTemplates] = useState(initialTemplates);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [form] = Form.useForm();

    const renderChannelIcon = (channelKey) => {
        const config = channelConfigs[channelKey];
        return config ? React.cloneElement(config.icon, { style: { marginRight: 8 } }) : null;
    };

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
                } else {
                    const newTemplate = {
                        key: `tpl-${Date.now()}`,
                        id: `tpl-${(templates.length + 1).toString().padStart(3, '0')}`,
                        ...processedValues,
                    };
                    setTemplates([newTemplate, ...templates]);
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
        setTemplates(templates.filter(tpl => tpl.key !== key));
        message.success('템플릿이 삭제되었습니다.');
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
            title: '채널', dataIndex: 'channels', key: 'channels', width: 180,
            render: channels => (
                <Space>
                    {channels.map(channel => (
                        <Tag key={channel} icon={renderChannelIcon(channel)}>
                            {channelConfigs[channel]?.name || channel}
                        </Tag>
                    ))}
                </Space>
            ),
        },
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

    const renderAvailableVariables = () => (
        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px' }}>
            사용 가능한 변수:
            <br />
            <Tag>[이름]</Tag>
            <Tag>[이메일]</Tag>
            <Tag>[결제금액]</Tag>
            <Tag>[구독기간]</Tag>
            <Tag>[다음결제일]</Tag>
            <Tag>[조회수]</Tag>
            <Tag>[상대방이름]</Tag>
            <Tag>[도서명]</Tag>
            <Tag>[시리즈명]</Tag>
        </Text>
    );

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>알림 템플릿 관리</Title>
            <Text type="secondary">사용자에게 발송될 알림 메시지의 템플릿을 관리합니다. 채널별 특성에 맞는 개인화된 메시지를 작성하고 저장할 수 있습니다.</Text>
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
                        name="channels"
                        label="발송 채널"
                        rules={[{ required: true, message: '하나 이상의 발송 채널을 선택해주세요!' }]}
                     >
                        <Select mode="multiple" placeholder="발송 채널을 선택하세요">
                            {Object.keys(channelConfigs).map(key => (
                                <Option key={key} value={key}>
                                    {renderChannelIcon(key)} {channelConfigs[key].name}
                                </Option>
                            ))}
                        </Select>
                     </Form.Item>
                     <Form.Item
                        name="title"
                        label="알림 제목"
                        rules={[{ required: true, message: '알림 제목을 입력해주세요!' }]}
                        tooltip="푸시 알림, 카카오톡 알림 등에서 제목으로 표시됩니다."
                    >
                        <Input showCount maxLength={100} placeholder="예: [이름]님, 새로운 이벤트가 도착했어요!" />
                    </Form.Item>
                    <Form.Item
                        name="content"
                        label="알림 내용"
                        rules={[{ required: true, message: '알림 내용을 입력해주세요!' }]}
                        tooltip="실제 발송될 메시지 내용입니다. 아래 변수를 사용하여 개인화할 수 있습니다."
                    >
                        <TextArea showCount maxLength={1000} rows={8} placeholder="예: [이름]님, 즐거운 독서 경험을 위해 밀리의 서재가 특별한 이벤트를 준비했어요! 지금 확인해보세요." />
                    </Form.Item>
                    {renderAvailableVariables()}
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
                width={500}
            >
                {previewTemplate && (
                    <Space direction="vertical" style={{ width: '100%' }}>
                         <Descriptions bordered column={1} size="small">
                             <Descriptions.Item label="템플릿명">
                                <Text strong>{previewTemplate.name}</Text>
                             </Descriptions.Item>
                             <Descriptions.Item label="발송 채널">
                                 <Space>
                                 {previewTemplate.channels.map(key => (
                                     <Tag key={key} icon={renderChannelIcon(key)}>
                                         {channelConfigs[key].name}
                                     </Tag>
                                 ))}
                                 </Space>
                             </Descriptions.Item>
                         </Descriptions>

                        <Tabs>
                            {previewTemplate.channels?.map(channelKey => (
                                <TabPane
                                    tab={<>{renderChannelIcon(channelKey)} {channelConfigs[channelKey].name}</>}
                                    key={channelKey}
                                >
                                    <Descriptions bordered column={1} size="small">
                                        <Descriptions.Item label="제목">{previewTemplate.title}</Descriptions.Item>
                                        <Descriptions.Item label="내용">
                                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                                                {previewTemplate.content}
                                            </pre>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </TabPane>
                            ))}
                        </Tabs>
                    </Space>
                )}
            </Modal>

        </Space>
    );
};

export default NotificationTemplate;
