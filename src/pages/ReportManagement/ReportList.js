import React, { useState, useEffect } from 'react';
import { Space, Typography, Card, Table, Tag, Button, Modal, Input, Select, DatePicker, message, Descriptions, Divider, Checkbox, Radio, Dropdown, Menu, Form, Tooltip } from 'antd';
import { SearchOutlined, FilterOutlined, EyeOutlined, CheckCircleOutlined, StopOutlined, WarningOutlined, EllipsisOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 가상 데이터
const initialReports = [
  { key: '1', reportId: 'RPT001', contentType: '게시글', reportedContentId: 'POST123', reportedContentPreview: '이것은 문제가 있는 게시글의 내용입니다...', reporterId: 'user001', reportedUserId: 'user002', reason: '욕설/비방', details: '심한 욕설을 사용했습니다.', reportDate: '2024-07-28 10:00:00', status: '접수', adminComment: '', notificationStatus: '미발송', processingDate: null, adminProcessorId: null, notificationSentDate: null },
  { key: '2', reportId: 'RPT002', contentType: '댓글', reportedContentId: 'CMT456', reportedContentPreview: '광고성 댓글입니다.', reporterId: 'user003', reportedUserId: 'user004', reason: '스팸/광고', details: '상품 광고 댓글입니다.', reportDate: '2024-07-27 15:30:00', status: '처리완료', adminComment: '스팸으로 확인되어 삭제 처리함.', notificationStatus: '발송 완료', processingDate: '2024-07-27 16:00', adminProcessorId: 'admin_A', notificationSentDate: '2024-07-27 16:05' },
  { key: '3', reportId: 'RPT003', contentType: '게시글', reportedContentId: 'POST789', reportedContentPreview: '부적절한 이미지 포함', reporterId: 'user005', reportedUserId: 'user001', reason: '음란물', details: '', reportDate: '2024-07-29 09:00:00', status: '확인중', adminComment: '이미지 검토 중', notificationStatus: '미발송', processingDate: '2024-07-29 11:00', adminProcessorId: 'admin_B', notificationSentDate: null },
  { key: '4', reportId: 'RPT004', contentType: '댓글', reportedContentId: 'CMT101', reportedContentPreview: '그냥 제 의견을 말했을 뿐입니다.', reporterId: 'user006', reportedUserId: 'user007', reason: '기타', details: '사용자 간의 단순 의견 충돌로 보임.', reportDate: '2024-07-26 11:00:00', status: '반려', adminComment: '신고 사유에 해당하지 않음. 문제 없음 판단.', notificationStatus: '발송 완료', processingDate: '2024-07-26 11:30', adminProcessorId: 'admin_A', notificationSentDate: '2024-07-26 11:32' },
  { key: '5', reportId: 'RPT005', contentType: '게시글', reportedContentId: 'POSTNEW01', reportedContentPreview: '새로운 처리완료, 알림 미발송 신고 (게시글)', reporterId: 'userTest1', reportedUserId: 'userReported1', reason: '기타', details: '테스트 데이터: 처리완료, 알림 미발송 상태', reportDate: '2024-08-01 14:00:00', status: '처리완료', adminComment: '관리자에 의해 처리 완료됨.', notificationStatus: '미발송', processingDate: '2024-08-01 14:10', adminProcessorId: 'admin_C', notificationSentDate: null },
  { key: '6', reportId: 'RPT006', contentType: '댓글', reportedContentId: 'CMTNEW02', reportedContentPreview: '새로운 처리완료, 알림 미발송 신고 (댓글)', reporterId: 'userTest2', reportedUserId: 'userReported2', reason: '도배', details: '테스트 데이터: 처리완료, 알림 미발송 상태 (도배성 댓글)', reportDate: '2024-08-01 15:30:00', status: '처리완료', adminComment: '도배 확인 후 조치 완료.', notificationStatus: '미발송', processingDate: '2024-08-01 15:35', adminProcessorId: 'admin_B', notificationSentDate: null },
];

const statusMap = {
  '접수': { color: 'processing', text: '접수' },
  '확인중': { color: 'warning', text: '확인 중' },
  '처리완료': { color: 'success', text: '처리 완료' },
  '반려': { color: 'error', text: '반려' },
  // 관리자 처리 액션 추가 (상태와 구분될 수 있도록)
  '콘텐츠삭제': { color: 'error', text: '콘텐츠 삭제' },
  '사용자경고': { color: 'warning', text: '사용자 경고' },
  '사용자정지': { color: 'error', text: '사용자 계정 정지' },
};

// 알림 템플릿 가상 데이터
const notificationTemplates = [
  { key: 'tpl_report_accepted_default', name: '신고 처리 완료 (기본)', content: '회원님의 신고가 정상적으로 처리되었습니다. 서비스 개선에 도움을 주셔서 감사합니다.' },
  { key: 'tpl_report_rejected_default', name: '신고 반려 안내 (기본)', content: '회원님의 신고를 검토하였으나, 서비스 운영 정책에 위반되지 않는 것으로 확인되었습니다. 참여해주셔서 감사합니다.' },
  { key: 'tpl_content_deleted', name: '콘텐츠 삭제 안내', content: '회원님의 신고 내용 확인 후 해당 콘텐츠가 삭제 처리되었습니다. 깨끗한 서비스 환경을 위해 노력하겠습니다.' },
];

const ReportList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // --- 관리자 처리 모달 관련 상태 ---
  const [processingForm] = Form.useForm(); // 관리자 처리 모달용 폼
  const [isProcessingModalVisible, setIsProcessingModalVisible] = useState(false);
  const [processingReportData, setProcessingReportData] = useState(null);

  // --- 신고자 알림 모달 관련 상태 ---
  const [notificationForm] = Form.useForm(); // 신고자 알림 모달용 폼
  const [isNotificationModalVisible, setIsNotificationModalVisible] = useState(false);
  const [notificationReportData, setNotificationReportData] = useState(null);

  useEffect(() => {
    // 템플릿 선택 시 TextArea 업데이트는 Select의 onChange에서 직접 처리
  }, [notificationForm]);

  const columns = [
    { title: '신고 ID', dataIndex: 'reportId', key: 'reportId', width: 100 },
    { title: '콘텐츠 유형', dataIndex: 'contentType', key: 'contentType', width: 100 },
    {
      title: '신고된 콘텐츠 ID',
      dataIndex: 'reportedContentId',
      key: 'reportedContentId',
      width: 120,
      render: (text, record) => {
        const path = record.contentType === '게시글' ? 'posts' : 'comments';
        // 예시 URL입니다. 실제 서비스의 URL 구조에 맞게 수정해주세요.
        const url = `/community/${path}/${record.reportedContentId}`;
        return (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()} // 행 클릭 이벤트 전파 중단
          >
            {text}
          </a>
        );
      }
    },
    { title: '신고자', dataIndex: 'reporterId', key: 'reporterId', width: 100 },
    { title: '피신고자', dataIndex: 'reportedUserId', key: 'reportedUserId', width: 100 },
    {
      title: (
        <Space>
          신고 사유
          <Tooltip title="신고 유형 보기 (신고 정책 관리 페이지로 이동)">
            <InfoCircleOutlined 
              style={{ cursor: 'pointer', color: '#1890ff' }} 
              onClick={(e) => { 
                e.stopPropagation(); // 혹시 모를 이벤트 전파 방지
                navigate('/report-settings'); // 신고 정책 관리 페이지로 이동 (경로 확인 필요)
              }}
            />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
    },
    {
      title: '신고 일시',
      dataIndex: 'reportDate',
      key: 'reportDate',
      width: 140,
      render: (text) => {
        if (typeof text === 'string' && text.length >= 16) {
          return text.substring(0, 16);
        }
        return text;
      }
    },
    {
      title: '처리 상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: status => {
        const S = statusMap[status] || { color: 'default', text: status };
        return <Tag color={S.color}>{S.text}</Tag>;
      }
    },
    {
      title: '처리 일시',
      dataIndex: 'processingDate',
      key: 'processingDate',
      width: 140,
      render: (text) => {
        if (typeof text === 'string' && text.length >= 16) {
          return text.substring(0, 16);
        } else if (text) {
            return text;
        }
        return '-';
      }
    },
    {
      title: '처리 담당자',
      dataIndex: 'adminProcessorId',
      key: 'adminProcessorId',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: '알림 상태',
      dataIndex: 'notificationStatus',
      key: 'notificationStatus',
      width: 100,
      render: (status) => {
        if (status === '발송 완료') {
          return <Tag color="success">발송 완료</Tag>;
        } else {
          return '-';
        }
      }
    },
    {
      title: '알림 발송 시간',
      dataIndex: 'notificationSentDate',
      key: 'notificationSentDate',
      width: 140,
      render: (text) => {
        if (typeof text === 'string' && text.length >= 16) {
          return text.substring(0, 16);
        } else if (text) {
            return text;
        }
        return '-';
      }
    },
    {
      title: '관리',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        const menu = (
          <Menu onClick={({ key, domEvent }) => { 
            domEvent.stopPropagation(); 
            handleMenuClick(key, record); 
          }}>
            <Menu.Item key="processReport">신고 처리</Menu.Item>
            <Menu.Item 
              key="sendNotification" 
              disabled={ 
                !(record.status === '처리완료' || record.status === '반려') ||
                record.notificationStatus === '발송 완료'
              }
            >
              알림 발송
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={['click']} onClick={(e) => e.stopPropagation()}>
            <Button type="text" icon={<EllipsisOutlined />} onClick={(e) => e.stopPropagation()} />
          </Dropdown>
        );
      },
    },
  ];

  const handleMenuClick = (key, record) => {
    if (key === 'processReport') {
      setProcessingReportData(record);
      processingForm.setFieldsValue({
        adminAction: (record.status === '처리완료' || record.status === '반려') ? record.status : '',
        adminComment: record.adminComment || ''
      });
      setIsProcessingModalVisible(true);
    } else if (key === 'sendNotification') {
      setNotificationReportData(record);
      // sendNotification 필드 제거, 나머지는 기존 로직 유지 또는 필요에 따라 수정
      const initialTemplateKey = notificationTemplates[0]?.key || 'direct_input';
      let initialContent = '';
      if (initialTemplateKey !== 'direct_input') {
        const template = notificationTemplates.find(t => t.key === initialTemplateKey);
        initialContent = template ? template.content : '';
      }
      notificationForm.setFieldsValue({
        selectedTemplateKey: initialTemplateKey,
        customNotificationContent: initialContent
      });
      setIsNotificationModalVisible(true);
    }
  };
  
  // 상세 보기 모달 (기존 handleViewDetails -> onRow click / menu click)
  const openDetailModal = (report) => {
    setSelectedReport(report);
    setIsDetailModalVisible(true);
  };

  // --- 관리자 처리 모달 로직 ---
  const handleProcessingModalOk = async () => {
    if (!processingReportData) return;

    try {
      const values = await processingForm.validateFields();
      const { adminAction, adminComment } = values;

      // 필수 처리 상태 확인
      if (!adminAction) {
        if (processingReportData.status !== '처리완료' && processingReportData.status !== '반려') {
             message.error('관리자 처리 상태를 선택해주세요.');
             return;
        } else if ((processingReportData.status === '처리완료' || processingReportData.status === '반려') && !adminAction && !adminComment) {
            message.info('변경된 내용이 없습니다.');
            setIsProcessingModalVisible(false);
            processingForm.resetFields();
            return;
        } else if ((processingReportData.status === '처리완료' || processingReportData.status === '반려') && !adminAction && adminComment !== processingReportData.adminComment) {
          // 상태 변경은 없고 코멘트만 수정된 경우 - adminAction을 기존 상태로 설정하여 코멘트만 업데이트하도록 유도
          // values.adminAction = processingReportData.status; // 이렇게 직접 수정은 validateFields 이후라 반영 안될 수 있음
          // 이 경우는 아래 finalStatus 로직에서 adminAction이 없으면 기존 status를 쓰므로 코멘트만 업데이트 됨
        }
      }

      const finalStatus = adminAction || processingReportData.status;
      message.success(`${processingReportData.reportId} 신고 건 처리가 저장되었습니다 (상태: ${finalStatus}).`);
      setReports(prev => prev.map(r => 
        r.key === processingReportData.key ? 
        { ...r, status: finalStatus, adminComment: adminComment } : // adminComment 사용
        r
      ));
      
      setIsProcessingModalVisible(false);
      setProcessingReportData(null);
      processingForm.resetFields(); // 폼 초기화
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      message.error('입력 값을 확인해주세요.');
    }
  };

  const handleProcessingModalCancel = () => {
    setIsProcessingModalVisible(false);
    setProcessingReportData(null);
    processingForm.resetFields(); // 폼 초기화
  };

  // --- 신고자 알림 모달 로직 ---
  const handleNotificationModalOk = async () => {
    if (!notificationReportData) return;
    setIsTableLoading(true);
    
    try {
      const values = await notificationForm.validateFields();
      const { selectedTemplateKey, customNotificationContent } = values;

      let notificationPayload = null;
      let newNotificationStatus = '발송 완료';

      if (!customNotificationContent || !customNotificationContent.trim()) {
        message.error('알림 내용을 입력해주세요.');
        return;
      }
      
      const selectedTemplate = notificationTemplates.find(t => t.key === selectedTemplateKey);
      notificationPayload = {
        type: selectedTemplateKey === 'direct_input' ? 'custom' : 'template',
        templateName: selectedTemplate ? selectedTemplate.name : (selectedTemplateKey === 'direct_input' ? '직접 작성' : '알 수 없음'),
        content: customNotificationContent 
      };

      console.log('알림 발송 대상 신고:', notificationReportData.reportId);
      console.log('알림 발송 (항상 true로 간주):', true);
      console.log('알림 페이로드:', notificationPayload);
      message.success(`${notificationReportData.reportId} 신고 건에 대한 알림이 발송되고 ${newNotificationStatus} 상태로 설정되었습니다.`);
      
      setReports(prevReports => prevReports.map(report => 
        report.key === notificationReportData.key 
          ? { ...report, notificationStatus: newNotificationStatus } 
          : report
      ));

      setIsNotificationModalVisible(false);
      setNotificationReportData(null);
      notificationForm.resetFields();
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
      message.error('입력 값을 확인해주세요.');
    } finally {
      setTimeout(() => {
        setIsTableLoading(false);
      }, 500);
    }
  };

  const handleNotificationModalCancel = () => {
    setIsNotificationModalVisible(false);
    setNotificationReportData(null);
    notificationForm.resetFields();
  };

  // 알림 발송 모달의 템플릿 선택 시 TextArea 업데이트 핸들러
  const handleTemplateChange = (value) => {
    if (value === 'direct_input') {
      notificationForm.setFieldsValue({ customNotificationContent: '' });
    } else {
      const template = notificationTemplates.find(t => t.key === value);
      notificationForm.setFieldsValue({ customNotificationContent: template ? template.content : '' });
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}><WarningOutlined /> 신고 접수 내역 및 심사</Title>
      <Text>사용자로부터 접수된 신고 내역을 확인하고 심사합니다.</Text>
      
      <div style={{ padding: '10px', border: '1px solid #f0f0f0', borderRadius: '4px', backgroundColor: '#fafafa', marginBottom: 16 }}>
        <Text strong>상태 안내:</Text>
        <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', listStyle: 'none' }}>
          {Object.entries(statusMap).map(([key, { color, text }]) => (
            <li key={key} style={{ marginBottom: '4px' }}>
              <Tag color={color}>{text}</Tag>
              <Text type="secondary" style={{ marginLeft: '8px' }}>
                {key === '접수' && '사용자로부터 신고가 접수되어 처리 대기 중인 상태입니다.'}
                {key === '확인중' && '관리자가 신고 내용을 확인하고 심사 중인 상태입니다.'}
                {key === '처리완료' && '신고 내용에 대한 관리자 조치가 완료된 상태입니다 (예: 콘텐츠 삭제, 사용자 제재 등).'}
                {key === '반려' && '관리자 검토 결과, 신고 내용에 문제가 없거나 조치가 불필요하다고 판단된 상태입니다.'}
              </Text>
            </li>
          ))}
        </ul>
      </div>
      
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Search placeholder="콘텐츠 ID, 사용자 ID 검색" style={{ width: 300 }} />
          <Select placeholder="상태 필터" style={{ width: 150 }} allowClear>
            {Object.entries(statusMap).map(([key, val]) => <Option key={key} value={key}>{val.text}</Option>)}
          </Select>
          <Select placeholder="신고 사유 필터" style={{ width: 180 }} allowClear>
            <Option value="욕설/비방">욕설/비방</Option>
            <Option value="스팸/광고">스팸/광고</Option>
            <Option value="음란물">음란물</Option>
            <Option value="불법정보">불법정보</Option>
            <Option value="기타">기타</Option>
          </Select>
          <RangePicker />
          <Button icon={<SearchOutlined />}>검색</Button>
        </Space>
        <Table
          columns={columns}
          dataSource={reports}
          rowKey="key"
          onRow={(record) => {
            return {
              onClick: () => openDetailModal(record),
              style: { cursor: 'pointer' } 
            };
          }}
          loading={isTableLoading}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* 상세 보기 모달 */}
      {selectedReport && (
        <Modal
          title={`신고 상세 (ID: ${selectedReport.reportId})`}
          open={isDetailModalVisible}
          onOk={() => setIsDetailModalVisible(false)}
          onCancel={() => setIsDetailModalVisible(false)}
          width={700}
          okText="확인"
          cancelText="닫기"
        >
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="신고 ID">{selectedReport.reportId}</Descriptions.Item>
            <Descriptions.Item label="신고 일시">{selectedReport.reportDate}</Descriptions.Item>
            <Descriptions.Item label="신고자 ID">{selectedReport.reporterId}</Descriptions.Item>
            <Descriptions.Item label="피신고자 ID">{selectedReport.reportedUserId}</Descriptions.Item>
            <Descriptions.Item label="콘텐츠 유형">{selectedReport.contentType}</Descriptions.Item>
            <Descriptions.Item label="신고된 콘텐츠">
              ID: {selectedReport.reportedContentId}
              <Button
                type="link"
                size="small"
                // href={`/community/${selectedReport.contentType === '게시글' ? 'posts' : 'comments'}/${selectedReport.reportedContentId}`}
                // target="_blank"
                onClick={() => message.info('원본 보기 링크 클릭됨 (구현 필요)')}
                style={{ marginLeft: '8px' }}
              >
                원본 보기
              </Button>
            </Descriptions.Item>
            <Descriptions.Item label="신고 사유">{selectedReport.reason}</Descriptions.Item>
            <Descriptions.Item label="상세 사유">{selectedReport.details || '(상세 사유 없음)'}</Descriptions.Item>
            <Descriptions.Item label="콘텐츠 내용 미리보기">
                <div style={{ whiteSpace: 'pre-wrap', maxHeight: '100px', overflowY: 'auto', background: '#fafafa', padding: '8px' }}>
                    {selectedReport.reportedContentPreview}
                </div>
            </Descriptions.Item>
            <Descriptions.Item label="현재 상태">
                <Tag color={statusMap[selectedReport.status]?.color || 'default'}>
                    {statusMap[selectedReport.status]?.text || selectedReport.status}
                </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="관리자 코멘트">{selectedReport.adminComment}</Descriptions.Item>
          </Descriptions>
        </Modal>
      )}

      {/* 관리자 처리 모달 */}
      {processingReportData && (
        <Modal
          title={`신고 처리 (ID: ${processingReportData.reportId})`}
          open={isProcessingModalVisible}
          onOk={handleProcessingModalOk}
          onCancel={handleProcessingModalCancel}
          width={600}
          okText="처리 저장"
          cancelText="취소"
          okButtonProps={{
            // disabled: (processingReportData.status === '처리완료' || processingReportData.status === '반려') && !processingForm.getFieldValue('adminAction')
            // Form의 상태에 따라 버튼 비활성화 로직이 필요하면 여기에 추가
          }}
        >
          <Form form={processingForm} layout="vertical">
            <Form.Item
              name="adminAction"
              label="관리자 처리"
              rules={processingReportData.status !== '처리완료' && processingReportData.status !== '반려' ? [{ required: true, message: '처리 상태를 선택해주세요!' }] : []}
            >
              <Select
                placeholder="처리 상태 선택"
                // style={{ width: 200, marginLeft: 8 }} // Form.Item이 label과 함께 수직 정렬하므로 margin 불필요
                disabled={processingReportData.status === '처리완료' || processingReportData.status === '반려'}
              >
                <Option value="확인중">확인 중</Option>
                <Option value="콘텐츠삭제">콘텐츠 삭제</Option>
                <Option value="사용자경고">사용자 경고</Option>
                <Option value="사용자정지">사용자 계정 정지</Option>
                <Option value="반려">반려 (문제 없음)</Option>
                <Option value="처리완료">처리 완료 (기타)</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="adminComment"
              label="관리자 코멘트"
            >
                <Input.TextArea
                  rows={3}
                  placeholder={processingReportData.status === '처리완료' || processingReportData.status === '반려' ? "이미 처리된 신고입니다. 코멘트 수정만 가능합니다." : "관리자 코멘트 (선택 사항)"}
                />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* 신고자 알림 설정 모달 (UI 변경) */}
      {notificationReportData && (
        <Modal
          title={`신고자 알림 발송 (ID: ${notificationReportData.reportId})`}
          open={isNotificationModalVisible}
          onOk={handleNotificationModalOk}
          onCancel={handleNotificationModalCancel}
          width={600}
          okText="알림 발송"
          cancelText="취소"
        >
          <Form form={notificationForm} layout="vertical" initialValues={{
            // sendNotification 제거
            selectedTemplateKey: notificationTemplates[0]?.key || 'direct_input',
            customNotificationContent: notificationTemplates[0]?.content || '' 
          }}>
            {/* sendNotification 체크박스 및 관련 Form.Item noStyle shouldUpdate 제거 */}
            {/* 항상 표시되는 알림 설정 항목들 */}
            <Form.Item 
              name="selectedTemplateKey" 
              label="알림 템플릿 또는 직접 작성"
              rules={[{ required: true, message: '템플릿을 선택하거나 직접 작성을 선택해주세요!'}]}
            >
              <Select placeholder="템플릿 선택 또는 직접 작성" style={{ width: '100%' }} onChange={handleTemplateChange}>
                {notificationTemplates.map(tpl => (
                  <Option key={tpl.key} value={tpl.key}>{tpl.name}</Option>
                ))}
                <Option key="direct_input" value="direct_input">직접 작성</Option>
              </Select>
            </Form.Item>
            
            <Form.Item 
              name="customNotificationContent" 
              label="알림 내용"
              rules={[{ required: true, message: '알림 내용을 입력해주세요!'}]}
            >
              <Input.TextArea rows={6} placeholder="알림 내용을 입력하거나 템플릿을 선택하세요..." />
            </Form.Item>

            {/* 사용자/관리자 확인 문구 */}
            <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: '16px', color: '#595959', marginBottom: '' }}>
              ※ 사용자는 발송된 알림을 알림 내역에서 확인할 수 있습니다.
            </Text>
            <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: '0px', color: '#595959', marginBottom: '16px' }}>
              ※ 관리자는 발송된 알림을 관리자 알림 내역에서 확인할 수 있습니다.
            </Text>
          </Form>
        </Modal>
      )}
    </Space>
  );
};

export default ReportList; 