import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    Select,
    Radio,
    DatePicker,
    Button,
    Space,
    Typography,
    message,
    Card,
    Divider,
    AutoComplete, // For user search
    Row,
    Col,
    Modal,
    Descriptions,
} from 'antd';
import {
    SendOutlined, // 발송 아이콘
    EyeOutlined, // 미리보기 아이콘
    MailOutlined,
    MessageOutlined,
    BellOutlined,
    MobileOutlined, // 테스트 발송 아이콘 추가
} from '@ant-design/icons';
import moment from 'moment';
import { useGroups } from '../../context/GroupContext'; // Import useGroups hook

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- Sample Data (Replace with API calls) ---
const mockTemplates = [
    { key: 'tpl001', id: 'tpl001', name: '환영 메시지', title: '회원가입을 환영합니다!', content: '[이름]님, 밀리의 서재에 오신 것을 환영합니다! 지금 바로 첫 달 무료 혜택을 확인해보세요.' },
    { key: 'tpl002', id: 'tpl002', name: '이벤트 안내 (신간)', title: '[신간 제목] 출간 기념 이벤트! ', content: '독자님의 취향을 저격할 [신간 제목]이 출간되었습니다! 지금 바로 특별 이벤트에 참여하고 혜택을 받아가세요. [링크]' },
    { key: 'tpl003', id: 'tpl003', name: '독서 루틴 알림', title: '오늘의 독서, 시작하셨나요? 📚', content: '[이름]님, 잠시 밀리의 서재와 함께 마음의 양식을 쌓아보는 건 어때요? 꾸준한 독서는 성장의 밑거름이 됩니다.' },
];

const mockUsers = [
    { value: 'user001', label: '김민지 (user001@example.com)' },
    { value: 'user002', label: '이수현 (suhyun.lee@example.com)' },
    { value: 'user003', label: '박서준 (seo.park@example.com)' },
    { value: 'user004', label: '최유나 (yuna.choi@sample.net)' },
];

// --- Component ---
const NotificationDispatch = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { groups } = useGroups(); // Get groups from context
    const [targetType, setTargetType] = useState('all'); // all, group, individual
    const [dispatchTime, setDispatchTime] = useState('immediate'); // immediate, scheduled
    const [userSearchOptions, setUserSearchOptions] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewData, setPreviewData] = useState({});
    const [testRecipient, setTestRecipient] = useState('');
    const [testRecipientError, setTestRecipientError] = useState(null);
    const [noticeType, setNoticeType] = useState('regular'); // 'regular' or 'emergency'

    // Prepare group options for the select dropdown (Now includes ALL groups)
    const groupOptions = groups
        // .filter(group => !group.id.startsWith('ERR')) // Removed filter
        .map(group => ({ key: group.key, value: group.id, label: group.name }));

    // Load template when selected
    const handleTemplateChange = (templateId) => {
        const selectedTemplate = mockTemplates.find(t => t.id === templateId);
        if (selectedTemplate) {
            form.setFieldsValue({
                title: selectedTemplate.title,
                content: selectedTemplate.content,
            });
        } else {
            // Clear fields if "Direct Input" is selected
            form.setFieldsValue({ title: '', content: '' });
        }
    };

    // Handle user search for AutoComplete
    const handleUserSearch = (searchText) => {
        if (!searchText) {
            setUserSearchOptions([]);
        } else {
            // Simulate API call or filter mockUsers
            setUserSearchOptions(
                mockUsers.filter(user =>
                    user.label.toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }
    };

    // Show preview
    const showPreview = () => {
        form.validateFields()
            .then(values => {
                setPreviewData({ ...values, noticeType }); // Include noticeType in preview data
                setTestRecipientError(null);
                setPreviewVisible(true);
            })
            .catch(info => {
                console.log('Validate Failed for Preview:', info);
                message.warning('미리보기를 위해 필수 항목을 입력해주세요.');
            });
    };

    // Handle final dispatch
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        const isEmergency = noticeType === 'emergency';

        let dispatchData = {
            ...values,
            noticeType: noticeType, // Add notice type
        };

        if (isEmergency) {
            // Emergency Notice Payload
            dispatchData = {
                noticeType: 'emergency',
                level: values.level,
                channel: values.channel,
                title: values.title,
                content: values.content,
                // Emergency notices are typically 'all' target and 'immediate' dispatch
                targetType: 'all',
                dispatchTime: 'immediate',
            };
             // Remove fields not applicable to emergency
             delete dispatchData.linkUrl;
             delete dispatchData.targetValue;
             delete dispatchData.scheduledTimeOption;
             delete dispatchData.scheduledTime;
        } else {
            // Regular Notice Payload (Adjust existing logic)
            dispatchData = {
                ...values,
                noticeType: 'regular',
                linkUrl: values.linkUrl || null,
                targetValue: targetType === 'all' ? null : values.targetValue,
                scheduledTime: dispatchTime === 'scheduled' ? values.scheduledTime?.format('YYYY-MM-DD HH:mm:ss') : null,
            };
             // Remove unnecessary fields for regular
             delete dispatchData.level; // Ensure level is not sent for regular
             delete dispatchData.scheduledTimeOption;
             if (dispatchTime === 'immediate') delete dispatchData.scheduledTime;
             if (targetType === 'all') delete dispatchData.targetValue;
        }

        message.loading({ content: '알림 발송 처리 중...', key: 'dispatch' });
        // TODO: Implement actual API call here
        // Consider using different endpoints for regular vs emergency notices
        console.log('Dispatching notification:', dispatchData);
        setTimeout(() => { // Simulate API delay
            message.success({
                content: (
                    <span>
                        알림 발송 요청이 완료되었습니다!
                        <a
                            href="/notifications/history"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/notifications/history');
                                message.destroy('dispatch');
                            }}
                            style={{ marginLeft: '8px', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            발송 내역 보러가기
                        </a>
                    </span>
                ),
                key: 'dispatch',
                duration: 5
            });
            setPreviewVisible(false); // Close preview modal on successful dispatch
        }, 1500);
    };

    // Handle Test Send to Me
    const handleSendToMe = () => {
        const channel = previewData?.channel;
        const inputLabel = channel === 'email' ? '테스트 이메일 주소' : '테스트 발송 번호';

        if (!testRecipient) {
            setTestRecipientError(`${inputLabel}를 입력해주세요.`);
            return;
        }
        if (channel === 'email' && !testRecipient.includes('@')) {
            setTestRecipientError('유효한 이메일 형식이 아닙니다.');
            return;
        }
        
        setTestRecipientError(null);

        const recipientType = channel === 'email' ? 'email' : 'phone';
        console.log(`Sending test notification via ${channel} to ${recipientType}:`, testRecipient);
        console.log('Test Notification Data:', previewData);
        const testData = {
            ...previewData,
            recipient: testRecipient,
            recipientType: recipientType,
        };

        message.loading({ content: `'${testRecipient}'(으)로 테스트 발송 중...`, key: 'testSend' });
        // TODO: Implement actual API call for test send
        console.log('Test dispatch data:', testData);
        setTimeout(() => { 
            message.success({ content: `'${testRecipient}'(으)로 테스트 발송 요청이 완료되었습니다!`, key: 'testSend', duration: 3 });
        }, 1500);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setTestRecipientError(null);
        message.error('폼 입력 내용을 확인해주세요.');
    };

    const handleTestRecipientChange = (e) => {
        setTestRecipient(e.target.value);
        if (testRecipientError) {
            setTestRecipientError(null);
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>알림 발송</Title>
            <Card title="알림 내용 작성"> {/* Grouping content in a Card */}
                <Form
                    form={form}
                    layout="vertical"
                    name="notification_dispatch_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        channel: 'push', // Default channel
                        targetType: 'all',
                        scheduledTimeOption: 'immediate',
                        noticeType: 'regular', // Default notice type
                        level: 'info', // Default emergency level
                    }}
                >
                    {/* Notice Type Selection */}
                    <Form.Item name="noticeType" label="알림 종류">
                        <Radio.Group onChange={(e) => setNoticeType(e.target.value)} value={noticeType}>
                            <Radio value="regular">일반 알림</Radio>
                            <Radio value="emergency">긴급 공지</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* Emergency Level (Only for Emergency Notice) */}
                    {noticeType === 'emergency' && (
                         <Form.Item
                             name="level"
                             label="긴급 수준"
                             rules={[{ required: true, message: '긴급 수준을 선택해주세요!' }]}
                         >
                             <Select placeholder="긴급 수준 선택">
                                 <Option value="critical">Critical (치명적)</Option>
                                 <Option value="warning">Warning (경고)</Option>
                                 <Option value="info">Info (정보)</Option>
                             </Select>
                         </Form.Item>
                    )}

                    <Row gutter={16}> {/* Use Grid for layout */}
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                name="channel"
                                label="알림 채널"
                                rules={[{ required: true, message: '알림 채널을 선택해주세요!' }]}
                            >
                                <Select placeholder="채널 선택">
                                    <Option value="push"><BellOutlined /> 앱 푸시</Option>
                                    <Option value="email"><MailOutlined /> 이메일</Option>
                                    <Option value="sms"><MessageOutlined /> SMS</Option>
                                    {/* Add more channels */} 
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={16}>
                             <Form.Item label="템플릿 사용 (선택 사항)">
                                <Select
                                     placeholder="템플릿 선택 시 제목과 내용 자동 입력"
                                     allowClear
                                     onChange={handleTemplateChange}
                                     disabled={noticeType === 'emergency'} // Disable for emergency
                                >
                                     {mockTemplates.map(tpl => (
                                        <Option key={tpl.key} value={tpl.id}>{tpl.name}</Option>
                                     ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="title"
                        label="알림 제목"
                        rules={[{ required: true, message: '알림 제목을 입력해주세요!' }]}
                    >
                        <Input placeholder="알림 제목 입력 (예: 특별 할인 이벤트 안내)" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="알림 내용"
                        rules={[{ required: true, message: '알림 내용을 입력해주세요!' }]}
                        tooltip="템플릿 변수 사용 가능: [이름], [링크] 등"
                    >
                        <TextArea rows={6} placeholder="알림 내용 입력 (예: [이름]님만을 위한 특별 할인 쿠폰이 발급되었어요! 지금 확인해보세요. [링크])" />
                    </Form.Item>

                    {/* Added Link URL Input - Hide for Emergency */}
                     {noticeType === 'regular' && (
                        <Form.Item
                            name="linkUrl"
                            label="첨부 링크 (선택 사항)"
                            rules={[{ type: 'url', warningOnly: true, message: '유효한 URL 형식이 아닙니다.' }]}
                         >
                            <Input placeholder="알림에 포함할 링크 URL 입력 (예: https://example.com/event)" />
                         </Form.Item>
                     )}

                    {/* Conditional Rendering for Target and Schedule - Hide for Emergency */}
                    {noticeType === 'regular' && (
                        <>
                            <Divider>발송 대상 및 시점</Divider>

                            <Form.Item name="targetType" label="발송 대상">
                                <Radio.Group onChange={(e) => setTargetType(e.target.value)} value={targetType}>
                                    <Radio value="all">전체 사용자</Radio>
                                    <Radio value="group">특정 그룹</Radio>
                                    <Radio value="individual">특정 사용자</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {targetType === 'group' && (
                                <Form.Item
                                    name="targetValue"
                                    label="대상 그룹 선택"
                                    rules={[{ required: true, message: '대상 그룹을 선택해주세요!' }]}
                                >
                                    <Select placeholder="발송할 사용자 그룹 선택">
                                        {groupOptions.map(group => (
                                            <Option key={group.key} value={group.value}>{group.label}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            )}

                            {targetType === 'individual' && (
                                <Form.Item
                                    name="targetValue"
                                    label="대상 사용자 검색"
                                    rules={[{ required: true, message: '대상 사용자를 입력해주세요!' }]}
                                    tooltip="아이디 또는 이름으로 검색"
                                >
                                    <AutoComplete
                                        options={userSearchOptions}
                                        onSearch={handleUserSearch}
                                        placeholder="사용자 ID 또는 이름 검색 후 선택 (예: user001)"
                                     >
                                         <Input />{/* Allows manual input if needed */}
                                    </AutoComplete>
                                </Form.Item>
                            )}

                            <Form.Item name="scheduledTimeOption" label="발송 시점">
                                <Radio.Group onChange={(e) => setDispatchTime(e.target.value)} value={dispatchTime}>
                                    <Radio value="immediate">즉시 발송</Radio>
                                    <Radio value="scheduled">예약 발송</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {dispatchTime === 'scheduled' && (
                                <Form.Item
                                    name="scheduledTime"
                                    label="예약 시간"
                                    rules={[{ required: true, message: '예약 발송 시간을 선택해주세요!' }]}
                                >
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                </Form.Item>
                            )}
                        </>
                    )}

                    <Divider />

                    <Form.Item>
                        <Button type="dashed" icon={<EyeOutlined />} onClick={showPreview}>
                            미리보기
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Preview Modal with updated Footer AND Input inside */}
            <Modal
                title="알림 미리보기"
                open={previewVisible}
                onCancel={() => { 
                    setPreviewVisible(false); 
                    setTestRecipientError(null);
                }}
                footer={[
                    <Button key="test" onClick={handleSendToMe}>
                        나에게 알림 발송
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        알림 발송
                    </Button>,
                ]}
                width={600}
            >
                {previewData && (
                    <Descriptions bordered column={1} size="small">
                         {/* Show Notice Type and Level for Emergency */}
                         {previewData.noticeType === 'emergency' && (
                             <Descriptions.Item label="알림 종류" labelStyle={{ width: '100px' }}>
                                 <Text type="danger">긴급 공지</Text>
                             </Descriptions.Item>
                         )}

                        <Descriptions.Item label="채널" labelStyle={{ width: '100px' }}>
                            {previewData.channel === 'push' && <><BellOutlined /> 앱 푸시</>}
                            {previewData.channel === 'email' && <><MailOutlined /> 이메일</>}
                            {previewData.channel === 'sms' && <><MessageOutlined /> SMS</>}
                            {!['push', 'email', 'sms'].includes(previewData.channel) && previewData.channel}
                        </Descriptions.Item>
                        <Descriptions.Item label="발송 대상" labelStyle={{ width: '100px' }}>
                            {previewData.noticeType === 'emergency' && '전체 사용자 (긴급)'}
                            {previewData.noticeType === 'regular' && previewData.targetType === 'all' && '전체 사용자'}
                            {previewData.noticeType === 'regular' && previewData.targetType === 'group' && `그룹 (${groupOptions.find(g=>g.value === previewData.targetValue)?.label || previewData.targetValue})`}
                            {previewData.noticeType === 'regular' && previewData.targetType === 'individual' && `특정 사용자 (${previewData.targetValue})`}
                        </Descriptions.Item>
                        <Descriptions.Item label="발송 시점" labelStyle={{ width: '100px' }}>
                            {previewData.noticeType === 'emergency' && '즉시 발송 (긴급)'}
                            {previewData.noticeType === 'regular' && (
                                previewData.scheduledTimeOption === 'immediate' ? '즉시 발송' :
                                (previewData.scheduledTime ? `예약 발송 (${moment(previewData.scheduledTime).format('YYYY-MM-DD HH:mm:ss')})` : '예약 발송 (시간 미정)')
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="알림 제목" labelStyle={{ width: '100px' }}>{previewData.title}</Descriptions.Item>
                        <Descriptions.Item label="알림 내용" labelStyle={{ width: '100px' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                                {previewData.content}
                            </pre>
                        </Descriptions.Item>
                    </Descriptions>
                )}
                 {/* Hide Test Send Input for Emergency Notices */}
                    <Form layout="vertical" style={{ marginTop: '16px' }}>
                        <Form.Item
                            label={previewData?.channel === 'email' ? "테스트 이메일" : "테스트 번호"}
                            tooltip={`'나에게 알림 발송' 버튼을 사용하려면 ${previewData?.channel === 'email' ? '이메일을' : '번호를'} 입력하세요.`}
                            validateStatus={testRecipientError ? 'error' : ''} 
                            help={testRecipientError || ''} 
                        > 
                            <Input 
                                placeholder={previewData?.channel === 'email' 
                                    ? "이메일 주소 입력 (예: test@example.com)" 
                                    : "숫자만 입력 (예: 01012345678)"}
                                value={testRecipient} 
                                onChange={handleTestRecipientChange} 
                                style={{ width: '100%' }} 
                                allowClear
                            />
                        </Form.Item>
                    </Form>
            </Modal>
        </Space>
    );
};

export default NotificationDispatch; 