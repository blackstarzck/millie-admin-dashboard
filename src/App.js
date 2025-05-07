import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout';
import { GroupProvider } from './context/GroupContext';
import { PopupTemplateProvider } from './context/PopupTemplateContext';
import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';

// 페이지 컴포넌트 임포트
import Dashboard from './pages/Dashboard';
import BookManagement from './pages/ContentManagement/BookManagement';
import CategoryManagement from './pages/ContentManagement/CategoryManagement';
import ContentApproval from './pages/ContentManagement/ContentApproval';
import MetadataManagement from './pages/ContentManagement/MetadataManagement';
import NoticeList from './pages/NoticeManagement/NoticeList';
import MemberInfo from './pages/UserManagement/MemberInfo';
import AccountSanctions from './pages/UserManagement/AccountSanctions';
import SubscriptionHistory from './pages/UserManagement/SubscriptionHistory';
import NotificationDispatch from './pages/NotificationManagement/NotificationDispatch';
import NotificationTemplate from './pages/NotificationManagement/NotificationTemplate';
import DispatchHistory from './pages/NotificationManagement/DispatchHistory';
import TargetGroupManagement from './pages/NotificationManagement/TargetGroupManagement';
import PopupCreation from './pages/PopupManagement/PopupCreation';
import PopupTemplateManagement from './pages/PopupManagement/TemplateManagement';
import PopupExposureSettings from './pages/PopupManagement/ExposureSettings';
import InquiryLookup from './pages/InquiryManagement/InquiryLookup';
import InquiryFiltering from './pages/InquiryManagement/InquiryFiltering';
import FaqManagement from './pages/InquiryManagement/FaqManagement';
import UserStatistics from './pages/DataAnalysis/UserStatistics';
import ContentStatistics from './pages/DataAnalysis/ContentStatistics';
import CampaignEffect from './pages/DataAnalysis/CampaignEffect';
import ReportGeneration from './pages/DataAnalysis/ReportGeneration';
import VisitStatistics from './pages/DataAnalysis/VisitStatistics';
import ReferrerPath from './pages/DataAnalysis/ReferrerPath';
import PermissionManagement from './pages/SystemSettings/PermissionManagement';
import ApiManagement from './pages/SystemSettings/ApiManagement';
import SecuritySettings from './pages/SystemSettings/SecuritySettings';
import ServicePolicy from './pages/SystemSettings/ServicePolicy';
import PartnerAccount from './pages/PartnerManagement/PartnerAccount';
import SettlementManagement from './pages/PartnerManagement/SettlementManagement';
import InquiryManagementPartner from './pages/PartnerManagement/InquiryManagementPartner';
import NoticeHistory from './pages/NoticeManagement/NoticeHistory';
import ExposureHistory from './pages/PopupManagement/ExposureHistory';
import EventRegistration from './pages/EventManagement/EventRegistration';
import EventStatus from './pages/EventManagement/EventStatus';
import AuthorInfoManagement from './pages/SelfPublishing/AuthorInfoManagement';
import BadgeManagement from './pages/UserManagement/BadgeManagement';

function App() {
  return (
    <ConfigProvider locale={koKR}>
      <GroupProvider>
        <PopupTemplateProvider>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              {/* 기본 경로를 /dashboard로 리디렉션 */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* 각 메뉴에 대한 라우트 설정 */}
              <Route path="dashboard" element={<Dashboard />} />

              {/* 콘텐츠 관리 */}
              <Route path="content/books" element={<BookManagement />} />
              <Route path="content/categories" element={<CategoryManagement />} />
              <Route path="content/metadata" element={<MetadataManagement />} />

              {/* 자가출판 */}
              <Route path="self-publishing/approval" element={<ContentApproval />} />
              <Route path="self-publishing/authors" element={<AuthorInfoManagement />} />

              {/* 회원 관리 */}
              <Route path="users/info" element={<MemberInfo />} />
              <Route path="users/sanctions" element={<AccountSanctions />} />
              <Route path="users/subscriptions" element={<SubscriptionHistory />} />
              <Route path="users/badges" element={<BadgeManagement />} />

              {/* 알림 관리 */}
              <Route path="notifications/dispatch" element={<NotificationDispatch />} />
              <Route path="notifications/templates" element={<NotificationTemplate />} />
              <Route path="notifications/history" element={<DispatchHistory />} />
              <Route path="notifications/groups" element={<TargetGroupManagement />} />

              {/* 팝업 관리 */}
              <Route path="popups/create" element={<PopupCreation />} />
              <Route path="popups/templates" element={<PopupTemplateManagement />} />
              <Route path="popups/settings" element={<PopupExposureSettings />} />
              <Route path="popups/history" element={<ExposureHistory />} />

              {/* 공지사항 관리 */}
              <Route path="notices/manage" element={<NoticeList />} />
              <Route path="notices/history" element={<NoticeHistory />} />

              {/* 이벤트 관리 */}
              <Route path="events/register" element={<EventRegistration />} />
              <Route path="events/status" element={<EventStatus />} />

              {/* 문의사항 관리 */}
              <Route path="inquiries/list" element={<InquiryLookup />} />
              <Route path="inquiries/filter" element={<InquiryFiltering />} />
              <Route path="inquiries/faq" element={<FaqManagement />} />

              {/* 데이터 분석 */}
              <Route path="analysis/users" element={<UserStatistics />} />
              <Route path="analysis/content" element={<ContentStatistics />} />
              <Route path="analysis/campaign" element={<CampaignEffect />} />
              <Route path="analysis/reports" element={<ReportGeneration />} />
              <Route path="analysis/visits" element={<VisitStatistics />} />
              <Route path="analysis/referrers" element={<ReferrerPath />} />

              {/* 시스템 설정 */}
              <Route path="settings/permissions" element={<PermissionManagement />} />
              <Route path="settings/api" element={<ApiManagement />} />
              <Route path="settings/security" element={<SecuritySettings />} />
              <Route path="settings/policy" element={<ServicePolicy />} />

              {/* 파트너 관리 */}
              <Route path="partners/accounts" element={<PartnerAccount />} />
              <Route path="partners/settlement" element={<SettlementManagement />} />
              <Route path="partners/inquiries" element={<InquiryManagementPartner />} />

              {/* 정의되지 않은 경로 처리 (옵션) */}
              {/* <Route path="*" element={<NotFound />} /> */}
            </Route>
          </Routes>
        </PopupTemplateProvider>
      </GroupProvider>
    </ConfigProvider>
  );
}

export default App; 