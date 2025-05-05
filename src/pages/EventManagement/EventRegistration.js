import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Switch,
  Typography,
  Space,
  Card,
  message,
  Upload,
  InputNumber,
  Modal,
  Row,
  Col,
  Divider,
  Tooltip,
  List,
  Empty,
  Collapse,
  ColorPicker,
} from "antd";
import {
  CalendarOutlined,
  UploadOutlined,
  LinkOutlined,
  SendOutlined,
  EditOutlined,
  EyeOutlined,
  UpOutlined,
  DownOutlined,
  DragOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Template types and preview components
const TEMPLATE_TYPES = {
  HERO_BANNER: {
    id: "hero_banner",
    name: "히어로 배너",
    description: "전면 배너 이미지와 제목, 설명을 포함하는 템플릿",
    preview: ({ title, description, imageUrl }) => (
      <div
        style={{
          width: "100%",
          height: "300px",
          background: "#f0f0f0",
          padding: "20px",
        }}
      >
        <img
          src={imageUrl || "https://via.placeholder.com/800x300"}
          alt="Hero Banner"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
        <h2>{title || "제목"}</h2>
        <p>{description || "설명"}</p>
      </div>
    ),
    fields: [
      { name: "title", label: "제목", type: "text" },
      { name: "description", label: "설명", type: "textarea" },
      { name: "imageUrl", label: "이미지 URL", type: "text" },
    ],
  },
  PRODUCT_GRID: {
    id: "product_grid",
    name: "상품 그리드",
    description: "상품을 그리드 형태로 보여주는 템플릿",
    preview: ({ products = [] }) => (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
        }}
      >
        {products.map((_, index) => (
          <div
            key={index}
            style={{ border: "1px solid #ddd", padding: "10px" }}
          >
            <div style={{ height: "100px", background: "#f0f0f0" }}></div>
            <h3>상품 {index + 1}</h3>
          </div>
        ))}
      </div>
    ),
    fields: [
      { name: "title", label: "섹션 제목", type: "text" },
      { name: "productIds", label: "상품 ID 목록", type: "text" },
    ],
  },
  TEXT_SECTION: {
    id: "text_section",
    name: "텍스트 섹션",
    description: "텍스트와 이미지를 포함하는 섹션",
    preview: ({ title, content, imageUrl }) => (
      <div style={{ padding: "20px" }}>
        <h2>{title || "제목"}</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <p>{content || "내용"}</p>
          </div>
          {imageUrl && (
            <div style={{ width: "200px" }}>
              <img
                src={imageUrl}
                alt="Section Image"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}
        </div>
      </div>
    ),
    fields: [
      { name: "title", label: "제목", type: "text" },
      { name: "content", label: "내용", type: "textarea" },
      { name: "imageUrl", label: "이미지 URL", type: "text" },
    ],
  },
};

const TemplateSelector = ({ onSelect, onPreview }) => {
  return (
    <Card style={{ height: "100%" }}>
      <List
        size="small"
        dataSource={Object.values(TEMPLATE_TYPES)}
        renderItem={(template) => (
          <List.Item
            actions={[
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(template);
                }}
              >
                미리보기
              </Button>,
            ]}
            onClick={() => onSelect(template.id)}
            style={{ cursor: "pointer" }}
          >
            <List.Item.Meta
              title={template.name}
              description={
                <Text type="secondary" ellipsis={{ rows: 1 }}>
                  {template.description}
                </Text>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

const TemplateInputArea = ({ template, index, moveTemplate, onRemove }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TEMPLATE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TEMPLATE",
    hover: (item) => {
      if (item.index !== index) {
        moveTemplate(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        marginBottom: "8px",
      }}
    >
      <Collapse defaultActiveKey={["1"]} style={{ background: "white" }}>
        <Collapse.Panel
          key="1"
          header={
            <Space>
              <DragOutlined style={{ color: "#999" }} />
              <Text strong>{template.name}</Text>
            </Space>
          }
          extra={
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
            />
          }
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Form.Item
              name={["templates", index, "backgroundColor"]}
              label="배경색"
              initialValue="#ffffff"
            >
              <ColorPicker
                presets={[
                  {
                    label: "기본 색상",
                    colors: [
                      "#ffffff",
                      "#f5f5f5",
                      "#f0f0f0",
                      "#e6f7ff",
                      "#e6fffb",
                      "#f6ffed",
                      "#fff7e6",
                      "#fff1f0",
                    ],
                  },
                ]}
              />
            </Form.Item>
            {template.fields.map((field) => (
              <Form.Item
                key={field.name}
                name={["templates", index, "data", field.name]}
                label={field.label}
                rules={[
                  {
                    required: true,
                    message: `${field.label}을(를) 입력해주세요.`,
                  },
                ]}
              >
                {field.type === "textarea" ? (
                  <TextArea rows={4} />
                ) : field.type === "image" ? (
                  <Upload
                    listType="picture-card"
                    maxCount={1}
                    beforeUpload={() => false}
                  >
                    <Button icon={<UploadOutlined />}>이미지 업로드</Button>
                  </Upload>
                ) : (
                  <Input />
                )}
              </Form.Item>
            ))}
          </Space>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

const EventRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [eventPreviewVisible, setEventPreviewVisible] = useState(false);
  const [thumbnailFileList, setThumbnailFileList] = useState([]);

  // Sample data for target audience (replace with actual data/API)
  const userSegments = [
    { id: "all", name: "전체 사용자" },
    { id: "new", name: "신규 가입자 (최근 7일)" },
    { id: "vip", name: "VIP 등급" },
    { id: "purchase_history", name: "특정 상품 구매자" },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    message.loading({ content: "이벤트 등록 중...", key: "eventCreate" });

    const formData = {
      ...values,
      templates: selectedTemplates,
      eventId: `event_${Date.now()}`, // Generate unique event ID
    };

    if (values.eventPeriod) {
      formData.startDate = values.eventPeriod[0].toISOString();
      formData.endDate = values.eventPeriod[1].toISOString();
      delete formData.eventPeriod;
    }

    console.log("Event Form Data:", formData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      message.success({
        content: "이벤트가 성공적으로 등록되었습니다!",
        key: "eventCreate",
      });
      form.resetFields();
      setFileList([]);
      setSelectedTemplates([]);
    } catch (error) {
      console.error("Error creating event:", error);
      message.error({
        content: "이벤트 등록 중 오류가 발생했습니다.",
        key: "eventCreate",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateAdd = (templateId) => {
    const template = Object.values(TEMPLATE_TYPES).find(
      (t) => t.id === templateId
    );
    if (template) {
      const newTemplate = {
        id: template.id,
        name: template.name,
        fields: template.fields,
        data: template.fields.reduce(
          (acc, field) => ({ ...acc, [field.name]: "" }),
          {}
        ),
      };
      setSelectedTemplates((prev) => [...prev, newTemplate]);

      // Update form values to include the new template
      const currentValues = form.getFieldsValue();
      const templates = currentValues.templates || [];
      form.setFieldsValue({
        ...currentValues,
        templates: [...templates, { data: newTemplate.data }],
      });
    }
  };

  const moveTemplate = (fromIndex, toIndex) => {
    if (toIndex === -1) {
      // Remove template
      const newTemplates = [...selectedTemplates];
      newTemplates.splice(fromIndex, 1);
      setSelectedTemplates(newTemplates);

      // Update form values
      const currentValues = form.getFieldsValue();
      const templates = [...(currentValues.templates || [])];
      templates.splice(fromIndex, 1);
      form.setFieldsValue({
        ...currentValues,
        templates,
      });
    } else {
      // Reorder templates
      const newTemplates = [...selectedTemplates];
      const [movedTemplate] = newTemplates.splice(fromIndex, 1);
      newTemplates.splice(toIndex, 0, movedTemplate);
      setSelectedTemplates(newTemplates);

      // Update form values
      const currentValues = form.getFieldsValue();
      const templates = [...(currentValues.templates || [])];
      const [movedFormTemplate] = templates.splice(fromIndex, 1);
      templates.splice(toIndex, 0, movedFormTemplate);
      form.setFieldsValue({
        ...currentValues,
        templates,
      });
    }
  };

  const showPreview = (template) => {
    if (template && template.preview) {
      setPreviewTemplate(template);
      setPreviewVisible(true);
    } else {
      message.error("템플릿 미리보기를 불러올 수 없습니다.");
    }
  };

  const showEventPreview = () => {
    setEventPreviewVisible(true);
  };

  const renderTemplatePreview = () => {
    if (!previewTemplate) return null;

    try {
      return previewTemplate.preview(
        previewTemplate.fields.reduce(
          (acc, field) => ({
            ...acc,
            [field.name]: field.name,
          }),
          {}
        )
      );
    } catch (error) {
      console.error("Error rendering template preview:", error);
      return <Text type="danger">미리보기를 표시할 수 없습니다.</Text>;
    }
  };

  const renderEventPreview = () => {
    const formValues = form.getFieldsValue();
    return (
      <div style={{ padding: "20px" }}>
        <h1>{formValues.title}</h1>
        {selectedTemplates.map((template, index) => {
          const templateType = Object.values(TEMPLATE_TYPES).find(
            (t) => t.id === template.id
          );
          if (!templateType) return null;

          const templateData = formValues.templates?.[index]?.data || {};
          return (
            <div key={index} style={{ marginBottom: "40px" }}>
              {templateType.preview(templateData)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Title level={2}>
          <EditOutlined /> 이벤트 등록
        </Title>
        <Text>새로운 이벤트를 생성하고 관련 정보를 등록합니다.</Text>

        <Card>
          <Form
            form={form}
            layout="vertical"
            name="event_registration_form"
            onFinish={onFinish}
            initialValues={{
              status: "draft",
              templates: [],
            }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="title1"
                  label="제목1"
                  rules={[{ required: true, message: "제목1을 입력해주세요." }]}
                >
                  <Input placeholder="예: 여름맞이" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="title2"
                  label="제목2"
                  rules={[{ required: true, message: "제목2를 입력해주세요." }]}
                >
                  <Input placeholder="예: 특별 할인" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="title3"
                  label="제목3"
                  rules={[{ required: true, message: "제목3을 입력해주세요." }]}
                >
                  <Input placeholder="예: 이벤트" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="thumbnail"
              label="썸네일 이미지"
              rules={[
                { required: true, message: "썸네일 이미지를 등록해주세요." },
              ]}
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                fileList={thumbnailFileList}
                onChange={({ fileList: newFileList }) =>
                  setThumbnailFileList(newFileList)
                }
                beforeUpload={() => false}
              >
                {thumbnailFileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>이미지 업로드</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item
              name="eventPeriod"
              label={
                <>
                  <CalendarOutlined /> 이벤트 기간
                </>
              }
              rules={[
                { required: true, message: "이벤트 기간을 선택해주세요." },
              ]}
            >
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Divider orientation="left">이벤트 콘텐츠</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Card
                  title="템플릿 목록"
                  size="small"
                  style={{ height: "100%" }}
                >
                  <TemplateSelector
                    onSelect={handleTemplateAdd}
                    onPreview={showPreview}
                  />
                </Card>
              </Col>
              <Col span={16}>
                <Card
                  title="선택된 템플릿"
                  size="small"
                  style={{ height: "100%" }}
                >
                  {selectedTemplates.length === 0 ? (
                    <Empty
                      description="템플릿을 선택해주세요"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  ) : (
                    selectedTemplates.map((template, index) => (
                      <TemplateInputArea
                        key={`${template.id}-${index}`}
                        template={template}
                        index={index}
                        moveTemplate={moveTemplate}
                        onRemove={moveTemplate}
                      />
                    ))
                  )}
                </Card>
              </Col>
            </Row>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={loading}
                >
                  이벤트 등록
                </Button>
                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  onClick={showEventPreview}
                  disabled={selectedTemplates.length === 0}
                >
                  이벤트 미리보기
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Modal
          title="템플릿 미리보기"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={800}
        >
          {renderTemplatePreview()}
        </Modal>

        <Modal
          title="이벤트 미리보기"
          open={eventPreviewVisible}
          onCancel={() => setEventPreviewVisible(false)}
          footer={null}
          width={1000}
        >
          {renderEventPreview()}
        </Modal>
      </Space>
    </DndProvider>
  );
};

export default EventRegistration;
