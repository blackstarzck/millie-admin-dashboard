import {
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

// 확장된 데이터 구조
const initialCouponData = [
  {
    key: '1',
    couponName: '신규 가입 10% 할인',
    description: '처음 가입하는 모든 회원에게 드리는 특별 할인 쿠폰입니다.',
    couponType: 'auto',
    autoIssueRule: 'first_purchase',
    discountType: 'percentage',
    discountValue: 10,
    issuanceDate: '2024-01-01',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    issuedCount: 500,
    usedCount: 120,
    perPersonLimit: 1,
    applicableContent: ['content-1', 'content-3'],
  },
  {
    key: '2',
    couponName: '여름 맞이 5,000원 할인',
    description: '여름 시즌 한정으로 제공되는 다운로드 쿠폰입니다.',
    couponType: 'download',
    discountType: 'fixed',
    discountValue: 5000,
    issuanceDate: '2024-06-01',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    issuedCount: 1000,
    usedCount: 450,
    perPersonLimit: 5,
    applicableContent: [], // 전체 적용
  },
];

// 컨텐츠 더미 데이터 확장
const dummyContentList = [
    { id: 'content-1', title: '달러구트 꿈 백화점' },
    { id: 'content-2', title: '시간을 파는 상점' },
    { id: 'content-3', title: '팩트풀니스' },
    { id: 'content-4', title: '어린이라는 세계' },
    { id: 'content-5', title: '불편한 편의점' },
    { id: 'content-6', title: '아몬드' },
    { id: 'content-7', title: '코스모스' },
    { id: 'content-8', title: '사피엔스' },
    { id: 'content-9', title: '총, 균, 쇠' },
    { id: 'content-10', title: '역사의 역사' },
    { id: 'content-11', title: '1984' },
    { id: 'content-12', title: '멋진 신세계' },
    { id: 'content-13', title: '페스트' },
    { id: 'content-14', title: '이방인' },
    { id: 'content-15', title: '데미안' },
];

// 사용내역 더미 데이터
const dummyUsageData = {
  '1': [
    {
      key: 'usage-1-1',
      userId: 'user001',
      userName: '김철수',
      userEmail: 'kimcs@example.com',
      useDate: '2024-01-15 14:30:25',
      discountAmount: '1,500원',
      originalPrice: '15,000원',
      finalPrice: '13,500원',
      contentTitle: '달러구트 꿈 백화점',
      contentId: 'content-1',
    },
    {
      key: 'usage-1-2',
      userId: 'user002',
      userName: '이영희',
      userEmail: 'leeyh@example.com',
      useDate: '2024-01-16 09:15:40',
      discountAmount: '2,000원',
      originalPrice: '20,000원',
      finalPrice: '18,000원',
      contentTitle: '팩트풀니스',
      contentId: 'content-3',
    },
    {
      key: 'usage-1-3',
      userId: 'user003',
      userName: '박민수',
      userEmail: 'parkms@example.com',
      useDate: '2024-01-17 16:45:12',
      discountAmount: '1,200원',
      originalPrice: '12,000원',
      finalPrice: '10,800원',
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
      useDate: '2024-06-15 11:20:15',
      discountAmount: '5,000원',
      originalPrice: '18,000원',
      finalPrice: '13,000원',
      contentTitle: '시간을 파는 상점',
      contentId: 'content-2',
    },
    {
      key: 'usage-2-2',
      userId: 'user005',
      userName: '최동훈',
      userEmail: 'choidh@example.com',
      useDate: '2024-06-20 15:33:28',
      discountAmount: '5,000원',
      originalPrice: '25,000원',
      finalPrice: '20,000원',
      contentTitle: '어린이라는 세계',
      contentId: 'content-4',
    },
  ],
};

const Coupon = () => {
    const [coupons, setCoupons] = useState(initialCouponData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUsageModalVisible, setIsUsageModalVisible] = useState(false);
    const [currentUsageData, setCurrentUsageData] = useState([]);
    const [currentCouponName, setCurrentCouponName] = useState('');
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();
    const couponType = Form.useWatch('couponType', form);
    const discountType = Form.useWatch('discountType', form);

    const showModal = (coupon) => {
        setEditingCoupon(coupon);
        if (coupon) {
            form.setFieldsValue({
                ...coupon,
                period: [moment(coupon.startDate, 'YYYY-MM-DD'), moment(coupon.endDate, 'YYYY-MM-DD')],
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ discountType: 'fixed', couponType: 'direct' });
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCoupon(null);
        form.resetFields();
    };

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const { period, ...restValues } = values;
                const newValues = {
                    ...restValues,
                    startDate: period ? period[0].format('YYYY-MM-DD') : undefined,
                    endDate: period ? period[1].format('YYYY-MM-DD') : undefined,
                };

                if (editingCoupon) {
                    setCoupons(coupons.map(c => (c.key === editingCoupon.key ? { ...editingCoupon, ...newValues } : c)));
                } else {
                    const newCoupon = {
                        ...newValues,
                        key: Date.now().toString(),
                        issuanceDate: moment().format('YYYY-MM-DD'),
                        usedCount: 0,
                    };
                    setCoupons([...coupons, newCoupon]);
                }
                handleCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleDelete = (key) => {
        Modal.confirm({
            title: '정말로 이 쿠폰을 삭제하시겠습니까?',
            content: '삭제된 데이터는 복구할 수 없습니다.',
            okText: '삭제',
            okType: 'danger',
            cancelText: '취소',
            onOk: () => {
                setCoupons(coupons.filter(c => c.key !== key));
            },
        });
    };

    const handleCancelIssuance = (key) => {
        Modal.confirm({
            title: '발행을 취소하시겠습니까?',
            content: '더 이상 이 쿠폰은 사용자에게 노출되지 않으며, 신규 발급이 중단됩니다.',
            okText: '확인',
            cancelText: '취소',
            onOk: () => {
                console.log('Issuance cancelled for:', key);
                // 실제 발행 취소 로직을 여기에 구현합니다.
            },
        });
    };

    const handleViewUsage = (key) => {
        const coupon = coupons.find(c => c.key === key);
        const usageData = dummyUsageData[key] || [];

        setCurrentCouponName(coupon?.couponName || '');
        setCurrentUsageData(usageData);
        setIsUsageModalVisible(true);

        console.log('View usage for:', key);
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

        // 엑셀 헤더 정의
        const headers = [
            '사용자 ID',
            '사용자명',
            '이메일',
            '사용일시',
            '원가격',
            '할인금액',
            '결제금액',
            '구매 컨텐츠'
        ];

        // 데이터를 CSV 형태로 변환 (엑셀에서 호환)
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

        // CSV 문자열 생성
        const csvContent = csvData.map(row =>
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        // BOM 추가하여 한글 깨짐 방지
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], {
            type: 'application/vnd.ms-excel;charset=utf-8;'
        });

        // 파일 다운로드
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${currentCouponName}_상세사용내역_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        console.log('Excel download completed for:', currentCouponName);
    };

    const handleDownloadUsage = (key) => {
        const coupon = coupons.find(c => c.key === key);
        if (!coupon) return;

        // CSV 형태로 사용내역 데이터 생성 (실제로는 서버에서 데이터를 받아와야 함)
        const csvData = [
            ['쿠폰명', '사용자ID', '사용일시', '할인금액', '사용컨텐츠'],
            [`${coupon.couponName}`, 'user001', '2024-01-15 14:30:00', '5000원', '달러구트 꿈 백화점'],
            [`${coupon.couponName}`, 'user002', '2024-01-16 09:15:00', '5000원', '시간을 파는 상점'],
            [`${coupon.couponName}`, 'user003', '2024-01-17 16:45:00', '5000원', '팩트풀니스'],
        ];

        // CSV 문자열 생성
        const csvContent = csvData.map(row => row.join(',')).join('\n');

        // BOM 추가하여 한글 깨짐 방지
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // 파일 다운로드
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${coupon.couponName}_사용내역_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        console.log('Download usage for:', key);
    };

    const columns = [
        {
            title: '쿠폰명',
            dataIndex: 'couponName',
            key: 'couponName',
            width: '20%',
        },
        {
            title: '할인 정보',
            dataIndex: 'discountValue',
            key: 'discount',
            render: (value, record) => (record.discountType === 'percentage' ? `${value}%` : `${value.toLocaleString()}원`),
        },
        {
            title: '발행일',
            dataIndex: 'issuanceDate',
            key: 'issuanceDate',
        },
        {
            title: '유효 기간',
            dataIndex: 'startDate',
            key: 'period',
            render: (text, record) => `${record.startDate} ~ ${record.endDate}`,
        },
        {
            title: '발행/사용',
            dataIndex: 'issuedCount',
            key: 'counts',
            render: (text, record) => `${record.usedCount.toLocaleString()} / ${record.issuedCount.toLocaleString()}`,
        },
        {
            title: '상태',
            key: 'status',
            render: (_, record) => {
                const isExpired = moment().isAfter(moment(record.endDate));
                const status = isExpired ? '종료' : '진행중';
                const color = isExpired ? 'volcano' : 'green';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: '관리',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item key="edit" onClick={() => showModal(record)}>
                                수정
                            </Menu.Item>
                            <Menu.Item key="cancel" onClick={() => handleCancelIssuance(record.key)}>
                                발행 취소
                            </Menu.Item>
                            <Menu.Item key="history" onClick={() => handleViewUsage(record.key)}>
                                사용내역 보기
                            </Menu.Item>
                            <Menu.Item key="download" icon={<DownloadOutlined />} onClick={() => handleDownloadUsage(record.key)}>
                                사용내역 다운로드
                            </Menu.Item>
                            <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.key)}>
                                삭제
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ];

    // 사용내역 테이블 컬럼 정의
    const usageColumns = [
        {
            title: '사용자 ID',
            dataIndex: 'userId',
            key: 'userId',
            width: '120px',
        },
        {
            title: '사용자명',
            dataIndex: 'userName',
            key: 'userName',
            width: '100px',
        },
        {
            title: '이메일',
            dataIndex: 'userEmail',
            key: 'userEmail',
            width: '200px',
        },
        {
            title: '사용일시',
            dataIndex: 'useDate',
            key: 'useDate',
            width: '150px',
        },
        {
            title: '원가격',
            dataIndex: 'originalPrice',
            key: 'originalPrice',
            width: '100px',
            align: 'right',
        },
        {
            title: '할인금액',
            dataIndex: 'discountAmount',
            key: 'discountAmount',
            width: '100px',
            align: 'right',
            render: (text) => <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>-{text}</span>,
        },
        {
            title: '결제금액',
            dataIndex: 'finalPrice',
            key: 'finalPrice',
            width: '100px',
            align: 'right',
            render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>,
        },
        {
            title: '구매 컨텐츠',
            dataIndex: 'contentTitle',
            key: 'contentTitle',
        },
    ];

    const filteredCoupons = coupons.filter(coupon =>
        Object.values(coupon).some(val =>
            String(val).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>쿠폰 관리</Title>
            <Row justify="space-between">
                <Col>
                    <Input
                        placeholder="쿠폰 검색"
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 240 }}
                        prefix={<SearchOutlined />}
                    />
                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal(null)}>
                        신규 쿠폰 등록
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={filteredCoupons}
                rowKey="key"
            />

            <Modal
                title={editingCoupon ? '쿠폰 수정' : '신규 쿠폰 등록'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="저장"
                cancelText="취소"
                width={800}
            >
                <Form form={form} layout="vertical" name="couponForm">
                    <Form.Item name="couponName" label="쿠폰명" rules={[{ required: true, message: '쿠폰명을 입력해주세요' }]} tooltip="최대 50자까지 입력할 수 있습니다.">
                        <Input maxLength={50} showCount />
                    </Form.Item>
                    <Form.Item name="description" label="설명" rules={[{ required: true, message: '설명을 입력해주세요' }]} tooltip="최대 80자까지 입력할 수 있습니다.">
                        <Input.TextArea maxLength={80} showCount />
                    </Form.Item>

                    <Form.Item name="couponType" label="쿠폰 타입" rules={[{ required: true, message: '쿠폰 타입을 선택해주세요' }]}>
                        <Radio.Group>
                            <Radio value="direct">지정 발행</Radio>
                            <Radio value="download">고객 다운로드</Radio>
                            <Radio value="auto">자동 발행</Radio>
                            <Radio value="code">쿠폰코드 발행</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {couponType === 'auto' && (
                        <Form.Item name="autoIssueRule" label="적용 룰" rules={[{ required: true, message: '적용 룰을 선택해주세요' }]}>
                            <Select placeholder="자동 발행 규칙 선택">
                                <Option value="first_purchase">첫 구매</Option>
                                <Option value="birthday">생일</Option>
                            </Select>
                        </Form.Item>
                    )}

                    {couponType === 'code' && (
                        <Form.Item name="couponCode" label="쿠폰 코드" rules={[{ required: true, message: '쿠폰 코드를 입력해주세요' }]}>
                            <Input />
                        </Form.Item>
                    )}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="discountType" label="할인 타입" rules={[{ required: true, message: '할인 타입을 선택해주세요' }]}>
                                <Radio.Group>
                                    <Radio value="fixed">고정금액</Radio>
                                    <Radio value="percentage">비율금액</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="discountValue" label="할인 값" rules={[{ required: true, message: '할인 값을 입력해주세요.' }]}>
                                <InputNumber
                                    addonAfter={discountType === 'fixed' ? '원' : '%'}
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={discountType === 'percentage' ? 100 : undefined}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="수량 설정">
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="issuedCount" label="발행 개수">
                                    <InputNumber style={{ width: '100%' }} min={1} placeholder="전체 발행할 쿠폰 개수" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                 <Form.Item name="perPersonLimit" label="개인별 사용 제한">
                                    <InputNumber style={{ width: '100%' }} min={1} placeholder="한 사람당 사용 가능 횟수" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item name="period" label="유효 기간" rules={[{ required: true, message: '유효 기간을 선택해주세요' }]}>
                        <DatePicker.RangePicker style={{ width: '100%' }} />
                    </Form.Item>

                     <Form.Item name="applicableContent" label="적용 컨텐츠 선택" tooltip="선택하지 않으면 전체 컨텐츠에 적용됩니다.">
                        <Select
                            mode="multiple"
                            allowClear
                            showSearch
                            filterOption={(input, option) =>
                                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            style={{ width: '100%' }}
                            placeholder="컨텐츠 검색 및 선택"
                        >
                            {dummyContentList.map(content => (
                                <Option key={content.id} value={content.id}>{content.title}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* 사용내역 보기 모달 */}
            <Modal
                title={`${currentCouponName} - 사용내역`}
                visible={isUsageModalVisible}
                onCancel={handleUsageModalCancel}
                footer={[
                    <Button
                        key="download"
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={handleExcelDownload}
                        style={{ marginRight: 8 }}
                    >
                        엑셀 다운로드
                    </Button>,
                    <Button key="close" onClick={handleUsageModalCancel}>
                        닫기
                    </Button>,
                ]}
                width={1200}
                style={{ top: 20 }}
            >
                <div style={{ marginBottom: 16 }}>
                    <span style={{ color: '#666' }}>
                        총 {currentUsageData.length}건의 사용내역이 있습니다.
                    </span>
                </div>
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
                    scroll={{ x: 1000 }}
                    size="middle"
                />
            </Modal>
        </Space>
    );
};

export default Coupon;
