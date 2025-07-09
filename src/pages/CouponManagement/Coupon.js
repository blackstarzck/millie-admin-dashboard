import {
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Input,
  Menu,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

// This component will now be the CouponList.
const CouponList = ({ coupons, setCoupons }) => {
    const [isUsageModalVisible, setIsUsageModalVisible] = useState(false);
    const [currentUsageData, setCurrentUsageData] = useState([]);
    const [currentCouponName, setCurrentCouponName] = useState('');
    const [searchText, setSearchText] = useState('');
    const [filterType, setFilterType] = useState(null);
    const [filterDateRange, setFilterDateRange] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);
    const navigate = useNavigate();

    // 사용내역 더미 데이터
    const dummyUsageData = {
      '1': [
        {
          key: 'usage-1-1',
          userId: 'user001',
          userName: '김철수',
          userEmail: 'kimcs@example.com',
          useDate: '2024-07-15 14:30:25',
          discountAmount: '1,500원',
          originalPrice: '15,000원',
          finalPrice: '13,500원',
          contentTitle: '달러구트 꿈 백화점',
          contentId: 'content-1',
        },
      ],
      '2': [
        {
          key: 'usage-2-1',
          userId: 'user004',
          userName: '정수진',
          userEmail: 'jungsj@example.com',
          useDate: '2024-07-15 11:20:15',
          discountAmount: '3,000원',
          originalPrice: '32,000원',
          finalPrice: '29,000원',
          contentTitle: '시간을 파는 상점',
          contentId: 'content-2',
        },
      ],
    };

    const handleDelete = (key) => {
        setCoupons(coupons.filter(c => c.key !== key));
    };

    const handleToggleIssuance = (key) => {
        setCoupons(coupons.map(c => c.key === key ? { ...c, status: 'paused' } : c))
    };

    const handleViewUsage = (key) => {
        const coupon = coupons.find(c => c.key === key);
        const usageData = dummyUsageData[key] || [];

        setCurrentCouponName(coupon?.couponName || '');
        setCurrentUsageData(usageData);
        setIsUsageModalVisible(true);
    };

    const handleUsageModalCancel = () => {
        setIsUsageModalVisible(false);
        setCurrentUsageData([]);
        setCurrentCouponName('');
    };

    const handleExcelDownload = () => {
        if (currentUsageData.length === 0) {
            Modal.warning({
                title: '다운로드 불가',
                content: '다운로드할 사용내역이 없습니다.',
            });
            return;
        }

        const headers = ['사용자 ID', '사용자명', '이메일', '사용일시', '원가격', '할인금액', '결제금액', '구매 컨텐츠'];
        const csvData = [
            headers,
            ...currentUsageData.map(item => [
                item.userId,
                item.userName,
                item.userEmail,
                item.useDate,
                item.originalPrice,
                item.discountAmount,
                item.finalPrice,
                item.contentTitle
            ])
        ];
        const csvContent = csvData.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${currentCouponName}_상세사용내역_${moment().format('YYYY-MM-DD')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getComputedStatus = (record) => {
        const now = moment();
        const endDate = moment(record.endDate, 'YYYY-MM-DD');
        const startDate = moment(record.startDate, 'YYYY-MM-DD');

        if (record.status === 'exhausted') return 'exhausted';
        if (record.status === 'paused') return 'paused';
        if (now.isAfter(endDate)) return 'expired';
        if (now.isBefore(startDate)) return 'scheduled';
        if (record.status === 'active') return 'active';
        return record.status;
    };

    const getTag = (record) => {
        const status = getComputedStatus(record);
        switch (status) {
            case 'exhausted': return <Tag color="red">소진마감</Tag>;
            case 'paused': return <Tag color="orange">발행중지</Tag>;
            case 'expired': return <Tag color="volcano">기간만료</Tag>;
            case 'scheduled': return <Tag color="blue">발행예정</Tag>;
            case 'active': return <Tag color="green">진행중</Tag>;
            default: return <Tag>{status}</Tag>;
        }
    };

    const columns = [
        {
            title: '쿠폰명',
            dataIndex: 'couponName',
            key: 'couponName',
            width: '25%',
        },
        {
            title: '쿠폰 형식',
            dataIndex: 'couponType',
            key: 'couponType',
            render: (type) => {
                const types = {
                    'direct': '지정발행',
                    'download': '고객 다운로드',
                    'auto': '자동 발행',
                    'code': '쿠폰코드'
                }
                return types[type] || '';
            }
        },
        {
            title: '혜택',
            dataIndex: 'discountValue',
            key: 'benefit',
            render: (_, record) => {
                if (record.benefitType === 'fix_price') {
                    return `${(record.fixedPrice || 0).toLocaleString()}원 지정가`;
                }
                if (record.benefitType === 'amount_discount') {
                     return record.discountType === 'percentage' ? `${record.discountValue}%` : `${(record.discountValue || 0).toLocaleString()}원`;
                }
                return '-';
            },
        },
        {
            title: '발행일',
            dataIndex: 'publishDate',
            key: 'publishDate',
        },
        {
            title: '유효 기간',
            dataIndex: 'startDate',
            key: 'period',
            render: (text, record) => {
                 if (record.usagePeriodType === 'days_from_issue' || record.usagePeriodType === 'days_from_download') return `발급/다운일로부터 ${record.usagePeriodDays}일`;
                 if (record.isUnlimitedDate) return '무제한';
                 return `${record.startDate} ~ ${record.endDate}`;
            }
        },
        {
            title: '발행/사용',
            dataIndex: 'issuedCount',
            key: 'counts',
            render: (text, record) => {
                const used = (record.usedCount || 0).toLocaleString();
                let issued = record.couponType === 'download' && !record.isUnlimitedIssue ? ` / ${(record.issueLimit || 0).toLocaleString()}` : '';
                if(record.couponType === 'direct' || record.couponType === 'auto' || (record.couponType === 'download' && record.isUnlimitedIssue)) {
                    issued = ` / ${(record.issuedCount || 0).toLocaleString()}`
                }
                if (record.couponType === 'code') return used;

                return `${used}${issued}`;
            },
        },
        {
            title: '상태',
            key: 'status',
            render: (_, record) => getTag(record)
        },
        {
            title: '관리',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="edit" onClick={() => navigate(`/coupons/register/${record.key}`)}>
                                수정
                            </Menu.Item>
                            <Menu.Item key="history" onClick={() => handleViewUsage(record.key)}>
                                사용내역 보기
                            </Menu.Item>
                            {record.couponType === 'download' && record.status === 'active' && (
                                <Menu.Item key="copyUrl">
                                    다운로드 URL 복사
                                </Menu.Item>
                            )}
                            <Menu.Divider />
                            {['auto', 'download', 'direct'].includes(record.couponType) && record.status === 'active' && (
                                <Popconfirm
                                  title="발행을 중지하시겠습니까?"
                                  description="쿠폰의 발행을 중지합니다."
                                  onConfirm={() => handleToggleIssuance(record.key)}
                                  okText="발행 중지"
                                  cancelText="취소"
                                >
                                    <Menu.Item
                                      key="toggle"
                                      danger
                                      onClick={({ domEvent }) => {
                                          domEvent.preventDefault();
                                          domEvent.stopPropagation();
                                      }}
                                    >
                                        발행중지
                                    </Menu.Item>
                                </Popconfirm>
                            )}
                             <Popconfirm
                                title="정말로 이 쿠폰을 삭제하시겠습니까?"
                                description="삭제된 데이터는 복구할 수 없습니다."
                                onConfirm={() => handleDelete(record.key)}
                                okText="삭제"
                                okType="danger"
                                cancelText="취소"
                            >
                                <Menu.Item
                                    key="delete"
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={({ domEvent }) => {
                                        domEvent.preventDefault();
                                        domEvent.stopPropagation();
                                    }}
                                >
                                    삭제
                                </Menu.Item>
                            </Popconfirm>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    const usageColumns = [
        { title: '사용자 ID', dataIndex: 'userId', key: 'userId' },
        { title: '사용자명', dataIndex: 'userName', key: 'userName' },
        { title: '이메일', dataIndex: 'userEmail', key: 'userEmail' },
        { title: '사용일시', dataIndex: 'useDate', key: 'useDate' },
        { title: '원가격', dataIndex: 'originalPrice', key: 'originalPrice', align: 'right' },
        {
            title: '할인금액',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            align: 'right',
            render: (text) => <span style={{ color: '#ff4d4f' }}>-{text}</span>,
        },
        { title: '결제금액', dataIndex: 'finalPrice', key: 'finalPrice', align: 'right' },
        { title: '구매 컨텐츠', dataIndex: 'contentTitle', key: 'contentTitle' },
    ];

    const handleResetFilters = () => {
        setSearchText('');
        setFilterType(null);
        setFilterDateRange(null);
        setFilterStatus(null);
    };

    const filteredCoupons = coupons.filter(coupon => {
        const textMatch = !searchText || coupon.couponName.toLowerCase().includes(searchText.toLowerCase());
        const typeMatch = !filterType || coupon.couponType === filterType;
        const statusMatch = !filterStatus || getComputedStatus(coupon) === filterStatus;

        let dateMatch = true;
        if (filterDateRange && filterDateRange[0] && filterDateRange[1]) {
            const publishDate = moment(coupon.publishDate, 'YYYY-MM-DD');
            const startDate = filterDateRange[0].startOf('day');
            const endDate = filterDateRange[1].endOf('day');
            dateMatch = publishDate.isBetween(startDate, endDate);
        }

        return textMatch && typeMatch && statusMatch && dateMatch;
    });

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>쿠폰 목록</Title>
            <Row justify="space-between" align="middle">
                <Col>
                    <Space wrap>
                        <Input
                            placeholder="쿠폰명 검색"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 200 }}
                            prefix={<SearchOutlined />}
                            allowClear
                        />
                        <Select
                            value={filterType}
                            placeholder="쿠폰 형식"
                            style={{ width: 150 }}
                            onChange={setFilterType}
                            allowClear
                        >
                            <Select.Option value="direct">지정발행</Select.Option>
                            <Select.Option value="download">고객 다운로드</Select.Option>
                            <Select.Option value="auto">자동 발행</Select.Option>
                            <Select.Option value="code">쿠폰코드</Select.Option>
                        </Select>
                        <DatePicker.RangePicker
                            value={filterDateRange}
                            onChange={setFilterDateRange}
                            placeholder={['발행 시작일', '발행 종료일']}
                        />
                        <Select
                            value={filterStatus}
                            placeholder="상태"
                            style={{ width: 120 }}
                            onChange={setFilterStatus}
                            allowClear
                        >
                            <Select.Option value="active">진행중</Select.Option>
                            <Select.Option value="paused">발행중지</Select.Option>
                            <Select.Option value="exhausted">소진마감</Select.Option>
                            <Select.Option value="expired">기간만료</Select.Option>
                            <Select.Option value="scheduled">발행예정</Select.Option>
                        </Select>
                        <Button onClick={handleResetFilters}>초기화</Button>
                    </Space>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={filteredCoupons}
                rowKey="key"
                pagination={{ showSizeChanger: true, showQuickJumper: true, pageSizeOptions: ['10', '20', '50'] }}
            />

            <Modal
                title={`${currentCouponName} - 상세 사용내역`}
                visible={isUsageModalVisible}
                onCancel={handleUsageModalCancel}
                footer={[
                    <Button
                        key="download"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleExcelDownload}
                    >
                        엑셀로 내려받기
                    </Button>,
                    <Button key="close" onClick={handleUsageModalCancel}>
                        닫기
                    </Button>,
                ]}
                width={1200}
                style={{ top: 20 }}
            >
                <Text type="secondary">총 {currentUsageData.length}건의 사용내역이 있습니다.</Text>
                <Table
                    columns={usageColumns}
                    dataSource={currentUsageData}
                    rowKey="key"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}건`,
                    }}
                    scroll={{ y: 400 }}
                    size="middle"
                    style={{ marginTop: 16 }}
                />
            </Modal>
        </Space>
    );
};

const initialCoupons = [
    {
      key: '1',
      couponName: '밀리 오리지널 10% 할인 쿠폰',
      couponType: 'download',
      benefitType: 'amount_discount',
      discountType: 'percentage',
      discountValue: 10,
      usagePeriodType: 'days_from_download',
      usagePeriodDays: 30,
      isUnlimitedIssue: true,
      issuedCount: 1200,
      usedCount: 350,
      status: 'active',
      publishDate: moment().subtract(10, 'days').format('YYYY-MM-DD'),
      startDate: moment().subtract(10, 'days').format('YYYY-MM-DD'),
      endDate: moment().add(20, 'days').format('YYYY-MM-DD'),
    },
    {
      key: '2',
      couponName: '신규 가입자 3,000원 할인',
      couponType: 'auto',
      benefitType: 'amount_discount',
      discountType: 'amount',
      discountValue: 3000,
      isUnlimitedDate: true,
      usagePeriodType: 'period',
      issuedCount: 500,
      usedCount: 450,
      status: 'active',
      publishDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      endDate: moment().add(30, 'days').format('YYYY-MM-DD'),
    },
    {
      key: '3',
      couponName: '7월 출석체크 이벤트 쿠폰',
      couponType: 'direct',
      benefitType: 'amount_discount',
      discountType: 'amount',
      discountValue: 1000,
      isUnlimitedDate: false,
      usagePeriodType: 'period',
      startDate: '2024-07-01',
      endDate: '2024-07-31',
      issuedCount: 2000,
      usedCount: 1500,
      status: 'active',
      publishDate: '2024-07-01',
    },
    {
      key: '4',
      couponName: '[소진] 베스트셀러 50% 할인',
      couponType: 'download',
      benefitType: 'amount_discount',
      discountType: 'percentage',
      discountValue: 50,
      isUnlimitedIssue: false,
      issueLimit: 1000,
      issuedCount: 1000,
      usedCount: 1000,
      isUnlimitedDate: false,
      usagePeriodType: 'period',
      publishDate: moment().subtract(5, 'days').format('YYYY-MM-DD'),
      startDate: moment().subtract(5, 'days').format('YYYY-MM-DD'),
      endDate: moment().add(5, 'days').format('YYYY-MM-DD'),
      status: 'exhausted',
    },
    {
      key: '5',
      couponName: '지난 이벤트 쿠폰',
      couponType: 'code',
      benefitType: 'amount_discount',
      discountType: 'amount',
      discountValue: 2000,
      isUnlimitedDate: false,
      usagePeriodType: 'period',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      usedCount: 85,
      status: 'expired',
      publishDate: '2024-06-01',
    },
    {
      key: '6',
      couponName: '여름 휴가 시즌 15% 쿠폰',
      couponType: 'download',
      benefitType: 'amount_discount',
      discountType: 'percentage',
      discountValue: 15,
      isUnlimitedDate: false,
      usagePeriodType: 'period',
      publishDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
      isUnlimitedIssue: true,
      issuedCount: 5000,
      usedCount: 1234,
      status: 'active',
    },
    {
      key: '7',
      couponName: '판타지/무협 소설 20% 할인',
      couponType: 'download',
      benefitType: 'amount_discount',
      discountType: 'percentage',
      discountValue: 20,
      usagePeriodType: 'days_from_download',
      usagePeriodDays: 30,
      isUnlimitedIssue: true,
      issuedCount: 800,
      usedCount: 250,
      status: 'active',
      publishDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      startDate: moment().subtract(2, 'days').format('YYYY-MM-DD'),
      endDate: moment().add(28, 'days').format('YYYY-MM-DD'),
    },
    {
      key: '8',
      couponName: 'IT 전문서적 5,000원 할인',
      couponType: 'code',
      benefitType: 'amount_discount',
      discountType: 'amount',
      discountValue: 5000,
      isUnlimitedDate: true,
      usagePeriodType: 'period',
      usedCount: 42,
      status: 'active',
      publishDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
      startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
      endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
    },
    {
      key: '9',
      couponName: '자동발행 테스트 쿠폰 (중지됨)',
      couponType: 'auto',
      benefitType: 'amount_discount',
      discountType: 'amount',
      discountValue: 1000,
      isUnlimitedDate: true,
      usagePeriodType: 'period',
      issuedCount: 100,
      usedCount: 30,
      status: 'paused',
      publishDate: moment().subtract(1, 'week').format('YYYY-MM-DD'),
      startDate: moment().subtract(1, 'week').format('YYYY-MM-DD'),
      endDate: moment().add(1, 'week').format('YYYY-MM-DD'),
    },
    {
      key: '10',
      couponName: '9월 발행예정 쿠폰',
      couponType: 'download',
      benefitType: 'amount_discount',
      discountType: 'percentage',
      discountValue: 10,
      isUnlimitedDate: false,
      usagePeriodType: 'period',
      publishDate: moment().format('YYYY-MM-DD'),
      startDate: moment().add(1, 'month').startOf('month').format('YYYY-MM-DD'),
      endDate: moment().add(1, 'month').endOf('month').format('YYYY-MM-DD'),
      isUnlimitedIssue: true,
      issuedCount: 0,
      usedCount: 0,
      status: 'scheduled',
    },
    {
      key: '11',
      couponName: '로맨스/BL 소설 2,000원 할인',
      couponType: 'direct',
      benefitType: 'amount_discount',
      discountType: 'amount',
      discountValue: 2000,
      isUnlimitedDate: false,
      usagePeriodType: 'period',
      publishDate: moment().subtract(3, 'days').format('YYYY-MM-DD'),
      startDate: moment().subtract(3, 'days').format('YYYY-MM-DD'),
      endDate: moment().add(10, 'days').format('YYYY-MM-DD'),
      issuedCount: 500,
      usedCount: 150,
      status: 'active',
    },
    {
      key: '12',
      couponName: '[소진] 주말 한정! 30% 쿠폰',
      couponType: 'download',
      benefitType: 'amount_discount',
      discountType: 'percentage',
      discountValue: 30,
      isUnlimitedIssue: false,
      issueLimit: 500,
      issuedCount: 500,
      usedCount: 500,
      isUnlimitedDate: false,
      usagePeriodType: 'period',
      publishDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().add(1, 'days').format('YYYY-MM-DD'),
      status: 'exhausted',
    },
    {
      key: '13',
      couponName: '경제경영 도서 10%',
      couponType: 'download',
      benefitType: 'amount_discount',
      discountType: 'percentage',
      discountValue: 10,
      usagePeriodType: 'days_from_download',
      usagePeriodDays: 14,
      isUnlimitedIssue: true,
      issuedCount: 2000,
      usedCount: 780,
      status: 'active',
      publishDate: moment().subtract(20, 'days').format('YYYY-MM-DD'),
      startDate: moment().subtract(20, 'days').format('YYYY-MM-DD'),
      endDate: moment().add(10, 'days').format('YYYY-MM-DD'),
    },
    {
      key: '14',
      couponName: '장기 미사용 고객 웰컴백 쿠폰',
      couponType: 'auto',
      benefitType: 'amount_discount',
      discountType: 'percentage',
      discountValue: 20,
      usagePeriodType: 'days_from_issue',
      usagePeriodDays: 60,
      issuedCount: 300,
      usedCount: 25,
      status: 'active',
      publishDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
      startDate: moment().subtract(1, 'month').format('YYYY-MM-DD'),
      endDate: moment().add(1, 'month').format('YYYY-MM-DD'),
    },
    {
      key: '15',
      couponName: '지정가 9,900원 쿠폰',
      couponType: 'download',
      benefitType: 'fix_price',
      fixedPrice: 9900,
      isUnlimitedDate: false,
      usagePeriodType: 'period',
      publishDate: moment().format('YYYY-MM-DD'),
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(15, 'days').format('YYYY-MM-DD'),
      isUnlimitedIssue: true,
      issuedCount: 1500,
      usedCount: 450,
      status: 'active',
    }
  ];

const Coupon = () => {
    const [coupons, setCoupons] = useState(initialCoupons);

    return <CouponList coupons={coupons} setCoupons={setCoupons} />;
};

export default Coupon;
