import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Switch,
    Typography,
    Space,
    Card,
    message,
    Row,
    Col
} from 'antd';
import { FileTextOutlined, SendOutlined, TagsOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- Component ---
const NoticeCreation = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Simulate fetching categories (replace with actual API call)
    const categories = [
        { id: 'announcement', name: '일반 공지' },
        { id: 'event', name: '이벤트' },
        { id: 'system', name: '시스템 점검' },
        { id: 'update', name: '업데이트' },
    ];

    const onFinish = async (values) => {
        setLoading(true);
        message.loading({ content: '공지사항 등록 중...', key: 'noticeCreate' });
        console.log('Form Values:', values);

        // TODO: Replace with actual API call to create the notice
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success({ content: '공지사항이 성공적으로 등록되었습니다!', key: 'noticeCreate' });
            form.resetFields(); // Reset form after successful submission
        } catch (error) {
            console.error('Error creating notice:', error);
            message.error({ content: '공지사항 등록 중 오류가 발생했습니다.', key: 'noticeCreate' });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('필수 입력 항목을 확인해주세요.');
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><FileTextOutlined /> 공지사항 생성</Title>
            <Text>새로운 공지사항을 작성하고 등록합니다.</Text>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    name="notice_creation_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        isImportant: false,
                        isVisible: true,
                        // Set default category if needed
                    }}
                >
                    <Form.Item
                        name="title"
                        label="제목"
                        rules={[{ required: true, message: '제목을 입력해주세요.' }]}
                    >
                        <Input placeholder="공지사항 제목" />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label={<><TagsOutlined /> 카테고리</>}
                        rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}
                    >
                        <Select placeholder="카테고리 선택">
                            {categories.map(cat => (
                                <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="내용"
                        rules={[{ required: true, message: '내용을 입력해주세요.' }]}
                    >
                        {/* Replace with a Rich Text Editor (e.g., React Quill, Editor.js) for better UX */}
                        <TextArea rows={10} placeholder="공지 내용을 입력하세요..." />
                    </Form.Item>

                    <Row gutter={16}>
                       <Col xs={24} sm={12}>
                            <Form.Item
                                name="exposurePeriod"
                                label="노출 기간 (선택 사항)"
                            >
                                <DatePicker.RangePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                       <Col xs={12} sm={6}>
                            <Form.Item name="isImportant" label="중요 공지" valuePropName="checked">
                                <Switch />
                            </Form.Item>
                        </Col>
                       <Col xs={12} sm={6}>
                            <Form.Item name="isVisible" label="즉시 게시" valuePropName="checked">
                                <Switch defaultChecked />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SendOutlined />}
                            loading={loading}
                        >
                            공지 등록
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Space>
    );
};

export default NoticeCreation;
