import React, { useState, useEffect } from 'react';
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
} from 'antd';
import {
    SendOutlined, // 발송 아이콘
    EyeOutlined, // 미리보기 아이콘
    MailOutlined,
    MessageOutlined,
    BellOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- Sample Data (Replace with API calls) ---
const mockTemplates = [
    { key: 'tpl001', id: 'tpl001', name: '환영 메시지', title: '회원가입을 환영합니다!', content: '[이름]님, 밀리의 서재에 오신 것을 환영합니다! 지금 바로 첫 달 무료 혜택을 확인해보세요.' },
    { key: 'tpl002', id: 'tpl002', name: '이벤트 안내 (신간)', title: '[신간 제목] 출간 기념 이벤트! ', content: '독자님의 취향을 저격할 [신간 제목]이 출간되었습니다! 지금 바로 특별 이벤트에 참여하고 혜택을 받아가세요. [링크]' },
    { key: 'tpl003', id: 'tpl003', name: '독서 루틴 알림', title: '오늘의 독서, 시작하셨나요? 📚', content: '[이름]님, 잠시 밀리의 서재와 함께 마음의 양식을 쌓아보는 건 어때요? 꾸준한 독서는 성장의 밑거름이 됩니다.' },
];

const mockUserGroups = [
    { key: 'G001', name: 'VIP 고객' },
    { key: 'G002', name: '신규 가입 (30일 이내)' },
    { key: 'G003', name: '이벤트 참여자 (7월)' },
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
    const [targetType, setTargetType] = useState('all'); // all, group, individual
    const [dispatchTime, setDispatchTime] = useState('immediate'); // immediate, scheduled
    const [userSearchOptions, setUserSearchOptions] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewData, setPreviewData] = useState({});

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
                setPreviewData(values);
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
        const dispatchData = {
            ...values,
            targetValue: targetType === 'all' ? null : values.targetValue,
            scheduledTime: dispatchTime === 'scheduled' ? values.scheduledTime?.format('YYYY-MM-DD HH:mm:ss') : null,
        };
        // Remove unnecessary fields
        delete dispatchData.scheduledTimeOption;
        if (dispatchTime === 'immediate') delete dispatchData.scheduledTime;
        if (targetType === 'all') delete dispatchData.targetValue;

        message.loading({ content: '알림 발송 처리 중...', key: 'dispatch' });
        // TODO: Implement actual API call here
        console.log('Dispatching notification:', dispatchData);
        setTimeout(() => { // Simulate API delay
            message.success({ content: '알림 발송 요청이 완료되었습니다!', key: 'dispatch', duration: 2 });
            // Optionally reset form
            // form.resetFields();
            // setTargetType('all');
            // setDispatchTime('immediate');
        }, 1500);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('폼 입력 내용을 확인해주세요.');
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
                    }}
                >
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
                                {mockUserGroups.map(group => (
                                    <Option key={group.key} value={group.key}>{group.name}</Option>
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

                    <Divider />

                    <Form.Item>
                        <Space size="middle">
                            <Button type="dashed" icon={<EyeOutlined />} onClick={showPreview}>
                                미리보기
                            </Button>
                            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                                알림 발송
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>

             {/* Preview Modal (Simple Text Preview) */}
            <Modal
                title="알림 미리보기"
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setPreviewVisible(false)}>
                        닫기
                    </Button>,
                ]}
            >
                 <Paragraph><strong>채널:</strong> {previewData.channel}</Paragraph>
                 <Paragraph><strong>대상:</strong> {
                     previewData.targetType === 'all' ? '전체 사용자' :
                     previewData.targetType === 'group' ? `그룹 (${mockUserGroups.find(g=>g.key === previewData.targetValue)?.name || previewData.targetValue})` :
                     `사용자 (${previewData.targetValue})`
                 }</Paragraph>
                 <Paragraph><strong>발송 시점:</strong> {
                     previewData.scheduledTimeOption === 'immediate' ? '즉시' :
                     previewData.scheduledTime ? moment(previewData.scheduledTime).format('YYYY-MM-DD HH:mm:ss') : '-'
                 }</Paragraph>
                <Divider />
                <Paragraph><strong>제목:</strong> {previewData.title}</Paragraph>
                <Paragraph><strong>내용:</strong></Paragraph>
                <Paragraph style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                    {previewData.content}
                </Paragraph>
            </Modal>
        </Space>
    );
};

export default NotificationDispatch; 