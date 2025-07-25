import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // AntD Menu로 리팩토링된 Sidebar 임포트
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  SolutionOutlined,
  UserOutlined,
  NotificationOutlined,
  MessageOutlined,
  SoundOutlined,
  GiftOutlined,
  QuestionCircleOutlined,
  AreaChartOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

// 메뉴 아이템 생성 함수 (기존 코드 재활용 또는 유사하게 구성)
function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

// Define menu items array
const menuItems = [
  getItem('대시보드', '/dashboard', <DashboardOutlined />),
  getItem('콘텐츠 관리', 'subContent', <DatabaseOutlined />, [
    getItem('도서 관리', '/content/books'),
    getItem('카테고리 관리', '/content/categories'),
    getItem('메타데이터 관리', '/content/metadata'),
  ]),
  getItem('자가출판 관리', 'subSelfPublishing', <SolutionOutlined />, [
    getItem('콘텐츠 승인', '/self-publishing/approval'),
    getItem('작가 정보 관리', '/self-publishing/authors'),
  ]),
  getItem('회원 관리', 'subUsers', <UserOutlined />, [
    getItem('회원 정보 조회', '/users/info'),
    getItem('계정 제재 관리', '/users/sanctions'),
    getItem('구독 내역 관리', '/users/subscriptions'),
    getItem('뱃지 관리', '/users/badges'),
  ]),
  getItem('알림 & PUSH 관리', 'subNotifications', <NotificationOutlined />, [
    getItem('알림 발송', '/notifications/dispatch'),
    getItem('알림 템플릿 관리', '/notifications/templates'),
    getItem('발송 내역 조회', '/notifications/history'),
    getItem('발송 그룹 관리', '/notifications/groups'),
  ]),
  getItem('팝업 관리', 'subPopups', <MessageOutlined />, [
    getItem('팝업 생성/수정', '/popups/create'),
    getItem('템플릿 관리', '/popups/templates'),
    getItem('노출 설정 관리', '/popups/settings'),
    getItem('노출 내역 조회', '/popups/history'),
  ]),
  getItem('공지사항 관리', 'subNotices', <SoundOutlined />, [
    getItem('공지 등록', '/notices/create'),
    getItem('공지 관리', '/notices/manage'),
    getItem('카테고리 설정', '/notices/categories'),
    getItem('공지 변경 내역', '/notices/history'),
  ]),
  getItem('이벤트 관리', 'subEvents', <GiftOutlined />, [
    getItem('이벤트 등록', '/events/register'),
    getItem('참여 URL 생성', '/events/url'),
    getItem('이벤트 현황', '/events/status'),
    getItem('이벤트 분석', '/events/analysis'),
  ]),
  getItem('문의사항 관리', 'subInquiries', <QuestionCircleOutlined />, [
    getItem('문의 목록 조회', '/inquiries/list'),
    getItem('문의 분류/답변', '/inquiries/filter'),
    getItem('FAQ 관리', '/inquiries/faq'),
  ]),
  getItem('데이터 분석', 'subAnalysis', <AreaChartOutlined />, [
    getItem('사용자 통계', '/analysis/users'),
    getItem('콘텐츠 통계', '/analysis/content'),
    getItem('캠페인 효과', '/analysis/campaign'),
    getItem('리포트 생성', '/analysis/reports'),
    getItem('방문 통계', '/analysis/visits'),
    getItem('유입 경로 분석', '/analysis/referrers'),
  ]),
  getItem('시스템 설정', 'subSettings', <SettingOutlined />, [
    getItem('권한 관리', '/settings/permissions'),
    getItem('API 관리', '/settings/api'),
    getItem('보안 설정', '/settings/security'),
    getItem('서비스 정책 관리', '/settings/policy'),
  ]),
  getItem('파트너 관리', 'subPartners', <TeamOutlined />, [
    getItem('파트너 계정 관리', '/partners/accounts'),
    getItem('정산 관리', '/partners/settlement'),
    getItem('문의 관리', '/partners/inquiries'),
  ]),
];

const AppLayout = () => { // 컴포넌트 이름 변경 (Layout 중복 방지)
  const [collapsed, setCollapsed] = useState(false); // 사이드바 접기/펴기 상태
  const location = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [openKeys, setOpenKeys] = useState([]);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // Update currentPath when location changes
  useEffect(() => {
    setCurrentPath(location.pathname);
    // Find the parent key of the current path and set it as open key
    const parentKey = menuItems.find(item => item.children?.some(child => child.key === location.pathname))?.key;
    if (parentKey && !openKeys.includes(parentKey)) {
        // Only update openKeys if the parentKey is not already open to avoid unnecessary re-renders
        // Or, decide if you want to collapse others when a new one is opened.
        // For simplicity, let's just add it.
        // setOpenKeys([parentKey]); // Alternative: Only keep the current parent open
         setOpenKeys(prevKeys => [...prevKeys, parentKey]);
    }
  }, [location.pathname]); // Removed openKeys from dependency array

  const handleMenuClick = (e) => {
    navigate(e.key);
    setCurrentPath(e.key); // Update selected key immediately
  };

  // Function to handle submenu open/change
  const onOpenChange = (keys) => {
      const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
      // Logic to only allow one submenu open at a time (optional)
      const rootSubmenuKeys = menuItems.filter(item => item.children).map(item => item.key);
      if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          setOpenKeys(keys);
      } else {
          setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
      }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark" width={250}>
        {/* Sidebar 컴포넌트를 Sider 내부에 렌더링 */}
        <div className="logo" style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
          {collapsed ? 'M' : 'Millie Admin'}
        </div>
        <Sidebar />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          {/* 사이드바 토글 버튼 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
           {/* 여기에 헤더의 다른 요소들 추가 가능 (예: 사용자 정보, 로그아웃 버튼) */}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto' // 컨텐츠 영역 자체 스크롤 (필요시)
          }}
        >
          {/* 중첩된 라우트의 페이지 컴포넌트가 여기에 렌더링됨 */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; // 변경된 이름으로 내보내기
