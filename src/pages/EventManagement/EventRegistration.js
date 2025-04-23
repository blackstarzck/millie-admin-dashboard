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
    Upload,
    InputNumber,
} from 'antd';
import { CalendarOutlined, UploadOutlined, LinkOutlined, SendOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const EventRegistration = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    // Sample data for target audience (replace with actual data/API)
    const userSegments = [
        { id: 'all', name: '전체 사용자' },
        { id: 'new', name: '신규 가입자 (최근 7일)' },
        { id: 'vip', name: 'VIP 등급' },
        { id: 'purchase_history', name: '특정 상품 구매자' },
    ];

    const onFinish = async (values) => {
        setLoading(true);
        message.loading({ content: '이벤트 등록 중...', key: 'eventCreate' });

        const formData = { ...values };
        // Handle Date Range
        if (values.eventPeriod) {
            formData.startDate = values.eventPeriod[0].toISOString();
            formData.endDate = values.eventPeriod[1].toISOString();
            delete formData.eventPeriod;
        }
        // Handle File Upload (assuming you upload file info or URL)
        formData.bannerImage = fileList.length > 0 ? fileList[0].name : null; // Example: just store name
        // TODO: Implement actual file upload logic here

        console.log('Event Form Data:', formData);

        // TODO: Replace with actual API call to create the event
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1200));
            message.success({ content: '이벤트가 성공적으로 등록되었습니다!', key: 'eventCreate' });
            form.resetFields();
            setFileList([]);
        } catch (error) {
            console.error('Error creating event:', error);
            message.error({ content: '이벤트 등록 중 오류가 발생했습니다.', key: 'eventCreate' });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('필수 입력 항목을 확인해주세요.');
    };

    // --- Upload Handlers ---
    const handleUploadChange = ({ fileList: newFileList }) => {
        // Keep only the last uploaded file if needed, or handle multiple
        setFileList(newFileList.slice(-1));
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('JPG/PNG 파일만 업로드할 수 있습니다!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('이미지는 2MB보다 작아야 합니다!');
        }
        // Return false to prevent antd's default upload behavior if you handle upload manually
        return isJpgOrPng && isLt2M ? false : Upload.LIST_IGNORE;
         // return false; // Use this if you manually upload via API in onFinish
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><EditOutlined /> 이벤트 등록</Title>
            <Text>새로운 이벤트를 생성하고 관련 정보를 등록합니다.</Text>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    name="event_registration_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        status: 'draft', // Default status
                    }}
                >
                    <Form.Item
                        name="title"
                        label="이벤트 제목"
                        rules={[{ required: true, message: '이벤트 제목을 입력해주세요.' }]}
                    >
                        <Input placeholder="예: 여름맞이 특별 할인 이벤트" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="이벤트 설명 (내부 확인용)"
                    >
                        <Input placeholder="이벤트 목적, 주요 내용 등 기록" />
                    </Form.Item>

                     <Form.Item
                         name="content"
                         label="이벤트 상세 내용 (사용자 노출용)"
                         rules={[{ required: true, message: '이벤트 상세 내용을 입력해주세요.' }]}
                     >
                         {/* Consider using a Rich Text Editor */}
                         <TextArea rows={6} placeholder="이벤트 상세 설명, 참여 방법, 유의사항 등" />
                     </Form.Item>

                    <Form.Item
                        name="eventPeriod"
                        label={<><CalendarOutlined /> 이벤트 기간</>}
                        rules={[{ required: true, message: '이벤트 기간을 선택해주세요.' }]}
                    >
                        <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="bannerImage"
                        label="배너 이미지 (선택 사항)"
                        // valuePropName="fileList" // Use this if antd upload state sync is needed
                        // getValueFromEvent={normFile} // Helper function if needed
                    >
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            onChange={handleUploadChange}
                            maxCount={1}
                            // customRequest={dummyRequest} // Use dummyRequest if you handle upload in onFinish
                        >
                            <Button icon={<UploadOutlined />}>이미지 업로드 (JPG/PNG, max 2MB)</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="targetAudience"
                        label="대상 사용자"
                        rules={[{ required: true, message: '대상 사용자를 선택해주세요.' }]}
                    >
                        <Select placeholder="이벤트 대상 사용자 그룹 선택">
                            {userSegments.map(seg => (
                                <Option key={seg.id} value={seg.id}>{seg.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                     <Form.Item
                         name="eventUrl"
                         label={<><LinkOutlined /> 이벤트 페이지 URL (선택 사항)</>}
                         rules={[{ type: 'url', message: '유효한 URL을 입력해주세요.' }]}
                     >
                         <Input placeholder="https://... 이벤트 상세 페이지 링크" />
                     </Form.Item>

                     <Form.Item
                         name="status"
                         label="상태"
                         rules={[{ required: true, message: '상태를 선택해주세요.' }]}
                     >
                         <Select style={{ width: 120 }}>
                             <Option value="draft">임시 저장</Option>
                             <Option value="scheduled">예약</Option>
                             <Option value="active">진행 중</Option>
                         </Select>
                     </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SendOutlined />}
                            loading={loading}
                        >
                            이벤트 등록
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Space>
    );
};

export default EventRegistration; 