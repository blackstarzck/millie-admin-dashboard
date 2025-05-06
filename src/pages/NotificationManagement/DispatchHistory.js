import React, { useState, useMemo, useEffect } from 'react';
import {
    Table,
    Tag,
    Space,
    Typography,
    message,
    Input,
    Select,
    DatePicker,
    Button,
    Tooltip,
    Modal,
    Popconfirm,
    Divider,
    Descriptions,
    Spin,
    Row,
    Col,
    Tabs,
    Form,
    Radio,
    Switch,
} from 'antd';
import {
    CheckCircleOutlined, // 성공
    CloseCircleOutlined, // 실패
    ClockCircleOutlined, // 예약됨
    StopOutlined, // 취소됨
    EyeOutlined, // 상세 보기
    SearchOutlined,
    FilterOutlined,
    MailOutlined,
    MessageOutlined,
    BellOutlined,
    DeleteOutlined, // 예약 취소 (삭제 개념)
    UserOutlined, // 사용자 아이콘
    LoadingOutlined, // 로딩 아이콘
    DownloadOutlined, // 다운로드 아이콘 추가
    ReloadOutlined, // 재발송 아이콘 추가
    PlusOutlined,
    MobileOutlined,
    SendOutlined, // Import SendOutlined
} from '@ant-design/icons';
import moment from 'moment';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title as ChartTitle, // Renamed to avoid conflict with Typography.Title
    Tooltip as ChartTooltip, // Renamed to avoid conflict with antd Tooltip
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2'; // Import Line component

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ChartTitle,
    ChartTooltip,
    Legend
);

const { Title, Text, Paragraph, Link } = Typography;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// --- Sample Data ---
const initialHistory = [
    {
        key: 'h1', id: 'N20240730-001', title: '7월 신간 알림', channel: 'push', targetType: 'group', targetValue: 'G003', status: 'sent', dispatchTime: '2024-07-30 10:00:00', successCount: 315, failureCount: 5, adminName: '김관리',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 320,
        templateName: '[신간] 독서의 계절, 7월의 새로운 책들을 만나보세요! 지금 바로 확인하기 >',
        linkUrl: 'https://example.com/books/new/july'
    },
    {
        key: 'h2', id: 'N20240729-003', title: '클린 코드 (개정판) 출간!', channel: 'email', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-07-29 14:30:00', successCount: 12530, failureCount: 120, adminName: '이운영',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 12650,
        templateName: '더욱 강력해진 클린 코드 개정판 출간! 지금 구매 시 10% 할인 + 특별 굿즈 증정!',
        linkUrl: 'https://example.com/books/cleancode-revised'
    },
    {
        key: 'h3', id: 'N20240728-001', title: 'React Hooks 심층 분석 리뷰 이벤트', channel: 'push', targetType: 'individual', targetValue: 'user001', status: 'failed', dispatchTime: '2024-07-28 11:00:00', successCount: 0, failureCount: 1, failureReason: 'Invalid device token', adminName: '박테스트',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 1,
        templateName: 'React Hooks 심층 분석 도서 리뷰 작성하고 커피 쿠폰 받아가세요! 참여 기간: ~7/31',
        linkUrl: 'https://example.com/events/react-hooks-review'
    },
    {
        key: 'h4', id: 'N20240801-001', title: '8월 특별 할인 쿠폰', channel: 'sms', targetType: 'group', targetValue: 'G001', status: 'scheduled', dispatchTime: '2024-08-01 09:00:00', successCount: 0, failureCount: 0, adminName: '김관리',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 50,
        templateName: '무더운 8월을 시원하게! 전 도서 15% 할인 쿠폰 도착! (~8/15)',
        linkUrl: null
    },
    {
        key: 'h5', id: 'N20240725-002', title: '서비스 점검 안내 (취소됨)', channel: 'email', targetType: 'all', targetValue: null, status: 'cancelled', dispatchTime: '2024-07-25 18:00:00', successCount: 0, failureCount: 0, adminName: '시스템',
        noticeType: 'regular',
        recipients: null,
        recipientCount: 0,
        templateName: '(취소됨) [점검] 더 나은 서비스를 위한 시스템 점검 안내 (7/26 02:00 ~ 04:00)',
        linkUrl: null
    },
    {
        key: 'h6', id: 'E20240731-001', title: '긴급 서버 점검 안내', channel: 'push', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-07-31 08:00:00', successCount: 15000, failureCount: 0, adminName: '시스템',
        noticeType: 'emergency',
        level: 'critical',
        recipients: null,
        recipientCount: 15000,
        templateName: '[긴급] 서비스 안정화를 위한 긴급 서버 점검을 진행합니다. (08:00 ~ 08:30)',
        linkUrl: null
    },
    {
        key: 'h7', id: 'E20240802-001', title: '로그인 지연 현상 안내', channel: 'push', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-08-02 11:00:00', successCount: 14800, failureCount: 200, adminName: '김모니터',
        noticeType: 'emergency',
        level: 'warning',
        recipients: null,
        recipientCount: 15000,
        templateName: '[안내] 현재 간헐적으로 로그인이 지연되는 현상이 있어 확인 중입니다. 이용에 불편을 드려 죄송합니다.',
        linkUrl: null
    },
    {
        key: 'h8', id: 'E20240803-001', title: '결제 시스템 임시 점검 완료', channel: 'email', targetType: 'all', targetValue: null, status: 'sent', dispatchTime: '2024-08-03 16:30:00', successCount: 15100, failureCount: 0, adminName: '시스템',
        noticeType: 'emergency',
        level: 'info',
        recipients: null,
        recipientCount: 15100,
        templateName: '[정보] 결제 시스템 임시 점검이 완료되어 현재 정상 이용 가능합니다. 감사합니다.',
        linkUrl: null
    },
    {
        key: 'h9', id: 'E20240805-001', title: '예정된 시스템 업데이트 사전 공지', channel: 'push', targetType: 'all', targetValue: null, status: 'scheduled', dispatchTime: '2024-08-05 00:00:00', successCount: 0, failureCount: 0, adminName: '박공지',
        noticeType: 'emergency',
        level: 'info',
        recipients: null,
        recipientCount: 15200,
        templateName: '[사전 공지] 8월 5일 02시부터 03시까지 시스템 업데이트가 진행될 예정입니다. 서비스 이용에 참고 부탁드립니다.',
        linkUrl: null
    },
];

// --- Sample Data for Auto Dispatch Status ---
const autoDispatchTypes = [
    { key: 'auto-01', typeId: 'AUTO_PAYMENT_CONFIRM', name: '구독 결제 완료 알림', description: '사용자가 구독 상품 결제를 완료했을 때 발송됩니다.', channel: 'email', status: 'active', last7DaysCount: 1523, successRate: 99.8, templateContent: '안녕하세요 [이름]님, [상품명] 구독 결제가 정상적으로 완료되었습니다. 지금 바로 이용해보세요!', linkUrl: null, conversionRate: null },
    { key: 'auto-02', typeId: 'AUTO_EXPIRY_WARNING_7D', name: '구독 만료 7일 전 안내', description: '구독 만료 7일 전에 사용자에게 안내 알림을 발송합니다.', channel: 'push', status: 'active', last7DaysCount: 850, successRate: 99.5, templateContent: '[이름]님의 [상품명] 구독이 7일 뒤 만료될 예정입니다. 잊지 말고 연장하세요!', linkUrl: 'https://example.com/subscribe/renew', conversionRate: 12.3 },
    { key: 'auto-04', typeId: 'AUTO_WELCOME_NEW_USER', name: '신규 가입 환영 메시지', description: '신규 회원이 가입했을 때 환영 메시지를 발송합니다.', channel: 'email', status: 'active', last7DaysCount: 1890, successRate: 99.9, templateContent: '밀리의 서재 회원이 되신 것을 환영합니다, [이름]님! 첫 달 무료 혜택을 확인해보세요.', linkUrl: 'https://example.com/welcome/benefit', conversionRate: 25.1 },
    { key: 'auto-06', typeId: 'AUTO_CART_ABANDONED_1H', name: '장바구니 알림 (1시간)', description: '장바구니에 상품을 담고 1시간 동안 결제하지 않은 사용자에게 알림을 발송합니다.', channel: 'push', status: 'active', last7DaysCount: 450, successRate: 98.2, templateContent: '[이름]님, 장바구니에 담아두신 상품이 기다리고 있어요! 지금 바로 확인해보세요.', linkUrl: 'https://example.com/cart', conversionRate: 8.5 },
    { key: 'auto-07', typeId: 'AUTO_PASSWORD_RESET_CONFIRM', name: '비밀번호 재설정 확인', description: '사용자가 비밀번호 재설정을 완료했을 때 확인 메일을 발송합니다.', channel: 'email', status: 'active', last7DaysCount: 320, successRate: 100, templateContent: '비밀번호 재설정이 완료되었습니다. 변경된 비밀번호로 로그인해주세요.', linkUrl: null, conversionRate: null },
    // Removed other items to keep 5 total
];

// --- Helper Functions ---
const getChannelTag = (channel) => {
    switch (channel?.toLowerCase()) {
        case 'email': return <Tag icon={<MailOutlined />} color="blue">이메일</Tag>;
        case 'sms': return <Tag icon={<MessageOutlined />} color="green">SMS</Tag>;
        case 'push': return <Tag icon={<BellOutlined />} color="purple">앱 푸시</Tag>;
        default: return <Tag>{channel || '-'}</Tag>;
    }
};

const getStatusTag = (status) => {
    switch (status) {
        case 'sent': return <Tag icon={<CheckCircleOutlined />} color="success">발송완료</Tag>;
        case 'failed': return <Tag icon={<CloseCircleOutlined />} color="error">발송실패</Tag>;
        case 'scheduled': return <Tag icon={<ClockCircleOutlined />} color="processing">예약됨</Tag>;
        case 'cancelled': return <Tag icon={<StopOutlined />} color="default">취소됨</Tag>;
        default: return <Tag>{status}</Tag>;
    }
};

const formatTarget = (targetType, targetValue) => {
    if (targetType === 'all') return '전체 사용자';
    if (targetType === 'group') return `그룹 (${targetValue || '-'})`; // Fetch group name later
    if (targetType === 'individual') return `개별 (${targetValue || '-'})`;
    return targetValue || '-';
};

// Helper for Auto Dispatch Status
const getAutoStatusTag = (status) => {
    return status === 'active'
        ? <Tag color="success">활성</Tag>
        : <Tag color="default">비활성</Tag>;
};

// Chart Options (Example)
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow height adjustment
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                padding: 20,
            }
        },
        title: {
            display: false,
        },
        tooltip: {
            enabled: true,
            intersect: false,
            mode: 'index',
        },
    },
    scales: {
        y: {
            beginAtZero: true
        }
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
    }
};

// --- Component ---
const DispatchHistory = () => {
    // --- State for Manual History ---
    const [history, setHistory] = useState(initialHistory);
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ channel: null, status: null, dateRange: null });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
    const [form] = Form.useForm(); // General form instance

    // --- State/Logic for Auto History ---
    const [autoHistoryData, setAutoHistoryData] = useState(autoDispatchTypes); // Use dummy data
    const [autoDispatchChartData, setAutoDispatchChartData] = useState(null); // State for chart data
    const [autoTypeColors, setAutoTypeColors] = useState({}); // State to store colors { key: color }
    const [autoChartDateRange, setAutoChartDateRange] = useState({ preset: '7d', range: null }); // { preset: 'today'/'yesterday'/'3d'/'7d'/'custom', range: [moment, moment] }
    const [isAddAutoTypeModalOpen, setIsAddAutoTypeModalOpen] = useState(false);
    const [addAutoTypeForm] = Form.useForm(); // Form instance for the add modal
    const [testRecipient, setTestRecipient] = useState(''); // State for test recipient input
    const [testRecipientError, setTestRecipientError] = useState(null); // State for test recipient error
    const [isAutoDetailModalOpen, setIsAutoDetailModalOpen] = useState(false);
    const [selectedAutoType, setSelectedAutoType] = useState(null);

    // Simulate fetching/generating chart data based on date range
    useEffect(() => {
        let startDate, endDate;
        let labels = [];
        const today = moment().endOf('day');

        if (autoChartDateRange.preset === 'today') {
            startDate = moment().startOf('day');
            endDate = today;
            labels = ['오늘']; // Or hourly labels if needed
        } else if (autoChartDateRange.preset === 'yesterday') {
            startDate = moment().subtract(1, 'day').startOf('day');
            endDate = moment().subtract(1, 'day').endOf('day');
            labels = ['어제']; // Or hourly labels
        } else if (autoChartDateRange.preset === '3d') {
            startDate = moment().subtract(2, 'days').startOf('day');
            endDate = today;
            labels = ['2일 전', '어제', '오늘'];
        } else if (autoChartDateRange.preset === '7d') {
            startDate = moment().subtract(6, 'days').startOf('day');
            endDate = today;
            labels = Array.from({ length: 7 }, (_, i) => moment().subtract(6 - i, 'days').format('MM/DD'));
        } else if (autoChartDateRange.preset === 'custom' && autoChartDateRange.range) {
            startDate = autoChartDateRange.range[0].startOf('day');
            endDate = autoChartDateRange.range[1].endOf('day');
            // Generate labels for the custom range (e.g., daily)
            const diffDays = endDate.diff(startDate, 'days');
             if (diffDays <= 30) { // Show daily labels for up to 30 days
                 labels = Array.from({ length: diffDays + 1 }, (_, i) => startDate.clone().add(i, 'days').format('MM/DD'));
             } else { // Aggregate weekly or monthly for longer ranges (example)
                 labels = [startDate.format('YYYY/MM/DD'), '...' , endDate.format('YYYY/MM/DD')]; // Simplified labels
             }
        } else {
            // Default or invalid state, maybe default to 7 days?
             startDate = moment().subtract(6, 'days').startOf('day');
             endDate = today;
             labels = Array.from({ length: 7 }, (_, i) => moment().subtract(6 - i, 'days').format('MM/DD'));
        }

        console.log(`Fetching/Generating chart data for: ${startDate.format('YYYY-MM-DD')} - ${endDate.format('YYYY-MM-DD')}`);

        const colorsMap = {}; // Temporary map to build colors
        const datasets = autoHistoryData.map((type, index) => {
            const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
            const color = colors[index % colors.length];
            colorsMap[type.key] = color; // Store color using type.key as the identifier
            return {
                label: type.name,
                data: labels.map(() => Math.floor(Math.random() * (type.last7DaysCount / 5 + 10) * (Math.random() * 0.4 + 0.8))),
                borderColor: color,
                backgroundColor: `${color}80`,
                tension: 0.1,
            };
        });
        setAutoDispatchChartData({ labels, datasets });
        setAutoTypeColors(colorsMap); // Set the colors state

    // Only re-run if the date range changes, not when the status in autoHistoryData changes
    // Note: This is a temporary fix for the dummy data setup.
    // If autoHistoryData changes in ways relevant to the chart (add/remove type, update stats),
    // this dependency array needs revisiting.
    }, [autoChartDateRange]); // REMOVED autoHistoryData from dependency array

    // --- Handlers for Date Range Selection ---
    const handleDatePresetChange = (e) => {
        const preset = e.target.value;
        setAutoChartDateRange({ preset: preset, range: null }); // Clear custom range when preset is selected
    };

    const handleCustomDateChange = (dates) => {
        if (dates && dates.length === 2) {
            setAutoChartDateRange({ preset: 'custom', range: dates });
        } else {
             // If range is cleared, maybe default back to 7d?
             setAutoChartDateRange({ preset: '7d', range: null });
        }
    };

    // --- Search & Filter Logic (Now specific to Manual tab) ---
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value === 'all' ? null : value }));
    };

    const handleDateChange = (dates) => {
        setFilters(prev => ({ ...prev, dateRange: dates }));
    };

    // Filtered Data for Manual Table
    const filteredHistory = useMemo(() => {
        return history.filter(item => {
            const matchesSearch = searchText
                ? item.title.toLowerCase().includes(searchText)
                : true;
            const matchesChannel = filters.channel ? item.channel === filters.channel : true;
            const matchesStatus = filters.status ? item.status === filters.status : true;
            const matchesDate = filters.dateRange
                ? moment(item.dispatchTime).isBetween(filters.dateRange[0], filters.dateRange[1], 'day', '[]')
                : true;
            return matchesSearch && matchesChannel && matchesStatus && matchesDate;
        });
    }, [history, searchText, filters]);

    // --- Actions (Mostly for Manual tab) ---
    const showDetailModal = (item) => {
        setSelectedHistoryItem(item);
        setIsDetailModalOpen(true);
    };

    const handleDetailModalCancel = () => {
        setIsDetailModalOpen(false);
        setSelectedHistoryItem(null);
    };

    const handleCancelScheduled = (key) => {
        setHistory(prev =>
            prev.map(item => item.key === key ? { ...item, status: 'cancelled' } : item)
        );
        message.success('예약된 알림 발송이 취소되었습니다.');
        // TODO: API Call to cancel scheduled notification
        console.log(`Cancelled scheduled notification key: ${key}`);
    };

    // --- Download Handlers (Simulation) ---
    const handleDownloadFailures = (historyId) => {
        message.loading({ content: `실패 목록 다운로드 준비 중 (ID: ${historyId})...`, key: 'download-failure' });
        // TODO: API call to fetch and download failure list as CSV
        console.log(`Requesting failure list CSV for history ID: ${historyId}`);
        setTimeout(() => {
            message.success({ content: '실패 목록 다운로드가 시작됩니다. (구현 필요)', key: 'download-failure', duration: 3 });
        }, 1500);
    };

    const handleDownloadSuccesses = (historyId) => {
        message.loading({ content: `성공 목록 다운로드 준비 중 (ID: ${historyId})...`, key: 'download-success' });
        // TODO: API call to fetch and download success list as CSV
        console.log(`Requesting success list CSV for history ID: ${historyId}`);
        setTimeout(() => {
            message.success({ content: '성공 목록 다운로드가 시작됩니다. (구현 필요)', key: 'download-success', duration: 3 });
        }, 1500);
    };

    // --- Resend Failures Handler (Simulation & State Update) ---
    const handleResendFailures = (originalItem) => {
        if (!originalItem) return;

        const historyId = originalItem.id;
        message.loading({ content: `실패 건 재발송 요청 중 (ID: ${historyId})...`, key: 'resend' });

        // TODO: API call to trigger resend for failures
        console.log(`Requesting resend for failures of history ID: ${historyId}`);

        setTimeout(() => { // Simulate API response
            message.success({ content: '실패 건에 대한 재발송 요청이 완료되었습니다.', key: 'resend', duration: 3 });

            // --- Simulate adding a new history entry for the resend ---
            const now = moment();
            const newResendEntry = {
                key: `resend-${originalItem.key}-${now.valueOf()}`,
                id: `R-${originalItem.id.substring(2)}`, // Example new ID convention
                title: `${originalItem.title} (재발송)`,
                channel: originalItem.channel,
                templateName: originalItem.templateName,
                linkUrl: originalItem.linkUrl,
                targetType: originalItem.targetType, // Resending to the same target group/individual implicitly
                targetValue: originalItem.targetValue,
                adminName: originalItem.adminName, // Or the current logged-in admin
                status: 'scheduled', // Start as scheduled or processing
                dispatchTime: now.format('YYYY-MM-DD HH:mm:ss'),
                successCount: 0,
                failureCount: 0,
                failureReason: null,
                recipientCount: originalItem.failureCount, // Target count is the number of failures
                recipients: null, // Recipient details would be populated upon actual send
            };

            setHistory(prevHistory => [newResendEntry, ...prevHistory]); // Add to the top of the list
            // --- End of simulation ---

            handleDetailModalCancel(); // Close the modal after initiating resend

        }, 2000);
    };

    // --- Handlers for Add Auto Type Modal ---
    const showAddAutoTypeModal = () => {
        addAutoTypeForm.resetFields();
        setIsAddAutoTypeModalOpen(true);
    };

    const handleAddAutoTypeCancel = () => {
        setIsAddAutoTypeModalOpen(false);
    };

    const handleAddAutoTypeOk = () => {
        addAutoTypeForm
            .validateFields()
            .then((values) => {
                console.log('New Auto Dispatch Type Values:', values);
                const newType = {
                    key: `auto-${Date.now()}`, // Simple unique key generation
                    name: values.name,
                    description: values.description,
                    channel: values.channel,
                    status: values.status,
                    templateContent: values.templateContent,
                    linkUrl: values.linkUrl || null,
                    // Initialize stats - these would normally come from backend aggregation
                    last7DaysCount: 0,
                    successRate: null,
                    conversionRate: values.linkUrl ? null : undefined,
                };
                // Add new type to the state (and thus the table)
                setAutoHistoryData(prev => [newType, ...prev]);
                message.success(`자동 발송 유형 '${newType.name}'이(가) 추가되었습니다.`);
                setIsAddAutoTypeModalOpen(false);
            })
            .catch((info) => {
                console.log('Add Auto Type Validate Failed:', info);
                 message.error('필수 입력 항목을 확인해주세요.');
            });
    };

    // --- Handlers for Test Recipient Input ---
    const handleTestRecipientChange = (e) => {
        setTestRecipient(e.target.value);
        if (testRecipientError) {
            setTestRecipientError(null);
        }
    };

    // --- Handler for Sending Test Auto Type Notification ---
    const handleSendAutoTypeTest = () => {
        const values = addAutoTypeForm.getFieldsValue(); // Get current form values
        const channel = values.channel;
        const templateContent = values.templateContent || '';
        const name = values.name || '자동 발송 테스트'; // Use type name as title

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

        // Replace known variables with dummy data
        let processedContent = templateContent;
        processedContent = processedContent.replace(/\[이름\]/g, '테스트사용자');
        processedContent = processedContent.replace(/\[이메일\]/g, 'test@example.com');
        // Add more variable replacements here if needed

        const recipientType = channel === 'email' ? 'email' : 'phone';
        console.log(`Sending TEST auto type notification via ${channel} to ${recipientType}:`, testRecipient);
        const testData = {
            noticeType: 'test-auto',
            channel: channel,
            title: name, // Use the type name as title for test
            content: processedContent, // Use processed content
            recipient: testRecipient,
            recipientType: recipientType,
        };

        message.loading({ content: `'${testRecipient}'(으)로 테스트 발송 중...`, key: 'testSendAuto' });
        // TODO: Implement actual API call for test send
        console.log('Test dispatch data (Auto Type):', testData);
        setTimeout(() => {
            message.success({ content: `'${testRecipient}'(으)로 테스트 발송 요청이 완료되었습니다!`, key: 'testSendAuto', duration: 3 });
        }, 1500);
    };

    // --- Re-ensure Handlers for Auto Detail Modal exist ---
    const showAutoDetailModal = (item) => {
        setSelectedAutoType(item);
        setIsAutoDetailModalOpen(true);
    };

    const handleAutoDetailModalCancel = () => {
        setIsAutoDetailModalOpen(false);
        setSelectedAutoType(null);
    };

    // --- Handlers for Auto Dispatch Status Toggle ---
    const handleAutoStatusToggle = (key, checked) => {
        const newStatus = checked ? 'active' : 'inactive';
        const targetType = autoHistoryData.find(item => item.key === key);

        message.loading({ content: `'${targetType?.name}' 상태 변경 중...`, key: `toggle-${key}` });

        // TODO: API call to update the status on the backend
        console.log(`Toggling status for key: ${key} to ${newStatus}`);
        setTimeout(() => { // Simulate API delay
            setAutoHistoryData(prev =>
                prev.map(item =>
                    item.key === key ? { ...item, status: newStatus } : item
                )
            );
            message.success({ content: `'${targetType?.name}' 상태가 ${newStatus === 'active' ? '활성' : '비활성'}(으)로 변경되었습니다.`, key: `toggle-${key}`, duration: 2 });
        }, 500);
    };

    // --- Table Columns Definition (For Manual Tab) ---
    const manualColumns = [
        { title: '발송 ID', dataIndex: 'id', key: 'id', width: 150, sorter: (a, b) => a.id.localeCompare(b.id) },
        { title: '알림 제목', dataIndex: 'title', key: 'title', width: 250, ellipsis: true },
        {
            title: '알림 종류', dataIndex: 'noticeType', key: 'noticeType', width: 120, align: 'center',
            render: (type, record) => {
                if (type === 'emergency') {
                    // Use a consistent color for all emergency notices
                    return <Tag color="volcano">긴급 공지</Tag>;
                } else {
                    return '일반 알림';
                }
            },
        },
        { title: '알림내용', dataIndex: 'templateName', key: 'templateName', width: 150, ellipsis: true, render: (text) => text || '-' },
        {
            title: '채널', dataIndex: 'channel', key: 'channel', width: 100, align: 'center',
            render: getChannelTag,
            filters: [
                { text: '이메일', value: 'email' },
                { text: 'SMS', value: 'sms' },
                { text: '앱 푸시', value: 'push' },
            ],
            onFilter: (value, record) => record.channel === value,
        },
        {
            title: '발송 대상', key: 'target', width: 150,
            render: (_, record) => formatTarget(record.targetType, record.targetValue)
        },
        {
            title: '발송(예약) 시간', dataIndex: 'dispatchTime', key: 'dispatchTime', width: 160,
            sorter: (a, b) => moment(a.dispatchTime).unix() - moment(b.dispatchTime).unix(),
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
            defaultSortOrder: 'descend'
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 110, align: 'center',
            render: (status, record) => (
                record.status === 'failed' && record.failureReason
                ? <Tooltip title={`실패사유: ${record.failureReason}`}>{getStatusTag(status)}</Tooltip>
                : getStatusTag(status)
            ),
            filters: [
                { text: '발송완료', value: 'sent' },
                { text: '발송실패', value: 'failed' },
                { text: '예약됨', value: 'scheduled' },
                { text: '취소됨', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
             title: '결과 (성공/실패)', key: 'result', width: 140, align: 'center',
             render: (_, record) => (
                 record.status === 'sent' || record.status === 'failed' ? (
                     <Space split={<Divider type="vertical" />}>
                         <Text type="success">{record.successCount?.toLocaleString() || 0}</Text>
                         <Text type="danger">{record.failureCount?.toLocaleString() || 0}</Text>
                     </Space>
                 ) : (
                     <Text type="secondary">-</Text>
                 )
             )
        },
        {
            title: '관리자', dataIndex: 'adminName', key: 'adminName', width: 100, align: 'center'
        },
        {
            title: '관리', key: 'action', width: 100, align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="상세 보기">
                        <Button icon={<EyeOutlined />} onClick={() => showDetailModal(record)} size="small" />
                    </Tooltip>
                    {/* Cancel button only for scheduled manual dispatches */}
                    {record.status === 'scheduled' && record.noticeType === 'regular' && (
                        <Popconfirm
                            title="이 예약을 취소하시겠습니까?"
                            onConfirm={() => handleCancelScheduled(record.key)}
                            okText="예약 취소"
                            cancelText="닫기"
                        >
                            <Tooltip title="예약 취소">
                                <Button icon={<DeleteOutlined />} danger size="small" />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    // --- Table Columns Definition (For Auto Tab) ---
    const autoColumns = [
        {
            title: '자동 발송 유형',
            dataIndex: 'name',
            key: 'name',
            width: 220,
            render: (name, record) => (
                 <Space size="small">
                     <span
                         style={{
                             display: 'inline-block',
                             width: '8px',
                             height: '8px',
                             borderRadius: '50%',
                             backgroundColor: autoTypeColors[record.key] || '#ccc', // Get color from state, fallback grey
                             marginRight: '8px',
                         }}
                     />
                     {name}
                 </Space>
            ),
        },
        { title: '설명', dataIndex: 'description', key: 'description', ellipsis: true },
        {
            title: '채널', dataIndex: 'channel', key: 'channel', width: 100, align: 'center',
            render: getChannelTag
        },
        {
            title: '상태', dataIndex: 'status', key: 'status', width: 80, align: 'center',
            render: (status, record) => (
                <Switch
                    checked={status === 'active'}
                    onChange={(checked) => handleAutoStatusToggle(record.key, checked)}
                />
            ),
        },
        {
            title: '최근 7일 발송 수', dataIndex: 'last7DaysCount', key: 'last7DaysCount', width: 140, align: 'right',
            render: (count) => count?.toLocaleString() || 0,
        },
        {
            title: '성공률 (%)', dataIndex: 'successRate', key: 'successRate', width: 100, align: 'right',
            render: (rate) => rate?.toFixed(1) ?? '-',
        },
        {
            title: '전환율 (%)',
            dataIndex: 'conversionRate',
            key: 'conversionRate',
            width: 100, align: 'right',
            render: (rate, record) => record.linkUrl ? (rate?.toFixed(1) ?? '-') : '-',
        },
        {
            title: '연결 링크',
            dataIndex: 'linkUrl',
            key: 'linkUrl',
            width: 200,
            ellipsis: true,
            render: (url) => url ? (
                <Link href={url} target="_blank" rel="noopener noreferrer">{url}</Link>
            ) : (
                '-'
            ),
        },
        {
            title: '관리', key: 'action', width: 100, align: 'center',
            render: (_, record) => (
                <Space size="small">
                    {/* Ensure Detail button is active and linked */}
                    <Tooltip title="상세 보기">
                         <Button icon={<EyeOutlined />} size="small" onClick={() => showAutoDetailModal(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    // --- New handler for sending test notification from auto detail modal ---
    const handleSendAutoDetailTest = (autoType) => {
        if (!autoType) return;

        const templateContent = autoType.templateContent || '';
        const name = autoType.name || '자동 발송 테스트';

        let processedContent = templateContent;
        processedContent = processedContent.replace(/\[이름\]/g, '테스트사용자');
        processedContent = processedContent.replace(/\[이메일\]/g, 'test@example.com');

        const recipientType = autoType.channel === 'email' ? 'email' : 'phone';
        console.log(`Sending TEST auto detail notification via ${autoType.channel} to ${recipientType}:`, testRecipient);
        const testData = {
            noticeType: 'test-auto',
            channel: autoType.channel,
            title: name,
            content: processedContent,
            recipient: testRecipient,
            recipientType: recipientType,
        };

        message.loading({ content: `'${testRecipient}'(으)로 테스트 발송 중...`, key: 'testSendAutoDetail' });
        // TODO: Implement actual API call for test send
        console.log('Test dispatch data (Auto Detail):', testData);
        setTimeout(() => {
            message.success({ content: `'${testRecipient}'(으)로 테스트 발송 요청이 완료되었습니다!`, key: 'testSendAutoDetail', duration: 3 });
        }, 1500);
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>알림 발송 관리</Title>

            <Tabs defaultActiveKey="manual">
                <Tabs.TabPane tab="수동 발송 내역" key="manual">
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Text type="secondary">관리자가 직접 발송했거나 예약한 알림 목록과 결과를 확인합니다.</Text>
                        {/* Search and Filter Controls for Manual Tab */}
                        <Space wrap style={{ marginBottom: 16 }}>
                             <Search
                                placeholder="알림 제목 검색"
                                allowClear
                                enterButton={<><SearchOutlined /> 검색</>}
                                onSearch={handleSearch}
                                style={{ width: 300 }}
                             />
                            <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                            <Select
                                defaultValue="all"
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange('channel', value)}
                                aria-label="채널 필터"
                            >
                                <Option value="all">전체 채널</Option>
                                <Option value="push">앱 푸시</Option>
                                <Option value="email">이메일</Option>
                                <Option value="sms">SMS</Option>
                            </Select>
                            <Select
                                defaultValue="all"
                                style={{ width: 120 }}
                                onChange={(value) => handleFilterChange('status', value)}
                                aria-label="상태 필터"
                            >
                                <Option value="all">전체 상태</Option>
                                <Option value="sent">발송완료</Option>
                                <Option value="failed">발송실패</Option>
                                <Option value="scheduled">예약됨</Option>
                                <Option value="cancelled">취소됨</Option>
                            </Select>
                            <RangePicker onChange={handleDateChange} placeholder={['시작일', '종료일']} />
                        </Space>

                        {/* Manual History Table */}
                        <Table
                            columns={manualColumns}
                            dataSource={filteredHistory}
                            pagination={{ pageSize: 10 }}
                            rowKey="key"
                            scroll={{ x: 1500 }}
                            bordered
                            size="small"
                        />
                    </Space>
                </Tabs.TabPane>

                <Tabs.TabPane tab="자동 발송 현황" key="auto">
                     <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                         <Text type="secondary">구독 결제, 만료 임박 등 조건에 따라 자동으로 발송되는 알림의 현황을 확인합니다.</Text>

                         {/* Add Auto Type Button */}
                          <div style={{ textAlign: 'right' }}>
                             <Button
                                 type="primary"
                                 icon={<PlusOutlined />}
                                 onClick={showAddAutoTypeModal}
                             >
                                 자동 발송 유형 추가
                             </Button>
                          </div>

                         {/* Chart Area with Date Controls Inside */}
                         <div style={{ marginBottom: '16px', padding: '20px', border: '1px solid #f0f0f0', borderRadius: '4px' }}>
                            {/* Move Date Range Controls Here */}
                             <Space wrap style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}> {/* Align controls to the right */} 
                                 <Radio.Group
                                     value={autoChartDateRange.preset !== 'custom' ? autoChartDateRange.preset : null}
                                     onChange={handleDatePresetChange}
                                     size="small" // Make controls smaller
                                 >
                                     <Radio.Button value="today">오늘</Radio.Button>
                                     <Radio.Button value="yesterday">어제</Radio.Button>
                                     <Radio.Button value="3d">3일</Radio.Button>
                                     <Radio.Button value="7d">7일</Radio.Button>
                                 </Radio.Group>
                                 <RangePicker
                                     value={autoChartDateRange.preset === 'custom' ? autoChartDateRange.range : null}
                                     onChange={handleCustomDateChange}
                                     placeholder={['시작일', '종료일']}
                                     size="small" // Make controls smaller
                                 />
                             </Space>

                             {/* Remove Chart Title */}
                             {/* <Title level={5}>최근 7일 자동 발송 추이 (유형별)</Title> */}

                             {/* Chart Canvas Container */}
                              <div style={{ height: '250px' }}> {/* Adjust height slightly */} 
                                 {autoDispatchChartData ? (
                                     <Line options={chartOptions} data={autoDispatchChartData} />
                                 ) : (
                                     <Spin tip="차트 데이터 로딩 중..." />
                                 )}
                             </div>
                         </div>

                         {/* Auto Dispatch Table */}
                         <Table
                            columns={autoColumns}
                            dataSource={autoHistoryData}
                            pagination={{ pageSize: 10 }}
                            rowKey="key"
                            scroll={{ x: 1000 }}
                            bordered
                            size="small"
                         />
                     </Space>
                </Tabs.TabPane>
            </Tabs>

            {/* Manual Detail Modal */}
            <Modal
                title={`발송 내역 상세 (ID: ${selectedHistoryItem?.id})`}
                open={isDetailModalOpen}
                onCancel={handleDetailModalCancel}
                footer={[
                    <Button key="back" onClick={handleDetailModalCancel}>
                        닫기
                    </Button>,
                ]}
                width={800}
            >
                {selectedHistoryItem && (
                    <>
                        <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="알림 제목" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.title}
                            </Descriptions.Item>
                            <Descriptions.Item label="알림 종류" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.noticeType === 'emergency'
                                    ? <Tag color="volcano">긴급 공지</Tag>
                                    : '일반 알림'
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="알림내용" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.templateName || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="첨부 링크" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.linkUrl ? (
                                    <Link href={selectedHistoryItem.linkUrl} target="_blank" rel="noopener noreferrer">
                                        {selectedHistoryItem.linkUrl}
                                    </Link>
                                ) : (
                                    '-'
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="관리자" labelStyle={{ minWidth: '120px' }}>
                                {selectedHistoryItem.adminName || '-'}
                            </Descriptions.Item>
                            <Descriptions.Item label="채널" labelStyle={{ minWidth: '120px' }}>
                                {getChannelTag(selectedHistoryItem.channel)}
                            </Descriptions.Item>
                            <Descriptions.Item label="발송 대상" labelStyle={{ minWidth: '120px' }}>
                                {formatTarget(selectedHistoryItem.targetType, selectedHistoryItem.targetValue)} ({selectedHistoryItem.recipientCount?.toLocaleString() || 0}명)
                            </Descriptions.Item>
                            <Descriptions.Item label="발송(예약) 시간" labelStyle={{ minWidth: '120px' }}>
                                {moment(selectedHistoryItem.dispatchTime).format('YYYY-MM-DD HH:mm:ss')}
                            </Descriptions.Item>
                            <Descriptions.Item label="상태" labelStyle={{ minWidth: '120px' }}>
                                {getStatusTag(selectedHistoryItem.status)}
                            </Descriptions.Item>
                            {(selectedHistoryItem.status === 'sent' || selectedHistoryItem.status === 'failed') && (
                                <Descriptions.Item label="결과 요약" labelStyle={{ minWidth: '120px' }}>
                                    {/* Use Row/Col for button alignment */}
                                    <Row justify="space-between" align="middle" style={{ width: '100%' }}>
                                        <Col>
                                            <span>
                                                성공 {selectedHistoryItem.successCount?.toLocaleString() || 0}건 /
                                                실패 {selectedHistoryItem.failureCount?.toLocaleString() || 0}건
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row justify="space-between" align="middle" style={{ width: '100%', marginTop: '8px' }}>
                                        <Col>
                                            {/* Success Button */}
                                            {selectedHistoryItem.successCount > 0 && (
                                                <Button
                                                    icon={<DownloadOutlined />}
                                                    size="small"
                                                    onClick={() => handleDownloadSuccesses(selectedHistoryItem.id)}
                                                >
                                                    성공 목록 (CSV)
                                                </Button>
                                            )}
                                        </Col>
                                        <Col>
                                            {/* Failure Buttons grouped */}
                                            <Space wrap size="small">
                                                {selectedHistoryItem.failureCount > 0 && (
                                                    <Button
                                                        icon={<DownloadOutlined />}
                                                        size="small"
                                                        onClick={() => handleDownloadFailures(selectedHistoryItem.id)}
                                                        
                                                    >
                                                        실패 목록 (CSV)
                                                    </Button>
                                                )}
                                                {/* Resend Button for Failures */}
                                                {selectedHistoryItem.failureCount > 0 && (
                                                    <Popconfirm
                                                        title="실패한 사용자에게 재발송하시겠습니까?"
                                                        onConfirm={() => handleResendFailures(selectedHistoryItem)}
                                                        okText="재발송"
                                                        cancelText="취소"
                                                    >
                                                        <Button
                                                            icon={<ReloadOutlined />}
                                                            size="small"
                                                        >
                                                            실패 건 재발송
                                                        </Button>
                                                    </Popconfirm>
                                                )}
                                            </Space>
                                        </Col>
                                    </Row>
                                </Descriptions.Item>
                            )}
                            {selectedHistoryItem.status === 'failed' && selectedHistoryItem.failureReason && (
                                <Descriptions.Item label="실패 사유 (대표)" labelStyle={{ minWidth: '120px' }}>
                                    {selectedHistoryItem.failureReason}
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </>
                 )}
             </Modal>

            {/* Add Auto Dispatch Type Modal */}
            <Modal
                title="자동 발송 유형 추가"
                open={isAddAutoTypeModalOpen}
                onOk={handleAddAutoTypeOk}
                onCancel={handleAddAutoTypeCancel}
                okText="추가"
                cancelButtonProps={{ style: { display: 'none' } }}
                width={720}
                destroyOnClose // Close될 때 내부 필드 초기화
            >
                <Form form={addAutoTypeForm} layout="vertical" name="add_auto_type_form">
                    <Form.Item
                        name="name"
                        label="유형명"
                        rules={[{ required: true, message: '자동 발송 유형명을 입력해주세요.' }]}
                        tooltip="관리 화면에 표시될 이름입니다 (예: 신규 가입 환영 메시지)"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="설명"
                        rules={[{ required: true, message: '자동 발송 조건 및 목적을 설명해주세요.' }]}
                    >
                        <TextArea rows={2} placeholder="예: 신규 회원이 가입했을 때 환영 메시지를 발송합니다." />
                    </Form.Item>
                     <Row gutter={16}>
                         <Col span={12}>
                             <Form.Item
                                name="channel"
                                label="주 발송 채널"
                                rules={[{ required: true, message: '주 발송 채널을 선택해주세요.' }]}
                             >
                                 <Select placeholder="채널 선택">
                                     <Option value="push"><BellOutlined /> 앱 푸시</Option>
                                     <Option value="email"><MailOutlined /> 이메일</Option>
                                     <Option value="sms"><MessageOutlined /> SMS</Option>
                                     {/* Add more channels like KakaoTalk if needed */}
                                 </Select>
                             </Form.Item>
                         </Col>
                         <Col span={12}>
                             <Form.Item name="status" label="상태" rules={[{ required: true }]}>
                                 <Radio.Group>
                                     <Radio value="active">활성</Radio>
                                     <Radio value="inactive">비활성</Radio>
                                 </Radio.Group>
                             </Form.Item>
                         </Col>
                     </Row>
                    <Form.Item
                        name="templateContent"
                        label="알림 내용 (템플릿)"
                        rules={[{ required: true, message: '알림 내용을 입력해주세요.' }]}
                        extra={ /* Re-using the variable display */
                             <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '8px', textAlign: 'right' }}>
                                 사용 가능한 변수: {' '}
                                 <Tag>[이름]</Tag>
                                 <Tag>[이메일]</Tag>
                                 {/* Add other relevant variables based on trigger context */}
                             </Text>
                        }
                    >
                        <TextArea rows={5} placeholder="예: [이름]님, 환영합니다!" />
                    </Form.Item>
                     <Form.Item
                         name="linkUrl"
                         label="연결 링크 (선택 사항)"
                         rules={[{ type: 'url', warningOnly: true, message: '유효한 URL 형식이 아닙니다.' }]}
                      >
                         <Input placeholder="알림 클릭 시 이동할 URL (예: https://...)" />
                      </Form.Item>
                 </Form>

                 {/* Divider and Test Send Section */}
                 <Divider>테스트 발송</Divider>
                  <Form layout="vertical" style={{ marginTop: '16px' }}>
                       <Form.Item
                            // Dynamically set label based on the channel selected in the form above
                            label={addAutoTypeForm.getFieldValue('channel') === 'email' ? "테스트 이메일" : "테스트 번호"}
                            tooltip={`현재 입력된 템플릿 내용으로 테스트 발송을 하려면 ${addAutoTypeForm.getFieldValue('channel') === 'email' ? '이메일을' : '번호를'} 입력 후 버튼을 누르세요.`}
                            validateStatus={testRecipientError ? 'error' : ''}
                            help={testRecipientError || ''}
                        >
                            <Space.Compact block style={{ width: '100%' }}>
                                <Input
                                    placeholder={addAutoTypeForm.getFieldValue('channel') === 'email'
                                        ? "이메일 주소 입력 (예: test@example.com)"
                                        : "숫자만 입력 (예: 01012345678)"}
                                    value={testRecipient}
                                    onChange={handleTestRecipientChange}
                                    allowClear
                                />
                                <Button
                                    key="testAuto"
                                    onClick={handleSendAutoTypeTest} // Use the new handler
                                    icon={<MobileOutlined />}
                                >
                                    나에게 알림 발송
                                </Button>
                            </Space.Compact>
                        </Form.Item>
                   </Form>
             </Modal>

            {/* Re-ensure Auto Detail Modal component exists */}
            <Modal
                title="자동 발송 상세"
                open={isAutoDetailModalOpen}
                onCancel={handleAutoDetailModalCancel}
                footer={null}
                width={720}
            >
                {selectedAutoType && (
                    <>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="유형명" labelStyle={{ width: '120px' }}>{selectedAutoType.name}</Descriptions.Item>
                            <Descriptions.Item label="유형 ID" labelStyle={{ width: '120px' }}>{selectedAutoType.typeId || selectedAutoType.key}</Descriptions.Item>
                            <Descriptions.Item label="설명" labelStyle={{ width: '120px' }}>{selectedAutoType.description}</Descriptions.Item>
                            <Descriptions.Item label="채널" labelStyle={{ width: '120px' }}>{getChannelTag(selectedAutoType.channel)}</Descriptions.Item>
                            <Descriptions.Item label="상태" labelStyle={{ width: '120px' }}>{getAutoStatusTag(selectedAutoType.status)}</Descriptions.Item>
                            <Descriptions.Item label="알림 내용 (템플릿)" labelStyle={{ width: '120px' }}>
                                <Paragraph style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                                    {selectedAutoType.templateContent}
                                </Paragraph>
                            </Descriptions.Item>
                            {selectedAutoType.linkUrl && (
                                <Descriptions.Item label="연결 링크" labelStyle={{ width: '120px' }}>
                                    <Link href={selectedAutoType.linkUrl} target="_blank" rel="noopener noreferrer">{selectedAutoType.linkUrl}</Link>
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="최근 7일 발송" labelStyle={{ width: '120px' }}>{selectedAutoType.last7DaysCount?.toLocaleString() ?? 0}</Descriptions.Item>
                            <Descriptions.Item label="성공률 (%)" labelStyle={{ width: '120px' }}>{selectedAutoType.successRate?.toFixed(1) ?? '-'}</Descriptions.Item>
                            {selectedAutoType.linkUrl && (
                                <Descriptions.Item label="전환율 (%)" labelStyle={{ width: '120px' }}>{selectedAutoType.conversionRate?.toFixed(1) ?? '-'}</Descriptions.Item>
                            )}
                        </Descriptions>

                        {/* Divider and Test Send Section */}
                        <Divider>테스트 발송</Divider>
                        <Form layout="vertical" style={{ marginTop: '16px' }}>
                             <Form.Item
                                 label={selectedAutoType.channel === 'email' ? "테스트 이메일" : "테스트 번호"}
                                 tooltip={`현재 선택된 유형의 템플릿 내용으로 테스트 발송을 하려면 ${selectedAutoType.channel === 'email' ? '이메일을' : '번호를'} 입력 후 버튼을 누르세요.`}
                                 validateStatus={testRecipientError ? 'error' : ''}
                                 help={testRecipientError || ''}
                             >
                                 <Space.Compact block style={{ width: '100%' }}>
                                     <Input
                                         placeholder={selectedAutoType.channel === 'email'
                                             ? "이메일 주소 입력 (예: test@example.com)"
                                             : "숫자만 입력 (예: 01012345678)"}
                                         value={testRecipient}
                                         onChange={handleTestRecipientChange}
                                         allowClear
                                     />
                                     <Button
                                         key="testAutoDetail"
                                         onClick={() => handleSendAutoDetailTest(selectedAutoType)}
                                         icon={<SendOutlined />}
                                     >
                                         나에게 알림 발송
                                     </Button>
                                 </Space.Compact>
                             </Form.Item>
                        </Form>
                    </>
                 )}
             </Modal>
        </Space>
    );
};

export default DispatchHistory; 