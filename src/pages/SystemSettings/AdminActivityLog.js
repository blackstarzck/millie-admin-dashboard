import { SyncOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Input, Row, Select, Table, Tag, Tooltip, Typography } from 'antd';
import React, { useMemo, useState } from 'react';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdminActivityLog = () => {
    const [filters, setFilters] = useState({
        admin: '',
        actionType: null,
        location: '',
        status: null,
        dateRange: null,
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            admin: '',
            actionType: null,
            location: '',
            status: null,
            dateRange: null,
        });
    };

    const columns = [
        { title: '관리자', dataIndex: 'admin', key: 'admin' },
        { title: 'IP 주소', dataIndex: 'ipAddress', key: 'ipAddress' },
        { title: '위치 (페이지)', dataIndex: 'location', key: 'location' },
        {
            title: '활동 유형',
            dataIndex: 'actionType',
            key: 'actionType',
            render: (actionType) => {
                let color = 'default';
                if (actionType === 'CREATE') color = 'cyan';
                if (actionType === 'UPDATE') color = 'orange';
                if (actionType === 'DELETE') color = 'red';
                return <Tag color={color}>{actionType}</Tag>;
            },
        },
        { title: '활동 내용', dataIndex: 'actionDetail', key: 'actionDetail' },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                const statusSpan = (
                    <span style={{ color: status === 'Success' ? 'green' : 'red' }}>
                        {status}
                    </span>
                );

                if (status === 'Failed' && record.failureReason) {
                    return <Tooltip title={record.failureReason}>{statusSpan}</Tooltip>;
                }

                return statusSpan;
            },
        },
        { title: '시간', dataIndex: 'timestamp', key: 'timestamp', sorter: (a, b) => new Date(b.timestamp) - new Date(a.timestamp), defaultSortOrder: 'ascend' },
    ];

    const rawData = [
        { key: '1', admin: 'admin01', ipAddress: '192.168.1.10', location: '콘텐츠 관리 > 도서 관리', action: 'CREATE: 새로운 도서 "블록체인 혁명" 추가', status: 'Success', failureReason: null, timestamp: '2023-10-27 10:30:15' },
        { key: '2', admin: 'admin02', ipAddress: '192.168.1.11', location: '회원 관리 > 회원 정보', action: 'UPDATE: 사용자 "user123" 정보 변경', status: 'Success', failureReason: null, timestamp: '2023-10-27 10:25:40' },
        { key: '3', admin: 'admin01', ipAddress: '211.172.10.1', location: '시스템 설정 > 권한 관리', action: 'DELETE: "에디터" 역할 삭제 시도', status: 'Failed', failureReason: '하위 사용자가 존재하여 삭제할 수 없습니다.', timestamp: '2023-10-27 09:15:22' },
        { key: '5', admin: 'admin02', ipAddress: '192.168.1.11', location: '사용자 관리 > 사용자 목록', action: 'UPDATE: 사용자 "user456" 활성화', status: 'Success', failureReason: null, timestamp: '2023-10-26 18:45:12' },
        { key: '6', admin: 'admin01', ipAddress: '192.168.1.10', location: '콘텐츠 관리 > 카테고리 관리', action: 'CREATE: 신규 카테고리 "AI" 추가', status: 'Success', failureReason: null, timestamp: '2023-10-26 17:30:00' },
        { key: '8', admin: 'admin01', ipAddress: '211.172.10.1', location: '시스템 설정 > API 관리', action: 'DELETE: 오래된 API 키 삭제', status: 'Success', failureReason: null, timestamp: '2023-10-26 15:10:55' },
        { key: '13', admin: 'admin01', ipAddress: '211.172.10.1', location: '시스템 설정 > 권한 관리', action: 'UPDATE: "마케터" 역할 권한 변경', status: 'Success', failureReason: null, timestamp: '2023-10-25 19:15:00' },
        { key: '14', admin: 'admin03', ipAddress: '10.0.0.5', location: '쿠폰 관리 > 쿠폰 목록', action: 'DELETE: 만료된 "추석 쿠폰" 삭제', status: 'Success', failureReason: null, timestamp: '2023-10-25 18:05:30' },
        { key: '16', admin: 'admin02', ipAddress: '192.168.1.11', location: '콘텐츠 관리 > 도서 관리', action: 'CREATE: "데이터 과학" 도서 추가 시도', status: 'Failed', failureReason: '필수 메타데이터 누락', timestamp: '2023-10-25 16:30:00' },
        { key: '21', admin: 'admin01', ipAddress: '211.172.10.1', location: '시스템 설정 > 보안 설정', action: 'UPDATE: 2단계 인증(2FA) 설정 강화', status: 'Success', failureReason: null, timestamp: '2023-10-25 10:00:00' },
        { key: '24', admin: 'admin01', ipAddress: '192.168.1.10', location: '콘텐츠 관리 > 메타데이터 관리', action: 'UPDATE: 메타데이터 필드 유효성 검사 실패', status: 'Failed', failureReason: '데이터 타입 불일치', timestamp: '2023-10-24 15:00:20' },
    ];

    const processedData = useMemo(() => {
        let data = rawData.map(item => {
            const [actionType, ...actionDetailParts] = item.action.split(': ');
            return {
                ...item,
                actionType,
                actionDetail: actionDetailParts.join(': '),
            };
        });

        if (filters.admin) {
            data = data.filter(item => item.admin.toLowerCase().includes(filters.admin.toLowerCase()));
        }
        if (filters.actionType) {
            data = data.filter(item => item.actionType === filters.actionType);
        }
        if (filters.location) {
            data = data.filter(item => item.location.toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.status) {
            data = data.filter(item => item.status === filters.status);
        }
        if (filters.dateRange) {
            const [start, end] = filters.dateRange;
            data = data.filter(item => {
                const itemDate = new Date(item.timestamp);
                return itemDate >= start && itemDate <= end;
            });
        }

        return data;
    }, [filters, rawData]);

    return (
        <div>
            <Title level={2}>관리자 활동 내역</Title>
            <p>관리자들의 CRUD 활동 기록을 검색하고 확인할 수 있습니다.</p>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col>
                    <Input placeholder="관리자 검색" value={filters.admin} onChange={e => handleFilterChange('admin', e.target.value)} />
                </Col>
                <Col>
                    <Select placeholder="활동 유형" style={{ width: 120 }} value={filters.actionType} onChange={value => handleFilterChange('actionType', value)} allowClear>
                        <Option value="CREATE">CREATE</Option>
                        <Option value="UPDATE">UPDATE</Option>
                        <Option value="DELETE">DELETE</Option>
                    </Select>
                </Col>
                <Col>
                    <Select placeholder="상태" style={{ width: 120 }} value={filters.status} onChange={value => handleFilterChange('status', value)} allowClear>
                        <Option value="Success">Success</Option>
                        <Option value="Failed">Failed</Option>
                    </Select>
                </Col>
                <Col>
                    <RangePicker value={filters.dateRange} onChange={dates => handleFilterChange('dateRange', dates)} />
                </Col>
                <Col>
                    <Button icon={<SyncOutlined />} onClick={resetFilters}>초기화</Button>
                </Col>
            </Row>

            <Table columns={columns} dataSource={processedData} />
        </div>
    );
};

export default AdminActivityLog;
