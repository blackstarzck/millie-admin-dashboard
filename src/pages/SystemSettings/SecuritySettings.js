import React, { useState, useEffect } from 'react';
import {
    Typography,
    Form,
    Select,
    InputNumber,
    Switch,
    Input,
    Button,
    Space,
    Card,
    Divider,
    message
} from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const SecuritySettings = () => {
  const [form] = Form.useForm();
  // 예시 설정값 (실제로는 API 등에서 로드)
  const initialSettings = {
    passwordPolicy: 'medium',
    passwordExpiryDays: 90,
    mfaEnabled: true,
    allowedIPs: '192.168.1.0/24, 10.0.0.1',
    sessionTimeoutMinutes: 60,
  };

  // 실제로는 useEffect 등을 사용하여 초기 데이터 로드
  useEffect(() => {
      form.setFieldsValue(initialSettings);
  }, [form]);


  const handleSave = (values) => {
    // 실제 설정 저장 로직 (API 호출)
    console.log('Saving security settings:', values);
    message.success('보안 설정이 저장되었습니다.');
    // 저장 후 상태 업데이트는 API 응답에 따라 처리
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>보안 설정</Title>

      <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={initialSettings} // 초기값 설정
      >
        <Card title="로그인 및 비밀번호 정책">
            <Form.Item
                name="passwordPolicy"
                label="비밀번호 복잡도 요구 수준"
                rules={[{ required: true, message: '정책을 선택해주세요.' }]}
            >
                <Select placeholder="정책 선택">
                    <Option value="none">없음 (권장하지 않음)</Option>
                    <Option value="medium">중간 (영문, 숫자 조합)</Option>
                    <Option value="strong">강함 (영문, 숫자, 특수문자 조합, 길이 제한)</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="passwordExpiryDays"
                label="비밀번호 만료 기간 (일)"
                tooltip="0일 경우 만료 없음"
                rules={[{ required: true, message: '만료 기간을 입력해주세요.' }, { type: 'number', min: 0, message: '0 이상의 숫자를 입력하세요.' }]}
            >
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
        </Card>

        <Card title="2단계 인증 (MFA)" style={{ marginTop: '1rem' }}>
             <Form.Item
                 name="mfaEnabled"
                 label="모든 관리자에게 2단계 인증 강제"
                 valuePropName="checked"
             >
                 <Switch />
             </Form.Item>
             {/* MFA 관련 추가 설정 UI 영역 */}
             <Text type="secondary">2단계 인증 활성화 시, 모든 관리자는 로그인 시 추가 인증 절차를 거치게 됩니다.</Text>
        </Card>

        <Card title="접근 제어" style={{ marginTop: '1rem' }}>
             <Form.Item
                 name="allowedIPs"
                 label="관리자 페이지 접근 허용 IP"
                 tooltip="쉼표로 구분하여 여러 개 입력 가능 (예: 192.168.1.1, 10.0.0.0/16). 비워두면 모든 IP 허용."
             >
                 <Input.TextArea 
                     rows={3} 
                     placeholder="예: 192.168.1.1, 10.0.0.0/16" 
                 />
             </Form.Item>
        </Card>

         <Card title="세션 관리" style={{ marginTop: '1rem' }}>
             <Form.Item
                 name="sessionTimeoutMinutes"
                 label="자동 로그아웃 시간 (분)"
                 tooltip="0일 경우 자동 로그아웃 없음"
                 rules={[{ required: true, message: '로그아웃 시간을 입력해주세요.' }, { type: 'number', min: 0, message: '0 이상의 숫자를 입력하세요.' }]}
             >
                 <InputNumber min={0} style={{ width: '100%' }} />
             </Form.Item>
         </Card>

        <Form.Item style={{ marginTop: '2rem' }}>
          <Button type="primary" htmlType="submit">설정 저장</Button>
        </Form.Item>
      </Form>
    </Space>
  );
};

export default SecuritySettings; 