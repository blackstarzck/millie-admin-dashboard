import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AutoComplete, Input, Menu } from "antd";
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
  SoundOutlined,
  StarOutlined,
  TagOutlined,
  TagsOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
  UserSwitchOutlined,
  WarningOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const menuItems = [
  { key: "/dashboard", path: "/dashboard", name: "대시보드", icon: <PieChartOutlined /> },
  {
    key: "/content",
    name: "콘텐츠 관리",
    icon: <BookOutlined />,
    subMenu: [
      { key: "/content/books", path: "/content/books", name: "도서 관리", icon: <BookOutlined /> },
      { key: "/content/series-management", path: "/content/series-management", name: "시리즈 관리", icon: <ApartmentOutlined /> },
      { key: "/content/metadata", path: "/content/metadata", name: "메타데이터 관리", icon: <DatabaseOutlined /> },
      { key: "/content/curation", path: "/content/curation", name: "큐레이션 관리", icon: <TagsOutlined /> },
      { key: "/content/categories", path: "/content/categories", name: "카테고리 관리", icon: <TagOutlined /> },
      { key: "/content/keywords", path: "/content/keywords", name: "키워드 관리", icon: <TagsOutlined /> },
      { key: "/content/review-keywords", path: "/content/review-keywords", name: "리뷰 키워드 관리", icon: <StarOutlined /> },
      { key: "/content/keyword-preferences", path: "/content/keyword-preferences", name: "키워드별 선호 통계", icon: <AreaChartOutlined /> },
      { key: "/content/analysis", path: "/content/analysis", name: "도서 통계", icon: <BookOutlined /> },
      { key: "/content/unsubscribe", path: "/content/unsubscribe", name: "구독 해지 관리", icon: <FileProtectOutlined /> },
    ],
  },
  {
    key: "/self-publishing",
    name: "자기출판",
    icon: <EditOutlined />,
    subMenu: [
      { key: "/self-publishing/approval", path: "/self-publishing/approval", name: "승인", icon: <CheckSquareOutlined /> },
      { key: "/self-publishing/authors", path: "/self-publishing/authors", name: "저자 정보 관리", icon: <SolutionOutlined /> },
      { key: "/self-publishing/works", path: "/self-publishing/works", name: "작품 목록", icon: <OrderedListOutlined /> },
    ],
  },
  {
    key: "/users",
    name: "회원 관리",
    icon: <UserOutlined />,
    subMenu: [
      { key: "/users/info", path: "/users/info", name: "회원 정보", icon: <ProfileOutlined /> },
      { key: "/users/subscriptions", path: "/users/subscriptions", name: "구독 이력", icon: <HistoryOutlined /> },
      { key: "/users/sanctions", path: "/users/sanctions", name: "계정 제재", icon: <WarningOutlined /> },
      { key: "/users/badges", path: "/users/badges", name: "배지 관리", icon: <TrophyOutlined /> },
    ],
  },
  {
    key: "/reports",
    name: "신고 관리",
    icon: <WarningOutlined />,
    subMenu: [
      { key: "/reports/list", path: "/reports/list", name: "신고 접수/조사", icon: <OrderedListOutlined /> },
      { key: "/reports/settings", path: "/reports/settings", name: "신고 정책 관리", icon: <SettingOutlined /> },
    ],
  },
  {
    key: "/notifications",
    name: "알림 관리",
    icon: <NotificationOutlined />,
    subMenu: [
      { key: "/notifications/dispatch", path: "/notifications/dispatch", name: "알림 발송", icon: <BellOutlined /> },
      { key: "/notifications/history", path: "/notifications/history", name: "발송 이력", icon: <HistoryOutlined /> },
      { key: "/notifications/templates", path: "/notifications/templates", name: "알림 템플릿", icon: <FileTextOutlined /> },
      { key: "/notifications/groups", path: "/notifications/groups", name: "발송 그룹 관리", icon: <TeamOutlined /> },
    ],
  },
  {
    key: "/popups",
    name: "팝업 관리",
    icon: <MessageOutlined />,
    subMenu: [
      { key: "/popups/create", path: "/popups/create", name: "팝업 생성", icon: <FormOutlined /> },
      { key: "/popups/templates", path: "/popups/templates", name: "템플릿 관리", icon: <FileTextOutlined /> },
      { key: "/popups/settings", path: "/popups/settings", name: "노출 설정", icon: <SettingOutlined /> },
      { key: "/popups/history", path: "/popups/history", name: "노출 이력", icon: <HistoryOutlined /> },
    ],
  },
  {
    key: "/notices",
    name: "공지/게시 관리",
    icon: <SoundOutlined />,
    subMenu: [
      { key: "/notices/manage", path: "/notices/manage", name: "게시 관리", icon: <OrderedListOutlined /> },
      { key: "/notices/history", path: "/notices/history", name: "게시 이력", icon: <HistoryOutlined /> },
    ],
  },
  {
    key: "/events",
    name: "이벤트 관리",
    icon: <CalendarOutlined />,
    subMenu: [
      { key: "/events/register", path: "/events/register", name: "이벤트 등록", icon: <FormOutlined /> },
      { key: "/events/status", path: "/events/status", name: "이벤트 상태", icon: <CheckSquareOutlined /> },
    ],
  },
  {
    key: "/fixed-content",
    name: "랭킹/인기도서 관리",
    icon: <FileTextOutlined />,
    subMenu: [
      { key: "/fixed-content/book-ranking", path: "/fixed-content/book-ranking", name: "랭킹 관리", icon: <OrderedListOutlined /> },
      { key: "/fixed-content/genre-popular-books", path: "/fixed-content/genre-popular-books", name: "장르별 인기 도서 관리", icon: <BookOutlined /> },
      { key: "/fixed-content/genre-popular-audiobooks", path: "/fixed-content/genre-popular-audiobooks", name: "장르별 인기 오디오북 관리", icon: <CustomerServiceOutlined /> },
    ],
  },
  {
    key: "/coupons",
    name: "쿠폰 관리",
    icon: <TagsOutlined />,
    subMenu: [
      { key: "/coupons/list", path: "/coupons/list", name: "쿠폰 목록", icon: <OrderedListOutlined /> },
      { key: "/coupons/register", path: "/coupons/register", name: "쿠폰 등록", icon: <FormOutlined /> },
    ],
  },
  {
    key: "/banner",
    name: "배너 관리",
    icon: <PictureOutlined />,
    subMenu: [
      { key: "/banner/list", path: "/banner/list", name: "배너 목록", icon: <OrderedListOutlined /> },
      { key: "/banner/register", path: "/banner/register", name: "배너 등록", icon: <FormOutlined /> },
    ],
  },
  {
    key: "/inquiries",
    name: "문의/고객 관리",
    icon: <MailOutlined />,
    subMenu: [
      { key: "/inquiries/list", path: "/inquiries/list", name: "문의 조회", icon: <OrderedListOutlined /> },
      { key: "/inquiries/cancellation", path: "/inquiries/cancellation", name: "구독 해지 관리", icon: <FileProtectOutlined /> },
      { key: "/inquiries/faq", path: "/inquiries/faq", name: "FAQ 관리", icon: <QuestionCircleOutlined /> },
    ],
  },
  {
    key: "/user-analysis",
    name: "이용자 분석",
    icon: <UserOutlined />,
    subMenu: [
      { key: "/user-analysis/statistics", path: "/user-analysis/statistics", name: "이용자 통계", icon: <UserOutlined /> },
      { key: "/user-analysis/visits", path: "/user-analysis/visits", name: "방문 통계", icon: <PieChartOutlined /> },
    ],
  },
  {
    key: "/analysis",
    name: "마케팅 분석",
    icon: <AreaChartOutlined />,
    subMenu: [
      { key: "/analysis/campaign", path: "/analysis/campaign", name: "알림/샵/이벤트 효과", icon: <FundViewOutlined /> },
      { key: "/analysis/reports", path: "/analysis/reports", name: "리포트 생성", icon: <FileTextOutlined /> },
    ],
  },
  {
    key: "/settings",
    name: "시스템 설정",
    icon: <SettingOutlined />,
    subMenu: [
      { key: "/settings/permissions", path: "/settings/permissions", name: "권한 관리", icon: <UserSwitchOutlined /> },
      { key: "/settings/admin-activity-log", path: "/settings/admin-activity-log", name: "관리자 활동 이력", icon: <HistoryOutlined /> },
      { key: "/settings/api", path: "/settings/api", name: "API 관리", icon: <ApiOutlined /> },
      { key: "/settings/security", path: "/settings/security", name: "보안 설정", icon: <SecurityScanOutlined /> },
      { key: "/settings/policy", path: "/settings/policy", name: "서비스 정책", icon: <FileProtectOutlined /> },
      { key: "/settings/forbidden-words", path: "/settings/forbidden-words", name: "금지어 관리", icon: <BlockOutlined /> },
      { key: "/settings/version-history", path: "/settings/version-history", name: "버전 히스토리", icon: <HistoryOutlined /> },
    ],
  },
  {
    key: "/partners",
    name: "파트너 관리",
    icon: <TeamOutlined />,
    subMenu: [
      { key: "/partners/accounts", path: "/partners/accounts", name: "파트너 계정", icon: <SolutionOutlined /> },
      { key: "/partners/settlement", path: "/partners/settlement", name: "정산 관리", icon: <DollarCircleOutlined /> },
      { key: "/partners/inquiries", path: "/partners/inquiries", name: "문의 관리", icon: <MessageOutlined /> },
    ],
  },
];

const renderMenuItems = (items) =>
  items.map((item) =>
    item.subMenu && item.subMenu.length ? (
      <Menu.SubMenu key={item.key} icon={item.icon} title={item.name}>
        {renderMenuItems(item.subMenu)}
      </Menu.SubMenu>
    ) : (
      <Menu.Item key={item.path} icon={item.icon}>
        <Link to={item.path}>{item.name}</Link>
      </Menu.Item>
    )
  );

const Sidebar = ({ collapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const findInitialOpenKeys = (path) => {
    for (const item of menuItems) {
      if (item.subMenu) {
        const found = item.subMenu.find((sub) => path.startsWith(sub.path));
        if (found) return [item.key];
      }
    }
    return [];
  };

  const [openKeys, setOpenKeys] = useState(findInitialOpenKeys(currentPath));
  const handleOpenChange = (keys) => {
    const rootSubmenuKeys = menuItems
      .filter((item) => item.subMenu && item.subMenu.length > 0)
      .map((item) => item.key);
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) !== -1) setOpenKeys([latestOpenKey]);
    else setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const flatMenu = useMemo(() => {
    const out = [];
    const walk = (items, parents = []) => {
      items.forEach((it) => {
        const crumb = [...parents.map((p) => p.name), it.name].filter(Boolean).join(" > ");
        if (it.subMenu && it.subMenu.length) walk(it.subMenu, [...parents, it]);
        else if (it.path) out.push({ name: it.name, crumb, path: it.path });
      });
    };
    walk(menuItems);
    return out;
  }, []);

  const [search, setSearch] = useState("");
  const options = useMemo(() => {
    const q = search.trim().toLowerCase();
    return flatMenu
      .filter(
        (m) => !q || m.crumb.toLowerCase().includes(q) || m.name.toLowerCase().includes(q) || m.path.toLowerCase().includes(q)
      )
      .slice(0, 20)
      .map((m) => ({ value: m.name, label: m.crumb, path: m.path, name: m.name }));
  }, [search, flatMenu]);

  const handleSelect = (val, option) => {
    const path = option?.path || flatMenu.find((m) => m.name === val)?.path || val;
    setSearch(option?.name || val);
    navigate(path);
    setOpenKeys(findInitialOpenKeys(path));
  };

  return (
    <>
      {!collapsed && (
        <div style={{ padding: "8px 0" }}>
          <AutoComplete style={{ width: "100%" }} options={options} value={search} onChange={setSearch} onSelect={handleSelect}>
            <Input.Search
              allowClear
              placeholder="메뉴 검색"
              onSearch={() => {
                const first = flatMenu.find(
                  (m) => m.crumb.includes(search) || m.name.includes(search) || m.path.includes(search)
                );
                if (first) {
                  setSearch(first.name);
                  handleSelect(first.name, { path: first.path, name: first.name });
                }
              }}
            />
          </AutoComplete>
        </div>
      )}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentPath]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        inlineCollapsed={collapsed}
        style={{ height: "calc(100% - 64px)", borderRight: 0 }}
      >
        {collapsed && (
          <Menu.SubMenu key="__search" icon={<SearchOutlined />} title="검색">
            <Menu.Item key="__search_input" disabled>
              <div style={{ padding: 8, width: 240 }}>
                <AutoComplete style={{ width: "100%" }} options={options} value={search} onChange={setSearch} onSelect={handleSelect}>
                  <Input.Search
                    allowClear
                    placeholder="메뉴 검색"
                    onSearch={() => {
                      const first = flatMenu.find(
                        (m) => m.crumb.includes(search) || m.name.includes(search) || m.path.includes(search)
                      );
                      if (first) {
                        setSearch(first.name);
                        handleSelect(first.name, { path: first.path, name: first.name });
                      }
                    }}
                  />
                </AutoComplete>
              </div>
            </Menu.Item>
          </Menu.SubMenu>
        )}
        {renderMenuItems(menuItems)}
      </Menu>
    </>
  );
};

export default Sidebar;

