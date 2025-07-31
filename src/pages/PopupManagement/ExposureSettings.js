import {
  CalendarOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileImageOutlined,
  FolderOpenOutlined,
  HolderOutlined,
  ProfileOutlined,
  RightOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Badge,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import moment from 'moment';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { usePopupTemplates } from '../../context/PopupTemplateContext';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const generateInitialPopups = () => {
    const now = moment();
    return [
        // 1. 수동 설정 (고정값 표시)
        { key: 'p1', id: 'pop001', name: '신규 기능 안내 (고정 D-39)', status: true, startDate: '2024-09-10 00:00', endDate: '2024-09-22 10:00', frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/dashboard'], priority: 1, creationDate: '2024-08-01', contentType: 'template', templateId: '신규 기능 안내 템플릿', displayRemainingTime: 'D-39' },
        { key: 'p5', id: 'pop005', name: '대시보드 전용 공지 (고정 162분)', status: true, startDate: now.clone().add(162, 'minutes').format('YYYY-MM-DD HH:mm'), endDate: now.clone().add(1, 'day').format('YYYY-MM-DD HH:mm'), frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/dashboard'], priority: 2, creationDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD'), contentType: 'template', templateId: '긴급 공지 팝업 템플릿', displayRemainingTime: '162분' },

        // 2. 노출 종료
        { key: 'p2', id: 'pop002', name: '블랙프라이데이 (종료됨)', status: false, startDate: '2023-11-20 00:00', endDate: '2023-11-30 23:59', frequencyType: 'once_per_session', targetAudience: ['vip', 'group_A'], targetPages: ['/sale'], priority: 1, creationDate: '2023-11-01', contentType: 'image', imageUrl: 'https://via.placeholder.com/300x200.png?text=Black+Friday', linkUrl: 'https://example.com/sale' },

        // 3. 시작 전
        {
            key: 'p8', id: 'pop008', name: '출시 예고 (10일 뒤 시작)', status: true,
            startDate: now.clone().add(10, 'days').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(20, 'days').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/upcoming'],
            priority: 1, creationDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD'), contentType: 'template',
            templateId: '신규 기능 안내 템플릿'
        },
        {
            key: 'p9', id: 'pop009', name: '타임세일 (5시간 뒤 시작)', status: true,
            startDate: now.clone().add(5, 'hours').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(1, 'day').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'once_per_session', targetAudience: ['vip'], targetPages: ['/sale'],
            priority: 2, creationDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD'), contentType: 'image',
            imageUrl: 'https://via.placeholder.com/300x150.png?text=Time+Sale+Soon', linkUrl: 'https://example.com/sale-soon'
        },
        {
            key: 'p10', id: 'pop010', name: '긴급 설문 (30분 뒤 시작)', status: true,
            startDate: now.clone().add(30, 'minutes').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(2, 'hours').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'every_time', targetAudience: ['loggedIn'], targetPages: ['/survey'],
            priority: 1, creationDate: now.clone().subtract(1, 'hour').format('YYYY-MM-DD'), contentType: 'template',
            templateId: '설문 참여 독려 템플릿'
        },

        // 4. 진행 중
        {
            key: 'p11', id: 'pop011', name: '진행중 이벤트 (3일 남음)', status: true,
            startDate: now.clone().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(3, 'days').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/events'],
            priority: 1, creationDate: now.clone().subtract(3, 'days').format('YYYY-MM-DD'), contentType: 'image',
            imageUrl: 'https://via.placeholder.com/300x150.png?text=Event+Ongoing', linkUrl: 'https://example.com/event-ongoing'
        },
        {
            key: 'p12', id: 'pop012', name: '오늘 마감 세일 (12시간 남음)', status: true,
            startDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(12, 'hours').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'once_per_session', targetAudience: ['all'], targetPages: ['/sale'],
            priority: 3, creationDate: now.clone().subtract(2, 'days').format('YYYY-MM-DD'), contentType: 'template',
            templateId: '할인 안내 템플릿'
        },
        {
            key: 'p13', id: 'pop013', name: '마감 임박 (45분 남음)', status: true,
            startDate: now.clone().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(45, 'minutes').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'every_time', targetAudience: ['all'], targetPages: ['/'],
            priority: 1, creationDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD'), contentType: 'template',
            templateId: '긴급 공지 팝업 템플릿'
        },

        // 5. 기간 미설정
        {
            key: 'p15', id: 'pop015', name: '기간 미설정 테스트', status: true,
            startDate: null,
            endDate: null,
            frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/'],
            priority: 2, creationDate: now.clone().format('YYYY-MM-DD'), contentType: 'template',
            templateId: '신규 기능 안내 템플릿'
        }
    ];
};

const groupPopupsByPage = (popups) => {
    const groups = {};
    popups.forEach(popup => {
        const pageKey = (Array.isArray(popup.targetPages) && popup.targetPages.length > 0) ? popup.targetPages[0] : '/';
        if (!groups[pageKey]) {
            groups[pageKey] = {
                key: pageKey,
                pagePath: pageKey,
                popups: [],
            };
        }
        groups[pageKey].popups.push({ ...popup, priority: groups[pageKey].popups.length + 1 });
    });

    Object.values(groups).forEach(group => {
         group.popups.sort((a, b) => (a.priority || 0) - (b.priority || 0) || moment(b.creationDate).unix() - moment(a.creationDate).unix());
         group.popups = group.popups.map((p, index) => ({ ...p, priority: index + 1 }));
    });

    return Object.values(groups).sort((a, b) => a.pagePath.localeCompare(b.pagePath));
};

const RowContext = React.createContext({});

const DragHandle = () => {
  const { attributes, listeners, setActivatorNodeRef } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: 'grab' }}
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
    />
  );
};

const SortableRow = (props) => {
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
    ...(isDragging ? { position: 'relative', zIndex: 9999, backgroundColor: '#f0f0f0', cursor: 'grabbing' } : {}),
  };

  const contextValue = useMemo(
    () => ({ attributes, listeners, setActivatorNodeRef }),
    [attributes, listeners, setActivatorNodeRef],
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} />
    </RowContext.Provider>
  );
};

const PopupExposureSettings = () => {
    const { templates } = usePopupTemplates();

    const [groupedPopups, setGroupedPopups] = useState(() => groupPopupsByPage(generateInitialPopups()));
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [editingPopupPageKey, setEditingPopupPageKey] = useState(null);
    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [form] = Form.useForm();
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [deletingPopupInfo, setDeletingPopupInfo] = useState(null);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 5,
        },
      })
    );

    const pagePathOptions = useMemo(() => {
        const uniquePaths = new Set(groupedPopups.map(g => g.pagePath));
        if (!uniquePaths.has('/')) {
            uniquePaths.add('/');
        }
        return Array.from(uniquePaths).sort();
    }, [groupedPopups]);

    const handleToggleExpandAll = () => {
        const expandableGroups = groupedPopups.filter(g => g.popups?.length > 0);
        if (expandedRowKeys.length === expandableGroups.length) {
            setExpandedRowKeys([]);
        } else {
            const allExpandableKeys = expandableGroups.map(group => group.key);
            setExpandedRowKeys(allExpandableKeys);
        }
    };

    const handleExpandedRowsChange = (keys) => {
        setExpandedRowKeys(keys);
    };

    const handleStatusChange = (popupKey, pageKey, checked) => {
        const popupId = groupedPopups.find(g => g.key === pageKey)?.popups.find(p => p.key === popupKey)?.id;
        if (!popupId) return;

        message.loading({ content: `'${popupId}' 상태 변경 중...`, key: popupId });

        console.log(`Changing status for ${popupId} in page group ${pageKey} to ${checked}`);
        setTimeout(() => {
            setGroupedPopups(prevGroups =>
                prevGroups.map(group => {
                    if (group.key === pageKey) {
                        return {
                            ...group,
                            popups: group.popups.map(p =>
                                p.key === popupKey ? { ...p, status: checked } : p
                            ),
                        };
                    }
                    return group;
                })
            );
            message.success({ content: `'${popupId}' 팝업 상태가 ${checked ? '활성' : '비활성'}(으)로 변경되었습니다.`, key: popupId });
        }, 500);
    };

    const showEditModal = (popup, pageKey) => {
        setEditingPopup(popup);
        setEditingPopupPageKey(pageKey);
        form.setFieldsValue({
            ...popup,
            name: popup.name,
            contentType: popup.contentType,
            templateId: popup.templateId,
            exposurePeriod: [moment(popup.startDate), moment(popup.endDate)],
            targetPages: Array.isArray(popup.targetPages) && popup.targetPages.length > 0 ? popup.targetPages[0] : undefined,
        });
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setEditingPopup(null);
        setEditingPopupPageKey(null);
        form.resetFields();
    };

    const handleModalOk = () => {
        if (!editingPopup || !editingPopupPageKey) return;

        form.validateFields()
            .then(values => {
                setLoading(true);
                message.loading({ content: `'${editingPopup.name}' 설정 저장 중...`, key: 'popupEdit' });

                const { priority, ...formValues } = values;
                const updatedPopupData = { ...editingPopup, ...formValues };

                if (formValues.exposurePeriod) {
                    updatedPopupData.startDate = formValues.exposurePeriod[0].toISOString();
                    updatedPopupData.endDate = formValues.exposurePeriod[1].toISOString();
                    delete updatedPopupData.exposurePeriod;
                }

                if (typeof formValues.targetPages === 'string') {
                     updatedPopupData.targetPages = [formValues.targetPages];
                 } else {
                     updatedPopupData.targetPages = [];
                 }

                console.log('Updated Popup Data (from modal):', updatedPopupData);

                setTimeout(() => {
                     setGroupedPopups(prevGroups =>
                         prevGroups.map(group => {
                             if (group.key === editingPopupPageKey) {
                                 return {
                                     ...group,
                                     popups: group.popups.map(p =>
                                         p.key === editingPopup.key ? updatedPopupData : p
                                     ),
                                 };
                             }
                             return group;
                         })
                     );

                    message.success({ content: `'${editingPopup.name}' 팝업 설정이 저장되었습니다.`, key: 'popupEdit' });
                    handleModalCancel();
                    setLoading(false);
                }, 800);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                setLoading(false);
            });
    };

    const showPreviewModal = (popup) => {
        console.log("Showing preview for:", popup);
        setPreviewData({
            name: popup.name,
            contentType: popup.contentType,
            imageUrl: popup.imageUrl,
            templateId: popup.templateId,
            linkUrl: popup.linkUrl,
        });
        setIsPreviewModalVisible(true);
    };

    const handlePreviewCancel = () => {
        setIsPreviewModalVisible(false);
        setPreviewData(null);
    };

    const showDeleteConfirm = (popup, pageKey) => {
        setDeletingPopupInfo({ key: popup.key, id: popup.id, name: popup.name, pageKey });
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
        setDeletingPopupInfo(null);
    };

    const handleDeletePopup = () => {
        if (!deletingPopupInfo) return;

        const { key: popupKey, pageKey, name } = deletingPopupInfo;
        message.loading({ content: `'${name}' 팝업 삭제 중...`, key: 'popupDelete' });

        setTimeout(() => {
            setGroupedPopups(prevGroups =>
                prevGroups.map(group => {
                    if (group.key === pageKey) {
                        const updatedPopups = group.popups.filter(p => p.key !== popupKey);
                        const finalPopups = updatedPopups.map((p, index) => ({ ...p, priority: index + 1 }));
                        return { ...group, popups: finalPopups };
                    }
                    return group;
                }).filter(group => group.popups.length > 0)
            );
            message.success({ content: `'${name}' 팝업이 삭제되었습니다.`, key: 'popupDelete' });
            handleDeleteCancel();
        }, 500);
    };

    const onDragEnd = useCallback((event, pageKey) => {
        const { active, over } = event;
        console.log(`onDragEnd triggered for page ${pageKey}:`, { active, over });

        if (active.id !== over?.id) {
            setGroupedPopups((prevGroups) => {
                const groupIndex = prevGroups.findIndex(group => group.key === pageKey);
                if (groupIndex === -1) return prevGroups;

                const targetGroup = prevGroups[groupIndex];
                const oldIndex = targetGroup.popups.findIndex((item) => item.key === active.id);
                const newIndex = targetGroup.popups.findIndex((item) => item.key === over?.id);

                if (oldIndex === -1 || newIndex === -1) return prevGroups;

                console.log(`Moving popup in group ${pageKey} from index ${oldIndex} to ${newIndex}`);

                let reorderedPopups = arrayMove(targetGroup.popups, oldIndex, newIndex);

                reorderedPopups = reorderedPopups.map((popup, index) => ({
                    ...popup,
                    priority: index + 1,
                }));

                const newGroups = [...prevGroups];
                newGroups[groupIndex] = { ...targetGroup, popups: reorderedPopups };

                console.log(`New popup order for page ${pageKey}:`, reorderedPopups);
                message.success(`'${pageKey}' 페이지의 팝업 순서가 변경되었습니다. (저장 필요)`);

                return newGroups;
            });
        }
    }, []);

    const ExpandedPopupTable = ({ popups: subPopups, pageKey }) => {
        const popupColumns = [
             { key: 'sort', align: 'center', render: () => <DragHandle /> },
             { title: 'ID', dataIndex: 'id', key: 'id' },
             { title: '팝업 이름', dataIndex: 'name', key: 'name', ellipsis: true },
             {
                title: '콘텐츠 타입',
                dataIndex: 'contentType',
                key: 'contentType',
                align: 'center',
                render: (type, record) => {
                    if (type === 'image') {
                        return <><FileImageOutlined /> 이미지</>;
                    }
                    if (type === 'template') {
                        const templateName = templates.find(t => t.id === record.templateId)?.name;
                        return <><ProfileOutlined /> {templateName || record.templateId || '템플릿'}</>;
                    }
                    return '-';
                }
             },
             {
                title: '상태', dataIndex: 'status', key: 'status', align: 'center',
                render: (isActive, record) => (
                    <Switch
                        checked={isActive}
                         onChange={(checked) => handleStatusChange(record.key, pageKey, checked)}
                        checkedChildren={<EyeOutlined />}
                        unCheckedChildren={<EyeInvisibleOutlined />}
                        size="small"
                    />
                )
            },
            {
                title: '노출 기간', key: 'period',
                render: (_, record) => {
                    const start = moment(record.startDate);
                    const end = moment(record.endDate);
                    let dateString = '-';

                    if (start.isValid() && end.isValid()) {
                        const duration = end.diff(start, 'days') + 1;
                        dateString = `${start.format('YY/MM/DD HH:mm')} ~ ${end.format('YY/MM/DD HH:mm')} (총 ${duration}일)`;
                    } else if (start.isValid()) {
                        dateString = `${start.format('YY/MM/DD HH:mm')} ~ ?`;
                    } else if (end.isValid()) {
                        dateString = `? ~ ${end.format('YY/MM/DD HH:mm')}`;
                    }
                    return dateString;
                },
            },
            {
                title: '남은 기간',
                key: 'status',
                align: 'center',
                render: (_, record) => {
                    if (record.displayRemainingTime) {
                        let color = 'default';
                        if (record.displayRemainingTime.startsWith('D-')) {
                            color = 'blue';
                        } else if (record.displayRemainingTime.endsWith('분')) {
                            color = 'orange';
                        }
                        return <Tag color={color}>{record.displayRemainingTime}</Tag>;
                    }

                    const now = moment();
                    const start = moment(record.startDate);
                    const end = moment(record.endDate);

                    if (!start.isValid() || !end.isValid()) {
                        return <Tag>기간 미설정</Tag>;
                    }

                    if (now.isBefore(start)) {
                        const diffDays = start.diff(now, 'days');
                        if (diffDays > 0) {
                            return <Tag color="geekblue">시작 D-{diffDays}</Tag>;
                        }
                        const diffHours = start.diff(now, 'hours');
                        if (diffHours > 0) {
                            return <Tag color="geekblue">시작까지 {diffHours}시간</Tag>;
                        }
                        const diffMinutes = start.diff(now, 'minutes');
                        if (diffMinutes > 0) {
                            return <Tag color="geekblue">시작까지 {diffMinutes}분</Tag>;
                        }
                        return <Tag color="geekblue">시작 예정</Tag>;
                    }

                    if (now.isAfter(end)) {
                        return <Tag color="default">종료</Tag>;
                    }

                    const diffDays = end.diff(now, 'days');
                    if (diffDays > 0) {
                        return <Tag color="blue">종료 D-{diffDays}</Tag>;
                    }
                    const diffHours = end.diff(now, 'hours');
                    if (diffHours > 0) {
                        return <Tag color="orange">종료까지 {diffHours}시간</Tag>;
                    }
                    const diffMinutes = end.diff(now, 'minutes');
                    if (diffMinutes >= 0) {
                        return <Tag color="orange">종료까지 {diffMinutes}분</Tag>;
                    }

                    return <Tag color="default">종료</Tag>;
                },
            },
             { title: '우선순위', dataIndex: 'priority', key: 'priority', align: 'right' },
             {
                title: '관리',
                key: 'action',
                align: 'center',
                render: (_, record) => (
                     <Space size="small">
                        <Tooltip title="팝업 상세 설정 수정">
                             <Button size="small" icon={<EditOutlined />} onClick={() => showEditModal(record, pageKey)} />
                        </Tooltip>
                         <Tooltip title="팝업 미리보기">
                             <Button size="small" icon={<EyeOutlined />} onClick={() => showPreviewModal(record)} />
                         </Tooltip>
                         <Tooltip title="팝업 삭제">
                             <Button danger size="small" icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record, pageKey)} />
                         </Tooltip>
                     </Space>
                ),
            },
        ];

        return (
             <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={(e) => onDragEnd(e, pageKey)}>
                 <SortableContext items={subPopups.map(i => i.key)} strategy={verticalListSortingStrategy}>
                     <Table
                         columns={popupColumns}
                         dataSource={subPopups}
                         rowKey="key"
                         pagination={false}
                         size="small"
                         components={{ body: { row: SortableRow } }}
                         showHeader={subPopups.length > 0}
                         style={{ margin: '-16px' }}
                     />
                 </SortableContext>
             </DndContext>
        );
    };

    const pageGroupColumns = [
        {
            title: '노출 페이지 경로',
            dataIndex: 'pagePath',
            key: 'pagePath',
            render: (path) => <><FolderOpenOutlined /> {path === '/' ? '전체 페이지 (루트)' : path}</>
        },
        {
            title: '팝업 수',
            key: 'count',
            width: 100,
            align: 'right',
            render: (_, record) => <Badge count={record.popups?.length || 0} showZero color="#1890ff" />
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><SettingOutlined /> 팝업 노출 설정 (페이지별 우선순위)</Title>
            <Text>페이지별로 팝업 목록을 확인하고 드래그하여 노출 우선순위를 설정합니다.</Text>

            <Card>
                <Space style={{ marginBottom: 16 }} wrap>

                    <Button
                         icon={expandedRowKeys.length === groupedPopups.filter(g => g.popups?.length > 0).length ? <DownOutlined /> : <RightOutlined />}
                         onClick={handleToggleExpandAll}
                    >
                         {expandedRowKeys.length === groupedPopups.filter(g => g.popups?.length > 0).length ? '전체 접기' : '전체 펼치기'}
                     </Button>
                </Space>

                <Table
                    columns={pageGroupColumns}
                    dataSource={groupedPopups}
                    rowKey="key"
                    loading={loading}
                    pagination={false}
                    expandable={{
                        expandedRowRender: (record) => <ExpandedPopupTable popups={record.popups} pageKey={record.key} />,
                        rowExpandable: (record) => record.popups && record.popups.length > 0,
                        expandedRowKeys: expandedRowKeys,
                        onExpandedRowsChange: handleExpandedRowsChange,
                    }}
                    size="middle"
                />
            </Card>

            <Modal
                title="팝업 설정 수정"
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="저장"
                cancelText="취소"
                cancelButtonProps={{ style: { display: 'none' } }}
                confirmLoading={loading}
                width={600}
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="popup_settings_form">
                     <Form.Item
                         name="targetPages"
                         label="노출 페이지"
                         tooltip="팝업을 노출할 페이지 경로를 선택하세요. 이 경로를 기준으로 목록이 그룹화됩니다."
                         rules={[{ required: true, message: '노출 페이지를 선택해주세요.'}]}
                     >
                         <Select
                             style={{ width: '100%' }}
                             placeholder="노출 페이지 경로 선택"
                             allowClear
                             disabled
                         >
                             {pagePathOptions.map(path => (
                                 <Option key={path} value={path}>{path}</Option>
                             ))}
                         </Select>
                     </Form.Item>

                     <Form.Item
                         label="팝업 이름 (관리용)"
                         name="name"
                     >
                         <Input disabled />
                     </Form.Item>

                     <Form.Item
                         label="콘텐츠 타입"
                     >
                         {(() => {
                             const type = form.getFieldValue('contentType');
                             const tplId = form.getFieldValue('templateId');
                             if (type === 'image') {
                                 return <Text><FileImageOutlined /> 이미지</Text>;
                             }
                             if (type === 'template') {
                                 const templateName = templates.find(t => t.id === tplId)?.name;
                                 return <Text><ProfileOutlined /> {templateName || tplId || '템플릿'}</Text>;
                             }
                             return <Text type="secondary">알 수 없음</Text>;
                         })()}
                     </Form.Item>

                     <Form.Item
                         name="exposurePeriod"
                         label={<><CalendarOutlined /> 노출 기간</>}
                         rules={[{ required: true, message: '노출 기간을 선택해주세요.' }]}
                     >
                         <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                     </Form.Item>

                     <Form.Item
                         label="남은 기간"
                     >
                         {(() => {
                            if (editingPopup?.displayRemainingTime) {
                                let color = 'default';
                                if (editingPopup.displayRemainingTime.startsWith('D-')) {
                                    color = 'blue';
                                } else if (editingPopup.displayRemainingTime.endsWith('분')) {
                                    color = 'orange';
                                }
                                return <Tag color={color}>{editingPopup.displayRemainingTime}</Tag>;
                            }

                            if (!editingPopup) return null;

                            const now = moment();
                            const start = moment(editingPopup.startDate);
                            const end = moment(editingPopup.endDate);

                            if (!start.isValid() || !end.isValid()) {
                                return <Tag>기간 미설정</Tag>;
                            }

                            if (now.isBefore(start)) {
                                const diffDays = start.diff(now, 'days');
                                if (diffDays > 0) {
                                    return <Tag color="geekblue">시작 D-{diffDays}</Tag>;
                                }
                                const diffHours = start.diff(now, 'hours');
                                if (diffHours > 0) {
                                    return <Tag color="geekblue">시작까지 {diffHours}시간</Tag>;
                                }
                                const diffMinutes = start.diff(now, 'minutes');
                                if (diffMinutes > 0) {
                                    return <Tag color="geekblue">시작까지 {diffMinutes}분</Tag>;
                                }
                                return <Tag color="geekblue">시작 예정</Tag>;
                            }

                            if (now.isAfter(end)) {
                                return <Tag color="default">종료</Tag>;
                            }

                            const diffDays = end.diff(now, 'days');
                            if (diffDays > 0) {
                                return <Tag color="blue">종료 D-{diffDays}</Tag>;
                            }
                            const diffHours = end.diff(now, 'hours');
                            if (diffHours > 0) {
                                return <Tag color="orange">종료까지 {diffHours}시간</Tag>;
                            }
                            const diffMinutes = end.diff(now, 'minutes');
                            if (diffMinutes >= 0) {
                                return <Tag color="orange">종료까지 {diffMinutes}분</Tag>;
                            }

                            return <Tag color="default">종료</Tag>;
                         })()}
                     </Form.Item>

                     <Form.Item name="status" label="활성 상태" valuePropName="checked">
                         <Switch checkedChildren="활성" unCheckedChildren="비활성" />
                     </Form.Item>
                 </Form>
             </Modal>

             <Modal
                 title={`미리보기: ${previewData?.name || ''}`}
                 open={isPreviewModalVisible}
                 onCancel={handlePreviewCancel}
                 footer={null}
                 width={400}
             >
                 {previewData && (
                     <Space direction="vertical" style={{ width: '100%' }}>
                         <Text><strong>콘텐츠 타입:</strong> {previewData.contentType === 'image' ? '이미지' : (previewData.contentType === 'template' ? '템플릿' : 'N/A')}</Text>
                         {previewData.contentType === 'image' && previewData.imageUrl && (
                             <div>
                                 <Text strong>이미지:</Text><br/>
                                 <img src={previewData.imageUrl} alt="팝업 이미지" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '8px' }} />
                             </div>
                         )}
                         {previewData.contentType === 'template' && previewData.templateId && (
                              <Text><strong>템플릿 ID:</strong> {previewData.templateId}</Text>
                          )}
                          {previewData.linkUrl && (
                              <Text><strong>연결 URL:</strong> <a href={previewData.linkUrl} target="_blank" rel="noopener noreferrer">{previewData.linkUrl}</a></Text>
                          )}
                     </Space>
                 )}
             </Modal>

             <Modal
                 title="팝업 삭제 확인"
                 open={isDeleteModalVisible}
                 onOk={handleDeletePopup}
                 onCancel={handleDeleteCancel}
                 okText="삭제"
                 cancelText="취소"
                 okButtonProps={{ danger: true }}
             >
                 <p>
                     정말로 '<strong>{deletingPopupInfo?.name}</strong>' (ID: {deletingPopupInfo?.id}) 팝업을
                     '<strong>{deletingPopupInfo?.pageKey}</strong>' 페이지 그룹에서 삭제하시겠습니까?
                 </p>
                 <p style={{ color: 'red' }}>이 작업은 되돌릴 수 없습니다.</p>
             </Modal>
        </Space>
    );
};

export default PopupExposureSettings;
