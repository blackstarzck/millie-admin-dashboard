import {
  CalendarOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  LinkOutlined,
  PlusOutlined,
  PushpinOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Typography,
  Upload
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Option, OptGroup } = Select;
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

// 계층 구조로 페이지 목록 정의
const pageList = [
    { id: 'platform_main', name: '메인', category: '기본' },
    { id: 'search_result', name: '검색 결과', category: '기본' },
    { id: 'book_detail', name: '도서 상세', category: '기본' },
    { id: 'viewer', name: '뷰어', category: '기본' },
    { id: 'my_library', name: '내 서재', category: '기본' },
    { id: 'category_best', name: '카테고리/베스트', category: '기본' },
    { id: 'user_profile', name: '사용자 프로필', category: '기본' },
    { id: 'subscription_info', name: '구독 정보', category: '기본' },
    // 이벤트 계층 구조
    { id: 'event_detail_1', name: '이벤트#1', category: '이벤트' },
    { id: 'event_detail_2', name: '이벤트#2', category: '이벤트' },
    { id: 'event_detail_3', name: '이벤트#3', category: '이벤트' },
    { id: 'event_detail_4', name: '이벤트#4', category: '이벤트' },
    { id: 'event_detail_5', name: '이벤트#5', category: '이벤트' },
];

// 카테고리별로 그룹화
const groupedPageList = pageList.reduce((acc, page) => {
    const category = page.category || '기타';
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(page);
    return acc;
}, {});

// 페이지별 팝업 수를 계산하는 함수 (더미 데이터 기반)
// 실제로는 API에서 가져와야 하지만, 현재는 더미 데이터 사용
const getPopupCountForPage = (pageId) => {
    // 더미 데이터에서 해당 페이지의 팝업 수 계산
    // 실제로는 ExposureSettings.js의 generateInitialPopups와 동일한 데이터를 사용해야 함
    // 여기서는 간단히 더미 카운트 반환 (실제 구현 시 API 호출 필요)
    const dummyCounts = {
        'platform_main': 4,
        'search_result': 0,
        'book_detail': 0,
        'viewer': 0,
        'my_library': 1,
        'category_best': 0,
        'user_profile': 0,
        'subscription_info': 0,
        'event_detail_1': 1,
        'event_detail_2': 1,
        'event_detail_3': 1,
        'event_detail_4': 1,
        'event_detail_5': 1,
    };
    return dummyCounts[pageId] || 0;
};

// 이벤트별 기간 정보 정의
const eventPeriods = {
    'event_detail_1': {
        startDate: moment().add(1, 'days').startOf('day').add(9, 'hours'), // 내일 오전 9시
        endDate: moment().add(7, 'days').endOf('day').subtract(1, 'hour'), // 7일 후 오후 11시
    },
    'event_detail_2': {
        startDate: moment().add(3, 'days').startOf('day').add(10, 'hours'), // 3일 후 오전 10시
        endDate: moment().add(10, 'days').endOf('day').subtract(2, 'hours'), // 10일 후 오후 10시
    },
    'event_detail_3': {
        startDate: moment().subtract(1, 'days').startOf('day').add(8, 'hours'), // 어제 오전 8시
        endDate: moment().add(5, 'days').endOf('day').subtract(1, 'hour'), // 5일 후 오후 11시
    },
    'event_detail_4': {
        startDate: moment().startOf('day').add(12, 'hours'), // 오늘 정오
        endDate: moment().add(3, 'days').endOf('day').subtract(3, 'hours'), // 3일 후 오후 9시
    },
    'event_detail_5': {
        startDate: moment().add(5, 'days').startOf('day').add(14, 'hours'), // 5일 후 오후 2시
        endDate: moment().add(12, 'days').endOf('day').subtract(1, 'hour'), // 12일 후 오후 11시
    },
};

// --- Component ---
// Renamed PopupCreate to PopupCreation to match App.js
const PopupCreation = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [popupId, setPopupId] = useState(null); // 팝업 ID (수정 모드일 때 사용)
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [createdPopupId, setCreatedPopupId] = useState(null);

    const onFinish = async (values) => {
        setLoading(true);
        message.loading({ content: '팝업 저장 중...', key: 'popupSave' });

        const formData = { ...values };
        formData.contentType = 'image'; // 항상 이미지 타입
        formData.status = true; // Always set status to active

        // 팝업 ID 생성 또는 유지
        if (!popupId) {
            // 새 팝업 생성 시 ID 자동 생성 (실제로는 서버에서 생성)
            formData.id = `pop${Date.now().toString().slice(-6)}`;
            setPopupId(formData.id);
        } else {
            formData.id = popupId;
        }

        // 등록일 설정 (새 팝업일 때만)
        if (!formData.creationDate) {
            formData.creationDate = new Date().toISOString().split('T')[0];
        }

        // Handle date range
        if (values.exposurePeriod) {
            formData.startDate = values.exposurePeriod[0].toISOString();
            formData.endDate = values.exposurePeriod[1].toISOString();
            delete formData.exposurePeriod;
        }

        // Handle image upload
        if (imageList.length > 0) {
            formData.imageUrl = imageList[0].name; // Example: Store image name/url
            // TODO: Implement actual image upload logic
        } else {
            formData.imageUrl = null;
        }
         delete formData.imageUpload; // Remove upload field from final data

        // exposurePages는 단일 값 (하나의 페이지만 선택 가능)
        if (values.exposurePages) {
            formData.exposurePages = [values.exposurePages]; // 배열로 변환
        } else {
            formData.exposurePages = [];
        }

        // hideOptions는 단일 값 (라디오 버튼)
        formData.hideOptions = values.hideOptions || null;

        console.log('Popup Form Data:', formData);

        // TODO: Replace with actual API call to create/update popup
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success({ content: '팝업이 성공적으로 저장되었습니다!', key: 'popupSave' });

            // 생성된 팝업 ID 저장
            setCreatedPopupId(formData.id);

            // 성공 모달 표시
            setIsSuccessModalVisible(true);

            // form.resetFields();
            // setImageList([]);
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
                previewContent.contentType = 'image';

                 // Handle image preview data (use file object if available)
                 if (imageList.length > 0) {
                     previewContent.imageFile = imageList[0].originFileObj || imageList[0]; // Use originFileObj for FileReader
                     previewContent.imageUrl = imageList[0].name; // Fallback/display name
                 }

                 console.log("Preview Data:", previewContent);
                setPreviewData(previewContent);
                setIsPreviewModalVisible(true);
            })
            .catch(info => {
                console.log('Validate Failed for Preview:', info);
                message.warning('미리보기를 위해 필요한 항목(예: 이미지)을 입력/선택해주세요.');
            });
    };

    const handlePreviewCancel = () => {
        setIsPreviewModalVisible(false);
        setPreviewData(null);
    };

    const handleGoToSettings = () => {
        // 노출 설정 페이지로 이동하면서 생성된 팝업 ID와 페이지 ID를 전달
        const formValues = form.getFieldsValue();
        const pageId = formValues.exposurePages || null;
        const queryParams = new URLSearchParams();
        if (createdPopupId) {
            queryParams.append('popupId', createdPopupId);
        }
        if (pageId) {
            queryParams.append('pageId', pageId);
        }
        navigate(`/popups/settings?${queryParams.toString()}`);
        setIsSuccessModalVisible(false);
        form.resetFields();
        setImageList([]);
        setPopupId(null);
        setCreatedPopupId(null);
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><PlusOutlined /> 팝업 생성</Title>
            <Text>새로운 팝업을 생성하고 노출 설정을 관리합니다.</Text>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    name="popup_creation_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        frequencyType: 'once_per_session',
                        status: 'active',
                        hideOptions: 'day', // 기본값: 하루 동안 보지 않기
                        creationDate: new Date().toISOString().split('T')[0], // 등록일 초기값
                    }}
                >
                    {/* 팝업 ID 및 등록일 표시 (읽기 전용) */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12}>
                            <Form.Item label="팝업 ID">
                                <Input
                                    value={popupId || '저장 시 자동 생성'}
                                    disabled
                                    placeholder="저장 시 자동 생성됩니다"
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item name="creationDate" label="등록일">
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="name"
                        label="팝업 이름 (관리용)"
                        rules={[{ required: true, message: '관리용 팝업 이름을 입력해주세요.' }]}
                    >
                        <Input placeholder="예: 신규 기능 출시 안내 팝업" />
                    </Form.Item>

                    <Form.Item
                        name="exposurePages"
                        label={<><PushpinOutlined /> 노출 페이지</>}
                        tooltip="팝업을 노출할 페이지를 선택합니다. 하나의 페이지만 선택할 수 있으며, 한 페이지당 최대 4개의 팝업만 설정할 수 있습니다. 이벤트 페이지를 선택하면 해당 이벤트 기간이 자동으로 설정됩니다."
                    >
                        <Select
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="팝업을 노출할 페이지를 선택하세요 (선택하지 않으면 전체 노출)"
                            onChange={(selectedPage) => {
                                // 선택된 페이지가 이벤트 페이지인지 확인
                                if (selectedPage && selectedPage.startsWith('event_detail_')) {
                                    const eventPeriod = eventPeriods[selectedPage];

                                    if (eventPeriod) {
                                        // 노출 기간을 이벤트 기간으로 자동 설정
                                        form.setFieldsValue({
                                            exposurePeriod: [
                                                eventPeriod.startDate,
                                                eventPeriod.endDate
                                            ]
                                        });
                                    }
                                }
                            }}
                        >
                            {Object.entries(groupedPageList).map(([category, pages]) => (
                                <OptGroup key={category} label={category}>
                                    {pages.map(page => {
                                        // 페이지별 팝업 수 계산 (더미 데이터 기반)
                                        const popupCount = getPopupCountForPage(page.id);
                                        const isMaxReached = popupCount >= 4;
                                        return (
                                            <Option
                                                key={page.id}
                                                value={page.id}
                                                disabled={isMaxReached}
                                                title={isMaxReached ? '이 페이지에는 이미 최대 4개의 팝업이 설정되어 있습니다.' : ''}
                                            >
                                                {page.name}
                                                {isMaxReached ? (
                                                    <span style={{ color: '#ff4d4f', marginLeft: '8px' }}>(최대 도달)</span>
                                                ) : (
                                                    popupCount > 0 && <span style={{ color: 'rgba(24, 144, 255, 0.65)' }}>({popupCount}개)</span>
                                                )}
                                            </Option>
                                        );
                                    })}
                                </OptGroup>
                            ))}
                        </Select>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                            ℹ️ 한 페이지당 최대 4개의 팝업만 설정할 수 있습니다. 이미 4개의 팝업이 있는 페이지는 선택할 수 없습니다.
                        </Text>
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
                        name="imageUpload"
                        label="팝업 이미지"
                        rules={[{ required: true, message: '팝업 이미지를 업로드해주세요.' }]}
                    >
                        <Upload
                            listType="picture"
                            fileList={imageList}
                            beforeUpload={beforeUpload}
                            onChange={handleUploadChange}
                            maxCount={1}
                            onRemove={() => {
                                setImageList([]);
                                return true;
                            }}
                        >
                            {imageList.length === 0 && (
                                <Button icon={<UploadOutlined />}>이미지 업로드 (JPG/PNG, max 5MB)</Button>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="linkUrl"
                        label={<><LinkOutlined /> 연결 URL (클릭 시 이동)</>}
                        rules={[{ type: 'url', message: '유효한 URL을 입력해주세요.' }]}                    >
                        <Input placeholder="https://..." />
                    </Form.Item>

                    <Form.Item
                        name="hideOptions"
                        label="다시 보지 않기 옵션"
                        tooltip="사용자에게 '하루 동안 보지 않기', '일주일 동안 보지 않기'와 같은 선택지를 제공합니다."
                    >
                        <Radio.Group>
                            <Radio value="day">하루 동안 보지 않기</Radio>
                            <Radio value="week">일주일 동안 보지 않기</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {/* Add fields for priority, device type targeting, page targeting if needed */}

                    <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '16px' }}>
                        ℹ️ 팝업 생성 시 노출 상태는 기본적으로 숨김이고, 팝업 노출 순서 또한 노출 설정 페이지에서 할 수 있습니다.
                    </Text>

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
                open={isPreviewModalVisible}
                onCancel={handlePreviewCancel}
                footer={null}
                closable={false}
                width="auto"
                bodyStyle={{ padding: 0, backgroundColor: 'transparent' }}
                styles={{ content: { padding: 0 } }}
                centered
                maskClosable={true}
            >
                 {previewData && (
                    <div style={{ textAlign: 'center', padding: 0 }}>
                        {previewData.imageFile && (
                             <RenderImageFile file={previewData.imageFile} linkUrl={previewData.linkUrl} />
                        )}
                        {!previewData.imageFile && (
                             <Text type="secondary">[이미지 표시 영역 ({previewData.imageUrl || '선택된 이미지 없음'})]</Text>
                         )}
                     </div>
                 )}
             </Modal>

            {/* 팝업 저장 성공 모달 */}
            <Modal
                title="팝업 생성 완료"
                open={isSuccessModalVisible}
                closable={false}
                maskClosable={false}
                footer={null}
                width={500}
                centered
            >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Paragraph>
                        팝업이 성공적으로 생성되었습니다.
                    </Paragraph>
                    <Paragraph type="secondary" style={{ fontSize: '13px' }}>
                        팝업 노출, 사용자에게 노출 상태 변경, 순서 설정은 노출 설정 페이지에서 할 수 있습니다.
                    </Paragraph>
                    <div style={{ textAlign: 'right', marginTop: '24px' }}>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleGoToSettings}
                        >
                            생성된 팝업 보러가기
                        </Button>
                    </div>
                </Space>
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
