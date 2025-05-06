import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
    Table,
    Tag,
    Switch,
    Button,
    Modal,
    Form,
    DatePicker,
    Select,
    Radio, // Changed from Checkbox for simpler audience target example
    InputNumber,
    Space,
    Typography,
    message,
    Tooltip,
    Input,
} from 'antd';
import {
    SettingOutlined,
    FilterOutlined,
    SearchOutlined,
    CalendarOutlined,
    ClockCircleOutlined,
    UserOutlined, // Target audience icon
    CheckCircleOutlined,
    StopOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

// --- Sample Data (Popups created via PopupCreate) ---
const initialPopups = [
    { key: 'pop1', id: 'P001', name: '여름맞이 특별 이벤트 팝업', type: 'image', status: true, startDate: '2024-07-20 00:00:00', endDate: '2024-08-31 23:59:59', frequency: 'daily', targetAudience: 'all', priority: 1, position: 'center' },
    { key: 'pop2', id: 'P002', name: '신규 기능 안내 (템플릿)', type: 'template', status: true, startDate: '2024-07-25 10:00:00', endDate: '2024-08-10 23:59:59', frequency: 'once', targetAudience: 'loggedIn', priority: 5, position: 'top' },
    { key: 'pop3', id: 'P003', name: '마케팅 수신 동의 팝업', type: 'template', status: false, startDate: '2024-06-01 00:00:00', endDate: '2024-12-31 23:59:59', frequency: 'session', targetAudience: 'loggedIn_non_marketing_agreed', priority: 10, position: 'bottom-right' },
    { key: 'pop4', id: 'P004', name: '서버 점검 안내', type: 'image', status: false, startDate: '2024-07-30 22:00:00', endDate: '2024-07-31 06:00:00', frequency: 'always', targetAudience: 'all', priority: 100, position: 'center' },
];

// --- Helper Functions ---
const getStatusTag = (status) => {
    return status ? <Tag icon={<CheckCircleOutlined />} color="success">활성</Tag> : <Tag icon={<StopOutlined />} color="default">비활성</Tag>;
};

const formatFrequency = (freq) => {
    switch(freq){
        case 'daily': return '하루 한 번';
        case 'once': return '다시 보지 않음';
        case 'session': return '세션 당 한 번';
        case 'always': return '매번 (주의)';
        default: return freq;
    }
};

const formatTargetAudience = (target) => {
    switch(target){
        case 'all': return '전체 사용자';
        case 'loggedIn': return '로그인 사용자';
        case 'loggedIn_non_marketing_agreed': return '로그인 (마케팅 미동의)';
        default: return target;
    }
}

// --- Draggable Row Setup ---
const type = 'DraggableBodyRow';

const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
    const ref = useRef(null);
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: (monitor) => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: (item) => {
            moveRow(item.index, index);
        },
    });
    const [, drag] = useDrag({
        type,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));
    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ''}`}
            style={{ cursor: 'move', ...style }}
            {...restProps}
        />
    );
};

// --- Component ---
const PopupExposureSettings = () => {
    const [popups, setPopups] = useState(initialPopups);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ status: null });

    // --- Search & Filter ---
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

     const handleFilterChange = (type, value) => {
         if (type === 'status') {
             const statusValue = value === 'all' ? null : value === 'true';
             setFilters(prev => ({ ...prev, status: statusValue }));
         } else {
             setFilters(prev => ({ ...prev, [type]: value === 'all' ? null : value }));
         }
    };

    const filteredPopups = useMemo(() => {
        return popups.filter(popup => {
            const matchesSearch = searchText
                ? popup.name.toLowerCase().includes(searchText)
                : true;
             let matchesStatus = true;
             if (filters.status !== null) {
                 matchesStatus = popup.status === filters.status;
             }
            return matchesSearch && matchesStatus;
        });
    }, [popups, searchText, filters]);

    // --- Modal Handling ---
    const showEditModal = (popup) => {
        setEditingPopup(popup);
        // Ensure date values are moment objects for RangePicker
        const startDate = popup.startDate ? moment(popup.startDate) : null;
        const endDate = popup.endDate ? moment(popup.endDate) : null;
        form.setFieldsValue({
            ...popup,
            exposurePeriod: (startDate && endDate) ? [startDate, endDate] : null,
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingPopup(null);
        form.resetFields();
    };

    // --- Form Submission (Edit Settings) ---
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const processedValues = {
                    ...values,
                    startDate: values.exposurePeriod ? values.exposurePeriod[0].format('YYYY-MM-DD HH:mm:ss') : null,
                    endDate: values.exposurePeriod ? values.exposurePeriod[1].format('YYYY-MM-DD HH:mm:ss') : null,
                    exposurePeriod: undefined, // Remove RangePicker value
                };
                delete processedValues.exposurePeriod;

                setPopups(prevPopups =>
                    prevPopups.map(p => p.key === editingPopup.key ? { ...p, ...processedValues } : p)
                );
                message.success(`'${editingPopup.name}' 팝업 설정이 수정되었습니다.`);
                // TODO: API call to update popup settings
                console.log('Updated settings for popup:', editingPopup.id, processedValues);
                handleCancel(); // Close modal
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('폼 입력값을 확인해주세요.');
            });
    };

    // --- Row Move Logic ---
    const moveRow = useCallback(
        (dragIndex, hoverIndex) => {
            const dragRow = popups[dragIndex];
            setPopups(
                update(popups, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, dragRow],
                    ],
                }),
            );
            // TODO: API call to save the new order/priorities
            console.log('Moved popup:', dragRow.id, 'from index', dragIndex, 'to index', hoverIndex);
             message.info(`팝업 순서가 변경되었습니다. (저장 필요)`, 0.5);
        },
        [popups],
    );

     // --- Direct Status Toggle --- 
     const handleStatusToggle = (key, checked) => {
        setPopups(prevPopups =>
            prevPopups.map(p => p.key === key ? { ...p, status: checked } : p)
        );
        message.success(`팝업 상태가 ${checked ? '활성' : '비활성'}으로 변경되었습니다.`);
         // TODO: API call to update status immediately
         console.log(`Toggled status for popup key ${key} to ${checked}`);
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        { title: '팝업 이름', dataIndex: 'name', key: 'name', ellipsis: true },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 100, align: 'center',
            render: (status, record) => (
                 <Switch
                    checked={status}
                    onChange={(checked) => handleStatusToggle(record.key, checked)}
                    checkedChildren="활성"
                    unCheckedChildren="비활성"
                 />
            ),
             filters: [
                 { text: '활성', value: 'true' }, // Use string for filter value
                 { text: '비활성', value: 'false' },
            ],
            // Filter logic handled in useMemo
            // onFilter: (value, record) => record.status.toString() === value,
        },
        {
            title: '노출 기간', key: 'exposure', width: 250,
            render: (_, record) => (
                record.startDate && record.endDate
                    ? `${moment(record.startDate).format('YY/MM/DD HH:mm')} ~ ${moment(record.endDate).format('YY/MM/DD HH:mm')}`
                    : '-'
            ),
             sorter: (a, b) => moment(a.startDate || 0).unix() - moment(b.startDate || 0).unix(),
        },
        {
            title: '노출 위치', dataIndex: 'position', key: 'position', width: 120,
            render: (position) => {
                switch(position) {
                    case 'center': return '중앙';
                    case 'top': return '상단';
                    case 'bottom-right': return '우측 하단';
                    default: return position || '-';
                }
            }
        },
        { title: '노출 대상', dataIndex: 'targetAudience', key: 'targetAudience', width: 150, render: formatTargetAudience }, // Simplify display
        { title: '우선순위', dataIndex: 'priority', key: 'priority', width: 100, align: 'right', sorter: (a,b)=> (a.priority || 0) - (b.priority || 0) },
        {
            title: '설정 관리',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Tooltip title="상세 설정 수정">
                    <Button icon={<SettingOutlined />} onClick={() => showEditModal(record)} size="small" />
                </Tooltip>
                // Could add a 'Delete' button here as well
            ),
        },
    ];

    return (
        <DndProvider backend={HTML5Backend}>
            <Space direction="vertical" size="large" style={{ display: 'flex' }}>
                <Title level={2}>팝업 노출 설정</Title>
                <Text type="secondary">생성된 팝업들의 노출 기간, 빈도, 대상 등 상세 규칙을 설정하고 관리합니다. (행을 드래그하여 우선순위 변경)</Text>

                 {/* Search and Filter Controls */}
                <Space wrap style={{ marginBottom: 16 }}>
                     <Search
                        placeholder="팝업 이름 검색"
                        allowClear
                        enterButton={<><SearchOutlined /> 검색</>}
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                     />
                    <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                     <Select
                        defaultValue="all"
                        style={{ width: 120 }}
                        onChange={(value) => handleFilterChange('status', value)}
                        aria-label="상태 필터"
                    >
                        <Option value="all">전체 상태</Option>
                        <Option value="true">활성</Option>
                        <Option value="false">비활성</Option>
                    </Select>
                    {/* Add more filters if needed (e.g., by target audience) */}
                </Space>

                <Table
                    columns={columns}
                    dataSource={popups}
                    pagination={false}
                    rowKey="key"
                    scroll={{ x: 1000 }}
                    components={{
                        body: {
                            row: DraggableBodyRow,
                        },
                    }}
                    onRow={(record, index) => ({
                         index,
                        moveRow,
                     })}
                />

                {/* Edit Settings Modal */}
                <Modal
                    title={`'${editingPopup?.name}' 팝업 설정 수정`}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="저장"
                    cancelText="취소"
                    destroyOnClose
                    width={700}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        name="popup_settings_form"
                    >
                         {/* Include fields editable here - mirroring some from PopupCreate */}
                         <Form.Item name="status" label="상태" valuePropName="checked">
                             <Switch checkedChildren="활성" unCheckedChildren="비활성" />
                        </Form.Item>

                         <Form.Item
                            name="exposurePeriod"
                            label="노출 기간"
                            rules={[{ required: true, message: '노출 시작일과 종료일을 선택해주세요!' }]}
                        >
                            <RangePicker
                                 showTime
                                 format="YYYY-MM-DD HH:mm:ss"
                                 style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="frequency"
                            label="노출 빈도"
                            rules={[{ required: true }]}
                         >
                             <Select>
                                 <Option value="daily"><ClockCircleOutlined /> 하루에 한 번</Option>
                                 <Option value="once"><StopOutlined /> 다시 보지 않음</Option>
                                 <Option value="session"><ClockCircleOutlined /> 세션 당 한 번</Option>
                                 <Option value="always"><WarningOutlined /> 매번 (주의)</Option>
                             </Select>
                         </Form.Item>

                        <Form.Item
                             name="position"
                             label="노출 위치"
                             rules={[{ required: true, message: '팝업이 표시될 위치를 선택해주세요!' }]}
                         >
                             <Select placeholder="노출 위치 선택">
                                 <Option value="center">중앙</Option>
                                 <Option value="top">상단</Option>
                                 <Option value="bottom-right">우측 하단</Option>
                             </Select>
                         </Form.Item>

                        <Form.Item name="targetAudience" label="노출 대상" rules={[{ required: true }]}>
                             <Radio.Group>
                                 <Radio value="all"><UserOutlined /> 전체 사용자</Radio>
                                 <Radio value="loggedIn"><UserOutlined /> 로그인 사용자</Radio>
                                 {/* Add more options if needed, potentially fetching from backend */}
                                  <Radio value="loggedIn_non_marketing_agreed"><UserOutlined /> 로그인 (마케팅 미동의)</Radio>
                             </Radio.Group>
                         </Form.Item>
                        {/* Add more detailed targeting: OS, Device, User Groups etc. */}
                         {/* <Form.Item name="targetOS" label="Target OS"><Checkbox.Group options={['iOS', 'Android']} /></Form.Item> */} 

                         <Form.Item
                             name="priority"
                             label="우선순위"
                             tooltip="숫자가 낮을수록 우선 노출됩니다 (동시에 여러 팝업 조건 충족 시)"
                             rules={[{ required: true, type: 'number', min: 1, message:'우선순위는 1 이상의 숫자여야 합니다.'}]}
                         >
                             <InputNumber min={1} style={{ width: 100 }} />
                         </Form.Item>

                    </Form>
                </Modal>
            </Space>
        </DndProvider>
    );
};

export default PopupExposureSettings; 