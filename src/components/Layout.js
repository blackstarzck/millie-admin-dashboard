import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // AntD Menu로 리팩토링된 Sidebar 임포트
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AppLayout = () => { // 컴포넌트 이름 변경 (Layout 중복 방지)
  const [collapsed, setCollapsed] = useState(false); // 사이드바 접기/펴기 상태
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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