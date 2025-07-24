import { Menu } from "antd";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
// 아이콘 임포트 (예시 - 필요에 따라 추가/변경)
import {
    ApartmentOutlined,
    ApiOutlined,
    AreaChartOutlined,
    BellOutlined,
    BlockOutlined,
    BookOutlined,
    CalendarOutlined,
    CheckSquareOutlined,
    CustomerServiceOutlined,
    DatabaseOutlined,
    DollarCircleOutlined,
    EditOutlined,
    EyeOutlined,
    FileProtectOutlined,
    FileTextOutlined,
    FormOutlined,
    FundViewOutlined,
    HistoryOutlined,
    MailOutlined,
    MessageOutlined,
    NotificationOutlined,
    OrderedListOutlined,
    PictureOutlined,
    PieChartOutlined,
    ProfileOutlined,
    QuestionCircleOutlined,
    SecurityScanOutlined,
    SettingOutlined,
    SolutionOutlined,
    StarOutlined,
    TagOutlined,
    TagsOutlined,
    TeamOutlined,
    TrophyOutlined,
    UsergroupAddOutlined,
    UserOutlined,
    UserSwitchOutlined,
    WarningOutlined,
} from "@ant-design/icons";

// 메뉴 데이터 구조화 (key 추가, 아이콘 추가)
const menuItems = [
  {
    key: "/dashboard",
    path: "/dashboard",
    name: "대시보드",
    icon: <PieChartOutlined />,
  },
  {
    key: "/content", // SubMenu의 key
    name: "콘텐츠 관리",
    icon: <BookOutlined />,
    subMenu: [
      {
        key: "/content/books",
        path: "/content/books",
        name: "도서 관리",
        icon: <BookOutlined />,
      },

      {
        key: "/content/series-management",
        path: "/content/series-management",
        name: "시리즈 관리",
        icon: <ApartmentOutlined />,
      },
      {
        key: "/content/metadata",
        path: "/content/metadata",
        name: "메타데이터 관리",
        icon: <DatabaseOutlined />,
      },
      {
        key: "/content/curation",
        path: "/content/curation",
        name: "큐레이션 관리",
        icon: <TagsOutlined />,
      },
      {
        key: "/content/categories",
        path: "/content/categories",
        name: "카테고리 관리",
        icon: <TagOutlined />,
      },
      {
        key: "/content/keywords",
        path: "/content/keywords",
        name: "키워드 관리",
        icon: <TagsOutlined />,
      },
      {
        key: "/content/review-keywords",
        path: "/content/review-keywords",
        name: "키워드 관리(리뷰)",
        icon: <StarOutlined />,
      },
      {
        key: "/content/keyword-preferences",
        path: "/content/keyword-preferences",
        name: "키워드별 선호도 통계",
        icon: <AreaChartOutlined />,
      },
      {
        key: "/content/analysis",
        path: "/content/analysis",
        name: "도서 통계",
        icon: <BookOutlined />,
      },
    ],
  },
  {
    key: "/self-publishing",
    name: "자가출판",
    icon: <EditOutlined />,
    subMenu: [
      {
        key: "/self-publishing/approval",
        path: "/self-publishing/approval",
        name: "심사",
        icon: <CheckSquareOutlined />,
      },
      {
        key: "/self-publishing/authors",
        path: "/self-publishing/authors",
        name: "작가 정보 관리",
        icon: <SolutionOutlined />,
      },
      {
        key: "/self-publishing/works",
        path: "/self-publishing/works",
        name: "작품 목록",
        icon: <OrderedListOutlined />,
      },
    ],
  },
  {
    key: "/users",
    name: "회원 관리",
    icon: <UserOutlined />,
    subMenu: [
      {
        key: "/users/info",
        path: "/users/info",
        name: "회원 정보",
        icon: <ProfileOutlined />,
      },
      {
        key: "/users/subscriptions",
        path: "/users/subscriptions",
        name: "구독 내역",
        icon: <HistoryOutlined />,
      },
      {
        key: "/users/sanctions",
        path: "/users/sanctions",
        name: "계정 제재",
        icon: <WarningOutlined />,
      },
      {
        key: "/users/badges",
        path: "/users/badges",
        name: "회원 배지 관리",
        icon: <TrophyOutlined />,
      },
    ],
  },
  {
    key: "/reports",
    name: "신고 관리",
    icon: <WarningOutlined />,
    subMenu: [
      {
        key: "/reports/list",
        path: "/reports/list",
        name: "신고 접수 및 심사",
        icon: <OrderedListOutlined />,
      },
      {
        key: "/reports/settings",
        path: "/reports/settings",
        name: "신고 정책 관리",
        icon: <SettingOutlined />,
      },
    ],
  },
  {
    key: "/notifications",
    name: "알림 관리",
    icon: <NotificationOutlined />,
    subMenu: [
      {
        key: "/notifications/dispatch",
        path: "/notifications/dispatch",
        name: "알림 발송",
        icon: <BellOutlined />,
      },
      {
        key: "/notifications/templates",
        path: "/notifications/templates",
        name: "알림 템플릿",
        icon: <FileTextOutlined />,
      },
      {
        key: "/notifications/history",
        path: "/notifications/history",
        name: "발송 내역",
        icon: <HistoryOutlined />,
      },
      {
        key: "/notifications/groups",
        path: "/notifications/groups",
        name: "발송 대상 그룹 관리",
        icon: <UsergroupAddOutlined />,
      },
    ],
  },
  {
    key: "/email",
    name: "이메일 관리",
    icon: <MailOutlined />,
    subMenu: [
      {
        key: "/email/templates",
        path: "/email/templates",
        name: "이메일 템플릿 등록",
        icon: <FormOutlined />,
      },
      {
        key: "/email/operations",
        path: "/email/operations",
        name: "이메일 템플릿 운영",
        icon: <EyeOutlined />,
      }
    ]
  },
  {
    key: "/popups",
    name: "팝업 관리",
    icon: <BlockOutlined />,
    subMenu: [
      {
        key: "/popups/create",
        path: "/popups/create",
        name: "팝업 생성",
        icon: <FormOutlined />,
      },
      {
        key: "/popups/templates",
        path: "/popups/templates",
        name: "템플릿 관리",
        icon: <FileTextOutlined />,
      },
      {
        key: "/popups/settings",
        path: "/popups/settings",
        name: "노출 설정",
        icon: <SettingOutlined />,
      },
    ],
  },
  {
    key: "/notices",
    name: "공지사항 관리",
    icon: <MessageOutlined />, // 아이콘 변경 가능
    subMenu: [
      {
        key: "/notices/manage",
        path: "/notices/manage",
        name: "게시 관리",
        icon: <OrderedListOutlined />,
      },
      {
        key: "/notices/history",
        path: "/notices/history",
        name: "노출 내역",
        icon: <HistoryOutlined />,
      },
    ],
  },
  {
    key: "/events",
    name: "이벤트 관리",
    icon: <CalendarOutlined />,
    subMenu: [
      {
        key: "/events/register",
        path: "/events/register",
        name: "이벤트 등록",
        icon: <FormOutlined />,
      },
      {
        key: "/events/status",
        path: "/events/status",
        name: "이벤트 상태",
        icon: <CheckSquareOutlined />,
      },
    ],
  },
  {
    key: "/fixed-content",
    name: "고정 이벤트 관리",
    icon: <FileTextOutlined />,
    subMenu: [
      {
        key: "/fixed-content/book-ranking",
        path: "/fixed-content/book-ranking",
        name: "도서 랭킹 관리",
        icon: <OrderedListOutlined />,
      },
      {
        key: "/fixed-content/new-books",
        path: "/fixed-content/new-books",
        name: "신규 도서 관리",
        icon: <BookOutlined />,
      },
      {
        key: "/fixed-content/new-audiobooks",
        path: "/fixed-content/new-audiobooks",
        name: "신규 오디오북 관리",
        icon: <CustomerServiceOutlined />,
      },
    ],
  },
  {
    key: "/coupons",
    name: "쿠폰 관리",
    icon: <TagsOutlined />,
    subMenu: [
      {
        key: "/coupons/list",
        path: "/coupons/list",
        name: "쿠폰 목록",
        icon: <OrderedListOutlined />,
      },
      {
        key: "/coupons/register",
        path: "/coupons/register",
        name: "쿠폰 등록",
        icon: <FormOutlined />,
      },
    ],
  },
  {
    key: "/banner",
    name: "배너 관리",
    icon: <PictureOutlined />,
    subMenu: [
      {
        key: "/banner/list",
        path: "/banner/list",
        name: "배너 목록",
        icon: <OrderedListOutlined />,
      },
      {
        key: "/banner/register",
        path: "/banner/register",
        name: "배너 등록",
        icon: <FormOutlined />,
      },
    ],
  },
  {
    key: "/inquiries",
    name: "문의사항 관리",
    icon: <MessageOutlined />,
    subMenu: [
      {
        key: "/inquiries/list",
        path: "/inquiries/list",
        name: "문의 조회",
        icon: <OrderedListOutlined />,
      },
      {
        key: "/inquiries/faq",
        path: "/inquiries/faq",
        name: "FAQ 관리",
        icon: <QuestionCircleOutlined />,
      },
    ],
  },
  {
    key: "/user-analysis",
    name: "사용자 분석",
    icon: <UserOutlined />,
    subMenu: [
      {
        key: "/user-analysis/statistics",
        path: "/user-analysis/statistics",
        name: "사용자 통계",
        icon: <UserOutlined />,
      },
      {
        key: "/user-analysis/visits",
        path: "/user-analysis/visits",
        name: "방문 통계",
        icon: <PieChartOutlined />,
      },
    ],
  },
  {
    key: "/analysis",
    name: "데이터 분석",
    icon: <AreaChartOutlined />,
    subMenu: [
      {
        key: "/analysis/campaign",
        path: "/analysis/campaign",
        name: "알림/팝업/이벤트 효과",
        icon: <FundViewOutlined />,
      },
      {
        key: "/analysis/reports",
        path: "/analysis/reports",
        name: "리포트 생성",
        icon: <FileTextOutlined />,
      },
    ],
  },
  {
    key: "/settings",
    name: "시스템 설정",
    icon: <SettingOutlined />,
    subMenu: [
      {
        key: "/settings/permissions",
        path: "/settings/permissions",
        name: "권한 관리",
        icon: <UserSwitchOutlined />,
      },
      {
        key: "/settings/admin-activity-log",
        path: "/settings/admin-activity-log",
        name: "관리자 활동 내역",
        icon: <HistoryOutlined />,
      },
      {
        key: "/settings/api",
        path: "/settings/api",
        name: "API 관리",
        icon: <ApiOutlined />,
      },
      {
        key: "/settings/security",
        path: "/settings/security",
        name: "보안 설정",
        icon: <SecurityScanOutlined />,
      },
      {
        key: "/settings/policy",
        path: "/settings/policy",
        name: "서비스 정책",
        icon: <FileProtectOutlined />,
      },
      {
        key: "/settings/version-history",
        path: "/settings/version-history",
        name: "플랫폼 버전 히스토리",
        icon: <HistoryOutlined />,
      },
    ],
  },
  {
    key: "/partners",
    name: "파트너 관리",
    icon: <TeamOutlined />,
    subMenu: [
      {
        key: "/partners/accounts",
        path: "/partners/accounts",
        name: "파트너 계정",
        icon: <SolutionOutlined />,
      },
      {
        key: "/partners/settlement",
        path: "/partners/settlement",
        name: "정산 관리",
        icon: <DollarCircleOutlined />,
      },
      {
        key: "/partners/inquiries",
        path: "/partners/inquiries",
        name: "문의 관리",
        icon: <MessageOutlined />,
      },
    ],
  },
];

// 메뉴 아이템 렌더링 함수
const renderMenuItems = (items) => {
  return items.map((item) => {
    if (item.subMenu && item.subMenu.length > 0) {
      return (
        <Menu.SubMenu key={item.key} icon={item.icon} title={item.name}>
          {renderMenuItems(item.subMenu)}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={item.path} icon={item.icon}>
          <Link to={item.path}>{item.name}</Link>
        </Menu.Item>
      );
    }
  });
};

const Sidebar = () => {
  const location = useLocation(); // 현재 위치 정보 가져오기
  const currentPath = location.pathname;

  // 현재 경로에 맞는 SubMenu 키 찾기
  const findInitialOpenKeys = (path) => {
    for (const item of menuItems) {
      if (item.subMenu) {
        const foundSubItem = item.subMenu.find((sub) =>
          path.startsWith(sub.path)
        );
        if (foundSubItem) {
          return [item.key]; // 부모 메뉴의 key 반환
        }
      }
    }
    return []; // 해당 없으면 빈 배열
  };

  // 열린 메뉴 상태 관리
  const [openKeys, setOpenKeys] = useState(findInitialOpenKeys(currentPath));

  // SubMenu 열림/닫힘 핸들러 (아코디언 동작)
  const handleOpenChange = (keys) => {
    // menuItems에서 최상위 SubMenu 키 목록 생성
    const rootSubmenuKeys = menuItems
      .filter((item) => item.subMenu && item.subMenu.length > 0)
      .map((item) => item.key);

    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);

    // 최신으로 열린 키가 rootSubmenuKeys에 포함되어 있다면 해당 키만 열린 상태로 설정
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) {
      setOpenKeys([latestOpenKey]);
    } else {
      // 그렇지 않으면 (예: 하위 메뉴 클릭 또는 메뉴 닫기) 현재 keys 배열 사용 (Ant Design 기본 동작 유지 또는 수정 가능)
      // 여기서는 마지막으로 열린 키만 유지하도록 설정 (아코디언 효과)
      // 만약 모든 메뉴가 닫혔다면 빈 배열로 설정
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Menu
      theme="dark" // 다크 테마 적용
      mode="inline"
      selectedKeys={[currentPath]} // 현재 경로를 selectedKeys로 설정
      openKeys={openKeys} // 상태로 관리되는 열린 키
      onOpenChange={handleOpenChange} // 열림/닫힘 변경 핸들러 연결
      style={{ height: "calc(100% - 64px)", borderRight: 0 }} // 로고 높이만큼 빼기
    >
      {renderMenuItems(menuItems)}
    </Menu>
  );
};

export default Sidebar;
