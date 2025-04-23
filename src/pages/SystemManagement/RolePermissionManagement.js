import React, { useState, useEffect, useMemo } from 'react';
import {
    Row,
    Col,
    Card,
    List,
    Button,
    Modal,
    Form,
    Input,
    Tree,
    message,
    Typography,
    Space,
    Popconfirm,
    Tooltip,
    Tag,
    Divider,
    Spin,
    Empty,
    Alert,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TeamOutlined, // Role icon
    CheckSquareOutlined, // Permission icon
    SaveOutlined,
    SettingOutlined,
    UserSwitchOutlined, // Role related icon
} from '@ant-design/icons';

const { Title, Text } = Typography;

// --- Sample Permission Structure (Based on Sidebar) ---
// This should ideally come from a configuration or API
const permissionTreeData = [
    {
        title: '대시보드', key: 'dashboard',
        children: [
            { title: '조회', key: 'dashboard_view' },
        ]
    },
    {
        title: '사용자 관리', key: 'userManagement',
        children: [
            { title: '사용자 목록 조회', key: 'userManagement_list_view' },
            { title: '사용자 상세 조회', key: 'userManagement_detail_view' },
            { title: '사용자 정보 수정', key: 'userManagement_edit' },
            { title: '사용자 상태 변경', key: 'userManagement_status' },
            { title: '계정 제재 관리 조회', key: 'userManagement_sanctions_view' },
            { title: '계정 제재 적용/해제', key: 'userManagement_sanctions_manage' },
        ]
    },
    {
        title: '알림 관리', key: 'notificationManagement',
        children: [
            { title: '알림 발송', key: 'notificationManagement_dispatch' },
            { title: '알림 템플릿 관리', key: 'notificationManagement_template' },
            { title: '알림 발송 내역 조회', key: 'notificationManagement_history' },
            { title: '긴급 공지 발송', key: 'notificationManagement_emergency' },
        ]
    },
    {
        title: '팝업 관리', key: 'popupManagement',
        children: [
            { title: '팝업 생성', key: 'popupManagement_create' },
            { title: '팝업 템플릿 관리', key: 'popupManagement_template' },
            { title: '팝업 노출 설정', key: 'popupManagement_exposure' },
            { title: '팝업 통계 분석 조회', key: 'popupManagement_analysis' },
        ]
    },
    {
        title: '문의사항 관리', key: 'inquiryManagement',
        children: [
            { title: '문의 목록 조회/답변', key: 'inquiryManagement_list' },
            { title: 'FAQ 관리', key: 'inquiryManagement_faq' },
        ]
    },
    {
        title: '콘텐츠 관리', key: 'contentManagement',
        children: [
            { title: '공지사항 관리', key: 'contentManagement_notice' },
            // Assuming Category/Metadata/Unsubscribe are under Content management
            { title: '카테고리 관리', key: 'contentManagement_category' },
            { title: '메타데이터 관리', key: 'contentManagement_metadata' },
            { title: '푸시 알림 해지 관리', key: 'contentManagement_unsubscribe' },
        ]
    },
    {
        title: '시스템 관리', key: 'systemManagement',
        children: [
            { title: '시스템 설정 관리', key: 'systemManagement_settings' },
            { title: '관리자 계정 관리', key: 'systemManagement_adminAccounts' },
            { title: '권한 관리', key: 'systemManagement_roles' },
            { title: '시스템 로그 조회', key: 'systemManagement_logs' },
        ]
    },
];

// Function to get all possible keys from the tree data
const getAllPermissionKeys = (nodes) => {
    let keys = [];
    nodes.forEach(node => {
        keys.push(node.key);
        if (node.children) {
            keys = keys.concat(getAllPermissionKeys(node.children));
        }
    });
    return keys;
};
const allPermissionKeys = getAllPermissionKeys(permissionTreeData);

// --- Sample Roles and Permissions (Replace with actual data/API) ---
const initialRoles = [
    {
        key: 'superAdmin',
        name: '최고 관리자',
        description: '시스템의 모든 기능에 접근 가능합니다.',
        permissions: allPermissionKeys, // Has all permissions
        isSystemRole: true, // Cannot be deleted
    },
    {
        key: 'developer',
        name: '개발자',
        description: '개발 및 시스템 유지보수 관련 권한을 가집니다.',
        permissions: [
            'dashboard_view',
            'userManagement', 'userManagement_list_view', 'userManagement_detail_view', 'userManagement_edit', 'userManagement_status', 'userManagement_sanctions_view', 'userManagement_sanctions_manage',
            'notificationManagement', 'notificationManagement_dispatch', 'notificationManagement_template', 'notificationManagement_history', 'notificationManagement_emergency',
            'popupManagement', 'popupManagement_create', 'popupManagement_template', 'popupManagement_exposure', 'popupManagement_analysis',
            'inquiryManagement', 'inquiryManagement_list', 'inquiryManagement_faq',
            'contentManagement', 'contentManagement_notice', 'contentManagement_category', 'contentManagement_metadata', 'contentManagement_unsubscribe',
            'systemManagement', 'systemManagement_settings', 'systemManagement_adminAccounts', 'systemManagement_roles', 'systemManagement_logs',
        ],
        isSystemRole: false,
    },
    {
        key: 'csManager',
        name: 'CS 관리자',
        description: '고객 문의 응대 및 관련 기능 접근 권한을 가집니다.',
        permissions: [
            'dashboard_view',
            'userManagement_list_view', 'userManagement_detail_view',
            'inquiryManagement', 'inquiryManagement_list', 'inquiryManagement_faq',
        ],
        isSystemRole: false,
    },
    {
        key: 'viewer',
        name: '뷰어',
        description: '데이터 조회만 가능한 역할입니다.',
        permissions: [
            'dashboard_view',
            'userManagement_list_view', 'userManagement_detail_view', 'userManagement_sanctions_view',
            'notificationManagement_history',
            'popupManagement_analysis',
            'inquiryManagement_list',
            'contentManagement_notice', // Assuming notices are viewable
        ],
        isSystemRole: false,
    },
];

// --- Component ---
const RolePermissionManagement = () => {
    const [roles, setRoles] = useState(initialRoles);
    const [selectedRoleKey, setSelectedRoleKey] = useState(initialRoles[0]?.key || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null); // null for new, object for edit
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [savingPermissions, setSavingPermissions] = useState(false);
    const [form] = Form.useForm();

    const selectedRole = useMemo(() => {
        return roles.find(role => role.key === selectedRoleKey);
    }, [roles, selectedRoleKey]);

    // Update checkedKeys when selectedRole changes
    useEffect(() => {
        if (selectedRole) {
            setCheckedKeys(selectedRole.permissions || []);
        } else {
            setCheckedKeys([]);
        }
    }, [selectedRole]);

    // --- Role Modal Handling ---
    const showRoleModal = (role = null) => {
        setEditingRole(role);
        if (role) {
            form.setFieldsValue({ name: role.name, description: role.description });
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleRoleModalCancel = () => {
        setIsModalOpen(false);
        setEditingRole(null);
        form.resetFields();
    };

    const handleRoleModalOk = () => {
        form.validateFields()
            .then(values => {
                if (editingRole) {
                    // Edit existing role
                    setRoles(prevRoles =>
                        prevRoles.map(r => r.key === editingRole.key ? { ...r, ...values } : r)
                    );
                    message.success(`'${values.name}' 역할 정보가 수정되었습니다.`);
                    // TODO: API call to update role details
                     console.log('Updated Role:', { key: editingRole.key, ...values });
                } else {
                    // Add new role
                    const newRoleKey = `role_${Date.now()}`;
                     const newRole = {
                         key: newRoleKey,
                         name: values.name,
                         description: values.description,
                         permissions: [], // Start with no permissions
                         isSystemRole: false,
                    };
                    setRoles(prevRoles => [...prevRoles, newRole]);
                     setSelectedRoleKey(newRoleKey); // Select the newly added role
                    message.success(`'${values.name}' 역할이 추가되었습니다.`);
                    // TODO: API call to add new role
                     console.log('Added Role:', newRole);
                }
                handleRoleModalCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    // --- Delete Role Logic ---
    const handleDeleteRole = (key, name) => {
        setRoles(prevRoles => prevRoles.filter(r => r.key !== key));
         // If the deleted role was selected, select the first role if available
         if (selectedRoleKey === key) {
             setSelectedRoleKey(roles[0]?.key || null);
         }
        message.success(`'${name}' 역할이 삭제되었습니다.`);
        // TODO: API call to delete role
         console.log('Deleted Role Key:', key);
    };

    // --- Permission Tree Handling ---
    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    // --- Save Permissions Logic ---
    const handleSavePermissions = async () => {
        if (!selectedRole) {
            message.error('권한을 저장할 역할을 선택해주세요.');
            return;
        }
        setSavingPermissions(true);
        message.loading({ content: `'${selectedRole.name}' 역할의 권한 저장 중...`, key: 'savePerm' });
        try {
             // Simulate API call
             await new Promise(resolve => setTimeout(resolve, 600)); 
            setRoles(prevRoles =>
                prevRoles.map(r => r.key === selectedRoleKey ? { ...r, permissions: checkedKeys } : r)
            );
            message.success({ content: `'${selectedRole.name}' 역할의 권한이 저장되었습니다.`, key: 'savePerm' });
            // TODO: API call to save permissions for the selectedRoleKey
             console.log(`Saved permissions for role ${selectedRoleKey}:`, checkedKeys);
        } catch (error) {
            message.error({ content: '권한 저장 중 오류 발생', key: 'savePerm' });
             console.error('Save permissions error:', error);
        }
        setSavingPermissions(false);
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>역할 및 권한 관리</Title>
            <Text type="secondary">관리자 역할을 정의하고, 각 역할에 메뉴 및 기능 접근 권한을 부여합니다.</Text>

            <Row gutter={24}>
                {/* Role List Column */}
                <Col xs={24} sm={8} md={7} lg={6}>
                    <Card title={<><UserSwitchOutlined /> 역할 목록</>} size="small">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showRoleModal()}
                            style={{ marginBottom: 16, width: '100%' }}
                        >
                            새 역할 추가
                        </Button>
                        <List
                            dataSource={roles}
                            renderItem={role => (
                                <List.Item
                                    actions={[
                                         <Tooltip title="수정">
                                             <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={() => showRoleModal(role)}
                                                size="small"
                                                disabled={role.isSystemRole}
                                            />
                                         </Tooltip>,
                                         <Popconfirm
                                             title={`'${role.name}' 역할을 삭제하시겠습니까? 연결된 관리자의 역할이 해제될 수 있습니다.`}
                                             onConfirm={() => handleDeleteRole(role.key, role.name)}
                                             okText="삭제"
                                             cancelText="취소"
                                             disabled={role.isSystemRole}
                                         >
                                             <Tooltip title={role.isSystemRole ? '시스템 역할은 삭제 불가' : '삭제'}>
                                                  <Button
                                                      type="text"
                                                      danger
                                                      icon={<DeleteOutlined />}
                                                      size="small"
                                                      disabled={role.isSystemRole}
                                                  />
                                             </Tooltip>
                                         </Popconfirm>,
                                     ]}
                                    style={{
                                         padding: '8px 12px',
                                         cursor: 'pointer',
                                         backgroundColor: selectedRoleKey === role.key ? '#e6f7ff' : 'transparent',
                                         borderLeft: selectedRoleKey === role.key ? '3px solid #1890ff' : '3px solid transparent',
                                         transition: 'background-color 0.3s',
                                     }}
                                     onClick={() => setSelectedRoleKey(role.key)}
                                >
                                    <List.Item.Meta
                                         avatar={role.isSystemRole ? <SettingOutlined /> : <TeamOutlined />}
                                         title={<Text strong>{role.name}</Text>}
                                         description={<Text type="secondary" ellipsis>{role.description}</Text>}
                                     />
                                 </List.Item>
                             )}
                             locale={{ emptyText: <Empty description="역할이 없습니다." /> }}
                        />
                    </Card>
                </Col>

                {/* Permission Settings Column */}
                <Col xs={24} sm={16} md={17} lg={18}>
                    <Card
                        title={
                            selectedRole ? (
                                <><CheckSquareOutlined /> '{selectedRole.name}' 역할 권한 설정</>
                            ) : (
                                 <><CheckSquareOutlined /> 역할 권한 설정</>
                            )
                        }
                        size="small"
                         extra={
                             selectedRole && !selectedRole.isSystemRole && (
                                 <Button
                                     type="primary"
                                     icon={<SaveOutlined />}
                                     onClick={handleSavePermissions}
                                     loading={savingPermissions}
                                     disabled={savingPermissions}
                                 >
                                     권한 저장
                                 </Button>
                             )
                         }
                    >
                        {selectedRole ? (
                            <Spin spinning={savingPermissions} tip="권한 저장 중...">
                                {selectedRole.isSystemRole && (
                                     <Alert
                                         message="시스템 역할"
                                         description="이 역할의 권한은 변경할 수 없습니다."
                                         type="info"
                                         showIcon
                                         style={{ marginBottom: 16 }}
                                     />
                                 )}
                                <Tree
                                     checkable
                                     // checkStrictly // Enable if parent/child checks should be independent
                                     defaultExpandAll
                                     checkedKeys={checkedKeys}
                                     onCheck={onCheck}
                                     treeData={permissionTreeData}
                                     disabled={selectedRole.isSystemRole} // Disable tree if it's a system role
                                     style={{ padding: '10px', border: '1px solid #f0f0f0', borderRadius: '4px' }}
                                 />
                            </Spin>
                         ) : (
                             <Empty description="권한을 설정할 역할을 왼쪽 목록에서 선택해주세요." />
                         )}
                    </Card>
                </Col>
            </Row>

            {/* Add/Edit Role Modal */}
            <Modal
                title={editingRole ? `역할 수정: ${editingRole.name}` : '새 역할 추가'}
                open={isModalOpen}
                onOk={handleRoleModalOk}
                onCancel={handleRoleModalCancel}
                okText={editingRole ? '수정' : '추가'}
                cancelText="취소"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="role_form">
                    <Form.Item
                        name="name"
                        label="역할 이름"
                        rules={[{ required: true, message: '역할 이름을 입력해주세요.' }]}
                    >
                        <Input placeholder="예: 콘텐츠 에디터" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="역할 설명"
                        rules={[{ required: true, message: '역할 설명을 입력해주세요.' }]}
                    >
                        <Input.TextArea rows={3} placeholder="예: 콘텐츠 생성 및 수정 권한을 가집니다." />
                    </Form.Item>
                </Form>
            </Modal>
        </Space>
    );
};

export default RolePermissionManagement; 