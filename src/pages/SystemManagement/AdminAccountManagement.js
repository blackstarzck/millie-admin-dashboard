import React, { useState, useMemo } from 'react';
import {
    Table,
    Tag,
    Button,
    Input,
    Select,
    Space,
    Typography,
    Tooltip,
    Modal,
    Form,
    message,
    Popconfirm,
    Switch,
    Avatar,
    Divider,
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    LockOutlined, // For password related actions
    CheckCircleOutlined, // For active status
    StopOutlined, // For inactive status
    TeamOutlined, // For role icon
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// --- Sample Data ---
const initialAdminUsers = [
    { key: 'admin1', id: 'admin001', name: '김관리', email: 'kim.admin@example.com', role: 'superAdmin', status: true, lastLogin: '2024-07-30 10:00:00', createdAt: '2023-01-15 09:00:00' },
    { key: 'admin2', id: 'dev001', name: '박개발', email: 'park.dev@example.com', role: 'developer', status: true, lastLogin: '2024-07-29 14:30:00', createdAt: '2023-05-20 11:00:00' },
    { key: 'admin3', id: 'cs001', name: '이응대', email: 'lee.cs@example.com', role: 'csManager', status: true, lastLogin: '2024-07-31 09:15:00', createdAt: '2023-08-10 16:00:00' },
    { key: 'admin4', id: 'marketer', name: '최마케터', email: 'choi.mkt@example.com', role: 'marketing', status: false, lastLogin: '2024-06-01 18:00:00', createdAt: '2024-02-01 14:00:00' },
];

// Sample Roles
const adminRoles = [
    { key: 'superAdmin', label: '최고 관리자', color: 'red' },
    { key: 'developer', label: '개발자', color: 'geekblue' },
    { key: 'csManager', label: 'CS 관리자', color: 'purple' },
    { key: 'marketing', label: '마케터', color: 'orange' },
    { key: 'viewer', label: '뷰어', color: 'default' }, // Example of a view-only role
];

// --- Helper Functions ---
const getStatusTag = (status) => {
    return status
        ? <Tag icon={<CheckCircleOutlined />} color="success">활성</Tag>
        : <Tag icon={<StopOutlined />} color="default">비활성</Tag>;
};

const getRoleTag = (roleKey) => {
    const role = adminRoles.find(r => r.key === roleKey);
    return role ? <Tag color={role.color} icon={<TeamOutlined />}>{role.label}</Tag> : <Tag>{roleKey}</Tag>;
};

// --- Component ---
const AdminAccountManagement = () => {
    const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null); // null for new, object for edit
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ role: 'all', status: 'all' });
    const [form] = Form.useForm();

    // --- Search & Filter Logic ---
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const filteredAdminUsers = useMemo(() => {
        return adminUsers.filter(user => {
            const matchesSearch = searchText
                ? user.id.toLowerCase().includes(searchText) ||
                  user.name.toLowerCase().includes(searchText) ||
                  user.email.toLowerCase().includes(searchText)
                : true;
            const matchesRole = filters.role === 'all' || user.role === filters.role;
            const matchesStatus = filters.status === 'all' || user.status === (filters.status === 'active');

            return matchesSearch && matchesRole && matchesStatus;
        }).sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix()); // Sort by creation date
    }, [adminUsers, searchText, filters]);

    // --- Modal Handling ---
    const showModal = (admin = null) => {
        setEditingAdmin(admin);
        if (admin) {
            form.setFieldsValue({
                ...admin,
                password: '********', // Mask password on edit
                confirmPassword: '********',
            });
        } else {
            form.resetFields(); // Clear fields for new admin
             form.setFieldsValue({ status: true }); // Default to active
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingAdmin(null);
        form.resetFields();
    };

    // --- Add/Edit Logic ---
    const handleOk = () => {
        form.validateFields()
            .then(values => {
                // Don't submit masked passwords if not changed
                if (editingAdmin && values.password === '********') {
                    delete values.password;
                    delete values.confirmPassword;
                } else if (!editingAdmin && !values.password) {
                     message.error('새 관리자 등록 시 비밀번호는 필수입니다.');
                     return; // Or handle password generation
                 }

                const adminData = {
                    ...values,
                    key: editingNotice ? editingNotice.key : `admin${Date.now()}`,
                    id: values.id, // Use the entered ID
                    createdAt: editingAdmin ? editingAdmin.createdAt : moment().format('YYYY-MM-DD HH:mm:ss'),
                    lastLogin: editingAdmin ? editingAdmin.lastLogin : null, // Keep last login on edit
                };
                // Remove confirm password before saving
                delete adminData.confirmPassword;

                if (editingAdmin) {
                    // Update existing admin
                    setAdminUsers(prevAdmins =>
                        prevAdmins.map(a => a.key === editingAdmin.key ? { ...a, ...adminData } : a)
                    );
                    message.success(`관리자(ID: ${editingAdmin.id}) 정보가 수정되었습니다.`);
                    // TODO: API call to update admin user (handle password change separately if needed)
                    console.log('Updated Admin:', adminData);
                } else {
                    // Add new admin
                    // Check for duplicate ID before adding
                    if (adminUsers.some(u => u.id === values.id)) {
                        message.error(`이미 사용 중인 관리자 ID (${values.id}) 입니다.`);
                        return;
                    }
                    setAdminUsers(prevAdmins => [adminData, ...prevAdmins]);
                    message.success(`새 관리자(ID: ${values.id})가 등록되었습니다.`);
                    // TODO: API call to add admin user
                    console.log('Added Admin:', adminData);
                }
                handleCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('필수 입력 항목을 확인해주세요.');
            });
    };

    // --- Delete Logic ---
    const handleDelete = (key, id) => {
        // Prevent deleting the super admin or oneself (add more robust logic if needed)
        const adminToDelete = adminUsers.find(a => a.key === key);
        if (adminToDelete?.role === 'superAdmin') {
            message.error('최고 관리자 계정은 삭제할 수 없습니다.');
            return;
        }
        // Add logic here to prevent deleting the currently logged-in user

        setAdminUsers(prevAdmins => prevAdmins.filter(a => a.key !== key));
        message.success(`관리자(ID: ${id})가 삭제되었습니다.`);
        // TODO: API call to delete admin user
        console.log('Deleted Admin ID:', id);
    };

    // --- Toggle Status ---
    const handleStatusToggle = (key, checked) => {
         // Prevent deactivating super admin or oneself
         const adminToToggle = adminUsers.find(a => a.key === key);
         if (adminToToggle?.role === 'superAdmin' && !checked) {
             message.error('최고 관리자 계정은 비활성화할 수 없습니다.');
             return;
         }
         // Add logic here to prevent deactivating the currently logged-in user

         setAdminUsers(prevAdmins =>
            prevAdmins.map(a => a.key === key ? { ...a, status: checked } : a)
        );
        message.success(`관리자 계정 상태가 ${checked ? '활성' : '비활성'}으로 변경되었습니다.`);
         // TODO: API call to update status
         console.log(`Toggled status for admin key ${key} to ${checked}`);
    };

    // --- Table Columns Definition ---
    const columns = [
        // { title: 'Key', dataIndex: 'key', key: 'key' }, // Usually hidden
        { title: 'ID', dataIndex: 'id', key: 'id', width: 120, fixed: 'left' },
        {
            title: '이름', dataIndex: 'name', key: 'name', width: 120, fixed: 'left',
            render: (name) => (
                <Space>
                    <Avatar size="small" icon={<UserOutlined />} /> {name}
                </Space>
            )
        },
        { title: '이메일', dataIndex: 'email', key: 'email', ellipsis: true },
        {
            title: '역할', dataIndex: 'role', key: 'role', width: 150,
            render: getRoleTag,
            filters: adminRoles.map(r => ({ text: r.label, value: r.key })),
            onFilter: (value, record) => record.role === value,
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 100, align: 'center',
            render: (status, record) => (
                 <Switch
                    checked={status}
                    onChange={(checked) => handleStatusToggle(record.key, checked)}
                    checkedChildren="활성"
                    unCheckedChildren="비활성"
                    size="small"
                 />
            ),
            filters: [
                { text: '활성', value: 'active' },
                { text: '비활성', value: 'inactive' },
            ],
             // Filter logic handled in useMemo
        },
        {
            title: '마지막 로그인', dataIndex: 'lastLogin', key: 'lastLogin', width: 150,
            render: (date) => date ? moment(date).format('YYYY-MM-DD HH:mm') : '-',
            sorter: (a, b) => moment(a.lastLogin || 0).unix() - moment(b.lastLogin || 0).unix(),
        },
        {
            title: '등록일', dataIndex: 'createdAt', key: 'createdAt', width: 150,
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
            defaultSortOrder: 'descend',
        },
        {
            title: '관리',
            key: 'action',
            width: 100,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="수정">
                        <Button icon={<EditOutlined />} onClick={() => showModal(record)} size="small" />
                    </Tooltip>
                    <Popconfirm
                        title={`'${record.name}'(${record.id}) 관리자를 삭제하시겠습니까?`}
                        onConfirm={() => handleDelete(record.key, record.id)}
                        okText="삭제"
                        cancelText="취소"
                        disabled={record.role === 'superAdmin'} // Disable delete for superAdmin
                    >
                        <Tooltip title={record.role === 'superAdmin' ? '최고 관리자는 삭제 불가' : '삭제'}>
                             <Button icon={<DeleteOutlined />} danger size="small" disabled={record.role === 'superAdmin'} />
                         </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>관리자 계정 관리</Title>
            <Text type="secondary">시스템 접근 권한이 있는 관리자 계정을 생성하고 관리합니다.</Text>

            {/* Controls: Add Button, Search, Filters */}
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space wrap>
                    <Search
                        placeholder="ID, 이름, 이메일 검색"
                        allowClear
                        enterButton={<><SearchOutlined /> 검색</>}
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                    />
                    <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                    <Select
                        value={filters.role}
                        onChange={(value) => handleFilterChange('role', value)}
                        style={{ width: 150 }}
                    >
                        <Option value="all">전체 역할</Option>
                        {adminRoles.map(role => (
                            <Option key={role.key} value={role.key}>{role.label}</Option>
                        ))}
                    </Select>
                     <Select
                        value={filters.status}
                        onChange={(value) => handleFilterChange('status', value)}
                        style={{ width: 120 }}
                    >
                        <Option value="all">전체 상태</Option>
                        <Option value="active">활성</Option>
                        <Option value="inactive">비활성</Option>
                    </Select>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>새 관리자 추가</Button>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredAdminUsers}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 1200 }}
                size="middle"
            />

            {/* Add/Edit Modal */}
            <Modal
                title={editingAdmin ? `관리자 정보 수정 (ID: ${editingAdmin.id})` : '새 관리자 추가'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingAdmin ? '수정 완료' : '추가'}
                cancelText="취소"
                destroyOnClose
                width={600}
            >
                <Form form={form} layout="vertical" name="admin_form">
                     <Form.Item
                        name="id"
                        label="관리자 ID"
                        rules={[{ required: true, message: '관리자 ID를 입력해주세요.' }, { pattern: /^[a-zA-Z0-9_]+$/, message: 'ID는 영문, 숫자, 밑줄(_)만 사용 가능합니다.'}]}
                        extra={!editingAdmin && "ID는 생성 후 변경할 수 없습니다."}
                    >
                        <Input placeholder="예: manager_kim" disabled={!!editingAdmin} />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="이름"
                        rules={[{ required: true, message: '이름을 입력해주세요.' }]}
                    >
                        <Input placeholder="예: 김관리" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="이메일"
                        rules={[{ required: true, type: 'email', message: '유효한 이메일 주소를 입력해주세요.' }]}
                    >
                        <Input placeholder="예: admin@example.com" />
                    </Form.Item>

                    <Divider>보안 정보 {editingAdmin && "(변경 시에만 입력)"}</Divider>

                    <Form.Item
                        name="password"
                         label={editingAdmin ? "새 비밀번호" : "비밀번호"}
                        rules={[
                            { required: !editingAdmin, message: '비밀번호를 입력해주세요.' },
                             { min: 8, message: '비밀번호는 최소 8자 이상이어야 합니다.' },
                             // Add more complexity rules if needed (e.g., special chars, numbers)
                         ]}
                         help={editingAdmin && "변경하지 않으려면 비워두세요."}
                    >
                        <Input.Password placeholder={editingAdmin ? "새 비밀번호 입력" : "비밀번호 입력"} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={editingAdmin ? "새 비밀번호 확인" : "비밀번호 확인"}
                        dependencies={['password']}
                        hasFeedback
                         rules={[
                             { required: !editingAdmin || form.getFieldValue('password') !== '********', message: '비밀번호 확인을 입력해주세요.' },
                             ({ getFieldValue }) => ({
                                 validator(_, value) {
                                     const password = getFieldValue('password');
                                     // Skip validation if password isn't being changed during edit
                                     if (editingAdmin && (password === '********' || !password) && !value) {
                                         return Promise.resolve();
                                     }
                                     if (!value || password === value) {
                                         return Promise.resolve();
                                     }
                                     return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'));
                                 },
                             }),
                         ]}
                    >
                        <Input.Password placeholder={editingAdmin ? "새 비밀번호 다시 입력" : "비밀번호 다시 입력"} />
                    </Form.Item>

                    <Divider>권한 및 상태</Divider>

                    <Form.Item
                        name="role"
                        label="역할"
                        rules={[{ required: true, message: '관리자 역할을 선택해주세요.' }]}
                    >
                        <Select placeholder="역할 선택">
                            {adminRoles.map(role => (
                                <Option key={role.key} value={role.key} disabled={role.key === 'superAdmin' && editingAdmin?.role !== 'superAdmin'}>
                                     {/* Prevent assigning superAdmin unless already superAdmin */} 
                                     {role.label}
                                 </Option>
                            ))}
                        </Select>
                    </Form.Item>

                     <Form.Item
                        name="status"
                        label="계정 상태"
                        valuePropName="checked"
                         rules={[{ required: true }]}
                    >
                        <Switch checkedChildren="활성" unCheckedChildren="비활성" disabled={editingAdmin?.role === 'superAdmin'}/>
                     </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default AdminAccountManagement; 