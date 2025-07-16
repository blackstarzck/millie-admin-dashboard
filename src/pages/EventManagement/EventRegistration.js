import {
  AppstoreAddOutlined,
  CalendarOutlined,
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  ProfileOutlined,
  SendOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Collapse,
  ColorPicker,
  DatePicker,
  Empty,
  Form,
  Image,
  Input,
  List,
  message,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
  Upload
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

// Mock Data for Books
const MOCK_BOOKS = [
  {
    id: "book_01",
    title: "트렌드 코리아 2024",
    author: "김난도",
    coverUrl: "https://via.placeholder.com/150x220?text=Book1",
  },
  {
    id: "book_02",
    title: "세이노의 가르침",
    author: "세이노",
    coverUrl: "https://via.placeholder.com/150x220?text=Book2",
  },
  {
    id: "book_03",
    title: "도시와 그 불확실한 벽",
    author: "무라카미 하루키",
    coverUrl: "https://via.placeholder.com/150x220?text=Book3",
  },
  {
    id: "book_04",
    title: "퓨처 셀프",
    author: "벤저민 하디",
    coverUrl: "https://via.placeholder.com/150x220?text=Book4",
  },
  {
    id: "book_05",
    title: "원씽(THE ONE THING)",
    author: "게리 켈러",
    coverUrl: "https://via.placeholder.com/150x220?text=Book5",
  },
  {
    id: "book_06",
    title: "일론 머스크",
    author: "월터 아이작슨",
    coverUrl: "https://via.placeholder.com/150x220?text=Book6",
  },
  {
    id: "book_07",
    title: "데일 카네기 인간관계론",
    author: "데일 카네기",
    coverUrl: "https://via.placeholder.com/150x220?text=Book7",
  },
];

// Template types and preview components
const TEMPLATE_TYPES = {
  HERO_BANNER: {
    id: "hero_banner",
    displayId: "TEMPLATE_01",
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
        <h2>{title || "섹션 제목"}</h2>
        <p>{description || "섹션 설명"}</p>
      </div>
    ),
    fields: [
      { name: "title", label: "섹션 제목", type: "text" },
      { name: "description", label: "섹션 설명", type: "textarea" },
      { name: "imageUrl", label: "이미지 URL", type: "text" },
    ],
  },
  PRODUCT_GRID: {
    id: "product_grid",
    displayId: "TEMPLATE_02",
    name: "상품 그리드",
    description: "상품(도서)을 그리드 형태로 보여주는 템플릿",
    preview: ({ title, description, selectedBooksInfo = [] }) => (
      <div style={{ padding: "20px" }}>
        <h2>{title || "상품 그리드"}</h2>
        <p style={{ color: "#555" }}>
          {description || "여기에 섹션 설명이 들어갑니다."}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "10px",
          }}
        >
          {(selectedBooksInfo.length > 0
            ? selectedBooksInfo
            : Array(3).fill({})
          ).map((book, index) => (
            <div
              key={book.id || index}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <Image
                src={
                  book.coverUrl || "https://via.placeholder.com/120x170?text=Grid"
                }
                alt={book.title}
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  marginBottom: "5px",
                }}
                preview={false}
              />
              <Text strong ellipsis style={{ display: "block" }}>
                {book.title || `상품 ${index + 1}`}
              </Text>
              <Text type="secondary" size="small" ellipsis>
                {book.author}
              </Text>
            </div>
          ))}
        </div>
      </div>
    ),
    fields: [
      { name: "title", label: "섹션 제목", type: "text" },
      {
        name: "description",
        label: "섹션 설명",
        type: "textarea",
        optional: true,
      },
      { name: "bookIds", label: "도서 선택", type: "book" },
    ],
  },
  TEXT_SECTION: {
    id: "text_section",
    displayId: "TEMPLATE_03",
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
  BOOK_SELECTOR: {
    id: "book_selector",
    displayId: "TEMPLATE_04",
    name: "도서 선택",
    description: "도서 목록을 선택하여 보여주는 템플릿",
    preview: ({ title, description, selectedBooksInfo = [] }) => (
      <div style={{ padding: "20px" }}>
        <h2>{title || "추천 도서"}</h2>
        <p style={{ color: "#555" }}>
          {description || "여기에 섹션 설명이 들어갑니다."}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "10px",
          }}
        >
          {(selectedBooksInfo.length > 0
            ? selectedBooksInfo
            : Array(3).fill({})
          ).map((book, index) => (
            <div
              key={book.id || index}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <Image
                src={book.coverUrl || "https://via.placeholder.com/120x170"}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "170px",
                  objectFit: "cover",
                  marginBottom: "5px",
                }}
                preview={false}
              />
              <Text strong ellipsis style={{ display: "block" }}>
                {book.title || `도서 ${index + 1}`}
              </Text>
              <Text type="secondary" size="small" ellipsis>
                {book.author}
              </Text>
            </div>
          ))}
        </div>
      </div>
    ),
    fields: [
      { name: "title", label: "섹션 제목", type: "text" },
      {
        name: "description",
        label: "섹션 설명",
        type: "textarea",
        optional: true,
      },
      { name: "bookIds", label: "선택된 도서", type: "book" }, // Custom type
    ],
  },
};

const TemplateSelector = ({ onSelect, onPreview }) => {
  return (
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
            title={`[${template.displayId}] ${template.name}`}
            description={
              <Text type="secondary" ellipsis={{ rows: 1 }}>
                {template.description}
              </Text>
            }
          />
        </List.Item>
      )}
    />
  );
};

const DraggableBookListItem = ({ book, index, moveBook }) => {
  const ref = useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "BOOK",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "BOOK",
    hover: (item, monitor) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      moveBook(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <List.Item
      ref={ref}
      style={{
        cursor: "move",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <List.Item.Meta
        avatar={
          <Space>
            <DragOutlined style={{ color: "#999" }} />
            <Image src={book.coverUrl} width={30} preview={false} />
          </Space>
        }
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
};

const BookField = ({ formInstance, index, field, onBookSelect, onMoveBook }) => {
  const selectedBooksInfo =
    Form.useWatch(
      ["templates", index, "data", "selectedBooksInfo"],
      formInstance
    ) || [];

  const moveBook = (fromIndex, toIndex) => {
    onMoveBook(index, fromIndex, toIndex);
  };

  return (
    <Form.Item
      key={field.name}
      label={
        <Space>
          <span>{field.label}</span>
          <Tooltip title="사용자는 선택된 도서의 상세페이지로 이동할 수 있습니다">
            <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
          </Tooltip>
        </Space>
      }
    >
      <Button
        icon={<AppstoreAddOutlined />}
        onClick={() => onBookSelect(index)}
      >
        도서 선택하기
      </Button>
      <Form.Item name={["templates", index, "data", field.name]} hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name={["templates", index, "data", "selectedBooksInfo"]}
        hidden
      >
        <Input />
      </Form.Item>
      {selectedBooksInfo.length > 0 && (
        <List
          style={{ marginTop: 8 }}
          header={<div>선택된 도서: {selectedBooksInfo.length}권</div>}
          size="small"
          bordered
          dataSource={selectedBooksInfo}
          renderItem={(item, bookIndex) => (
            <DraggableBookListItem
              key={item.id}
              index={bookIndex}
              book={item}
              moveBook={moveBook}
            />
          )}
        />
      )}
    </Form.Item>
  );
};

const TemplateInputArea = ({
  template,
  index,
  moveTemplate,
  onRemove,
  formInstance,
  onBookSelect,
  onMoveBook,
}) => {
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

  const isClickable = Form.useWatch(
    ["templates", index, "isClickable"],
    formInstance
  );

  // template 객체는 selectedTemplates 배열의 요소이므로 displayId를 가지고 있어야 함
  const headerTitle = `[${template.displayId || template.id}] ${template.name}`;

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        marginBottom: "8px",
      }}
    >
      <Collapse style={{ background: "white" }}>
        <Collapse.Panel
          key="1"
          header={
            <Space>
              <DragOutlined style={{ color: "#999" }} />
              <Text strong>{headerTitle}</Text>
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

            <Form.Item
              name={["templates", index, "isClickable"]}
              label={
                <Space>
                  <span>클릭 연결 사용</span>
                  <Tooltip title="이 설정을 활성화하면 템플릿에 버튼이 생성되고 URL을 입력하면 해당 URL로 이동합니다.">
                    <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                  </Tooltip>
                </Space>
              }
              valuePropName="checked"
              initialValue={false}
            >
              <Switch />
            </Form.Item>

            {isClickable && (
              <Form.Item
                name={["templates", index, "clickThroughUrl"]}
                label="연결 URL"
                rules={[
                  {
                    type: "url",
                    message: "유효한 URL 형식이 아닙니다.",
                  },
                ]}
              >
                <Input placeholder="https://example.com/target-page" />
              </Form.Item>
            )}

            {template.fields.map((field) => {
              if (field.type === "book") {
                return (
                  <BookField
                    key={field.name}
                    field={field}
                    formInstance={formInstance}
                    index={index}
                    onBookSelect={onBookSelect}
                    onMoveBook={onMoveBook}
                  />
                );
              }
              return (
                <Form.Item
                  key={field.name}
                  name={["templates", index, "data", field.name]}
                  label={field.label}
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
              );
            })}
          </Space>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

// Helper function (can be outside the component or in a utils file)
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BookSelector = ({
  visible,
  onCancel,
  onOk,
  initialSelectedIds = [],
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState(initialSelectedIds);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedRowKeys(initialSelectedIds);
  }, [initialSelectedIds, visible]);

  const handleOk = () => {
    const selectedBooks = MOCK_BOOKS.filter((book) =>
      selectedRowKeys.includes(book.id)
    );
    onOk(selectedRowKeys, selectedBooks);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const filteredBooks = MOCK_BOOKS.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      title="도서 선택"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
      okText="선택 완료"
      cancelText="취소"
      destroyOnClose
    >
      <Input.Search
        placeholder="도서명 또는 저자로 검색"
        onSearch={(value) => setSearchTerm(value)}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />
      <Table
        rowSelection={rowSelection}
        columns={[
          {
            title: "표지",
            dataIndex: "coverUrl",
            key: "coverUrl",
            render: (url, record) => (
              <Image src={url} alt={record.title} width={40} />
            ),
          },
          { title: "도서명", dataIndex: "title", key: "title" },
          { title: "저자", dataIndex: "author", key: "author" },
        ]}
        dataSource={filteredBooks}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

const EVENT_TYPE_INTERNAL = "internal";
const EVENT_TYPE_EXTERNAL = "external";

const EventRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [eventPreviewVisible, setEventPreviewVisible] = useState(false);
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [thumbnailPreviewOpen, setThumbnailPreviewOpen] = useState(false);
  const [thumbnailPreviewImage, setThumbnailPreviewImage] = useState("");
  const [eventType, setEventType] = useState(EVENT_TYPE_INTERNAL);
  const [bookSelectorVisible, setBookSelectorVisible] = useState(false);
  const [bookSelectorIndex, setBookSelectorIndex] = useState(null);

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

    const commonData = {
      title:
        eventType === EVENT_TYPE_INTERNAL
          ? values.title1
          : values.eventTitleExternal,
      description: values.eventDescription,
      eventPeriod: values.eventPeriod,
      ogType: eventType === EVENT_TYPE_INTERNAL ? values.ogType : "website",
      metaKeywords:
        eventType === EVENT_TYPE_INTERNAL ? values.metaKeywords : undefined,
      eventId: `event_${Date.now()}`,
    };

    if (values.eventPeriod) {
      commonData.startDate = values.eventPeriod[0].toISOString();
      commonData.endDate = values.eventPeriod[1].toISOString();
    }
    delete commonData.eventPeriod;

    let eventSpecificData = {};
    if (eventType === EVENT_TYPE_INTERNAL) {
      const processedTemplates =
        values.templates?.map((tplData, index) => {
          const originalTemplate = selectedTemplates[index];
          return {
            id: originalTemplate.id,
            displayId: originalTemplate.displayId,
            name: originalTemplate.name,
            backgroundColor: tplData.backgroundColor,
            isClickable: tplData.isClickable || false,
            clickThroughUrl: tplData.isClickable
              ? tplData.clickThroughUrl
              : undefined,
            data: tplData.data,
          };
        }) || [];

      eventSpecificData = {
        type: EVENT_TYPE_INTERNAL,
        title1: values.title1,
        title2: values.title2,
        title3: values.title3,
        slug: values.slug,
        templates: processedTemplates,
        seoTitle: values.seoTitle,
        ogTitle: values.ogTitle,
        ogDescription: values.ogDescription,
        ogImageUrl: values.ogImageUrl,
        ogUrl: values.ogUrl,
      };
    } else if (eventType === EVENT_TYPE_EXTERNAL) {
      eventSpecificData = {
        type: EVENT_TYPE_EXTERNAL,
        externalUrl: values.externalUrl,
        ogTitle: values.ogTitle,
        ogDescription: values.ogDescription,
        ogImageUrl: values.ogImageUrl,
      };
    }

    const formData = { ...commonData, ...eventSpecificData };

    console.log("Final Event Form Data:", formData);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      message.success({
        content: "이벤트가 성공적으로 등록되었습니다!",
        key: "eventCreate",
      });
      form.resetFields();
      setThumbnailFileList([]);
      setSelectedTemplates([]);
      setEventType(EVENT_TYPE_INTERNAL);
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
        displayId: template.displayId,
        name: template.name,
        fields: template.fields,
        isClickable: false,
        clickThroughUrl: "",
        backgroundColor: "#ffffff",
        data: template.fields.reduce((acc, field) => {
          let defaultValue = "";
          if (field.type === "book") {
            // book 타입 필드는 'bookIds'와 'selectedBooksInfo'를 초기화
            acc.bookIds = [];
            acc.selectedBooksInfo = [];
            return acc;
          }
          return { ...acc, [field.name]: defaultValue };
        }, {}),
      };
      setSelectedTemplates((prev) => [...prev, newTemplate]);
      const currentValues = form.getFieldsValue();
      const templates = currentValues.templates || [];
      form.setFieldsValue({
        ...currentValues,
        templates: [
          ...templates,
          {
            isClickable: newTemplate.isClickable,
            clickThroughUrl: newTemplate.clickThroughUrl,
            backgroundColor: newTemplate.backgroundColor,
            data: newTemplate.data,
          },
        ],
      });
    }
  };

  const moveTemplate = (fromIndex, toIndex) => {
    if (toIndex === -1) {
      const newTemplates = [...selectedTemplates];
      newTemplates.splice(fromIndex, 1);
      setSelectedTemplates(newTemplates);
      const currentValues = form.getFieldsValue();
      const templates = [...(currentValues.templates || [])];
      templates.splice(fromIndex, 1);
      form.setFieldsValue({
        ...currentValues,
        templates,
      });
    } else {
      const newTemplates = [...selectedTemplates];
      const [movedTemplate] = newTemplates.splice(fromIndex, 1);
      newTemplates.splice(toIndex, 0, movedTemplate);
      setSelectedTemplates(newTemplates);
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
      const isBookTemplate =
        previewTemplate.id === "book_selector" ||
        previewTemplate.id === "product_grid";
      const sampleData = isBookTemplate
        ? {
            title: "샘플 섹션 제목",
            description: "이곳에 섹션에 대한 설명이 표시됩니다.",
            selectedBooksInfo: MOCK_BOOKS.slice(0, 3),
          }
        : previewTemplate.fields.reduce(
            (acc, field) => ({ ...acc, [field.name]: `[${field.label}]` }),
            {}
          );
      return previewTemplate.preview(sampleData);
    } catch (error) {
      console.error("Error rendering template preview:", error);
      return <Text type="danger">미리보기를 표시할 수 없습니다.</Text>;
    }
  };

  const renderEventPreview = () => {
    const formValues = form.getFieldsValue();
    const previewTitle =
      eventType === EVENT_TYPE_INTERNAL
        ? formValues.title1 || "이벤트 제목"
        : formValues.eventTitleExternal || "외부 이벤트";
    const previewDescription =
      formValues.eventDescription || "이벤트 설명이 여기에 표시됩니다.";

    return (
      <div style={{ padding: "20px" }}>
        <h1>{previewTitle}</h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          {previewDescription}
        </p>
        {eventType === EVENT_TYPE_INTERNAL &&
          selectedTemplates.map((template, index) => {
            const templateType = Object.values(TEMPLATE_TYPES).find(
              (t) => t.id === template.id
            );
            if (!templateType) return null;
            const templateData = formValues.templates?.[index]?.data || {};
            const isClickable =
              formValues.templates?.[index]?.isClickable || false;
            const clickThroughUrl =
              formValues.templates?.[index]?.clickThroughUrl;
            let previewContent = templateType.preview(templateData);
            if (isClickable && clickThroughUrl) {
              previewContent = (
                <a
                  href={clickThroughUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: "block",
                    border: "2px dashed blue",
                    padding: "5px",
                    textDecoration: "none",
                  }}
                  title={`클릭 시 ${clickThroughUrl}로 이동 (미리보기에서는 이동 안 함)`}
                >
                  {previewContent}
                  <div
                    style={{
                      textAlign: "center",
                      color: "blue",
                      fontSize: "0.9em",
                      marginTop: "5px",
                    }}
                  >
                    (클릭 가능 영역: {clickThroughUrl})
                  </div>
                </a>
              );
            }
            return (
              <div
                key={index}
                style={{
                  marginBottom: "40px",
                  backgroundColor:
                    formValues.templates?.[index]?.backgroundColor || "#ffffff",
                }}
              >
                {previewContent}
              </div>
            );
          })}
        {eventType === EVENT_TYPE_EXTERNAL && formValues.externalUrl && (
          <iframe
            src={formValues.externalUrl}
            width="100%"
            height="600px"
            title="External Page Preview"
            style={{ border: "1px solid #eee" }}
          />
        )}
        {eventType === EVENT_TYPE_EXTERNAL && !formValues.externalUrl && (
          <p>미리보기를 위해 외부 페이지 URL을 입력해주세요.</p>
        )}
      </div>
    );
  };

  const handleThumbnailChange = ({ fileList: newFileList }) => {
    setThumbnailFileList(newFileList);
    if (newFileList.length > 0) {
      form.setFieldsValue({ thumbnail: newFileList });
    } else {
      form.setFieldsValue({ thumbnail: null });
    }
  };

  const handleThumbnailPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setThumbnailPreviewImage(file.url || file.preview);
    setThumbnailPreviewOpen(true);
  };

  const handleThumbnailCancel = () => setThumbnailPreviewOpen(false);

  const handleOpenBookSelector = (index) => {
    setBookSelectorIndex(index);
    setBookSelectorVisible(true);
  };

  const handleBookSelectorOk = (selectedIds, selectedBooks) => {
    if (bookSelectorIndex !== null) {
      const currentValues = form.getFieldsValue();
      const templates = [...(currentValues.templates || [])];
      if (templates[bookSelectorIndex]) {
        templates[bookSelectorIndex].data = {
          ...templates[bookSelectorIndex].data,
          bookIds: selectedIds,
          selectedBooksInfo: selectedBooks.map((b) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            coverUrl: b.coverUrl,
          })),
        };
        form.setFieldsValue({ ...currentValues, templates });
      }
    }
    setBookSelectorVisible(false);
    setBookSelectorIndex(null);
  };

  const handleBookSelectorCancel = () => {
    setBookSelectorVisible(false);
    setBookSelectorIndex(null);
  };

  const handleMoveBook = (templateIndex, fromIndex, toIndex) => {
    const currentValues = form.getFieldsValue();
    const templates = [...(currentValues.templates || [])];
    if (
      templates[templateIndex] &&
      templates[templateIndex].data &&
      templates[templateIndex].data.selectedBooksInfo
    ) {
      const books = [...templates[templateIndex].data.selectedBooksInfo];
      const [movedBook] = books.splice(fromIndex, 1);
      books.splice(toIndex, 0, movedBook);

      const bookIds = books.map((b) => b.id);

      templates[templateIndex].data.selectedBooksInfo = books;
      templates[templateIndex].data.bookIds = bookIds;

      form.setFieldsValue({ ...currentValues, templates });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>썸네일 업로드</div>
    </button>
  );

  const handleEventTypeChange = (e) => {
    const newType = e.target.value;
    setEventType(newType);
    const fieldsToReset = [
      "slug",
      "externalUrl",
      "title1",
      "title2",
      "title3",
      "eventTitleExternal",
      "eventDescription",
      "seoTitle",
      "ogTitle",
      "ogDescription",
      "ogImageUrl",
      "ogUrl",
      "metaKeywords",
      "ogType",
      "templates",
    ];
    form.resetFields(fieldsToReset);
    setSelectedTemplates([]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Title level={2}>
          <EditOutlined /> 이벤트 등록
        </Title>
        <Text>새로운 이벤트를 생성하고 관련 정보를 등록합니다.</Text>

        <Form
          form={form}
          layout="vertical"
          name="event_registration_form"
          onFinish={onFinish}
          initialValues={{
            status: "draft",
            templates: [],
            ogType: "website",
            eventType: EVENT_TYPE_INTERNAL,
            eventDescription: "",
          }}
        >
          <Form.Item
            name="eventType"
            label="이벤트 유형"
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={handleEventTypeChange} value={eventType}>
              <Radio.Button value={EVENT_TYPE_INTERNAL}>
                <ProfileOutlined /> 일반 이벤트 (콘텐츠 직접 구성)
              </Radio.Button>
              <Radio.Button value={EVENT_TYPE_EXTERNAL}>
                <LinkOutlined /> 외부 페이지 연결
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          {/* --- 기본 정보 섹션 Card --- */}
          <Card title="기본 정보" style={{ marginBottom: 24 }}>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                {eventType === EVENT_TYPE_INTERNAL ? (
                  <>
                    <Form.Item
                      name="title1"
                      label="이벤트명"
                      rules={[
                        {
                          required: true,
                          message: "대표 이벤트명을 입력해주세요.",
                        },
                      ]}
                    >
                      <Input placeholder="예: 여름맞이 특별 할인 (대표 이벤트명)" />
                    </Form.Item>
                    <Form.Item
                      name="eventDescription"
                      rules={[
                        {
                          required: true,
                          message: "이벤트에 대한 설명을 입력해주세요.",
                        },
                      ]}
                      label="이벤트 설명"
                    >
                      <TextArea
                        rows={3}
                        placeholder="이벤트에 대한 간단한 설명을 입력하세요."
                      />
                    </Form.Item>
                    <Form.Item
                      name="eventPeriod"
                      label={
                        <>
                          <CalendarOutlined /> 이벤트 기간
                        </>
                      }
                      rules={[
                        {
                          required: true,
                          message: "이벤트 기간을 선택해주세요.",
                        },
                      ]}
                    >
                      <RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="title2"
                      label="제목1 (내부용)"
                      rules={[
                        { required: true, message: "제목2를 입력해주세요." },
                      ]}
                    >
                      <Input placeholder="예: 특별 할인" />
                    </Form.Item>
                    <Form.Item
                      name="title3"
                      label="제목2 (내부용)"
                      rules={[
                        { required: true, message: "제목3을 입력해주세요." },
                      ]}
                    >
                      <Input placeholder="예: 이벤트" />
                    </Form.Item>
                  </>
                ) : (
                  <>
                    <Form.Item
                      name="eventTitleExternal"
                      label="이벤트명"
                      rules={[
                        { required: true, message: "이벤트명을 입력해주세요." },
                      ]}
                    >
                      <Input placeholder="예: 밀리의 서재 X 현대카드 특별 제휴" />
                    </Form.Item>
                    <Form.Item
                      name="eventDescription"
                      rules={[
                        {
                          required: true,
                          message: "이벤트에 대한 설명을 입력해주세요.",
                        },
                      ]}
                      label="이벤트 설명"
                    >
                      <TextArea
                        rows={3}
                        placeholder="이벤트에 대한 간단한 설명을 입력하세요."
                      />
                    </Form.Item>
                    <Form.Item
                      name="eventPeriod"
                      label={
                        <>
                          <CalendarOutlined /> 이벤트 기간
                        </>
                      }
                      rules={[
                        {
                          required: true,
                          message: "이벤트 기간을 선택해주세요.",
                        },
                      ]}
                    >
                      <RangePicker
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="externalUrl"
                      label="연결할 외부 페이지 URL"
                      rules={[
                        {
                          required: true,
                          message: "연결할 외부 페이지 URL을 입력해주세요.",
                        },
                        {
                          type: "url",
                          message: "유효한 URL 형식이어야 합니다.",
                        },
                      ]}
                    >
                      <Input placeholder="https://www.example.com/your-target-page" />
                    </Form.Item>
                  </>
                )}
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="thumbnail"
                  label="썸네일 이미지"
                  rules={[
                    {
                      required: true,
                      message: "썸네일 이미지를 등록해주세요.",
                    },
                  ]}
                >
                  <div
                    style={{
                      width: "100%",
                      minHeight: "300px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px dashed #d9d9d9",
                      borderRadius: "8px",
                    }}
                  >
                    <Upload
                      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                      listType="picture-card"
                      fileList={thumbnailFileList}
                      onPreview={handleThumbnailPreview}
                      onChange={handleThumbnailChange}
                      beforeUpload={() => false}
                    >
                      {thumbnailFileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </div>
                </Form.Item>
                {thumbnailPreviewImage && (
                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: thumbnailPreviewOpen,
                      onVisibleChange: (visible) =>
                        setThumbnailPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setThumbnailPreviewImage(""),
                    }}
                    src={thumbnailPreviewImage}
                  />
                )}
              </Col>
            </Row>
          </Card>

          {/* --- SEO 및 공유 설정 Card (내부 이벤트 유형일 때만 표시) --- */}
          {eventType === EVENT_TYPE_INTERNAL && (
            <Card title="SEO 및 공유 설정" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="seoTitle"
                    label="페이지 제목 (탭/검색결과용)"
                    tooltip="브라우저 탭이나 검색 결과에 표시될 제목입니다. HTML <title> 태그에 들어갑니다."
                  >
                    <Input placeholder="예: 썸머 특가 이벤트 | YourBrand" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="ogTitle"
                    label="공유 제목 (OG:Title)"
                    tooltip="SNS, 메신저에 공유될 때 표시될 제목입니다."
                  >
                    <Input placeholder="예: 놓치지 마세요! 썸머 특가 이벤트 진행 중" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="ogDescription"
                label="공유/검색 설명 (OG/Meta Description)"
                tooltip="SNS 공유 및 검색 결과에 표시될 상세 설명입니다."
              >
                <TextArea
                  rows={3}
                  placeholder="최대 2줄 분량의 이벤트 요약 설명을 입력하세요."
                />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="ogImageUrl"
                    label="공유 이미지 URL (OG:Image)"
                    tooltip="SNS 공유 시 표시될 대표 이미지 URL입니다. 입력하지 않으면 썸네일이 사용될 수 있습니다."
                  >
                    <Input placeholder="https://yourdomain.com/path/to/og-image.jpg" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="ogUrl"
                    label="대표 URL (OG:Url)"
                    tooltip="이벤트 페이지의 대표(canonical) URL입니다."
                  >
                    <Input placeholder="https://yourdomain.com/event/your-event-slug" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item name="ogType" label="콘텐츠 타입 (OG:Type)">
                    <Select defaultValue="website">
                      <Option value="website">website</Option>
                      <Option value="article">article</Option>
                      <Option value="event">event</Option>
                      <Option value="product">product</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="metaKeywords"
                    label="메타 키워드 (쉼표로 구분)"
                    tooltip="검색엔진 참조용 키워드입니다. HTML <meta name='keywords'> 태그에 들어갑니다. (선택 사항)"
                  >
                    <Input placeholder="예: 이벤트, 할인, 여름, 프로모션" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          )}

          {/* --- 이벤트 콘텐츠 구성 Card (일반 이벤트 유형일 때만 표시) --- */}
          {eventType === EVENT_TYPE_INTERNAL && (
            <Card title="이벤트 콘텐츠 구성" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Card
                    title="템플릿 목록"
                    size="small"
                    bodyStyle={{
                      height: "400px",
                      overflowY: "auto",
                      padding: "8px",
                    }}
                  >
                    <TemplateSelector
                      onSelect={handleTemplateAdd}
                      onPreview={showPreview}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    title="페이지 콘텐츠 구성"
                    size="small"
                    bodyStyle={{
                      height: "450px",
                      overflowY: "auto",
                      padding: "8px",
                    }}
                  >
                    {selectedTemplates.length === 0 ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Empty
                          description="템플릿을 선택해주세요"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      </div>
                    ) : (
                      selectedTemplates.map((template, index) => (
                        <TemplateInputArea
                          key={`${template.id}-${index}`}
                          template={template}
                          index={index}
                          moveTemplate={moveTemplate}
                          onRemove={() => moveTemplate(index, -1)}
                          formInstance={form}
                          onBookSelect={handleOpenBookSelector}
                          onMoveBook={handleMoveBook}
                        />
                      ))
                    )}
                  </Card>
                </Col>
              </Row>
            </Card>
          )}

          {/* --- 폼 제출 버튼 --- */}
          <Form.Item>
            <Space>
              <Button
                type="default"
                icon={<EyeOutlined />}
                onClick={showEventPreview}
                disabled={
                  eventType === EVENT_TYPE_INTERNAL &&
                  selectedTemplates.length === 0
                }
              >
                이벤트 미리보기
              </Button>
              <Tooltip title="이벤트 등록 후 반드시 모바일에서 확인해주세요.">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={loading}
                >
                  이벤트 등록
                </Button>
              </Tooltip>
            </Space>
          </Form.Item>
        </Form>

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

        <BookSelector
          visible={bookSelectorVisible}
          onCancel={handleBookSelectorCancel}
          onOk={handleBookSelectorOk}
          initialSelectedIds={
            bookSelectorIndex !== null
              ? form.getFieldValue([
                  "templates",
                  bookSelectorIndex,
                  "data",
                  "bookIds",
                ]) || []
              : []
          }
        />
      </Space>
    </DndProvider>
  );
};

export default EventRegistration;
