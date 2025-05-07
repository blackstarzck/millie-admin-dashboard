import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Typography,
    Space, // Space는 Card 밖 최상위 요소로 사용했었으므로, Form 내부에서는 불필요할 수 있음
    message,
    Tooltip,
    Divider,
    // Select, InputNumber 등은 eventId 선택이 사라지므로 제거될 수 있음
} from 'antd';
import { LinkOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// import copy from 'copy-to-clipboard'; // Paragraph의 copyable로 대체됨

const { Text, Paragraph } = Typography; // Title은 Modal 제목으로 대체
// const { Option } = Select; // Select가 사라지므로 Option도 제거

// 이 컴포넌트는 Modal 내부에 들어갈 내용입니다.
const UrlGenerationForm = ({ eventData, form, onSetLoading }) => { // eventData prop (id, title 등 포함), form, onSetLoading props 추가
    const [rawGeneratedUrl, setRawGeneratedUrl] = useState('');
    const [bitlyGeneratedUrl, setBitlyGeneratedUrl] = useState('');

    useEffect(() => {
        if (eventData && 
            (eventData.utm_source || 
             eventData.utm_medium || 
             eventData.utm_campaign || 
             eventData.utm_term || 
             eventData.utm_content)
        ) {
            // "수정" 모드로 간주하고, 기존 UTM 값으로 원본 URL 재구성
            let baseUrl = eventData.url || '';
            const params = new URLSearchParams();
            if (eventData.utm_source) params.set('utm_source', eventData.utm_source);
            if (eventData.utm_medium) params.set('utm_medium', eventData.utm_medium);
            if (eventData.utm_campaign) params.set('utm_campaign', eventData.utm_campaign);
            if (eventData.utm_term) params.set('utm_term', eventData.utm_term);
            if (eventData.utm_content) params.set('utm_content', eventData.utm_content);
            
            // event_id는 onFinish에서 추가되므로 여기서는 제외하거나, 필요시 eventData.eventId 사용
            // params.set('event_id', eventData.eventId);

            if (baseUrl && !baseUrl.includes('?') && params.toString()) {
                baseUrl += '?';
            } else if (baseUrl && baseUrl.includes('?') && !baseUrl.endsWith('?') && !baseUrl.endsWith('&') && params.toString()) {
                baseUrl += '&';
            }
            const finalUrl = baseUrl + params.toString();
            setRawGeneratedUrl(finalUrl);
            setBitlyGeneratedUrl(''); // 단축 URL은 수정 시 새로 생성하므로 초기화
        } else {
            // "생성" 모드이거나 UTM 값이 없는 경우, 기존 표시 URL 초기화
            setRawGeneratedUrl('');
            setBitlyGeneratedUrl('');
        }
    }, [eventData]); // eventData가 변경될 때마다 실행

    const onFinish = async (values) => {
        onSetLoading(true); // 부모의 로딩 상태 업데이트
        setRawGeneratedUrl('');
        setBitlyGeneratedUrl('');
        
        // baseUrl을 다시 values에서 직접 가져오도록 수정
        // const baseUrlFromField = form.getFieldValue('baseUrl'); 
        console.log('URL Generation Params for event:', eventData, 'Form Values:', values);

        let baseUrl = values.baseUrl; // 수정된 부분: 다시 values에서 가져옴
        const params = new URLSearchParams();
        if (values.source) params.set('utm_source', values.source);
        if (values.medium) params.set('utm_medium', values.medium);
        if (values.campaign) params.set('utm_campaign', values.campaign);
        if (values.term) params.set('utm_term', values.term);
        if (values.content) params.set('utm_content', values.content);
        
        // event_id는 prop으로 받은 eventData.eventId 사용 (onFinish 내에서는 항상 최신 eventData를 참조)
        if (eventData && eventData.eventId) {
            params.set('event_id', eventData.eventId);
        }

        if (!baseUrl.includes('?') && params.toString()) {
            baseUrl += '?';
        } else if (baseUrl.includes('?') && !baseUrl.endsWith('?') && !baseUrl.endsWith('&') && params.toString()) {
            baseUrl += '&';
        }
        const finalUrl = baseUrl + params.toString();
        setRawGeneratedUrl(finalUrl);

        const useBitly = true;
        if (useBitly) {
            try {
                const BITLY_ACCESS_TOKEN = 'ffa71e7f07720a77fca3c61d56d48c22e3ff574f'; // 보안 경고! 실제 운영시 백엔드 처리
                if (BITLY_ACCESS_TOKEN === 'YOUR_BITLY_ACCESS_TOKEN' || !BITLY_ACCESS_TOKEN || BITLY_ACCESS_TOKEN.length < 10) {
                    message.error('Bitly Access Token이 유효하지 않아 단축 URL을 생성할 수 없습니다. 원본 URL만 제공됩니다.');
                } else {
                    console.log("Attempting to shorten URL with Bitly (Frontend Direct - NOT RECOMMENDED FOR PRODUCTION):", finalUrl);
                    const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${BITLY_ACCESS_TOKEN}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ long_url: finalUrl })
                    });
                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.description || `Bitly API 반환 상태 ${response.status}`);
                    }
                    const shortenedData = await response.json();
                    setBitlyGeneratedUrl(shortenedData.link);
                    message.success('원본 URL과 단축 URL(Bitly)이 모두 생성되었습니다.');
                }
            } catch (error) {
                console.error('Bitly URL 단축 실패:', error);
                message.warning(`Bitly URL 단축에 실패했습니다: ${error.message}. 원본 URL만 제공됩니다.`);
                setBitlyGeneratedUrl('');
            }
        }
        onSetLoading(false); // 부모의 로딩 상태 업데이트
    };

    return (
        <Form
            form={form}
            layout="vertical"
            name="url_generation_form_modal"
            onFinish={onFinish}
            initialValues={{ source: 'event_promotion' }} // eventId는 여기서 제거
        >
            <Form.Item
                name="baseUrl"
                label="기본 URL"
                rules={[
                    { required: true, message: '연결할 기본 URL을 입력해주세요.' }, // required 규칙 복원
                    { type: 'url', message: '유효한 URL 형식이 아닙니다.' },
                ]}
            >
                <Input placeholder="https://yourdomain.com/landing-page" disabled />
            </Form.Item>

            {/* "연결 이벤트" Form.Item은 prop으로 eventId를 받으므로 제거 
            eventData.title (또는 name)을 비활성화된 Input 등으로 표시해줄 수 있음 (선택 사항)
            <Form.Item label="선택된 이벤트">
                <Input value={eventData?.title || eventData?.name || 'N/A'} disabled />
            </Form.Item>
            */}

            <Divider />
            
            <Text strong style={{display: 'block', marginTop: '20px'}}>UTM 파라미터 (선택 사항)</Text>
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
            
            <Form.Item label="원본 URL" style={{ marginTop: 20 }}>
                {rawGeneratedUrl ? (
                    <Paragraph copyable={{ text: rawGeneratedUrl }} style={{ marginBottom: 0 }}>
                         <Text code style={{wordBreak: 'break-all'}}>{rawGeneratedUrl}</Text>
                     </Paragraph>
                ) : (
                    <Text type="secondary">- 원본 URL이 여기에 표시됩니다 -</Text>
                )}
            </Form.Item>

            <Form.Item label="단축 URL (Bitly)" style={{ marginTop: 8 }}>
                {bitlyGeneratedUrl ? (
                    <Paragraph copyable={{ text: bitlyGeneratedUrl }} style={{ marginBottom: 0 }}>
                         <Text code style={{wordBreak: 'break-all'}}>{bitlyGeneratedUrl}</Text>
                     </Paragraph>
                ) : (
                    <Text type="secondary">- 단축 URL(Bitly)이 여기에 표시됩니다 (Bitly 연동 성공 시) -</Text>
                )}
            </Form.Item>
        </Form>
    );
};

export default UrlGenerationForm; 