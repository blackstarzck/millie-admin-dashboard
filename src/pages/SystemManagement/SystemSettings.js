import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Switch,
    Button,
    Select,
    Card,
    Space,
    Typography,
    message,
    Spin, // For loading state
    Alert, // For maintenance mode notice
    InputNumber, // For numerical settings
    Divider,
} from 'antd';
import { SaveOutlined, SettingOutlined, ApiOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- Mock API Calls (Replace with actual API calls) ---
const fetchSettings = async () => {
    console.log('Fetching system settings...');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return sample settings
    return {
        maintenanceMode: false,
        maintenanceMessage: '현재 시스템 점검 중입니다. 잠시 후 다시 이용해주세요.',
        defaultItemsPerPage: 20,
        sessionTimeoutMinutes: 60,
        apiKeyGoogleMaps: 'SAMPLE_API_KEY_GMAPS_XYZ123', // Sensitive data - handle carefully
        featureFlagNewDashboard: true,
    };
};

const saveSettings = async (settings) => {
    console.log('Saving system settings:', settings);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate success/failure
    if (Math.random() > 0.1) { // 90% success rate
        return { success: true };
    } else {
        return { success: false, error: 'Failed to save settings due to a server error.' };
    }
};

// --- Component ---
const SystemSettings = () => {
    const [form] = Form.useForm();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Fetch initial settings on component mount
    useEffect(() => {
        setLoading(true);
        fetchSettings()
            .then(data => {
                setSettings(data);
                form.setFieldsValue(data);
            })
            .catch(error => {
                message.error('시스템 설정을 불러오는 데 실패했습니다.');
                console.error('Fetch settings error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [form]); // Include form in dependency array as it's used in .then()

    // Handle form submission
    const onFinish = async (values) => {
        setSaving(true);
        message.loading({ content: '설정을 저장하는 중...', key: 'saveSettings' });
        try {
            const result = await saveSettings(values);
            if (result.success) {
                setSettings(values); // Update local state on success
                message.success({ content: '시스템 설정이 성공적으로 저장되었습니다.', key: 'saveSettings', duration: 2 });
            } else {
                message.error({ content: `설정 저장 실패: ${result.error || '알 수 없는 오류'}`, key: 'saveSettings', duration: 4 });
            }
        } catch (error) {
            message.error({ content: `설정 저장 중 오류 발생: ${error.message}`, key: 'saveSettings', duration: 4 });
            console.error('Save settings error:', error);
        }
        setSaving(false);
    };

    if (loading) {
        return <Spin tip="설정 로딩 중..." style={{ display: 'block', marginTop: '50px' }} />;
    }

    if (!settings) {
        return <Alert message="설정 데이터를 불러올 수 없습니다." type="error" showIcon />;
    }

    // Get current maintenance mode status for display
    const isMaintenanceMode = form.getFieldValue('maintenanceMode');

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>시스템 설정</Title>
            <Text type="secondary">시스템 전반의 동작 및 기본 설정을 관리합니다.</Text>

            {isMaintenanceMode && (
                <Alert
                    message="현재 시스템이 점검 모드입니다."
                    description={form.getFieldValue('maintenanceMessage')}
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                 />
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={settings} // Set initial values after fetch
            >
                {/* Service Status Card */}
                <Card title={<><SettingOutlined /> 서비스 상태 관리</>} style={{ marginBottom: 24 }}>
                    <Form.Item
                        name="maintenanceMode"
                        label="서비스 점검 모드 활성화"
                        tooltip="활성화 시 사용자 접근이 차단되고 점검 안내 메시지가 표시됩니다."
                        valuePropName="checked"
                     >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="maintenanceMessage"
                        label="점검 안내 메시지"
                        rules={[{ required: form.getFieldValue('maintenanceMode'), message: '점검 모드 활성화 시 안내 메시지는 필수입니다.' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="예: 시스템 안정화를 위한 정기 점검 중입니다. (예상 완료 시간: 15:00)"
                            disabled={!form.getFieldValue('maintenanceMode')}
                         />
                    </Form.Item>
                </Card>

                {/* General Settings Card */}
                <Card title={<><SettingOutlined /> 일반 설정</>} style={{ marginBottom: 24 }}>
                     <Form.Item
                        name="defaultItemsPerPage"
                        label="목록 기본 표시 개수"
                        tooltip="각 관리 페이지의 테이블에서 한 페이지에 보여줄 기본 항목 수입니다."
                         rules={[{ required: true, type: 'number', min: 5, max: 100, message: '5에서 100 사이의 숫자를 입력하세요.'}]}
                    >
                        <InputNumber min={5} max={100} style={{ width: '100px' }} />
                    </Form.Item>

                    <Form.Item
                        name="sessionTimeoutMinutes"
                        label="관리자 세션 유지 시간 (분)"
                        tooltip="관리자가 로그인 후 활동이 없을 경우 자동 로그아웃되는 시간입니다."
                         rules={[{ required: true, type: 'number', min: 5, message: '최소 5분 이상이어야 합니다.'}]}
                    >
                        <InputNumber min={5} style={{ width: '100px' }} addonAfter="분" />
                    </Form.Item>
                     {/* Add other general settings here */}
                     <Form.Item
                         name="featureFlagNewDashboard"
                         label="새로운 대시보드 기능 활성화 (베타)"
                         valuePropName="checked"
                         tooltip="활성화 시 새로운 디자인의 대시보드 기능을 미리 사용해볼 수 있습니다."
                     >
                         <Switch />
                     </Form.Item>
                </Card>

                {/* API Keys / Integrations Card */}
                <Card title={<><ApiOutlined /> 외부 연동 설정</>} style={{ marginBottom: 24 }}>
                     <Form.Item
                        name="apiKeyGoogleMaps"
                        label="Google Maps API 키"
                        tooltip="지도 관련 기능 사용 시 필요한 API 키입니다. (변경 시 즉시 반영되지 않을 수 있습니다)"
                        // Add validation rule if needed
                    >
                         <Input.Password placeholder="API 키 입력" />
                     </Form.Item>
                     {/* Add other API key settings here (e.g., SMS, Email service keys) */}
                 </Card>

                <Divider />

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SaveOutlined />}
                        loading={saving}
                        disabled={saving}
                    >
                        설정 저장
                    </Button>
                </Form.Item>
            </Form>
        </Space>
    );
};

export default SystemSettings; 