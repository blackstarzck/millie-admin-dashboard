import React, { useState, useEffect } from 'react';
import {
    Typography,
    Form,
    Input,
    Button,
    Space,
    Card,
    Radio,
    message
} from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// 가상 데이터 로더 (실제로는 API 호출)
const fetchPolicyData = (policyType) => {
    console.log(`Fetching content for policy: ${policyType}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            if (policyType === 'terms_of_service') {
                resolve({
                    content: '제 1 조 (목적)\n이 약관은 주식회사 밀리(이하 \'회사\')가 제공하는 밀리의 서재 관련 제반 서비스의 이용과 관련하여 회사와 회원과의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.\n\n제 2 조 (정의)\n...',
                    version: '1.5',
                    lastUpdated: '2024-07-01'
                });
            } else if (policyType === 'privacy_policy') {
                resolve({
                    content: '개인정보 처리방침\n\n1. 개인정보의 처리 목적\n회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.\n...',
                    version: '2.1',
                    lastUpdated: '2024-06-15'
                });
            } else {
                resolve({ content: '', version: '1.0', lastUpdated: '-'});
            }
        }, 500); // Simulate network delay
    });
};

const ServicePolicy = () => {
  const [form] = Form.useForm();
  const [selectedPolicy, setSelectedPolicy] = useState('terms_of_service');
  const [currentVersion, setCurrentVersion] = useState('-');
  const [lastUpdated, setLastUpdated] = useState('-');
  const [isLoading, setIsLoading] = useState(false);

  // 선택된 정책 변경 시 데이터 로드 및 폼 리셋
  useEffect(() => {
    setIsLoading(true);
    fetchPolicyData(selectedPolicy).then(data => {
        form.setFieldsValue({
            policyContent: data.content,
            newVersion: data.version // 현재 버전을 새 버전 입력 필드의 기본값으로 설정
        });
        setCurrentVersion(data.version);
        setLastUpdated(data.lastUpdated);
        setIsLoading(false);
    });
  }, [selectedPolicy, form]);

  const handlePolicyTypeChange = (e) => {
      setSelectedPolicy(e.target.value);
  };

  const handleSavePolicy = (values) => {
    const { policyContent, newVersion } = values;
    // 실제 정책 내용 및 버전 저장 로직 (API 호출)
    console.log(`Saving policy ${selectedPolicy} version ${newVersion || currentVersion}:`, policyContent);
    // 저장 API 호출 후 성공 시
    message.success(`${selectedPolicy === 'terms_of_service' ? '이용약관' : '개인정보 처리방침'}이(가) 저장되었습니다.`);
    // API 응답에서 새 버전과 최종 수정일 받아와서 상태 업데이트
    // 예시: setCurrentVersion(apiResponse.version); setLastUpdated(apiResponse.lastUpdated);
    const updatedVersion = newVersion || currentVersion;
    setCurrentVersion(updatedVersion); // 임시로 입력값 또는 현재 버전 사용
    setLastUpdated(new Date().toISOString().split('T')[0]);
    // form.setFieldsValue({ newVersion: updatedVersion }); // 저장 후 버전 필드 업데이트
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>서비스 정책 관리</Title>

      <Card>
          <Radio.Group onChange={handlePolicyTypeChange} value={selectedPolicy} style={{ marginBottom: 16 }}>
            <Radio.Button value="terms_of_service">이용약관</Radio.Button>
            <Radio.Button value="privacy_policy">개인정보 처리방침</Radio.Button>
            {/* 다른 정책 추가 가능 */}
          </Radio.Group>

          <Paragraph>
              <Text strong>현재 버전:</Text> {currentVersion} (최종 수정일: {lastUpdated})
              {/* TODO: 버전 히스토리 보기 기능 */} 
              {/* <Button type="link" size="small">버전 히스토리</Button> */} 
          </Paragraph>

          <Form
             form={form}
             layout="vertical"
             onFinish={handleSavePolicy}
             disabled={isLoading} // 로딩 중 폼 비활성화
          >
              <Form.Item
                  name="policyContent"
                  label="정책 내용"
                  rules={[{ required: true, message: '정책 내용을 입력해주세요.' }]}
              >
                  <TextArea 
                      rows={20} 
                      placeholder="여기에 정책 내용을 입력하세요..." 
                      disabled={isLoading}
                  />
              </Form.Item>

              <Form.Item
                  name="newVersion"
                  label="저장할 버전 번호"
                  tooltip="변경 사항 저장 시 적용될 버전 번호입니다. 기존 버전 번호로 저장할 경우 비워두세요."
                  rules={[{ required: true, message: '저장할 버전을 입력해주세요.' }]}
                  style={{ maxWidth: '200px' }} // 너비 조절
              >
                 <Input placeholder={`예: ${currentVersion}`} disabled={isLoading}/>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  {selectedPolicy === 'terms_of_service' ? '이용약관' : '개인정보 처리방침'} 저장 (v{form.getFieldValue('newVersion') || currentVersion})
                </Button>
              </Form.Item>
          </Form>
      </Card>
    </Space>
  );
};

export default ServicePolicy; 