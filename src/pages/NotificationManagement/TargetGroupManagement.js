import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Typography,
    Popconfirm,
    message,
    Divider,
    Select as AntdSelect,
    Spin,
    Alert
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { QueryBuilder, formatQuery } from 'react-querybuilder';
// import { QueryBuilderAntD } from '@react-querybuilder/antd'; // Temporarily removed
import 'react-querybuilder/dist/query-builder.css';
import { useGroups } from '../../context/GroupContext'; // Import the custom hook

const { Title } = Typography;
const { TextArea } = Input;

// --- Mock Fields Definition (Further Simplified for Debugging) ---
const fields = [
    // { name: 'registrationDate', label: '가입일', type: 'date', operators: ['=', '!=', '>', '<', 'between'] }, // Temporarily commented out
    { name: 'totalPurchaseAmount', label: '총 구매 금액', inputType: 'number', operators: ['=', '!=', '>', '<', '>=', '<='] },
    // { name: 'subscriptionStatus', label: '구독 상태', inputType: 'select', operators: ['=', '!='],
    //     values: [
    //         { name: 'active', label: '구독 중' },
    //         { name: 'inactive', label: '미구독' },
    //         { name: 'paused', label: '일시정지' },
    //     ]
    // }, // Temporarily commented out
    // { name: 'lastLoginDate', label: '마지막 로그인', type: 'date', operators: ['=', '>', '<', 'between'] }, // Temporarily commented out
    { name: 'city', label: '도시', inputType: 'text', operators: ['=', '!=', 'contains', 'beginsWith', 'endsWith'] },
    // { name: 'isEmailVerified', label: '이메일 인증 여부', type: 'boolean', operators: ['='] } // Temporarily commented out
];

const TargetGroupManagement = () => {
    // Use state from context
    const { groups, addGroup, updateGroup, deleteGroup } = useGroups(); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [form] = Form.useForm();
    const [query, setQuery] = useState({ combinator: 'and', rules: [] });
    const [previewCount, setPreviewCount] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewError, setPreviewError] = useState(null);

    const showModal = (group = null) => {
        setEditingGroup(group);
        form.setFieldsValue(group || { name: '', description: '' });
        setQuery(group?.query || { combinator: 'and', rules: [] });
        setPreviewCount(null);
        setPreviewError(null);
        setIsPreviewLoading(false);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingGroup(null);
        form.resetFields();
        setQuery({ combinator: 'and', rules: [] });
        setPreviewCount(null);
        setPreviewError(null);
        setIsPreviewLoading(false);
    };

    // Use context functions for Ok and Delete
    const handleOk = () => {
        form.validateFields()
            .then(values => {
                // Get the query from the state managed by QueryBuilder
                const groupData = { ...values, query }; 

                if (editingGroup) {
                    updateGroup({ ...editingGroup, ...groupData }); // Call context update function
                } else {
                    addGroup(groupData); // Call context add function
                }
                handleCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('입력 내용을 확인해주세요.');
            });
    };

    const handleDelete = (key) => {
        deleteGroup(key); // Call context delete function
    };

    // --- Preview Function ---
    const handlePreview = async () => {
        setIsPreviewLoading(true);
        setPreviewCount(null); 
        setPreviewError(null); 
        const currentQuery = query; // Query from state, potentially modified by user in the builder
        const groupId = editingGroup?.id; // Get the ID of the group being edited

        console.log(`Preview requested for group ID: ${groupId}`);
        console.log('Current query state for preview:', formatQuery(currentQuery, 'json'));

        try {
            // --- TODO: Implement Backend API Call with proper error handling ---
            
            // --- Deterministic Simulation based on Group ID ---
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate base delay

            let specificError = null;
            if (groupId?.startsWith('ERR')) {
                switch (groupId) {
                    case 'ERR01':
                        specificError = 'INVALID_QUERY: 숫자 필드 \'총 구매 금액\'에 유효하지 않은 값 \'만원\'이 사용되었습니다.';
                        break;
                    case 'ERR02':
                        specificError = 'INVALID_QUERY: 정의되지 않은 필드 \'purchaseCount\'가 사용되었습니다.';
                        break;
                    case 'ERR03':
                        specificError = 'INVALID_QUERY: 숫자 필드 \'총 구매 금액\'에 유효하지 않은 연산자 \'contains\'가 사용되었습니다.';
                        break;
                    case 'ERR04':
                        specificError = 'INVALID_QUERY: 규칙에 필요한 \'value\' 속성이 누락되었습니다. (field: city)';
                        break;
                    case 'ERR05':
                        specificError = 'INVALID_QUERY: 규칙에 필요한 \'operator\' 속성이 누락되었습니다. (field: city)';
                        break;
                    default:
                        specificError = '알 수 없는 쿼리 오류가 발생했습니다.'; // Fallback for unknown ERR IDs
                }
            }

            if (specificError) {
                throw new Error(specificError);
            }
            // --- End Simulation ---

            // If successful (Must be a group starting with 'G' or no specific error found for 'ERR')
            const simulatedCount = Math.floor(Math.random() * 1000);
            const count = simulatedCount;
            setPreviewCount(count);
            message.success('대상자 수 미리보기를 완료했습니다.');

        } catch (error) {
            console.error('Preview failed:', error);
            let displayMessage = '미리보기에 실패했습니다. 다시 시도해주세요.'; // Default error message
            
            // Use the specific error message if thrown, otherwise default
            if (error.message) {
                 displayMessage = error.message.startsWith('INVALID_QUERY:') 
                                    ? error.message.substring('INVALID_QUERY:'.length).trim() 
                                    : error.message;
            }

            message.error(displayMessage); // Show error toast
            setPreviewError(displayMessage); // Set error state to display in Alert
            setPreviewCount(null);
        } finally {
            setIsPreviewLoading(false);
        }
    };

    const columns = [
        { title: '그룹 ID', dataIndex: 'id', key: 'id', width: 150 },
        { title: '그룹명', dataIndex: 'name', key: 'name' },
        { title: '설명', dataIndex: 'description', key: 'description', ellipsis: true },
        // Optionally add a column to show query summary or rule count
        {
            title: '관리',
            key: 'action',
            width: 100, // Reduced width as text is removed
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} size="small" />
                    <Popconfirm
                        title="이 그룹을 삭제하시겠습니까?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="삭제"
                        cancelText="취소"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>발송 대상 그룹 관리</Title>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showModal()}
                style={{ marginBottom: 16 }}
            >
                새 그룹 추가
            </Button>
            <Table
                columns={columns}
                dataSource={groups}
                bordered
                size="small"
                rowKey="key"
            />
            <Modal
                title={editingGroup ? '그룹 수정' : '새 그룹 추가'}
                open={isModalOpen}
                onCancel={handleCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
                width={800}
                footer={[
                    <Button key="preview" icon={<EyeOutlined />} onClick={handlePreview} loading={isPreviewLoading}>
                        결과 미리보기
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        {editingGroup ? '수정' : '추가'}
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" name="group_form">
                    <Form.Item
                        name="name"
                        label="그룹명"
                        rules={[{ required: true, message: '그룹명을 입력해주세요!' }]}
                    >
                        <Input placeholder="예: 이벤트 참여 고객" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="설명"
                    >
                        <TextArea rows={3} placeholder="그룹에 대한 설명을 입력하세요 (선택 사항)" />
                    </Form.Item>

                    <Divider>그룹 조건 정의</Divider>

                    {/* Use vanilla QueryBuilder without AntD wrapper */}
                    {/* <QueryBuilderAntD> */}
                        <QueryBuilder
                            fields={fields} // Use the simplified fields for now
                            query={query}
                            onQueryChange={q => setQuery(q)}
                        />
                    {/* </QueryBuilderAntD> */}

                    {/* Preview Result Display */}
                    <div style={{ marginTop: 16 }}>
                        {isPreviewLoading && <div style={{ textAlign: 'center' }}><Spin /></div>}
                        {/* Display Success */}
                        {previewCount !== null && !isPreviewLoading && !previewError && (
                            <Alert
                                message={`예상 대상자 수: ${previewCount.toLocaleString()} 명`}
                                type="info"
                                showIcon
                            />
                        )}
                        {/* Display Error */}
                        {previewError && !isPreviewLoading && (
                            <Alert
                                message={previewError}
                                type="error"
                                showIcon
                            />
                        )}
                        {/* Initial state message (Optional) */}
                        {previewCount === null && !previewError && !isPreviewLoading && (
                             <Alert
                                message="규칙을 정의하고 '결과 미리보기'를 눌러 예상 대상자 수를 확인할 수 있습니다."
                                type="warning"
                                showIcon
                            />
                        )}
                    </div>
                </Form>
            </Modal>
        </Space>
    );
};

export default TargetGroupManagement; 