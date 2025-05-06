import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    Select,
    Radio,
    DatePicker,
    Button,
    Space,
    Typography,
    message,
    Card,
    Divider,
    AutoComplete, // For user search
    Row,
    Col,
    Modal,
    Descriptions,
    Spin, // Import Spin for loading indicator
    List, // Import List
    Tag, // Import Tag
} from 'antd';
import {
    SendOutlined, // 발송 아이콘
    EyeOutlined, // 미리보기 아이콘
    MailOutlined,
    MessageOutlined,
    BellOutlined,
    MobileOutlined, // 테스트 발송 아이콘 추가
} from '@ant-design/icons';
import moment from 'moment';
import { useGroups } from '../../context/GroupContext'; // Import useGroups hook

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// --- Sample Data (Replace with API calls) ---
const mockTemplates = [
    { key: 'tpl001', id: 'tpl001', name: '환영 메시지', title: '회원가입을 환영합니다!', content: '[이름]님, 밀리의 서재에 오신 것을 환영합니다! 지금 바로 첫 달 무료 혜택을 확인해보세요.' },
    { key: 'tpl003', id: 'tpl003', name: '독서 루틴 알림', title: '오늘의 독서, 시작하셨나요? 📚', content: '[이름]님, 잠시 밀리의 서재와 함께 마음의 양식을 쌓아보는 건 어때요? 꾸준한 독서는 성장의 밑거름이 됩니다.' },
];

const mockUsers = [
    { value: 'user001', label: '김민지 (user001@example.com)' },
    { value: 'user002', label: '이수현 (suhyun.lee@example.com)' },
    { value: 'user003', label: '박서준 (seo.park@example.com)' },
    { value: 'user004', label: '최유나 (yuna.choi@sample.net)' },
];

// --- Component ---
const NotificationDispatch = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { groups } = useGroups(); // Get groups from context
    const [targetType, setTargetType] = useState('all'); // all, group, individual
    const [dispatchTime, setDispatchTime] = useState('immediate'); // immediate, scheduled
    const [userSearchOptions, setUserSearchOptions] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]); // State for selected users [{ value, label }, ...]
    const [userSearchQuery, setUserSearchQuery] = useState(''); // State for search input
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewData, setPreviewData] = useState({});
    const [testRecipient, setTestRecipient] = useState('');
    const [testRecipientError, setTestRecipientError] = useState(null);
    const [noticeType, setNoticeType] = useState('regular'); // 'regular' or 'emergency'
    const [selectedGroupCount, setSelectedGroupCount] = useState(null);
    const [groupCountLoading, setGroupCountLoading] = useState(false); // State for loading count
    const [groupCountError, setGroupCountError] = useState(null); // State for count fetch error

    // Prepare group options for the select dropdown (Now includes ALL groups)
    const groupOptions = groups
        // .filter(group => !group.id.startsWith('ERR')) // Removed filter
        .map(group => ({ key: group.key, value: group.id, label: group.name, userCount: group.userCount || 0 })); // Assume userCount exists, default to 0

    // Load template when selected
    const handleTemplateChange = (templateId) => {
        const selectedTemplate = mockTemplates.find(t => t.id === templateId);
        if (selectedTemplate) {
            form.setFieldsValue({
                title: selectedTemplate.title,
                content: selectedTemplate.content,
            });
        } else {
            // Clear fields if "Direct Input" is selected
            form.setFieldsValue({ title: '', content: '' });
        }
    };

    // Handle user search for AutoComplete/Input
    const handleUserSearch = (searchText) => {
        setUserSearchQuery(searchText); // Keep track of the query
        if (!searchText) {
            setUserSearchOptions([]);
        } else {
            // Simulate API call or filter mockUsers
            // In a real app, debounce this call
            setUserSearchOptions(
                mockUsers.filter(user =>
                    user.label.toLowerCase().includes(searchText.toLowerCase())
                ).slice(0, 10) // Limit results displayed
            );
        }
    };

    // Handle adding a user to the selected list
    const handleAddUser = (userToAdd) => {
        if (!selectedUsers.find(u => u.value === userToAdd.value)) {
            const newSelectedUsers = [...selectedUsers, userToAdd];
            setSelectedUsers(newSelectedUsers);
            // Update form value with array of IDs
            form.setFieldsValue({ targetValue: newSelectedUsers.map(u => u.value) });
             // Clear search input and results after adding
             setUserSearchQuery('');
             setUserSearchOptions([]);
        }
    };

    // Handle removing a user from the selected list
    const handleRemoveUser = (userIdToRemove) => {
        const newSelectedUsers = selectedUsers.filter(u => u.value !== userIdToRemove);
        setSelectedUsers(newSelectedUsers);
        // Update form value
        form.setFieldsValue({ targetValue: newSelectedUsers.map(u => u.value) });
         // Trigger validation after removal if the list becomes empty
         if (newSelectedUsers.length === 0) {
             form.validateFields(['targetValue']);
         }
    };

    // Handle Group Selection Change with simulated async fetch
    const handleGroupChange = (groupId) => {
        setSelectedGroupCount(null); // Reset count
        setGroupCountError(null); // Reset error

        if (groupId) {
            setGroupCountLoading(true); // Start loading

            // Simulate API call delay
            setTimeout(() => {
                // Simulate success (80% chance) or failure (20% chance)
                const success = Math.random() < 0.8;

                if (success) {
                    const dummyCount = Math.floor(Math.random() * 5001);
                    setSelectedGroupCount(dummyCount);
                    setGroupCountError(null);
                } else {
                    setSelectedGroupCount(null);
                    setGroupCountError("그룹 관리에서 선택한 그룹의 결과 미리보기를 통해 정확한 오류내용을 확인해주세요");
                }
                setGroupCountLoading(false); // Stop loading
            }, 750); // Simulate 750ms network delay
        } else {
            setGroupCountLoading(false); // Stop loading if selection is cleared
        }
    };

    // Show preview
    const showPreview = () => {
        form.validateFields()
            .then(values => {
                setPreviewData({ ...values, noticeType }); // Include noticeType in preview data
                setTestRecipientError(null);
                setPreviewVisible(true);
            })
            .catch(info => {
                console.log('Validate Failed for Preview:', info);
                message.warning('미리보기를 위해 필수 항목을 입력해주세요.');
            });
    };

    // Handle final dispatch
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        const isEmergency = noticeType === 'emergency';

        let dispatchData = {
            ...values,
            noticeType: noticeType, // Add notice type
        };

        if (isEmergency) {
            // Emergency Notice Payload
            dispatchData = {
                noticeType: 'emergency',
                level: values.level,
                channel: values.channel,
                title: values.title,
                content: values.content,
                // Emergency notices are typically 'all' target and 'immediate' dispatch
                targetType: 'all',
                dispatchTime: 'immediate',
            };
             // Remove fields not applicable to emergency
             delete dispatchData.linkUrl;
             delete dispatchData.targetValue;
             delete dispatchData.scheduledTimeOption;
             delete dispatchData.scheduledTime;
        } else {
            // Regular Notice Payload (Adjust existing logic)
            dispatchData = {
                ...values,
                noticeType: 'regular',
                linkUrl: values.linkUrl || null,
                targetValue: targetType === 'all' ? null : values.targetValue,
                scheduledTime: dispatchTime === 'scheduled' ? values.scheduledTime?.format('YYYY-MM-DD HH:mm:ss') : null,
            };
             // Remove unnecessary fields for regular
             delete dispatchData.level; // Ensure level is not sent for regular
             delete dispatchData.scheduledTimeOption;
             if (dispatchTime === 'immediate') delete dispatchData.scheduledTime;
             if (targetType === 'all') delete dispatchData.targetValue;
        }

        // Note: Zero count check is now primarily handled before calling form.submit()
        // However, you might keep a secondary check here if needed for other submission paths.
        if (values.targetType === 'group' && selectedGroupCount === 0 && values.noticeType === 'regular') {
             console.error("Attempted to dispatch to a group with 0 users. This should have been caught earlier.");
             message.error('선택된 그룹의 대상 회원이 0명입니다. 발송할 수 없습니다.', 5);
             setPreviewVisible(false); // Close modal if somehow submitted
             return; // Prevent API call
        }

        message.loading({ content: '알림 발송 처리 중...', key: 'dispatch' });
        // TODO: Implement actual API call here
        // Consider using different endpoints for regular vs emergency notices
        console.log('Dispatching notification:', dispatchData);
        setTimeout(() => { // Simulate API delay
            message.success({
                content: (
                    <span>
                        알림 발송 요청이 완료되었습니다!
                        <a
                            href="/notifications/history"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/notifications/history');
                                message.destroy('dispatch');
                            }}
                            style={{ marginLeft: '8px', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            발송 내역 보러가기
                        </a>
                    </span>
                ),
                key: 'dispatch',
                duration: 5
            });
            setPreviewVisible(false); // Close preview modal on successful dispatch
        }, 1500);
    };

    // Handle Test Send to Me
    const handleSendToMe = () => {
        const channel = previewData?.channel;
        const inputLabel = channel === 'email' ? '테스트 이메일 주소' : '테스트 발송 번호';

        if (!testRecipient) {
            setTestRecipientError(`${inputLabel}를 입력해주세요.`);
            return;
        }
        if (channel === 'email' && !testRecipient.includes('@')) {
            setTestRecipientError('유효한 이메일 형식이 아닙니다.');
            return;
        }
        
        setTestRecipientError(null);

        const recipientType = channel === 'email' ? 'email' : 'phone';
        console.log(`Sending test notification via ${channel} to ${recipientType}:`, testRecipient);
        console.log('Test Notification Data:', previewData);
        const testData = {
            ...previewData,
            recipient: testRecipient,
            recipientType: recipientType,
        };

        message.loading({ content: `'${testRecipient}'(으)로 테스트 발송 중...`, key: 'testSend' });
        // TODO: Implement actual API call for test send
        console.log('Test dispatch data:', testData);
        setTimeout(() => { 
            message.success({ content: `'${testRecipient}'(으)로 테스트 발송 요청이 완료되었습니다!`, key: 'testSend', duration: 3 });
        }, 1500);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        setTestRecipientError(null);
        message.error('폼 입력 내용을 확인해주세요.');
    };

    const handleTestRecipientChange = (e) => {
        setTestRecipient(e.target.value);
        if (testRecipientError) {
            setTestRecipientError(null);
        }
    };

    // --- Handler for the final submit button in the modal ---
    const handleFinalSubmit = () => {
        // Perform the zero-user check before submitting the form
        const currentValues = form.getFieldsValue(); // Get current form values directly
        if (currentValues.noticeType === 'regular' && currentValues.targetType === 'group') {
            const selectedGroup = groupOptions.find(g => g.value === currentValues.targetValue);
            if (selectedGroup && selectedGroup.userCount === 0) {
                message.error('선택된 그룹의 대상 회원이 0명입니다. 발송할 수 없습니다.', 5);
                return; // Stop the submission
            }
        }
        // If the check passes, submit the form
        form.submit();
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>알림 발송</Title>
            <Card title="알림 내용 작성"> {/* Grouping content in a Card */}
                <Form
                    form={form}
                    layout="vertical"
                    name="notification_dispatch_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        channel: 'push', // Default channel
                        targetType: 'all',
                        scheduledTimeOption: 'immediate',
                        noticeType: 'regular', // Default notice type
                        level: 'info', // Default emergency level
                    }}
                >
                    {/* Notice Type Selection */}
                    <Form.Item name="noticeType" label="알림 종류">
                        <Radio.Group onChange={(e) => setNoticeType(e.target.value)} value={noticeType}>
                            <Radio value="regular">일반 알림</Radio>
                            <Radio value="emergency">긴급 공지</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Row gutter={16}> {/* Use Grid for layout */}
                        <Col xs={24} sm={12} md={8}>
                            <Form.Item
                                name="channel"
                                label="알림 채널"
                                rules={[{ required: true, message: '알림 채널을 선택해주세요!' }]}
                            >
                                <Select placeholder="채널 선택">
                                    <Option value="push"><BellOutlined /> 앱 푸시</Option>
                                    <Option value="email"><MailOutlined /> 이메일</Option>
                                    <Option value="sms"><MessageOutlined /> SMS</Option>
                                    {/* Add more channels */} 
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={16}>
                             <Form.Item label="템플릿 사용 (선택 사항)">
                                <Select
                                     placeholder="템플릿 선택 시 제목과 내용 자동 입력"
                                     allowClear
                                     onChange={handleTemplateChange}
                                     disabled={noticeType === 'emergency'} // Disable for emergency
                                >
                                     {mockTemplates.map(tpl => (
                                        <Option key={tpl.key} value={tpl.id}>{tpl.name}</Option>
                                     ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="title"
                        label="알림 제목"
                        rules={[{ required: true, message: '알림 제목을 입력해주세요!' }]}
                    >
                        <Input placeholder="알림 제목 입력 (예: 특별 할인 이벤트 안내)" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="알림 내용"
                        rules={[{ required: true, message: '알림 내용을 입력해주세요!' }]}
                        tooltip="알림 내용에 사용자별 데이터를 넣으려면 아래 변수를 사용하세요."
                        extra={
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px', textAlign: 'right' }}>
                                사용 가능한 변수: {' '}
                                <Tag>[이름]</Tag>
                                <Tag>[이메일]</Tag>
                            </Text>
                        }
                    >
                        <TextArea rows={6} placeholder="알림 내용 입력 (예: [이름]님, 오늘도 즐거운 하루보내세요!" />
                    </Form.Item>

                    {/* Added Link URL Input - Hide for Emergency */}
                     {noticeType === 'regular' && (
                        <Form.Item
                            name="linkUrl"
                            label="첨부 링크 (선택 사항)"
                            rules={[{ type: 'url', warningOnly: true, message: '유효한 URL 형식이 아닙니다.' }]}
                         >
                            <Input placeholder="알림에 포함할 링크 URL 입력 (예: https://example.com/event)" />
                         </Form.Item>
                     )}

                    {/* Conditional Rendering for Target and Schedule - Hide for Emergency */}
                    {noticeType === 'regular' && (
                        <>
                            <Divider>발송 대상 및 시점</Divider>

                            <Form.Item name="targetType" label="발송 대상">
                                <Radio.Group onChange={(e) => { setTargetType(e.target.value); setSelectedGroupCount(null); }} value={targetType}>
                                    <Radio value="all">전체 사용자</Radio>
                                    <Radio value="group">특정 그룹</Radio>
                                    <Radio value="individual">특정 사용자</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {targetType === 'group' && (
                                <Form.Item
                                    label="대상 그룹 선택" // Label remains the same
                                    required // Keep required rule if needed, validation handled separately
                                >
                                    {/* Remove Row/Col structure */}
                                    <Form.Item
                                        name="targetValue" // Name for the Select value
                                        noStyle // No extra styling from Form.Item wrapper
                                        rules={[{ required: true, message: '대상 그룹을 선택해주세요!' }]}
                                    >
                                        <Select
                                            placeholder="발송할 사용자 그룹 선택"
                                            onChange={handleGroupChange} // Use the handler to update dummy count
                                            style={{ width: '100%' }}
                                            allowClear // Allow clearing the selection
                                            // Disable select while loading count to prevent race conditions
                                            disabled={groupCountLoading}
                                        >
                                            {groupOptions.map(group => (
                                                <Option key={group.key} value={group.value}>
                                                    {group.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    {/* Display count/loading/error below the input box */}
                                    <div style={{ marginTop: '4px', minHeight: '22px' }}> {/* Add minHeight to prevent layout shift */}
                                        {groupCountLoading && (
                                            <Spin size="small" style={{ marginRight: '8px' }} />
                                        )}
                                        {groupCountLoading && <Text type="secondary">인원 수 확인 중...</Text>}

                                        {groupCountError && (
                                            <Text type="danger">{groupCountError}</Text>
                                        )}

                                        {!groupCountLoading && !groupCountError && selectedGroupCount !== null && (
                                            <Text type={selectedGroupCount === 0 ? 'danger' : 'secondary'}>
                                                예상 발송 대상: {selectedGroupCount.toLocaleString()}명 (테스트 값)
                                            </Text>
                                        )}
                                    </div>
                                </Form.Item>
                            )}

                            {targetType === 'individual' && (
                                <Form.Item
                                    label="대상 사용자 검색 및 추가"
                                    // We still need a Form.Item for the label and validation message area,
                                    // but the actual value control is managed manually via selectedUsers state.
                                    // The 'targetValue' field is set manually using form.setFieldsValue.
                                    // We add a hidden Form.Item linked to targetValue just for validation trigger.
                                    validateTrigger={['onChange', 'onBlur']} // Trigger validation when targetValue changes
                                >
                                    {/* Hidden field for validation */}
                                    <Form.Item name="targetValue" noStyle rules={[{ required: true, message: '대상 사용자를 1명 이상 추가해주세요!', type: 'array' }]} />

                                    {/* Search Input */}
                                    <AutoComplete
                                        options={userSearchOptions.map(user => {
                                             // Check if the user is already selected
                                             const isSelected = selectedUsers.some(selected => selected.value === user.value);
                                             return {
                                                 key: user.value,
                                                 value: user.label, // Show label in dropdown
                                                 label: (
                                                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                         {user.label}
                                                         <Button
                                                             type="link"
                                                             size="small"
                                                             onClick={(e) => { e.stopPropagation(); handleAddUser(user); }}
                                                             // Disable button if already selected
                                                             disabled={isSelected}
                                                         >
                                                             {/* Change button text if selected */}
                                                             {isSelected ? '추가됨' : '추가'}
                                                         </Button>
                                                     </div>
                                                 ),
                                                 // Store the full user object for handleAddUser
                                                 user: user
                                             };
                                         })}
                                        onSearch={handleUserSearch}
                                        onSelect={(value, option) => {
                                            // Handle selection directly from AutoComplete dropdown if needed
                                            handleAddUser(option.user); // Add the user object
                                        }}
                                        value={userSearchQuery} // Control input value
                                        onChange={(data) => setUserSearchQuery(data)} // Update query state
                                        placeholder="사용자 ID 또는 이름 검색"
                                        style={{ width: '100%' }}
                                    >
                                        {/* We use options prop, no need for Input child? Maybe for custom styling */}
                                         <Input />
                                    </AutoComplete>

                                    {/* Selected Users Display */}
                                     <div style={{ marginTop: '8px', maxHeight: '150px', overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: '2px', padding: '4px' }}>
                                         {selectedUsers.length === 0 ? (
                                             <Text type="secondary">검색 후 '추가' 버튼을 눌러 사용자를 추가하세요.</Text>
                                         ) : (
                                             <Space wrap size={[4, 8]}>
                                                 {selectedUsers.map(user => (
                                                     <Tag
                                                         key={user.value}
                                                         closable
                                                         onClose={() => handleRemoveUser(user.value)}
                                                         style={{ margin: '2px' }}
                                                     >
                                                         {user.label}
                                                     </Tag>
                                                 ))}
                                             </Space>
                                         )}
                                     </div>
                                </Form.Item>
                            )}

                            <Form.Item name="scheduledTimeOption" label="발송 시점">
                                <Radio.Group onChange={(e) => setDispatchTime(e.target.value)} value={dispatchTime}>
                                    <Radio value="immediate">즉시 발송</Radio>
                                    <Radio value="scheduled">예약 발송</Radio>
                                </Radio.Group>
                            </Form.Item>

                            {dispatchTime === 'scheduled' && (
                                <Form.Item
                                    name="scheduledTime"
                                    label="예약 시간"
                                    rules={[{ required: true, message: '예약 발송 시간을 선택해주세요!' }]}
                                >
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                                </Form.Item>
                            )}
                        </>
                    )}

                    <Divider />

                    <Form.Item>
                        <Button
                             type="dashed"
                             icon={<EyeOutlined />}
                             onClick={showPreview}
                             // Disable button logic
                             disabled={
                                 noticeType === 'regular' &&
                                 targetType === 'group' &&
                                 (selectedGroupCount === 0 || groupCountError !== null)
                             }
                        >
                            미리보기
                        </Button>
                    </Form.Item>
                </Form>
            </Card>

            {/* Preview Modal with updated Footer AND Input inside */}
            <Modal
                title="알림 미리보기"
                open={previewVisible}
                onCancel={() => {
                    setPreviewVisible(false);
                    setTestRecipientError(null);
                }}
                footer={[
                     // Final Submit Button - Uses the new handler
                    <Button key="submit" type="primary" icon={<SendOutlined />} onClick={handleFinalSubmit}>
                        알림 발송
                    </Button>,
                ]}
                width={600}
            >
                {previewData && (
                    <Descriptions bordered column={1} size="small">
                         {/* Show Notice Type and Level for Emergency */}
                         {previewData.noticeType === 'emergency' && (
                             <>
                                 <Descriptions.Item label="알림 종류" labelStyle={{ width: '100px' }}>
                                     <Text type="danger">긴급 공지</Text>
                                 </Descriptions.Item>
                             </>
                         )}

                        <Descriptions.Item label="채널" labelStyle={{ width: '100px' }}>
                            {previewData.channel === 'push' && <><BellOutlined /> 앱 푸시</>}
                            {previewData.channel === 'email' && <><MailOutlined /> 이메일</>}
                            {previewData.channel === 'sms' && <><MessageOutlined /> SMS</>}
                            {!['push', 'email', 'sms'].includes(previewData.channel) && previewData.channel}
                        </Descriptions.Item>
                        <Descriptions.Item label="발송 대상" labelStyle={{ width: '100px' }}>
                            {previewData.noticeType === 'emergency' && '전체 사용자 (긴급)'}
                            {previewData.noticeType === 'regular' && previewData.targetType === 'all' && '전체 사용자'}
                            {previewData.noticeType === 'regular' && previewData.targetType === 'group' &&
                                `그룹 (${groupOptions.find(g=>g.value === previewData.targetValue)?.label || previewData.targetValue})` +
                                (selectedGroupCount !== null ? ` (${selectedGroupCount.toLocaleString()}명)` : '')
                            }
                            {previewData.noticeType === 'regular' && previewData.targetType === 'individual' &&
                                `특정 사용자 (${previewData.targetValue?.length || 0}명)`
                            }
                        </Descriptions.Item>
                        <Descriptions.Item label="발송 시점" labelStyle={{ width: '100px' }}>
                            {previewData.noticeType === 'emergency' && '즉시 발송 (긴급)'}
                            {previewData.noticeType === 'regular' && (
                                previewData.scheduledTimeOption === 'immediate' ? '즉시 발송' :
                                (previewData.scheduledTime ? `예약 발송 (${moment(previewData.scheduledTime).format('YYYY-MM-DD HH:mm:ss')})` : '예약 발송 (시간 미정)')
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="알림 제목" labelStyle={{ width: '100px' }}>{previewData.title}</Descriptions.Item>
                        <Descriptions.Item label="알림 내용" labelStyle={{ width: '100px' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>
                                {previewData.content}
                            </pre>
                        </Descriptions.Item>
                    </Descriptions>
                 )}
                  {/* Test Send Input and Button Row */}
                     <Form layout="vertical" style={{ marginTop: '16px' }}>
                          <Form.Item
                              label={previewData?.channel === 'email' ? "테스트 이메일" : "테스트 번호"}
                              tooltip={`'나에게 알림 발송' 버튼을 사용하려면 ${previewData?.channel === 'email' ? '이메일을' : '번호를'} 입력하세요.`}
                              validateStatus={testRecipientError ? 'error' : ''}
                              help={testRecipientError || ''}
                          >
                              <Space.Compact block style={{ width: '100%' }}>
                                  <Input
                                      placeholder={previewData?.channel === 'email'
                                          ? "이메일 주소 입력 (예: test@example.com)"
                                          : "숫자만 입력 (예: 01012345678)"}
                                      value={testRecipient}
                                      onChange={handleTestRecipientChange}
                                      allowClear
                                  />
                                  <Button
                                      key="test"
                                      onClick={handleSendToMe}
                                      icon={<MobileOutlined />}
                                  >
                                      나에게 알림 발송
                                  </Button>
                              </Space.Compact>
                          </Form.Item>
                     </Form>
             </Modal>
        </Space>
    );
};

export default NotificationDispatch;