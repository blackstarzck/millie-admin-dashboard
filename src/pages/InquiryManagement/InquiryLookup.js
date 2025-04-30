import React, { useState } from 'react';
import {
  Table, 
  Input, 
  Select, 
  Button, 
  Space, 
  Typography, 
  Tag,
  Modal,
  Form,
  Input as AntInput 
} from 'antd';

const { TextArea } = AntInput;

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const InquiryLookup = () => {
  // 예시 데이터를 상태로 관리
  const [inquiries, setInquiries] = useState([
    { key: 'inq001', id: 'inq001', category: '결제', title: '결제가 제대로 안됩니다.', user: 'user001', date: '2024-07-26', status: '답변대기', content: '사이트에서 결제를 시도하는데 계속 오류가 발생합니다. 확인 부탁드립니다.' },
    { key: 'inq002', id: 'inq002', category: '계정', title: '비밀번호를 잊어버렸어요.', user: 'user008', date: '2024-07-25', status: '답변완료', content: '로그인 페이지에서 비밀번호 찾기 기능을 이용해도 이메일이 오지 않습니다.', response: '비밀번호 찾기 시 스팸 메일함도 확인 부탁드립니다. 계속 문제가 발생하면 다시 문의해주세요.' },
    { key: 'inq003', id: 'inq003', category: '콘텐츠', title: '오류가 있는 것 같습니다.', user: 'user015', date: '2024-07-25', status: '답변대기', content: '특정 강의 영상 재생 시 화면이 검게 나옵니다.' },
    // ... 더 많은 문의 데이터
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 상태
  const [selectedInquiry, setSelectedInquiry] = useState(null); // 선택된 문의 상태
  const [responseText, setResponseText] = useState(''); // 답변 내용 상태
  const [form] = Form.useForm(); // Form 인스턴스 생성

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = (
      inq.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.user.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'pending' && inq.status === '답변대기') || 
                          (filterStatus === 'completed' && inq.status === '답변완료');
    return matchesSearch && matchesStatus;
  });

  // AntD Table 컬럼 정의
  const columns = [
    { title: '문의 ID', dataIndex: 'id', key: 'id' },
    { title: '카테고리', dataIndex: 'category', key: 'category' },
    { title: '제목', dataIndex: 'title', key: 'title' },
    { title: '문의자', dataIndex: 'user', key: 'user' },
    { title: '문의일', dataIndex: 'date', key: 'date' },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === '답변대기' ? 'warning' : 'success'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: '답변 대기', value: '답변대기' },
        { text: '답변 완료', value: '답변완료' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showModal(record)}>
          상세/답변
        </Button>
      ),
    },
  ];

  // 모달 표시 함수
  const showModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponseText(inquiry.response || ''); // 기존 답변이 있으면 표시
    form.setFieldsValue({ response: inquiry.response || '' }); // Form 필드 초기화
    setIsModalVisible(true);
  };

  // 모달 확인(답변 저장) 함수
  const handleOk = async () => {
    try {
      // Form 유효성 검사 (필요 시)
      // await form.validateFields(); 

      console.log('답변 저장:', selectedInquiry.id, responseText);
      // 실제 API 호출 로직 (추후 구현)

      // 상태 업데이트 (클라이언트 측)
      const updatedInquiries = inquiries.map(inq =>
        inq.key === selectedInquiry.key
          ? { ...inq, status: '답변완료', response: responseText }
          : inq
      );
      setInquiries(updatedInquiries);

      setIsModalVisible(false);
      setSelectedInquiry(null);
      setResponseText('');
      form.resetFields(); // 폼 초기화
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  // 모달 취소 함수
  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedInquiry(null);
    setResponseText('');
    form.resetFields(); // 폼 초기화
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={4}>문의사항 조회</Title>

      {/* 검색 및 필터링 */}
      <Space wrap>
        <Search
          placeholder="제목 또는 사용자 ID 검색..."
          allowClear
          onSearch={setSearchTerm}
          onChange={(e) => !e.target.value && setSearchTerm('')} // Clear 버튼 클릭 시 검색어 초기화
          style={{ width: 300 }}
        />
        <Select 
          defaultValue="all" 
          style={{ width: 150 }} 
          onChange={setFilterStatus}
        >
          <Option value="all">전체 상태</Option>
          <Option value="pending">답변 대기</Option>
          <Option value="completed">답변 완료</Option>
        </Select>
        {/* 추가 필터 (예: 카테고리) */} 
        {/* <Select placeholder="카테고리 선택" style={{ width: 150 }} allowClear> ... </Select> */}
      </Space>

      {/* 문의 목록 테이블 */}
      <Table 
        columns={columns} 
        dataSource={filteredInquiries} 
        rowKey="key" // 각 행의 고유 key 설정
        pagination={{ pageSize: 10 }} // 페이지네이션 설정
      />

      {/* 문의 상세/답변 모달 */}
      {selectedInquiry && (
        <Modal
          title={`문의 상세 정보 (ID: ${selectedInquiry.id})`}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="답변 저장"
          cancelText="취소"
          width={600} // 모달 너비 조정
        >
          <Form form={form} layout="vertical">
            <p><strong>카테고리:</strong> {selectedInquiry.category}</p>
            <p><strong>문의자:</strong> {selectedInquiry.user}</p>
            <p><strong>문의일:</strong> {selectedInquiry.date}</p>
            <p><strong>제목:</strong> {selectedInquiry.title}</p>
            <p><strong>내용:</strong></p>
            <p style={{ whiteSpace: 'pre-wrap', background: '#f5f5f5', padding: '10px', borderRadius: '4px', minHeight: '60px' }}>
              {selectedInquiry.content || '내용 없음'}
            </p>
            <Form.Item
              name="response"
              label="답변 작성"
              rules={[{ required: selectedInquiry.status === '답변대기', message: '답변 내용을 입력해주세요.' }]}
            >
              <TextArea
                rows={4}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="답변 내용을 입력하세요..."
                disabled={selectedInquiry.status === '답변완료'} // 답변 완료 시 비활성화
              />
            </Form.Item>
             {selectedInquiry.status === '답변완료' && selectedInquiry.response && (
              <>
                <p><strong>기존 답변 내용:</strong></p>
                 <p style={{ whiteSpace: 'pre-wrap', background: '#e6f7ff', padding: '10px', borderRadius: '4px' }}>
                  {selectedInquiry.response}
                </p>
              </>
            )}
          </Form>
        </Modal>
      )}
    </Space>
  );
};

export default InquiryLookup; 