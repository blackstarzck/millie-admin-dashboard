import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  SearchOutlined,
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


const Coupon = () => {
    const [coupons, setCoupons] = useState(initialCouponData);
    const [isModalVisible, setIsModalVisible] = useState(false);
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
        alert(`'${key}' 쿠폰의 사용 내역 보기 기능은 현재 구현되지 않았습니다.`);
        console.log('View usage for:', key);
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
                            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => showModal(record)}>
                                수정
                            </Menu.Item>
                            <Menu.Item key="cancel" onClick={() => handleCancelIssuance(record.key)}>
                                발행 취소
                            </Menu.Item>
                            <Menu.Item key="history" onClick={() => handleViewUsage(record.key)}>
                                사용내역 보기
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
        </Space>
    );
};

export default Coupon;
