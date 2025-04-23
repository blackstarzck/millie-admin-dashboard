import React, { useState } from 'react';
import {
    Typography,
    Table,
    Button,
    Space,
    Tag,
    Card,
    Popconfirm,
    Form,
    Input,
    Switch,
    Modal,
    message
} from 'antd';
import { PlusOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import copy from 'copy-to-clipboard';

const { Title, Paragraph, Text } = Typography;

const ApiManagement = () => {
  const [form] = Form.useForm();
  // 예시 API 키 데이터
  const [apiKeys, setApiKeys] = useState([
    { key: 'key_abc123', id: 'key_abc123', name: '외부 연동 서비스 A', keyPrefix: 'sk_live_abc...', fullKey: 'sk_live_abc123xyzsamplekey', createdDate: '2024-06-01', lastUsed: '2024-07-26', isActive: true },
    { key: 'key_def456', id: 'key_def456', name: '모바일 앱 백엔드', keyPrefix: 'pk_test_def...', fullKey: 'pk_test_def456anothersample', createdDate: '2024-05-15', lastUsed: '2024-07-20', isActive: true },
    { key: 'key_ghi789', id: 'key_ghi789', name: '레거시 시스템 연동', keyPrefix: 'sk_live_ghi...', fullKey: 'sk_live_ghi789legacykey', createdDate: '2023-01-10', lastUsed: '2024-01-05', isActive: false },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGeneratedKey, setNewGeneratedKey] = useState(null);

  const handleGenerateKey = (values) => {
    const { newKeyName } = values;
    if (!newKeyName) {
      message.error('새 API 키의 이름을 입력해주세요.');
      return;
    }
    console.log("Generating API key for:", newKeyName);
    const generatedKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const newKeyEntry = {
      key: `key_${Math.random().toString(36).substring(2, 8)}`,
      id: `key_${Math.random().toString(36).substring(2, 8)}`,
      name: newKeyName,
      keyPrefix: `${generatedKey.substring(0, 10)}...`,
      fullKey: generatedKey,
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: '-',
      isActive: true
    };
    setApiKeys([newKeyEntry, ...apiKeys]);
    setNewGeneratedKey(newKeyEntry);
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setNewGeneratedKey(null);
    message.success('API 키가 목록에 추가되었습니다. 키 값은 안전하게 보관하세요.');
  };

  const handleCopyKey = () => {
      if (newGeneratedKey?.fullKey) {
          copy(newGeneratedKey.fullKey);
          message.success('API 키가 클립보드에 복사되었습니다!');
      }
  };

  const handleToggleActive = (keyId, checked) => {
      console.log(`Toggling key ${keyId} to ${checked}`);
      setApiKeys(apiKeys.map(key => key.id === keyId ? { ...key, isActive: checked } : key));
      message.success(`API 키 상태가 ${checked ? '활성' : '비활성'}(으)로 변경되었습니다.`);
  };

  const handleDeleteKey = (keyId) => {
      console.log(`Deleting key ${keyId}`);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
      message.success('API 키가 삭제되었습니다.');
  };

  const columns = [
    { title: '이름 (용도)', dataIndex: 'name', key: 'name' },
    { title: '키 (Prefix)', dataIndex: 'keyPrefix', key: 'keyPrefix', render: text => <Text copyable={{ text: text, tooltips: 'Prefix 복사' }}>{text}</Text> },
    { title: '생성일', dataIndex: 'createdDate', key: 'createdDate', width: 120 },
    { title: '마지막 사용', dataIndex: 'lastUsed', key: 'lastUsed', width: 120 },
    {
        title: '상태',
        dataIndex: 'isActive',
        key: 'isActive',
        width: 100,
        align: 'center',
        render: (isActive, record) => (
            <Switch
                checked={isActive}
                onChange={(checked) => handleToggleActive(record.id, checked)}
                checkedChildren="활성"
                unCheckedChildren="비활성"
            />
        )
    },
    {
      title: '관리',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
         <Popconfirm 
             title="정말로 이 API 키를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
             onConfirm={() => handleDeleteKey(record.id)}
             okText="삭제"
             cancelText="취소"
             disabled={!record.isActive}
         >
            <Button danger icon={<DeleteOutlined />} disabled={!record.isActive}/>
         </Popconfirm>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>API 키 관리</Title>
      <Paragraph>외부 서비스 연동 또는 내부 시스템 접근을 위한 API 키를 관리합니다. 생성된 키는 다시 확인할 수 없으니 안전하게 보관하세요.</Paragraph>

      <Card title="새 API 키 생성">
          <Form form={form} layout="inline" onFinish={handleGenerateKey}>
             <Form.Item
               name="newKeyName"
               rules={[{ required: true, message: '키 이름을 입력하세요.' }]}
               style={{ flexGrow: 1 }}
             >
               <Input placeholder="API 키 이름 (용도)" />
             </Form.Item>
             <Form.Item>
               <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>키 생성</Button>
             </Form.Item>
          </Form>
      </Card>

      <Card title="API 키 목록">
         <Table
           columns={columns}
           dataSource={apiKeys}
           rowKey="key"
           pagination={{ pageSize: 10 }}
           rowClassName={(record) => !record.isActive ? 'disabled-row' : ''}
         />
      </Card>

      <Modal
        title="API 키 생성 완료"
        visible={isModalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={handleCopyKey}>
            키 복사
          </Button>,
          <Button key="ok" type="primary" onClick={handleModalClose}>
            확인 (닫기)
          </Button>,
        ]}
      >
        <Paragraph>새로운 API 키가 성공적으로 생성되었습니다. <Text strong>이 키는 다시 표시되지 않으니 반드시 안전한 곳에 보관하세요.</Text></Paragraph>
        <Input.TextArea 
            readOnly 
            value={newGeneratedKey?.fullKey || ''} 
            autoSize={{ minRows: 2, maxRows: 4 }}
            style={{ marginTop: 16, backgroundColor: '#f5f5f5', cursor: 'text' }} 
        />
      </Modal>
      
      <style>{`
        .disabled-row td {
          color: rgba(0, 0, 0, 0.25);
        }
        .disabled-row .ant-tag {
           background-color: #f5f5f5;
           border-color: #d9d9d9;
           color: rgba(0, 0, 0, 0.25);
        }
      `}</style>

    </Space>
  );
};

export default ApiManagement; 