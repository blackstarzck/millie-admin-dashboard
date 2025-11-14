import {
  CalendarOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  HolderOutlined,
  LinkOutlined,
  PushpinOutlined,
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
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option, OptGroup } = Select;
const { TextArea } = Input;

// 계층 구조로 페이지 목록 정의
const pageList = [
    { id: 'platform_main', name: '메인', category: '기본' },
    { id: 'search_result', name: '검색 결과', category: '기본' },
    { id: 'book_detail', name: '도서 상세', category: '기본' },
    { id: 'viewer', name: '뷰어', category: '기본' },
    { id: 'my_library', name: '내 서재', category: '기본' },
    { id: 'category_best', name: '카테고리/베스트', category: '기본' },
    { id: 'user_profile', name: '사용자 프로필', category: '기본' },
    { id: 'subscription_info', name: '구독 정보', category: '기본' },
    // 이벤트 계층 구조
    { id: 'event_detail_1', name: '이벤트#1', category: '이벤트' },
    { id: 'event_detail_2', name: '이벤트#2', category: '이벤트' },
    { id: 'event_detail_3', name: '이벤트#3', category: '이벤트' },
    { id: 'event_detail_4', name: '이벤트#4', category: '이벤트' },
    { id: 'event_detail_5', name: '이벤트#5', category: '이벤트' },
];

// 카테고리별로 그룹화
const groupedPageList = pageList.reduce((acc, page) => {
    const category = page.category || '기타';
    if (!acc[category]) {
        acc[category] = [];
    }
    acc[category].push(page);
    return acc;
}, {});

// 이벤트별 기간 정보 정의 (PopupCreation.js와 동일)
const eventPeriods = {
    'event_detail_1': {
        startDate: moment().add(1, 'days').startOf('day').add(9, 'hours'), // 내일 오전 9시
        endDate: moment().add(7, 'days').endOf('day').subtract(1, 'hour'), // 7일 후 오후 11시
    },
    'event_detail_2': {
        startDate: moment().add(3, 'days').startOf('day').add(10, 'hours'), // 3일 후 오전 10시
        endDate: moment().add(10, 'days').endOf('day').subtract(2, 'hours'), // 10일 후 오후 10시
    },
    'event_detail_3': {
        startDate: moment().subtract(1, 'days').startOf('day').add(8, 'hours'), // 어제 오전 8시
        endDate: moment().add(5, 'days').endOf('day').subtract(1, 'hour'), // 5일 후 오후 11시
    },
    'event_detail_4': {
        startDate: moment().startOf('day').add(12, 'hours'), // 오늘 정오
        endDate: moment().add(3, 'days').endOf('day').subtract(3, 'hours'), // 3일 후 오후 9시
    },
    'event_detail_5': {
        startDate: moment().add(5, 'days').startOf('day').add(14, 'hours'), // 5일 후 오후 2시
        endDate: moment().add(12, 'days').endOf('day').subtract(1, 'hour'), // 12일 후 오후 11시
    },
};

// 이벤트 페이지가 종료되었는지 확인하는 함수
const isEventEnded = (eventId) => {
    const eventPeriod = eventPeriods[eventId];
    if (!eventPeriod) return false;
    return moment().isAfter(eventPeriod.endDate);
};

// 경로를 페이지 ID로 매핑하는 함수 (더미 데이터 호환용)
const pathToPageIdMap = {
    '/dashboard': 'platform_main',
    '/sale': 'event_detail', // 세일은 이벤트 상세
    '/upcoming': 'platform_main', // 출시 예고는 플랫폼 메인
    '/survey': 'my_library', // 설문은 내 서재
    '/events': 'event_detail', // 이벤트는 이벤트 상세
    '/': 'platform_main', // 루트는 플랫폼 메인으로 매핑
};

// 페이지 ID나 경로를 페이지 이름으로 변환하는 함수
const getPageName = (pageIdOrPath) => {
    if (!pageIdOrPath) return '전체 페이지';
    if (pageIdOrPath === '/') return '전체 페이지 (루트)';

    // 경로인 경우 ID로 변환
    const pageId = pathToPageIdMap[pageIdOrPath] || pageIdOrPath;

    // pageList에서 찾기
    const page = pageList.find(p => p.id === pageId);
    return page ? page.name : pageIdOrPath;
};

// 여러 페이지 ID나 경로를 페이지 이름 배열로 변환
const getPageNames = (pageIdsOrPaths) => {
    if (!pageIdsOrPaths || !Array.isArray(pageIdsOrPaths) || pageIdsOrPaths.length === 0) {
        return ['전체 페이지'];
    }
    return pageIdsOrPaths.map(getPageName);
};

const generateInitialPopups = () => {
    const now = moment();
    return [
        // 1. 수동 설정 (고정값 표시)
        { key: 'p1', id: 'pop001', name: '신규 기능 안내 (고정 D-39)', status: true, startDate: '2024-09-10 00:00', endDate: '2024-09-22 10:00', frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/dashboard'], priority: 1, creationDate: '2024-08-01', contentType: 'template', templateId: '신규 기능 안내 템플릿', linkUrl: null, imageUrl: null, hideOptions: ['day'], displayRemainingTime: 'D-39' },
        { key: 'p5', id: 'pop005', name: '대시보드 전용 공지 (고정 162분)', status: true, startDate: now.clone().add(162, 'minutes').format('YYYY-MM-DD HH:mm'), endDate: now.clone().add(1, 'day').format('YYYY-MM-DD HH:mm'), frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/dashboard'], priority: 2, creationDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD'), contentType: 'template', templateId: '긴급 공지 팝업 템플릿', linkUrl: null, imageUrl: null, hideOptions: ['week'], displayRemainingTime: '162분' },

        // 2. 노출 종료
        { key: 'p2', id: 'pop002', name: '블랙프라이데이 (종료됨)', status: false, startDate: '2023-11-20 00:00', endDate: '2023-11-30 23:59', frequencyType: 'once_per_session', targetAudience: ['vip', 'group_A'], targetPages: ['event_detail_1'], priority: 1, creationDate: '2023-11-01', contentType: 'image', imageUrl: 'https://via.placeholder.com/300x200.png?text=Black+Friday', linkUrl: 'https://example.com/sale', templateId: null, hideOptions: ['day'] },

        // 3. 시작 전
        {
            key: 'p8', id: 'pop008', name: '출시 예고 (10일 뒤 시작)', status: true,
            startDate: now.clone().add(10, 'days').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(20, 'days').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/upcoming'],
            priority: 1, creationDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD'), contentType: 'template',
            templateId: '신규 기능 안내 템플릿', linkUrl: null, imageUrl: null, hideOptions: ['day']
        },
        {
            key: 'p9', id: 'pop009', name: '타임세일 (5시간 뒤 시작)', status: true,
            startDate: now.clone().add(5, 'hours').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(1, 'day').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'once_per_session', targetAudience: ['vip'], targetPages: ['event_detail_2'],
            priority: 2, creationDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD'), contentType: 'image',
            imageUrl: 'https://via.placeholder.com/300x150.png?text=Time+Sale+Soon', linkUrl: 'https://example.com/sale-soon', templateId: null, hideOptions: ['week']
        },
        {
            key: 'p10', id: 'pop010', name: '긴급 설문 (30분 뒤 시작)', status: true,
            startDate: now.clone().add(30, 'minutes').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(2, 'hours').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'every_time', targetAudience: ['loggedIn'], targetPages: ['/survey'],
            priority: 1, creationDate: now.clone().subtract(1, 'hour').format('YYYY-MM-DD'), contentType: 'template',
            templateId: '설문 참여 독려 템플릿', linkUrl: null, imageUrl: null, hideOptions: ['week']
        },

        // 4. 진행 중
        {
            key: 'p11', id: 'pop011', name: '진행중 이벤트 (3일 남음)', status: true,
            startDate: now.clone().subtract(2, 'days').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(3, 'days').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['event_detail_3'],
            priority: 1, creationDate: now.clone().subtract(3, 'days').format('YYYY-MM-DD'), contentType: 'image',
            imageUrl: 'https://via.placeholder.com/300x150.png?text=Event+Ongoing', linkUrl: 'https://example.com/event-ongoing', templateId: null, hideOptions: ['day', 'week']
        },
        {
            key: 'p12', id: 'pop012', name: '오늘 마감 세일 (12시간 남음)', status: true,
            startDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(12, 'hours').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'once_per_session', targetAudience: ['all'], targetPages: ['event_detail_4'],
            priority: 3, creationDate: now.clone().subtract(2, 'days').format('YYYY-MM-DD'), contentType: 'template',
            templateId: '할인 안내 템플릿', linkUrl: null, imageUrl: null, hideOptions: ['day']
        },
        {
            key: 'p13', id: 'pop013', name: '마감 임박 (45분 남음)', status: true,
            startDate: now.clone().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
            endDate: now.clone().add(45, 'minutes').format('YYYY-MM-DD HH:mm'),
            frequencyType: 'every_time', targetAudience: ['all'], targetPages: ['event_detail_5'],
            priority: 1, creationDate: now.clone().subtract(1, 'day').format('YYYY-MM-DD'), contentType: 'template',
            templateId: '긴급 공지 팝업 템플릿', linkUrl: null, imageUrl: null, hideOptions: ['day']
        },

        // 5. 기간 미설정
        {
            key: 'p15', id: 'pop015', name: '기간 미설정 테스트', status: true,
            startDate: null,
            endDate: null,
            frequencyType: 'once_per_day', targetAudience: ['all'], targetPages: ['/'],
            priority: 2, creationDate: now.clone().format('YYYY-MM-DD'), contentType: 'template',
            templateId: '신규 기능 안내 템플릿', linkUrl: null, imageUrl: null, hideOptions: ['week']
        }
    ];
};

// 이벤트 종료까지 남은 일수 계산
const getEventRemainingDays = (eventId) => {
    const eventPeriod = eventPeriods[eventId];
    if (!eventPeriod) return null;

    const now = moment();
    const endDate = eventPeriod.endDate;

    if (now.isAfter(endDate)) return null; // 이미 종료됨

    const daysRemaining = endDate.diff(now, 'days', true);
    return Math.ceil(daysRemaining);
};

const groupPopupsByPage = (popups) => {
    const groups = {};
    popups.forEach(popup => {
        const pagePath = (Array.isArray(popup.targetPages) && popup.targetPages.length > 0) ? popup.targetPages[0] : '/';
        // 경로를 페이지 ID로 변환하여 같은 페이지 이름을 가진 팝업들을 같은 그룹으로 묶음
        const pageId = pathToPageIdMap[pagePath] || pagePath;

        // 종료된 이벤트 페이지는 제외
        if (pageId.startsWith('event_detail_') && isEventEnded(pageId)) {
            return; // 종료된 이벤트 페이지는 건너뛰기
        }

        const pageName = getPageName(pagePath);
        const remainingDays = pageId.startsWith('event_detail_') ? getEventRemainingDays(pageId) : null;

        // 페이지 ID를 키로 사용하여 같은 페이지의 팝업들을 묶음
        if (!groups[pageId]) {
            groups[pageId] = {
                key: pageId,
                pagePath: pagePath, // 첫 번째 경로를 저장
                pageName: pageName,
                isEvent: pageId.startsWith('event_detail_'),
                remainingDays: remainingDays,
                popups: [],
            };
        }
        groups[pageId].popups.push({ ...popup, priority: groups[pageId].popups.length + 1 });
    });

    Object.values(groups).forEach(group => {
         group.popups.sort((a, b) => (a.priority || 0) - (b.priority || 0) || moment(b.creationDate).unix() - moment(a.creationDate).unix());
         group.popups = group.popups.map((p, index) => ({ ...p, priority: index + 1 }));
    });

    // 메인 페이지를 항상 맨 위에 배치하고, 나머지는 알파벳 순으로 정렬
    return Object.values(groups).sort((a, b) => {
        // platform_main은 항상 맨 위
        if (a.key === 'platform_main') return -1;
        if (b.key === 'platform_main') return 1;
        // 나머지는 알파벳 순
        return a.pageName.localeCompare(b.pageName);
    });
};

// 페이지별 팝업 수를 계산하는 함수
const getPopupCountForPage = (pageId) => {
    const allPopups = generateInitialPopups();
    const grouped = groupPopupsByPage(allPopups);
    const targetGroup = grouped.find(group => group.key === pageId);
    return targetGroup ? (targetGroup.popups?.length || 0) : 0;
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
    const [searchParams, setSearchParams] = useSearchParams();
    const popupIdFromUrl = searchParams.get('popupId');
    const pageIdFromUrl = searchParams.get('pageId');

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

    // URL 파라미터에서 popupId 또는 pageId가 있으면 해당 팝업이 속한 페이지 그룹을 자동으로 확장
    useEffect(() => {
        if (groupedPopups.length > 0) {
            let targetGroup = null;

            // pageId가 있으면 직접 해당 페이지 그룹 찾기
            if (pageIdFromUrl) {
                targetGroup = groupedPopups.find(group => group.key === pageIdFromUrl);
            }
            // popupId가 있으면 팝업이 속한 페이지 그룹 찾기
            else if (popupIdFromUrl) {
                targetGroup = groupedPopups.find(group =>
                    group.popups.some(popup => popup.id === popupIdFromUrl)
                );
            }

            if (targetGroup) {
                setExpandedRowKeys(prevKeys => {
                    if (!prevKeys.includes(targetGroup.key)) {
                        return [...prevKeys, targetGroup.key];
                    }
                    return prevKeys;
                });
                // URL에서 파라미터 제거
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.delete('popupId');
                newSearchParams.delete('pageId');
                setSearchParams(newSearchParams, { replace: true });
            }
        }
    }, [popupIdFromUrl, pageIdFromUrl, groupedPopups, searchParams, setSearchParams]);

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
        setIsModalOpen(true);
    };

    // editingPopup이 변경될 때 form 값을 설정
    useEffect(() => {
        if (editingPopup && isModalOpen) {
            const startDate = editingPopup.startDate ? moment(editingPopup.startDate) : null;
            const endDate = editingPopup.endDate ? moment(editingPopup.endDate) : null;

            // hideOptions는 배열일 수도 있고 단일 값일 수도 있음 (라디오 버튼용으로 단일 값으로 변환)
            let hideOptionsValue = null;
            if (Array.isArray(editingPopup.hideOptions) && editingPopup.hideOptions.length > 0) {
                hideOptionsValue = editingPopup.hideOptions[0]; // 첫 번째 값만 사용
            } else if (editingPopup.hideOptions && !Array.isArray(editingPopup.hideOptions)) {
                hideOptionsValue = editingPopup.hideOptions; // 이미 단일 값인 경우
            }

            // targetPages를 페이지 ID로 변환 (경로인 경우)
            // 단일 값으로 처리 (하나의 페이지만 선택 가능)
            let exposurePagesValue = null;
            if (Array.isArray(editingPopup.targetPages) && editingPopup.targetPages.length > 0) {
                const path = editingPopup.targetPages[0]; // 첫 번째 값만 사용
                exposurePagesValue = pathToPageIdMap[path] || path;
            } else if (editingPopup.targetPages) {
                const path = editingPopup.targetPages;
                exposurePagesValue = pathToPageIdMap[path] || path;
            }

            form.setFieldsValue({
                ...editingPopup,
                name: editingPopup.name,
                imageUrl: editingPopup.imageUrl,
                linkUrl: editingPopup.linkUrl,
                exposurePeriod: (startDate && endDate) ? [startDate, endDate] : null,
                exposurePages: exposurePagesValue,
                hideOptions: hideOptionsValue,
                status: editingPopup.status,
            });

            // hideOptions가 제대로 설정되었는지 확인
            console.log('Setting hideOptions:', hideOptionsValue, 'for popup:', editingPopup.name);
            console.log('Setting exposurePages:', exposurePagesValue, 'from targetPages:', editingPopup.targetPages);
        }
    }, [editingPopup, isModalOpen, form]);

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

                const updatedPopupData = { ...editingPopup, ...values };

                if (values.exposurePeriod) {
                    updatedPopupData.startDate = values.exposurePeriod[0].toISOString();
                    updatedPopupData.endDate = values.exposurePeriod[1].toISOString();
                    delete updatedPopupData.exposurePeriod;
                }

                // exposurePages 처리 (단일 값, 페이지 ID를 경로로 변환하여 저장)
                if (values.exposurePages) {
                    // 페이지 ID를 경로로 역변환 (없으면 ID 그대로 사용)
                    const idToPathMap = Object.fromEntries(
                        Object.entries(pathToPageIdMap).map(([path, id]) => [id, path])
                    );
                    const pageId = values.exposurePages;
                    updatedPopupData.targetPages = [idToPathMap[pageId] || pageId];
                } else {
                    updatedPopupData.targetPages = [];
                }

                // hideOptions는 단일 값 (라디오 버튼)
                updatedPopupData.hideOptions = values.hideOptions || null;

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

                    message.success({ content: `'${updatedPopupData.name || editingPopup.name}' 팝업 설정이 저장되었습니다.`, key: 'popupEdit' });
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
            imageUrl: popup.imageUrl,
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
            title: '노출 페이지',
            dataIndex: 'pageName',
            key: 'pageName',
            render: (name, record) => {
                const displayName = name || getPageName(record.pagePath);
                const remainingDays = record.isEvent && record.remainingDays !== null
                    ? record.remainingDays
                    : null;

                return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FolderOpenOutlined />
                        <span>{displayName}</span>
                        {remainingDays !== null && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                (종료까지 {remainingDays}일)
                            </Text>
                        )}
                    </span>
                );
            }
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

            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '16px' }}>
                ℹ️ 이벤트 기간이 종료된 경우 해당 이벤트 페이지에서는 더 이상 팝업이 노출되지 않으며, 노출 설정 페이지에서도 자동으로 제외됩니다.<br></br> 이전에 노출되었던 팝업 이력을 보려면 노출 이력 페이지에서 확인해주세요.
            </Text>

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
                     {/* 팝업 ID 및 등록일 표시 (읽기 전용) */}
                     <Row gutter={16}>
                         <Col xs={24} sm={12}>
                             <Form.Item label="팝업 ID">
                                 <Input value={editingPopup?.id || '-'} disabled />
                             </Form.Item>
                         </Col>
                         <Col xs={24} sm={12}>
                             <Form.Item label="등록일">
                                 <Input value={editingPopup?.creationDate ? moment(editingPopup.creationDate).format('YYYY-MM-DD') : '-'} disabled />
                             </Form.Item>
                         </Col>
                     </Row>

                     <Form.Item
                         label="팝업 이름 (관리용)"
                         name="name"
                         rules={[{ required: true, message: '관리용 팝업 이름을 입력해주세요.' }]}
                     >
                         <Input placeholder="예: 신규 기능 출시 안내 팝업" />
                     </Form.Item>

                     {form.getFieldValue('imageUrl') && (
                         <Form.Item label="팝업 이미지">
                             <Input value={form.getFieldValue('imageUrl')} disabled />
                         </Form.Item>
                     )}

                     <Form.Item
                         name="linkUrl"
                         label={<><LinkOutlined /> 연결 URL (클릭 시 이동)</>}
                         rules={[{ type: 'url', message: '유효한 URL을 입력해주세요.' }]}
                     >
                         <Input placeholder="https://..." />
                     </Form.Item>

                     <Form.Item
                         name="exposurePeriod"
                         label={<><CalendarOutlined /> 노출 기간</>}
                         rules={[{ required: true, message: '노출 기간을 선택해주세요.' }]}
                     >
                         <RangePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                     </Form.Item>

                    <Form.Item
                        name="exposurePages"
                        label={<><PushpinOutlined /> 노출 페이지</>}
                        tooltip="팝업을 노출할 페이지를 선택합니다. 하나의 페이지만 선택할 수 있습니다."
                    >
                        <Select
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="팝업을 노출할 페이지를 선택하세요 (선택하지 않으면 전체 노출)"
                        >
                            {Object.entries(groupedPageList).map(([category, pages]) => (
                                <OptGroup key={category} label={category}>
                                    {pages.map(page => {
                                        // 페이지별 팝업 수 계산
                                        const popupCount = getPopupCountForPage(page.id);
                                        return (
                                            <Option key={page.id} value={page.id}>
                                                {page.name} {popupCount > 0 && <span style={{ color: 'rgba(24, 144, 255, 0.65)' }}>({popupCount}개)</span>}
                                            </Option>
                                        );
                                    })}
                                </OptGroup>
                            ))}
                        </Select>
                    </Form.Item>

                     <Form.Item
                         name="hideOptions"
                         label="다시 보지 않기 옵션"
                         tooltip="사용자에게 '하루 동안 보지 않기', '일주일 동안 보지 않기'와 같은 선택지를 제공합니다."
                         initialValue={editingPopup?.hideOptions && Array.isArray(editingPopup.hideOptions) && editingPopup.hideOptions.length > 0
                             ? editingPopup.hideOptions[0]
                             : (editingPopup?.hideOptions && !Array.isArray(editingPopup.hideOptions)
                                 ? editingPopup.hideOptions
                                 : null)}
                     >
                         <Radio.Group>
                             <Radio value="day">하루 동안 보지 않기</Radio>
                             <Radio value="week">일주일 동안 보지 않기</Radio>
                         </Radio.Group>
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
                         {previewData.imageUrl && (
                             <div>
                                 <Text strong>이미지:</Text><br/>
                                 <img src={previewData.imageUrl} alt="팝업 이미지" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '8px' }} />
                             </div>
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
