import React, { useState, useEffect, useMemo, useContext } from 'react';
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
    HolderOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

// Sample Data
const initialPopups = [
    { key: 'p1', id: 'pop001', name: '신규 기능 안내', status: true, startDate: '2024-07-01 00:00', endDate: '2024-07-31 23:59', frequencyType: 'once_per_day', frequencyValue: null, targetAudience: ['all'], targetPages: ['/dashboard'], priority: 1, creationDate: '2024-06-30' },
    { key: 'p2', id: 'pop002', name: '블랙프라이데이 할인', status: false, startDate: '2024-11-20 00:00', endDate: '2024-11-30 23:59', frequencyType: 'once_per_session', frequencyValue: null, targetAudience: ['vip', 'group_A'], targetPages: ['/products', '/sale'], priority: 5, creationDate: '2024-11-01' },
    { key: 'p3', id: 'pop003', name: '긴급 시스템 점검', status: true, startDate: '2024-07-28 18:00', endDate: '2024-07-29 06:00', frequencyType: 'every_time', frequencyValue: null, targetAudience: ['all'], targetPages: ['/'], priority: 10, creationDate: '2024-07-28' },
    { key: 'p4', id: 'pop004', name: 'N시간마다 노출 테스트', status: true, startDate: '2024-07-01 00:00', endDate: '2024-08-31 23:59', frequencyType: 'every_n_hours', frequencyValue: 3, targetAudience: ['tester_group'], targetPages: ['/test'], priority: 2, creationDate: '2024-06-15' },
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

// --- @dnd-kit Row Components (Moved outside PopupExposureSettings) ---
// Ensure RowContext is defined before Row component that uses it
const RowContext = React.createContext({});

// Corrected DragHandle component
const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  // ... existing code ... // This placeholder was incorrect
  return (
    // DragHandle should return only the button
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'move' }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
    /* Incorrect return from previous step removed
    // Ensure RowContext.Provider uses the correctly defined RowContext
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
    */
  );
};

// Re-added and corrected Row component
const Row = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999, cursor: 'grabbing' } : {}),
  };

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

// --- Component ---
const PopupExposureSettings = () => {
    const [popups, setPopups] = useState(initialPopups);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [form] = Form.useForm();

    // Fetch data based on filters - Temporarily disabled for DND testing
    /*
    useEffect(() => {
        fetchData();
    }, [filters]);
    */

    // Temporarily disable fetchData content
    const fetchData = () => {
        /*
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
        */
         console.log("fetchData temporarily disabled for DND testing.");
         // Ensure loading is false if fetchData is called elsewhere unexpectedly
         setLoading(false);
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
        { key: 'sort', align: 'center', width: 60, render: () => <DragHandle /> },
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: '팝업 이름',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: '등록일',
            dataIndex: 'creationDate',
            key: 'creationDate',
            width: 120,
            render: (date) => moment(date).isValid() ? moment(date).format('YYYY-MM-DD') : '-', // Format date
            sorter: (a, b) => moment(a.creationDate).unix() - moment(b.creationDate).unix(),
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
            ),
            sorter: (a, b) => moment(a.startDate || 0).unix() - moment(b.startDate || 0).unix(),
        },
        {
            title: '우선순위',
            dataIndex: 'priority',
            key: 'priority',
            width: 100,
            align: 'right',
            sorter: (a,b)=> (a.priority || 0) - (b.priority || 0)
        },
        {
            title: '설정 관리',
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

    const onDragEnd = ({ active, over }) => {
        console.log('onDragEnd triggered:', { active, over }); // Log drag end event
        if (active.id !== over?.id) {
            setPopups((prevPopups) => {
                const activeIndex = prevPopups.findIndex((record) => record.key === active.id);
                const overIndex = prevPopups.findIndex((record) => record.key === over?.id);
                console.log(`Moving from index ${activeIndex} to ${overIndex}`); // Log indices
                if (activeIndex !== -1 && overIndex !== -1) {
                    let newOrder = arrayMove(prevPopups, activeIndex, overIndex);
                    // Update the priority based on the new order
                    newOrder = newOrder.map((popup, index) => ({
                        ...popup,
                        priority: index + 1, // Assign priority based on 0-based index + 1
                    }));

                    // TODO: Add API call here to save the new order and priorities
                    console.log('New popup order with updated priorities:', newOrder);
                    message.success('팝업 순서 및 우선순위가 변경되었습니다. (저장 필요)');
                    return newOrder;
                } else {
                    return prevPopups;
                }
            });
        }
    };

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

                <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
                    <SortableContext items={popups.map(i => i.key)} strategy={verticalListSortingStrategy}>
                        <Table
                            columns={columns}
                            dataSource={popups}
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1100 }}
                            bordered
                            size="small"
                            rowKey="key"
                            components={{ body: { row: Row } }}
                        />
                    </SortableContext>
                </DndContext>
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