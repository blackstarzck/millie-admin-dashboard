import React, { useState } from "react";
import moment from "moment";
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
  Input as AntInput,
  Descriptions,
  Divider,
  Image,
} from "antd";
import { PaperClipOutlined } from "@ant-design/icons";

const { TextArea } = AntInput;
const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const InquiryLookup = () => {
  // 예시 데이터를 상태로 관리
  const [inquiries, setInquiries] = useState([
    {
      key: "inq001",
      id: "inq001",
      category: "결제",
      title: "결제가 제대로 안됩니다.",
      user: "user001",
      date: "2024-07-26T10:00:00Z",
      status: "답변대기",
      content:
        "사이트에서 결제를 시도하는데 계속 오류가 발생합니다. 확인 부탁드립니다.",
      inquiryEmail: "help@example.com",
      phoneNumber: "010-1234-5678",
      attachments: [
        { name: "결제오류_스크린샷.png", url: "#" },
        { name: "결제내역.pdf", url: "#" },
      ],
      responseDate: null,
      respondedBy: null,
    },
    {
      key: "inq002",
      id: "inq002",
      category: "계정",
      title: "비밀번호를 잊어버렸어요.",
      user: "user008",
      date: "2024-07-25T14:30:00Z",
      status: "답변완료",
      content:
        "로그인 페이지에서 비밀번호 찾기 기능을 이용해도 이메일이 오지 않습니다.",
      response:
        "비밀번호 찾기 시 스팸 메일함도 확인 부탁드립니다. 계속 문제가 발생하면 다시 문의해주세요.",
      inquiryEmail: "support@example.com",
      phoneNumber: "010-9876-5432",
      attachments: [],
      responseDate: "2024-07-26T09:00:00Z",
      respondedBy: "김지원",
    },
    {
      key: "inq003",
      id: "inq003",
      category: "콘텐츠",
      title: "오류가 있는 것 같습니다.",
      user: "user015",
      date: "2024-07-25T11:20:00Z",
      status: "답변대기",
      content: "특정 강의 영상 재생 시 화면이 검게 나옵니다.",
      inquiryEmail: "contact@example.com",
      phoneNumber: "010-5555-6666",
      attachments: [{ name: "화면오류.mp4", url: "#" }],
      responseDate: null,
      respondedBy: null,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [form] = Form.useForm();

  // New state for managing single image preview
  const [previewImageState, setPreviewImageState] = useState({
    visible: false,
    src: null,
    scaleStep: 0.5, // Default scale step from example
  });

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      (inq.title && inq.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inq.user && inq.user.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "pending" && inq.status === "답변대기") ||
      (filterStatus === "completed" && inq.status === "답변완료");
    return matchesSearch && matchesStatus;
  });

  // 답변 대기 건수 계산
  const pendingCount = filteredInquiries.filter(inq => inq.status === "답변대기").length;

  // 날짜만 YYYY. MM. DD. 형식으로 포맷하는 함수
  const formatDateOnly = (dateString) => {
    if (!dateString) return "-";
    return moment(dateString).format("YYYY. MM. DD.");
  };

  // 시간만 HH:mm:ss 형식으로 포맷하는 함수
  const formatTimeOnly = (dateString) => {
    if (!dateString) return "";
    return moment(dateString).format("HH:mm:ss");
  };

  const columns = [
    {
      title: "문의 ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      ellipsis: true,
    },
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
    },
    {
      title: "카테고리",
      dataIndex: "category",
      key: "category",
      width: 100,
      ellipsis: true,
    },
    {
      title: "문의자",
      dataIndex: "user",
      key: "user",
      width: 100,
      ellipsis: true,
    },
    {
      title: "문의 이메일",
      dataIndex: "inquiryEmail",
      key: "inquiryEmail",
      render: (email) => email || "-",
      width: 150,
      ellipsis: true,
    },
    {
      title: "연락처",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phone) => phone || "-",
      width: 120,
      ellipsis: true,
    },
    {
      title: "문의일",
      dataIndex: "date",
      key: "date",
      width: 180,
      ellipsis: true,
      render: (dateString, record) => {
        if (!dateString) return "-";
        const datePart = formatDateOnly(dateString);
        const timePart = formatTimeOnly(dateString);

        return (
          <>
            {datePart}
            {timePart && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "0.85em" }}>
                  {timePart}
                </Text>
              </>
            )}
          </>
        );
      },
    },
    {
      title: "답변완료일",
      dataIndex: "responseDate",
      key: "responseDate",
      width: 180,
      render: (responseDateString, record) => {
        if (!responseDateString) return "-";

        const datePart = formatDateOnly(responseDateString);
        const timePart = formatTimeOnly(responseDateString);

        return (
          <>
            {datePart}
            {timePart && (
              <>
                <br />
                <Text type="secondary" style={{ fontSize: "0.85em" }}>
                  {timePart}
                </Text>
              </>
            )}
          </>
        );
      },
      ellipsis: true,
    },
    {
      title: "첨부파일",
      key: "attachments",
      width: 100,
      ellipsis: true,
      render: (_, record) =>
        record.attachments && record.attachments.length > 0 ? (
          <Tag icon={<PaperClipOutlined />} color="blue">
            {record.attachments.length}개
          </Tag>
        ) : (
          "-"
        ),
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 100,
      ellipsis: true,
      render: (status) => (
        <Tag color={status === "답변대기" ? "warning" : "success"}>
          {status}
        </Tag>
      ),
      filters: [
        { text: "답변 대기", value: "답변대기" },
        { text: "답변 완료", value: "답변완료" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "답변 관리자",
      dataIndex: "respondedBy",
      key: "respondedBy",
      width: 120,
      render: (admin) => admin || "-",
      ellipsis: true,
    },
  ];

  const showModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setResponseText(inquiry.response || "");
    form.setFieldsValue({ response: inquiry.response || "" });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      console.log("답변 저장:", selectedInquiry.id, responseText);

      const updatedInquiries = inquiries.map((inq) =>
        inq.key === selectedInquiry.key
          ? {
              ...inq,
              status: "답변완료",
              response: responseText,
              responseDate: new Date().toISOString(), // YYYY-MM-DD HH:mm:ss 형식
              respondedBy: "김지원", // 실제로는 로그인한 관리자 정보를 사용해야 함
            }
          : inq
      );
      setInquiries(updatedInquiries);

      setIsModalVisible(false);
      setSelectedInquiry(null);
      setResponseText("");
      form.resetFields();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedInquiry(null);
    setResponseText("");
    form.resetFields();
  };

  // Function to open image preview
  const handleShowImagePreview = (fileUrl) => {
    setPreviewImageState({
      visible: true,
      src: fileUrl,
      scaleStep: 0.5, // Reset or maintain as needed
    });
  };

  // Function to close image preview (called by Image component's onVisibleChange)
  const handlePreviewVisibleChange = (value) => {
    if (!value) { // Only act when closing
      setPreviewImageState({
        visible: false,
        src: null, // Clear src when closing
        scaleStep: 0.5,
      });
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Title level={4}>문의사항 조회</Title>

      <Text strong style={{ display: 'block' }}>
        답변 대기 중인 문의: {pendingCount} 건
      </Text>

      <Space wrap>
        <Search
          placeholder="제목 또는 사용자 ID 검색..."
          allowClear
          onSearch={setSearchTerm}
          onChange={(e) => !e.target.value && setSearchTerm("")}
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
      </Space>

      <Table
        columns={columns}
        dataSource={filteredInquiries}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1500 }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              showModal(record);
            },
            style: { cursor: 'pointer' }
          };
        }}
      />

      {selectedInquiry && (
        <Modal
          title={`문의 상세 정보 (ID: ${selectedInquiry.id})`}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText={selectedInquiry.status === "답변완료" ? "확인" : "답변 저장"}
          cancelText="취소"
          width={800}
        >
          <Form form={form} layout="vertical">
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="카테고리">
                {selectedInquiry.category}
              </Descriptions.Item>
              <Descriptions.Item label="문의자">
                {selectedInquiry.user}
              </Descriptions.Item>
              <Descriptions.Item label="문의 이메일">
                {selectedInquiry.inquiryEmail || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="연락처">
                {selectedInquiry.phoneNumber || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="문의일">
                {selectedInquiry.date ? formatDateOnly(selectedInquiry.date) : '-'}
                {selectedInquiry.date && formatTimeOnly(selectedInquiry.date) && (
                  <Text type="secondary" style={{ fontSize: "0.85em", display: 'block' }}>
                    {formatTimeOnly(selectedInquiry.date)}
                  </Text>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="제목">
                {selectedInquiry.title}
              </Descriptions.Item>
              <Descriptions.Item label="내용">
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    background: "#f5f5f5",
                    padding: "10px",
                    borderRadius: "4px",
                    minHeight: "60px",
                  }}
                >
                  {selectedInquiry.content || "내용 없음"}
                </div>
              </Descriptions.Item>
              {selectedInquiry.attachments &&
                selectedInquiry.attachments.length > 0 && (
                  <Descriptions.Item label="첨부파일">
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {selectedInquiry.attachments.map((file, index) => (
                        <Button 
                            key={index}
                            type="text" 
                            icon={<PaperClipOutlined />}
                            onClick={() => handleShowImagePreview(file.url)} // Call new handler
                            style={{ paddingLeft: 0, textAlign: 'left', display: 'block' }}
                        >
                            {file.name}
                        </Button>
                      ))}
                    </Space>
                  </Descriptions.Item>
                )}
            </Descriptions>

            <Divider />

            {selectedInquiry.status === "답변완료" ? (
              <>
                <p>
                  <strong>답변 내용:</strong>
                </p>
                <p
                  style={{
                    whiteSpace: "pre-wrap",
                    background: "#e6f7ff",
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                >
                  {selectedInquiry.response}
                </p>
                <p style={{ marginTop: "10px" }}>
                  <Text type="secondary">
                    답변일: {selectedInquiry.responseDate ? formatDateOnly(selectedInquiry.responseDate) : '-'}
                    {selectedInquiry.responseDate && formatTimeOnly(selectedInquiry.responseDate) && (
                      <Text type="secondary" style={{ fontSize: "0.85em", display: 'block' }}>
                        {formatTimeOnly(selectedInquiry.responseDate)}
                      </Text>
                    )}
                    {' | '}답변자:{" "}
                    {selectedInquiry.respondedBy}
                  </Text>
                </p>
              </>
            ) : (
              <Form.Item
                name="response"
                label="답변 작성"
                rules={[
                  {
                    required: true,
                    message: "답변 내용을 입력해주세요.",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="답변 내용을 입력하세요..."
                />
              </Form.Item>
            )}
          </Form>
        </Modal>
      )}

      {/* Hidden Image component for previewing */}
      <Image
        width={0} // Effectively hidden via style or zero dimensions
        height={0}
        style={{ display: 'none' }}
        src={previewImageState.src || ""} // Use placeholder if src is null
        preview={{
          visible: previewImageState.visible,
          scaleStep: previewImageState.scaleStep,
          src: previewImageState.src, // Explicitly set preview src
          onVisibleChange: handlePreviewVisibleChange,
        }}
      />
    </Space>
  );
};

export default InquiryLookup;
