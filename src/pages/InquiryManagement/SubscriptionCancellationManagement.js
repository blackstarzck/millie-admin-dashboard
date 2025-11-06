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
  message,
} from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const STATUS_COLOR = {
  신청: 'geekblue',
  승인: 'orange',
  거절: 'volcano',
  처리완료: 'green',
};

function calculateRefundAmount(paymentDate, paymentAmount) {
  if (!paymentDate || !paymentAmount) return 0;
  const paid = moment(paymentDate, 'YYYY-MM-DD');
  const days = moment().diff(paid, 'days');
  if (days <= 7) return paymentAmount; // 7일 이내 100%
  return Math.floor(paymentAmount * 0.9); // 초과 시 90%
}

const initialData = [
  {
    id: 1,
    userName: '홍길동',
    email: 'hong@example.com',
    productName: '프리미엄 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-20',
    paymentDate: '2025-04-15',
    paymentAmount: 15000,
    status: '신청',
    manager: '-',
    logs: [
      { when: '2025-04-20 14:00:00', what: '신청 접수', who: '-' },
    ],
  },
  {
    id: 2,
    userName: '김철수',
    email: 'kim@example.com',
    productName: '베이직 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-19',
    paymentDate: '2025-04-01',
    paymentAmount: 9900,
    status: '처리완료',
    manager: '운영자A',
    logs: [
      { when: '2025-04-19 11:00:00', what: '신청 접수', who: '-' },
      { when: '2025-04-19 15:30:00', what: '처리완료', who: '운영자A' },
    ],
  },
  {
    id: 3,
    userName: '이영희',
    email: 'lee@example.com',
    productName: '프리미엄 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-18',
    paymentDate: '2025-04-12',
    paymentAmount: 15000,
    status: '신청',
    manager: '-',
    logs: [{ when: '2025-04-18 09:10:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 4,
    userName: '박민수',
    email: 'park@example.com',
    productName: '베이직 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-18',
    paymentDate: '2025-04-01',
    paymentAmount: 9900,
    status: '승인',
    manager: '운영자B',
    logs: [
      { when: '2025-04-18 10:00:00', what: '신청 접수', who: '-' },
      { when: '2025-04-18 12:00:00', what: '승인', who: '운영자B' },
    ],
  },
  {
    id: 5,
    userName: '최지훈',
    email: 'choi@example.com',
    productName: '스탠다드 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-17',
    paymentDate: '2025-04-10',
    paymentAmount: 12900,
    status: '거절',
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
    productName: '프리미엄 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-17',
    paymentDate: '2025-04-02',
    paymentAmount: 15000,
    status: '처리완료',
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
    productName: '베이직 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-16',
    paymentDate: '2025-04-13',
    paymentAmount: 9900,
    status: '신청',
    manager: '-',
    logs: [{ when: '2025-04-16 10:22:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 8,
    userName: '정수빈',
    email: 'jung@example.com',
    productName: '스탠다드 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-16',
    paymentDate: '2025-04-01',
    paymentAmount: 12900,
    status: '승인',
    manager: '운영자D',
    logs: [
      { when: '2025-04-16 09:00:00', what: '신청 접수', who: '-' },
      { when: '2025-04-16 14:10:00', what: '승인', who: '운영자D' },
    ],
  },
  {
    id: 9,
    userName: '한예진',
    email: 'han@example.com',
    productName: '프리미엄 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-15',
    paymentDate: '2025-04-08',
    paymentAmount: 15000,
    status: '처리완료',
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
    productName: '베이직 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-15',
    paymentDate: '2025-04-03',
    paymentAmount: 9900,
    status: '신청',
    manager: '-',
    logs: [{ when: '2025-04-15 13:15:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 11,
    userName: '이준호',
    email: 'leejh@example.com',
    productName: '스탠다드 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-14',
    paymentDate: '2025-04-10',
    paymentAmount: 12900,
    status: '승인',
    manager: '운영자C',
    logs: [
      { when: '2025-04-14 10:05:00', what: '신청 접수', who: '-' },
      { when: '2025-04-14 12:20:00', what: '승인', who: '운영자C' },
    ],
  },
  {
    id: 12,
    userName: '문지호',
    email: 'moon@example.com',
    productName: '프리미엄 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-14',
    paymentDate: '2025-04-01',
    paymentAmount: 15000,
    status: '거절',
    manager: '운영자D',
    logs: [
      { when: '2025-04-14 09:40:00', what: '신청 접수', who: '-' },
      { when: '2025-04-14 17:25:00', what: '거절', who: '운영자D' },
    ],
  },
  {
    id: 13,
    userName: '강다은',
    email: 'kang@example.com',
    productName: '베이직 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-13',
    paymentDate: '2025-04-07',
    paymentAmount: 9900,
    status: '처리완료',
    manager: '운영자A',
    logs: [
      { when: '2025-04-13 08:05:00', what: '신청 접수', who: '-' },
      { when: '2025-04-13 11:55:00', what: '처리완료', who: '운영자A' },
    ],
  },
  {
    id: 14,
    userName: '장현우',
    email: 'jang@example.com',
    productName: '스탠다드 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-13',
    paymentDate: '2025-04-02',
    paymentAmount: 12900,
    status: '신청',
    manager: '-',
    logs: [{ when: '2025-04-13 15:10:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 15,
    userName: '유지안',
    email: 'yoo@example.com',
    productName: '프리미엄 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-12',
    paymentDate: '2025-04-09',
    paymentAmount: 15000,
    status: '승인',
    manager: '운영자B',
    logs: [
      { when: '2025-04-12 09:25:00', what: '신청 접수', who: '-' },
      { when: '2025-04-12 10:40:00', what: '승인', who: '운영자B' },
    ],
  },
  {
    id: 16,
    userName: '노지후',
    email: 'noh@example.com',
    productName: '베이직 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-12',
    paymentDate: '2025-04-01',
    paymentAmount: 9900,
    status: '거절',
    manager: '운영자C',
    logs: [
      { when: '2025-04-12 08:50:00', what: '신청 접수', who: '-' },
      { when: '2025-04-12 16:10:00', what: '거절', who: '운영자C' },
    ],
  },
  {
    id: 17,
    userName: '배하린',
    email: 'bae@example.com',
    productName: '스탠다드 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-11',
    paymentDate: '2025-04-06',
    paymentAmount: 12900,
    status: '처리완료',
    manager: '운영자D',
    logs: [
      { when: '2025-04-11 10:00:00', what: '신청 접수', who: '-' },
      { when: '2025-04-11 12:30:00', what: '처리완료', who: '운영자D' },
    ],
  },
  {
    id: 18,
    userName: '임도윤',
    email: 'lim@example.com',
    productName: '프리미엄 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-11',
    paymentDate: '2025-04-04',
    paymentAmount: 15000,
    status: '신청',
    manager: '-',
    logs: [{ when: '2025-04-11 09:33:00', what: '신청 접수', who: '-' }],
  },
  {
    id: 19,
    userName: '신서윤',
    email: 'shin@example.com',
    productName: '베이직 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-10',
    paymentDate: '2025-04-05',
    paymentAmount: 9900,
    status: '승인',
    manager: '운영자A',
    logs: [
      { when: '2025-04-10 08:05:00', what: '신청 접수', who: '-' },
      { when: '2025-04-10 09:15:00', what: '승인', who: '운영자A' },
    ],
  },
  {
    id: 20,
    userName: '조아인',
    email: 'jo@example.com',
    productName: '스탠다드 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-10',
    paymentDate: '2025-04-03',
    paymentAmount: 12900,
    status: '거절',
    manager: '운영자B',
    logs: [
      { when: '2025-04-10 10:25:00', what: '신청 접수', who: '-' },
      { when: '2025-04-10 12:45:00', what: '거절', who: '운영자B' },
    ],
  },
  {
    id: 21,
    userName: '권태현',
    email: 'kwon@example.com',
    productName: '프리미엄 구독',
    requestType: '중도 해지',
    requestDate: '2025-04-09',
    paymentDate: '2025-04-06',
    paymentAmount: 15000,
    status: '처리완료',
    manager: '운영자C',
    logs: [
      { when: '2025-04-09 11:30:00', what: '신청 접수', who: '-' },
      { when: '2025-04-09 17:00:00', what: '처리완료', who: '운영자C' },
    ],
  },
  {
    id: 22,
    userName: '하도영',
    email: 'ha@example.com',
    productName: '베이직 구독',
    requestType: '자동결제 해지',
    requestDate: '2025-04-09',
    paymentDate: '2025-04-01',
    paymentAmount: 9900,
    status: '신청',
    manager: '-',
    logs: [{ when: '2025-04-09 09:00:00', what: '신청 접수', who: '-' }],
  },
];

const SubscriptionCancellationManagement = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    userName: '',
    email: '',
    productName: '',
    status: 'all',
    dateRange: null,
  });
  const [data, setData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [overrideRefund, setOverrideRefund] = useState(null);
  const [adminMemo, setAdminMemo] = useState('');

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = useMemo(() => {
    return data.filter((row) => {
      if (
        filters.status !== 'all' &&
        (filters.status === 'auto_cancel'
          ? row.requestType !== '자동결제 해지'
          : filters.status === 'mid_cancel'
          ? row.requestType !== '중도 해지'
          : filters.status === 'refund_request'
          ? row.status !== '신청'
          : filters.status === 'refund_complete'
          ? row.status !== '처리완료'
          : false)
      )
        return false;

      if (
        filters.userName &&
        !row.userName.toLowerCase().includes(filters.userName.toLowerCase())
      )
        return false;
      if (
        filters.email &&
        !row.email.toLowerCase().includes(filters.email.toLowerCase())
      )
        return false;
      if (
        filters.productName &&
        !row.productName
          .toLowerCase()
          .includes(filters.productName.toLowerCase())
      )
        return false;
      if (filters.dateRange && filters.dateRange.length === 2) {
        const d = moment(row.requestDate, 'YYYY-MM-DD');
        const [start, end] = filters.dateRange;
        if (!d.isBetween(start, end, 'day', '[]')) return false;
      }
      return true;
    });
  }, [data, filters]);

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
    if (!selectedItem) return 0;
    return calculateRefundAmount(
      selectedItem.paymentDate,
      selectedItem.paymentAmount
    );
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
              manager: '운영자',
              refundAmount,
              logs: [
                ...(row.logs || []),
                { when: now, what: `${nextStatus}${adminMemo ? ` (메모: ${adminMemo})` : ''}` , who: '운영자' },
              ],
            }
          : row
      )
    );
    message.success(`${nextStatus} 처리했습니다.`);
    handleCloseModal();
  };

  const exportCSV = () => {
    const header = [
      '사용자명',
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
    const rows = filtered.map((r) => [
      r.userName,
      r.email,
      r.productName,
      r.requestType,
      r.requestDate,
      r.paymentDate,
      r.paymentAmount,
      r.refundAmount ?? calculateRefundAmount(r.paymentDate, r.paymentAmount),
      r.status,
      r.manager,
    ]);
    const csv = [header, ...rows]
      .map((cols) => cols.map((c) => `"${String(c ?? '')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `환불_신청_목록_${moment().format('YYYYMMDD')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { title: '사용자명', dataIndex: 'userName', key: 'userName' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    { title: '구독상품', dataIndex: 'productName', key: 'productName' },
    {
      title: '신청유형',
      dataIndex: 'requestType',
      key: 'requestType',
      render: (type) => (
        <Tag color={type === '중도 해지' ? 'volcano' : 'blue'}>{type}</Tag>
      ),
    },
    { title: '신청일', dataIndex: 'requestDate', key: 'requestDate' },
    { title: '결제일', dataIndex: 'paymentDate', key: 'paymentDate' },
    {
      title: '환불금액',
      key: 'refundAmount',
      render: (_, record) => {
        const amt =
          record.refundAmount ??
          calculateRefundAmount(record.paymentDate, record.paymentAmount);
        return `${amt?.toLocaleString?.() ?? amt}원`;
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

      {/* 처리 상태 안내 */}
      <Card size="small" title="처리 상태 안내" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size={6}>
          <div>
            <Tag color={STATUS_COLOR['신청']}>신청</Tag>
            사용자가 자동결제 해지/중도 해지를 요청한 초기 상태 (검토 대기)
          </div>
          <div>
            <Tag color={STATUS_COLOR['승인']}>승인</Tag>
            관리자가 요청을 승인한 상태로, 환불 및 후속 조치 진행 단계
          </div>
          <div>
            <Tag color={STATUS_COLOR['거절']}>거절</Tag>
            정책 미충족 등으로 반려된 상태 (추가 조치 없음)
          </div>
          <div>
            <Tag color={STATUS_COLOR['처리완료']}>처리완료</Tag>
            환불(필요 시)과 내부 반영이 모두 끝난 최종 상태
          </div>
          <div>
            <Tag>보류(옵션)</Tag>
            PG 오류·추가 확인 필요 시 임시 대기 상태, 이후 승인/거절/처리완료로 전환
          </div>
        </Space>
      </Card>

      <div className="bg-white p-4 rounded shadow-md mb-4">
        <Row gutter={[12, 12]} align="middle">
          <Col>
            <Input
              placeholder="사용자명"
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
              onChange={(v) => handleFilterChange('status', v)}
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
            />
          </Col>
          <Col>
            <Space>
              <Button type="primary">검색</Button>
              <Button onClick={exportCSV}>CSV 내보내기</Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Table columns={columns} dataSource={filtered} rowKey="id" />

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
            <Descriptions.Item label="결제이력">
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
              <Descriptions.Item label="결제금액">{selectedItem.paymentAmount.toLocaleString()}원</Descriptions.Item>
              <Descriptions.Item label="만료일">-</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="신청 정보" size="small" style={{ marginTop: 16 }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="신청유형">{selectedItem.requestType}</Descriptions.Item>
              <Descriptions.Item label="신청일">{selectedItem.requestDate}</Descriptions.Item>
              <Descriptions.Item label="환불 사유" span={2}>고객 사정</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="환불 계산" size="small" style={{ marginTop: 16 }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="자동 계산 금액">
                {computedRefund.toLocaleString()}원 (규정: 7일 이내 100% / 이후 90%)
              </Descriptions.Item>
              <Descriptions.Item label="수동 금액(override)">
                <InputNumber
                  min={0}
                  value={overrideRefund}
                  onChange={setOverrideRefund}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/\$\s?|,/g, '')}
                  style={{ width: '100%' }}
                />
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="관리자 처리" size="small" style={{ marginTop: 16 }}>
            <Space style={{ marginBottom: 12 }}>
              <Button type="primary" onClick={() => applyAction('승인')}>승인</Button>
              <Button danger onClick={() => applyAction('거절')}>거절</Button>
              <Button onClick={() => applyAction('처리완료')}>처리완료</Button>
            </Space>
            <TextArea
              rows={3}
              value={adminMemo}
              onChange={(e) => setAdminMemo(e.target.value)}
              placeholder="메모를 입력하세요"
            />
          </Card>

          <Card title="로그" size="small" style={{ marginTop: 16 }}>
            <Timeline>
              {(selectedItem.logs || []).map((log, idx) => (
                <Timeline.Item key={idx}>
                  {log.what} ({log.who} {log.when})
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
