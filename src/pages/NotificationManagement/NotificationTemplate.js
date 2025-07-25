import {
  BellOutlined, // PUSH
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined, // Kakao
  MobileOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import React, { useMemo, useState } from "react";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

const channelConfigs = {
  PUSH: { name: "앱 PUSH", icon: <BellOutlined /> },
  알림톡: { name: "카카오 알림톡", icon: <CommentOutlined /> },
  알림: { name: "알림", icon: <MobileOutlined /> },
};

// Initial Data - Refactored for channel-specific content and added variables
const initialTemplates = [
  {
    key: "tpl001",
    id: "tpl001",
    name: "환영 메시지",
    lastModified: "2024-07-20",
    variables: ["[이름]"],
    channelContents: {
      알림: {
        title: "회원가입을 환영합니다!",
        content:
          "[이름]님, 밀리의 서재에 오신 것을 환영합니다! 지금 바로 첫 달 무료 혜택을 확인해보세요.",
      },
      PUSH: {
        title: "회원가입을 환영합니다!",
        content:
          "[이름]님, 밀리의 서재에 오신 것을 환영합니다! 지금 바로 첫 달 무료 혜택을 확인해보세요.",
      },
    },
  },
  {
    key: "tpl003",
    id: "tpl003",
    name: "독서 루틴 알림",
    lastModified: "2024-07-28",
    variables: ["[이름]"],
    channelContents: {
      알림: {
        title: "오늘의 독서, 시작하셨나요? 📚",
        content:
          "[이름]님, 잠시 밀리의 서재와 함께 마음의 양식을 쌓아보는 건 어때요? 꾸준한 독서는 성장의 밑거름이 됩니다.",
      },
      PUSH: {
        title: "오늘의 독서, 시작하셨나요? 📚",
        content:
          "[이름]님, 잠시 밀리의 서재와 함께 마음의 양식을 쌓아보는 건 어때요? 꾸준한 독서는 성장의 밑거름이 됩니다.",
      },
    },
  },
  {
    key: "tpl004",
    id: "tpl004",
    name: "다른 기기 접속",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[접속시간]", "[접속기기]"],
    channelContents: {
      알림톡: {
        title: "[이름]님, 다른 기기에서 로그인이 감지되었습니다.",
        content:
          "[이름]님, [접속시간]에 [접속기기]에서의 로그인이 감지되었습니다. 본인이 아닐 경우 비밀번호를 변경해주세요.",
      },
    },
  },
  {
    key: "tpl005",
    id: "tpl005",
    name: "구독 완료",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[결제금액]", "[구독기간]", "[다음결제일]"],
    channelContents: {
      알림톡: {
        title: "[이름]님, 구독이 완료되었습니다.",
        content:
          "[이름]님의 구독 결제가 완료되었습니다.\n결제 금액: [결제금액]원\n구독 기간: [구독기간]\n다음 결제일: [다음결제일]",
      },
    },
  },
  {
    key: "tpl006",
    id: "tpl006",
    name: "쿠폰 만료 D-DAY",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[쿠폰명]", "[만료일]"],
    channelContents: {
      알림: {
        title: "[이름]님, [쿠폰명] 쿠폰이 [만료일]에 만료됩니다.",
        content:
          "[이름]님, 보유하신 '[쿠폰명]' 쿠폰이 [만료일]에 만료될 예정입니다. 잊지 말고 사용하세요!",
      },
      PUSH: {
        title: "[이름]님, [쿠폰명] 쿠폰이 [만료일]에 만료됩니다.",
        content:
          "[이름]님, 보유하신 '[쿠폰명]' 쿠폰이 [만료일]에 만료될 예정입니다. 잊지 말고 사용하세요!",
      },
    },
  },
  {
    key: "tpl007",
    id: "tpl007",
    name: "구독 만료 D-DAY",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[만료일]"],
    channelContents: {
      알림: {
        title: "[이름]님, 구독이 곧 만료됩니다.",
        content:
          "[이름]님, 구독 기간이 [만료일]에 만료될 예정입니다. 구독을 연장하고 밀리의 서재를 계속 이용해보세요.",
      },
      PUSH: {
        title: "[이름]님, 구독이 곧 만료됩니다.",
        content:
          "[이름]님, 구독 기간이 [만료일]에 만료될 예정입니다. 구독을 연장하고 밀리의 서재를 계속 이용해보세요.",
      },
    },
  },
  {
    key: "tpl008",
    id: "tpl008",
    name: "커뮤니티 조회수 달성",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[게시글제목]", "[조회수]"],
    channelContents: {
      알림: {
        title: "'[게시글제목]' 게시글의 조회수가 [조회수]회를 돌파했습니다!",
        content:
          "[이름]님의 '[게시글제목]' 게시글이 많은 관심을 받고 있습니다! 커뮤니티에서 확인해보세요.",
      },
      PUSH: {
        title: "'[게시글제목]' 게시글의 조회수가 [조회수]회를 돌파했습니다!",
        content:
          "[이름]님의 '[게시글제목]' 게시글이 많은 관심을 받고 있습니다! 커뮤니티에서 확인해보세요.",
      },
    },
  },
  {
    key: "tpl009",
    id: "tpl009",
    name: "문의 답변 등록",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[문의제목]"],
    channelContents: {
      알림: {
        title: "문의하신 '[문의제목]'에 답변이 등록되었습니다.",
        content:
          "[이름]님, 문의하신 '[문의제목]'에 대한 답변이 등록되었습니다. 지금 바로 확인해보세요.",
      },
    },
  },
  {
    key: "tpl010",
    id: "tpl010",
    name: "팔로우 응답",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[상대방이름]"],
    channelContents: {
      PUSH: {
        title: "[상대방이름]님이 팔로우를 수락했습니다.",
        content:
          "[이름]님, 이제 [상대방이름]님과 친구입니다. 지금 바로 [상대방이름]님의 서재를 구경해보세요!",
      },
    },
  },
  {
    key: "tpl011",
    id: "tpl011",
    name: "구독 해지",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[구독상품명]"],
    channelContents: {
      알림톡: {
        title: "[구독상품명] 구독이 해지되었습니다.",
        content:
          "[이름]님의 [구독상품명] 구독이 정상적으로 해지되었습니다. 다음에 더 좋은 모습으로 만나요.",
      },
    },
  },
  {
    key: "tpl012",
    id: "tpl012",
    name: "신고 접수 (신고자)",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[신고내용]"],
    channelContents: {
      알림: {
        title: "회원님의 신고가 정상적으로 접수되었습니다.",
        content:
          "[이름]님, '[신고내용]'에 대한 신고가 정상적으로 접수되었습니다. 검토 후 빠르게 처리하겠습니다.",
      },
    },
  },
  {
    key: "tpl013",
    id: "tpl013",
    name: "신고 접수 (피신고자)",
    lastModified: "2024-07-29",
    variables: ["[이름]", "[신고사유]"],
    channelContents: {
      알림: {
        title: "회원님의 활동에 대해 신고가 접수되었습니다.",
        content:
          "[이름]님, 회원님의 활동에 대해 '[신고사유]' 사유로 신고가 접수되었습니다. 자세한 내용은 고객센터로 문의해주세요.",
      },
    },
  },
  {
    key: "tpl014",
    id: "tpl014",
    name: "신간 도서 추가",
    lastModified: "2024-07-29",
    variables: ["[도서명]", "[작가명]"],
    channelContents: {
      알림: {
        title: "신간 '[도서명]'이 밀리의 서재에 도착했어요!",
        content:
          "기다리시던 [작가명] 작가님의 신간 '[도서명]'이 밀리의 서재에 추가되었습니다. 지금 바로 만나보세요!",
      },
      PUSH: {
        title: "신간 '[도서명]'이 밀리의 서재에 도착했어요!",
        content:
          "기다리시던 [작가명] 작가님의 신간 '[도서명]'이 밀리의 서재에 추가되었습니다. 지금 바로 만나보세요!",
      },
    },
  },
  {
    key: "tpl015",
    id: "tpl015",
    name: "시리즈 신규 에피소드",
    lastModified: "2024-07-29",
    variables: ["[시리즈명]", "[에피소드명]"],
    channelContents: {
      알림: {
        title: "'[시리즈명]'의 새로운 이야기가 업데이트되었습니다.",
        content:
          "구독하신 시리즈 '[시리즈명]'의 새로운 에피소드 '[에피소드명]'가 업데이트되었습니다. 지금 바로 감상해보세요!",
      },
      PUSH: {
        title: "'[시리즈명]'의 새로운 이야기가 업데이트되었습니다.",
        content:
          "구독하신 시리즈 '[시리즈명]'의 새로운 에피소드 '[에피소드명]'가 업데이트되었습니다. 지금 바로 감상해보세요!",
      },
    },
  },
  {
    key: "tpl016",
    id: "tpl016",
    name: "시리즈 도서 추가 알림",
    lastModified: "2024-07-25",
    variables: ["[이름]", "[시리즈명]", "[도서명]"],
    channelContents: {
      알림: {
        title: "[시리즈명] 시리즈에 새로운 도서가 추가되었습니다! 📚",
        content:
          "[이름]님, 구독하신 [시리즈명] 시리즈에 새로운 도서 [도서명]이 추가되었습니다. 지금 바로 읽어보세요!",
      },
      PUSH: {
        title: "[시리즈명] 시리즈에 새로운 도서가 추가되었습니다! 📚",
        content:
          "[이름]님, 구독하신 [시리즈명] 시리즈에 새로운 도서 [도서명]이 추가되었습니다. 지금 바로 읽어보세요!",
      },
    },
  },
];

const NotificationTemplate = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [form] = Form.useForm();
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [channelContents, setChannelContents] = useState({});

  const handleChannelSelectionChange = (checkedValues) => {
    setSelectedChannels(checkedValues);
    form.setFieldsValue({ channels: checkedValues });
  };

  const handleContentChange = (channel, field, value) => {
    setChannelContents((prev) => ({
      ...prev,
      [channel]: {
        ...(prev[channel] || {}),
        [field]: value,
      },
    }));
  };

  const renderChannelIcon = (channelKey) => {
    const config = channelConfigs[channelKey];
    return config
      ? React.cloneElement(config.icon, { style: { marginRight: 8 } })
      : null;
  };

  // --- Modal Handling (Add/Edit) ---
  const showAddModal = () => {
    setEditingTemplate(null);
    form.resetFields();
    setSelectedChannels([]);
    setChannelContents({});
    setIsModalOpen(true);
  };

  const showEditModal = (template) => {
    setEditingTemplate(template);
    const channels = Object.keys(template.channelContents || {});
    form.setFieldsValue({
      name: template.name,
      channels: channels,
    });
    setSelectedChannels(channels);
    setChannelContents(template.channelContents || {});
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
    form.resetFields();
    setSelectedChannels([]);
    setChannelContents({});
  };

  // --- Form Submission (Add/Edit) ---
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        let contentIsValid = true;
        if (values.channels.length === 0) {
          message.error("하나 이상의 발송 채널을 선택해주세요.");
          contentIsValid = false;
        } else {
          for (const channel of values.channels) {
            const content = channelContents[channel];
            if (!content || !content.title || !content.content) {
              message.error(
                `${channelConfigs[channel].name} 채널의 제목과 내용을 모두 입력해주세요.`
              );
              contentIsValid = false;
              break;
            }
          }
        }
        if (!contentIsValid) {
          return;
        }

        const finalChannelContents = {};
        values.channels.forEach((channel) => {
          finalChannelContents[channel] = channelContents[channel];
        });

        const processedValues = {
          name: values.name,
          channelContents: finalChannelContents,
          lastModified: moment().format("YYYY-MM-DD HH:mm"),
        };

        if (editingTemplate) {
          const updatedTemplates = templates.map((tpl) =>
            tpl.key === editingTemplate.key
              ? { ...tpl, ...processedValues }
              : tpl
          );
          setTemplates(updatedTemplates);
          message.success("템플릿이 수정되었습니다.");
        } else {
          const newTemplate = {
            key: `tpl-${Date.now()}`,
            id: `tpl-${(templates.length + 1).toString().padStart(3, "0")}`,
            ...processedValues,
          };
          setTemplates([newTemplate, ...templates]);
          message.success("새 템플릿이 추가되었습니다.");
        }
        handleCancel();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        message.error("폼 입력값을 확인해주세요.");
      });
  };

  // --- Delete Handling ---
  const handleDelete = (key) => {
    setTemplates(templates.filter((tpl) => tpl.key !== key));
    message.success("템플릿이 삭제되었습니다.");
  };

  // --- Preview Handling ---
  const showPreview = (template) => {
    setPreviewTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handlePreviewCancel = () => {
    setIsPreviewModalOpen(false);
    setPreviewTemplate(null);
  };

  const usedVariables = useMemo(() => {
    const allContent = Object.values(channelContents)
      .flatMap((c) => [c.title, c.content])
      .join(" ");
    const matches = allContent.match(/\[(.*?)\]/g) || [];
    return [...new Set(matches)]; // Return unique variables
  }, [channelContents]);

  // --- Table Columns Definition ---
  const columns = [
    { title: "템플릿 ID", dataIndex: "id", key: "id", width: 120 },
    {
      title: "템플릿명",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "채널",
      key: "channels",
      width: 180,
      render: (_, record) => {
        const channels = Object.keys(record.channelContents || {});
        return (
          <Space>
            {channels.map((channel) => (
              <Tag key={channel} icon={renderChannelIcon(channel)}>
                {channelConfigs[channel]?.name || channel}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "제목 미리보기",
      key: "title",
      ellipsis: true,
      render: (_, record) => {
        const firstChannel = Object.keys(record.channelContents || {})[0];
        if (!firstChannel) return "N/A";
        const title = record.channelContents[firstChannel].title;
        const channelCount = Object.keys(record.channelContents).length;
        return (
          <span>
            {title}
            {channelCount > 1 && (
              <Tag style={{ marginLeft: 8 }}>+{channelCount - 1}</Tag>
            )}
          </span>
        );
      },
    },
    {
      title: "최종 수정일",
      dataIndex: "lastModified",
      key: "lastModified",
      width: 150,
      sorter: (a, b) =>
        moment(a.lastModified).unix() - moment(b.lastModified).unix(),
      defaultSortOrder: "descend",
    },
    {
      title: "관리",
      key: "action",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="미리보기">
            <Button
              icon={<EyeOutlined />}
              onClick={() => showPreview(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="수정">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="이 템플릿을 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.key)}
            okText="삭제"
            cancelText="취소"
          >
            <Tooltip title="삭제">
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Title level={2}>알림 템플릿 관리</Title>
      <Text type="secondary">
        사용자에게 발송될 알림 메시지의 템플릿을 관리합니다. 채널별 특성에 맞는
        개인화된 메시지를 작성하고 저장할 수 있습니다.
      </Text>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          새 템플릿 추가
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={templates}
        pagination={{ pageSize: 10 }}
        rowKey="key"
      />

      {/* Add/Edit Template Modal */}
      <Modal
        title={editingTemplate ? "알림 템플릿 수정" : "새 알림 템플릿 추가"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingTemplate ? "수정" : "추가"}
        cancelText="취소"
        width={720}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="notification_template_form">
          <Form.Item
            name="name"
            label="템플릿명"
            rules={[{ required: true, message: "템플릿명을 입력해주세요!" }]}
            tooltip="관리자가 식별하기 위한 이름입니다 (예: 신규 가입 환영)"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="channels"
            label="발송 채널"
            rules={[
              {
                required: true,
                message: "하나 이상의 발송 채널을 선택해주세요!",
              },
            ]}
          >
            <Checkbox.Group
              options={Object.keys(channelConfigs).map((key) => ({
                label: (
                  <>
                    {channelConfigs[key].icon} {channelConfigs[key].name}
                  </>
                ),
                value: key,
              }))}
              value={selectedChannels}
              onChange={handleChannelSelectionChange}
            />
          </Form.Item>

          <Tabs type="card" style={{ marginTop: 24 }}>
            {Object.keys(channelConfigs).map((channelKey) => {
              const content = channelContents[channelKey] || {};
              const isDisabled = !selectedChannels.includes(channelKey);

              return (
                <TabPane
                  tab={
                    <>
                      {renderChannelIcon(channelKey)}{" "}
                      {channelConfigs[channelKey].name}
                    </>
                  }
                  key={channelKey}
                  disabled={isDisabled}
                >
                  <Paragraph type="secondary">
                    {channelKey === "알림톡"
                      ? "카카오 알림톡은 사전에 승인된 템플릿으로만 발송 가능합니다."
                      : "아래 내용을 수정하여 채널별 템플릿을 저장할 수 있습니다."}
                  </Paragraph>
                  <Input.Group>
                    <Row gutter={8}>
                      <Col span={24}>
                        <strong style={{ display: "block", marginBottom: 4 }}>
                          알림 제목
                        </strong>
                        <Input
                          value={content.title}
                          onChange={(e) =>
                            handleContentChange(
                              channelKey,
                              "title",
                              e.target.value
                            )
                          }
                          maxLength={100}
                          placeholder={`${channelConfigs[channelKey].name} 제목`}
                          showCount
                        />
                      </Col>
                      <Col span={24} style={{ marginTop: 16 }}>
                        <strong style={{ display: "block", marginBottom: 4 }}>
                          알림 내용
                        </strong>
                        <TextArea
                          value={content.content}
                          onChange={(e) =>
                            handleContentChange(
                              channelKey,
                              "content",
                              e.target.value
                            )
                          }
                          rows={8}
                          maxLength={1000}
                          placeholder={`${channelConfigs[channelKey].name} 내용`}
                          showCount
                        />
                      </Col>
                    </Row>
                  </Input.Group>
                </TabPane>
              );
            })}
          </Tabs>
          {usedVariables.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <Text strong>사용된 변수 목록:</Text>
              <div style={{ marginTop: "8px" }}>
                <Space wrap>
                  {usedVariables.map((variable, index) => (
                    <Tag key={index} color="blue">
                      {variable}
                    </Tag>
                  ))}
                </Space>
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        title="템플릿 미리보기"
        open={isPreviewModalOpen}
        onCancel={handlePreviewCancel}
        footer={[
          <Button key="back" onClick={handlePreviewCancel}>
            닫기
          </Button>,
        ]}
        width={500}
      >
        {previewTemplate && (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="템플릿명">
                <Text strong>{previewTemplate.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="발송 채널">
                <Space>
                  {Object.keys(previewTemplate.channelContents).map((key) => (
                    <Tag key={key} icon={renderChannelIcon(key)}>
                      {channelConfigs[key].name}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Tabs>
              {Object.keys(previewTemplate.channelContents).map(
                (channelKey) => (
                  <TabPane
                    tab={
                      <>
                        {renderChannelIcon(channelKey)}{" "}
                        {channelConfigs[channelKey].name}
                      </>
                    }
                    key={channelKey}
                  >
                    <Descriptions bordered column={1} size="small">
                      <Descriptions.Item label="제목">
                        {previewTemplate.channelContents[channelKey].title}
                      </Descriptions.Item>
                      <Descriptions.Item label="내용">
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            margin: 0,
                            fontFamily: "inherit",
                          }}
                        >
                          {previewTemplate.channelContents[channelKey].content}
                        </pre>
                      </Descriptions.Item>
                    </Descriptions>
                  </TabPane>
                )
              )}
            </Tabs>
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default NotificationTemplate;
