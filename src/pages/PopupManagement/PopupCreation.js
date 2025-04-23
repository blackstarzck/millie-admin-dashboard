import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Upload,
    Radio,
    InputNumber,
    Typography,
    Space,
    Card,
    message,
    Row,
    Col,
    Switch,
} from 'antd';
import {
    PlusOutlined,
    UploadOutlined,
    LinkOutlined,
    CalendarOutlined,
    UsergroupAddOutlined,
    CheckCircleOutlined,
    FileImageOutlined, // Image content type
    ProfileOutlined, // Template content type
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Sample Data (Replace with actual API data)
const popupTemplates = [
    { id: 'tpl001', name: '기본 공지 템플릿' },
    { id: 'tpl002', name: '할인 안내 템플릿' },
    { id: 'tpl003', name: '신규 기능 소개 템플릿' },
];

const userSegments = [
    { id: 'all', name: '전체 사용자' },
    { id: 'new_7d', name: '신규 가입자 (7일)' },
    { id: 'vip', name: 'VIP 등급' },
    { id: 'group_A', name: '사용자 그룹 A' },
];

// --- Component ---
// Renamed PopupCreate to PopupCreation to match App.js
const PopupCreation = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [contentType, setContentType] = useState('image'); // 'image' or 'template'
    const [imageList, setImageList] = useState([]);

    const onFinish = async (values) => {
        setLoading(true);
        message.loading({ content: '팝업 저장 중...', key: 'popupSave' });

        const formData = { ...values };
        formData.contentType = contentType;

        // Handle date range
        if (values.exposurePeriod) {
            formData.startDate = values.exposurePeriod[0].toISOString();
            formData.endDate = values.exposurePeriod[1].toISOString();
            delete formData.exposurePeriod;
        }

        // Handle image upload
        if (contentType === 'image' && imageList.length > 0) {
            formData.imageUrl = imageList[0].name; // Example: Store image name/url
            // TODO: Implement actual image upload logic
        } else {
            formData.imageUrl = null;
        }
         delete formData.imageUpload; // Remove upload field from final data

        // Handle template selection
        if (contentType === 'template') {
            formData.templateId = values.templateId;
        } else {
            formData.templateId = null;
        }

        console.log('Popup Form Data:', formData);

        // TODO: Replace with actual API call to create/update popup
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success({ content: '팝업이 성공적으로 저장되었습니다!', key: 'popupSave' });
            form.resetFields();
            setImageList([]);
            setContentType('image'); // Reset content type
        } catch (error) {
            console.error('Error saving popup:', error);
            message.error({ content: '팝업 저장 중 오류가 발생했습니다.', key: 'popupSave' });
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('필수 입력 항목을 확인해주세요.');
    };

    const handleContentTypeChange = (e) => {
        setContentType(e.target.value);
        // Reset related fields when type changes
        if (e.target.value === 'image') {
             form.setFieldsValue({ templateId: undefined });
        } else {
             form.setFieldsValue({ imageUpload: undefined }); // Or imageUrl if storing directly
             setImageList([]);
         }
    };

    // --- Upload Handlers ---
    const handleUploadChange = ({ fileList: newFileList }) => {
        setImageList(newFileList.slice(-1)); // Keep only one image
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('JPG/PNG 파일만 업로드할 수 있습니다!');
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('이미지는 5MB보다 작아야 합니다!');
        }
        // Prevent default upload if handling manually
        return isJpgOrPng && isLt5M ? false : Upload.LIST_IGNORE;
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><PlusOutlined /> 팝업 생성/수정</Title>
            <Text>새로운 팝업을 생성하고 노출 설정을 관리합니다.</Text>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    name="popup_creation_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        contentType: 'image',
                        frequencyType: 'once_per_session',
                        status: 'active',
                    }}
                >
                    <Form.Item
                        name="name"
                        label="팝업 이름 (관리용)"
                        rules={[{ required: true, message: '관리용 팝업 이름을 입력해주세요.' }]}
                    >
                        <Input placeholder="예: 신규 기능 출시 안내 팝업" />
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="팝업 제목 (사용자 노출용, 선택 사항)"
                    >
                        <Input placeholder="예: 놓치면 후회할 BIG SALE!" />
                    </Form.Item>

                     <Form.Item label="콘텐츠 타입" name="contentType">
                         <Radio.Group onChange={handleContentTypeChange} value={contentType}>
                             <Radio value="image"><FileImageOutlined /> 이미지</Radio>
                             <Radio value="template"><ProfileOutlined /> 템플릿 사용</Radio>
                         </Radio.Group>
                     </Form.Item>

                    {contentType === 'image' && (
                         <Form.Item
                            name="imageUpload" // Use a different name if storing file objects
                            label="팝업 이미지"
                             rules={[{ required: true, message: '팝업 이미지를 업로드해주세요.' }]}
                            // valuePropName="fileList"
                            // getValueFromEvent={normFile}
                         >
                             <Upload
                                 listType="picture"
                                fileList={imageList}
                                beforeUpload={beforeUpload}
                                onChange={handleUploadChange}
                                maxCount={1}
                            >
                                 <Button icon={<UploadOutlined />}>이미지 업로드 (JPG/PNG, max 5MB)</Button>
                             </Upload>
                         </Form.Item>
                     )}

                    {contentType === 'template' && (
                         <Form.Item
                            name="templateId"
                            label="팝업 템플릿 선택"
                            rules={[{ required: true, message: '사용할 팝업 템플릿을 선택해주세요.' }]}
                        >
                            <Select placeholder="팝업 템플릿 선택">
                                {popupTemplates.map(tpl => (
                                     <Option key={tpl.id} value={tpl.id}>{tpl.name}</Option>
                                 ))}
                             </Select>
                         </Form.Item>
                     )}

                    <Form.Item
                        name="linkUrl"
                        label={<><LinkOutlined /> 연결 URL (클릭 시 이동)</>}
                        rules={[{ type: 'url', message: '유효한 URL을 입력해주세요.' }]}                    >
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Row gutter={16}>
                         <Col xs={24} sm={12}>
                            <Form.Item
                                name="exposurePeriod"
                                label={<><CalendarOutlined /> 노출 기간</>}
                                rules={[{ required: true, message: '노출 기간을 선택해주세요.' }]}
                            >
                                <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                         <Col xs={24} sm={12}>
                            <Form.Item label="노출 빈도" required>
                                <Input.Group compact>
                                    <Form.Item name="frequencyType" noStyle rules={[{ required: true }]}>
                                        <Select style={{ width: '60%' }}>
                                             <Option value="once_per_session">세션당 한 번</Option>
                                             <Option value="once_per_day">하루에 한 번</Option>
                                             <Option value="every_time">매번 노출</Option>
                                             <Option value="every_n_hours">N 시간마다</Option>
                                        </Select>
                                    </Form.Item>
                                     <Form.Item name="frequencyValue" noStyle dependencies={['frequencyType']}>
                                        {(formInstance) =>
                                             formInstance.getFieldValue('frequencyType') === 'every_n_hours' ? (
                                                 <Form.Item name="frequencyHours" noStyle rules={[{ required: true, message: '시간 입력'}]}>
                                                     <InputNumber min={1} max={168} addonAfter="시간" style={{ width: '40%' }} placeholder="시간"/>
                                                 </Form.Item>
                                             ) : null
                                        }
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="targetAudience"
                                label={<><UsergroupAddOutlined /> 대상 설정</>}
                                rules={[{ required: true, message: '노출 대상을 선택해주세요.' }]}
                            >
                                 <Select placeholder="팝업 노출 대상 선택">
                                     {userSegments.map(seg => (
                                         <Option key={seg.id} value={seg.id}>{seg.name}</Option>
                                     ))}
                                 </Select>
                             </Form.Item>
                         </Col>
                         <Col xs={24} sm={12}>
                             <Form.Item name="status" label="상태" valuePropName="checked">
                                 <Switch checkedChildren="활성" unCheckedChildren="비활성" defaultChecked />
                             </Form.Item>
                         </Col>
                     </Row>

                    {/* Add fields for priority, device type targeting, page targeting if needed */}

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<CheckCircleOutlined />}
                            loading={loading}
                        >
                            팝업 저장
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Space>
    );
};

export default PopupCreation; 