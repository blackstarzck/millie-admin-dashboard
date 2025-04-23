import React, { useState } from 'react';
import {
    Typography,
    Form,
    Select,
    DatePicker,
    Button,
    Table,
    Space,
    Card,
    message
} from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const ReportGeneration = () => {
  const [form] = Form.useForm();
  const [isGenerating, setIsGenerating] = useState(false);

  // 예시 생성된 리포트 목록
  const [generatedReports, setGeneratedReports] = useState([
    { key: 'rep001', id: 'rep001', type: '사용자 통계 요약', period: '2024-07-01 ~ 2024-07-26', generatedDate: '2024-07-26 11:00', downloadLink: '/reports/user_summary_20240726.xlsx' },
    { key: 'rep002', id: 'rep002', type: '콘텐츠별 상세 분석', period: '2024-06-01 ~ 2024-06-30', generatedDate: '2024-07-01 09:30', downloadLink: '/reports/content_detail_202406.pdf' },
  ]);

  // AntD Form의 onFinish 핸들러
  const handleGenerateReport = (values) => {
    const { reportType, dateRange } = values;
    if (!dateRange || dateRange.length < 2) {
      message.warning('리포트 생성 기간을 선택해주세요.');
      return;
    }
    const startDate = dateRange[0].format('YYYY-MM-DD');
    const endDate = dateRange[1].format('YYYY-MM-DD');

    setIsGenerating(true);
    console.log('Generating report:', { reportType, startDate, endDate });

    // 실제 리포트 생성 로직 (비동기 처리 필요)
    // 예시: 2초 후 완료되었다고 가정하고 목록에 추가
    setTimeout(() => {
      // 실제로는 API 호출 후 결과로 리포트 정보를 받아옴
      const reportTypeMap = {
        user_summary: '사용자 통계 요약',
        content_detail: '콘텐츠별 상세 분석',
        campaign_performance: '캠페인 성과'
      };
      const newReport = {
        key: `rep${(Math.random() * 1000).toFixed(0)}`,
        id: `rep${(Math.random() * 1000).toFixed(0)}`,
        type: `${reportTypeMap[reportType] || reportType}`,
        period: `${startDate} ~ ${endDate}`,
        generatedDate: new Date().toLocaleString(),
        downloadLink: `/reports/${reportType}_${startDate}_${endDate}.pdf` // 예시 링크
      };
      setGeneratedReports([newReport, ...generatedReports]);
      setIsGenerating(false);
      message.success('리포트 생성이 완료되었습니다.');
      // form.resetFields(); // 필요시 폼 초기화
    }, 2000);
  };

  // 생성된 리포트 목록 테이블 컬럼 정의
  const reportColumns = [
    { title: '리포트 ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '종류', dataIndex: 'type', key: 'type' },
    { title: '기간', dataIndex: 'period', key: 'period' },
    { title: '생성일시', dataIndex: 'generatedDate', key: 'generatedDate' },
    {
      title: '관리',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Button 
          icon={<DownloadOutlined />} 
          href={record.downloadLink} 
          download
          target="_blank"
          rel="noopener noreferrer"
        >
          다운로드
        </Button>
        // 삭제 버튼 등 추가 가능
        // <Button danger icon={<DeleteOutlined />} style={{ marginLeft: 8 }} />
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>데이터 리포트 생성</Title>

      {/* 리포트 생성 폼 */}
      <Card title="새 리포트 생성">
          <Form
              form={form}
              layout="vertical"
              onFinish={handleGenerateReport}
              initialValues={{ reportType: 'user_summary' }}
           >
            <Form.Item
              name="reportType"
              label="리포트 종류"
              rules={[{ required: true, message: '리포트 종류를 선택해주세요.' }]}
            >
              <Select placeholder="리포트 종류 선택">
                <Option value="user_summary">사용자 통계 요약</Option>
                <Option value="content_detail">콘텐츠별 상세 분석</Option>
                <Option value="campaign_performance">캠페인 성과</Option>
                {/* 다른 리포트 종류 추가 */}
              </Select>
            </Form.Item>

            <Form.Item
              name="dateRange"
              label="기간 선택"
              rules={[{ required: true, message: '기간을 선택해주세요.' }]}
            >
               <RangePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isGenerating}>
                {isGenerating ? '리포트 생성 중...' : '리포트 생성 요청'}
              </Button>
            </Form.Item>
          </Form>
      </Card>

      {/* 생성된 리포트 목록 */}
       <Card title="생성된 리포트 목록">
         <Table
           columns={reportColumns}
           dataSource={generatedReports}
           rowKey="key"
           pagination={{ pageSize: 10 }}
         />
       </Card>
    </Space>
  );
};

export default ReportGeneration; 