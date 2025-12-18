import React, { useMemo, useState } from 'react';
import {
  Input,
  Select,
  DatePicker,
  Button,
  Row,
  Col,
  Table,
  Tag,
  Modal,
  Descriptions,
  Card,
  Timeline,
  InputNumber,
  Space,
  Tooltip,
  message,
  Divider,
  Typography,
  Badge,
  Alert,
  Tabs,
} from 'antd';
import {
  InfoCircleOutlined,
  MailOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Text, Title } = Typography;

// 해지 유형
const CANCELLATION_TYPES = {
  AUTO_CANCEL: '자동결제 해지',
  MID_CANCEL: '중도해지',
};

// 상태 정의 (기획서 기준)
const STATUS = {
  RECEIVED: '접수 완료',
  REFUND_SENT: '환불 안내 발송 완료',
};

const STATUS_COLOR = {
  '접수 완료': 'processing',
  '환불 안내 발송 완료': 'success',
};

// 구독 플랜
const SUBSCRIPTION_PLANS = {
  BASIC: '밀리 베이직',
  STANDARD: '밀리 스탠다드',
  PREMIUM: '밀리 프리미엄',
};

const ADMIN_NAME = '운영자A';

// 환불 금액 계산 (잔여 기간 기반)
function calculateRefundInfo(paymentDate, endDate, paymentAmount) {
  if (!paymentDate || !endDate || !paymentAmount) {
    return { refundAmount: 0, remainingDays: 0, totalDays: 0, usedDays: 0 };
  }

  const paid = moment(paymentDate, 'YYYY-MM-DD');
  const end = moment(endDate, 'YYYY-MM-DD');
  const now = moment();

  const totalDays = end.diff(paid, 'days');
  const usedDays = now.diff(paid, 'days');
  const remainingDays = Math.max(0, totalDays - usedDays);

  // 잔여 기간 비율로 환불 금액 계산
  const refundAmount = totalDays > 0
    ? Math.floor((remainingDays / totalDays) * paymentAmount)
    : 0;

  return { refundAmount, remainingDays, totalDays, usedDays };
}

// 초기 더미 데이터
const initialData = [
  {
    id: 1,
    oderId: 'ORD-2025-001',
    userName: '홍길동',
    email: 'hong@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.PREMIUM,
    cancellationType: CANCELLATION_TYPES.MID_CANCEL,
    requestDate: '2025-04-20 14:00:00',
    paymentDate: '2025-04-01',
    paymentAmount: 15000,
    endDate: '2025-05-01',
    isServiceRestricted: true,
    isRefundTarget: true,
    status: STATUS.RECEIVED,
    communicationLogs: [
      { id: 1, type: 'email', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-20 14:00:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-20 14:00:05', sentBy: '시스템', status: '발송 완료' },
    ],
  },
  {
    id: 2,
    orderId: 'ORD-2025-002',
    userName: '김철수',
    email: 'kim@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.BASIC,
    cancellationType: CANCELLATION_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-19 11:00:00',
    paymentDate: '2025-04-01',
    paymentAmount: 9900,
    endDate: '2025-05-01',
    isServiceRestricted: false,
    isRefundTarget: false,
    status: STATUS.RECEIVED,
    communicationLogs: [
      { id: 1, type: 'email', title: '자동결제 해지 안내', sentAt: '2025-04-19 11:00:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '자동결제 해지 안내', sentAt: '2025-04-19 11:00:05', sentBy: '시스템', status: '발송 완료' },
    ],
  },
  {
    id: 3,
    orderId: 'ORD-2025-003',
    userName: '이영희',
    email: 'lee@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.PREMIUM,
    cancellationType: CANCELLATION_TYPES.MID_CANCEL,
    requestDate: '2025-04-18 09:10:00',
    paymentDate: '2025-04-10',
    paymentAmount: 15000,
    endDate: '2025-05-10',
    isServiceRestricted: true,
    isRefundTarget: true,
    status: STATUS.REFUND_SENT,
    communicationLogs: [
      { id: 1, type: 'email', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-18 09:10:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-18 09:10:05', sentBy: '시스템', status: '발송 완료' },
      { id: 3, type: 'email', title: '환불 금액 안내', sentAt: '2025-04-18 10:30:00', sentBy: '운영자B', status: '발송 완료' },
    ],
  },
  {
    id: 4,
    orderId: 'ORD-2025-004',
    userName: '박민수',
    email: 'park@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.STANDARD,
    cancellationType: CANCELLATION_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-18 10:00:00',
    paymentDate: '2025-04-05',
    paymentAmount: 12900,
    endDate: '2025-05-05',
    isServiceRestricted: false,
    isRefundTarget: false,
    status: STATUS.RECEIVED,
    communicationLogs: [
      { id: 1, type: 'email', title: '자동결제 해지 안내', sentAt: '2025-04-18 10:00:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '자동결제 해지 안내', sentAt: '2025-04-18 10:00:05', sentBy: '시스템', status: '발송 완료' },
    ],
  },
  {
    id: 5,
    orderId: 'ORD-2025-005',
    userName: '최서연',
    email: 'choi@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.PREMIUM,
    cancellationType: CANCELLATION_TYPES.MID_CANCEL,
    requestDate: '2025-04-17 08:20:00',
    paymentDate: '2025-04-08',
    paymentAmount: 15000,
    endDate: '2025-05-08',
    isServiceRestricted: true,
    isRefundTarget: true,
    status: STATUS.RECEIVED,
    communicationLogs: [
      { id: 1, type: 'email', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-17 08:20:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-17 08:20:05', sentBy: '시스템', status: '발송 완료' },
    ],
  },
  {
    id: 6,
    orderId: 'ORD-2025-006',
    userName: '김나래',
    email: 'narae@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.BASIC,
    cancellationType: CANCELLATION_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-17 09:05:00',
    paymentDate: '2025-04-02',
    paymentAmount: 9900,
    endDate: '2025-05-02',
    isServiceRestricted: false,
    isRefundTarget: false,
    status: STATUS.RECEIVED,
    communicationLogs: [
      { id: 1, type: 'email', title: '자동결제 해지 안내', sentAt: '2025-04-17 09:05:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '자동결제 해지 안내', sentAt: '2025-04-17 09:05:05', sentBy: '시스템', status: '발송 완료' },
    ],
  },
  {
    id: 7,
    orderId: 'ORD-2025-007',
    userName: '오세준',
    email: 'oh@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.STANDARD,
    cancellationType: CANCELLATION_TYPES.MID_CANCEL,
    requestDate: '2025-04-16 10:22:00',
    paymentDate: '2025-04-10',
    paymentAmount: 12900,
    endDate: '2025-05-10',
    isServiceRestricted: true,
    isRefundTarget: true,
    status: STATUS.REFUND_SENT,
    communicationLogs: [
      { id: 1, type: 'email', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-16 10:22:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-16 10:22:05', sentBy: '시스템', status: '발송 완료' },
      { id: 3, type: 'email', title: '환불 금액 안내', sentAt: '2025-04-16 14:00:00', sentBy: '운영자A', status: '발송 완료' },
    ],
  },
  {
    id: 8,
    orderId: 'ORD-2025-008',
    userName: '정수빈',
    email: 'jung@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.PREMIUM,
    cancellationType: CANCELLATION_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-16 09:00:00',
    paymentDate: '2025-04-01',
    paymentAmount: 15000,
    endDate: '2025-05-01',
    isServiceRestricted: false,
    isRefundTarget: false,
    status: STATUS.RECEIVED,
    communicationLogs: [
      { id: 1, type: 'email', title: '자동결제 해지 안내', sentAt: '2025-04-16 09:00:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '자동결제 해지 안내', sentAt: '2025-04-16 09:00:05', sentBy: '시스템', status: '발송 완료' },
    ],
  },
  {
    id: 9,
    orderId: 'ORD-2025-009',
    userName: '한예린',
    email: 'han@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.BASIC,
    cancellationType: CANCELLATION_TYPES.MID_CANCEL,
    requestDate: '2025-04-15 08:50:00',
    paymentDate: '2025-04-05',
    paymentAmount: 9900,
    endDate: '2025-05-05',
    isServiceRestricted: true,
    isRefundTarget: true,
    status: STATUS.REFUND_SENT,
    communicationLogs: [
      { id: 1, type: 'email', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-15 08:50:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '해지 신청 접수 완료 안내', sentAt: '2025-04-15 08:50:05', sentBy: '시스템', status: '발송 완료' },
      { id: 3, type: 'email', title: '환불 금액 안내', sentAt: '2025-04-15 11:20:00', sentBy: '운영자C', status: '발송 완료' },
    ],
  },
  {
    id: 10,
    orderId: 'ORD-2025-010',
    userName: '서유리',
    email: 'seo@example.com',
    subscriptionPlan: SUBSCRIPTION_PLANS.STANDARD,
    cancellationType: CANCELLATION_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-15 13:15:00',
    paymentDate: '2025-04-03',
    paymentAmount: 12900,
    endDate: '2025-05-03',
    isServiceRestricted: false,
    isRefundTarget: false,
    status: STATUS.RECEIVED,
    communicationLogs: [
      { id: 1, type: 'email', title: '자동결제 해지 안내', sentAt: '2025-04-15 13:15:05', sentBy: '시스템', status: '발송 완료' },
      { id: 2, type: 'notification', title: '자동결제 해지 안내', sentAt: '2025-04-15 13:15:05', sentBy: '시스템', status: '발송 완료' },
    ],
  },
];

const FILTER_DEFAULT = {
  search: '',
  cancellationType: 'all',
  status: 'all',
  dateRange: null,
};

// 환불 안내 이메일 기본 템플릿
const getRefundEmailTemplate = (record, refundAmount) => {
  if (!record) return '';
  return `안녕하세요, ${record.userName}님.

밀리의 서재 구독 해지 신청이 정상적으로 처리되었습니다.

■ 환불 안내
- 구독 플랜: ${record.subscriptionPlan}
- 결제 금액: ${record.paymentAmount.toLocaleString()}원
- 환불 금액: ${refundAmount.toLocaleString()}원

환불 금액은 영업일 기준 3~5일 내에 원결제 수단으로 환불됩니다.

문의사항이 있으시면 고객센터로 연락 부탁드립니다.

감사합니다.
밀리의 서재 드림`;
};

const SubscriptionCancellationManagement = () => {
  const [filters, setFilters] = useState(FILTER_DEFAULT);
  const [data, setData] = useState(initialData);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isEmailModalVisible, setIsEmailModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [customRefundAmount, setCustomRefundAmount] = useState(null);
  const [emailContent, setEmailContent] = useState('');

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(FILTER_DEFAULT);
  };

  // 카드 클릭 핸들러
  const handleCardClick = (type) => {
    switch (type) {
      case 'total':
        setFilters(FILTER_DEFAULT);
        break;
      case 'autoCancel':
        setFilters({
          ...FILTER_DEFAULT,
          cancellationType: CANCELLATION_TYPES.AUTO_CANCEL,
        });
        break;
      case 'midCancel':
        setFilters({
          ...FILTER_DEFAULT,
          cancellationType: CANCELLATION_TYPES.MID_CANCEL,
        });
        break;
      case 'pendingRefund':
        setFilters({
          ...FILTER_DEFAULT,
          cancellationType: CANCELLATION_TYPES.MID_CANCEL,
          status: STATUS.RECEIVED,
        });
        break;
      default:
        break;
    }
  };

  // 필터링된 데이터
  const filtered = useMemo(() => {
    return data.filter((row) => {
      // 해지 유형 필터
      if (filters.cancellationType !== 'all' && row.cancellationType !== filters.cancellationType) {
        return false;
      }

      // 상태 필터
      if (filters.status !== 'all' && row.status !== filters.status) {
        return false;
      }

      // 검색 필터 (사용자 ID, 이메일)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesId = row.userName.toLowerCase().includes(searchLower);
        const matchesEmail = row.email.toLowerCase().includes(searchLower);
        if (!matchesId && !matchesEmail) {
          return false;
        }
      }

      // 날짜 범위 필터
      if (filters.dateRange && filters.dateRange.length === 2) {
        const date = moment(row.requestDate, 'YYYY-MM-DD HH:mm:ss');
        const [start, end] = filters.dateRange;
        if (!date.isBetween(start.startOf('day'), end.endOf('day'), null, '[]')) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters]);

  // 해지 요청 일시 기준 정렬
  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) =>
        moment(b.requestDate, 'YYYY-MM-DD HH:mm:ss').valueOf() -
        moment(a.requestDate, 'YYYY-MM-DD HH:mm:ss').valueOf()
    );
  }, [filtered]);

  // 상세 모달 열기
  const showDetailModal = (record) => {
    if (record.cancellationType === CANCELLATION_TYPES.MID_CANCEL) {
      setSelectedItem(record);
      const refundInfo = calculateRefundInfo(record.paymentDate, record.endDate, record.paymentAmount);
      setCustomRefundAmount(refundInfo.refundAmount);
      setEmailContent(getRefundEmailTemplate(record, refundInfo.refundAmount));
      setIsDetailModalVisible(true);
    } else {
      // 자동결제 해지는 간단한 정보만 표시
      Modal.info({
        title: '자동결제 해지 정보',
        width: 600,
        content: (
          <div>
            <Descriptions bordered column={1} size="small" style={{ marginTop: 16 }}>
              <Descriptions.Item label="사용자">{record.userName}</Descriptions.Item>
              <Descriptions.Item label="이메일">{record.email}</Descriptions.Item>
              <Descriptions.Item label="구독 플랜">{record.subscriptionPlan}</Descriptions.Item>
              <Descriptions.Item label="해지 요청 일시">{record.requestDate}</Descriptions.Item>
              <Descriptions.Item label="서비스 이용 가능 기간">
                {record.endDate}까지
              </Descriptions.Item>
            </Descriptions>
            <Alert
              style={{ marginTop: 16 }}
              message="자동결제 해지 안내"
              description="자동결제만 중단되며, 결제된 이용 기간 종료 시점까지 서비스 이용이 가능합니다."
              type="info"
              showIcon
            />
            <Card title="커뮤니케이션 이력" size="small" style={{ marginTop: 16 }}>
              <Timeline>
                {(record.communicationLogs || []).map((log) => (
                  <Timeline.Item
                    key={log.id}
                    dot={log.type === 'email' ? <MailOutlined /> : <BellOutlined />}
                    color={log.status === '발송 완료' ? 'green' : 'gray'}
                  >
                    <div>
                      <Text strong>{log.title}</Text>
                      <br />
                      <Text type="secondary">
                        {log.sentAt} | {log.sentBy} | {log.status}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        ),
      });
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedItem(null);
    setCustomRefundAmount(null);
    setEmailContent('');
  };

  // 환불 정보 계산
  const refundInfo = useMemo(() => {
    if (!selectedItem) {
      return { refundAmount: 0, remainingDays: 0, totalDays: 0, usedDays: 0 };
    }
    return calculateRefundInfo(
      selectedItem.paymentDate,
      selectedItem.endDate,
      selectedItem.paymentAmount
    );
  }, [selectedItem]);

  // 이메일 발송 모달 열기
  const openEmailModal = () => {
    const amount = customRefundAmount ?? refundInfo.refundAmount;
    setEmailContent(getRefundEmailTemplate(selectedItem, amount));
    setIsEmailModalVisible(true);
  };

  // 미리보기 모달 열기
  const openPreviewModal = () => {
    setIsPreviewModalVisible(true);
  };

  // 이메일 발송 처리
  const handleSendEmail = () => {
    if (!selectedItem) return;

    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const newLog = {
      id: Date.now(),
      type: 'email',
      title: '환불 금액 안내',
      sentAt: now,
      sentBy: ADMIN_NAME,
      status: '발송 완료',
    };

    setData((prev) =>
      prev.map((row) =>
        row.id === selectedItem.id
          ? {
              ...row,
              status: STATUS.REFUND_SENT,
              communicationLogs: [...(row.communicationLogs || []), newLog],
            }
          : row
      )
    );

    message.success('환불 안내 이메일이 발송되었습니다.');
    setIsEmailModalVisible(false);
    handleCloseDetailModal();
  };

  // 환불 금액 변경 시 이메일 내용 업데이트
  const handleRefundAmountChange = (value) => {
    setCustomRefundAmount(value);
    if (selectedItem) {
      setEmailContent(getRefundEmailTemplate(selectedItem, value || refundInfo.refundAmount));
    }
  };

  // CSV 내보내기
  const exportCSV = () => {
    const header = [
      '사용자 ID',
      '이메일',
      '구독 플랜',
      '해지 유형',
      '해지 요청 일시',
      '환불 대상 여부',
      '상태',
    ];
    const rows = filtered.map((row) => [
      row.userName,
      row.email,
      row.subscriptionPlan,
      row.cancellationType,
      row.requestDate,
      row.isRefundTarget ? 'Y' : 'N',
      row.status,
    ]);
    const csv = [header, ...rows]
      .map((cols) => cols.map((col) => `"${String(col ?? '')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `해지_관리_목록_${moment().format('YYYYMMDD')}.csv`;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      title: '사용자 ID / 이메일',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <div>
          <div><UserOutlined style={{ marginRight: 4 }} />{record.userName}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: '구독 플랜',
      dataIndex: 'subscriptionPlan',
      key: 'subscriptionPlan',
      width: 130,
    },
    {
      title: '해지 유형',
      dataIndex: 'cancellationType',
      key: 'cancellationType',
      width: 120,
      render: (type) => (
        <Tag color={type === CANCELLATION_TYPES.MID_CANCEL ? 'volcano' : 'blue'}>
          {type}
        </Tag>
      ),
    },
    {
      title: '해지 요청 일시',
      dataIndex: 'requestDate',
      key: 'requestDate',
      width: 160,
      render: (date) => (
        <span>
          <CalendarOutlined style={{ marginRight: 4 }} />
          {date}
        </span>
      ),
    },
    {
      title: '환불 대상',
      dataIndex: 'isRefundTarget',
      key: 'isRefundTarget',
      width: 100,
      align: 'center',
      render: (isTarget) => (
        isTarget
          ? <Tag color="warning">대상</Tag>
          : <Tag>해당 없음</Tag>
      ),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Badge
          status={STATUS_COLOR[status] || 'default'}
          text={status}
        />
      ),
    },
    {
      title: '액션',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Button
          size="small"
          icon={<EyeOutlined />}
          onClick={() => showDetailModal(record)}
        >
          상세
        </Button>
      ),
    },
  ];

  // 통계 카드
  const stats = useMemo(() => {
    const total = data.length;
    const autoCancel = data.filter(d => d.cancellationType === CANCELLATION_TYPES.AUTO_CANCEL).length;
    const midCancel = data.filter(d => d.cancellationType === CANCELLATION_TYPES.MID_CANCEL).length;
    const pendingRefund = data.filter(
      d => d.cancellationType === CANCELLATION_TYPES.MID_CANCEL && d.status === STATUS.RECEIVED
    ).length;

    return { total, autoCancel, midCancel, pendingRefund };
  }, [data]);

  return (
    <div className="p-4">
      <Title level={2} style={{ marginBottom: 8 }}>구독 해지 관리</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        사용자의 구독 해지 요청을 조회하고 중도해지 건에 대한 환불 안내를 처리합니다.
      </Text>

      {/* 통계 카드 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card
            size="small"
            hoverable
            onClick={() => handleCardClick('total')}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">전체 해지 건수</Text>
              <Title level={3} style={{ margin: '8px 0 0' }}>{stats.total}</Title>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            hoverable
            onClick={() => handleCardClick('autoCancel')}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">자동결제 해지</Text>
              <Title level={3} style={{ margin: '8px 0 0', color: '#1890ff' }}>{stats.autoCancel}</Title>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            hoverable
            onClick={() => handleCardClick('midCancel')}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">중도해지</Text>
              <Title level={3} style={{ margin: '8px 0 0', color: '#fa541c' }}>{stats.midCancel}</Title>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            size="small"
            hoverable
            onClick={() => handleCardClick('pendingRefund')}
            style={{
              cursor: 'pointer',
              transition: 'all 0.3s',
              borderColor: stats.pendingRefund > 0 ? '#faad14' : undefined,
              borderWidth: stats.pendingRefund > 0 ? 2 : 1,
              backgroundColor: stats.pendingRefund > 0 ? '#fffbe6' : undefined,
              boxShadow: stats.pendingRefund > 0 ? '0 2px 8px rgba(250, 173, 20, 0.2)' : undefined,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontWeight: stats.pendingRefund > 0 ? 500 : 'normal' }}>
                환불 안내 대기
              </Text>
              <Title
                level={3}
                style={{
                  margin: '8px 0 0',
                  color: '#faad14',
                  fontWeight: 'bold',
                }}
              >
                {stats.pendingRefund}
              </Title>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 안내 메시지 */}
      <Alert
        message="해지 처리 정책"
        description={
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li><strong>자동결제 해지:</strong> 시스템이 자동 처리하며, 결제 기간 종료 시까지 서비스 이용 가능</li>
            <li><strong>중도해지:</strong> 즉시 서비스 이용 제한, 관리자가 환불 금액 안내 이메일 발송 필요</li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* 필터 영역 */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col>
            <Input.Search
              placeholder="사용자 ID 또는 이메일 검색"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
          </Col>
          <Col>
            <Select
              value={filters.cancellationType}
              onChange={(value) => handleFilterChange('cancellationType', value)}
              style={{ width: 150 }}
            >
              <Option value="all">전체 해지 유형</Option>
              <Option value={CANCELLATION_TYPES.AUTO_CANCEL}>자동결제 해지</Option>
              <Option value={CANCELLATION_TYPES.MID_CANCEL}>중도해지</Option>
            </Select>
          </Col>
          <Col>
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: 170 }}
            >
              <Option value="all">전체 상태</Option>
              <Option value={STATUS.RECEIVED}>접수 완료</Option>
              <Option value={STATUS.REFUND_SENT}>환불 안내 발송 완료</Option>
            </Select>
          </Col>
          <Col>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              format="YYYY-MM-DD"
              placeholder={['시작일', '종료일']}
            />
          </Col>
          <Col>
            <Space>
              <Button onClick={handleResetFilters}>초기화</Button>
              <Button onClick={exportCSV}>CSV 내보내기</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 목록 테이블 */}
      <Table
        columns={columns}
        dataSource={sorted}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}건`,
        }}
      />

      {/* 중도해지 상세 모달 */}
      {selectedItem && (
        <Modal
          title={
            <Space>
              <ExclamationCircleOutlined style={{ color: '#fa541c' }} />
              중도해지 상세 정보
            </Space>
          }
          open={isDetailModalVisible}
          onCancel={handleCloseDetailModal}
          footer={null}
          width={900}
        >
          <Tabs
            items={[
              {
                key: 'info',
                label: '해지 정보',
                children: (
                  <>
                    {/* 시스템 영역 (읽기 전용) */}
                    <Card
                      title={
                        <Space>
                          <ClockCircleOutlined />
                          시스템 정보 (읽기 전용)
                        </Space>
                      }
                      size="small"
                    >
                      <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="사용자 ID">{selectedItem.userName}</Descriptions.Item>
                        <Descriptions.Item label="이메일">{selectedItem.email}</Descriptions.Item>
                        <Descriptions.Item label="구독 플랜">{selectedItem.subscriptionPlan}</Descriptions.Item>
                        <Descriptions.Item label="결제 금액">
                          {selectedItem.paymentAmount.toLocaleString()}원
                        </Descriptions.Item>
                        <Descriptions.Item label="해지 요청 일시">
                          {selectedItem.requestDate}
                        </Descriptions.Item>
                        <Descriptions.Item label="서비스 제한 적용">
                          <Tag color="error">적용됨</Tag>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    {/* 환불 정보 */}
                    <Card
                      title={
                        <Space>
                          <DollarOutlined />
                          환불 정보
                        </Space>
                      }
                      size="small"
                      style={{ marginTop: 16 }}
                    >
                      <Descriptions bordered column={2} size="small">
                        <Descriptions.Item label="결제일">{selectedItem.paymentDate}</Descriptions.Item>
                        <Descriptions.Item label="이용 종료 예정일">{selectedItem.endDate}</Descriptions.Item>
                        <Descriptions.Item label="전체 이용 기간">{refundInfo.totalDays}일</Descriptions.Item>
                        <Descriptions.Item label="사용 기간">{refundInfo.usedDays}일</Descriptions.Item>
                        <Descriptions.Item label="잔여 기간">{refundInfo.remainingDays}일</Descriptions.Item>
                        <Descriptions.Item label="시스템 계산 환불 금액">
                          <Text strong style={{ color: '#52c41a' }}>
                            {refundInfo.refundAmount.toLocaleString()}원
                          </Text>
                          <Tooltip title="잔여 기간 비율로 자동 계산된 금액입니다.">
                            <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
                          </Tooltip>
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>

                    {/* 관리자 액션 영역 */}
                    <Card
                      title={
                        <Space>
                          <SendOutlined />
                          환불 금액 안내 이메일 발송
                        </Space>
                      }
                      size="small"
                      style={{ marginTop: 16 }}
                    >
                      {selectedItem.status === STATUS.REFUND_SENT ? (
                        <Alert
                          message="환불 안내 이메일이 이미 발송되었습니다."
                          type="success"
                          showIcon
                          icon={<CheckCircleOutlined />}
                        />
                      ) : (
                        <>
                          <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
                            <Col span={6}>
                              <Text>환불 금액 (관리자 편집 가능):</Text>
                            </Col>
                            <Col span={8}>
                              <InputNumber
                                min={0}
                                max={selectedItem.paymentAmount}
                                value={customRefundAmount}
                                onChange={handleRefundAmountChange}
                                formatter={(value) =>
                                  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                                }
                                parser={(value) => (value ? value.replace(/\D/g, '') : '')}
                                style={{ width: '100%' }}
                                addonAfter="원"
                              />
                            </Col>
                            <Col span={10}>
                              <Space>
                                <Button onClick={openPreviewModal} icon={<EyeOutlined />}>
                                  미리보기
                                </Button>
                                <Button type="primary" onClick={openEmailModal} icon={<MailOutlined />}>
                                  이메일 발송
                                </Button>
                              </Space>
                            </Col>
                          </Row>
                          <Alert
                            message="발송 전 확인"
                            description="환불 금액을 확인한 후 이메일을 발송해주세요. 발송된 이메일은 커뮤니케이션 이력에 기록됩니다."
                            type="warning"
                            showIcon
                          />
                        </>
                      )}
                    </Card>
                  </>
                ),
              },
              {
                key: 'logs',
                label: '커뮤니케이션 이력',
                children: (
                  <Card size="small">
                    <Timeline>
                      {(selectedItem.communicationLogs || []).map((log) => (
                        <Timeline.Item
                          key={log.id}
                          dot={log.type === 'email' ? <MailOutlined /> : <BellOutlined />}
                          color={log.status === '발송 완료' ? 'green' : 'gray'}
                        >
                          <div style={{ marginBottom: 8 }}>
                            <Text strong>{log.title}</Text>
                            <Tag
                              color={log.type === 'email' ? 'blue' : 'purple'}
                              style={{ marginLeft: 8 }}
                            >
                              {log.type === 'email' ? '이메일' : '알림'}
                            </Tag>
                          </div>
                          <div>
                            <Text type="secondary">
                              발송 일시: {log.sentAt}
                            </Text>
                          </div>
                          <div>
                            <Text type="secondary">
                              발송자: {log.sentBy}
                            </Text>
                          </div>
                          <div>
                            <Badge
                              status={log.status === '발송 완료' ? 'success' : 'default'}
                              text={log.status}
                            />
                          </div>
                        </Timeline.Item>
                      ))}
                    </Timeline>
                  </Card>
                ),
              },
            ]}
          />
        </Modal>
      )}

      {/* 이메일 발송 확인 모달 */}
      {selectedItem && (
        <Modal
          title="환불 안내 이메일 발송"
          open={isEmailModalVisible}
          onCancel={() => setIsEmailModalVisible(false)}
          onOk={handleSendEmail}
          okText="발송하기"
          cancelText="취소"
          width={700}
        >
          <Alert
            message="이메일 발송 확인"
            description={`${selectedItem.email}로 환불 안내 이메일을 발송합니다.`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          <Card title="이메일 내용" size="small">
            <TextArea
              rows={12}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          </Card>
        </Modal>
      )}

      {/* 미리보기 모달 */}
      {selectedItem && (
        <Modal
          title="이메일 미리보기"
          open={isPreviewModalVisible}
          onCancel={() => setIsPreviewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsPreviewModalVisible(false)}>
              닫기
            </Button>,
          ]}
          width={600}
        >
          <Card>
            <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
              {emailContent || getRefundEmailTemplate(selectedItem, customRefundAmount ?? refundInfo.refundAmount)}
            </div>
          </Card>
        </Modal>
      )}
    </div>
  );
};

export default SubscriptionCancellationManagement;
