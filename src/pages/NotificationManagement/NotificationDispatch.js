import {
  BellOutlined, // 알림 아이콘
  CommentOutlined, // 카카오 알림톡 아이콘
  EyeOutlined, // 미리보기 아이콘
  MobileOutlined, // 모바일 아이콘
  SendOutlined, // 발송 아이콘
  UsergroupAddOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Tabs, // Import Tabs
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../../context/GroupContext"; // Import useGroups hook

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

// --- Channel Configuration ---
const channelConfigs = {
  push: {
    name: "앱 PUSH",
    icon: <BellOutlined />,
    isEditable: true,
    maxLength: { title: 40, content: 120 },
    placeholders: {
      title: "앱 PUSH 제목 입력",
      content: "사용자에게 보여질 PUSH 메시지 내용을 입력하세요.",
    },
  },
  kakaotalk: {
    name: "카카오 알림톡",
    icon: <CommentOutlined />,
    isEditable: true,
    maxLength: { title: 50, content: 1000 },
    placeholders: {
      title: "알림톡 제목 입력 (선택 사항)",
      content:
        "카카오 채널에 사전 승인된 알림톡 템플릿 내용을 입력하세요. 변수 부분은 [변수명] 형식으로 사용할 수 있습니다.",
    },
  },
  notification: {
    name: "알림",
    icon: <MobileOutlined />,
    isEditable: true,
    maxLength: { title: 100, content: 500 },
    placeholders: {
      title: "앱 내 알림 제목 입력",
      content: "앱 내 알림함에 표시될 메시지 내용을 입력하세요.",
    },
  },
};

// --- Component ---
const NotificationDispatch = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { groups } = useGroups();
  const [targetType, setTargetType] = useState("all");
  const [dispatchTime, setDispatchTime] = useState("immediate");
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewData, setPreviewData] = useState({});
  const [testRecipient, setTestRecipient] = useState("");
  const [testRecipientError, setTestRecipientError] = useState(null);
  const [selectedGroupCount, setSelectedGroupCount] = useState(null);
  const [groupCountLoading, setGroupCountLoading] = useState(false);
  const [groupCountError, setGroupCountError] = useState(null);

  // --- State for Static UI ---
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [isTestSent, setIsTestSent] = useState(false); // State to track test send completion
  const [channelContents, setChannelContents] = useState(
    Object.keys(channelConfigs).reduce((acc, key) => {
      acc[key] = { title: "", content: "" };
      return acc;
    }, {})
  ); // Initialize content state for all channels

  // Prepare group options for the select dropdown
  const groupOptions = groups.map((group) => ({
    key: group.key,
    value: group.id,
    label: group.name,
    userCount: group.userCount || 0,
  }));

  // --- Event Handlers for UI ---
  const handleChannelSelectionChange = (checkedValues) => {
    setSelectedChannels(checkedValues);
  };

  // Sync content state when channel selection changes
  useEffect(() => {
    setChannelContents((prevContents) => {
      const newContents = {};
      selectedChannels.forEach((channelKey) => {
        newContents[channelKey] = prevContents[channelKey] || {
          title: "",
          content: "",
        };
      });
      return newContents;
    });
  }, [selectedChannels]);

  const handleContentChange = (channel, field, value) => {
    setChannelContents((prev) => ({
      ...prev,
      [channel]: {
        ...prev[channel],
        [field]: value,
      },
    }));
  };

  // Handle Group Selection Change
  const handleGroupChange = (groupId) => {
    setSelectedGroupCount(null);
    setGroupCountError(null);

    if (groupId) {
      setGroupCountLoading(true);
      setTimeout(() => {
        const success = Math.random() < 0.8;
        if (success) {
          const dummyCount = Math.floor(Math.random() * 5001);
          setSelectedGroupCount(dummyCount);
          setGroupCountError(null);
        } else {
          setSelectedGroupCount(null);
          setGroupCountError("그룹 인원 확인 중 오류가 발생했습니다.");
        }
        setGroupCountLoading(false);
      }, 750);
    } else {
      setGroupCountLoading(false);
    }
  };

  const handleTargetChange = (value) => {
    if (value && value !== "all") {
      setTargetType("group");
      handleGroupChange(value);
    } else {
      setTargetType("all");
      setSelectedGroupCount(null);
      setGroupCountError(null);
      setGroupCountLoading(false);
      if (!value) {
        form.setFieldsValue({ target: "all" });
      }
    }
  };

  // Show preview
  const showPreview = () => {
    form
      .validateFields()
      .then((values) => {
        const dataForPreview = {
          ...values,
          channels: selectedChannels,
          contents: channelContents,
        };
        setPreviewData(dataForPreview);
        setTestRecipientError(null);
        setIsTestSent(false); // Reset test send status when modal opens
        setPreviewVisible(true);
      })
      .catch((info) => {
        console.log("Validate Failed for Preview:", info);
        message.warning("미리보기를 위해 필수 항목을 입력해주세요.");
      });
  };

  // Handle final dispatch
  const onFinish = (values) => {
    console.log("Form Values: ", values);
    console.log("Current State for Dispatch:", {
      selectedChannels,
      channelContents,
    });

    if (selectedChannels.length === 0) {
      message.error("하나 이상의 발송 채널을 선택해주세요.");
      return;
    }

    const dispatchPayloads = selectedChannels.map((channelKey) => {
      const content = channelContents[channelKey];
      if (!content.title || !content.content) {
        // This is a simple validation. Antd form validation on dynamic fields is more complex.
        // We'll rely on the user to fill things out for now.
      }
      return {
        channel: channelKey,
        title: content.title,
        content: content.content,
        linkUrl: content.linkUrl, // PUSH 채널의 경우 linkUrl 포함
        // Add common data
        targetType: targetType,
        targetValue: values.target === "all" ? null : values.target,
        scheduledTime:
          dispatchTime === "scheduled"
            ? values.scheduledTime?.format("YYYY-MM-DD HH:mm:ss")
            : null,
      };
    });

    if (targetType === "group" && selectedGroupCount === 0) {
      message.error(
        "선택된 그룹의 대상 회원이 0명입니다. 발송할 수 없습니다.",
        5
      );
      setPreviewVisible(false);
      return;
    }

    message.loading({
      content: `[${selectedChannels
        .map((key) => channelConfigs[key].name)
        .join(", ")}] 알림 발송 처리 중...`,
      key: "dispatch",
    });
    console.log("Dispatching Payloads:", dispatchPayloads);

    setTimeout(() => {
      message.success({
        content: (
          <span>
            알림 발송 요청이 완료되었습니다!
            <a
              href="/notifications/history"
              onClick={(e) => {
                e.preventDefault();
                navigate("/notifications/history");
                message.destroy("dispatch");
              }}
              style={{ marginLeft: "8px", textDecoration: "underline" }}
            >
              발송 내역 보러가기
            </a>
          </span>
        ),
        key: "dispatch",
        duration: 5,
      });
      setPreviewVisible(false);
    }, 1500);
  };

  // Handle Test Send to Me (Simplified for one recipient)
  const handleSendToMe = () => {
    // This is simplified. A real implementation might need channel-specific recipients.
    if (!testRecipient) {
      setTestRecipientError(`테스트 발송 대상을 입력해주세요.`);
      return;
    }
    setTestRecipientError(null);

    console.log(`Sending test notifications to ${testRecipient}`);
    console.log("Test Notification Data:", previewData);

    message.loading({
      content: `'${testRecipient}'(으)로 테스트 발송 중...`,
      key: "testSend",
    });
    setTimeout(() => {
      message.success({
        content: `'${testRecipient}'(으)로 ${selectedChannels.join(
          ", "
        )} 채널 테스트 발송 완료!`,
        key: "testSend",
        duration: 3,
      });
      setIsTestSent(true); // Enable dispatch button after successful test send
    }, 1500);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("폼 입력 내용을 확인해주세요.");
  };

  const handleTestRecipientChange = (e) => {
    setTestRecipient(e.target.value);
    if (testRecipientError) setTestRecipientError(null);
  };

  const handleFinalSubmit = () => {
    if (targetType === "group" && selectedGroupCount === 0) {
      message.error(
        "선택된 그룹의 대상 회원이 0명입니다. 발송할 수 없습니다.",
        5
      );
      return;
    }
    form.submit();
  };

  const renderChannelIcon = (channelKey) => {
    const config = channelConfigs[channelKey];
    return config ? config.icon : null;
  };

  const renderAvailableVariables = () => {
    return (
      <Text
        type="secondary"
        style={{
          fontSize: "12px",
          display: "block",
          marginTop: "8px",
          textAlign: "right",
        }}
      >
        사용 가능한 변수: <Tag>[이름]</Tag>
        <Tag>[이메일]</Tag>
      </Text>
    );
  };

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Title level={2}>알림 발송</Title>
      <Card title="알림 내용 작성">
        <Form
          form={form}
          layout="vertical"
          name="notification_dispatch_form"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            target: "all",
            scheduledTimeOption: "immediate",
          }}
        >
          {/* Step 1: Channel Selection */}
          <Form.Item label="발송 채널 선택" required>
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

          {/* Step 2: Content Editing via Tabs - Always visible */}
          <>
            <Tabs type="card" style={{ marginBottom: 24 }}>
              {Object.keys(channelConfigs).map((channelKey) => {
                const channelConfig = channelConfigs[channelKey];
                const content = channelContents[channelKey] || {};
                const isDisabled = !selectedChannels.includes(channelKey);

                return (
                  <TabPane
                    tab={
                      <>
                        {channelConfig.icon} {channelConfig.name}
                      </>
                    }
                    key={channelKey}
                    disabled={isDisabled}
                  >
                    <Paragraph type="secondary">
                      {channelKey === "kakaotalk"
                        ? "카카오 알림톡은 사전에 승인된 템플릿으로만 발송 가능합니다. 템플릿 내용을 정확히 입력해주세요."
                        : "아래 내용을 수정하여 발송할 수 있습니다."}
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
                            disabled={!channelConfig.isEditable}
                            maxLength={channelConfig.maxLength?.title}
                            placeholder={channelConfig.placeholders.title}
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
                            disabled={!channelConfig.isEditable}
                            rows={5}
                            maxLength={channelConfig.maxLength?.content}
                            placeholder={channelConfig.placeholders.content}
                            showCount
                          />
                        </Col>
                        {channelKey === "push" && (
                          <Col span={24} style={{ marginTop: 16 }}>
                            <div style={{ marginBottom: 4 }}>
                              <Space>
                                <strong>연결 링크 (선택사항)</strong>
                                <Tooltip title="설정하지 않는 경우 메인 페이지로 유저를 이동시킵니다.">
                                  <InfoCircleOutlined />
                                </Tooltip>
                              </Space>
                            </div>
                            <Input
                              value={content.linkUrl || ""}
                              onChange={(e) =>
                                handleContentChange(
                                  channelKey,
                                  "linkUrl",
                                  e.target.value
                                )
                              }
                              placeholder="알림 클릭 시 이동할 URL (예: https://...)"
                            />
                          </Col>
                        )}
                      </Row>
                    </Input.Group>
                  </TabPane>
                );
              })}
            </Tabs>
            {renderAvailableVariables()}
          </>

          {/* Step 3 & 4: Common Settings and Dispatch */}
          <Divider>발송 대상 및 시점</Divider>
          <Form.Item
            name="target"
            label={
              <Space>
                <span>발송 대상</span>
                <Tooltip title="알림 수신 동의를 체크한 유저에게만 발송됩니다.">
                  <InfoCircleOutlined />
                </Tooltip>
              </Space>
            }
            rules={[{ required: true }]}
          >
            <Space.Compact style={{ width: "100%" }}>
              <Select
                placeholder="발송할 대상 선택"
                onChange={handleTargetChange}
                allowClear
              >
                <Option value="all">전체 사용자</Option>
                {groupOptions.map((group) => (
                  <Option key={group.key} value={group.value}>
                    {group.label}
                  </Option>
                ))}
              </Select>
              <Popconfirm
                title="페이지를 이동하시겠습니까?"
                description="페이지 이동 시 기존에 작성한 내용은 모두 지워집니다."
                onConfirm={() => navigate("/notifications/groups")}
                okText="이동"
                cancelText="취소"
              >
                <Button icon={<UsergroupAddOutlined />}>발송 대상 관리</Button>
              </Popconfirm>
            </Space.Compact>
          </Form.Item>

          {targetType === "group" && (
            <div
              style={{
                marginTop: "-12px",
                marginBottom: "12px",
                minHeight: "22px",
              }}
            >
              {groupCountLoading && (
                <Spin size="small" style={{ marginRight: "8px" }} />
              )}
              {groupCountLoading && (
                <Text type="secondary">인원 수 확인 중...</Text>
              )}
              {groupCountError && <Text type="danger">{groupCountError}</Text>}
              {!groupCountLoading &&
                !groupCountError &&
                selectedGroupCount !== null && (
                  <Text
                    type={selectedGroupCount === 0 ? "danger" : "secondary"}
                  >
                    예상 발송 대상: {selectedGroupCount.toLocaleString()}명
                    (테스트 값)
                  </Text>
                )}
            </div>
          )}

          <Form.Item name="scheduledTimeOption" label="발송 시점">
            <Radio.Group
              onChange={(e) => setDispatchTime(e.target.value)}
              value={dispatchTime}
            >
              <Radio value="immediate">즉시 발송</Radio>
              <Radio value="scheduled">예약 발송</Radio>
            </Radio.Group>
          </Form.Item>

          {dispatchTime === "scheduled" && (
            <Form.Item
              name="scheduledTime"
              label="예약 시간"
              rules={[{ required: true }]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>
          )}

          <Divider />

          <Form.Item>
            <Button
              type="dashed"
              icon={<EyeOutlined />}
              onClick={showPreview}
              disabled={
                selectedChannels.length === 0 ||
                (targetType === "group" &&
                  (selectedGroupCount === 0 || groupCountError !== null))
              }
            >
              미리보기
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Preview Modal */}
      <Modal
        title="알림 미리보기"
        open={previewVisible}
        onCancel={() => {
          setPreviewVisible(false);
          setIsTestSent(false); // Reset on cancel as well
        }}
        footer={[
          <Tooltip
            key="submit-tooltip"
            title={
              !isTestSent
                ? "알림을 발송하려면 먼저 테스트 발송을 완료해야 합니다."
                : ""
            }
          >
            <Button
              key="submit"
              type="primary"
              icon={<SendOutlined />}
              onClick={handleFinalSubmit}
              disabled={!isTestSent}
            >
              알림 발송
            </Button>
          </Tooltip>,
        ]}
        width={800}
      >
        {previewData.channels && (
          <>
            <Descriptions
              bordered
              column={1}
              size="small"
              style={{ marginBottom: 24 }}
            >
              <Descriptions.Item label="발송 채널">
                <Space>
                  {previewData.channels.map((key) => (
                    <Tag key={key} icon={renderChannelIcon(key)}>
                      {channelConfigs[key].name}
                    </Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="발송 대상">
                {targetType === "all" && "전체 사용자"}
                {targetType === "group" &&
                  `그룹 (${
                    groupOptions.find((g) => g.value === previewData.target)
                      ?.label || previewData.target
                  })` +
                    (selectedGroupCount !== null
                      ? ` (${selectedGroupCount.toLocaleString()}명)`
                      : "")}
              </Descriptions.Item>
              <Descriptions.Item label="발송 시점">
                {dispatchTime === "immediate"
                  ? "즉시 발송"
                  : `예약 발송 (${moment(previewData.scheduledTime).format(
                      "YYYY-MM-DD HH:mm:ss"
                    )})`}
              </Descriptions.Item>
            </Descriptions>

            <Tabs>
              {previewData.channels?.map((channelKey) => (
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
                      {previewData.contents[channelKey].title}
                    </Descriptions.Item>
                    <Descriptions.Item label="내용">
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          margin: 0,
                          fontFamily: "inherit",
                        }}
                      >
                        {previewData.contents[channelKey].content}
                      </pre>
                    </Descriptions.Item>
                    {channelKey === "push" &&
                      previewData.contents[channelKey].linkUrl && (
                        <Descriptions.Item label="연결 링크">
                          {previewData.contents[channelKey].linkUrl}
                        </Descriptions.Item>
                      )}
                  </Descriptions>
                </TabPane>
              ))}
            </Tabs>

            {/* Test Send Input */}
            <Form layout="vertical" style={{ marginTop: "24px" }}>
              <Form.Item
                label="테스트 발송 대상"
                tooltip="모든 선택된 채널로 테스트 발송을 진행할 대상의 식별자(이메일, 전화번호 등)를 입력하세요."
                validateStatus={testRecipientError ? "error" : ""}
                help={testRecipientError || ""}
              >
                <Space.Compact block style={{ width: "100%" }}>
                  <Input
                    placeholder="테스트 대상 식별자 입력"
                    value={testRecipient}
                    onChange={handleTestRecipientChange}
                    allowClear
                  />
                  <Button
                    key="test"
                    onClick={handleSendToMe}
                    icon={<MobileOutlined />}
                  >
                    테스트 발송
                  </Button>
                </Space.Compact>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </Space>
  );
};

export default NotificationDispatch;
