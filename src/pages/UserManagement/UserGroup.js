import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Typography,
    Card,
    Modal,
    Form,
    Input,
    message,
    Popconfirm,
    Tooltip,
    Transfer, // For assigning members
    Select,
    Tag,
} from 'antd';
import {
    TeamOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UsergroupAddOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

// Sample Data (Replace with actual API calls)
const initialGroups = [
    { key: '1', id: 1, name: '관리자 그룹', memberCount: 3, description: '사이트 전체 관리 권한' },
    { key: '2', id: 2, name: '편집자 그룹', memberCount: 10, description: '콘텐츠 생성 및 수정 권한' },
    { key: '3', id: 3, name: '일반 회원 그룹', memberCount: 500, description: '기본 서비스 이용 권한', isDefault: true }, // Default group example
    { key: '4', id: 4, name: 'VIP 멤버', memberCount: 50, description: 'VIP 혜택 적용 대상' },
];

// Sample User data for Transfer component
const mockUsers = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString(),
  title: `사용자 ${i + 1} (user${String(i + 1).padStart(3, '0')})`,
  description: `user${String(i + 1).padStart(3, '0')}@example.com`,
  // chosen: Math.random() * 2 > 1, // Simulate some chosen users
}));

// --- Component ---
const UserGroup = () => {
    const [groups, setGroups] = useState(initialGroups);
    const [loading, setLoading] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [targetKeys, setTargetKeys] = useState([]); // Keys of users in the current group
    const [selectedKeys, setSelectedKeys] = useState([]); // Keys selected in the Transfer component
    const [currentManagingGroup, setCurrentManagingGroup] = useState(null); // Group being managed for members
    const [groupForm] = Form.useForm();

    // Fetch initial data if needed
    // useEffect(() => { fetchData(); }, []);

    const fetchData = () => {
        setLoading(true);
        // TODO: API Call to fetch groups
        setTimeout(() => {
            setGroups(initialGroups);
            setLoading(false);
        }, 300);
    };

    // --- Group Modal --- 
    const showGroupModal = (group = null) => {
        setEditingGroup(group);
        groupForm.setFieldsValue(group ? group : { name: '', description: '' });
        setIsGroupModalOpen(true);
    };

    const handleGroupModalCancel = () => {
        setIsGroupModalOpen(false);
        setEditingGroup(null);
        groupForm.resetFields();
    };

    const handleGroupModalOk = () => {
        groupForm.validateFields()
            .then(values => {
                 message.loading({ content: '그룹 정보 저장 중...', key: 'groupSave' });
                 // TODO: API call for create/update group
                 console.log('Saving group:', { ...(editingGroup || {}), ...values });
                 setTimeout(() => { // Simulate API delay
                    if (editingGroup) {
                         setGroups(groups.map(g => g.key === editingGroup.key ? { ...g, ...values } : g));
                         message.success({ content: `'${values.name}' 그룹 정보가 수정되었습니다.`, key: 'groupSave' });
                    } else {
                         const newGroup = { key: `group_${Date.now()}`, id: Date.now(), memberCount: 0, ...values }; // Assign temporary key/id
                         setGroups([...groups, newGroup]);
                         message.success({ content: `'${values.name}' 그룹이 추가되었습니다.`, key: 'groupSave' });
                    }
                    handleGroupModalCancel();
                }, 500);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleDeleteGroup = (key, name, isDefault) => {
         if (isDefault) {
             message.warning('기본 그룹은 삭제할 수 없습니다.');
             return;
         }
        message.loading({ content: `'${name}' 그룹 삭제 중...`, key: 'groupDelete' });
        // TODO: API call for delete group
        console.log('Deleting group key:', key);
         setTimeout(() => { // Simulate API delay
             setGroups(groups.filter(g => g.key !== key));
             message.success({ content: `'${name}' 그룹이 삭제되었습니다.`, key: 'groupDelete' });
         }, 500);
    };

    // --- Member Management Modal & Transfer --- 
    const showMemberModal = (group) => {
        setCurrentManagingGroup(group);
        // TODO: API call to fetch members of this group (group.id)
        // For demo, randomly select some users as belonging to the group
        const initialTargetKeys = mockUsers.filter((_, index) => index < (group.memberCount || 5) && Math.random() > 0.5).map(item => item.key);
        setTargetKeys(initialTargetKeys);
        setIsMemberModalOpen(true);
    };

    const handleMemberModalCancel = () => {
        setIsMemberModalOpen(false);
        setCurrentManagingGroup(null);
        setTargetKeys([]);
        setSelectedKeys([]);
    };

    const handleMemberModalOk = () => {
        message.loading({ content: `'${currentManagingGroup?.name}' 그룹 멤버 저장 중...`, key: 'memberSave' });
        // TODO: API Call to update group members (currentManagingGroup.id, targetKeys)
        console.log(`Saving members for group ${currentManagingGroup?.id}:`, targetKeys);
        setTimeout(() => { // Simulate API delay
            // Update member count in the main table (optional, could be done via refetch)
            setGroups(prevGroups => prevGroups.map(g =>
                g.key === currentManagingGroup?.key ? { ...g, memberCount: targetKeys.length } : g
            ));
            message.success({ content: `'${currentManagingGroup?.name}' 그룹의 멤버 정보가 저장되었습니다.`, key: 'memberSave' });
            handleMemberModalCancel();
        }, 800);
    };

    const handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
        console.log('targetKeys:', nextTargetKeys);
        console.log('direction:', direction);
        console.log('moveKeys:', moveKeys);
    };

    const handleTransferSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
        console.log('sourceSelectedKeys:', sourceSelectedKeys);
        console.log('targetSelectedKeys:', targetSelectedKeys);
    };

    // --- Table Columns ---
    const columns = [
        {
            title: '그룹명',
            dataIndex: 'name',
            key: 'name',
             render: (text, record) => <Space>{text}{record.isDefault && <Tag color="cyan">기본</Tag>}</Space>
        },
        {
            title: '멤버 수',
            dataIndex: 'memberCount',
            key: 'memberCount',
            align: 'right',
            width: 100,
        },
        {
            title: '설명',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: '관리',
            key: 'action',
            align: 'center',
            width: 250,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="그룹 멤버 관리">
                        <Button icon={<UsergroupAddOutlined />} onClick={() => showMemberModal(record)} />
                    </Tooltip>
                    <Tooltip title="그룹 정보 수정">
                        <Button icon={<EditOutlined />} onClick={() => showGroupModal(record)} />
                    </Tooltip>
                     <Tooltip title={record.isDefault ? "기본 그룹 삭제 불가" : "그룹 삭제"}>
                        <Popconfirm
                            title={`'${record.name}' 그룹을 삭제하시겠습니까?`} 
                            onConfirm={() => handleDeleteGroup(record.key, record.name, record.isDefault)}
                            okText="삭제"
                            cancelText="취소"
                            disabled={record.isDefault}
                        >
                            <Button icon={<DeleteOutlined />} danger disabled={record.isDefault} />
                        </Popconfirm>
                    </Tooltip>
                    {/* Add link/button to permission settings if applicable */}
                    {/* <Tooltip title="권한 설정">
                        <Button icon={<SettingOutlined />} />
                    </Tooltip> */}
                 </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><TeamOutlined /> 사용자 그룹 관리</Title>
            <Text>사용자를 특정 그룹으로 묶어 관리합니다. 그룹별로 권한이나 정책을 다르게 적용할 수 있습니다.</Text>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showGroupModal()}
                style={{ marginBottom: 16, alignSelf: 'flex-start' }}
            >
                새 그룹 추가
            </Button>

            <Card>
                <Table
                    columns={columns}
                    dataSource={groups}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    rowKey="key"
                    bordered
                    size="small"
                />
            </Card>

            {/* Add/Edit Group Modal */}
            <Modal
                title={editingGroup ? `그룹 수정: ${editingGroup.name}` : '새 그룹 추가'}
                open={isGroupModalOpen}
                onOk={handleGroupModalOk}
                onCancel={handleGroupModalCancel}
                okText={editingGroup ? '수정' : '추가'}
                cancelText="취소"
                destroyOnClose
            >
                <Form form={groupForm} layout="vertical">
                    <Form.Item
                        name="name"
                        label="그룹명"
                        rules={[{ required: true, message: '그룹명을 입력해주세요.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="설명"
                        rules={[{ required: true, message: '설명을 입력해주세요.' }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                    {/* Add other settings like 'isDefault' if configurable */}
                 </Form>
            </Modal>

            {/* Member Management Modal */}
            <Modal
                title={`'${currentManagingGroup?.name}' 그룹 멤버 관리`}
                open={isMemberModalOpen}
                onOk={handleMemberModalOk}
                onCancel={handleMemberModalCancel}
                width={720}
                okText="저장"
                cancelText="취소"
                destroyOnClose
            >
                 <Transfer
                     dataSource={mockUsers} // Should be all users fetched from API
                     titles={['전체 사용자', '그룹 멤버']}
                     targetKeys={targetKeys}
                     selectedKeys={selectedKeys}
                     onChange={handleTransferChange}
                     onSelectChange={handleTransferSelectChange}
                     // onScroll={handleScroll}
                     render={item => item.title}
                     listStyle={{
                         width: 300,
                         height: 300,
                     }}
                     showSearch
                     // filterOption={(inputValue, item) => item.title.indexOf(inputValue) !== -1}
                 />
            </Modal>

        </Space>
    );
};

export default UserGroup;
