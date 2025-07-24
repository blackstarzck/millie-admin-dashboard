import { EyeOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Space, Table, Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const { Title, Paragraph, Text } = Typography;

// EmailTemplateManagement.js와 동일한 데이터 소스를 사용한다고 가정
const templateData = {
    'confirm_signup': {
        type: '고정',
        category: '고정',
        name: '회원가입 확인',
        subject: '회원가입을 확인해주세요',
        body: `<h2>회원가입 확인</h2><p>밀리의 서재에 가입해주셔서 감사합니다. 아래 버튼을 눌러 이메일 주소를 인증하고 회원가입을 완료해주세요.</p><p><a href="{{ .ConfirmationURL }}">이메일 주소 확인</a></p>`,
        lastModified: '2024-07-23',
    },
    'welcome_user': {
        type: '고정',
        category: '고정',
        name: '회원가입 환영',
        subject: '밀리의 서재에 오신 것을 환영합니다!',
        body: `<h2>밀리의 서재에 오신 것을 환영합니다!</h2><p>가입해주셔서 감사합니다. 이제 밀리의 서재가 제공하는 다채로운 콘텐츠를 마음껏 즐겨보세요.</p><p>지금 바로 독서를 시작해보세요!</p>`,
        lastModified: '2024-07-23',
    },
    'invite_user': {
        type: '고정',
        category: '고정',
        name: '사용자 초대',
        subject: '밀리의 서재에 초대되셨습니다!',
        body: `<h2>초대장이 도착했습니다!</h2><p>밀리의 서재에 초대되셨습니다. 아래 링크를 클릭하여 가입하고 특별한 혜택을 받아보세요.</p><p><a href="{{ .InvitationURL }}">초대 수락하기</a></p>`,
        lastModified: '2024-07-23',
    },
    'magic_link': {
        type: '고정',
        category: '고정',
        name: '매직 링크',
        subject: '매직 링크로 간편하게 로그인하세요',
        body: `<h2>매직 링크</h2><p>아래 링크를 클릭하면 바로 계정에 로그인됩니다.</p><p><a href="{{ .MagicLink }}">로그인하기</a></p>`,
        lastModified: '2024-07-23',
    },
    'change_email': {
        type: '고정',
        category: '고정',
        name: '이메일 주소 변경',
        subject: '이메일 주소 변경을 확인해주세요',
        body: `<h2>이메일 주소 변경 확인</h2><p>계정의 이메일 주소 변경 요청이 있었습니다. 본인이 요청한 것이 맞다면 아래 링크를 클릭하여 변경을 완료해주세요.</p><p><a href="{{ .EmailChangeURL }}">이메일 변경 확인</a></p>`,
        lastModified: '2024-07-23',
    },
    'reset_password': {
        type: '고정',
        category: '고정',
        name: '비밀번호 재설정',
        subject: '비밀번호 재설정을 진행해주세요',
        body: `<h2>비밀번호 재설정</h2><p>비밀번호 재설정 요청을 받았습니다. 아래 링크를 클릭하여 새로운 비밀번호를 설정하세요.</p><p><a href="{{ .PasswordResetURL }}">비밀번호 재설정하기</a></p>`,
        lastModified: '2024-07-23',
    },
    'reauthentication': {
        type: '고정',
        category: '고정',
        name: '재인증',
        subject: '보안을 위해 재인증이 필요합니다',
        body: `<h2>재인증 필요</h2><p>고객님의 정보를 안전하게 보호하기 위해 재인증이 필요합니다. 아래 링크를 클릭하여 계정을 다시 인증해주세요.</p><p><a href="{{ .ReauthenticationURL }}">재인증하기</a></p>`,
        lastModified: '2024-07-23',
    },
    'event_promotion': {
        type: '고정',
        category: '마케팅',
        name: '이벤트/프로모션',
        subject: '[밀리의 서재] 고객님을 위한 특별한 이벤트와 프로모션 안내입니다.',
        body: `<h2>놓치지 마세요! 특별한 이벤트가 준비되었습니다.</h2><p>안녕하세요, {{ .UserName }}님!</p><p>고객님을 위해 준비된 특별한 이벤트를 확인하고 풍성한 혜택을 누려보세요!</p><p><a href="{{ .PromotionURL }}">이벤트/프로모션 확인하기</a></p>`,
        lastModified: '2024-07-23',
    },
};

const templatesForTable = Object.entries(templateData).map(([key, value]) => ({
    key,
    ...value,
}));


const EmailTemplateOperations = () => {
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [isTestModalOpen, setIsTestModalOpen] = useState(false);
    const [testEmail, setTestEmail] = useState('');
    const [currentSendingTemplate, setCurrentSendingTemplate] = useState(null);

    const showPreview = (template) => {
        setPreviewTemplate(template);
        setIsPreviewModalOpen(true);
    };

    const handlePreviewCancel = () => {
        setIsPreviewModalOpen(false);
        setPreviewTemplate(null);
    };

    const showTestModal = (template) => {
        setCurrentSendingTemplate(template);
        setIsTestModalOpen(true);
    };

    const handleTestModalCancel = () => {
        setIsTestModalOpen(false);
        setTestEmail('');
        setCurrentSendingTemplate(null);
    };

    const handleTestModalOk = () => {
        // Basic email validation
        if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
            message.error('유효한 이메일 주소를 입력해주세요.');
            return;
        }
        console.log(`Sending test email for template "${currentSendingTemplate.name}" to ${testEmail}`);
        message.success(`'${currentSendingTemplate.name}' 템플릿의 테스트 이메일이 ${testEmail}(으)로 발송되었습니다.`);
        handleTestModalCancel();
    };


    const columns = [
        {
            title: '카테고리',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            render: (category) => <Tag color={category === '고정' ? 'blue' : 'green'}>{category}</Tag>
        },
        {
            title: '템플릿명',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: '이메일 제목',
            dataIndex: 'subject',
            key: 'subject',
            ellipsis: true,
        },
        {
            title: '최종 수정일',
            dataIndex: 'lastModified',
            key: 'lastModified',
            width: 150,
            sorter: (a, b) => moment(a.lastModified).unix() - moment(b.lastModified).unix(),
            defaultSortOrder: 'descend',
        },
        {
            title: '관리',
            key: 'action',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="미리보기">
                        <Button icon={<EyeOutlined />} onClick={() => showPreview(record)} size="small" />
                    </Tooltip>
                    <Tooltip title="테스트 발송">
                        <Button icon={<SendOutlined />} onClick={() => showTestModal(record)} size="small" />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={2}>이메일 템플릿 운영</Title>
            <Text type="secondary">등록된 이메일 템플릿 목록을 확인하고 관리합니다.</Text>

            <Table
                columns={columns}
                dataSource={templatesForTable}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                style={{ marginTop: '24px' }}
            />

            <Modal
                title="이메일 템플릿 미리보기"
                open={isPreviewModalOpen}
                onCancel={handlePreviewCancel}
                footer={[
                    <Button key="back" onClick={handlePreviewCancel}>
                        닫기
                    </Button>,
                ]}
                width={800}
            >
                {previewTemplate && (
                     <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0 16px' }}>
                        <Title level={5}>{previewTemplate.name}</Title>
                        <Paragraph>
                            <Text strong>제목: </Text> {previewTemplate.subject}
                        </Paragraph>
                        <Paragraph>
                            <Text strong>내용:</Text>
                            <div
                                style={{
                                    border: '1px solid #f0f0f0',
                                    padding: '16px',
                                    marginTop: '8px',
                                    borderRadius: '4px',
                                    background: '#fafafa',
                                }}
                                dangerouslySetInnerHTML={{ __html: previewTemplate.body }}
                            />
                        </Paragraph>
                    </div>
                )}
            </Modal>

            <Modal
                title="테스트 이메일 발송"
                open={isTestModalOpen}
                onOk={handleTestModalOk}
                onCancel={handleTestModalCancel}
                okText="발송"
                cancelText="취소"
            >
                {currentSendingTemplate && (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <p><Text strong>템플릿:</Text> {currentSendingTemplate.name}</p>
                        <p>테스트 이메일을 발송할 관리자 이메일 주소를 입력하세요.</p>
                        <Input
                            placeholder="test@example.com"
                            value={testEmail}
                            onChange={(e) => setTestEmail(e.target.value)}
                        />
                    </Space>
                )}
            </Modal>
        </div>
    );
};

export default EmailTemplateOperations;
