import React, { useState } from 'react';
import {
    Form,
    Input,
    Select,
    Checkbox,
    Button,
    Space,
    Typography,
    message,
    Card,
    Alert,
    Popconfirm,
} from 'antd';
import {
    NotificationOutlined, // 공지 아이콘
    SoundOutlined, // 긴급 발송 아이콘
    StopOutlined, // 비활성화 아이콘
} from '@ant-design/icons';
import moment from 'moment'; // To show timestamp of active notice

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- Sample State for Active Notice (Replace with API call) ---
const initialActiveNotice = null; // Example: { id: 'EN001', title: '긴급 서버 점검 안내', content: '...', level: 'critical', channels: ['banner', 'push'], activatedAt: '2024-07-30 15:00:00' };

// --- Component ---
const EmergencyNotice = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeNotice, setActiveNotice] = useState(initialActiveNotice);

    // Handle activation/dispatch
    const onFinish = (values) => {
        console.log('Dispatching emergency notice:', values);
        setLoading(true);
        message.loading({ content: '긴급 공지 발송 중...', key: 'dispatchEmergency' });

        // TODO: Implement API call to dispatch the notice
        setTimeout(() => { // Simulate API delay
            const newNotice = {
                id: `EN${moment().format('YYYYMMDDHHmmss')}`,
                activatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                ...values,
            };
            setActiveNotice(newNotice); // Assume success and show as active
            setLoading(false);
            message.success({ content: '긴급 공지가 성공적으로 발송/활성화되었습니다!', key: 'dispatchEmergency', duration: 2 });
            form.resetFields(); // Reset form after successful dispatch
        }, 2000);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('필수 항목을 모두 입력해주세요.');
    };

    // Handle deactivation
    const handleDeactivate = () => {
         message.loading({ content: '긴급 공지 비활성화 중...', key: 'deactivateEmergency' });
         // TODO: Implement API call to deactivate the notice
         setTimeout(() => { // Simulate API delay
             setActiveNotice(null);
             message.success({ content: '긴급 공지가 비활성화되었습니다.', key: 'deactivateEmergency', duration: 2 });
             console.log('Deactivated notice:', activeNotice?.id);
         }, 1000);
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>긴급 공지 발송</Title>
            <Text type="secondary">서비스 장애, 긴급 점검 등 중요한 상황 발생 시 사용자에게 빠르게 공지를 발송합니다. 발송된 공지는 확인 후 비활성화해주세요.</Text>

            {/* Active Notice Display */}
            {activeNotice && (
                <Alert
                    message={<><WarningOutlined /> 현재 활성화된 긴급 공지</>}
                    description={
                        <div>
                            <p><strong>ID:</strong> {activeNotice.id}</p>
                            <p><strong>제목:</strong> {activeNotice.title}</p>
                            <p><strong>내용:</strong> {activeNotice.content?.substring(0, 100)}{activeNotice.content?.length > 100 ? '...' : ''}</p>
                            <p><strong>수준:</strong> <Tag color={activeNotice.level === 'critical' ? 'red' : activeNotice.level === 'warning' ? 'orange' : 'blue'}>{activeNotice.level}</Tag></p>
                            <p><strong>채널:</strong> {activeNotice.channels?.join(', ')}</p>
                            <p><strong>활성화 시각:</strong> {activeNotice.activatedAt}</p>
                        </div>
                    }
                    type={activeNotice.level === 'critical' ? 'error' : activeNotice.level === 'warning' ? 'warning' : 'info'}
                    showIcon
                    action={
                        <Popconfirm
                            title="활성화된 긴급 공지를 비활성화하시겠습니까?"
                            onConfirm={handleDeactivate}
                            okText="비활성화"
                            cancelText="취소"
                        >
                            <Button size="small" type="dashed" danger icon={<StopOutlined />}>
                                비활성화
                            </Button>
                        </Popconfirm>
                    }
                    style={{ marginBottom: 24 }}
                />
            )}

            <Card title="새 긴급 공지 작성 및 발송">
                <Form
                    form={form}
                    layout="vertical"
                    name="emergency_notice_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    disabled={loading || activeNotice} // Disable form if loading or notice active
                    initialValues={{
                        level: 'critical',
                        channels: ['banner', 'push'], // Default channels
                    }}
                >
                    <Form.Item
                        name="level"
                        label="공지 수준"
                        rules={[{ required: true, message: '공지 수준을 선택해주세요!' }]}
                    >
                        <Select style={{ width: 200 }}>
                            <Option value="critical">매우 중요 (Critical)</Option>
                            <Option value="warning">주의 (Warning)</Option>
                            <Option value="info">정보 (Info)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="channels"
                        label="발송 채널"
                        rules={[{ required: true, message: '하나 이상의 발송 채널을 선택해주세요!' }]}
                    >
                        <Checkbox.Group>
                            <Checkbox value="banner">앱 내 배너</Checkbox>
                            <Checkbox value="push">앱 푸시</Checkbox>
                            <Checkbox value="sms">SMS (신중히 사용)</Checkbox>
                            {/* Add other relevant channels */} 
                        </Checkbox.Group>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="제목"
                        rules={[{ required: true, message: '공지 제목을 입력해주세요!' }]}
                    >
                        <Input placeholder="예: 긴급 서버 점검 안내" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="내용"
                        rules={[{ required: true, message: '공지 내용을 입력해주세요!' }]}
                    >
                        <TextArea rows={5} placeholder="예: 서비스 안정화를 위한 긴급 서버 점검이 00:00 부터 00:00 까지 진행될 예정입니다. 이용에 불편을 드려 죄송합니다." />
                    </Form.Item>

                    <Form.Item>
                         <Popconfirm
                            title="정말로 긴급 공지를 발송하시겠습니까? 모든 대상에게 즉시 발송됩니다."
                            disabled={loading || activeNotice} // Disable if already processing or active notice exists
                            onConfirm={() => form.submit()} // Trigger form submit on confirm
                            okText="즉시 발송"
                            cancelText="취소"
                         >
                            <Button
                                type="primary"
                                danger
                                icon={<SoundOutlined />}
                                loading={loading}
                                disabled={activeNotice} // Disable button entirely if notice active
                            >
                                {activeNotice ? '활성 공지 비활성화 필요' : '긴급 공지 즉시 발송'}
                            </Button>
                        </Popconfirm>
                         {activeNotice && <Text type="danger" style={{ marginLeft: 16 }}>현재 활성화된 긴급 공지가 있어 새 공지를 발송할 수 없습니다.</Text>}
                    </Form.Item>
                </Form>
            </Card>
        </Space>
    );
};

export default EmergencyNotice; 