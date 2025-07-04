import {
  ClockCircleOutlined,
  FileImageOutlined, // Placeholder for adding template
  LinkOutlined,
  ProfileOutlined,
  SaveOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
} from 'antd';
import React, { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// Sample template data (replace with actual fetch)
const sampleTemplates = [
    { id: 'TPL001', name: '신규 기능 안내 템플릿' },
    { id: 'TPL002', name: '마케팅 수신 동의 템플릿' },
    { id: 'TPL003', name: '할인 이벤트 템플릿' },
];

const PopupCreate = () => {
    const [form] = Form.useForm();
    const [contentType, setContentType] = useState('image'); // 'image' or 'template'
    const [imageUrl, setImageUrl] = useState(null); // For image preview
    const [isLoading, setIsLoading] = useState(false);

    const onContentTypeChange = (e) => {
        setContentType(e.target.value);
        // Reset related fields when type changes
        form.setFieldsValue({
            image: null,
            templateId: null,
        });
        setImageUrl(null);
    };

    // Handle image upload (dummy handler)
    const handleUploadChange = (info) => {
        if (info.file.status === 'uploading') {
            // console.log('Uploading...');
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
             message.success(`${info.file.name} 파일이 업로드되었습니다.`);
             // Simulate getting a URL after upload
            const uploadedUrl = URL.createObjectURL(info.file.originFileObj); // Temporary local URL for preview
            setImageUrl(uploadedUrl);
             form.setFieldsValue({ imageUrl: uploadedUrl }); // Set image URL in form if needed for submission
             console.log('Uploaded file info:', info.file, 'Simulated URL:', uploadedUrl);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 파일 업로드 실패.`);
        }
    };

     // Dummy upload action (replace with actual upload endpoint)
     const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const onFinish = (values) => {
        setIsLoading(true);
        // Process form values
        const popupData = {
            ...values,
            startDate: values.exposurePeriod ? values.exposurePeriod[0].format('YYYY-MM-DD HH:mm:ss') : null,
            endDate: values.exposurePeriod ? values.exposurePeriod[1].format('YYYY-MM-DD HH:mm:ss') : null,
            content: contentType === 'image' ? values.imageUrl : values.templateId, // Adjust based on type
        };
        // Clean up fields not needed directly
        delete popupData.exposurePeriod;
        delete popupData.image; // Remove Upload component data

        console.log('Popup Data to Submit:', popupData);
        message.loading({ content: '팝업 생성 중...', key: 'popupCreate' });

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            message.success({ content: `'${popupData.name}' 팝업이 생성되었습니다.`, key: 'popupCreate', duration: 2 });
            // TODO: Add API call to create popup
            form.resetFields();
            setImageUrl(null);
             setContentType('image'); // Reset content type
        }, 1500);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('필수 입력 항목을 확인해주세요.');
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>새 팝업 생성</Title>
            <Text type="secondary">새로운 팝업을 생성하고 기본 정보를 설정합니다.</Text>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    contentType: 'image',
                    status: true, // Default to active
                    frequency: 'daily', // Default frequency
                    targetAudience: 'all', // Default target
                }}
            >
                <Row gutter={24}>
                     {/* Left Column */}
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="name"
                            label="팝업 이름 (관리용)"
                            rules={[{ required: true, message: '관리용 팝업 이름을 입력해주세요.' }]}
                        >
                            <Input placeholder="예: 여름맞이 특별 이벤트 (2024)" />
                        </Form.Item>

                        <Form.Item
                            name="title"
                            label="팝업 제목 (사용자 노출)"
                            rules={[{ required: true, message: '사용자에게 보여질 팝업 제목을 입력해주세요.' }]}
                         >
                             <Input placeholder="예: 시원한 여름! 특별 할인 혜택" />
                         </Form.Item>

                         <Form.Item
                            name="contentType"
                            label="콘텐츠 유형"
                            rules={[{ required: true }]}
                         >
                             <Radio.Group onChange={onContentTypeChange} value={contentType}>
                                 <Radio value="image"><FileImageOutlined /> 이미지</Radio>
                                 <Radio value="template"><ProfileOutlined /> 템플릿 사용</Radio>
                             </Radio.Group>
                         </Form.Item>

                        {contentType === 'image' && (
                            <Form.Item
                                name="image"
                                label="팝업 이미지 업로드"
                                valuePropName="fileList"
                                getValueFromEvent={(e) => {
                                    // Ensure only the last uploaded file is processed by the form
                                    if (Array.isArray(e)) { return e; }
                                    return e && e.fileList;
                                }}
                                rules={[{ required: true, message: '팝업 이미지를 업로드해주세요.' }]}
                                extra="권장 사이즈: 600x800px, 1MB 이하"
                            >
                                <Upload
                                     name="popupImage"
                                     listType="picture"
                                     maxCount={1}
                                     customRequest={dummyRequest} // Use dummy request for simulation
                                     onChange={handleUploadChange}
                                     beforeUpload={(file) => {
                                        const isLt1M = file.size / 1024 / 1024 < 1;
                                        if (!isLt1M) {
                                            message.error('이미지는 1MB 보다 작아야 합니다!');
                                        }
                                        // Add image type validation if needed
                                        return isLt1M; // Only return true if validation passes
                                    }}
                                >
                                    <Button icon={<UploadOutlined />}>이미지 선택</Button>
                                </Upload>
                            </Form.Item>
                         )}
                         {/* Hidden field to store the final image URL */}
                         <Form.Item name="imageUrl" hidden><Input /></Form.Item>

                        {contentType === 'template' && (
                            <Form.Item
                                name="templateId"
                                label="팝업 템플릿 선택"
                                rules={[{ required: true, message: '사용할 팝업 템플릿을 선택해주세요.' }]}
                             >
                                <Select placeholder="템플릿 선택">
                                     {sampleTemplates.map(template => (
                                         <Option key={template.id} value={template.id}>{template.name}</Option>
                                     ))}
                                 </Select>
                                 {/* Optionally add a button to go to template management */}
                                 {/* <Button icon={<PlusOutlined />} style={{ marginLeft: 8 }}>템플릿 관리</Button> */}
                             </Form.Item>
                         )}

                         <Form.Item
                            name="landingUrl"
                            label="랜딩 URL (선택)"
                            tooltip="팝업 클릭 시 이동할 웹 주소입니다."
                         >
                            <Input addonBefore={<LinkOutlined />} placeholder="https://example.com/event" />
                        </Form.Item>
                    </Col>

                     {/* Right Column */}
                     <Col xs={24} md={12}>
                        <Form.Item
                            name="exposurePeriod"
                            label="노출 기간"
                            rules={[{ required: true, message: '팝업 노출 시작일과 종료일을 선택해주세요.' }]}
                         >
                             <RangePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }}
                                placeholder={['시작일시', '종료일시']}
                             />
                         </Form.Item>

                         <Form.Item
                            name="frequency"
                            label="노출 빈도"
                            rules={[{ required: true }]}
                         >
                             <Select>
                                 <Option value="daily"><ClockCircleOutlined /> 하루에 한 번</Option>
                                 <Option value="once"><StopOutlined /> 다시 보지 않음</Option>
                                 <Option value="session"><ClockCircleOutlined /> 세션 당 한 번</Option>
                                 <Option value="always"><WarningOutlined /> 항상 노출 (테스트용)</Option>
                             </Select>
                         </Form.Item>

                         <Form.Item
                             name="targetAudience"
                             label="노출 대상"
                             rules={[{ required: true }]}
                         >
                             <Radio.Group>
                                 <Radio value="all"><UserOutlined /> 전체 사용자</Radio>
                                 <Radio value="loggedIn"><UserOutlined /> 로그인 사용자</Radio>
                                 {/* Add more targeting options here (e.g., user group, OS) */}
                             </Radio.Group>
                         </Form.Item>

                        <Form.Item
                            name="priority"
                            label="우선순위 (선택)"
                            tooltip="동일 조건의 여러 팝업 중 숫자가 낮을수록 우선 노출 (기본값: 0)"
                         >
                            <InputNumber min={0} defaultValue={0} style={{ width: 100 }} />
                        </Form.Item>

                         <Form.Item
                            name="status"
                            label="상태"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="활성" unCheckedChildren="비활성" />
                        </Form.Item>
                     </Col>
                 </Row>

                 <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={isLoading}>
                        팝업 생성
                    </Button>
                </Form.Item>
            </Form>
        </Space>
    );
};

export default PopupCreate;
