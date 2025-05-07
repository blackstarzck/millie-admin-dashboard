import React, { useState } from "react";
import {
  Typography,
  Table,
  Button,
  Space,
  Switch,
  Popconfirm,
  Card,
  message,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Divider,
  Tag,
  Tooltip,
  InputNumber,
  Collapse,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

const InquiryFiltering = () => {
  const [filters, setFilters] = useState([
    {
      key: "filter01",
      id: "filter01",
      name: "결제 오류 문의 자동 분류",
      condition: "title contains '결제 오류'",
      action: "Assign to Manager",
      actionDetail: "김지원",
      priority: 1,
      isActive: true,
      description: "결제 관련 문의를 자동으로 담당자에게 배정합니다.",
      conditions: [
        { field: "title", operator: "contains", value: "결제 오류" },
      ],
      history: [
        {
          inquiryId: "INQ001",
          title: "결제가 안되는데 어떻게 해야하나요?",
          matchedAt: "2024-03-20 14:30:00",
          assignedTo: "김지원",
          status: "답변완료",
        },
        {
          inquiryId: "INQ002",
          title: "결제 오류 발생했습니다",
          matchedAt: "2024-03-20 15:45:00",
          assignedTo: "김지원",
          status: "답변대기",
        },
      ],
    },
    {
      key: "filter02",
      id: "filter02",
      name: "긴급 키워드 포함 시 우선순위 높음",
      condition: "content contains '긴급' or content contains '장애'",
      action: "Set Priority High",
      priority: 2,
      isActive: true,
      description: "긴급 또는 장애 관련 문의의 우선순위를 높게 설정합니다.",
      conditions: [
        { field: "content", operator: "contains", value: "긴급" },
        { field: "content", operator: "contains", value: "장애" },
      ],
      history: [
        {
          inquiryId: "INQ003",
          title: "서비스 장애 발생",
          matchedAt: "2024-03-20 16:20:00",
          status: "답변대기",
          priority: "높음",
        },
      ],
    },
    {
      key: "filter03",
      id: "filter03",
      name: "스팸 메일 필터링",
      condition: "sender email matches regex /.*@spamdomain.com/",
      action: "Mark as Spam",
      priority: 3,
      isActive: false,
      description: "스팸 도메인에서 온 문의를 자동으로 스팸으로 표시합니다.",
      conditions: [
        {
          field: "sender_email",
          operator: "matches",
          value: "/.*@spamdomain\\.com/",
        },
      ],
      history: [
        {
          inquiryId: "INQ004",
          title: "광고 문의",
          matchedAt: "2024-03-20 17:00:00",
          status: "스팸처리",
        },
      ],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFilter, setEditingFilter] = useState(null);
  const [form] = Form.useForm();
  const [previewData, setPreviewData] = useState(null);

  // 필터링 이력 모달 상태
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [selectedFilterHistory, setSelectedFilterHistory] = useState(null);

  // 필터 규칙 추가/수정 모달 관련 함수들
  const showModal = (filter = null) => {
    setEditingFilter(filter);
    if (filter) {
      form.setFieldsValue({
        ...filter,
        conditions: filter.conditions || [
          { field: "", operator: "", value: "" },
        ],
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        priority: filters.length + 1,
        conditions: [{ field: "", operator: "", value: "" }],
      });
    }
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingFilter(null);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const newFilter = {
        key: editingFilter?.key || `filter${Date.now()}`,
        id: editingFilter?.id || `filter${Date.now()}`,
        ...values,
        isActive: editingFilter?.isActive ?? true,
      };

      if (editingFilter) {
        setFilters(
          filters.map((f) => (f.id === editingFilter.id ? newFilter : f))
        );
        message.success("필터 규칙이 수정되었습니다.");
      } else {
        setFilters([...filters, newFilter]);
        message.success("새 필터 규칙이 추가되었습니다.");
      }

      setIsModalVisible(false);
      setEditingFilter(null);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // 필터 규칙 활성화/비활성화
  const handleToggleActive = (filterId, checked) => {
    setFilters(
      filters.map((f) => (f.id === filterId ? { ...f, isActive: checked } : f))
    );
    message.success(
      `필터 규칙이 ${checked ? "활성화" : "비활성화"}되었습니다.`
    );
  };

  // 필터 규칙 삭제
  const handleDeleteFilter = (filterId) => {
    setFilters(filters.filter((f) => f.id !== filterId));
    message.success("필터 규칙이 삭제되었습니다.");
  };

  // 우선순위 변경
  const handlePriorityChange = (filterId, direction) => {
    const currentIndex = filters.findIndex((f) => f.id === filterId);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === filters.length - 1)
    )
      return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const newFilters = [...filters];
    [newFilters[currentIndex], newFilters[newIndex]] = [
      newFilters[newIndex],
      newFilters[currentIndex],
    ];

    setFilters(newFilters.map((f, index) => ({ ...f, priority: index + 1 })));
    message.success("우선순위가 변경되었습니다.");
  };

  // 필터 규칙 미리보기
  const handlePreview = (filter) => {
    setPreviewData(filter);
  };

  // 필터링 이력 조회
  const handleViewHistory = (filter) => {
    setSelectedFilterHistory(filter);
    setHistoryModalVisible(true);
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      title: "우선순위",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (priority, record) => (
        <Space>
          <Button
            size="small"
            icon={<ArrowUpOutlined />}
            onClick={() => handlePriorityChange(record.id, "up")}
            disabled={priority === 1}
          />
          <Button
            size="small"
            icon={<ArrowDownOutlined />}
            onClick={() => handlePriorityChange(record.id, "down")}
            disabled={priority === filters.length}
          />
          <Text>{priority}</Text>
        </Space>
      ),
    },
    {
      title: "규칙명",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Space>
          <Text>{name}</Text>
          {record.description && (
            <Tooltip title={record.description}>
              <InfoCircleOutlined />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "조건",
      dataIndex: "condition",
      key: "condition",
      render: (condition, record) => (
        <Space direction="vertical" size="small">
          {record.conditions.map((cond, index) => (
            <Tag key={index} color="blue">
              {cond.field} {cond.operator} {cond.value}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "액션",
      dataIndex: "action",
      key: "action",
      render: (action, record) => (
        <Space direction="vertical" size="small">
          <Tag color="green">{action}</Tag>
          {record.actionDetail && (
            <Text type="secondary">담당자: {record.actionDetail}</Text>
          )}
        </Space>
      ),
    },
    {
      title: "활성 상태",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      align: "center",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(record.id, checked)}
        />
      ),
    },
    {
      title: "관리",
      key: "actionButtons",
      width: 250,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handlePreview(record)}
          >
            미리보기
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            수정
          </Button>
          <Button
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => handleViewHistory(record)}
          >
            이력
          </Button>
          <Popconfirm
            title="정말로 이 필터 규칙을 삭제하시겠습니까?"
            onConfirm={() => handleDeleteFilter(record.id)}
            okText="삭제"
            cancelText="취소"
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Title level={4}>문의사항 필터링/분류 규칙</Title>
      <Paragraph>
        접수되는 문의사항을 자동으로 분류하거나 특정 조건을 만족할 때 액션을
        수행하는 규칙을 설정합니다.
        <br />
        <Text type="secondary">
          • 우선순위가 높은 규칙이 먼저 적용됩니다.
          <br />
          • 여러 조건을 조합하여 복잡한 규칙을 만들 수 있습니다.
          <br />• 규칙 추가/수정 시 미리보기로 적용 결과를 확인할 수 있습니다.
        </Text>
      </Paragraph>

      <Card>
        <div style={{ marginBottom: 16, textAlign: "right" }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            새 필터 규칙 추가
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={filters}
          rowKey="key"
          pagination={{ pageSize: 10 }}
          rowClassName={(record) => (!record.isActive ? "disabled-row" : "")}
        />
      </Card>

      {/* 필터 규칙 추가/수정 모달 */}
      <Modal
        title={editingFilter ? "필터 규칙 수정" : "새 필터 규칙 추가"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            priority: filters.length + 1,
            conditions: [{ field: "", operator: "", value: "" }],
          }}
        >
          <Form.Item
            name="name"
            label="규칙명"
            rules={[{ required: true, message: "규칙명을 입력해주세요." }]}
          >
            <Input placeholder="예: 결제 오류 문의 자동 분류" />
          </Form.Item>

          <Form.Item name="description" label="설명">
            <TextArea
              rows={2}
              placeholder="이 규칙의 목적과 동작 방식을 설명해주세요."
            />
          </Form.Item>

          <Form.Item
            name="priority"
            label="우선순위"
            rules={[{ required: true, message: "우선순위를 입력해주세요." }]}
          >
            <InputNumber min={1} max={filters.length + 1} />
          </Form.Item>

          <Form.List name="conditions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "field"]}
                      rules={[
                        { required: true, message: "필드를 선택해주세요." },
                      ]}
                    >
                      <Select style={{ width: 120 }} placeholder="필드">
                        <Option value="title">제목</Option>
                        <Option value="content">내용</Option>
                        <Option value="sender_email">발신자 이메일</Option>
                        <Option value="category">카테고리</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "operator"]}
                      rules={[
                        { required: true, message: "연산자를 선택해주세요." },
                      ]}
                    >
                      <Select style={{ width: 120 }} placeholder="연산자">
                        <Option value="contains">포함</Option>
                        <Option value="equals">일치</Option>
                        <Option value="matches">정규식</Option>
                        <Option value="starts_with">시작</Option>
                        <Option value="ends_with">끝남</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "value"]}
                      rules={[
                        { required: true, message: "값을 입력해주세요." },
                      ]}
                    >
                      <Input placeholder="값" />
                    </Form.Item>
                    {fields.length > 1 && (
                      <Button type="link" onClick={() => remove(name)}>
                        삭제
                      </Button>
                    )}
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    조건 추가
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Form.Item
            name="action"
            label="액션"
            rules={[{ required: true, message: "액션을 선택해주세요." }]}
          >
            <Select
              placeholder="액션 선택"
              onChange={(value) => {
                if (value === "Assign to Manager") {
                  form.setFieldsValue({ actionDetail: "" });
                } else {
                  form.setFieldsValue({ actionDetail: undefined });
                }
              }}
            >
              <Option value="Assign to Manager">담당자 배정</Option>
              <Option value="Set Priority High">우선순위 높게</Option>
              <Option value="Set Priority Low">우선순위 낮게</Option>
              <Option value="Mark as Spam">스팸으로 표시</Option>
              <Option value="Auto Reply">자동 답변</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.action !== currentValues.action
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("action") === "Assign to Manager" ? (
                <Form.Item
                  name="actionDetail"
                  label="담당자"
                  rules={[
                    { required: true, message: "담당자를 선택해주세요." },
                  ]}
                >
                  <Select placeholder="담당자 선택">
                    <Option value="김지원">김지원</Option>
                    <Option value="이수진">이수진</Option>
                    <Option value="박민준">박민준</Option>
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>
        </Form>
      </Modal>

      {/* 필터 규칙 미리보기 모달 */}
      <Modal
        title="필터 규칙 미리보기"
        open={!!previewData}
        onCancel={() => setPreviewData(null)}
        footer={null}
      >
        {previewData && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="규칙명">
                {previewData.name}
              </Descriptions.Item>
              <Descriptions.Item label="설명">
                {previewData.description || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="우선순위">
                {previewData.priority}
              </Descriptions.Item>
              <Descriptions.Item label="조건">
                {previewData.conditions.map((cond, index) => (
                  <Tag key={index} color="blue">
                    {cond.field} {cond.operator} {cond.value}
                  </Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="액션">
                <Tag color="green">{previewData.action}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="활성 상태">
                <Switch checked={previewData.isActive} disabled />
              </Descriptions.Item>
            </Descriptions>
          </Space>
        )}
      </Modal>

      {/* 필터링 이력 모달 */}
      <Modal
        title={`${selectedFilterHistory?.name} - 필터링 이력`}
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedFilterHistory && (
          <Table
            columns={[
              {
                title: "문의 ID",
                dataIndex: "inquiryId",
                key: "inquiryId",
                width: 100,
              },
              {
                title: "제목",
                dataIndex: "title",
                key: "title",
              },
              {
                title: "필터링 일시",
                dataIndex: "matchedAt",
                key: "matchedAt",
                width: 150,
              },
              {
                title: "담당자",
                dataIndex: "assignedTo",
                key: "assignedTo",
                width: 100,
                render: (text) => text || "-",
              },
              {
                title: "상태",
                dataIndex: "status",
                key: "status",
                width: 100,
                render: (status) => {
                  const color =
                    {
                      답변완료: "success",
                      답변대기: "warning",
                      스팸처리: "error",
                    }[status] || "default";
                  return <Tag color={color}>{status}</Tag>;
                },
              },
              {
                title: "우선순위",
                dataIndex: "priority",
                key: "priority",
                width: 100,
                render: (priority) =>
                  priority ? <Tag color="red">{priority}</Tag> : "-",
              },
            ]}
            dataSource={selectedFilterHistory.history}
            rowKey="inquiryId"
            pagination={{ pageSize: 5 }}
          />
        )}
      </Modal>

      {/* 비활성 행 스타일 */}
      <style>{`
        .disabled-row td {
          color: rgba(0, 0, 0, 0.25);
        }
        .disabled-row .ant-tag {
          background-color: #f5f5f5;
          border-color: #d9d9d9;
          color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </Space>
  );
};

export default InquiryFiltering;
