import React, { useState, useEffect } from 'react';
import {
    Table,
    Tag,
    Switch,
    Button,
    Space,
    Typography,
    Card,
    Modal,
    Form,
    DatePicker,
    Select,
    Checkbox,
    InputNumber,
    Input,
    message,
    Tooltip,
} from 'antd';
import {
    SettingOutlined,
    EditOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    SearchOutlined,
    ReloadOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// Sample Data
const initialPopups = [
    { key: 'p1', id: 'pop001', name: '신규 기능 안내', status: true, startDate: '2024-07-01 00:00', endDate: '2024-07-31 23:59', frequencyType: 'once_per_day', frequencyValue: null, targetAudience: ['all'], targetPages: ['/dashboard'], priority: 1 },
    { key: 'p2', id: 'pop002', name: '블랙프라이데이 할인', status: false, startDate: '2024-11-20 00:00', endDate: '2024-11-30 23:59', frequencyType: 'once_per_session', frequencyValue: null, targetAudience: ['vip', 'group_A'], targetPages: ['/products', '/sale'], priority: 5 },
    { key: 'p3', id: 'pop003', name: '긴급 시스템 점검', status: true, startDate: '2024-07-28 18:00', endDate: '2024-07-29 06:00', frequencyType: 'every_time', frequencyValue: null, targetAudience: ['all'], targetPages: ['/'], priority: 10 }, // Highest priority
    { key: 'p4', id: 'pop004', name: 'N시간마다 노출 테스트', status: true, startDate: '2024-07-01 00:00', endDate: '2024-08-31 23:59', frequencyType: 'every_n_hours', frequencyValue: 3, targetAudience: ['tester_group'], targetPages: ['/test'], priority: 2 },
];

// Mock data for Select options
const userSegments = [
    { value: 'all', label: '전체 사용자' },
    { value: 'new_7d', label: '신규 가입자 (7일)' },
    { value: 'vip', label: 'VIP 등급' },
    { value: 'group_A', label: '사용자 그룹 A' },
    { value: 'tester_group', label: '테스터 그룹' },
];

const frequencyMap = {
    once_per_session: '세션당 한 번',
    once_per_day: '하루에 한 번',
    every_time: '매번 노출',
    every_n_hours: 'N 시간마다',
};

// --- Component ---
const PopupExposureSettings = () => {
    const [popups, setPopups] = useState(initialPopups);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [form] = Form.useForm();

    // Fetch data based on filters
    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = () => {
        setLoading(true);
        console.log("Fetching popups with filters:", filters);
        // TODO: Replace with API call
        setTimeout(() => { // Simulate API delay
            let filteredData = initialPopups;
            if (filters.status !== undefined && filters.status !== 'all') {
                filteredData = filteredData.filter(p => p.status === (filters.status === 'active'));
            }
            if (filters.search) {
                const term = filters.search.toLowerCase();
                filteredData = filteredData.filter(p =>
                    p.id.toLowerCase().includes(term) ||
                    p.name.toLowerCase().includes(term)
                );
            }
            setPopups(filteredData);
            setLoading(false);
        }, 300);
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const handleResetFilters = () => {
        setFilters({});
        // Refetch - handled by useEffect
    };

    // --- Status Toggle --- 
    const handleStatusChange = (popupId, checked) => {
        message.loading({ content: `'${popupId}' 상태 변경 중...`, key: popupId });
        // TODO: API call to update status
        console.log(`Changing status for ${popupId} to ${checked}`);
        setTimeout(() => {
            setPopups(prev => prev.map(p => p.id === popupId ? { ...p, status: checked } : p));
            message.success({ content: `'${popupId}' 팝업 상태가 ${checked ? '활성' : '비활성'}(으)로 변경되었습니다.`, key: popupId });
        }, 500);
    };

    // --- Edit Modal --- 
    const showEditModal = (popup) => {
        setEditingPopup(popup);
        form.setFieldsValue({
            ...popup,
            exposurePeriod: [moment(popup.startDate), moment(popup.endDate)],
            frequencyHours: popup.frequencyType === 'every_n_hours' ? popup.frequencyValue : undefined,
             targetPages: Array.isArray(popup.targetPages) ? popup.targetPages.join(', ') : popup.targetPages, // Join array for TextArea
        });
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingPopup(null);
        form.resetFields();
    };

    const handleModalOk = () => {
        form.validateFields()
            .then(values => {
                setLoading(true);
                message.loading({ content: `'${editingPopup?.name}' 설정 저장 중...`, key: 'popupEdit' });

                const updatedData = { ...editingPopup, ...values };

                if (values.exposurePeriod) {
                    updatedData.startDate = values.exposurePeriod[0].toISOString();
                    updatedData.endDate = values.exposurePeriod[1].toISOString();
                    delete updatedData.exposurePeriod;
                }
                if (values.frequencyType === 'every_n_hours') {
                    updatedData.frequencyValue = values.frequencyHours;
                 } else {
                     updatedData.frequencyValue = null;
                 }
                 delete updatedData.frequencyHours;

                 // Convert targetPages string back to array if needed by backend
                 if (typeof values.targetPages === 'string') {
                     updatedData.targetPages = values.targetPages.split(',').map(s => s.trim()).filter(Boolean);
                 }

                 console.log('Updated Popup Data:', updatedData);

                 // TODO: API call to update popup settings
                 setTimeout(() => { // Simulate API delay
                     setPopups(prev => prev.map(p => p.key === editingPopup.key ? updatedData : p));
                     message.success({ content: `'${editingPopup?.name}' 팝업 설정이 저장되었습니다.`, key: 'popupEdit' });
                     handleModalCancel();
                     setLoading(false);
                 }, 800);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                setLoading(false); // Ensure loading indicator stops on validation failure
             });
    };

    // --- Table Columns ---
    const columns = [
        {
            title: '팝업 ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: '팝업명',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            width: 80,
            align: 'center',
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={(checked) => handleStatusChange(record.id, checked)}
                    checkedChildren={<EyeOutlined />}
                    unCheckedChildren={<EyeInvisibleOutlined />}
                />
            )
        },
        {
            title: '노출 기간',
            key: 'period',
            width: 220,
            render: (_, record) => (
                 `${moment(record.startDate).format('YY/MM/DD HH:mm')} ~ ${moment(record.endDate).format('YY/MM/DD HH:mm')}`
            )
        },
        {
             title: '노출 빈도',
             key: 'frequency',
             width: 150,
             render: (_, record) => (
                 `${frequencyMap[record.frequencyType] || record.frequencyType}` +
                 `${record.frequencyType === 'every_n_hours' ? ` (${record.frequencyValue}시간)` : ''}`
             )
        },
         {
            title: '대상',
             dataIndex: 'targetAudience',
             key: 'targetAudience',
             width: 150,
             ellipsis: true,
             render: (targets) => (Array.isArray(targets) ? targets.join(', ') : targets)
        },
         {
             title: '우선순위',
             dataIndex: 'priority',
             key: 'priority',
             width: 80,
             align: 'right',
             sorter: (a, b) => a.priority - b.priority,
         },
        {
            title: '관리',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Tooltip title="노출 설정 수정">
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
                </Tooltip>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><SettingOutlined /> 팝업 노출 설정</Title>
            <Text>생성된 팝업들의 노출 기간, 빈도, 대상 등 상세 설정을 관리합니다.</Text>

            <Card>
                <Space style={{ marginBottom: 16 }} wrap>
                    <Input.Search
                        placeholder="팝업 ID 또는 이름 검색"
                        allowClear
                        onSearch={(value) => handleFilterChange('search', value)}
                         onChange={(e) => !e.target.value && handleFilterChange('search', '')}
                        style={{ width: 250 }}
                    />
                    <Select
                        placeholder="상태 필터"
                        allowClear
                        style={{ width: 100 }}
                        onChange={(value) => handleFilterChange('status', value)}
                         value={filters.status !== undefined ? filters.status : 'all'} // Control Select value
                     >
                         <Option value="all">전체 상태</Option>
                         <Option value="active">활성</Option>
                         <Option value="inactive">비활성</Option>
                     </Select>
                    <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>초기화</Button>
                </Space>

                <Table
                    columns={columns}
                    dataSource={popups}
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1100 }}
                    bordered
                    size="small"
                    rowKey="key"
                />
            </Card>

            {/* Edit Settings Modal */}
            <Modal
                title={`팝업 설정 수정: ${editingPopup?.name}`}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="저장"
                cancelText="취소"
                confirmLoading={loading} // Show loading state on OK button
                 width={600}
                 destroyOnClose
            >
                <Form form={form} layout="vertical" name="popup_settings_form">
                     <Form.Item
                         name="exposurePeriod"
                         label={<><CalendarOutlined /> 노출 기간</>}
                         rules={[{ required: true, message: '노출 기간을 선택해주세요.' }]}
                     >
                         <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                     </Form.Item>

                     <Form.Item label="노출 빈도" required>
                        <Input.Group compact>
                            <Form.Item name="frequencyType" noStyle rules={[{ required: true }]}>
                                <Select style={{ width: '60%' }}>
                                    {Object.entries(frequencyMap).map(([key, text]) => (
                                         <Option key={key} value={key}>{text}</Option>
                                     ))}
                                </Select>
                            </Form.Item>
                            <Form.Item noStyle dependencies={['frequencyType']}>
                                {(formInstance) =>
                                    formInstance.getFieldValue('frequencyType') === 'every_n_hours' ? (
                                        <Form.Item name="frequencyHours" noStyle rules={[{ required: true, message: '시간 입력'}]}>
                                            <InputNumber min={1} max={168} addonAfter="시간" style={{ width: '40%' }} placeholder="시간"/>
                                        </Form.Item>
                                    ) : null
                                }
                            </Form.Item>
                        </Input.Group>
                     </Form.Item>

                     <Form.Item
                         name="targetAudience"
                         label="대상 설정"
                         rules={[{ required: true, message: '대상을 선택해주세요.' }]}
                     >
                         <Checkbox.Group options={userSegments} />
                     </Form.Item>

                     <Form.Item
                         name="targetPages"
                         label="노출 페이지 (쉼표로 구분)"
                     >
                         <TextArea rows={2} placeholder="/, /dashboard, /products/*"/>
                     </Form.Item>

                     <Form.Item
                         name="priority"
                         label="우선순위 (높을수록 먼저 노출)"
                         rules={[{ required: true, type: 'number', message: '숫자를 입력하세요.' }]}
                     >
                         <InputNumber min={0} style={{ width: 100 }} />
                     </Form.Item>

                     <Form.Item name="status" label="활성 상태" valuePropName="checked">
                         <Switch checkedChildren="활성" unCheckedChildren="비활성" />
                     </Form.Item>
                 </Form>
             </Modal>
        </Space>
    );
};

export default PopupExposureSettings; 