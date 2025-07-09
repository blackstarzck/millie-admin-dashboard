import {
    InfoCircleOutlined
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Radio,
    Row,
    Select,
    Space,
    Tooltip,
    Typography
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

// This component will be a dedicated page for creating and editing coupons.
// We'll need to fetch coupon data or initialize a new one based on URL params.

// Dummy data needs to be accessible here as well.
const dummyUserGroups = [
    { id: 'group-1', name: 'VIP 회원' },
    { id: 'group-2', name: '도매 회원' },
    { id: 'group-3', name: '일반 회원' },
];
const dummyCategories = [
    { id: 'cat-1', name: '자기계발' },
    { id: 'cat-2', name: '소설' },
    { id: 'cat-3', name: 'IT/프로그래밍' },
];
const dummyContentList = [
    { id: 'content-1', title: '달러구트 꿈 백화점' },
    { id: 'content-2', title: '시간을 파는 상점' },
    { id: 'content-3', title: '팩트풀니스' },
    { id: 'content-4', title: '어린이라는 세계' },
    { id: 'content-5', title: '불편한 편의점' },
    { id: 'content-6', title: '아몬드' },
];

const CouponForm = ({ coupons, setCoupons }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id: couponId } = useParams(); // Get coupon ID from URL for editing
    const [editingCoupon, setEditingCoupon] = useState(null);

    const couponType = Form.useWatch('couponType', form);
    const issueTarget = Form.useWatch('issueTarget', form);
    const usagePeriodType = Form.useWatch('usagePeriodType', form);
    const benefitType = Form.useWatch('benefitType', form);
    const discountType = Form.useWatch('discountType', form);
    const isUnlimitedIssue = Form.useWatch('isUnlimitedIssue', form);
    const isUnlimitedPerPerson = Form.useWatch('isUnlimitedPerPerson', form);
    const isUnlimitedDate = Form.useWatch('isUnlimitedDate', form);
    const applicableContentType = Form.useWatch('applicableContentType', form);

    useEffect(() => {
        if (couponId) {
            const couponToEdit = coupons.find(c => c.key === couponId);
            if (couponToEdit) {
                setEditingCoupon(couponToEdit);
                form.setFieldsValue({
                    ...couponToEdit,
                    period: (couponToEdit.startDate && couponToEdit.endDate) ? [moment(couponToEdit.startDate, 'YYYY-MM-DD'), moment(couponToEdit.endDate, 'YYYY-MM-DD')] : null,
                });
            } else {
                // Handle coupon not found
                Modal.error({
                    title: '오류',
                    content: '수정할 쿠폰 정보를 찾을 수 없습니다.',
                    onOk: () => navigate('/coupons/list')
                });
            }
        } else {
            // New coupon default values
            form.resetFields();
            form.setFieldsValue({
                couponType: 'direct',
                issueTarget: 'all_members',
                benefitType: 'amount_discount',
                discountType: 'fixed',
                usagePeriodType: 'fixed_period',
                perPersonLimit: 1,
                isUnlimitedPerPerson: true,
                isUnlimitedIssue: true,
                applicableContentType: 'all',
                isStackable: false,
                issueNotification: true,
            });
        }
    }, [couponId, coupons, form, navigate]);


    useEffect(() => {
        if (benefitType === 'fix_price') {
            form.setFieldsValue({
                applicableContentType: 'product',
                isStackable: false
            });
        }
    }, [benefitType, form]);

    useEffect(() => {
        if (applicableContentType === 'product') {
            form.setFieldsValue({ excludedContent: undefined });
        }
    }, [applicableContentType, form]);

     useEffect(() => {
        // Reset dependent fields when couponType changes
        if(!editingCoupon) { // Only apply this logic for new coupons
            form.setFieldsValue({
                issueTarget: undefined,
                issueTargetGroup: undefined,
                issueTargetIndividual: undefined,
                autoIssueRule: undefined,
                couponCodeType: 'single',
                couponCode: undefined,
                issueLimit: undefined,
                isUnlimitedIssue: true,
                usagePeriodType: undefined,
                isHide: false,
            });
            if (couponType === 'direct') {
               form.setFieldsValue({ usagePeriodType: 'fixed_period', perPersonLimit: 1, isUnlimitedPerPerson: true });
            } else if (couponType === 'download') {
               form.setFieldsValue({ isUnlimitedPerPerson: false, perPersonLimit: 1 });
            }
        }
    }, [couponType, form, editingCoupon]);

    const handleSave = () => {
        form.validateFields()
            .then(values => {
                const { period, ...restValues } = values;

                let newValues = { ...restValues };

                if (newValues.benefitType !== 'amount_discount') {
                    delete newValues.discountType;
                    delete newValues.discountValue;
                    delete newValues.maxDiscountAmount;
                }
                if (newValues.benefitType !== 'fix_price') {
                    delete newValues.fixedPrice;
                }

                if(newValues.usagePeriodType === 'fixed_period' && period) {
                    newValues.startDate = period[0].format('YYYY-MM-DD');
                    newValues.endDate = period[1].format('YYYY-MM-DD');
                }

                if (newValues.isUnlimitedIssue) newValues.issueLimit = null;
                if (newValues.isUnlimitedPerPerson) newValues.perPersonLimit = null;

                if (editingCoupon) {
                    setCoupons(coupons.map(c => (c.key === editingCoupon.key ? { ...editingCoupon, ...newValues } : c)));
                } else {
                    const newCoupon = {
                        ...newValues,
                        key: Date.now().toString(),
                        issuanceDate: moment().format('YYYY-MM-DD'),
                        issuedCount: 0,
                        usedCount: 0,
                        status: moment().isBefore(moment(newValues.startDate)) ? 'scheduled' : 'active',
                    };
                    setCoupons([newCoupon, ...coupons]);
                }
                navigate('/coupons/list');
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                 Modal.error({
                    title: '입력 값 오류',
                    content: '필수 입력값을 모두 채워주세요.',
                });
            });
    };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>{editingCoupon ? '쿠폰 수정' : '쿠폰 등록'}</Title>
            <Card>
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 19 }}
                    name="couponForm"
                >
                    <Title level={4} style={{ marginBottom: '24px' }}>쿠폰 정보</Title>
                    <Form.Item name="couponName" label="쿠폰명" rules={[{ required: true }]} tooltip="고객에게 표시되는 쿠폰 이름입니다.">
                        <Input showCount maxLength={80} placeholder="예: 사이트 오픈 1주년 할인 쿠폰"/>
                    </Form.Item>

                    <Form.Item name="couponType" label="쿠폰 형식" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="direct">지정 발행</Radio>
                            <Radio value="download">고객 다운로드</Radio>
                            <Radio value="auto">자동 발행</Radio>
                            <Radio value="code">쿠폰코드 생성</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {(couponType === 'direct' || couponType === 'download') && (
                        <Form.Item name="issueTarget" label="발행 대상" rules={[{ required: true }]}>
                            <Select placeholder="발행 대상을 선택하세요">
                                <Option value="all_members">전체 회원</Option>
                                <Option value="group">지정 그룹</Option>
                                {couponType === 'direct' && <Option value="individual">개별 회원</Option>}
                            </Select>
                        </Form.Item>
                    )}

                    {couponType === 'auto' && (
                         <Form.Item name="autoIssueRule" label="자동 발행 조건" rules={[{ required: true }]}>
                            <Select placeholder="자동 발행 조건을 선택하세요">
                                <Option value="new_member">첫 회원가입</Option>
                                <Option value="first_purchase">첫 주문완료</Option>
                                <Option value="birthday">생일</Option>
                            </Select>
                        </Form.Item>
                    )}

                    {couponType === 'code' && (
                        <>
                             <Form.Item name="couponCodeType" label="쿠폰 코드 형식" initialValue="single">
                                <Radio.Group>
                                    <Radio value="single">단일 쿠폰코드</Radio>
                                    <Radio value="multiple">여러 쿠폰코드</Radio>
                                </Radio.Group>
                             </Form.Item>
                             <Form.Item name="couponCode" label="쿠폰 코드" rules={[{ required: true }]}>
                                <Input placeholder="사용할 쿠폰 코드를 입력하세요"/>
                             </Form.Item>
                             <Form.Item name="issueTarget" label="발행 대상" initialValue="all_users">
                                <Radio.Group>
                                    <Radio value="all_users">회원 + 비회원</Radio>
                                    <Radio value="members_only">회원 전용</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </>
                    )}

                    { (couponType === 'direct' || couponType === 'download') && issueTarget === 'group' && (
                        <Form.Item name="issueTargetGroup" label="회원 그룹 선택" rules={[{ required: true }]}>
                            <Select placeholder="발행할 회원 그룹을 선택하세요">
                                {dummyUserGroups.map(g => <Option key={g.id} value={g.id}>{g.name}</Option>)}
                            </Select>
                        </Form.Item>
                    )}

                     { couponType === 'direct' && issueTarget === 'individual' && (
                        <Form.Item name="issueTargetIndividual" label="개별 회원 ID" rules={[{ required: true }]}>
                            <Input.TextArea rows={2} placeholder="회원 ID를 쉼표(,)로 구분하여 입력하세요."/>
                        </Form.Item>
                    )}

                    {couponType === 'download' && (
                        <Form.Item label="발행 수량">
                            <Space align="baseline">
                                <Form.Item name="issueLimit" noStyle>
                                    <InputNumber min={1} disabled={isUnlimitedIssue} />
                                </Form.Item>
                                <Form.Item name="isUnlimitedIssue" valuePropName="checked" noStyle>
                                    <Checkbox>개수제한 없음</Checkbox>
                                </Form.Item>
                            </Space>
                        </Form.Item>
                    )}

                    {couponType === 'download' && (
                        <Form.Item name="isHide" valuePropName="checked">
                            <Checkbox>
                                쿠폰 숨김
                                <Tooltip title="마이페이지의 다운로드 쿠폰 목록과 상품 상세페이지에서 쿠폰을 숨깁니다.">
                                    <InfoCircleOutlined style={{ marginLeft: 4, color: 'rgba(0,0,0,.45)' }}/>
                                </Tooltip>
                            </Checkbox>
                        </Form.Item>
                    )}

                    <Form.Item name="issueNotification" valuePropName="checked">
                        <Checkbox>
                            발행 알림
                            <Tooltip title="쿠폰 사용 시작일에 웹/앱 푸시 알림을 발송합니다.">
                                 <InfoCircleOutlined style={{ marginLeft: 4, color: 'rgba(0,0,0,.45)' }}/>
                            </Tooltip>
                        </Checkbox>
                    </Form.Item>

                    <Title level={4} style={{ marginTop: '40px', marginBottom: '24px' }}>사용 정보</Title>

                    <Form.Item name="benefitType" label="사용 혜택" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="amount_discount">금액 할인</Radio>
                            <Radio value="fix_price">지정금액 할인</Radio>
                        </Radio.Group>
                    </Form.Item>

                     {benefitType === 'amount_discount' && (
                        <>
                            <Form.Item name="discountType" label="할인 종류" rules={[{ required: true }]} initialValue="fixed">
                                <Radio.Group>
                                    <Radio value="fixed">금액(원) 할인</Radio>
                                    <Radio value="percentage">비율(%) 할인</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name="discountValue" label="할인 값" rules={[{ required: true }]}>
                                <InputNumber
                                    addonAfter={discountType === 'fixed' ? '원' : '%'}
                                    style={{ width: '100%' }}
                                    min={0}
                                    max={discountType === 'percentage' ? 100 : undefined}
                                />
                            </Form.Item>
                        </>
                    )}

                    {benefitType === 'fix_price' && (
                        <Form.Item name="fixedPrice" label="지정 판매 금액" rules={[{ required: true }]} tooltip="쿠폰 사용 시 상품을 구매하게 될 최종 금액을 입력합니다.">
                            <InputNumber addonAfter="원" style={{ width: '100%' }} min={0} />
                        </Form.Item>
                    )}

                    {(benefitType === 'amount_discount' && discountType === 'percentage') && (
                        <Form.Item name="maxDiscountAmount" label="최대 할인 금액" tooltip="할인율(%) 적용 시 최대 할인될 금액을 제한합니다.">
                            <InputNumber style={{ width: '100%' }} min={0} addonAfter="원" placeholder="제한 없음" />
                        </Form.Item>
                    )}

                    <Form.Item name="minOrderAmount" label="최소 주문 금액" tooltip="이 쿠폰을 사용하기 위한 최소 주문 금액입니다.">
                        <InputNumber style={{ width: '100%' }} min={0} addonAfter="원" placeholder="제한 없음" />
                    </Form.Item>

                    <Form.Item name="applicableContentType" label="쿠폰 적용 범위" initialValue="all">
                         <Radio.Group disabled={benefitType === 'fix_price'}>
                            <Radio value="all">모든 상품</Radio>
                            <Radio value="category">지정 카테고리</Radio>
                            <Radio value="product">지정 상품</Radio>
                        </Radio.Group>
                        {benefitType === 'fix_price' && <Text type="warning" style={{display: 'block', marginTop: '8px'}}>* 지정금액 할인은 '지정 상품'에만 적용 가능합니다.</Text>}
                    </Form.Item>

                    {applicableContentType === 'category' && (
                         <Form.Item name="applicableCategories" label="사용 가능 카테고리">
                            <Select mode="multiple" allowClear placeholder="쿠폰을 적용할 카테고리를 선택하세요">
                                {dummyCategories.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                            </Select>
                        </Form.Item>
                    )}
                    {applicableContentType === 'product' && (
                         <Form.Item name="applicableContent" label="사용 가능 상품">
                            <Select mode="multiple" allowClear showSearch placeholder="쿠폰을 적용할 상품을 선택하세요" filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                                {dummyContentList.map(c => <Option key={c.id} value={c.id}>{c.title}</Option>)}
                            </Select>
                        </Form.Item>
                    )}


                    {applicableContentType !== 'product' && (
                        <Form.Item name="excludedContent" label="사용 제외 상품" tooltip="쿠폰 적용에서 제외할 상품을 선택하세요.">
                            <Select mode="multiple" allowClear showSearch placeholder="쿠폰 적용에서 제외할 상품을 선택하세요" filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}>
                                {dummyContentList.map(c => <Option key={c.id} value={c.id}>{c.title}</Option>)}
                            </Select>
                        </Form.Item>
                    )}


                    <Form.Item name="usagePeriodType" label="사용 기간" rules={[{ required: true }]}>
                        <Radio.Group>
                            <Radio value="fixed_period" disabled={couponType === 'auto'}>기간 설정</Radio>
                             {couponType === 'download' && <Radio value="days_from_download">다운로드 기준</Radio>}
                             {couponType === 'auto' && <Radio value="days_from_issue">발급일 기준</Radio>}
                        </Radio.Group>
                    </Form.Item>

                     {usagePeriodType === 'fixed_period' ? (
                        <Form.Item label="사용 가능 기간">
                             <Space align="baseline">
                                <Form.Item name="period" noStyle rules={[{ required: !isUnlimitedDate }]}>
                                     <DatePicker.RangePicker
                                        style={{ width: '100%' }}
                                        disabled={isUnlimitedDate || (couponType === 'direct' && editingCoupon)}
                                        disabledDate={(current) => couponType === 'direct' && editingCoupon && current && (current > moment(editingCoupon.issuanceDate).add(30, 'days'))}
                                    />
                                </Form.Item>
                                <Form.Item name="isUnlimitedDate" valuePropName="checked" noStyle>
                                    <Checkbox>기간제한 없음</Checkbox>
                                </Form.Item>
                             </Space>
                             {couponType === 'direct' && <Alert message="지정발행 쿠폰은 발행일로부터 최대 30일까지만 사용기간 설정이 가능합니다." type="info" showIcon style={{marginTop: '8px'}}/>}
                        </Form.Item>

                    ) : null}

                    {(usagePeriodType === 'days_from_download' || usagePeriodType === 'days_from_issue') ? (
                         <Form.Item name="usagePeriodDays" label="사용 가능일" rules={[{ required: true }]}>
                            <InputNumber addonAfter="일 후까지 사용 가능" style={{ width: 250 }} min={1} />
                        </Form.Item>
                    ): null}


                    {couponType !== 'direct' && (
                        <Form.Item label="사용 횟수 (1인당)">
                            <Space align="baseline">
                                <Form.Item name="perPersonLimit" noStyle rules={[{ required: !isUnlimitedPerPerson }]}>
                                    <InputNumber min={1} disabled={isUnlimitedPerPerson} />
                                </Form.Item>
                                 <Form.Item name="isUnlimitedPerPerson" valuePropName="checked" noStyle>
                                     <Checkbox>횟수제한 없음</Checkbox>
                                </Form.Item>
                            </Space>
                        </Form.Item>
                    )}


                     <Form.Item label="사용 옵션">
                        <Space direction="vertical">
                            <Form.Item name="isStackable" valuePropName="checked" noStyle>
                                <Checkbox disabled={benefitType === 'fix_price'}>
                                    추가 할인 가능 (다른 쿠폰과 중복 사용 허용)
                                    {benefitType === 'fix_price' && <Text type="warning"> (지정금액 할인은 중복 사용 불가)</Text>}
                                </Checkbox>
                            </Form.Item>
                        </Space>
                    </Form.Item>
                </Form>
                <Row justify="end" style={{ marginTop: 24 }}>
                    <Space>
                        <Button onClick={() => navigate('/coupons/list')}>취소</Button>
                        <Button type="primary" onClick={handleSave}>저장</Button>
                    </Space>
                </Row>
            </Card>
        </Space>
    );
};

export default CouponForm;
