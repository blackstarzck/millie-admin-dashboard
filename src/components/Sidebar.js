import React from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
// 아이콘 임포트 (예시 - 필요에 따라 추가/변경)
import {
  AppstoreOutlined,
  BookOutlined,
  UserOutlined,
  NotificationOutlined,
  MessageOutlined,
  CalendarOutlined,
  AreaChartOutlined,
  SettingOutlined,
  TeamOutlined,
  PieChartOutlined,
  ProfileOutlined,
  CheckSquareOutlined,
  DatabaseOutlined,
  UserSwitchOutlined,
  BellOutlined,
  MailOutlined,
  WarningOutlined,
  BlockOutlined,
  FormOutlined,
  FileTextOutlined,
  OrderedListOutlined,
  HistoryOutlined,
  FundViewOutlined,
  ApiOutlined,
  SecurityScanOutlined,
  FileProtectOutlined,
  DollarCircleOutlined,
  SolutionOutlined,
  LinkOutlined,
  FilterOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

// 메뉴 데이터 구조화 (key 추가, 아이콘 추가)
const menuItems = [
  { key: '/dashboard', path: '/dashboard', name: '대시보드', icon: <PieChartOutlined /> },
  {
    key: '/content', // SubMenu의 key
    name: '콘텐츠 관리',
    icon: <BookOutlined />,
    subMenu: [
      { key: '/content/books', path: '/content/books', name: '도서 관리', icon: <BookOutlined /> },
      { key: '/content/categories', path: '/content/categories', name: '카테고리 관리', icon: <AppstoreOutlined /> },
      { key: '/content/approval', path: '/content/approval', name: '콘텐츠 승인', icon: <CheckSquareOutlined /> },
      { key: '/content/metadata', path: '/content/metadata', name: '메타데이터 관리', icon: <DatabaseOutlined /> },
    ],
  },
  {
    key: '/users',
    name: '사용자 관리',
    icon: <UserOutlined />,
    subMenu: [
      { key: '/users/info', path: '/users/info', name: '회원 정보', icon: <ProfileOutlined /> },
      { key: '/users/groups', path: '/users/groups', name: '사용자 그룹', icon: <TeamOutlined /> },
      { key: '/users/unsubscribe', path: '/users/unsubscribe', name: '수신거부 관리', icon: <MailOutlined /> },
      { key: '/users/sanctions', path: '/users/sanctions', name: '계정 제재', icon: <WarningOutlined /> },
    ],
  },
  {
    key: '/notifications',
    name: '알림 관리',
    icon: <NotificationOutlined />,
    subMenu: [
      { key: '/notifications/dispatch', path: '/notifications/dispatch', name: '알림 발송', icon: <BellOutlined /> },
      { key: '/notifications/templates', path: '/notifications/templates', name: '알림 템플릿', icon: <FileTextOutlined /> },
      { key: '/notifications/history', path: '/notifications/history', name: '발송 내역', icon: <HistoryOutlined /> },
      { key: '/notifications/emergency', path: '/notifications/emergency', name: '긴급 공지', icon: <WarningOutlined /> },
    ],
  },
  {
    key: '/popups',
    name: '팝업 관리',
    icon: <BlockOutlined />,
    subMenu: [
      { key: '/popups/create', path: '/popups/create', name: '팝업 생성', icon: <FormOutlined /> },
      { key: '/popups/templates', path: '/popups/templates', name: '템플릿 관리', icon: <FileTextOutlined /> },
      { key: '/popups/settings', path: '/popups/settings', name: '노출 설정', icon: <SettingOutlined /> },
      { key: '/popups/analysis', path: '/popups/analysis', name: '팝업 분석', icon: <FundViewOutlined /> },
    ],
  },
  {
    key: '/notices',
    name: '공지사항 관리',
    icon: <MessageOutlined />, // 아이콘 변경 가능
    subMenu: [
      { key: '/notices/create', path: '/notices/create', name: '공지사항 작성', icon: <FormOutlined /> },
      { key: '/notices/manage', path: '/notices/manage', name: '게시 관리', icon: <OrderedListOutlined /> },
      { key: '/notices/categories', path: '/notices/categories', name: '카테고리 설정', icon: <AppstoreOutlined /> },
      { key: '/notices/history', path: '/notices/history', name: '노출 내역', icon: <HistoryOutlined /> },
    ],
  },
  {
    key: '/events',
    name: '이벤트 관리',
    icon: <CalendarOutlined />,
    subMenu: [
      { key: '/events/register', path: '/events/register', name: '이벤트 등록', icon: <FormOutlined /> },
      { key: '/events/url', path: '/events/url', name: 'URL 생성', icon: <LinkOutlined /> },
      { key: '/events/status', path: '/events/status', name: '이벤트 상태', icon: <CheckSquareOutlined /> },
      { key: '/events/analysis', path: '/events/analysis', name: '이벤트 분석', icon: <FundViewOutlined /> },
    ],
  },
  {
    key: '/inquiries',
    name: '문의사항 관리',
    icon: <MessageOutlined />,
    subMenu: [
      { key: '/inquiries/list', path: '/inquiries/list', name: '문의 조회', icon: <OrderedListOutlined /> },
      { key: '/inquiries/answer', path: '/inquiries/answer', name: '답변 작성', icon: <FormOutlined /> },
      { key: '/inquiries/filter', path: '/inquiries/filter', name: '문의 필터링', icon: <FilterOutlined /> },
      { key: '/inquiries/faq', path: '/inquiries/faq', name: 'FAQ 관리', icon: <QuestionCircleOutlined /> },
    ],
  },
  {
    key: '/analysis',
    name: '데이터 분석',
    icon: <AreaChartOutlined />,
    subMenu: [
      { key: '/analysis/users', path: '/analysis/users', name: '사용자 통계', icon: <UserOutlined /> },
      { key: '/analysis/content', path: '/analysis/content', name: '콘텐츠 통계', icon: <BookOutlined /> },
      { key: '/analysis/campaign', path: '/analysis/campaign', name: '알림/팝업/이벤트 효과', icon: <FundViewOutlined /> },
      { key: '/analysis/reports', path: '/analysis/reports', name: '리포트 생성', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: '/settings',
    name: '시스템 설정',
    icon: <SettingOutlined />,
    subMenu: [
      { key: '/settings/permissions', path: '/settings/permissions', name: '권한 관리', icon: <UserSwitchOutlined /> },
      { key: '/settings/api', path: '/settings/api', name: 'API 관리', icon: <ApiOutlined /> },
      { key: '/settings/security', path: '/settings/security', name: '보안 설정', icon: <SecurityScanOutlined /> },
      { key: '/settings/policy', path: '/settings/policy', name: '서비스 정책', icon: <FileProtectOutlined /> },
    ],
  },
  {
    key: '/partners',
    name: '파트너 관리',
    icon: <TeamOutlined />,
    subMenu: [
      { key: '/partners/accounts', path: '/partners/accounts', name: '파트너 계정', icon: <SolutionOutlined /> },
      { key: '/partners/settlement', path: '/partners/settlement', name: '정산 관리', icon: <DollarCircleOutlined /> },
      { key: '/partners/inquiries', path: '/partners/inquiries', name: '문의 관리', icon: <MessageOutlined /> },
    ],
  },
];

// 메뉴 아이템 렌더링 함수
const renderMenuItems = (items) => {
  return items.map(item => {
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

  // 현재 경로에 맞는 SubMenu 키 찾기 (예: /content/books -> /content)
  const findOpenKeys = (path) => {
    for (const item of menuItems) {
      if (item.subMenu) {
        const foundSubItem = item.subMenu.find(sub => path.startsWith(sub.path));
        if (foundSubItem) {
          return [item.key]; // 부모 메뉴의 key 반환
        }
      }
    }
    return []; // 해당 없으면 빈 배열
  };

  const openKeys = findOpenKeys(currentPath);

  return (
    <Menu
      theme="dark" // 다크 테마 적용
      mode="inline"
      selectedKeys={[currentPath]} // 현재 경로를 selectedKeys로 설정
      defaultOpenKeys={openKeys} // 현재 경로에 해당하는 SubMenu 열기
      style={{ height: 'calc(100% - 64px)', borderRight: 0 }} // 로고 높이만큼 빼기
    >
      {renderMenuItems(menuItems)}
    </Menu>
  );
};

export default Sidebar; 