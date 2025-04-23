import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    Typography,
    Space,
    Card,
    message,
    Tooltip,
    InputNumber
} from 'antd';
import { LinkOutlined, CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const UrlGeneration = () => {
    const [form] = Form.useForm();
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // Sample event list (replace with actual data/API)
    const events = [
        { id: 'evt001', name: '여름맞이 특별 할인' },
        { id: 'evt002', name: '신규 가입자 웰컴 이벤트' },
        { id: 'evt003', name: '친구 추천 이벤트' },
    ];

    const onFinish = async (values) => {
        setLoading(true);
        setGeneratedUrl('');
        console.log('URL Generation Params:', values);

        // --- URL Generation Logic --- 
        // This is highly dependent on your tracking setup (UTM params, custom params, etc.)
        // Example using UTM parameters:
        let baseUrl = values.baseUrl;
        const params = new URLSearchParams();
        if (values.source) params.set('utm_source', values.source);
        if (values.medium) params.set('utm_medium', values.medium);
        if (values.campaign) params.set('utm_campaign', values.campaign);
        if (values.term) params.set('utm_term', values.term);
        if (values.content) params.set('utm_content', values.content);
        if (values.eventId) params.set('event_id', values.eventId); // Custom parameter

        // Ensure baseUrl ends with a separator if it doesn't have query params yet
         if (!baseUrl.includes('?') && params.toString()) {
             baseUrl += '?';
         } else if (baseUrl.includes('?') && !baseUrl.endsWith('?') && !baseUrl.endsWith('&') && params.toString()) {
            baseUrl += '&';
        }

        const finalUrl = baseUrl + params.toString();

        // Simulate potential API call or processing delay
        await new Promise(resolve => setTimeout(resolve, 300));

        setGeneratedUrl(finalUrl);
        setLoading(false);
        message.success('추적 URL이 생성되었습니다.');
    };

    const handleCopy = () => {
        if (generatedUrl) {
            copy(generatedUrl);
            message.success('URL이 클립보드에 복사되었습니다!');
        } else {
            message.warning('먼저 URL을 생성해주세요.');
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><LinkOutlined /> 이벤트 URL 생성</Title>
            <Text>마케팅 캠페인 추적 등을 위한 이벤트 URL을 생성합니다 (예: UTM 파라미터 추가).</Text>

            <Card title="URL 생성 설정">
                <Form
                    form={form}
                    layout="vertical"
                    name="url_generation_form"
                    onFinish={onFinish}
                    initialValues={{ source: 'event_promotion' }} // Default source example
                >
                    <Form.Item
                        name="baseUrl"
                        label="기본 URL"
                        rules={[
                            { required: true, message: '연결할 기본 URL을 입력해주세요.' },
                            { type: 'url', message: '유효한 URL 형식이 아닙니다.' },
                        ]}
                    >
                        <Input placeholder="https://yourdomain.com/landing-page" />
                    </Form.Item>

                    <Form.Item
                        name="eventId"
                        label="연결 이벤트 (선택 사항)"
                    >
                        <Select placeholder="URL과 연결할 이벤트 선택" allowClear>
                            {events.map(evt => (
                                <Option key={evt.id} value={evt.id}>{evt.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Title level={4} style={{marginTop: '20px'}}>UTM 파라미터 (선택 사항)</Title>
                    <Text type="secondary" style={{display: 'block', marginBottom: '15px'}}>캠페인 성과 추적을 위해 UTM 파라미터를 설정합니다.</Text>

                    <Form.Item
                        name="source"
                        label={<span>utm_source <Tooltip title="트래픽 소스를 식별합니다 (예: google, facebook, event_promotion)"><QuestionCircleOutlined style={{marginLeft: 4}} /></Tooltip></span>}
                        rules={[{ required: true, message: 'utm_source를 입력해주세요.' }]}
                    >
                        <Input placeholder="예: newsletter, facebook_ad" />
                    </Form.Item>

                    <Form.Item
                        name="medium"
                        label={<span>utm_medium <Tooltip title="마케팅 매체를 식별합니다 (예: cpc, email, social)"><QuestionCircleOutlined style={{marginLeft: 4}} /></Tooltip></span>}
                    >
                        <Input placeholder="예: email, banner, social_post" />
                    </Form.Item>

                    <Form.Item
                        name="campaign"
                        label={<span>utm_campaign <Tooltip title="캠페인 이름을 식별합니다 (예: summer_sale_2024)"><QuestionCircleOutlined style={{marginLeft: 4}} /></Tooltip></span>}
                    >
                        <Input placeholder="예: new_user_welcome, black_friday" />
                    </Form.Item>

                    <Form.Item
                        name="term"
                        label={<span>utm_term <Tooltip title="검색 광고 키워드를 식별합니다 (주로 유료 검색용)"><QuestionCircleOutlined style={{marginLeft: 4}} /></Tooltip></span>}
                    >
                        <Input placeholder="예: react_admin_dashboard" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label={<span>utm_content <Tooltip title="A/B 테스트 등 동일 광고 내 다른 콘텐츠를 구별합니다"><QuestionCircleOutlined style={{marginLeft: 4}} /></Tooltip></span>}
                    >
                        <Input placeholder="예: button_v1, image_banner_blue" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<LinkOutlined />}
                            loading={loading}
                        >
                            URL 생성
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {generatedUrl && (
                <Card title="생성된 URL" size="small">
                    <Paragraph copyable={{ text: generatedUrl, onCopy: handleCopy }}>
                         <Text code style={{wordBreak: 'break-all'}}>{generatedUrl}</Text>
                     </Paragraph>
                    {/* <Button icon={<CopyOutlined />} onClick={handleCopy} style={{marginTop: 8}}>클립보드에 복사</Button> */}
                 </Card>
             )}
        </Space>
    );
};

export default UrlGeneration; 