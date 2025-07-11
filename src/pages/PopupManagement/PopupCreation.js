import {
  CalendarOutlined,
  CheckCircleOutlined, // Template content type
  EyeOutlined,
  FileImageOutlined,
  LinkOutlined,
  PlusOutlined, // Image content type
  ProfileOutlined, // Preview Icon
  PushpinOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  Upload
} from 'antd';
import React, { useEffect, useState } from 'react';
import { usePopupTemplates } from '../../context/PopupTemplateContext'; // Import template context hook

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Sample Data (Replace with actual API data) - REMOVED
/*
const popupTemplates = [
    { id: 'tpl001', name: '기본 공지 템플릿', variables: [] }, // No variables needed
    { id: 'tpl002', name: '할인 안내 템플릿', variables: [{ key: '[discount_rate]', label: '할인율 (%) ' }, { key: '[item_name]', label: '상품명' }] },
    { id: 'tpl003', name: '신규 기능 소개 템플릿', variables: [{ key: '[feature_name]', label: '기능 이름' }, { key: '[link]', label: '기능 안내 링크' }] },
];
*/

const userSegments = [
    { id: 'all', name: '전체 사용자' },
    { id: 'new_7d', name: '신규 가입자 (7일)' },
    { id: 'vip', name: 'VIP 등급' },
    { id: 'group_A', name: '사용자 그룹 A' },
];

const pageList = [
    { id: 'platform_main', name: '플랫폼 메인 홈' },
    { id: 'search_result', name: '검색 결과' },
    { id: 'book_detail', name: '도서 상세' },
    { id: 'viewer', name: '뷰어' },
    { id: 'my_library', name: '내 서재' },
    { id: 'category_best', name: '카테고리/베스트' },
    { id: 'event_detail', name: '이벤트 상세' },
    { id: 'user_profile', name: '사용자 프로필' },
    { id: 'subscription_info', name: '구독 정보' },
];

// --- Component ---
// Renamed PopupCreate to PopupCreation to match App.js
const PopupCreation = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [contentType, setContentType] = useState('image'); // 'image' or 'template'
    const [imageList, setImageList] = useState([]);
    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [selectedTemplateDetails, setSelectedTemplateDetails] = useState(null);
    const { templates: contextTemplates } = usePopupTemplates(); // Get templates from context

    const onFinish = async (values) => {
        setLoading(true);
        message.loading({ content: '팝업 저장 중...', key: 'popupSave' });

        const formData = { ...values };
        formData.contentType = contentType;
        formData.status = true; // Always set status to active

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

        // Include template variables if present
        if (contentType === 'template' && values.templateVariables) {
            formData.variables = values.templateVariables;
        }
        delete formData.templateVariables; // Remove the wrapper from final data

        console.log('Popup Form Data:', formData);

        // TODO: Replace with actual API call to create/update popup
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success({ content: '팝업이 성공적으로 저장되었습니다!', key: 'popupSave' });
            form.resetFields();
            setImageList([]);
            setContentType('image'); // Reset content type
            setSelectedTemplateDetails(null); // Reset selected template details
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
             form.setFieldsValue({ templateId: undefined, templateVariables: {} }); // Clear template fields
             setSelectedTemplateDetails(null);
        } else {
             form.setFieldsValue({ imageUpload: undefined }); // Or imageUrl if storing directly
             setImageList([]);
         }
    };

    // Handle Template Selection
    const handleTemplateChange = (templateId) => {
        // Use contextTemplates to find the selected template
        const selected = contextTemplates.find(t => t.id === templateId);
        setSelectedTemplateDetails(selected);
        // Clear any previous variable values when template changes
        form.setFieldsValue({ templateVariables: {} });
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

    // --- Preview Handlers ---
    const showPreview = () => {
        form.validateFields()
            .then(values => {
                 const previewContent = { ...values };
                previewContent.contentType = contentType;

                // Prepare processed content for template preview
                let processedTemplateContent = null;

                 // Handle image preview data (use file object if available)
                 if (contentType === 'image' && imageList.length > 0) {
                     previewContent.imageFile = imageList[0].originFileObj || imageList[0]; // Use originFileObj for FileReader
                     previewContent.imageUrl = imageList[0].name; // Fallback/display name
                 }

                 // Find selected template name and process content for preview
                 if (contentType === 'template' && values.templateId) {
                     const selectedTemplate = contextTemplates.find(t => t.id === values.templateId);
                    previewContent.templateName = selectedTemplate?.name || values.templateId;

                    // Process template content with variables
                    if (selectedTemplate?.content && values.templateVariables) {
                        processedTemplateContent = selectedTemplate.content;
                         Object.entries(values.templateVariables).forEach(([key, value]) => {
                             // Need a robust way to replace placeholders, e.g., using RegExp
                             // Basic replacement (might need improvement for edge cases):
                            if (value !== undefined && value !== null) { // Only replace if value exists
                                // Escape special characters in key for RegExp if key format is complex
                                const placeholder = new RegExp(key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'); // Basic escaping for placeholder key
                                processedTemplateContent = processedTemplateContent.replace(placeholder, value);
                            }
                         });
                     }
                 }

                previewContent.processedContent = processedTemplateContent; // Store processed content

                 console.log("Preview Data:", previewContent);
                setPreviewData(previewContent);
                setIsPreviewModalVisible(true);
            })
            .catch(info => {
                console.log('Validate Failed for Preview:', info);
                message.warning('미리보기를 위해 필요한 항목(예: 콘텐츠 타입, 이미지/템플릿)을 입력/선택해주세요.');
            });
    };

    const handlePreviewCancel = () => {
        setIsPreviewModalVisible(false);
        setPreviewData(null);
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
                        hideOptions: [],
                    }}
                >
                    <Form.Item
                        name="name"
                        label="팝업 이름 (관리용)"
                        rules={[{ required: true, message: '관리용 팝업 이름을 입력해주세요.' }]}
                    >
                        <Input placeholder="예: 신규 기능 출시 안내 팝업" />
                    </Form.Item>

                    {/* Conditionally render Title field based on contentType */}
                    {contentType === 'template' && (
                        <Form.Item
                            name="title"
                            label="팝업 제목 (사용자 노출용, 선택 사항)"
                        >
                            <Input placeholder="예: 놓치면 후회할 BIG SALE!" />
                        </Form.Item>
                    )}

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
                            <Select placeholder="팝업 템플릿 선택" onChange={handleTemplateChange}>
                                {/* Map over contextTemplates for options */}
                                {contextTemplates.map(tpl => (
                                     <Option key={tpl.id} value={tpl.id}>{tpl.name}</Option>
                                 ))}
                             </Select>
                         </Form.Item>
                     )}

                    {/* Dynamically generated template variable inputs */}
                    {contentType === 'template' && selectedTemplateDetails?.variables?.length > 0 && (
                         <Card size="small" title="템플릿 변수 입력" style={{ marginBottom: '16px' }}>
                            {selectedTemplateDetails.variables.map(variable => (
                                <Form.Item
                                    key={variable.key}
                                    name={['templateVariables', variable.key]} // Store variables under templateVariables object
                                    label={`${variable.label} (${variable.key})`}
                                    rules={[{ required: true, message: `${variable.label} 값을 입력해주세요.` }]}
                                    tooltip={`템플릿 내에서 ${variable.key}로 치환될 값입니다.`}
                                >
                                    <Input />
                                </Form.Item>
                            ))}
                        </Card>
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
                    </Row>

                    <Form.Item
                        name="exposurePages"
                        label={<><PushpinOutlined /> 노출 페이지</>}
                        tooltip="팝업을 노출할 페이지를 선택합니다. 특정 페이지만 타겟팅할 수 있습니다."
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="팝업을 노출할 페이지를 선택하세요 (선택하지 않으면 전체 노출)"
                        >
                            {pageList.map(page => (
                                <Option key={page.id} value={page.id}>{page.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Add field for initial priority */}
                    <Form.Item
                        name="priority"
                        label="페이지 내 초기 우선순위"
                        tooltip="팝업이 속한 페이지 내에서의 초기 순서입니다. 숫자가 낮을수록 먼저 노출되며, 추후 노출 설정 화면에서 조정 가능합니다."
                        rules={[{ required: true, type: 'number', min: 1, message: '1 이상의 숫자를 입력해주세요.' }]}
                    >
                        <InputNumber min={1} style={{ width: 120 }} placeholder="예: 1"/>
                    </Form.Item>

                    <Form.Item
                        name="hideOptions"
                        label="다시 보지 않기 옵션"
                        tooltip="사용자에게 '하루 동안 보지 않기', '일주일 동안 보지 않기'와 같은 선택지를 제공합니다."
                    >
                        <Checkbox.Group>
                            <Checkbox value="day">하루 동안 보지 않기</Checkbox>
                            <Checkbox value="week">일주일 동안 보지 않기</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>

                    {/* Add fields for priority, device type targeting, page targeting if needed */}

                    <Form.Item>
                         <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<CheckCircleOutlined />}
                                loading={loading}
                            >
                                팝업 저장
                            </Button>
                             <Button
                                 icon={<EyeOutlined />}
                                 onClick={showPreview}
                             >
                                 미리보기
                             </Button>
                         </Space>
                    </Form.Item>
                </Form>
            </Card>

            {/* Preview Modal - Styled to resemble actual popup */}
            <Modal
                // title="팝업 미리보기" // Removed title
                open={isPreviewModalVisible}
                onCancel={handlePreviewCancel}
                footer={null} // Removed footer
                closable={false} // Removed close button (optional, click outside to close)
                width={previewData?.contentType === 'image' ? 'auto' : 400} // Adjust width based on content, maybe auto for image?
                bodyStyle={{ padding: 0, backgroundColor: 'transparent' }} // Ensure body padding is zero
                styles={{ content: { padding: 0 } }} // Override .ant-modal-content padding
                centered // Center the modal
                maskClosable={true} // Allow closing by clicking the mask
            >
                 {previewData && (
                     // Outer div acts as the popup container
                    <div style={{ textAlign: 'center', padding: 0 /* Explicitly set padding to 0 */ }}>
                         {/* Title is now part of the content, not modal header */}
                        {previewData.title && <Title level={4} style={{ marginBottom: '10px' }}>{previewData.title}</Title>}

                        {previewData.contentType === 'image' && previewData.imageFile && (
                             // Pass linkUrl to RenderImageFile for click handling
                             <RenderImageFile file={previewData.imageFile} linkUrl={previewData.linkUrl} />
                        )}
                        {previewData.contentType === 'image' && !previewData.imageFile && (
                             <Text type="secondary">[이미지 표시 영역 ({previewData.imageUrl || '선택된 이미지 없음'})]</Text>
                         )}

                        {previewData.contentType === 'template' && (
                             <Card size="small" style={{ marginTop: '10px', width: '100%' }}>
                                 <Text strong>템플릿 사용:</Text> {previewData.templateName || '선택된 템플릿 없음'}
                                 <br />
                                 <Text type="secondary">[템플릿 콘텐츠 영역]</Text>
                                 {/* TODO: Optionally render template content preview */}
                             </Card>
                         )}

                         {/* Render processed template content */}
                         {previewData.contentType === 'template' && previewData.processedContent && (
                             <div
                                 // WARNING: Ensure template content and variable values are trusted
                                 // to avoid XSS vulnerabilities.
                                dangerouslySetInnerHTML={{ __html: previewData.processedContent }}
                             />
                         )}
                         {previewData.contentType === 'template' && !previewData.processedContent && (
                              <Text type="secondary">[템플릿 미리보기 영역 (처리된 내용 없음)]</Text>
                         )}

                         {/* Clickable link handling might need reconsideration depending on template structure */}
                     </div>
                 )}
             </Modal>
        </Space>
    );
};

// Helper component to render image from file object and make it clickable
const RenderImageFile = ({ file, linkUrl }) => { // Added linkUrl prop
     const [imageSrc, setImageSrc] = useState(null);

     useEffect(() => {
         if (file instanceof File) {
             const reader = new FileReader();
             reader.onload = (e) => {
                 setImageSrc(e.target.result);
             };
             reader.readAsDataURL(file);
         } else if (file && file.url) { // Handle case where file object has url pre-filled (e.g., from Upload component state)
             setImageSrc(file.url);
         }
         return () => {
            // Cleanup if needed
         }
     }, [file]);

     if (!imageSrc) {
        return <Text type="secondary">이미지 로딩 중...</Text>;
    }

     const imgElement = <img src={imageSrc} alt="팝업 이미지 미리보기" style={{ maxWidth: '100%', maxHeight: '50vh', display: 'block' /* Ensure img is block for link */ }} />;

     // Wrap image with link if linkUrl exists
    if (linkUrl) {
         return (
             <a href={linkUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); message.info(`Link clicked: ${linkUrl} (Preview Only)`); /* Prevent actual navigation in preview? Or allow? Let's allow for now */ }}>
                 {imgElement}
             </a>
         );
     } else {
         return imgElement; // Return just the image if no link
     }
 };

export default PopupCreation;
