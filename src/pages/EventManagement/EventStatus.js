import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Table,
  Tag,
  Button,
  Space,
  Typography,
  Card,
  Input,
  Select,
  DatePicker,
  message,
  Tooltip,
  Image,
  Dropdown,
  Menu,
  Modal,
  Form,
  Radio,
  Descriptions,
  Divider,
  List,
  Alert,
  Switch,
} from "antd";
import {
  CalendarOutlined,
  CheckCircleOutlined, // Ongoing
  ClockCircleOutlined, // Scheduled/Planned
  CloseCircleOutlined, // Finished/Cancelled
  EditOutlined,
  SearchOutlined,
  ReloadOutlined,
  PlayCircleOutlined, // Start event
  PauseCircleOutlined, // Pause/Finish event
  EyeOutlined,
  EllipsisOutlined,
  LinkOutlined,
  ProfileOutlined, // For internal event type
  AppstoreOutlined, // For external event type (or other suitable icon)
  EyeInvisibleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import UrlGenerationForm from "../../components/EventManagement/UrlGenerationForm";

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// Sample Data with UTM fields
const initialEvents = [
  {
    key: "1",
    eventId: "1",
    title: "여름맞이 특별 할인",
    startDate: "2024-07-01 00:00",
    endDate: "2025-05-10 23:59",
    status: "active",
    thumbnailUrl:
      "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/NU2%2FM-NU2-10.png?alt=media",
    registeredBy: "김밀리",
    registeredAt: "2024-03-15 14:30:00",
    eventType: "internal",
    url: "www.example.com/event/1",
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "summer_promo",
    utm_term: "beachwear",
    utm_content: "banner_ad_1",
    eventDescription:
      "여름을 맞이하여 진행하는 특별 할인 이벤트입니다. 다양한 상품을 저렴한 가격에 만나보세요!",
    templates: [
      {
        id: "TEMPLATE_01",
        type: "HERO_BANNER",
        name: "메인 히어로 배너",
        isClickable: true,
        clickUrl: "https://example.com/summer_special_1",
        displayOrder: 1,
        imageUrl: "https://via.placeholder.com/600x200.png?text=Event1+Hero1",
        backgroundColor: "#E6F7FF",
      },
      {
        id: "TEMPLATE_02",
        type: "PRODUCT_GRID",
        name: "추천 상품 그리드",
        isClickable: false,
        clickUrl: "",
        displayOrder: 2,
        products: [
          { id: "P001", name: "상품1" },
          { id: "P002", name: "상품2" },
        ],
        backgroundColor: "",
      },
      {
        id: "TEMPLATE_03",
        type: "TEXT_SECTION",
        name: "이벤트 안내 문구",
        content:
          "이벤트 유의사항: 여름 이벤트는 재고 소진 시 조기 종료될 수 있습니다.",
        displayOrder: 3,
        backgroundColor: "#FFFBE6",
      },
      {
        id: "TEMPLATE_04",
        type: "IMAGE_SINGLE",
        name: "단일 이미지 광고",
        isClickable: true,
        clickUrl: "https://example.com/summer_ad_1",
        displayOrder: 4,
        imageUrl:
          "https://via.placeholder.com/300x250.png?text=Event1+Ad+Image",
        backgroundColor: "#F0F0F0",
      },
      {
        id: "TEMPLATE_05",
        type: "VIDEO_EMBED",
        name: "이벤트 소개 영상",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        displayOrder: 5,
        backgroundColor: null,
      },
    ],
    seoSettings: {
      ogTitle: "[특별할인] 여름맞이 시원한 이벤트!",
      ogDescription: "놓치면 후회할 여름 특별 상품들을 만나보세요.",
      ogImage: "https://via.placeholder.com/400x300.png?text=Summer+OG+Image",
      ogType: "website",
    },
  },
  {
    key: "2",
    eventId: "2",
    title: "신규 가입자 웰컴 이벤트",
    startDate: "2024-08-01 00:00",
    endDate: "2024-08-31 23:59",
    status: "scheduled",
    thumbnailUrl:
      "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/NU2%2FM-NU2-10.png?alt=media",
    registeredBy: "이서재",
    registeredAt: "2024-03-14 09:15:00",
    eventType: "external", // 외부 이벤트는 템플릿, SEO 정보 없음
    url: "www.example.com/post/123",
    utm_source: "facebook",
    utm_medium: "social",
    utm_campaign: "welcome_event",
    utm_term: "new_users",
    utm_content: "post_link",
    // eventDescription, templates, seoSettings 필드 없음
  },
  {
    key: "3",
    eventId: "3",
    title: "친구 추천 이벤트",
    startDate: "2024-06-15 10:00",
    endDate: "2024-07-15 23:59",
    status: "finished",
    thumbnailUrl:
      "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/NU2%2FM-NU2-10.png?alt=media",
    registeredBy: "박독서",
    registeredAt: "2024-03-10 16:45:00",
    eventType: "internal",
    url: "www.example.com/event/3",
    utm_source: "referral",
    utm_medium: "email",
    utm_campaign: "friend_referral",
    utm_term: "",
    utm_content: "",
    eventDescription:
      "친구를 추천하고 함께 특별한 혜택을 받아가세요! 추천할수록 커지는 보상!",
    templates: [
      {
        id: "TEMPLATE_01",
        type: "HERO_BANNER",
        name: "친구 추천 메인 배너",
        displayOrder: 1,
        imageUrl: "https://via.placeholder.com/600x200.png?text=Event3+Hero",
        backgroundColor: "#F6FFED",
      },
      {
        id: "TEMPLATE_02",
        type: "TEXT_SECTION",
        name: "참여 방법 안내",
        content:
          "1. 친구에게 추천 코드 공유 2. 친구가 가입 시 코드 입력 3. 모두에게 혜택 지급!",
        displayOrder: 2,
        backgroundColor: "#FFFFFF",
      },
      {
        id: "TEMPLATE_03",
        type: "IMAGE_SINGLE",
        name: "혜택 상세 이미지",
        displayOrder: 3,
        imageUrl: "https://via.placeholder.com/300x300.png?text=Event3+Benefit",
        backgroundColor: "",
      },
      {
        id: "TEMPLATE_04",
        type: "PRODUCT_GRID",
        name: "추천 대상 상품",
        displayOrder: 4,
        products: [
          { id: "P101", name: "인기상품A" },
          { id: "P102", name: "인기상품B" },
        ],
        backgroundColor: "#FFF0F6",
      },
      {
        id: "TEMPLATE_05",
        type: "TEXT_SECTION",
        name: "자주 묻는 질문",
        content: "Q: 혜택은 언제 지급되나요? A: 친구 가입 즉시 지급됩니다.",
        displayOrder: 5,
      },
    ],
    seoSettings: {
      ogTitle: "친구 추천하고 쿠폰 받자!",
      ogDescription: "친구도 나도 윈윈하는 특별 이벤트!",
    },
  },
  {
    key: "4",
    eventId: "4",
    title: "설문 조사 참여 이벤트",
    startDate: "2024-07-10 00:00",
    endDate: "2024-07-20 23:59",
    status: "cancelled",
    thumbnailUrl:
      "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/NU2%2FM-NU2-10.png?alt=media",
    registeredBy: "김밀리",
    registeredAt: "2024-03-12 11:20:00",
    eventType: "internal",
    url: "www.example.com/event/4",
    utm_source: "survey_platform",
    utm_medium: "link",
    utm_campaign: "user_feedback",
    utm_term: "",
    utm_content: "survey_1",
    cancelledBy: "박관리",
    cancellationReason: "참여 저조로 인한 이벤트 조기 종료",
    eventDescription:
      "더 나은 서비스를 위한 설문에 참여해주시면 추첨을 통해 소정의 상품을 드립니다.",
    templates: [
      {
        id: "TEMPLATE_01",
        type: "TEXT_SECTION",
        name: "이벤트 개요",
        content: "여러분의 소중한 의견을 들려주세요.",
        displayOrder: 1,
        backgroundColor: "#E6F7FF",
      },
      {
        id: "TEMPLATE_02",
        type: "IMAGE_SINGLE",
        name: "설문 참여 안내 이미지",
        displayOrder: 2,
        imageUrl: "https://via.placeholder.com/400x150.png?text=Event4+Survey",
        backgroundColor: "#FFFBE6",
      },
      {
        id: "TEMPLATE_03",
        type: "TEXT_SECTION",
        name: "예상 소요 시간",
        content: "약 5분 정도 소요됩니다.",
        displayOrder: 3,
        backgroundColor: null,
      },
      {
        id: "TEMPLATE_04",
        type: "TEXT_SECTION",
        name: "경품 안내",
        content: "참여자 중 100명에게 커피 쿠폰 증정!",
        displayOrder: 4,
        backgroundColor: "#F0F2F5",
      },
      {
        id: "TEMPLATE_05",
        type: "HERO_BANNER",
        name: "설문 마감 안내",
        displayOrder: 5,
        imageUrl:
          "https://via.placeholder.com/600x100.png?text=Event4+Deadline",
        backgroundColor: "#FFFFFF",
      },
    ],
    seoSettings: {
      ogTitle: "설문 참여하고 선물받자!",
      ogDescription: "여러분의 의견이 큰 힘이 됩니다.",
    },
  },
  {
    key: "5",
    eventId: "5",
    title: "가을맞이 독서 챌린지 (UTM 없음)",
    startDate: "2024-09-01 00:00",
    endDate: "2025-09-30 23:59",
    status: "active",
    thumbnailUrl:
      "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/NU2%2FM-NU2-10.png?alt=media",
    registeredBy: "최관리",
    registeredAt: "2024-03-13 15:30:00",
    eventType: "internal",
    url: "www.example.com/event/fall-reading-challenge",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
    eventDescription:
      "책 읽기 좋은 계절, 가을! 독서 챌린지에 참여하고 마음의 양식을 쌓아보세요.",
    templates: [
      {
        id: "TEMPLATE_01",
        type: "HERO_BANNER",
        name: "독서 챌린지 메인",
        displayOrder: 1,
        imageUrl:
          "https://via.placeholder.com/600x250.png?text=Event5+Reading+Challenge",
        backgroundColor: "#FFF1E6",
      },
      {
        id: "TEMPLATE_02",
        type: "TEXT_SECTION",
        name: "챌린지 규칙",
        content: "1일 1권 목표! 매일 독서 기록을 남겨주세요.",
        displayOrder: 2,
      },
      {
        id: "TEMPLATE_03",
        type: "PRODUCT_GRID",
        name: "이달의 추천 도서",
        displayOrder: 3,
        products: [
          { id: "B001", name: "책1" },
          { id: "B002", name: "책2" },
          { id: "B003", name: "책3" },
        ],
        backgroundColor: "#F9F0FF",
      },
      {
        id: "TEMPLATE_04",
        type: "IMAGE_SINGLE",
        name: "성공 시 리워드",
        displayOrder: 4,
        imageUrl: "https://via.placeholder.com/300x200.png?text=Event5+Reward",
        backgroundColor: "",
      },
      {
        id: "TEMPLATE_05",
        type: "TEXT_SECTION",
        name: "문의하기",
        content: "챌린지 관련 문의는 고객센터로 연락주세요.",
        displayOrder: 5,
        backgroundColor: "#E6FFFB",
      },
    ],
    seoSettings: {
      ogTitle: "함께 읽어요! 가을 독서 챌린지",
      ogDescription: "독서 목표 달성하고 특별한 선물도 받으세요.",
    },
  },
];

// Status Tag mapping
const statusMap = {
  active: { color: "green", text: "진행 중", icon: <CheckCircleOutlined /> },
  scheduled: { color: "blue", text: "예정", icon: <ClockCircleOutlined /> },
  planned: { color: "green", text: "진행 중", icon: <CheckCircleOutlined /> },
  finished: { color: "default", text: "종료", icon: <CloseCircleOutlined /> },
  cancelled: { color: "red", text: "취소됨", icon: <CloseCircleOutlined /> },
};

// Add visibility status mapping
const visibilityMap = {
  visible: { color: "green", text: "노출", icon: <EyeOutlined /> },
  hidden: { color: "default", text: "숨김", icon: <EyeInvisibleOutlined /> },
};

const eventTypeMap = {
  internal: { text: "일반 이벤트", icon: <ProfileOutlined />, color: "purple" },
  external: {
    text: "외부 페이지 연결",
    icon: <LinkOutlined />,
    color: "volcano",
  },
};

const EventStatus = () => {
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});
  const [isUrlModalVisible, setIsUrlModalVisible] = useState(false);
  const [selectedEventForUrl, setSelectedEventForUrl] = useState(null);
  const [isModalOkLoading, setIsModalOkLoading] = useState(false);
  const [urlFormInstance] = Form.useForm();
  const [tableView, setTableView] = useState("basic");
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelForm] = Form.useForm();

  // Calculate event counts for display
  const displayActiveCount = events.filter(
    (event) => event.status === "active" || event.status === "planned"
  ).length;
  const finishedEventsCount = events.filter(
    (event) => event.status === "finished"
  ).length;

  // Fetch data based on filters
  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = () => {
    setLoading(true);
    console.log("Fetching events with filters:", filters);
    setTimeout(() => {
      // Simulate API delay
      let filteredData = initialEvents;
      if (filters.status) {
        filteredData = filteredData.filter(
          (item) => item.status === filters.status
        );
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredData = filteredData.filter(
          (item) =>
            item.eventId.toLowerCase().includes(searchTerm) ||
            item.title.toLowerCase().includes(searchTerm)
        );
      }
      if (filters.dateRange) {
        const [start, end] = filters.dateRange;
        filteredData = filteredData.filter((item) => {
          const itemStart = new Date(item.startDate);
          const itemEnd = new Date(item.endDate);
          return itemStart <= end && itemEnd >= start;
        });
      }
      if (filters.eventType) {
        filteredData = filteredData.filter(
          (item) => item.eventType === filters.eventType
        );
      }
      setEvents(filteredData);
      setLoading(false);
    }, 500);
  };

  const handleFilterChange = (type, value) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleChangeStatus = (eventId, newStatus) => {
    // console.log(`Changing status of ${eventId} to ${newStatus}`);
    message.info(`'${eventId}' 이벤트 상태 변경 요청 중...`);
    setTimeout(() => {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.eventId === eventId ? { ...evt, status: newStatus } : evt
        )
      );
      message.success(
        `'${eventId}' 이벤트 상태가 '${
          statusMap[newStatus]?.text || newStatus
        }'(으)로 변경되었습니다.`
      );
    }, 500);
  };

  const showUrlModal = (event) => {
    setSelectedEventForUrl(event);
    urlFormInstance.resetFields(); // 폼 초기화
    if (event) {
      // event 객체가 유효할 때만 값 설정
      const hasUtmParams = [
        event.utm_source,
        event.utm_medium,
        event.utm_campaign,
        event.utm_term,
        event.utm_content,
      ].some((param) => param && param.trim() !== ""); // 하나라도 UTM 값이 있는지 확인
      setIsEditingUrl(hasUtmParams); // UTM 값 존재 여부에 따라 수정 모드 설정

      urlFormInstance.setFieldsValue({
        baseUrl: event.url, // 기본 URL 설정
        source: event.utm_source,
        medium: event.utm_medium,
        campaign: event.utm_campaign,
        term: event.utm_term,
        content: event.utm_content,
      });
    } else {
      setIsEditingUrl(false); // 이벤트 객체가 없으면 생성 모드
    }
    setIsUrlModalVisible(true);
  };

  const handleUrlModalCancel = () => {
    setIsUrlModalVisible(false);
    setSelectedEventForUrl(null);
    setIsModalOkLoading(false);
    setIsEditingUrl(false); // 모달 닫을 때 수정 모드 초기화
  };

  const handleUrlModalOk = () => {
    urlFormInstance.submit();
  };

  const handleCancelEvent = (event) => {
    setEventToCancel(event);
    setIsCancelModalVisible(true);
    cancelForm.resetFields();
  };

  const handleCancelConfirm = async () => {
    try {
      const values = await cancelForm.validateFields();
      message.loading({
        content: "이벤트 취소 처리 중...",
        key: "cancelEvent",
      });

      // 실제 API 호출 대신 상태 업데이트로 시뮬레이션
      setTimeout(() => {
        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt.eventId === eventToCancel.eventId
              ? {
                  ...evt,
                  status: "cancelled",
                  cancellationReason: values.reason,
                  cancelledBy: "관리자", // 실제로는 현재 로그인한 사용자 정보를 사용
                }
              : evt
          )
        );

        message.success({
          content: "이벤트가 취소되었습니다.",
          key: "cancelEvent",
        });
        setIsCancelModalVisible(false);
        setEventToCancel(null);
        cancelForm.resetFields();
      }, 500);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancelModalCancel = () => {
    setIsCancelModalVisible(false);
    setEventToCancel(null);
    cancelForm.resetFields();
  };

  const commonColumnsStart = [
    {
      title: "ID",
      dataIndex: "eventId",
      key: "eventId",
      width: 80,
      fixed: "left",
    },
    {
      title: "썸네일",
      dataIndex: "thumbnailUrl",
      key: "thumbnail",
      width: 80,
      align: "center",
      render: (thumbnailUrl, record) =>
        thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={record.title || "이벤트 썸네일"}
            width={50}
            height={50}
            preview
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "이벤트명",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 200,
    },
  ];

  const commonColumnsEnd = [
    {
      title: "관리",
      key: "action",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const isFinishedOrCancelled =
          record.status === "finished" || record.status === "cancelled";
        const isActive = record.status === "active";
        const isScheduled = record.status === "scheduled";

        const menuItemsStructure = [
          <Menu.Item
            key="edit"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedEventForDetail(record);
              setIsDetailModalVisible(true);
            }}
          >
            자세히 보기
          </Menu.Item>,
          <Menu.Item
            key="generate_url"
            icon={<LinkOutlined />}
            onClick={() => showUrlModal(record)}
          >
            URL 관리
          </Menu.Item>,
          <Menu.Divider key="divider1" />,
          <Menu.Item
            key="finish"
            icon={<PauseCircleOutlined />}
            onClick={() => handleChangeStatus(record.eventId, "finished")}
            disabled={!isActive}
          >
            이벤트 종료
          </Menu.Item>,
          <Menu.Item
            key="start"
            icon={<PlayCircleOutlined />}
            onClick={() => handleChangeStatus(record.eventId, "active")}
            disabled={!isScheduled}
          >
            이벤트 시작
          </Menu.Item>,
          <Menu.Divider key="divider2" />,
          <Menu.Item
            key="cancel"
            icon={<CloseCircleOutlined />}
            danger
            onClick={() => handleCancelEvent(record)}
            disabled={isFinishedOrCancelled}
          >
            이벤트 취소
          </Menu.Item>,
        ];

        return (
          <Dropdown
            overlay={<Menu>{menuItemsStructure}</Menu>}
            trigger={["click"]}
          >
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  const basicInfoColumns = [
    // 1. 식별 정보
    {
      title: "ID",
      dataIndex: "eventId",
      key: "eventId",
      width: 80,
      fixed: "left",
    },
    {
      title: "썸네일",
      dataIndex: "thumbnailUrl",
      key: "thumbnail",
      width: 80,
      align: "center",
      render: (thumbnailUrl, record) =>
        thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={record.title || "이벤트 썸네일"}
            width={50}
            height={50}
            preview
            style={{ objectFit: "cover" }}
          />
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "이벤트명",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: 200,
    },
    // 2. 상태 정보
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status, record) => {
        const statusInfo = statusMap[status] || {
          color: "default",
          text: status,
          icon: null,
        };
        const tag = (
          <Tag color={statusInfo.color} icon={statusInfo.icon}>
            {statusInfo.text}
          </Tag>
        );

        if (status === "cancelled") {
          const tooltipTitle = `취소 사유: ${
            record.cancellationReason || "-"
          } (처리자: ${record.cancelledBy || "-"})`;
          return <Tooltip title={tooltipTitle}>{tag}</Tooltip>;
        }
        return tag;
      },
    },
    {
      title: "노출",
      dataIndex: "visible",
      key: "visible",
      width: 100,
      render: (visible, record) => (
        <Switch
          checked={visible}
          onChange={() => handleToggleVisibility(record)}
          checkedChildren="노출"
          unCheckedChildren="숨김"
          size="small"
        />
      ),
    },
    // 3. 시간 정보
    {
      title: "시작일시",
      dataIndex: "startDate",
      key: "startDate",
      width: 160,
    },
    {
      title: "종료일시",
      dataIndex: "endDate",
      key: "endDate",
      width: 200,
      render: (text, record) => {
        const startDate = moment(record.startDate);
        const endDate = moment(record.endDate);
        const duration = endDate.diff(startDate, "days") + 1;
        return (
          <>
            {text}
            <br />
            <Text type="secondary" style={{ fontSize: "0.85em" }}>
              {`(총 ${duration}일)`}
            </Text>
          </>
        );
      },
    },
    {
      title: "남은 기간",
      key: "remainingTime",
      width: 150,
      render: (text, record) => {
        const endDate = moment(record.endDate);
        const now = moment();
        if (record.status === "finished") return <Tag>종료</Tag>;
        if (record.status === "cancelled") return <Tag color="red">취소됨</Tag>;
        if (endDate.isBefore(now, "day"))
          return <Tag color="default">기한 지남</Tag>;
        if (endDate.isSame(now, "day")) {
          const diffMinutes = endDate.diff(now, "minutes");
          if (diffMinutes <= 0) return <Tag color="default">오늘 종료됨</Tag>;
          const hours = Math.floor(diffMinutes / 60);
          const minutes = diffMinutes % 60;
          return (
            <Tag color="orange">
              {hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분 남음`}
            </Tag>
          );
        }
        const diffDays = endDate.diff(now, "days") + 1;
        return <Tag color="blue">D-{diffDays}</Tag>;
      },
    },
    // 4. 상세 정보
    {
      title: "이벤트 유형",
      dataIndex: "eventType",
      key: "eventType",
      width: 150,
      render: (type) => {
        const typeInfo = eventTypeMap[type] || {
          text: type,
          icon: null,
          color: "default",
        };
        return (
          <Tag color={typeInfo.color} icon={typeInfo.icon}>
            {typeInfo.text}
          </Tag>
        );
      },
      filters: Object.entries(eventTypeMap).map(([key, { text }]) => ({
        text: text,
        value: key,
      })),
      onFilter: (value, record) => record.eventType === value,
    },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      width: 200,
      ellipsis: true,
      render: (url) =>
        url ? (
          <Tooltip title={url}>
            <a
              href={!url.startsWith("http") ? `http://${url}` : url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    // 5. 관리 정보
    {
      title: "등록",
      dataIndex: "registeredBy",
      key: "registeredBy",
      width: 100,
    },
    ...commonColumnsEnd,
  ];

  const utmColumns = [
    ...commonColumnsStart,
    {
      title: "URL (원본)",
      dataIndex: "url",
      key: "original_url",
      width: 200,
      ellipsis: true,
      render: (url) =>
        url ? (
          <Tooltip title={url}>
            <a
              href={!url.startsWith("http") ? `http://${url}` : url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </Tooltip>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: "UTM Source",
      dataIndex: "utm_source",
      key: "utm_source",
      width: 150,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "UTM Medium",
      dataIndex: "utm_medium",
      key: "utm_medium",
      width: 150,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "UTM Campaign",
      dataIndex: "utm_campaign",
      key: "utm_campaign",
      width: 180,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "UTM Term",
      dataIndex: "utm_term",
      key: "utm_term",
      width: 150,
      ellipsis: true,
      render: (text) => text || "-",
    },
    {
      title: "UTM Content",
      dataIndex: "utm_content",
      key: "utm_content",
      width: 150,
      ellipsis: true,
      render: (text) => text || "-",
    },
    ...commonColumnsEnd,
  ];

  // Add visibility toggle handler
  const handleToggleVisibility = (event) => {
    message.loading({
      content: "노출 상태 변경 중...",
      key: "toggleVisibility",
    });

    setTimeout(() => {
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.eventId === event.eventId
            ? { ...evt, visible: !evt.visible }
            : evt
        )
      );

      message.success({
        content: `이벤트가 ${
          event.visible ? "숨김" : "노출"
        } 상태로 변경되었습니다.`,
        key: "toggleVisibility",
      });
    }, 500);
  };

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Title level={2}>
        <CalendarOutlined /> 이벤트 상태 관리
      </Title>
      <Text>등록된 이벤트의 진행 상태를 확인하고 관리합니다.</Text>

      <Space style={{ marginTop: 0, marginBottom: 0 }}>
        <Text strong>이벤트 요약:</Text>
        <Tag
          color="green"
          onClick={() => handleFilterChange("status", "active")}
          style={{ cursor: "pointer", padding: "4px 10px", fontSize: "14px" }}
        >
          진행 중 {displayActiveCount}건
        </Tag>
        <Tag
          color="default"
          onClick={() => handleFilterChange("status", "finished")}
          style={{ cursor: "pointer", padding: "4px 10px", fontSize: "14px" }}
        >
          종료됨 {finishedEventsCount}건
        </Tag>
      </Space>

      <Space
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
        wrap
      >
        <Space wrap>
          <Input.Search
            placeholder="이벤트 ID 또는 이름 검색"
            allowClear
            onSearch={(value) => handleFilterChange("search", value)}
            onChange={(e) =>
              !e.target.value && handleFilterChange("search", "")
            }
            style={{ width: 250 }}
          />
          <Select
            placeholder="유형 필터"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => handleFilterChange("eventType", value)}
            value={filters.eventType || undefined}
          >
            {Object.entries(eventTypeMap).map(([key, { text }]) => (
              <Option key={key} value={key}>
                {text}
              </Option>
            ))}
          </Select>
          <DatePicker.RangePicker
            onChange={(dates) => handleFilterChange("dateRange", dates)}
            value={filters.dateRange || null}
          />
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
            필터 초기화
          </Button>
        </Space>
        <Radio.Group
          onChange={(e) => setTableView(e.target.value)}
          value={tableView}
          buttonStyle="solid"
        >
          <Radio.Button value="basic">기본 정보</Radio.Button>
          <Radio.Button value="utm">UTM 정보</Radio.Button>
        </Radio.Group>
      </Space>

      <Table
        columns={tableView === "basic" ? basicInfoColumns : utmColumns}
        dataSource={events}
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: tableView === "basic" ? 1730 : 1530 }} // UTM 뷰 컬럼 수에 맞게 x 스크롤 조정
        bordered
        size="small"
        rowKey="key"
      />

      {selectedEventForUrl && (
        <Modal
          title={`[${selectedEventForUrl.title}] URL ${
            isEditingUrl ? "수정" : "생성"
          }`}
          visible={isUrlModalVisible}
          onCancel={handleUrlModalCancel}
          width={700}
          destroyOnClose
          footer={[
            <Button
              key="submit"
              type="primary"
              loading={isModalOkLoading}
              onClick={handleUrlModalOk}
            >
              URL {isEditingUrl ? "수정" : "생성"}
            </Button>,
          ]}
        >
          <UrlGenerationForm
            eventData={selectedEventForUrl}
            form={urlFormInstance}
            onSetLoading={setIsModalOkLoading}
          />
        </Modal>
      )}

      {/* 이벤트 상세 정보 모달 */}
      {selectedEventForDetail && (
        <Modal
          title={`이벤트 상세: ${selectedEventForDetail.title}`}
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width="70%"
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <Title level={4} style={{ marginBottom: 16 }}>
            기본 정보
          </Title>
          <Descriptions
            bordered
            column={1}
            size="small"
            style={{ marginBottom: 24 }}
          >
            <Descriptions.Item label="이벤트 ID">
              {selectedEventForDetail.eventId}
            </Descriptions.Item>
            <Descriptions.Item label="이벤트명">
              {selectedEventForDetail.title}
            </Descriptions.Item>
            <Descriptions.Item label="이벤트 유형">
              <Tag
                color={eventTypeMap[selectedEventForDetail.eventType]?.color}
                icon={eventTypeMap[selectedEventForDetail.eventType]?.icon}
              >
                {eventTypeMap[selectedEventForDetail.eventType]?.text ||
                  selectedEventForDetail.eventType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="이벤트 기간">
              {`${moment(selectedEventForDetail.startDate).format(
                "YYYY-MM-DD HH:mm"
              )} ~ ${moment(selectedEventForDetail.endDate).format(
                "YYYY-MM-DD HH:mm"
              )}`}
              <Text type="secondary" style={{ marginLeft: 8 }}>
                {`(총 ${
                  moment(selectedEventForDetail.endDate).diff(
                    moment(selectedEventForDetail.startDate),
                    "days"
                  ) + 1
                }일)`}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="상태">
              <Tag
                color={statusMap[selectedEventForDetail.status]?.color}
                icon={statusMap[selectedEventForDetail.status]?.icon}
              >
                {statusMap[selectedEventForDetail.status]?.text ||
                  selectedEventForDetail.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="등록자">
              {selectedEventForDetail.registeredBy}
            </Descriptions.Item>
            <Descriptions.Item label="등록일">
              {selectedEventForDetail.registeredAt
                ? moment(selectedEventForDetail.registeredAt).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="기본 URL">
              {selectedEventForDetail.url ? (
                <a
                  href={
                    !selectedEventForDetail.url.startsWith("http")
                      ? `http://${selectedEventForDetail.url}`
                      : selectedEventForDetail.url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {selectedEventForDetail.url}
                </a>
              ) : (
                "-"
              )}
            </Descriptions.Item>
            {selectedEventForDetail.status === "cancelled" && (
              <Descriptions.Item label="취소 정보" span={1}>
                <Text>
                  취소 사유: {selectedEventForDetail.cancellationReason || "-"}{" "}
                  <br />
                  처리자: {selectedEventForDetail.cancelledBy || "-"}
                </Text>
              </Descriptions.Item>
            )}
          </Descriptions>

          {selectedEventForDetail.eventType === "internal" && (
            <>
              {selectedEventForDetail.seoSettings && (
                <>
                  <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
                    SEO 및 공유 설정
                  </Title>
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item
                      label={
                        <Space>
                          페이지 제목
                          <Tooltip title="브라우저 탭이나 검색 결과에 표시될 제목입니다. HTML <title> 태그에 들어갑니다.">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                    >
                      {selectedEventForDetail.seoSettings.seoTitle || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          공유 제목 (OG:Title)
                          <Tooltip title="SNS, 메신저에 공유될 때 표시될 제목입니다.">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                    >
                      {selectedEventForDetail.seoSettings.ogTitle || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          공유/검색 설명 (OG/Meta Description)
                          <Tooltip title="SNS 공유 및 검색 결과에 표시될 상세 설명입니다.">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                    >
                      {selectedEventForDetail.seoSettings.ogDescription || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          공유 이미지 URL (OG:Image)
                          <Tooltip title="SNS 공유 시 표시될 대표 이미지 URL입니다. 입력하지 않으면 썸네일이 사용될 수 있습니다.">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                    >
                      {selectedEventForDetail.seoSettings.ogImage ? (
                        <Image
                          src={selectedEventForDetail.seoSettings.ogImage}
                          alt="OG Image"
                          width={100}
                        />
                      ) : (
                        "-"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          대표 URL (OG:Url)
                          <Tooltip title="이벤트 페이지의 대표(canonical) URL입니다.">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                    >
                      {selectedEventForDetail.seoSettings.ogUrl ? (
                        <a
                          href={
                            !selectedEventForDetail.seoSettings.ogUrl.startsWith(
                              "http"
                            )
                              ? `http://${selectedEventForDetail.seoSettings.ogUrl}`
                              : selectedEventForDetail.seoSettings.ogUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedEventForDetail.seoSettings.ogUrl}
                        </a>
                      ) : (
                        "-"
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          콘텐츠 타입 (OG:Type)
                          <Tooltip title="이벤트 페이지의 콘텐츠 유형을 지정합니다.">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                    >
                      {selectedEventForDetail.seoSettings.ogType || "-"}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={
                        <Space>
                          메타 키워드
                          <Tooltip title="검색엔진 참조용 키워드입니다. HTML <meta name='keywords'> 태그에 들어갑니다. (선택 사항)">
                            <InfoCircleOutlined />
                          </Tooltip>
                        </Space>
                      }
                    >
                      {selectedEventForDetail.seoSettings.metaKeywords || "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </>
              )}
              {!selectedEventForDetail.seoSettings &&
                selectedEventForDetail.eventType === "internal" && (
                  <>
                    <Title
                      level={4}
                      style={{ marginTop: 24, marginBottom: 16 }}
                    >
                      SEO 및 공유 설정
                    </Title>
                    <Text type="secondary">
                      SEO 정보가 설정되지 않았습니다.
                    </Text>
                  </>
                )}

              {selectedEventForDetail.templates &&
                selectedEventForDetail.templates.length > 0 && (
                  <>
                    <Title
                      level={4}
                      style={{ marginTop: 24, marginBottom: 16 }}
                    >
                      템플릿 목록
                    </Title>
                    <div
                      style={{
                        display: "flex",
                        overflowX: "auto",
                        paddingBottom: "16px",
                        gap: "16px",
                      }}
                    >
                      {selectedEventForDetail.templates
                        .sort(
                          (a, b) =>
                            (a.displayOrder || 0) - (b.displayOrder || 0)
                        )
                        .map((template) => (
                          <Card
                            key={template.id}
                            title={`${template.name} (ID: ${template.id})`}
                            style={{
                              width: 500,
                              flexShrink: 0,
                            }}
                          >
                            <Descriptions bordered column={1} size="small">
                              <Descriptions.Item label="유형">
                                {template.type}
                              </Descriptions.Item>
                              <Descriptions.Item label="순서">
                                {template.displayOrder}
                              </Descriptions.Item>
                              <Descriptions.Item label="배경색">
                                {template.backgroundColor ? (
                                  <Space>
                                    <div
                                      style={{
                                        width: 16,
                                        height: 16,
                                        backgroundColor:
                                          template.backgroundColor,
                                        border: "1px solid #d9d9d9",
                                      }}
                                    />
                                    <span>{template.backgroundColor}</span>
                                  </Space>
                                ) : (
                                  "-"
                                )}
                              </Descriptions.Item>
                              {template.imageUrl && (
                                <Descriptions.Item label="이미지">
                                  <Image
                                    src={template.imageUrl}
                                    alt={template.name}
                                    width={100}
                                  />
                                </Descriptions.Item>
                              )}
                              {template.type === "TEXT_SECTION" && (
                                <Descriptions.Item label="내용">
                                  {template.content || "-"}
                                </Descriptions.Item>
                              )}
                              <Descriptions.Item label="클릭 연결">
                                {template.isClickable ? "사용" : "미사용"}
                              </Descriptions.Item>
                              {template.isClickable && (
                                <Descriptions.Item label="연결 URL">
                                  {template.clickUrl ? (
                                    <a
                                      href={
                                        !template.clickUrl.startsWith("http")
                                          ? `http://${template.clickUrl}`
                                          : template.clickUrl
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {template.clickUrl}
                                    </a>
                                  ) : (
                                    "-"
                                  )}
                                </Descriptions.Item>
                              )}
                            </Descriptions>
                          </Card>
                        ))}
                    </div>
                  </>
                )}
              {(!selectedEventForDetail.templates ||
                selectedEventForDetail.templates.length === 0) &&
                selectedEventForDetail.eventType === "internal" && (
                  <>
                    <Title
                      level={4}
                      style={{ marginTop: 24, marginBottom: 16 }}
                    >
                      템플릿 목록
                    </Title>
                    <Text type="secondary">등록된 템플릿이 없습니다.</Text>
                  </>
                )}
            </>
          )}
        </Modal>
      )}

      {/* 이벤트 취소 확인 모달 */}
      <Modal
        title={
          <Space direction="vertical" size={0}>
            <Text strong>{eventToCancel?.title}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {eventToCancel?.startDate && eventToCancel?.endDate
                ? `${moment(eventToCancel.startDate).format(
                    "YYYY-MM-DD HH:mm"
                  )} ~ ${moment(eventToCancel.endDate).format(
                    "YYYY-MM-DD HH:mm"
                  )}`
                : "-"}
            </Text>
          </Space>
        }
        open={isCancelModalVisible}
        onOk={handleCancelConfirm}
        onCancel={handleCancelModalCancel}
        okText="취소하기"
        okButtonProps={{ danger: true }}
        footer={[
          <Button
            key="submit"
            type="primary"
            danger
            onClick={handleCancelConfirm}
          >
            취소하기
          </Button>,
        ]}
      >
        <Form form={cancelForm} layout="vertical">
          <Form.Item
            name="reason"
            label="취소 사유"
            rules={[
              {
                required: true,
                message: "취소 사유를 입력해주세요.",
              },
              {
                min: 10,
                message: "취소 사유는 최소 10자 이상 입력해주세요.",
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="이벤트 취소 사유를 상세히 입력해주세요."
            />
          </Form.Item>
          <Text type="secondary">
            * 취소된 이벤트는 복구할 수 없으며, 취소 사유는 이벤트 상세 정보에
            기록됩니다.
          </Text>
        </Form>
      </Modal>
    </Space>
  );
};

export default EventStatus;
