import React, { useState } from 'react';
import { Select, Table, Typography, Card, Row, Col, Space, DatePicker } from 'antd';
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Example using recharts

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const EventAnalysis = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // 예시 데이터
  const eventStats = [
    { eventId: 'evt001', eventTitle: '여름맞이 특별 할인', participants: 1250, conversionRate: '15.5%', cost: 500000, roi: '250%' },
    { eventId: 'evt002', eventTitle: '신규 가입자 웰컴 이벤트', participants: 850, conversionRate: '22.0%', cost: 200000, roi: '400%' },
    { eventId: 'evt003', eventTitle: '친구 추천 이벤트', participants: 2100, conversionRate: '10.2%', cost: 350000, roi: '310%' },
  ];

  // Recharts 사용 예시 데이터 (주석 처리)
  /*
  const participationData = [
    { date: '07-15', count: 100 }, { date: '07-16', count: 150 }, { date: '07-17', count: 120 }, // ...
  ];
  */

  const handleEventChange = (value) => {
    setSelectedEvent(value);
    // TODO: 선택된 이벤트에 대한 상세 데이터 로드 로직 추가
    console.log('Selected Event:', value);
  };

  const handleDateChange = (dates, dateStrings) => {
    setDateRange(dateStrings);
    // TODO: 날짜 범위에 따른 데이터 필터링 로직 추가
    console.log('Selected Date Range:', dateStrings);
  };

  const columns = [
    {
      title: '이벤트 ID',
      dataIndex: 'eventId',
      key: 'eventId',
    },
    {
      title: '이벤트명',
      dataIndex: 'eventTitle',
      key: 'eventTitle',
    },
    {
      title: '총 참여자 수',
      dataIndex: 'participants',
      key: 'participants',
      render: (text) => text.toLocaleString(),
      sorter: (a, b) => a.participants - b.participants,
    },
    {
      title: '전환율',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      sorter: (a, b) => parseFloat(a.conversionRate) - parseFloat(b.conversionRate),
    },
    {
      title: '소요 비용 (원)',
      dataIndex: 'cost',
      key: 'cost',
      render: (text) => text.toLocaleString(),
      sorter: (a, b) => a.cost - b.cost,
    },
    {
      title: 'ROI',
      dataIndex: 'roi',
      key: 'roi',
      sorter: (a, b) => parseFloat(a.roi) - parseFloat(b.roi),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>이벤트 효과 분석</Title>

      <Card title="분석 조건 설정">
        <Row gutter={16}>
          <Col span={12}>
            <Space>
              <Text>기간 선택:</Text>
              <RangePicker onChange={handleDateChange} />
            </Space>
          </Col>
          <Col span={12}>
            <Space>
              <Text>특정 이벤트 분석:</Text>
              <Select
                style={{ width: 250 }}
                placeholder="-- 이벤트 선택 --"
                onChange={handleEventChange}
                allowClear
              >
                {eventStats.map(evt => (
                  <Select.Option key={evt.eventId} value={evt.eventId}>{evt.eventTitle}</Select.Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {selectedEvent && (
        <Card title={`${eventStats.find(e => e.eventId === selectedEvent)?.eventTitle} 상세 분석`}>
          <Row gutter={16}>
            <Col span={24}>
              {/* 여기에 선택된 이벤트의 상세 데이터(일별 참여 추이 등) 차트 표시 */}
              <div style={{ height: 300, marginTop: '1rem', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Text type="secondary">(선택된 이벤트의 상세 분석 차트 영역)</Text>
              </div>
              {/* Recharts 사용 예시 (주석 처리) */}
              {/*
              <div style={{ height: 300, marginTop: '1rem' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={participationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" name="일별 참여자 수" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              */}
            </Col>
            {/* 추가적인 상세 분석 컴포넌트 (예: 주요 지표 카드) */}
          </Row>
        </Card>
      )}

      <Card title="이벤트별 종합 통계">
        <Table
          columns={columns}
          dataSource={eventStats} // TODO: 필터링된 데이터로 교체
          rowKey="eventId"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </Space>
  );
};

export default EventAnalysis; 