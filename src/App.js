import { ConfigProvider } from "antd";
import koKR from "antd/locale/ko_KR";
import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/Layout";
import { GroupProvider } from "./context/GroupContext";
import { PopupTemplateProvider } from "./context/PopupTemplateContext";

// 페이지 컴포넌트 임포트
import BookManagement from "./pages/ContentManagement/BookManagement";
import CategoryManagement from "./pages/ContentManagement/CategoryManagement";
import ContentApproval from "./pages/ContentManagement/ContentApproval";
import CurationManagement from "./pages/ContentManagement/CurationManagement";
import KeywordManagement from "./pages/ContentManagement/KeywordManagement";
import KeywordPreferenceStatistics from "./pages/ContentManagement/KeywordPreferenceStatistics";
import MetadataManagement from "./pages/ContentManagement/MetadataManagement";
import ReviewKeywordManagement from "./pages/ContentManagement/ReviewKeywordManagement";
import SeriesManagement from "./pages/ContentManagement/SeriesManagement";
import UnsubscribeManagement from "./pages/ContentManagement/UnsubscribeManagement";
import Dashboard from "./pages/Dashboard";
import CampaignEffect from "./pages/DataAnalysis/CampaignEffect";
import ContentStatistics from "./pages/DataAnalysis/ContentStatistics";
import ReportGeneration from "./pages/DataAnalysis/ReportGeneration";
import UserStatistics from "./pages/DataAnalysis/UserStatistics";
import VisitStatistics from "./pages/DataAnalysis/VisitStatistics";
import EmailTemplateManagement from "./pages/EmailManagement/EmailTemplateManagement";
import EmailTemplateOperations from "./pages/EmailManagement/EmailTemplateOperations";
import EventRegistration from "./pages/EventManagement/EventRegistration";
import EventStatus from "./pages/EventManagement/EventStatus";
import FaqManagement from "./pages/InquiryManagement/FaqManagement";
import InquiryLookup from "./pages/InquiryManagement/InquiryLookup";
import SubscriptionCancellationManagement from "./pages/InquiryManagement/SubscriptionCancellationManagement";
import NoticeHistory from "./pages/NoticeManagement/NoticeHistory";
import NoticeList from "./pages/NoticeManagement/NoticeList";
import DispatchHistory from "./pages/NotificationManagement/DispatchHistory";
import NotificationDispatch from "./pages/NotificationManagement/NotificationDispatch";
import NotificationTemplate from "./pages/NotificationManagement/NotificationTemplate";
import TargetGroupManagement from "./pages/NotificationManagement/TargetGroupManagement";
import InquiryManagementPartner from "./pages/PartnerManagement/InquiryManagementPartner";
import PartnerAccount from "./pages/PartnerManagement/PartnerAccount";
import SettlementManagement from "./pages/PartnerManagement/SettlementManagement";
import ExposureHistory from "./pages/PopupManagement/ExposureHistory";
import PopupExposureSettings from "./pages/PopupManagement/ExposureSettings";
import PopupCreation from "./pages/PopupManagement/PopupCreation";
import AuthorInfoManagement from "./pages/SelfPublishing/AuthorInfoManagement";
import VersionHistory from "./pages/SystemManagement/VersionHistory";
import AdminActivityLog from "./pages/SystemSettings/AdminActivityLog"; // 새로 추가
import ApiManagement from "./pages/SystemSettings/ApiManagement";
import PermissionManagement from "./pages/SystemSettings/PermissionManagement";
import SecuritySettings from "./pages/SystemSettings/SecuritySettings";
import ServicePolicy from "./pages/SystemSettings/ServicePolicy";
import ForbiddenWords from "./pages/SystemSettings/ForbiddenWords";
import AccountSanctions from "./pages/UserManagement/AccountSanctions";
import BadgeManagement from "./pages/UserManagement/BadgeManagement";
import MemberInfo from "./pages/UserManagement/MemberInfo";
import SubscriptionHistory from "./pages/UserManagement/SubscriptionHistory";

// 새로 추가된 신고 관리 페이지 컴포넌트 임포트
import BookRankingManagement from "./pages/FixedContentManagement/BookRankingManagement";
import FixedContentManagement from "./pages/FixedContentManagement/FixedContentManagement";
import GenrePopularAudiobookManagement from "./pages/FixedContentManagement/GenrePopularAudiobookManagement";
import GenrePopularBookManagement from "./pages/FixedContentManagement/GenrePopularBookManagement";
import ReportList from "./pages/ReportManagement/ReportList";
import ReportSettings from "./pages/ReportManagement/ReportSettings";
import WorksList from "./pages/SelfPublishing/WorksList";

// 쿠폰 관리 페이지
import Coupon from "./pages/CouponManagement/Coupon";
import CouponForm from "./pages/CouponManagement/CouponForm";

// 배너 관리 페이지
import BannerCreation from "./pages/BannerManagement/BannerCreation";
import BannerList from "./pages/BannerManagement/BannerList";

// 리뷰 관리 페이지
import AppReviewManagement from "./pages/ReviewManagement/AppReviewManagement";

function App() {
  const [coupons, setCoupons] = useState([
    {
      key: "1",
      couponName: "7월 신규회원 자동발행 쿠폰",
      couponType: "auto",
      autoIssueRule: "new_member", // 첫 회원가입
      benefitType: "amount_discount",
      discountType: "percentage",
      discountValue: 10,
      maxDiscountAmount: 5000,
      minOrderAmount: 20000,
      issueTarget: "all_members",
      usagePeriodType: "days_from_issue",
      usagePeriodDays: 30,
      issuanceDate: "2024-07-01",
      issuedCount: 150,
      usedCount: 25,
      status: "active",
    },
    {
      key: "2",
      couponName: "여름맞이 고객 다운로드 쿠폰",
      couponType: "download",
      benefitType: "amount_discount",
      discountType: "fixed",
      discountValue: 3000,
      minOrderAmount: 30000,
      issueTarget: "group",
      issueTargetGroup: "group-1", // VIP 회원
      issueLimit: 1000, // 발행수량
      isUnlimitedIssue: false,
      perPersonLimit: 1, // 1인당 사용횟수
      isUnlimitedPerPerson: false,
      usagePeriodType: "fixed_period",
      startDate: "2024-07-01",
      endDate: "2024-08-31",
      issuedCount: 800,
      usedCount: 450,
      status: "active",
    },
    {
      key: "3",
      couponName: "VVIP 고객 지정발행 쿠폰",
      couponType: "direct",
      benefitType: "fix_price",
      fixedPrice: 10000,
      issueTarget: "individual",
      issueTargetIndividual: "user-vip-001, user-vip-002",
      usagePeriodType: "fixed_period",
      issuanceDate: "2024-07-15",
      startDate: "2024-07-15",
      endDate: "2024-08-14", // 생성일로부터 30일
      issuedCount: 2,
      usedCount: 1,
      perPersonLimit: 1, // 지정발행은 1회 사용
      applicableContentType: "product",
      applicableContent: ["content-5"],
      status: "active",
    },
    {
      key: "4",
      couponName: "썸머 세일 쿠폰코드",
      couponType: "code",
      benefitType: "amount_discount",
      discountType: "percentage",
      discountValue: 15,
      maxDiscountAmount: 10000,
      issueTarget: "all_users", // 회원+비회원
      couponCodeType: "single",
      couponCode: "SUMMERSALE",
      usagePeriodType: "fixed_period",
      startDate: "2024-07-20",
      endDate: "2024-07-31",
      issuedCount: 0, // 코드 쿠폰은 발행수량 개념이 다름
      usedCount: 78,
      status: "scheduled",
    },
  ]);

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
              <Route
                path="content/categories"
                element={<CategoryManagement />}
              />
              <Route path="content/keywords" element={<KeywordManagement />} />
              <Route
                path="content/keyword-preferences"
                element={<KeywordPreferenceStatistics />}
              />
              <Route
                path="content/series-management"
                element={<SeriesManagement />}
              />
              <Route path="content/metadata" element={<MetadataManagement />} />
              <Route path="content/analysis" element={<ContentStatistics />} />
              <Route path="content/curation" element={<CurationManagement />} />
              <Route
                path="content/unsubscribe"
                element={<UnsubscribeManagement />}
              />
              <Route
                path="content/review-keywords"
                element={<ReviewKeywordManagement />}
              />
              {/* 고정 콘텐츠 관리 */}
              <Route
                path="fixed-content"
                element={<FixedContentManagement />}
              />
              <Route
                path="fixed-content/book-ranking"
                element={<BookRankingManagement />}
              />
              <Route
                path="fixed-content/genre-popular-books"
                element={<GenrePopularBookManagement />}
              />
              <Route
                path="fixed-content/genre-popular-audiobooks"
                element={<GenrePopularAudiobookManagement />}
              />
              {/* 자가출판 */}
              <Route
                path="self-publishing/approval"
                element={<ContentApproval />}
              />
              <Route
                path="self-publishing/authors"
                element={<AuthorInfoManagement />}
              />
              <Route path="self-publishing/works" element={<WorksList />} />
              {/* 회원 관리 */}
              <Route path="users/info" element={<MemberInfo />} />
              <Route path="users/sanctions" element={<AccountSanctions />} />
              <Route
                path="users/subscriptions"
                element={<SubscriptionHistory />}
              />
              <Route
                path="users/cancellation"
                element={<SubscriptionCancellationManagement />}
              />
              <Route path="users/badges" element={<BadgeManagement />} />
              {/* 신고 관리 라우트 추가 */}
              <Route path="reports/list" element={<ReportList />} />
              <Route path="reports/settings" element={<ReportSettings />} />
              {/* 알림 관리 */}
              <Route
                path="notifications/dispatch"
                element={<NotificationDispatch />}
              />
              <Route
                path="notifications/templates"
                element={<NotificationTemplate />}
              />
              <Route
                path="notifications/history"
                element={<DispatchHistory />}
              />
              <Route
                path="notifications/groups"
                element={<TargetGroupManagement />}
              />
              {/* 이메일 관리 */}
              <Route path="/email/templates" element={<EmailTemplateManagement />} />
              <Route path="/email/operations" element={<EmailTemplateOperations />} />
              {/* 팝업 관리 */}
              <Route path="popups/create" element={<PopupCreation />} />
              <Route
                path="popups/settings"
                element={<PopupExposureSettings />}
              />
              <Route path="popups/history" element={<ExposureHistory />} />
              {/* 공지사항 관리 */}
              <Route path="notices/manage" element={<NoticeList />} />
              <Route path="notices/history" element={<NoticeHistory />} />
              {/* 이벤트 관리 */}
              <Route path="events/register" element={<EventRegistration />} />
              <Route path="events/status" element={<EventStatus />} />
              {/* 배너 관리 */}
              <Route path="banner/list" element={<BannerList />} />
              <Route path="banner/register" element={<BannerCreation />} />
              <Route
                path="banner/edit/:bannerId"
                element={<BannerCreation />}
              />
              {/* 리뷰 관리 */}
              <Route path="reviews/manage" element={<AppReviewManagement />} />
              {/* 쿠폰 관리 */}
              <Route
                path="coupons/list"
                element={<Coupon coupons={coupons} setCoupons={setCoupons} />}
              />
              <Route
                path="coupons/register"
                element={
                  <CouponForm coupons={coupons} setCoupons={setCoupons} />
                }
              />
              <Route
                path="coupons/register/:id"
                element={
                  <CouponForm coupons={coupons} setCoupons={setCoupons} />
                }
              />
              {/* 문의사항 관리 */}
              <Route path="inquiries/list" element={<InquiryLookup />} />
              <Route path="inquiries/faq" element={<FaqManagement />} />
              {/* 사용자 분석 */}
              <Route
                path="user-analysis/statistics"
                element={<UserStatistics />}
              />
              <Route
                path="user-analysis/visits"
                element={<VisitStatistics />}
              />
              {/* 데이터 분석 */}
              <Route path="analysis/campaign" element={<CampaignEffect />} />
              <Route path="analysis/reports" element={<ReportGeneration />} />
              {/* 시스템 설정 */}
              <Route
                path="settings/permissions"
                element={<PermissionManagement />}
              />
              <Route
                path="settings/admin-activity-log"
                element={<AdminActivityLog />}
              />{" "}
              {/* 새로 추가 */}
              <Route path="settings/api" element={<ApiManagement />} />
              <Route path="settings/security" element={<SecuritySettings />} />
              <Route path="settings/policy" element={<ServicePolicy />} />
              <Route path="settings/forbidden-words" element={<ForbiddenWords />} />
              <Route
                path="settings/version-history"
                element={<VersionHistory />}
              />
              {/* 파트너 관리 */}
              <Route path="partners/accounts" element={<PartnerAccount />} />
              <Route
                path="partners/settlement"
                element={<SettlementManagement />}
              />
              <Route
                path="partners/inquiries"
                element={<InquiryManagementPartner />}
              />
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
