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
  Select,
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
const { Option } = Select;

const channelConfigs = {
  PUSH: { name: "앱 PUSH", icon: <BellOutlined /> },
  알림톡: { name: "카카오 알림톡", icon: <CommentOutlined /> },
  알림: { name: "알림", icon: <MobileOutlined /> },
};

const variableExamples = {
  "[사용자 이름]": "예: 홍길동",
  "[시간]": "예: 2025-07-26 10:53 PM",
  "[기기 정보]": "예: iPhone 14, Chrome on Windows",
  "[금액]": "예: 9,900",
  "[시작일]": "예: 2025-07-26",
  "[종료일]": "예: 2025-08-25",
  "[다음 결제일]": "예: 2025-08-26",
  "[쿠폰 이름]": "예: 7일 무료 체험 쿠폰",
  "[만료일]": "예: 2025-08-02",
  "[게시물 제목]": "예: 나의 독서 후기",
  "[조회수]": "예: 1,000",
  "[댓글 수]": "예: 50",
  "[좋아요 수]": "예: 200",
  "[문의 제목]": "예: 결제 오류 문의",
  "[해지일]": "예: 2025-07-26",
  "[게시물/댓글]": "예: 게시물, 댓글",
  "[시리즈 제목]": "예: 해리포터 시리즈",
};

// Initial Data - Refactored for channel-specific content and added variables
const initialTemplates = [
  {
    key: "tpl_new_device_login",
    id: "TPL-001",
    name: "다른 기기 접속",
    lastModified: "2024-08-02",
    variables: ["[사용자 이름]", "[시간]", "[기기 정보]"],
    channelContents: {
      알림톡: {
        title: "새로운 기기에서 접속이 확인되었습니다",
        content:
          "안녕하세요, [사용자 이름]님!\n[시간]에 [기기 정보]에서 계정에 접속했습니다.\n본인이 맞다면 무시하셔도 됩니다.\n의심스러운 접속이라면 즉시 비밀번호를 변경해주세요.",
      },
    },
  },
  {
    key: "tpl_subscription_complete",
    id: "TPL-002",
    name: "구독 완료",
    lastModified: "2024-08-02",
    variables: [
      "[사용자 이름]",
      "[금액]",
      "[시작일]",
      "[종료일]",
      "[다음 결제일]",
    ],
    channelContents: {
      알림톡: {
        title: "[사용자 이름]님, 구독이 시작되었습니다!",
        content:
          "구독이 완료되었습니다!\n\n결제 금액: [금액]원\n구독 기간: [시작일] ~ [종료일]\n다음 결제일: [다음 결제일]\n지금 바로 무제한 독서를 즐겨보세요!",
      },
    },
  },
  {
    key: "tpl_coupon_expire_d7",
    id: "TPL-003",
    name: "쿠폰 만료 7일 전 안내",
    lastModified: "2024-08-02",
    variables: ["[쿠폰 이름]", "[만료일]", "[사용자 이름]"],
    channelContents: {
      알림: {
        title: "쿠폰 만료까지 7일 남았어요!",
        content:
          "[쿠폰 이름] 쿠폰이 [만료일]에 만료됩니다.\n지금 사용하고 혜택을 받아보세요!",
      },
      PUSH: {
        title: "쿠폰 만료 D-7!",
        content: "[쿠폰 이름] 쿠폰이 곧 만료됩니다. 지금 사용하세요!",
      },
    },
  },
  {
    key: "tpl_subscription_expire_d7",
    id: "TPL-004",
    name: "구독 만료 7일 전 안내",
    lastModified: "2024-08-02",
    variables: ["[사용자 이름]", "[만료일]"],
    channelContents: {
      알림: {
        title: "구독 만료까지 7일 남았습니다",
        content:
          "[사용자 이름]님, 구독이 [만료일]에 종료됩니다.\n지금 연장하고 무제한 독서를 이어가세요!",
      },
      PUSH: {
        title: "구독 만료 D-7!",
        content: "구독이 곧 끝나요! 지금 연장하세요.",
      },
    },
  },
  {
    key: "tpl_community_hot_post",
    id: "TPL-005",
    name: "커뮤니티 인기글 알림",
    lastModified: "2024-08-02",
    variables: [
      "[사용자 이름]",
      "[게시물 제목]",
      "[조회수]",
      "[댓글 수]",
      "[좋아요 수]",
    ],
    channelContents: {
      알림: {
        title: "게시물이 화제가 되고 있어요!",
        content:
          "[사용자 이름]님의 [게시물 제목]이 [조회수] 조회를 돌파했어요!\n[댓글 수]개의 댓글과 [좋아요 수]개의 좋아요를 받았습니다.\n지금 확인해보세요!",
      },
      PUSH: {
        title: "[게시물 제목]이 인기 급상승!",
        content: "[조회수] 조회 돌파! 지금 확인하세요.",
      },
    },
  },
  {
    key: "tpl_inquiry_replied",
    id: "TPL-006",
    name: "문의 답변 등록",
    lastModified: "2024-08-02",
    variables: ["[사용자 이름]", "[문의 제목]"],
    channelContents: {
      알림: {
        title: "문의하신 글에 답변이 도착했어요",
        content:
          "[사용자 이름]님, [문의 제목]에 답변이 달렸습니다.\n지금 확인해보세요!",
      },
    },
  },
  {
    key: "tpl_follow_accepted",
    id: "TPL-007",
    name: "팔로우 수락 알림",
    lastModified: "2024-08-02",
    variables: ["[사용자 이름]"],
    channelContents: {
      PUSH: {
        title: "[사용자 이름]님이 팔로우를 수락했어요!",
        content:
          "[사용자 이름]님이 회원님의 팔로우 요청을 수락했습니다.\n지금 프로필을 확인해보세요!",
      },
    },
  },
  {
    key: "tpl_subscription_canceled",
    id: "TPL-008",
    name: "구독 해지 완료",
    lastModified: "2024-08-02",
    variables: ["[사용자 이름]", "[해지일]"],
    channelContents: {
      알림톡: {
        title: "[사용자 이름]님, 구독이 해지되었습니다",
        content:
          "구독이 [해지일]에 정상적으로 해지되었습니다.\n언제든 다시 구독하여 무제한 독서를 즐겨보세요!",
      },
    },
  },
  {
    key: "tpl_report_received_reporter",
    id: "TPL-009",
    name: "신고 접수 완료 (신고자)",
    lastModified: "2024-08-02",
    variables: ["[사용자 이름]"],
    channelContents: {
      알림: {
        title: "신고가 접수되었습니다",
        content:
          "[사용자 이름]님, 신고가 정상적으로 접수되었습니다.\n검토 후 결과를 안내드리겠습니다.",
      },
    },
  },
  {
    key: "tpl_report_received_reported",
    id: "TPL-010",
    name: "신고 접수 안내 (피신고자)",
    lastModified: "2024-08-02",
    variables: ["[사용자 이름]", "[게시물/댓글]"],
    channelContents: {
      알림: {
        title: "신고가 접수되었습니다",
        content:
          "[사용자 이름]님, 회원님의 [게시물/댓글]에 대한 신고가 접수되었습니다.\n검토 후 필요한 조치를 취하겠습니다.",
      },
    },
  },
  {
    key: "tpl_new_series_book",
    id: "TPL-011",
    name: "구독 시리즈 신간 알림",
    lastModified: "2024-08-02",
    variables: ["[시리즈 제목]", "[사용자 이름]"],
    channelContents: {
      알림: {
        title: "[시리즈 제목] 새 에피소드 추가!",
        content:
          "[시리즈 제목]의 새로운 에피소드가 추가되었어요!\n지금 확인하고 이어서 읽어보세요.",
      },
      PUSH: {
        title: "[시리즈 제목] 새 에피소드!",
        content: "새로운 에피소드가 추가되었습니다! 지금 읽어보세요.",
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
  const [activeTabKey, setActiveTabKey] = useState(
    Object.keys(channelConfigs)[0]
  );

  const handleChannelSelectionChange = (checkedValues) => {
    setSelectedChannels(checkedValues);
    form.setFieldsValue({ channels: checkedValues });

    if (checkedValues.length > 0 && !checkedValues.includes(activeTabKey)) {
      setActiveTabKey(checkedValues[0]);
    }
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
    setActiveTabKey(Object.keys(channelConfigs)[0]);
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

    if (channels.length > 0) {
      setActiveTabKey(channels[0]);
    } else {
      setActiveTabKey(Object.keys(channelConfigs)[0]);
    }
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

          <Tabs
            type="card"
            style={{ marginTop: 24 }}
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
          >
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
          {editingTemplate && (
            <div style={{ marginTop: "16px" }}>
              <Text strong>변수 목록:</Text>
              <div style={{ marginTop: "8px" }}>
                <Space wrap>
                  {(editingTemplate.variables || []).map((variable, index) => {
                    const isUsed = usedVariables.includes(variable);
                    return (
                      <Tooltip key={index} title={variableExamples[variable]}>
                        <Tag color={isUsed ? "blue" : "default"}>
                          {variable}
                        </Tag>
                      </Tooltip>
                    );
                  })}
                  {(() => {
                    const availableVars = editingTemplate.variables || [];
                    const allPossibleVars = Object.keys(variableExamples);
                    const dummyVars = allPossibleVars
                      .filter((v) => !availableVars.includes(v))
                      .slice(0, 3);

                    return dummyVars.map((variable, index) => (
                      <Tooltip
                        key={`dummy-${index}`}
                        title={`${variableExamples[variable]} (예시)`}
                      >
                        <Tag color="default">{variable}</Tag>
                      </Tooltip>
                    ));
                  })()}
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
                (channelKey) => {
                  const channelData =
                    previewTemplate.channelContents[channelKey];
                  const fullContentString = `${channelData.title} ${channelData.content}`;
                  const usedVars = [
                    ...new Set(fullContentString.match(/\[(.*?)\]/g) || []),
                  ];

                  return (
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
                            {
                              previewTemplate.channelContents[channelKey]
                                .content
                            }
                          </pre>
                        </Descriptions.Item>
                        <Descriptions.Item label="사용된 변수">
                          {usedVars.length > 0 ? (
                            <Space wrap>
                              {usedVars.map((v, i) => (
                                <Tooltip key={i} title={variableExamples[v]}>
                                  <Tag>{v}</Tag>
                                </Tooltip>
                              ))}
                            </Space>
                          ) : (
                            <Text type="secondary">없음</Text>
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </TabPane>
                  );
                }
              )}
            </Tabs>
          </Space>
        )}
      </Modal>
    </Space>
  );
};

export default NotificationTemplate;
