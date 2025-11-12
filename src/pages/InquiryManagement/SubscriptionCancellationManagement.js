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
} from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const STATUS_LABELS = {
  SUBMITTED: '신청',
  APPROVED: '승인',
  REJECTED: '거절',
  COMPLETED: '처리완료',
  ON_HOLD: '보류',
};

const STATUS_COLOR = {
  신청: 'geekblue',
  승인: 'orange',
  거절: 'volcano',
  처리완료: 'green',
  보류: 'purple',
};

const REQUEST_TYPES = {
  AUTO_CANCEL: '자동결제 해지',
  MID_CANCEL: '중도 해지',
};

const MANAGER_NAME = '운영자A';

function calculateRefundAmount(paymentDate, paymentAmount) {
  if (!paymentDate || !paymentAmount) return 0;
  const paidDate = moment(paymentDate, 'YYYY-MM-DD');
  const diffDays = moment().diff(paidDate, 'days');
  if (diffDays <= 7) {
    return paymentAmount;
  }
  return Math.floor(paymentAmount * 0.9);
}

const initialData = [
  {
    id: 1,
    userName: '홍길동',
    email: 'hong@example.com',
    productName: '밀리 프리미엄 구독',
    requestType: REQUEST_TYPES.MID_CANCEL,
    requestDate: '2025-04-20',
    paymentDate: '2025-04-15',
    paymentAmount: 15000,
    status: STATUS_LABELS.SUBMITTED,
    manager: '-',
    logs: [{ when: '2025-04-20 14:00:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 2,
    userName: '김철수',
    email: 'kim@example.com',
    productName: '밀리 베이직 구독',
    requestType: REQUEST_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-19',
    paymentDate: '2025-04-01',
    paymentAmount: 9900,
    status: STATUS_LABELS.COMPLETED,
    manager: '운영자B',
    logs: [
      { when: '2025-04-19 11:00:00', what: '신청 접수', who: '-' },
      { when: '2025-04-19 15:30:00', what: '처리완료', who: '운영자B' },
    ],
  },
  {
    id: 3,
    userName: '이영희',
    email: 'lee@example.com',
    productName: '밀리 프리미엄 구독',
    requestType: REQUEST_TYPES.MID_CANCEL,
    requestDate: '2025-04-18',
    paymentDate: '2025-04-12',
    paymentAmount: 15000,
    status: STATUS_LABELS.SUBMITTED,
    manager: '-',
    logs: [{ when: '2025-04-18 09:10:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 4,
    userName: '박민수',
    email: 'park@example.com',
    productName: '밀리 베이직 구독',
    requestType: REQUEST_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-18',
    paymentDate: '2025-04-01',
    paymentAmount: 9900,
    status: STATUS_LABELS.APPROVED,
    manager: '운영자B',
    logs: [
      { when: '2025-04-18 10:00:00', what: '신청 접수', who: '-' },
      { when: '2025-04-18 12:00:00', what: '승인', who: '운영자B' },
    ],
  },
  {
    id: 5,
    userName: '최서연',
    email: 'choi@example.com',
    productName: '밀리 스탠다드 구독',
    requestType: REQUEST_TYPES.MID_CANCEL,
    requestDate: '2025-04-17',
    paymentDate: '2025-04-10',
    paymentAmount: 12900,
    status: STATUS_LABELS.REJECTED,
    manager: '운영자C',
    logs: [
      { when: '2025-04-17 08:20:00', what: '신청 접수', who: '-' },
      { when: '2025-04-17 13:45:00', what: '거절', who: '운영자C' },
    ],
  },
  {
    id: 6,
    userName: '김나래',
    email: 'narae@example.com',
    productName: '밀리 프리미엄 구독',
    requestType: REQUEST_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-17',
    paymentDate: '2025-04-02',
    paymentAmount: 15000,
    status: STATUS_LABELS.COMPLETED,
    manager: '운영자A',
    logs: [
      { when: '2025-04-17 09:05:00', what: '신청 접수', who: '-' },
      { when: '2025-04-17 11:30:00', what: '처리완료', who: '운영자A' },
    ],
  },
  {
    id: 7,
    userName: '오세준',
    email: 'oh@example.com',
    productName: '밀리 베이직 구독',
    requestType: REQUEST_TYPES.MID_CANCEL,
    requestDate: '2025-04-16',
    paymentDate: '2025-04-13',
    paymentAmount: 9900,
    status: STATUS_LABELS.SUBMITTED,
    manager: '-',
    logs: [{ when: '2025-04-16 10:22:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 8,
    userName: '정수빈',
    email: 'jung@example.com',
    productName: '밀리 스탠다드 구독',
    requestType: REQUEST_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-16',
    paymentDate: '2025-04-01',
    paymentAmount: 12900,
    status: STATUS_LABELS.APPROVED,
    manager: '운영자D',
    logs: [
      { when: '2025-04-16 09:00:00', what: '신청 접수', who: '-' },
      { when: '2025-04-16 14:10:00', what: '승인', who: '운영자D' },
    ],
  },
  {
    id: 9,
    userName: '한예린',
    email: 'han@example.com',
    productName: '밀리 프리미엄 구독',
    requestType: REQUEST_TYPES.MID_CANCEL,
    requestDate: '2025-04-15',
    paymentDate: '2025-04-08',
    paymentAmount: 15000,
    status: STATUS_LABELS.COMPLETED,
    manager: '운영자B',
    logs: [
      { when: '2025-04-15 08:50:00', what: '신청 접수', who: '-' },
      { when: '2025-04-15 16:00:00', what: '처리완료', who: '운영자B' },
    ],
  },
  {
    id: 10,
    userName: '서유리',
    email: 'seo@example.com',
    productName: '밀리 베이직 구독',
    requestType: REQUEST_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-15',
    paymentDate: '2025-04-03',
    paymentAmount: 9900,
    status: STATUS_LABELS.SUBMITTED,
    manager: '-',
    logs: [{ when: '2025-04-15 13:15:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 11,
    userName: '유지호',
    email: 'yoo@example.com',
    productName: '밀리 프리미엄 구독',
    requestType: REQUEST_TYPES.MID_CANCEL,
    requestDate: '2025-04-12',
    paymentDate: '2025-04-09',
    paymentAmount: 15000,
    status: STATUS_LABELS.APPROVED,
    manager: '운영자B',
    logs: [
      { when: '2025-04-12 09:25:00', what: '신청 접수', who: '-' },
      { when: '2025-04-12 10:40:00', what: '승인', who: '운영자B' },
    ],
  },
  {
    id: 12,
    userName: '노하늘',
    email: 'noh@example.com',
    productName: '밀리 베이직 구독',
    requestType: REQUEST_TYPES.AUTO_CANCEL,
    requestDate: '2025-04-12',
    paymentDate: '2025-04-01',
    paymentAmount: 9900,
    status: STATUS_LABELS.REJECTED,
    manager: '운영자C',
    logs: [
      { when: '2025-04-12 08:50:00', what: '신청 접수', who: '-' },
      { when: '2025-04-12 16:10:00', what: '거절', who: '운영자C' },
    ],
  },
];

const FILTER_DEFAULT = {
  userName: '',
  email: '',
  productName: '',
  status: 'all',
  dateRange: null,
};

const SubscriptionCancellationManagement = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(FILTER_DEFAULT);
  const [priorityStatus, setPriorityStatus] = useState(null);
  const [data, setData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [overrideRefund, setOverrideRefund] = useState(null);
  const [adminMemo, setAdminMemo] = useState('');

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(FILTER_DEFAULT);
  };

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (
        filters.status !== 'all' &&
        ((filters.status === 'auto_cancel' && row.requestType !== REQUEST_TYPES.AUTO_CANCEL) ||
          (filters.status === 'mid_cancel' && row.requestType !== REQUEST_TYPES.MID_CANCEL) ||
          (filters.status === 'refund_request' && row.status !== STATUS_LABELS.SUBMITTED) ||
          (filters.status === 'refund_complete' && row.status !== STATUS_LABELS.COMPLETED))
      ) {
        return false;
      }

      if (
        filters.userName &&
        !String(row.userName).toLowerCase().includes(filters.userName.toLowerCase())
      ) {
        return false;
      }

      if (filters.email && !row.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }

      if (
        filters.productName &&
        !row.productName.toLowerCase().includes(filters.productName.toLowerCase())
      ) {
        return false;
      }

      if (filters.dateRange && filters.dateRange.length === 2) {
        const date = moment(row.requestDate, 'YYYY-MM-DD');
        const [start, end] = filters.dateRange;
        if (!date.isBetween(start, end, 'day', '[]')) {
          return false;
        }
      }

      return true;
    });
  }, [data, filters]);

  const sorted = useMemo(() => {
    const base = [...filtered].sort(
      (a, b) =>
        moment(b.requestDate, 'YYYY-MM-DD').valueOf() -
        moment(a.requestDate, 'YYYY-MM-DD').valueOf()
    );
    if (!priorityStatus) {
      return base;
    }
    const priorityLabel = STATUS_LABELS[priorityStatus];
    if (!priorityLabel) {
      return base;
    }
    const priorityRows = base.filter((row) => row.status === priorityLabel);
    const others = base.filter((row) => row.status !== priorityLabel);
    return [...priorityRows, ...others];
  }, [filtered, priorityStatus]);

  const showModal = (record) => {
    setSelectedItem(record);
    setOverrideRefund(null);
    setAdminMemo('');
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null);
  };

  const computedRefund = useMemo(() => {
    if (!selectedItem) {
      return 0;
    }
    return calculateRefundAmount(selectedItem.paymentDate, selectedItem.paymentAmount);
  }, [selectedItem]);

  const applyAction = (nextStatus) => {
    if (!selectedItem) return;
    const now = moment().format('YYYY-MM-DD HH:mm:ss');
    const refundAmount =
      overrideRefund !== null && overrideRefund !== undefined
        ? Number(overrideRefund)
        : computedRefund;

    setData((prev) =>
      prev.map((row) =>
        row.id === selectedItem.id
          ? {
              ...row,
              status: nextStatus,
              manager: MANAGER_NAME,
              refundAmount,
              logs: [
                ...(row.logs || []),
                {
                  when: now,
                  what: `${nextStatus}${adminMemo ? ` (메모: ${adminMemo})` : ''}`,
                  who: MANAGER_NAME,
                },
              ],
            }
          : row
      )
    );
    message.success(`${nextStatus} 처리되었습니다.`);
    handleCloseModal();
  };

  const exportCSV = () => {
    const header = [
      '이용자명',
      '이메일',
      '구독상품',
      '신청유형',
      '신청일',
      '결제일',
      '결제금액',
      '환불금액',
      '상태',
      '담당자',
    ];
    const rows = filtered.map((row) => [
      row.userName,
      row.email,
      row.productName,
      row.requestType,
      row.requestDate,
      row.paymentDate,
      row.paymentAmount,
      row.refundAmount ?? calculateRefundAmount(row.paymentDate, row.paymentAmount),
      row.status,
      row.manager,
    ]);
    const csv = [header, ...rows]
      .map((cols) => cols.map((col) => `"${String(col ?? '')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `환불_요청_목록_${moment().format('YYYYMMDD')}.csv`;
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { title: '이용자명', dataIndex: 'userName', key: 'userName' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    { title: '구독상품', dataIndex: 'productName', key: 'productName' },
    {
      title: '신청유형',
      dataIndex: 'requestType',
      key: 'requestType',
      render: (type) => (
        <Tag color={type === REQUEST_TYPES.MID_CANCEL ? 'volcano' : 'blue'}>{type}</Tag>
      ),
    },
    { title: '신청일', dataIndex: 'requestDate', key: 'requestDate' },
    { title: '결제일', dataIndex: 'paymentDate', key: 'paymentDate' },
    {
      title: '환불금액',
      key: 'refundAmount',
      render: (_, record) => {
        const amount =
          record.refundAmount ??
          calculateRefundAmount(record.paymentDate, record.paymentAmount);
        const numericAmount = Number(amount);
        const safeAmount = Number.isFinite(numericAmount) ? numericAmount : 0;
        return `${safeAmount.toLocaleString()}원`;
      },
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={STATUS_COLOR[status] || 'default'}>{status}</Tag>,
    },
    { title: '담당자', dataIndex: 'manager', key: 'manager' },
    {
      title: '액션',
      key: 'action',
      render: (_, record) => (
        <Button size="small" onClick={() => showModal(record)}>
          상세보기
        </Button>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">구독 해지 관리</h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Tooltip
          placement="right"
          title={
            <div>
              <div>
                <Tag color={STATUS_COLOR[STATUS_LABELS.SUBMITTED]}>신청</Tag> 신규 환불 요청
              </div>
              <div>
                <Tag color={STATUS_COLOR[STATUS_LABELS.APPROVED]}>승인</Tag> 관리자 승인 완료
              </div>
              <div>
                <Tag color={STATUS_COLOR[STATUS_LABELS.REJECTED]}>거절</Tag> 환불 불가 사유 안내
              </div>
              <div>
                <Tag color={STATUS_COLOR[STATUS_LABELS.COMPLETED]}>처리완료</Tag> 환불 지급 완료
              </div>
              <div>
                <Tag color={STATUS_COLOR[STATUS_LABELS.ON_HOLD]}>보류</Tag> 추가 확인 필요
              </div>
            </div>
          }
        >
          <InfoCircleOutlined style={{ color: '#1677ff', fontSize: 16 }} />
        </Tooltip>
        <Space size={8} wrap>
          <Button size="small" onClick={() => setPriorityStatus(null)}>
            전체
          </Button>
          <Button
            size="small"
            type={priorityStatus === 'SUBMITTED' ? 'primary' : 'default'}
            onClick={() =>
              setPriorityStatus(priorityStatus === 'SUBMITTED' ? null : 'SUBMITTED')
            }
          >
            신청
          </Button>
          <Button
            size="small"
            type={priorityStatus === 'APPROVED' ? 'primary' : 'default'}
            onClick={() =>
              setPriorityStatus(priorityStatus === 'APPROVED' ? null : 'APPROVED')
            }
          >
            승인
          </Button>
          <Button
            size="small"
            type={priorityStatus === 'REJECTED' ? 'primary' : 'default'}
            onClick={() =>
              setPriorityStatus(priorityStatus === 'REJECTED' ? null : 'REJECTED')
            }
          >
            거절
          </Button>
          <Button
            size="small"
            type={priorityStatus === 'COMPLETED' ? 'primary' : 'default'}
            onClick={() =>
              setPriorityStatus(priorityStatus === 'COMPLETED' ? null : 'COMPLETED')
            }
          >
            처리완료
          </Button>
          <Button
            size="small"
            type={priorityStatus === 'ON_HOLD' ? 'primary' : 'default'}
            onClick={() =>
              setPriorityStatus(priorityStatus === 'ON_HOLD' ? null : 'ON_HOLD')
            }
          >
            보류
          </Button>
        </Space>
      </div>

      <div className="bg-white p-4 rounded shadow-md mb-4">
        <Row gutter={[12, 12]} align="middle">
          <Col>
            <Input
              placeholder="이용자명"
              value={filters.userName}
              onChange={(e) => handleFilterChange('userName', e.target.value)}
              style={{ width: 180 }}
            />
          </Col>
          <Col>
            <Input
              placeholder="이메일"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              style={{ width: 220 }}
            />
          </Col>
          <Col>
            <Input
              placeholder="구독상품"
              value={filters.productName}
              onChange={(e) => handleFilterChange('productName', e.target.value)}
              style={{ width: 200 }}
            />
          </Col>
          <Col>
            <Select
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: 170 }}
            >
              <Option value="all">전체</Option>
              <Option value="auto_cancel">자동결제 해지</Option>
              <Option value="mid_cancel">중도 해지</Option>
              <Option value="refund_request">환불 신청</Option>
              <Option value="refund_complete">환불 완료</Option>
            </Select>
          </Col>
          <Col>
            <RangePicker
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              format="YYYY-MM-DD"
            />
          </Col>
          <Col>
            <Space>
              <Button type="primary" onClick={() => message.success('필터가 적용되었습니다.')}>
                검색
              </Button>
              <Button onClick={handleResetFilters}>초기화</Button>
              <Button onClick={exportCSV}>CSV 내보내기</Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Table columns={columns} dataSource={sorted} rowKey="id" />

      {selectedItem && (
        <Modal
          title="구독 해지 상세"
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={860}
        >
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="이름">{selectedItem.userName}</Descriptions.Item>
            <Descriptions.Item label="이메일">{selectedItem.email}</Descriptions.Item>
            <Descriptions.Item label="가입일">-</Descriptions.Item>
            <Descriptions.Item label="결제내역">
              <Button
                type="link"
                onClick={() => {
                  const q = encodeURIComponent(selectedItem.userName || '');
                  navigate(`/users/subscriptions?q=${q}`);
                }}
              >
                바로가기
              </Button>
            </Descriptions.Item>
          </Descriptions>

          <Card title="구독 정보" size="small" style={{ marginTop: 16 }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="상품">{selectedItem.productName}</Descriptions.Item>
              <Descriptions.Item label="결제일">{selectedItem.paymentDate}</Descriptions.Item>
              <Descriptions.Item label="결제금액">
                {selectedItem.paymentAmount.toLocaleString()}원
              </Descriptions.Item>
              <Descriptions.Item label="만료일">-</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="신청 정보" size="small" style={{ marginTop: 16 }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="신청유형">
                {selectedItem.requestType}
              </Descriptions.Item>
              <Descriptions.Item label="신청일">{selectedItem.requestDate}</Descriptions.Item>
              <Descriptions.Item label="환불 사유" span={2}>
                고객 요청
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="환불 계산" size="small" style={{ marginTop: 16 }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="자동 계산 금액">
                {computedRefund.toLocaleString()}원 (정책: 결제 7일 이내 100%, 이후 90%)
              </Descriptions.Item>
              <Descriptions.Item label="수동 조정 금액">
                <InputNumber
                  min={0}
                  value={overrideRefund}
                  onChange={setOverrideRefund}
                  formatter={(value) =>
                    value === undefined || value === null
                      ? ''
                      : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => (value ? value.replace(/\D/g, '') : '')}
                  style={{ width: '100%' }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="관리자 처리" size="small" style={{ marginTop: 16 }}>
            <Space style={{ marginBottom: 12 }}>
              <Button type="primary" onClick={() => applyAction(STATUS_LABELS.APPROVED)}>
                승인
              </Button>
              <Button danger onClick={() => applyAction(STATUS_LABELS.REJECTED)}>
                거절
              </Button>
              <Button onClick={() => applyAction(STATUS_LABELS.COMPLETED)}>처리완료</Button>
              <Button onClick={() => applyAction(STATUS_LABELS.ON_HOLD)}>보류</Button>
            </Space>
            <TextArea
              rows={3}
              value={adminMemo}
              onChange={(e) => setAdminMemo(e.target.value)}
              placeholder="메모를 입력하세요"
            />
          </Card>

          <Card title="처리 로그" size="small" style={{ marginTop: 16 }}>
            <Timeline>
              {(selectedItem.logs || []).map((log, index) => (
                <Timeline.Item key={index}>
                  {log.what} ({log.who}, {log.when})
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Modal>
      )}
    </div>
  );
};

export default SubscriptionCancellationManagement;
