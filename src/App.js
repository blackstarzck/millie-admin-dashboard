import { ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/Layout';
import { GroupProvider } from './context/GroupContext';
import { PopupTemplateProvider } from './context/PopupTemplateContext';

// 페이지 컴포넌트 임포트
import BookManagement from './pages/ContentManagement/BookManagement';
import CategoryManagement from './pages/ContentManagement/CategoryManagement';
import ContentApproval from './pages/ContentManagement/ContentApproval';
import CurationManagement from './pages/ContentManagement/CurationManagement';
import KeywordManagement from './pages/ContentManagement/KeywordManagement';
import MetadataManagement from './pages/ContentManagement/MetadataManagement';
import SeriesManagement from './pages/ContentManagement/SeriesManagement';
import Dashboard from './pages/Dashboard';
import CampaignEffect from './pages/DataAnalysis/CampaignEffect';
import ContentStatistics from './pages/DataAnalysis/ContentStatistics';
import ReportGeneration from './pages/DataAnalysis/ReportGeneration';
import UserStatistics from './pages/DataAnalysis/UserStatistics';
import VisitStatistics from './pages/DataAnalysis/VisitStatistics';
import EventRegistration from './pages/EventManagement/EventRegistration';
import EventStatus from './pages/EventManagement/EventStatus';
import FaqManagement from './pages/InquiryManagement/FaqManagement';
import InquiryLookup from './pages/InquiryManagement/InquiryLookup';
import NoticeHistory from './pages/NoticeManagement/NoticeHistory';
import NoticeList from './pages/NoticeManagement/NoticeList';
import DispatchHistory from './pages/NotificationManagement/DispatchHistory';
import NotificationDispatch from './pages/NotificationManagement/NotificationDispatch';
import NotificationTemplate from './pages/NotificationManagement/NotificationTemplate';
import TargetGroupManagement from './pages/NotificationManagement/TargetGroupManagement';
import InquiryManagementPartner from './pages/PartnerManagement/InquiryManagementPartner';
import PartnerAccount from './pages/PartnerManagement/PartnerAccount';
import SettlementManagement from './pages/PartnerManagement/SettlementManagement';
import ExposureHistory from './pages/PopupManagement/ExposureHistory';
import PopupExposureSettings from './pages/PopupManagement/ExposureSettings';
import PopupCreation from './pages/PopupManagement/PopupCreation';
import PopupTemplateManagement from './pages/PopupManagement/TemplateManagement';
import AuthorInfoManagement from './pages/SelfPublishing/AuthorInfoManagement';
import ApiManagement from './pages/SystemSettings/ApiManagement';
import PermissionManagement from './pages/SystemSettings/PermissionManagement';
import SecuritySettings from './pages/SystemSettings/SecuritySettings';
import ServicePolicy from './pages/SystemSettings/ServicePolicy';
import AccountSanctions from './pages/UserManagement/AccountSanctions';
import BadgeManagement from './pages/UserManagement/BadgeManagement';
import MemberInfo from './pages/UserManagement/MemberInfo';
import SubscriptionHistory from './pages/UserManagement/SubscriptionHistory';

// 새로 추가된 신고 관리 페이지 컴포넌트 임포트
import ReportList from './pages/ReportManagement/ReportList';
import ReportSettings from './pages/ReportManagement/ReportSettings';
import WorksList from './pages/SelfPublishing/WorksList';

// 쿠폰 관리 페이지
import Coupon from './pages/CouponManagement/Coupon';

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
              <Route path="content/keywords" element={<KeywordManagement />} />
              <Route path="content/series-management" element={<SeriesManagement />} />
              <Route path="content/metadata" element={<MetadataManagement />} />
              <Route path="content/analysis" element={<ContentStatistics />} />
              <Route path="content/curation" element={<CurationManagement />} />

              {/* 자가출판 */}
              <Route path="self-publishing/approval" element={<ContentApproval />} />
              <Route path="self-publishing/authors" element={<AuthorInfoManagement />} />
              <Route path="self-publishing/works" element={<WorksList />} />

              {/* 회원 관리 */}
              <Route path="users/info" element={<MemberInfo />} />
              <Route path="users/sanctions" element={<AccountSanctions />} />
              <Route path="users/subscriptions" element={<SubscriptionHistory />} />
              <Route path="users/badges" element={<BadgeManagement />} />

              {/* 신고 관리 라우트 추가 */}
              <Route path="reports/list" element={<ReportList />} />
              <Route path="reports/settings" element={<ReportSettings />} />

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
              <Route path="events/coupons" element={<Coupon />} />

              {/* 문의사항 관리 */}
              <Route path="inquiries/list" element={<InquiryLookup />} />
              <Route path="inquiries/faq" element={<FaqManagement />} />

              {/* 사용자 분석 */}
              <Route path="user-analysis/statistics" element={<UserStatistics />} />
              <Route path="user-analysis/visits" element={<VisitStatistics />} />

              {/* 데이터 분석 */}
              <Route path="analysis/campaign" element={<CampaignEffect />} />
              <Route path="analysis/reports" element={<ReportGeneration />} />

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
