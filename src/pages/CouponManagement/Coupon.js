import {
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
  SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Input,
  Menu,
  Modal,
  Row,
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

    const handleToggleIssuance = (key, currentStatus) => {
        const action = currentStatus === 'paused' ? '재개' : '중지';
        Modal.confirm({
            title: `발행을 ${action}하시겠습니까?`,
            content: `자동 발행 쿠폰의 발행을 ${action}합니다.`,
            okText: `발행 ${action}`,
            cancelText: '취소',
            onOk: () => {
                setCoupons(coupons.map(c => c.key === key ? { ...c, status: c.status === 'paused' ? 'active' : 'paused' } : c))
            },
        });
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

    const getTag = (record) => {
        const now = moment();
        const startDate = moment(record.startDate);
        const endDate = moment(record.endDate);

        if (record.status === 'paused') return <Tag color="orange">발행중지</Tag>;
        if (now.isAfter(endDate)) return <Tag color="volcano">기간만료</Tag>;
        if (now.isBefore(startDate)) return <Tag color="blue">발행예정</Tag>;
        return <Tag color="green">진행중</Tag>;
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
                             {record.couponType === 'auto' && (
                                <Menu.Item key="toggle" onClick={() => handleToggleIssuance(record.key, record.status)}>
                                    {record.status === 'paused' ? '발행재개' : '발행중지'}
                                </Menu.Item>
                             )}
                            <Menu.Item key="history" onClick={() => handleViewUsage(record.key)}>
                                사용내역 보기
                            </Menu.Item>
                             {record.couponType === 'download' && record.status === 'active' && (
                                <Menu.Item key="copyUrl">
                                    다운로드 URL 복사
                                </Menu.Item>
                             )}
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

    const filteredCoupons = coupons.filter(coupon =>
        Object.values(coupon).some(val =>
            String(val).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>쿠폰 목록</Title>
            <Row justify="space-between" align="middle">
                <Col>
                    <Input
                        placeholder="쿠폰 검색"
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                        prefix={<SearchOutlined />}
                        allowClear
                    />
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

export default CouponList;
