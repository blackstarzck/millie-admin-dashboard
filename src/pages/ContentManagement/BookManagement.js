import {
  AudioOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  ReadOutlined,
  SafetyOutlined,
  UploadOutlined
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Image,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
  Upload
} from "antd";
import moment from "moment";
import React, { useMemo, useState } from "react";
// CurationManagement에서 큐레이션 데이터를 가져옵니다 (데모용)
import { initialCurations as allCurationsData } from "./CurationManagement";
import { initialKeywords as allKeywordsData } from "./KeywordManagement";

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { Search, TextArea } = Input;

// 카테고리별 하위 카테고리 데이터
export const subCategoryMap = {
  소설: [
    "한국 소설",
    "영미 소설",
    "일본 소설",
    "추리/미스터리",
    "SF",
    "판타지",
    "역사 소설",
    "로맨스",
  ],
  "시/에세이": ["한국 시", "해외 시", "에세이", "여행 에세이", "인물/자전적"],
  인문: [
    "철학",
    "심리학",
    "역사일반",
    "동양사상",
    "서양사상",
    "종교",
    "예술/문화",
  ],
  사회과학: [
    "정치/사회",
    "법률",
    "경제학(일반)",
    "사회학",
    "교육학",
    "언론/미디어",
  ],
  "경영/경제": [
    "경영일반",
    "마케팅/세일즈",
    "재테크/투자",
    "창업/취업",
    "경제이론",
  ],
  자기계발: ["성공/처세", "인간관계", "시간관리", "리더십", "코칭"],
  "IT/컴퓨터": [
    "프로그래밍 언어",
    "OS/데이터베이스",
    "네트워크/보안",
    "웹 개발",
    "모바일 앱 개발",
    "AI/머신러닝",
    "데이터 분석",
    "IT자격증",
  ],
  // 필요에 따라 더 많은 카테고리와 하위 카테고리를 추가할 수 있습니다.
};

// Firebase Storage 이미지 URL 목록 (표지 이미지용)
const sampleCoverImageUrls = [
  "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-1.png?alt=media&token=3bd34326-431b-4654-aef3-7db0f2738972",
  "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-10.png?alt=media&token=d3452afd-608a-4529-87a9-c8871872ff7f",
  "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-3.png?alt=media&token=cd0f35a8-a09c-4cd5-a527-2c229066d279",
  "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FM-AG1-1.png?alt=media&token=21827222-9c14-4828-8918-3569b2c08ce5",
  "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/HP1%2FF-HP1-10.png?alt=media&token=1d7d51d6-78d6-4bba-b5db-a96453e605ab",
  "https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/HP1%2FF-HP1-12.png?alt=media&token=3292f705-5a04-4201-8fe3-4cabbbf1998a",
];

// 랜덤 표지 이미지 URL 반환 함수
const getRandomCoverImage = () =>
  sampleCoverImageUrls[Math.floor(Math.random() * sampleCoverImageUrls.length)];

// Updated Initial Data reflecting new structure + audio/ebook info
export const initialBooks = [
  {
    key: "1",
    BOOK_ID: "db2d7f6d848c4742",
    BOOK_NAME: "숙론",
    BOOK_AUTHOR: "최재천",
    BOOK_AUTHOR_INTRODUCTION: "대한민국의 대표적인 생태학자이자 진화생물학자. 자연과 생명에 대한 깊이 있는 통찰로 많은 독자들에게 영감을 주고 있습니다.",
    BOOK_TRANSLATOR: "김번역",
    BOOK_PUBLISHER: "김영사",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1240",
    CATEGORY_NAME: "사회과학",
    SUB_CATEGORY_NAME: "교양과학",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-05-17",
    REGISTRATION_DATE: "2024-05-10",
    SERVICE_OPEN_DATE: "2024-05-20",
    TAKE_COUNT: "73",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791138434195",
    LANGUAGE: ["ko"],
    TAGS: ["역사", "자기계발"],
    AGE_GROUP: "all",
    DESCRIPTION: "숙고하고 토론해야 할 우리 시대의 다양한 질문들",
    TOC: "1부...",
    SUMMARY: "우리는 끊임없이...",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 320,
    COPYRIGHT_INFO: "김영사 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW:
      "출판사 서평: 이 책은 현대 사회의 다양한 문제들을 깊이 있게 다루고 있습니다.",
    BOOK_FILE_NAME: "숙론_최종.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "이 시대의 필독서",
    RECOMMENDATION_MESSAGE: "최재천 교수와 함께하는 깊이 있는 토론의 장으로 여러분을 초대합니다. 생각을 넓히고 지적 대화를 나눌 수 있는 최고의 기회입니다.",
    RECOMMENDATION_TEXTS: ["#생각의_전환", "#지적_대화", "#필독서", "#최재천"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "2",
    BOOK_ID: "anotherBook123",
    BOOK_NAME: "React 마스터하기",
    BOOK_AUTHOR: "김개발",
    BOOK_AUTHOR_INTRODUCTION: "실리콘밸리에서 다년간의 경험을 쌓은 프론트엔드 개발 전문가. 복잡한 웹 기술을 쉽고 명쾌하게 설명하는 데 탁월합니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "IT출판",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "500",
    CATEGORY_NAME: "IT/컴퓨터",
    SUB_CATEGORY_NAME: "프로그래밍",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2023-01-15",
    REGISTRATION_DATE: "2023-01-10",
    SERVICE_OPEN_DATE: null,
    TAKE_COUNT: "150",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791162240101",
    LANGUAGE: ["ko", "en"],
    TAGS: ["자기계발"],
    AGE_GROUP: "all",
    DESCRIPTION: "React의 기초부터 심화까지 다루는 개발 서적",
    TOC: null,
    SUMMARY: null,
    SERIES_NAME: "웹 개발 시리즈",
    SERIES_NUM: 1,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 600,
    COPYRIGHT_INFO: "IT출판 © 2023",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "react_guide.pdf",
    RECOMMENDATION_TITLE: "React 개발자 필독서",
    RECOMMENDATION_MESSAGE: "React의 모든 것을 담았습니다. 이 책 한 권으로 React 마스터가 되어보세요.",
    RECOMMENDATION_TEXTS: ["#React정복", "#프론트엔드_필수템", "#개발자_추천"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "3",
    BOOK_ID: "someOtherId456",
    BOOK_NAME: "Node.js 실전 가이드",
    BOOK_AUTHOR: "박코딩",
    BOOK_AUTHOR_INTRODUCTION: "다수의 대규모 프로젝트를 이끈 백엔드 아키텍트. 실전에서 바로 적용할 수 있는 견고한 서버 구축 노하우를 공유합니다.",
    BOOK_TRANSLATOR: "이코딩",
    BOOK_PUBLISHER: "코딩북스",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "501",
    CATEGORY_NAME: "IT/컴퓨터",
    BOOK_SERVICE_YN: "N",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2023-05-20",
    REGISTRATION_DATE: "2023-05-15",
    SERVICE_OPEN_DATE: "2023-06-01",
    TAKE_COUNT: "88",
    BOOK_ADULT_YN: "Y",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791162240231",
    LANGUAGE: ["ko"],
    TAGS: ["자기계발"],
    AGE_GROUP: "adult",
    DESCRIPTION: "Node.js를 활용한 실전 백엔드 개발 가이드",
    TOC: "1. Node.js 소개...",
    SUMMARY: "Node.js는...",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "PDF",
    DRM_YN: "Y",
    PAGE_COUNT: 450,
    COPYRIGHT_INFO: "코딩북스 © 2023",
    SERVICE_REGION: "KR",
    SUB_CATEGORY_NAME: "백엔드 프로그래밍",
    BOOK_FILE_NAME: "",
    RECOMMENDATION_TITLE: "",
    RECOMMENDATION_MESSAGE: "",
    RECOMMENDATION_TEXTS: [],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "4",
    BOOK_ID: "audiobook789",
    BOOK_NAME: "불편한 편의점 (오디오북)",
    BOOK_AUTHOR: "김호연",
    BOOK_AUTHOR_INTRODUCTION: "따뜻한 시선으로 우리 주변의 이야기를 그려내는 소설가. 그의 작품은 평범한 일상 속에서 특별한 감동을 발견하게 합니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "나무옆의자",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1240",
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "한국소설",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2022-08-10",
    REGISTRATION_DATE: "2022-08-01",
    SERVICE_OPEN_DATE: "2022-08-15",
    TAKE_COUNT: "250",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    PLAY_TIME: "08:35:20",
    LEADER_NAME: "김유정",
    LEADER_JOB: "성우",
    ISBN: "9791161571188",
    LANGUAGE: ["ko"],
    TAGS: ["가족", "성장"],
    AGE_GROUP: "all",
    DESCRIPTION:
      "서울역 뒤편 골목길의 작은 편의점에서 벌어지는 이야기 (오디오북)",
    TOC: null,
    SUMMARY: null,
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    PAGE_COUNT: null,
    PRICE: 12600,
    COPYRIGHT_INFO: "나무옆의자 © 2022",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    RECOMMENDATION_TITLE: "마음이 따뜻해지는 이야기",
    RECOMMENDATION_MESSAGE: "김유정 성우의 목소리로 듣는 '불편한 편의점', 잠시 쉬어가고 싶은 당신에게 위로를 선사합니다.",
    RECOMMENDATION_TEXTS: ["#오늘의_위로", "#따뜻한_목소리", "#스테디셀러"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  // 나머지 initialBooks 데이터에도 BOOK_TRANSLATOR: '' (또는 실제값) 추가 필요
  {
    key: "5",
    BOOK_ID: "ebook5",
    BOOK_NAME: "데이터 분석 입문",
    BOOK_AUTHOR: "이나영",
    BOOK_AUTHOR_INTRODUCTION: "데이터 분석 분야의 전문가로, 복잡한 데이터를 시각화하고 인사이트를 도출하는 데 강점을 가지고 있습니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "데이터사이언스",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "IT/컴퓨터",
    SUB_CATEGORY_NAME: "데이터 분석",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-01-20",
    REGISTRATION_DATE: "2024-01-15",
    SERVICE_OPEN_DATE: null,
    TAKE_COUNT: "120",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9791199000005",
    PRICE: 25000,
    PAGE_COUNT: 400,
    TAGS: ["자기계발"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#데이터", "#Python", "#R"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "6",
    BOOK_ID: "audio6",
    BOOK_NAME: "달러구트 꿈 백화점 (오디오북)",
    BOOK_AUTHOR: "이미예",
    BOOK_AUTHOR_INTRODUCTION: "독창적인 상상력으로 꿈과 현실의 경계를 넘나드는 이야기를 만들어내는 작가. 독자들에게 새로운 세계를 선물합니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "팩토리나인",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "판타지",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2023-11-01",
    REGISTRATION_DATE: "2023-10-25",
    TAKE_COUNT: "300",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "20",
    ISBN: "9791165341909",
    PRICE: 13800,
    PLAY_TIME: "07:15:00",
    LEADER_NAME: "박지윤",
    LEADER_JOB: "성우",
    TAGS: ["판타지", "성장"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#판타지", "#꿈"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "7",
    BOOK_ID: "ebook7",
    BOOK_NAME: "여행의 이유",
    BOOK_AUTHOR: "김영하",
    BOOK_AUTHOR_INTRODUCTION: "대한민국을 대표하는 소설가이자 이야기꾼. 여행과 인생에 대한 깊은 성찰을 담은 글로 많은 사랑을 받고 있습니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "문학동네",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "시/에세이",
    SUB_CATEGORY_NAME: "에세이",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2019-04-17",
    REGISTRATION_DATE: "2019-04-10",
    TAKE_COUNT: "500",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788954655972",
    PRICE: 13500,
    PAGE_COUNT: 216,
    TAGS: ["모험", "여행", "성장"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#여행", "#에세이", "#김영하"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "8",
    BOOK_ID: "ebook8",
    BOOK_NAME: "사피엔스",
    BOOK_AUTHOR: "유발 하라리",
    BOOK_AUTHOR_INTRODUCTION: "이스라엘의 역사학자이자 미래학자. 인류의 과거, 현재, 미래를 넘나드는 거대 담론으로 전 세계 지성계에 큰 영향을 미쳤습니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "김영사",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "인문",
    SUB_CATEGORY_NAME: "역사",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2015-11-24",
    REGISTRATION_DATE: "2015-11-20",
    TAKE_COUNT: "800",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788934972464",
    PRICE: 22000,
    PAGE_COUNT: 696,
    TAGS: ["역사", "성장"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#역사", "#인류", "#빅 히스토리"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "9",
    BOOK_ID: "audio9",
    BOOK_NAME: "미드나잇 라이브러리 (오디오북)",
    BOOK_AUTHOR: "매트 헤이그",
    BOOK_AUTHOR_INTRODUCTION: "인간의 삶과 정신 건강에 대한 주제를 따뜻하고 독창적인 판타지로 풀어내는 영국 작가.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "인플루엔셜",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "영미소설",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2021-04-28",
    REGISTRATION_DATE: "2021-04-20",
    TAKE_COUNT: "450",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    ISBN: "9791191056540",
    PRICE: 15800,
    PLAY_TIME: "09:50:30",
    LEADER_NAME: "강수진",
    LEADER_JOB: "성우",
    TAGS: ["판타지", "성장"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#판타지", "#인생", "#선택"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "10",
    BOOK_ID: "ebook10",
    BOOK_NAME: "파이썬 알고리즘 인터뷰",
    BOOK_AUTHOR: "박상길",
    BOOK_AUTHOR_INTRODUCTION: "구글, 페이스북 등 글로벌 IT 기업에서의 경험을 바탕으로 실전적인 코딩 테스트 문제 해결 전략을 제시하는 개발자.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "책만",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "IT/컴퓨터",
    SUB_CATEGORY_NAME: "알고리즘",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2020-07-15",
    REGISTRATION_DATE: "2020-07-10",
    TAKE_COUNT: "210",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9791189909178",
    PRICE: 38000,
    PAGE_COUNT: 960,
    TAGS: ["자기계발"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#Python", "#알고리즘", "#코딩테스트"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "11",
    BOOK_ID: "ebook11",
    BOOK_NAME: "부자 아빠 가난한 아빠",
    BOOK_AUTHOR: "로버트 기요사키",
    BOOK_AUTHOR_INTRODUCTION: "금융 교육의 중요성을 전파하는 세계적인 투자 교육가. 그의 책은 수많은 사람들의 금융 지식을 바꾸어 놓았습니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "민음인",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "경영/경제",
    SUB_CATEGORY_NAME: "재테크",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2018-02-07",
    REGISTRATION_DATE: "2018-02-01",
    TAKE_COUNT: "650",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788980715990",
    PRICE: 15000,
    PAGE_COUNT: 460,
    TAGS: ["자기계발", "성공"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#재테크", "#부자", "#투자"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "12",
    BOOK_ID: "audio12",
    BOOK_NAME: "클루지 (오디오북)",
    BOOK_AUTHOR: "개리 마커스",
    BOOK_AUTHOR_INTRODUCTION: "인지심리학 분야의 세계적 석학. 인간 마음의 불완전성과 그 작동 방식을 명쾌하게 설명합니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "갤리온",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "인문",
    SUB_CATEGORY_NAME: "심리학",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2023-09-15",
    REGISTRATION_DATE: "2023-09-10",
    TAKE_COUNT: "180",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    ISBN: "9788901261837",
    PRICE: 16000,
    PLAY_TIME: "06:20:10",
    LEADER_NAME: "김상현",
    LEADER_JOB: "전문낭독가",
    TAGS: ["자기계발", "성장"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#심리학", "#뇌과학", "#인지오류"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "13",
    BOOK_ID: "ebook13",
    BOOK_NAME: "코스모스",
    BOOK_AUTHOR: "칼 세이건",
    BOOK_AUTHOR_INTRODUCTION: "천문학의 대중화에 기여한 20세기 최고의 과학 커뮤니케이터. 그의 저서는 여러 세대에 걸쳐 과학의 경이로움을 전하고 있습니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "사이언스북스",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "사회과학",
    SUB_CATEGORY_NAME: "교양과학",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2006-12-20",
    REGISTRATION_DATE: "2006-12-15",
    TAKE_COUNT: "720",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788983711892",
    PRICE: 20000,
    PAGE_COUNT: 752,
    TAGS: ["공상과학", "우주"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#우주", "#과학", "#칼 세이건"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "14",
    BOOK_ID: "ebook14",
    BOOK_NAME: "팩트풀니스",
    BOOK_AUTHOR: "한스 로슬링",
    BOOK_AUTHOR_INTRODUCTION: "데이터를 통해 세상의 진실을 알리는 데 평생을 바친 스웨덴의 의사이자 통계학자. 사실에 기반한 세계 이해를 강조했습니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "김영사",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "사회과학",
    SUB_CATEGORY_NAME: "사회비평",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2019-03-08",
    REGISTRATION_DATE: "2019-03-01",
    TAKE_COUNT: "550",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788934986799",
    PRICE: 19800,
    PAGE_COUNT: 464,
    TAGS: ["자기계발", "성장"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
    RECOMMENDATION_TEXTS: ["#데이터", "#통계", "#세상읽기"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  // --- 추가 더미 데이터 (시리즈 테스트용) ---
  {
    key: "15",
    BOOK_ID: "series_test_1_1",
    BOOK_NAME: "나니아 연대기 1: 사자와 마녀와 옷장",
    BOOK_AUTHOR: "C.S. 루이스",
    BOOK_AUTHOR_INTRODUCTION: "20세기 영문학의 거장. 신화와 판타지를 통해 깊이 있는 신학적, 철학적 메시지를 전달하는 것으로 유명합니다.",
    BOOK_TRANSLATOR: "햇살과나무꾼",
    BOOK_PUBLISHER: "시공주니어",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "판타지",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2005-11-15",
    REGISTRATION_DATE: "2023-10-01",
    TAKE_COUNT: "320",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788952743174",
    PRICE: 12000,
    PAGE_COUNT: 248,
    TAGS: ["판타지", "모험", "고전"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    SERIES_NAME: "나니아 연대기",
    SERIES_NUM: 1,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#판타지", "#모험", "#고전"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "16",
    BOOK_ID: "series_test_1_2",
    BOOK_NAME: "나니아 연대기 2: 캐스피언 왕자",
    BOOK_AUTHOR: "C.S. 루이스",
    BOOK_AUTHOR_INTRODUCTION: "20세기 영문학의 거장. 신화와 판타지를 통해 깊이 있는 신학적, 철학적 메시지를 전달하는 것으로 유명합니다.",
    BOOK_TRANSLATOR: "햇살과나무꾼",
    BOOK_PUBLISHER: "시공주니어",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "판타지",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2005-12-20",
    REGISTRATION_DATE: "2023-10-01",
    TAKE_COUNT: "280",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788952743181",
    PRICE: 12000,
    PAGE_COUNT: 280,
    TAGS: ["판타지", "모험"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    SERIES_NAME: "나니아 연대기",
    SERIES_NUM: 2,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#판타지", "#모험"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "17",
    BOOK_ID: "series_test_2_1",
    BOOK_NAME: "멋진 신세계",
    BOOK_AUTHOR: "올더스 헉슬리",
    BOOK_AUTHOR_INTRODUCTION: "날카로운 통찰력으로 현대 문명의 문제를 파헤친 영국의 소설가이자 비평가. 디스토피아 소설의 선구자로 평가받습니다.",
    BOOK_TRANSLATOR: "안정효",
    BOOK_PUBLISHER: "소담출판사",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "SF",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2015-06-25",
    REGISTRATION_DATE: "2023-11-05",
    TAKE_COUNT: "410",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "10",
    ISBN: "9788973814371",
    PRICE: 13500,
    PAGE_COUNT: 368,
    TAGS: ["SF", "디스토피아", "고전"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    SERIES_NAME: "멋진 신세계 시리즈",
    SERIES_NUM: 1,
    VIDEO_URL: "https://sample.com/brave_new_world_trailer.mp4",
    RECOMMENDATION_TEXTS: ["#SF", "#디스토피아", "#고전"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "18",
    BOOK_ID: "series_test_3_1",
    BOOK_NAME: "반지의 제왕 1: 반지 원정대",
    BOOK_AUTHOR: "J.R.R. 톨킨",
    BOOK_AUTHOR_INTRODUCTION: "현대 판타지 문학의 아버지. 언어학자로서의 깊은 지식을 바탕으로 방대하고 정교한 세계관을 창조했습니다.",
    BOOK_TRANSLATOR: "김번",
    BOOK_PUBLISHER: "씨앗을뿌리는사람",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "판타지",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2001-10-30",
    REGISTRATION_DATE: "2023-09-15",
    TAKE_COUNT: "780",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788956370167",
    PRICE: 18000,
    PAGE_COUNT: 680,
    TAGS: ["판타지", "대서사시", "모험"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    SERIES_NAME: "반지의 제왕",
    SERIES_NUM: 1,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#판타지", "#대서사시", "#모험"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "19",
    BOOK_ID: "series_test_3_2",
    BOOK_NAME: "반지의 제왕 2: 두 개의 탑",
    BOOK_AUTHOR: "J.R.R. 톨킨",
    BOOK_AUTHOR_INTRODUCTION: "현대 판타지 문학의 아버지. 언어학자로서의 깊은 지식을 바탕으로 방대하고 정교한 세계관을 창조했습니다.",
    BOOK_TRANSLATOR: "김번",
    BOOK_PUBLISHER: "씨앗을뿌리는사람",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "판타지",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2001-10-30",
    REGISTRATION_DATE: "2023-09-15",
    TAKE_COUNT: "750",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788956370174",
    PRICE: 18000,
    PAGE_COUNT: 608,
    TAGS: ["판타지", "대서사시", "전쟁"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    SERIES_NAME: "반지의 제왕",
    SERIES_NUM: 2,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#판타지", "#대서사시", "#전쟁"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "20",
    BOOK_ID: "series_test_3_3",
    BOOK_NAME: "반지의 제왕 3: 왕의 귀환",
    BOOK_AUTHOR: "J.R.R. 톨킨",
    BOOK_AUTHOR_INTRODUCTION: "현대 판타지 문학의 아버지. 언어학자로서의 깊은 지식을 바탕으로 방대하고 정교한 세계관을 창조했습니다.",
    BOOK_TRANSLATOR: "김번",
    BOOK_PUBLISHER: "씨앗을뿌리는사람",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "판타지",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2001-10-30",
    REGISTRATION_DATE: "2023-09-15",
    TAKE_COUNT: "820",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788956370181",
    PRICE: 18000,
    PAGE_COUNT: 720,
    TAGS: ["판타지", "대서사시", "결말"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    SERIES_NAME: "반지의 제왕",
    SERIES_NUM: 3,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#판타지", "#대서사시", "#결말"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "21",
    BOOK_ID: "no_series_book_1",
    BOOK_NAME: "침묵의 봄",
    BOOK_AUTHOR: "레이첼 카슨",
    BOOK_AUTHOR_INTRODUCTION: "환경 운동의 시작을 알린 해양 생물학자이자 작가. 그의 책은 전 세계적인 환경 정책 변화를 이끌어냈습니다.",
    BOOK_TRANSLATOR: "김은령",
    BOOK_PUBLISHER: "에코리브르",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "사회과학",
    SUB_CATEGORY_NAME: "환경",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2002-05-10",
    REGISTRATION_DATE: "2023-12-01",
    TAKE_COUNT: "300",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788990674062",
    PRICE: 15000,
    PAGE_COUNT: 376,
    TAGS: ["역사"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    SERIES_NAME: "",
    SERIES_NUM: null,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#환경", "#고전", "#과학"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "22",
    BOOK_ID: "audio_series_1_1",
    BOOK_NAME: "해리 포터와 마법사의 돌 (오디오북)",
    BOOK_AUTHOR: "J.K. 롤링",
    BOOK_AUTHOR_INTRODUCTION: "시대를 초월하는 상상력으로 '해리 포터' 시리즈를 창조한 영국의 작가. 전 세계 수많은 독자들에게 마법 같은 경험을 선사했습니다.",
    BOOK_TRANSLATOR: "김혜원",
    BOOK_PUBLISHER: "문학수첩 리틀북",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "판타지",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2019-11-15",
    REGISTRATION_DATE: "2023-11-20",
    TAKE_COUNT: "900",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "20",
    PLAY_TIME: "09:33:00",
    LEADER_NAME: "조지 블래그덴",
    LEADER_JOB: "배우",
    ISBN: "9780751575628",
    PRICE: 22000,
    PAGE_COUNT: null,
    TAGS: ["판타지", "마법", "성장"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    SERIES_NAME: "해리 포터 (오디오북)",
    SERIES_NUM: 1,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#판타지", "#마법", "#오디오북"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "23",
    BOOK_ID: "audio_series_1_2",
    BOOK_NAME: "해리 포터와 비밀의 방 (오디오북)",
    BOOK_AUTHOR: "J.K. 롤링",
    BOOK_AUTHOR_INTRODUCTION: "시대를 초월하는 상상력으로 '해리 포터' 시리즈를 창조한 영국의 작가. 전 세계 수많은 독자들에게 마법 같은 경험을 선사했습니다.",
    BOOK_TRANSLATOR: "김혜원",
    BOOK_PUBLISHER: "문학수첩 리틀북",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "소설",
    SUB_CATEGORY_NAME: "판타지",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2019-11-15",
    REGISTRATION_DATE: "2023-11-20",
    TAKE_COUNT: "850",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "20",
    PLAY_TIME: "11:05:00",
    LEADER_NAME: "조지 블래그덴",
    LEADER_JOB: "배우",
    ISBN: "9780751575635",
    PRICE: 22000,
    PAGE_COUNT: null,
    TAGS: ["판타지", "모험"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    SERIES_NAME: "해리 포터 (오디오북)",
    SERIES_NUM: 2,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#판타지", "#모험", "#오디오북"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "24",
    BOOK_ID: "it_series_1",
    BOOK_NAME: "Clean Code 클린 코드",
    BOOK_AUTHOR: "로버트 C. 마틴",
    BOOK_AUTHOR_INTRODUCTION: "애자일 소프트웨어 개발 운동의 선구자 중 한 명. 'Uncle Bob'이라는 별명으로 불리며, 전 세계 개발자들에게 큰 영향을 미치고 있습니다.",
    BOOK_TRANSLATOR: "박재호",
    BOOK_PUBLISHER: "인사이트",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "IT/컴퓨터",
    SUB_CATEGORY_NAME: "프로그래밍",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2013-09-24",
    REGISTRATION_DATE: "2023-08-10",
    TAKE_COUNT: "1200",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788966260959",
    PRICE: 30000,
    PAGE_COUNT: 500,
    TAGS: ["프로그래밍", "소프트웨어 개발", "클린코드"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    SERIES_NAME: "클린 시리즈",
    SERIES_NUM: 1,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#프로그래밍", "#소프트웨어 개발", "#클린코드"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "25",
    BOOK_ID: "it_series_2",
    BOOK_NAME: "Clean Architecture 클린 아키텍처",
    BOOK_AUTHOR: "로버트 C. 마틴",
    BOOK_AUTHOR_INTRODUCTION: "애자일 소프트웨어 개발 운동의 선구자 중 한 명. 'Uncle Bob'이라는 별명으로 불리며, 전 세계 개발자들에게 큰 영향을 미치고 있습니다.",
    BOOK_TRANSLATOR: "송준이",
    BOOK_PUBLISHER: "인사이트",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "IT/컴퓨터",
    SUB_CATEGORY_NAME: "소프트웨어 공학",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2019-07-31",
    REGISTRATION_DATE: "2023-08-15",
    TAKE_COUNT: "950",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9788966262472",
    PRICE: 32000,
    PAGE_COUNT: 432,
    TAGS: ["소프트웨어 아키텍처", "클린코드"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    SERIES_NAME: "클린 시리즈",
    SERIES_NUM: 2,
    VIDEO_URL: "",
    RECOMMENDATION_TEXTS: ["#소프트웨어 아키텍처", "#클린코드"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "26",
    BOOK_ID: "dummyBook001",
    BOOK_NAME: "미래 도시",
    BOOK_AUTHOR: "박과학",
    BOOK_AUTHOR_INTRODUCTION: "미래 기술과 도시 계획 전문가. 기술 발전이 인간의 삶과 사회에 미칠 영향에 대해 깊이 연구하고 있습니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "사이언스북스",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "700",
    CATEGORY_NAME: "과학",
    SUB_CATEGORY_NAME: "미래기술",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-06-01",
    REGISTRATION_DATE: "2024-05-25",
    SERVICE_OPEN_DATE: "2024-06-05",
    TAKE_COUNT: "120",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340011",
    LANGUAGE: ["ko"],
    TAGS: ["미래", "기술"],
    AGE_GROUP: "all",
    DESCRIPTION: "미래 도시의 모습과 기술 발전에 대한 통찰",
    TOC: "1. 서론...",
    SUMMARY: "도시는 어떻게 변할 것인가...",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 410,
    COPYRIGHT_INFO: "사이언스북스 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "미래를 준비하는 이들을 위한 필독서",
    BOOK_FILE_NAME: "future_city.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "미래를 먼저 만나보세요",
    RECOMMENDATION_MESSAGE: "박과학 저자와 함께 미래 도시로의 여행을 떠나보세요.",
    RECOMMENDATION_TEXTS: ["#미래도시", "#기술", "#4차산업혁명"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "27",
    BOOK_ID: "dummyAudio001",
    BOOK_NAME: "마음을 울리는 시",
    BOOK_AUTHOR: "이감성",
    BOOK_AUTHOR_INTRODUCTION: "섬세한 언어로 일상의 순간들을 포착하여 독자들의 마음에 깊은 울림을 주는 시인입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "문학동네",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "200",
    CATEGORY_NAME: "시/에세이",
    SUB_CATEGORY_NAME: "한국 시",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2024-06-10",
    REGISTRATION_DATE: "2024-06-01",
    SERVICE_OPEN_DATE: "2024-06-15",
    TAKE_COUNT: "80",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "20",
    PLAY_TIME: "01:30:00",
    LEADER_NAME: "김목소리",
    LEADER_JOB: "성우",
    ISBN: "9791112340022",
    LANGUAGE: ["ko"],
    TAGS: ["시", "감성"],
    AGE_GROUP: "all",
    DESCRIPTION: "삶의 순간들을 포착한 아름다운 시 모음",
    TOC: "1부. 그리움...",
    SUMMARY: "이감성 시인의 따뜻한 시선...",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    PAGE_COUNT: 0,
    COPYRIGHT_INFO: "문학동네 © 2024",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "성우의 목소리로 듣는 감동적인 시",
    BOOK_FILE_NAME: "heartfelt_poems.mp3",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "당신의 마음을 위한 시",
    RECOMMENDATION_MESSAGE: "지친 하루의 끝, 아름다운 시와 함께 하세요.",
    RECOMMENDATION_TEXTS: ["#힐링", "#시낭송", "#감성충전"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "28",
    BOOK_ID: "dummyBook002",
    BOOK_NAME: "투자의 정석",
    BOOK_AUTHOR: "김머니",
    BOOK_AUTHOR_INTRODUCTION: "다년간의 실전 투자 경험을 바탕으로 일반 투자자들에게 건전하고 합리적인 투자 철학을 전파하는 금융 전문가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "경제출판",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "600",
    CATEGORY_NAME: "경영/경제",
    SUB_CATEGORY_NAME: "재테크/투자",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-07-01",
    REGISTRATION_DATE: "2024-06-20",
    SERVICE_OPEN_DATE: "2024-07-05",
    TAKE_COUNT: "250",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340033",
    LANGUAGE: ["ko"],
    TAGS: ["투자", "재테크"],
    AGE_GROUP: "all",
    DESCRIPTION: "초보자를 위한 투자의 모든 것",
    TOC: "1장. 투자란 무엇인가...",
    SUMMARY: "성공적인 투자를 위한 기본 원칙...",
    SERIES_NAME: "부자되기 시리즈",
    SERIES_NUM: 1,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 350,
    COPYRIGHT_INFO: "경제출판 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "investment_basics.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "경제적 자유를 향한 첫걸음",
    RECOMMENDATION_MESSAGE: "김머니 전문가와 함께 투자의 세계에 입문하세요.",
    RECOMMENDATION_TEXTS: ["#주식", "#부동산", "#재테크"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "29",
    BOOK_ID: "dummyBook003",
    BOOK_NAME: "시간 여행자의 일기",
    BOOK_AUTHOR: "최판타",
    BOOK_AUTHOR_INTRODUCTION: "기발한 상상력과 탄탄한 스토리 구성으로 독자들을 새로운 세계로 이끄는 판타지 소설가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "판타지월드",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1800",
    CATEGORY_NAME: "판타지/무협",
    SUB_CATEGORY_NAME: "타임슬립",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-07-10",
    REGISTRATION_DATE: "2024-07-01",
    SERVICE_OPEN_DATE: "2024-07-15",
    TAKE_COUNT: "300",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340044",
    LANGUAGE: ["ko"],
    TAGS: ["시간여행", "판타지"],
    AGE_GROUP: "all",
    DESCRIPTION: "시간을 넘나드는 한 남자의 특별한 이야기",
    TOC: "프롤로그...",
    SUMMARY: "과거와 미래를 오가며...",
    SERIES_NAME: "시간 여행자 시리즈",
    SERIES_NUM: 1,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 480,
    COPYRIGHT_INFO: "판타지월드 © 2024",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "상상력을 자극하는 새로운 판타지 소설",
    BOOK_FILE_NAME: "time_traveler.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "시간을 지배하는 자, 누구인가?",
    RECOMMENDATION_MESSAGE: "숨막히는 전개와 반전이 당신을 기다립니다.",
    RECOMMENDATION_TEXTS: ["#타임슬립", "#판타지소설", "#강력추천"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "30",
    BOOK_ID: "dummyAudio002",
    BOOK_NAME: "성공하는 사람들의 습관",
    BOOK_AUTHOR: "박성공",
    BOOK_AUTHOR_INTRODUCTION: "성공학과 리더십 분야의 전문가로, 많은 이들에게 동기를 부여하고 삶의 긍정적인 변화를 이끌어내는 데 기여하고 있습니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "자기계발사",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "400",
    CATEGORY_NAME: "자기계발",
    SUB_CATEGORY_NAME: "성공/처세",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2024-08-01",
    REGISTRATION_DATE: "2024-07-20",
    SERVICE_OPEN_DATE: "2024-08-05",
    TAKE_COUNT: "500",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    PLAY_TIME: "05:30:00",
    LEADER_NAME: "이성공",
    LEADER_JOB: "동기부여가",
    ISBN: "9791112340055",
    LANGUAGE: ["ko"],
    TAGS: ["성공", "습관"],
    AGE_GROUP: "all",
    DESCRIPTION: "성공을 부르는 7가지 습관에 대한 오디오북",
    TOC: "1. 주도적이 되라...",
    SUMMARY: "성공한 사람들의 공통적인 습관을 분석...",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    PAGE_COUNT: 0,
    COPYRIGHT_INFO: "자기계발사 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "success_habits.mp3",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "당신의 인생을 바꿀 습관",
    RECOMMENDATION_MESSAGE: "오디오북으로 들으며 성공 습관을 만들어보세요.",
    RECOMMENDATION_TEXTS: ["#자기계발", "#성공학", "#오디오북추천"],
    DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
    LIKE_COUNT: Math.floor(Math.random() * 1000),
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "31",
    BOOK_ID: "dummyBook004",
    BOOK_NAME: "알고리즘 문제 해결",
    BOOK_AUTHOR: "이코딩",
    BOOK_AUTHOR_INTRODUCTION: "알고리즘과 자료구조에 대한 깊은 이해를 바탕으로 복잡한 문제 해결 능력을 키우는 데 도움을 주는 코딩 교육 전문가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "IT전문",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "550",
    CATEGORY_NAME: "IT/컴퓨터",
    SUB_CATEGORY_NAME: "알고리즘",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-08-10",
    REGISTRATION_DATE: "2024-08-01",
    SERVICE_OPEN_DATE: "2024-08-15",
    TAKE_COUNT: "400",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340066",
    LANGUAGE: ["ko"],
    TAGS: ["코딩", "알고리즘"],
    AGE_GROUP: "all",
    DESCRIPTION: "코딩 테스트를 위한 알고리즘 문제 해결 전략",
    TOC: "1. 자료구조...",
    SUMMARY: "주요 알고리즘 문제 유형과 풀이법을 소개...",
    SERIES_NAME: "코딩 테스트 시리즈",
    SERIES_NUM: 2,
    FILE_FORMAT: "PDF",
    DRM_YN: "Y",
    PAGE_COUNT: 700,
    COPYRIGHT_INFO: "IT전문 © 2024",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "개발자 취업 준비생 필독서",
    BOOK_FILE_NAME: "algorithm_solving.pdf",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "코딩 테스트, 이 책으로 끝내자",
    RECOMMENDATION_MESSAGE: "알고리즘 전문가가 알려주는 문제 해결의 핵심",
    RECOMMENDATION_TEXTS: ["#코딩테스트", "#알고리즘", "#개발자취업"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "32",
    BOOK_ID: "dummyBook005",
    BOOK_NAME: "로마 제국의 흥망성쇠",
    BOOK_AUTHOR: "김역사",
    BOOK_AUTHOR_INTRODUCTION: "고대사, 특히 로마사에 대한 해박한 지식을 바탕으로 역사적 사건들을 생생하게 전달하는 역사학자입니다.",
    BOOK_TRANSLATOR: "박번역",
    BOOK_PUBLISHER: "역사春秋",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "800",
    CATEGORY_NAME: "역사",
    SUB_CATEGORY_NAME: "서양사",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-09-01",
    REGISTRATION_DATE: "2024-08-20",
    SERVICE_OPEN_DATE: "2024-09-05",
    TAKE_COUNT: "180",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340077",
    LANGUAGE: ["ko"],
    TAGS: ["로마", "역사"],
    AGE_GROUP: "all",
    DESCRIPTION: "로마 제국의 천년 역사를 다룬 대서사시",
    TOC: "1권. 공화정의 시작...",
    SUMMARY: "로마의 건국부터 멸망까지...",
    SERIES_NAME: "세계사 시리즈",
    SERIES_NUM: 3,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 800,
    COPYRIGHT_INFO: "역사春秋 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "roman_empire.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "역사는 반복된다",
    RECOMMENDATION_MESSAGE: "로마의 역사를 통해 현재를 읽는 지혜를 얻으세요.",
    RECOMMENDATION_TEXTS: ["#로마사", "#역사공부", "#세계사"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "33",
    BOOK_ID: "dummyBook006",
    BOOK_NAME: "그녀의 이름은",
    BOOK_AUTHOR: "이사랑",
    BOOK_AUTHOR_INTRODUCTION: "인간 관계와 감정의 미묘한 흐름을 섬세하게 포착하여 독자들의 공감을 얻는 로맨스 소설 작가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "로맨스출판",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1700",
    CATEGORY_NAME: "로맨스/BL",
    SUB_CATEGORY_NAME: "현대 로맨스",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-09-10",
    REGISTRATION_DATE: "2024-09-01",
    SERVICE_OPEN_DATE: "2024-09-15",
    TAKE_COUNT: "600",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340088",
    LANGUAGE: ["ko"],
    TAGS: ["로맨스", "사랑"],
    AGE_GROUP: "all",
    DESCRIPTION: "두 남녀의 애틋한 사랑 이야기",
    TOC: "1. 첫 만남...",
    SUMMARY: "운명처럼 만난 두 사람...",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 320,
    COPYRIGHT_INFO: "로맨스출판 © 2024",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "가슴 설레는 로맨스가 필요하다면",
    BOOK_FILE_NAME: "her_name.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "올가을 최고의 로맨스",
    RECOMMENDATION_MESSAGE: "당신의 연애 세포를 깨울 단 하나의 소설",
    RECOMMENDATION_TEXTS: ["#로맨스소설", "#설렘주의", "#인생로맨스"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "34",
    BOOK_ID: "dummyAudio003",
    BOOK_NAME: "철학, 삶을 묻다",
    BOOK_AUTHOR: "박사유",
    BOOK_AUTHOR_INTRODUCTION: "어려운 철학적 개념들을 일상의 언어로 풀어내어 대중들이 철학에 쉽게 다가갈 수 있도록 돕는 철학자이자 작가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "지혜의숲",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "300",
    CATEGORY_NAME: "인문",
    SUB_CATEGORY_NAME: "철학",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2024-10-01",
    REGISTRATION_DATE: "2024-09-20",
    SERVICE_OPEN_DATE: "2024-10-05",
    TAKE_COUNT: "150",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    PLAY_TIME: "08:00:00",
    LEADER_NAME: "최철학",
    LEADER_JOB: "철학자",
    ISBN: "9791112340099",
    LANGUAGE: ["ko"],
    TAGS: ["철학", "인문"],
    AGE_GROUP: "all",
    DESCRIPTION: "삶의 근원적인 질문에 대한 철학적 탐구",
    TOC: "1. 나는 누구인가...",
    SUMMARY: "고대부터 현대까지, 위대한 철학자들의 지혜를 만나다.",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    PAGE_COUNT: 0,
    COPYRIGHT_INFO: "지혜의숲 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "철학자의 깊이 있는 해설로 듣는 철학 이야기",
    BOOK_FILE_NAME: "philosophy_asks.mp3",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "생각의 깊이를 더하다",
    RECOMMENDATION_MESSAGE: "출퇴근길, 귀로 듣는 인문학 강의",
    RECOMMENDATION_TEXTS: ["#인문학", "#철학입문", "#지적대화"],
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "35",
    BOOK_ID: "dummyBook007",
    BOOK_NAME: "코스모스",
    BOOK_AUTHOR: "칼 세이건",
    BOOK_AUTHOR_INTRODUCTION: "천문학의 대중화에 기여한 20세기 최고의 과학 커뮤니케이터. 그의 저서는 여러 세대에 걸쳐 과학의 경이로움을 전하고 있습니다.",
    BOOK_TRANSLATOR: "홍승수",
    BOOK_PUBLISHER: "사이언스북스",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "710",
    CATEGORY_NAME: "과학",
    SUB_CATEGORY_NAME: "천문학/우주",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2006-12-20",
    REGISTRATION_DATE: "2023-01-01",
    SERVICE_OPEN_DATE: "2023-01-10",
    TAKE_COUNT: "1200",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9788983711892",
    LANGUAGE: ["ko"],
    TAGS: ["우주", "과학고전"],
    AGE_GROUP: "all",
    DESCRIPTION: "우주에 대한 가장 위대한 이야기",
    TOC: "1. 코스모스의 바닷가에서...",
    SUMMARY: "우주의 경이로움을 탐험하는 과학 교양서의 고전",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 750,
    COPYRIGHT_INFO: "사이언스북스 © 2006",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "cosmos.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "시대를 초월한 과학의 명저",
    RECOMMENDATION_MESSAGE: "칼 세이건과 함께 떠나는 장대한 우주 탐험",
    RECOMMENDATION_TEXTS: ["#과학필독서", "#코스모스", "#칼세이건"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "36",
    BOOK_ID: "dummyBook008",
    BOOK_NAME: "요리의 과학",
    BOOK_AUTHOR: "최요리",
    BOOK_AUTHOR_INTRODUCTION: "요리 과정에 숨겨진 과학적 원리를 탐구하고 대중에게 알기 쉽게 전달하는 푸드 사이언티스트입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "라이프스타일북",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1400",
    CATEGORY_NAME: "라이프스타일",
    SUB_CATEGORY_NAME: "요리",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-11-01",
    REGISTRATION_DATE: "2024-10-20",
    SERVICE_OPEN_DATE: "2024-11-05",
    TAKE_COUNT: "220",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340111",
    LANGUAGE: ["ko"],
    TAGS: ["요리", "과학"],
    AGE_GROUP: "all",
    DESCRIPTION: "더 맛있는 요리를 위한 과학적 원리",
    TOC: "1. 맛의 원리...",
    SUMMARY: "요리 과정에 숨겨진 과학적 비밀을 파헤치다.",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 380,
    COPYRIGHT_INFO: "라이프스타일북 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "요리 초보부터 전문가까지 모두를 위한 책",
    BOOK_FILE_NAME: "cooking_science.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "당신의 주방을 실험실로!",
    RECOMMENDATION_MESSAGE: "요리의 원리를 알면 더 맛있는 요리가 가능합니다.",
    RECOMMENDATION_TEXTS: ["#요리책", "#푸드사이언스", "#홈쿡"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "37",
    BOOK_ID: "dummyBook009",
    BOOK_NAME: "파리에서의 일주일",
    BOOK_AUTHOR: "박여행",
    BOOK_AUTHOR_INTRODUCTION: "세계를 여행하며 겪은 경험과 감상을 감성적인 글과 사진으로 담아내는 여행 작가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "여행에세이",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1300",
    CATEGORY_NAME: "여행",
    SUB_CATEGORY_NAME: "유럽",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2024-04-10",
    REGISTRATION_DATE: "2024-04-01",
    SERVICE_OPEN_DATE: "2024-04-15",
    TAKE_COUNT: "180",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340122",
    LANGUAGE: ["ko"],
    TAGS: ["파리", "여행에세이"],
    AGE_GROUP: "all",
    DESCRIPTION: "파리의 골목골목을 누비며 기록한 여행기",
    TOC: "1일차. 몽마르뜨 언덕에서...",
    SUMMARY: "낭만과 예술의 도시, 파리를 만나다.",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 280,
    COPYRIGHT_INFO: "여행에세이 © 2024",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "week_in_paris.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "지금 당장 파리로 떠나고 싶다면",
    RECOMMENDATION_MESSAGE: "글과 사진으로 만나는 파리의 낭만",
    RECOMMENDATION_TEXTS: ["#파리여행", "#여행에세이", "#랜선여행"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "38",
    BOOK_ID: "dummyAudio004",
    BOOK_NAME: "어린 왕자",
    BOOK_AUTHOR: "생텍쥐페리",
    BOOK_AUTHOR_INTRODUCTION: "프랑스의 비행사이자 작가. '어린 왕자'를 통해 세대를 초월하여 사랑받는 순수한 가치와 관계의 소중함을 이야기했습니다.",
    BOOK_TRANSLATOR: "김화영",
    BOOK_PUBLISHER: "어린이출판",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1600",
    CATEGORY_NAME: "어린이",
    SUB_CATEGORY_NAME: "동화",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2015-01-01",
    REGISTRATION_DATE: "2023-02-01",
    SERVICE_OPEN_DATE: "2023-02-10",
    TAKE_COUNT: "2000",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    PLAY_TIME: "02:15:00",
    LEADER_NAME: "강수진",
    LEADER_JOB: "성우",
    ISBN: "9788932917225",
    LANGUAGE: ["ko"],
    TAGS: ["고전", "동화"],
    AGE_GROUP: "all",
    DESCRIPTION: "어른들을 위한 동화, 어린 왕자 오디오북",
    TOC: "1. 코끼리를 삼킨 보아뱀...",
    SUMMARY: "세상에서 가장 중요한 것은 눈에 보이지 않아.",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    PAGE_COUNT: 0,
    COPYRIGHT_INFO: "어린이출판 © 2015",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "little_prince_audio.mp3",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "마음으로 듣는 어린 왕자",
    RECOMMENDATION_MESSAGE: "성우의 목소리로 어린 왕자의 감동을 느껴보세요.",
    RECOMMENDATION_TEXTS: ["#어린왕자", "#오디오북", "#필독서"],
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "39",
    BOOK_ID: "dummyBook010",
    BOOK_NAME: "십대를 위한 철학",
    BOOK_AUTHOR: "최청춘",
    BOOK_AUTHOR_INTRODUCTION: "청소년들의 눈높이에 맞춰 철학적 사고의 즐거움을 알려주는 교육자이자 작가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "청소년교육",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1500",
    CATEGORY_NAME: "청소년",
    SUB_CATEGORY_NAME: "인문/교양",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-03-15",
    REGISTRATION_DATE: "2024-03-01",
    SERVICE_OPEN_DATE: "2024-03-20",
    TAKE_COUNT: "350",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340144",
    LANGUAGE: ["ko"],
    TAGS: ["청소년", "철학"],
    AGE_GROUP: "teen",
    DESCRIPTION: "청소년의 눈높이에 맞춘 철학 입문서",
    TOC: "1. 생각하는 힘...",
    SUMMARY: "스스로 생각하고 질문하는 십대를 위하여",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 290,
    COPYRIGHT_INFO: "청소년교육 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "청소년 필독 교양서",
    BOOK_FILE_NAME: "philosophy_for_teens.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "생각의 근육을 키우자!",
    RECOMMENDATION_MESSAGE: "세상을 다른 눈으로 보는 법을 배웁니다.",
    RECOMMENDATION_TEXTS: ["#청소년추천도서", "#철학수업", "#사고력"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "40",
    BOOK_ID: "dummyBook011",
    BOOK_NAME: "엄마의 첫 공부",
    BOOK_AUTHOR: "김육아",
    BOOK_AUTHOR_INTRODUCTION: "따뜻하고 현실적인 조언으로 초보 부모들의 든든한 멘토가 되어주는 육아 전문가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "부모출판",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1450",
    CATEGORY_NAME: "부모",
    SUB_CATEGORY_NAME: "육아법",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-02-20",
    REGISTRATION_DATE: "2024-02-10",
    SERVICE_OPEN_DATE: "2024-02-25",
    TAKE_COUNT: "450",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340155",
    LANGUAGE: ["ko"],
    TAGS: ["육아", "부모교육"],
    AGE_GROUP: "all",
    DESCRIPTION: "초보 부모를 위한 육아 지침서",
    TOC: "1. 아이의 마음 읽기...",
    SUMMARY: "아이와 함께 성장하는 부모가 되는 법",
    SERIES_NAME: "슬기로운 부모생활",
    SERIES_NUM: 1,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 310,
    COPYRIGHT_INFO: "부모출판 © 2024",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "moms_first_study.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "처음이라 서툰 당신을 위해",
    RECOMMENDATION_MESSAGE: "육아 전문가가 알려주는 현실 육아 꿀팁",
    RECOMMENDATION_TEXTS: ["#육아템", "#부모필독서", "#초보맘"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "41",
    BOOK_ID: "dummyBook012",
    BOOK_NAME: "영어 회화의 모든 것",
    BOOK_AUTHOR: "최영어",
    BOOK_AUTHOR_INTRODUCTION: "다년간의 강의 경험을 바탕으로 한국인에게 가장 효과적인 영어 학습법을 제시하는 영어 교육 전문가입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "외국어마스터",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "1100",
    CATEGORY_NAME: "외국어",
    SUB_CATEGORY_NAME: "영어",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2023-12-01",
    REGISTRATION_DATE: "2023-11-20",
    SERVICE_OPEN_DATE: "2023-12-05",
    TAKE_COUNT: "800",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340166",
    LANGUAGE: ["en", "ko"],
    TAGS: ["영어", "회화"],
    AGE_GROUP: "all",
    DESCRIPTION: "상황별 필수 영어 회화 표현 총정리",
    TOC: "Part 1. 공항에서...",
    SUMMARY: "실생활에서 바로 써먹는 영어 회화 패턴",
    SERIES_NAME: "정복 시리즈",
    SERIES_NUM: 3,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 550,
    COPYRIGHT_INFO: "외국어마스터 © 2023",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "english_conversation.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "영어 울렁증 극복!",
    RECOMMENDATION_MESSAGE: "이 책 한 권이면 당신도 영어 회화 달인",
    RECOMMENDATION_TEXTS: ["#영어공부", "#영어회화", "#어학"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "42",
    BOOK_ID: "dummyAudio005",
    BOOK_NAME: "명상, 마음을 쉬게 하는 기술",
    BOOK_AUTHOR: "박평온",
    BOOK_AUTHOR_INTRODUCTION: "현대인들이 스트레스에서 벗어나 마음의 평화를 찾을 수 있도록 돕는 명상 지도자입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "마음챙김",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "450",
    CATEGORY_NAME: "자기계발",
    SUB_CATEGORY_NAME: "명상/요가",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2023-11-15",
    REGISTRATION_DATE: "2023-11-01",
    SERVICE_OPEN_DATE: "2023-11-20",
    TAKE_COUNT: "600",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    PLAY_TIME: "03:00:00",
    LEADER_NAME: "김명상",
    LEADER_JOB: "명상가",
    ISBN: "9791112340177",
    LANGUAGE: ["ko"],
    TAGS: ["명상", "마음챙김"],
    AGE_GROUP: "all",
    DESCRIPTION: "명상 전문가가 안내하는 마음챙김 오디오북",
    TOC: "1. 호흡 명상...",
    SUMMARY: "복잡한 생각과 스트레스에서 벗어나는 시간",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    PAGE_COUNT: 0,
    COPYRIGHT_INFO: "마음챙김 © 2023",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "meditation_guide.mp3",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "하루 10분, 나를 위한 시간",
    RECOMMENDATION_MESSAGE: "오디오 가이드와 함께 쉽게 명상을 시작해보세요.",
    RECOMMENDATION_TEXTS: ["#명상앱", "#마음챙김", "#스트레스해소"],
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "43",
    BOOK_ID: "dummyBook013",
    BOOK_NAME: "우리가 몰랐던 세계사",
    BOOK_AUTHOR: "최역사",
    BOOK_AUTHOR_INTRODUCTION: "교과서에서는 다루지 않는 흥미로운 역사적 사실들을 발굴하여 대중에게 소개하는 역사 스토리텔러입니다.",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "역사탐구",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "810",
    CATEGORY_NAME: "역사",
    SUB_CATEGORY_NAME: "세계사",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2023-10-10",
    REGISTRATION_DATE: "2023-10-01",
    SERVICE_OPEN_DATE: "2023-10-15",
    TAKE_COUNT: "320",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791112340188",
    LANGUAGE: ["ko"],
    TAGS: ["역사", "교양"],
    AGE_GROUP: "all",
    DESCRIPTION: "교과서 밖의 흥미로운 세계사 이야기",
    TOC: "1장. 고대 문명의 비밀...",
    SUMMARY: "역사의 뒷이야기를 통해 세상을 보는 새로운 시각",
    SERIES_NAME: "교양 역사 시리즈",
    SERIES_NUM: 1,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 420,
    COPYRIGHT_INFO: "역사탐구 © 2023",
    SERVICE_REGION: "KR",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "hidden_history.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "역사 덕후들을 위한 책",
    RECOMMENDATION_MESSAGE: "알고 나면 더 재미있는 세계사 이야기",
    RECOMMENDATION_TEXTS: ["#역사책", "#세계사", "#교양"],
    REVIEW_COUNT: Math.floor(Math.random() * 1000),
  },
  {
    key: "44",
    BOOK_ID: "dummyAudio006",
    BOOK_NAME: "경제학 콘서트",
    BOOK_AUTHOR: "팀 하포드",
    BOOK_AUTHOR_INTRODUCTION: "일상 속 경제 현상을 날카롭고 재치있게 분석하는 영국의 경제학자이자 저널리스트. '卧底经济学家' (Undercover Economist)로 유명합니다.",
    BOOK_TRANSLATOR: "김명철",
    BOOK_PUBLISHER: "웅진지식하우스",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "610",
    CATEGORY_NAME: "경영/경제",
    SUB_CATEGORY_NAME: "경제학(일반)",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2006-08-25",
    REGISTRATION_DATE: "2023-05-01",
    SERVICE_OPEN_DATE: "2023-05-10",
    TAKE_COUNT: "950",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    PLAY_TIME: "09:30:00",
    LEADER_NAME: "박경제",
    LEADER_JOB: "경제평론가",
    ISBN: "9788901059539",
    LANGUAGE: ["ko"],
    TAGS: ["경제", "교양"],
    AGE_GROUP: "all",
    DESCRIPTION: "일상 속 경제학 원리를 쉽고 재미있게 설명한 오디오북",
    TOC: "1부. 스타벅스의 경영전략...",
    SUMMARY: "세상을 움직이는 경제학의 힘을 발견하다",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    PAGE_COUNT: 0,
    COPYRIGHT_INFO: "웅진지식하우스 © 2006",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "경제학 베스트셀러를 오디오북으로 만나보세요",
    BOOK_FILE_NAME: "economics_concert.mp3",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "귀로 듣는 경제학",
    RECOMMENDATION_MESSAGE: "복잡한 경제 원리를 명쾌하게 풀어드립니다.",
    RECOMMENDATION_TEXTS: ["#경제학", "#베스트셀러", "#오디오북"],
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
  {
    key: "45",
    BOOK_ID: "dummyBook014",
    BOOK_NAME: "사피엔스",
    BOOK_AUTHOR: "유발 하라리",
    BOOK_AUTHOR_INTRODUCTION: "이스라엘의 역사학자이자 미래학자. 인류의 과거, 현재, 미래를 넘나드는 거대 담론으로 전 세계 지성계에 큰 영향을 미쳤습니다.",
    BOOK_TRANSLATOR: "조현욱",
    BOOK_PUBLISHER: "김영사",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "310",
    CATEGORY_NAME: "인문",
    SUB_CATEGORY_NAME: "역사/문화",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2015-11-24",
    REGISTRATION_DATE: "2023-03-01",
    SERVICE_OPEN_DATE: "2023-03-10",
    TAKE_COUNT: "3000",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9788934972464",
    LANGUAGE: ["ko"],
    TAGS: ["인류사", "빅히스토리"],
    AGE_GROUP: "all",
    DESCRIPTION: "인류의 과거, 현재, 미래를 조망하는 거대한 서사",
    TOC: "1부. 인지 혁명...",
    SUMMARY: "유인원에서 사이보그까지, 인간의 모든 역사를 담았다",
    SERIES_NAME: "",
    SERIES_NUM: null,
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    PAGE_COUNT: 696,
    COPYRIGHT_INFO: "김영사 © 2015",
    SERVICE_REGION: "GLOBAL",
    PUBLISHER_REVIEW: "",
    BOOK_FILE_NAME: "sapiens.epub",
    VIDEO_URL: "",
    RECOMMENDATION_TITLE: "전 세계를 뒤흔든 최고의 지성",
    RECOMMENDATION_MESSAGE: "유발 하라리가 제시하는 인류의 미래",
    RECOMMENDATION_TEXTS: ["#사피엔스", "#유발하라리", "#인문학필독서"],
    REVIEW_COUNT: Math.floor(Math.random() * 500),
  },
].map((book) => ({
  ...book,
  BOOK_TRANSLATOR: book.BOOK_TRANSLATOR || "",
  BOOK_AUTHOR_INTRODUCTION: book.BOOK_AUTHOR_INTRODUCTION || "",
  BOOK_FILE_NAME: book.BOOK_FILE_NAME || "",
  VIDEO_URL: book.VIDEO_URL || "",
  RECOMMENDATION_TITLE: book.RECOMMENDATION_TITLE || "",
  RECOMMENDATION_MESSAGE: book.RECOMMENDATION_MESSAGE || "",
  RECOMMENDATION_TEXTS: book.RECOMMENDATION_TEXTS || [],
  SERVICE_OPEN_DATE: book.SERVICE_OPEN_DATE || null,
  DOWNLOAD_COUNT: Math.floor(Math.random() * 2000),
  LIKE_COUNT: Math.floor(Math.random() * 1000),
  REVIEW_COUNT: Math.floor(Math.random() * 500),
})); // 모든 항목에 BOOK_TRANSLATOR, BOOK_FILE_NAME, VIDEO_URL 기본값 보장

// Helper to get content type tag
const getContentTypeTag = (contentType) => {
  // Assuming '10' is ebook and '20' is audiobook based on typical patterns
  if (contentType === "10") {
    return (
      <Tag icon={<ReadOutlined />} color="blue">
        전자책
      </Tag>
    );
  } else if (contentType === "20") {
    return (
      <Tag icon={<AudioOutlined />} color="purple">
        오디오북
      </Tag>
    );
  } else {
    return <Tag>{contentType || "알 수 없음"}</Tag>;
  }
};

// Helper for region tag
const getRegionTag = (regionCode) => {
  switch (regionCode?.toUpperCase()) {
    case "KR":
      return <Tag color="red">국내</Tag>;
    case "GLOBAL":
      return <Tag color="geekblue">해외</Tag>;
    // Add more specific region logic if needed
    default:
      return <Tag>{regionCode || "-"}</Tag>;
  }
};

// 헬퍼 함수: 특정 도서 key가 포함된 큐레이션 목록 반환
const getCurationsContainingBook = (bookKey, curations) => {
  return curations.filter((curation) =>
    curation.contents?.some((content) => content.key === bookKey)
  );
};

// 큐레이션 필터 옵션 생성
const curationFilterOptions = allCurationsData.map((curation) => ({
  text: curation.title,
  value: curation.key,
}));

const BookManagement = () => {
  const [books, setBooks] = useState(initialBooks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form] = Form.useForm();
  const [bookFileList, setBookFileList] = useState([]); // 개별 도서 파일 첨부용 상태
  const [coverFileList, setCoverFileList] = useState([]); // 표지 썸네일 파일 첨부용 상태
  const [recommendationTextInput, setRecommendationTextInput] = useState("");

  const [searchText, setSearchText] = useState("");
  const [searchContentType, setSearchContentType] = useState("all");
  const [
    showOnlyMissingServiceOpenDate,
    setShowOnlyMissingServiceOpenDate,
  ] = useState(false);

  const availableKeywords = useMemo(() => {
    const activeKeywords = new Set();
    allKeywordsData.forEach((keyword) => {
        if (keyword.status === 'active') {
            activeKeywords.add(keyword.name);
            if (keyword.subKeywords) {
                keyword.subKeywords.forEach(sub => {
                    activeKeywords.add(sub.name);
                });
            }
        }
    });
    return Array.from(activeKeywords).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredData = useMemo(() => {
    const filtered = books
      .filter((book) => {
        // New filter logic
        if (showOnlyMissingServiceOpenDate) {
          return !book.SERVICE_OPEN_DATE;
        }
        return true;
      })
      .filter((book) => {
        // Content Type Filter
        if (searchContentType === "all") return true;
        return book.CONTENT_TYPE === searchContentType;
      })
      .filter((book) => {
        // Text search filter
        if (!searchText) return true;
        const query = searchText.toLowerCase();
        return (
          book.BOOK_NAME.toLowerCase().includes(query) ||
          book.BOOK_AUTHOR.toLowerCase().includes(query) ||
          (book.BOOK_PUBLISHER &&
            book.BOOK_PUBLISHER.toLowerCase().includes(query)) ||
          book.ISBN.toLowerCase().includes(query)
        );
      });

    // Default sort by registration date descending
    filtered.sort(
      (a, b) =>
        moment(b.REGISTRATION_DATE).unix() -
        moment(a.REGISTRATION_DATE).unix()
    );

    return filtered;
  }, [books, searchText, searchContentType, showOnlyMissingServiceOpenDate]);

  // 기존 시리즈명 목록 및 권수 추출 (중복 제거 및 권수 계산)
  const seriesData = useMemo(() => {
    const seriesDetails = {}; // Store details for each series name: { name: { bookIds: Set(), categoryName: string, subCategoryName: string, introduction: string }}

    // Iterate through all books, prioritizing current `books` state then `initialBooks`.
    // The first encounter of a series name will define its category/sub-category/introduction for this list.
    [...books, ...initialBooks].forEach((book) => {
      if (book.SERIES_NAME && book.SERIES_NAME.trim() !== "") {
        const seriesName = book.SERIES_NAME;
        if (!seriesDetails[seriesName]) {
          seriesDetails[seriesName] = {
            bookIds: new Set(),
            categoryName: book.CATEGORY_NAME || "", // Take from first encountered book
            subCategoryName: book.SUB_CATEGORY_NAME || "", // Take from first encountered book
            introduction: book.DESCRIPTION || "", // Take description from first encountered book in the series
          };
        }
        seriesDetails[seriesName].bookIds.add(book.BOOK_ID || book.key); // Add book for counting
      }
    });

    return Object.entries(seriesDetails)
      .map(([name, details]) => ({
        name,
        count: details.bookIds.size,
        categoryName: details.categoryName,
        subCategoryName: details.subCategoryName,
        introduction: details.introduction, // Include introduction in the final series data
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [books]);

  // --- State for Import Modal ---
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [importErrors, setImportErrors] = useState([]);
  const [isImporting, setIsImporting] = useState(false); // Import 진행 상태

  // --- Modal Handling ---
  const showAddModal = () => {
    setEditingBook(null);
    form.resetFields();
    setBookFileList([]); // 파일 목록 초기화
    setCoverFileList([]); // 표지 파일 목록 초기화
    setRecommendationTextInput("");
    setIsModalOpen(true);
  };

  const showEditModal = (book) => {
    setEditingBook(book);
    form.setFieldsValue({
      ...book,
      EBOOK_PUBLISH_DATE: book.EBOOK_PUBLISH_DATE
        ? moment(book.EBOOK_PUBLISH_DATE)
        : null,
      REGISTRATION_DATE: book.REGISTRATION_DATE
        ? moment(book.REGISTRATION_DATE)
        : null,
      SERVICE_OPEN_DATE: book.SERVICE_OPEN_DATE
        ? moment(book.SERVICE_OPEN_DATE)
        : null,
      TAGS: book.TAGS || [],
      LANGUAGE: book.LANGUAGE
        ? Array.isArray(book.LANGUAGE)
          ? book.LANGUAGE
          : [book.LANGUAGE]
        : [],
      BOOK_TRANSLATOR: book.BOOK_TRANSLATOR || "",
      BOOK_AUTHOR_INTRODUCTION: book.BOOK_AUTHOR_INTRODUCTION || "",
      PRICE:
        typeof book.PRICE === "string"
          ? parseInt(book.PRICE.replace(/,/g, ""), 10)
          : book.PRICE,
      VIDEO_URL: book.VIDEO_URL || "",
      // BOOK_COVER_IMAGE will be set by form.setFieldsValue
    });
    if (book.BOOK_FILE_NAME) {
      setBookFileList([
        {
          uid: "-1",
          name: book.BOOK_FILE_NAME,
          status: "done",
        },
      ]);
    } else {
      setBookFileList([]);
    }
    setCoverFileList([]); // 표지 파일 목록 초기화 (입력 필드는 BOOK_COVER_IMAGE로 채워짐)
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingBook(null);
    form.resetFields();
    setBookFileList([]); // 파일 목록 초기화
    setCoverFileList([]); // 표지 파일 목록 초기화
    setRecommendationTextInput("");
  };

  // --- Form Submission ---
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        let newBookFileName = "";
        if (bookFileList.length > 0 && bookFileList[0].originFileObj) {
          newBookFileName = bookFileList[0].name;
        } else if (
          editingBook &&
          editingBook.BOOK_FILE_NAME &&
          bookFileList.length > 0 &&
          bookFileList[0].name === editingBook.BOOK_FILE_NAME
        ) {
          newBookFileName = editingBook.BOOK_FILE_NAME;
        } else if (
          !editingBook &&
          bookFileList.length > 0 &&
          bookFileList[0].name
        ) {
          // 새 책 추가 시 파일이 있는 경우
          newBookFileName = bookFileList[0].name;
        } else if (editingBook && !bookFileList.length) {
          // 수정 시 파일이 제거된 경우
          newBookFileName = "";
        }

        const contentType = values.CONTENT_TYPE;
        const formattedValues = {
          ...values,
          BOOK_COVER_IMAGE: values.BOOK_COVER_IMAGE || getRandomCoverImage(),
          BOOK_TRANSLATOR: values.BOOK_TRANSLATOR || "",
          BOOK_AUTHOR_INTRODUCTION: values.BOOK_AUTHOR_INTRODUCTION || "",
          BOOK_FILE_NAME: newBookFileName,
          EBOOK_PUBLISH_DATE: values.EBOOK_PUBLISH_DATE
            ? values.EBOOK_PUBLISH_DATE.format("YYYY-MM-DD")
            : null,
          REGISTRATION_DATE: values.REGISTRATION_DATE
            ? values.REGISTRATION_DATE.format("YYYY-MM-DD")
            : null,
          SERVICE_OPEN_DATE: values.SERVICE_OPEN_DATE
            ? values.SERVICE_OPEN_DATE.format("YYYY-MM-DD")
            : null,
          PLAY_TIME:
            contentType === "20" ? values.PLAY_TIME || "00:00:00" : undefined,
          LEADER_NAME:
            contentType === "20" ? values.LEADER_NAME || "" : undefined,
          LEADER_JOB:
            contentType === "20" ? values.LEADER_JOB || "" : undefined,
          PAGE_COUNT: contentType === "10" ? values.PAGE_COUNT : undefined,
          TAGS: values.TAGS || [],
          CATEGORY_NAME: values.CATEGORY_NAME || "",
          PRICE: values.PRICE,
          SERIES_NUM: values.SERIES_NUM,
          VIDEO_URL: values.VIDEO_URL,
          RECOMMENDATION_TITLE: values.RECOMMENDATION_TITLE || "",
          RECOMMENDATION_MESSAGE: values.RECOMMENDATION_MESSAGE || "",
          RECOMMENDATION_TEXTS: values.RECOMMENDATION_TEXTS || [],
        };

        Object.keys(formattedValues).forEach((key) => {
          if (formattedValues[key] === undefined) {
            delete formattedValues[key];
          }
        });

        if (editingBook) {
          if (formattedValues.PRICE !== undefined) {
            formattedValues.PRICE =
              typeof formattedValues.PRICE === "string"
                ? parseInt(formattedValues.PRICE.replace(/,/g, ""), 10) || 0
                : formattedValues.PRICE || 0;
          }
          const updatedBooks = books.map((b) =>
            b.key === editingBook.key
              ? { ...editingBook, ...formattedValues }
              : b
          );
          setBooks(updatedBooks);
          message.success("도서 정보가 수정되었습니다.");
        } else {
          if (formattedValues.PRICE !== undefined) {
            formattedValues.PRICE =
              typeof formattedValues.PRICE === "string"
                ? parseInt(formattedValues.PRICE.replace(/,/g, ""), 10) || 0
                : formattedValues.PRICE || 0;
          }
          const newBook = {
            key: `book_${Date.now()}`,
            BOOK_ID: `new_${Date.now()}`,
            TAKE_COUNT: 0,
            DOWNLOAD_COUNT: 0,
            LIKE_COUNT: 0,
            REVIEW_COUNT: 0,
            ...formattedValues,
          };
          setBooks([...books, newBook]);
          message.success("새 도서가 추가되었습니다.");
        }
        handleCancel();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        message.error("폼 입력값을 확인해주세요.");
      });
  };

  // --- Delete Handling ---
  const handleDelete = (key) => {
    setBooks(books.filter((book) => book.key !== key));
    message.success("도서가 삭제되었습니다.");
    console.log("Deleting book key:", key);
  };

  const handleAddRecommendationText = () => {
    if (!recommendationTextInput.trim()) {
      message.warning("추천 텍스트를 입력해주세요.");
      return;
    }
    const currentTexts = form.getFieldValue("RECOMMENDATION_TEXTS") || [];
    if (currentTexts.includes(recommendationTextInput.trim())) {
      message.warning("이미 추가된 추천 텍스트입니다.");
      return;
    }
    form.setFieldsValue({
      RECOMMENDATION_TEXTS: [
        ...currentTexts,
        recommendationTextInput.trim(),
      ],
    });
    setRecommendationTextInput("");
  };

  const handleRemoveRecommendationText = (textToRemove) => {
    const currentTexts = form.getFieldValue("RECOMMENDATION_TEXTS") || [];
    form.setFieldsValue({
      RECOMMENDATION_TEXTS: currentTexts.filter(
        (text) => text !== textToRemove
      ),
    });
  };

  // --- Import Modal Handling ---
  const showImportModal = () => {
    setFileList([]);
    setPreviewData([]);
    setImportErrors([]);
    setIsImporting(false);
    setIsImportModalOpen(true);
  };

  const handleImportCancel = () => {
    setIsImportModalOpen(false);
    // Reset states if needed when cancelling during the process
    setFileList([]);
    setPreviewData([]);
    setImportErrors([]);
    setIsImporting(false);
  };

  const handleFileChange = (info) => {
    let file = info.file;
    let newFileList = [...info.fileList];

    // Limit to one file
    newFileList = newFileList.slice(-1);

    setFileList(newFileList);
    setPreviewData([]); // Reset preview on new file selection
    setImportErrors([]); // Reset errors

    if (newFileList.length > 0 && file.status !== "removed") {
      // --- !!! Placeholder for Actual Parsing Logic !!! ---
      // This is where you'd integrate 'xlsx' or 'papaparse'
      // For now, we simulate parsing based on file type (rudimentary)

      console.log("File selected:", file.name, file.type);
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        let parsedData = [];
        let errors = [];

        try {
          if (
            file.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.name.endsWith(".xlsx")
          ) {
            // --- Simulate Excel Parsing ---
            console.log("Simulating Excel parsing...");
            // Replace with actual XLSX.read(content, {type: 'binary'}) and XLSX.utils.sheet_to_json(...)
            // Example simulated data structure (MUST match expected columns)
            parsedData = [
              {
                BOOK_NAME: "엑셀책 1",
                BOOK_AUTHOR: "작가A",
                ISBN: "9790000000011",
                PRICE: 15000,
                CONTENT_TYPE: "10",
                CATEGORY_NAME: "소설",
              },
              {
                BOOK_NAME: "엑셀책 2",
                BOOK_AUTHOR: "작가B",
                ISBN: "9790000000012",
                PRICE: 20000,
                CONTENT_TYPE: "20",
                CATEGORY_NAME: "경영",
              },
              {
                BOOK_NAME: "오류데이터",
                BOOK_AUTHOR: "작가C",
                ISBN: null,
                PRICE: "가격오류",
                CONTENT_TYPE: "10",
                CATEGORY_NAME: "인문",
              }, // Example error row
            ];
            message.info("엑셀 파일 미리보기 생성됨 (시뮬레이션)");
          } else if (
            file.type === "text/plain" ||
            file.name.endsWith(".txt") ||
            file.type === "text/csv" ||
            file.name.endsWith(".csv")
          ) {
            // --- Simulate TXT/CSV Parsing (assuming tab-separated) ---
            console.log("Simulating TXT/CSV parsing...");
            // Replace with actual Papa.parse(content, { header: true, skipEmptyLines: true })
            const lines = content
              .split("\n")
              .filter((line) => line.trim() !== "");
            if (lines.length > 1) {
              const headers = lines[0].split("\t").map((h) => h.trim()); // Assume tab-separated, use headers
              parsedData = lines.slice(1).map((line) => {
                const values = line.split("\t").map((v) => v.trim());
                let rowData = {};
                headers.forEach((header, index) => {
                  rowData[header] = values[index] || null; // Handle empty values
                });
                // Attempt basic type conversion (example for PRICE)
                if (rowData.PRICE) {
                  const priceNum = parseInt(
                    String(rowData.PRICE).replace(/,/g, "")
                  );
                  rowData.PRICE = isNaN(priceNum) ? rowData.PRICE : priceNum; // Keep original if conversion fails
                }
                if (rowData.CONTENT_TYPE)
                  rowData.CONTENT_TYPE = String(rowData.CONTENT_TYPE); // Ensure string

                return rowData;
              });
              message.info("TXT/CSV 파일 미리보기 생성됨 (시뮬레이션)");
            } else {
              errors.push("파일 형식이 올바르지 않거나 데이터가 없습니다.");
            }
          } else {
            errors.push(
              `지원하지 않는 파일 형식입니다: ${file.type || "알 수 없음"}`
            );
          }

          // --- Basic Validation (Example) ---
          const validatedData = [];
          parsedData.forEach((row, index) => {
            if (
              !row.BOOK_NAME ||
              !row.BOOK_AUTHOR ||
              !row.ISBN ||
              !row.CATEGORY_NAME ||
              !row.CONTENT_TYPE
            ) {
              errors.push(
                `[${
                  index + 1
                }행] 필수 필드 누락: 도서명, 저자, ISBN, 카테고리, 콘텐츠 타입`
              );
            } else if (
              row.PRICE !== undefined &&
              typeof row.PRICE !== "number"
            ) {
              errors.push(
                `[${index + 1}행] 가격(${row.PRICE})은 숫자여야 합니다.`
              );
            } else {
              validatedData.push(row);
            }
          });

          setPreviewData(validatedData); // Show only potentially valid data in preview
          setImportErrors(errors); // Show all errors found
        } catch (error) {
          console.error("Parsing failed:", error);
          setImportErrors([`파일 처리 중 오류 발생: ${error.message}`]);
          setPreviewData([]);
        }
      };

      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx")
      ) {
        reader.readAsArrayBuffer(file.originFileObj || file); // Use originFileObj for ArrayBuffer
      } else if (
        file.type === "text/plain" ||
        file.name.endsWith(".txt") ||
        file.type === "text/csv" ||
        file.name.endsWith(".csv")
      ) {
        reader.readAsText(file.originFileObj || file); // Use originFileObj for text reading
      } else {
        message.error(
          `지원하지 않는 파일 형식입니다: ${file.type || "알 수 없음"}`
        );
        setFileList([]); // Clear file list if unsupported
        setImportErrors([`지원하지 않는 파일 형식입니다.`]);
      }
    } else if (file.status === "removed") {
      // Handle file removal if needed
      setFileList([]);
      setPreviewData([]);
      setImportErrors([]);
    }
  };

  const handleImport = () => {
    if (previewData.length === 0) {
      message.error(
        "Import할 데이터가 없습니다. 파일을 업로드하고 내용을 확인해주세요."
      );
      return;
    }
    if (
      importErrors.some(
        (err) => err.includes("필수 필드 누락") || err.includes("가격")
      )
    ) {
      // Only block on critical errors
      message.error(
        "데이터 오류를 수정 후 다시 시도해주세요. 오류 목록을 확인하세요."
      );
      return;
    }

    setIsImporting(true);
    setImportErrors([]); // Clear previous non-blocking errors before import

    // --- Simulate Import Process ---
    console.log("Starting import process...");
    // In a real app, you might send 'previewData' to a backend API

    const newBooks = previewData.map((bookData, index) => ({
      ...bookData, // Spread the parsed data
      key: `imported_${Date.now()}_${index}`, // Generate a unique key
      BOOK_ID: `imported_id_${Date.now()}_${index}`, // Generate a unique ID (should be better)
      // Apply default values or transformations if needed
      TAKE_COUNT: parseInt(bookData.TAKE_COUNT, 10) || 0,
      DOWNLOAD_COUNT: parseInt(bookData.DOWNLOAD_COUNT, 10) || 0,
      LIKE_COUNT: parseInt(bookData.LIKE_COUNT, 10) || 0,
      REVIEW_COUNT: parseInt(bookData.REVIEW_COUNT, 10) || 0,
      BOOK_SERVICE_YN: bookData.BOOK_SERVICE_YN || "N",
      BOOK_EBOOK_RENT_YN: bookData.BOOK_EBOOK_RENT_YN || "N",
      DRM_YN: bookData.DRM_YN || "N",
      BOOK_ADULT_YN: bookData.BOOK_ADULT_YN || "N",
      IS_EXCLUSIVE: bookData.IS_EXCLUSIVE || "N",
      SERVICE_REGION: bookData.SERVICE_REGION || "KR",
      REGISTRATION_DATE: moment().format("YYYY-MM-DD"), // Set registration date to now
      // Ensure numeric types
      PRICE:
        typeof bookData.PRICE === "string"
          ? parseInt(bookData.PRICE.replace(/,/g, ""), 10) || 0
          : bookData.PRICE || 0,
      PAGE_COUNT: bookData.PAGE_COUNT
        ? parseInt(bookData.PAGE_COUNT, 10)
        : null,
      SERIES_NUM: bookData.SERIES_NUM
        ? parseInt(bookData.SERIES_NUM, 10)
        : null,
      // Ensure arrays/strings
      TAGS: bookData.TAGS
        ? Array.isArray(bookData.TAGS)
          ? bookData.TAGS
          : String(bookData.TAGS)
              .split(",")
              .map((t) => t.trim())
        : [],
      EBOOK_PUBLISH_DATE: bookData.EBOOK_PUBLISH_DATE
        ? moment(bookData.EBOOK_PUBLISH_DATE).format("YYYY-MM-DD")
        : null, // Format date
      SERVICE_OPEN_DATE: bookData.SERVICE_OPEN_DATE
        ? moment(bookData.SERVICE_OPEN_DATE).format("YYYY-MM-DD")
        : null,
      // Ensure other fields are strings or null/undefined
      BOOK_PUBLISHER: bookData.BOOK_PUBLISHER || "",
      SUB_CATEGORY_NAME: bookData.SUB_CATEGORY_NAME || "",
      PLAY_TIME:
        bookData.CONTENT_TYPE === "20"
          ? bookData.PLAY_TIME || "00:00:00"
          : undefined,
      LEADER_NAME:
        bookData.CONTENT_TYPE === "20" ? bookData.LEADER_NAME || "" : undefined,
      LEADER_JOB:
        bookData.CONTENT_TYPE === "20" ? bookData.LEADER_JOB || "" : undefined,
      LANGUAGE: bookData.LANGUAGE || "ko",
      DESCRIPTION: bookData.DESCRIPTION || "",
      TOC: bookData.TOC || "",
      SUMMARY: bookData.SUMMARY || "",
      SERIES_NAME: bookData.SERIES_NAME || "",
      FILE_FORMAT: bookData.FILE_FORMAT || "",
      COPYRIGHT_INFO: bookData.COPYRIGHT_INFO || "",
      AGE_GROUP: bookData.AGE_GROUP || "all",
      // Fields likely not in basic import
      // BOOK_COVER_IMAGE: bookData.BOOK_COVER_IMAGE || undefined,
      // TAKE_COUNT: bookData.TAKE_COUNT || undefined,
      // CATEGORY_SEQ: bookData.CATEGORY_SEQ || undefined, // Might need lookup based on CATEGORY_NAME
    }));

    // Simulate API call delay
    setTimeout(() => {
      setBooks((prevBooks) => [...prevBooks, ...newBooks]);
      message.success(
        `${newBooks.length}개의 도서가 성공적으로 등록되었습니다.`
      );
      setIsImporting(false);
      setIsImportModalOpen(false);
      setFileList([]);
      setPreviewData([]);
      setImportErrors([]);
    }, 1500); // Simulate network latency
  };

  // --- Updated Table Columns Definition (existing columns remain same) ---
  const columns = [
    {
      title: "표지",
      dataIndex: "BOOK_COVER_IMAGE",
      key: "cover",
      width: 60,
      render: (url) => (
        <Image
          src={url || "https://via.placeholder.com/40x60.png?text=N/A"}
          alt="Cover"
          width={30}
          preview={false}
          fallback="https://via.placeholder.com/40x60.png?text=Err"
        />
      ),
    },
    {
      title: "ID",
      dataIndex: "BOOK_ID",
      key: "bookId",
      width: 150,
      ellipsis: true,
    },
    {
      title: "카테고리",
      dataIndex: "CATEGORY_NAME",
      key: "categoryName",
      width: 100,
      ellipsis: true,
    },
    {
      title: "하위 카테고리",
      dataIndex: "SUB_CATEGORY_NAME",
      key: "subCategoryName",
      width: 120,
      ellipsis: true,
      render: (text) => (
        <Text style={{ maxWidth: 100 }} ellipsis={{ tooltip: text }}>
          {text || "-"}
        </Text>
      ),
    },
    {
      title: "콘텐츠",
      dataIndex: "CONTENT_TYPE",
      key: "contentType",
      align: "center",
      width: 100,
      render: getContentTypeTag,
      filters: [
        { text: "전자책", value: "10" },
        { text: "오디오북", value: "20" },
      ],
      onFilter: (value, record) => record.CONTENT_TYPE === value,
    },
    {
      title: "도서명",
      dataIndex: "BOOK_NAME",
      key: "title",
      width: 200,
      sorter: (a, b) => a.BOOK_NAME.localeCompare(b.BOOK_NAME),
      render: (text) => (
        <Text style={{ maxWidth: 180 }} ellipsis={{ tooltip: text }}>
          {text}
        </Text>
      ),
    },
    {
      title: "저자",
      dataIndex: "BOOK_AUTHOR",
      key: "author",
      width: 120,
      ellipsis: true,
    },
    {
      title: "출판사",
      dataIndex: "BOOK_PUBLISHER",
      key: "publisher",
      width: 120,
      ellipsis: true,
    },
    {
      title: "ISBN",
      dataIndex: "ISBN",
      key: "isbn",
      width: 130,
      ellipsis: true,
    },
    {
      title: "서비스",
      dataIndex: "BOOK_SERVICE_YN",
      key: "service",
      align: "center",
      width: 80,
      render: (yn) => (
        <Tag
          color={yn === "Y" ? "success" : "default"}
          icon={yn === "Y" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {yn === "Y" ? "Y" : "N"}
        </Tag>
      ),
      filters: [
        { text: "Y", value: "Y" },
        { text: "N", value: "N" },
      ],
      onFilter: (value, record) => record.BOOK_SERVICE_YN === value,
    },
    {
      title: "DRM",
      dataIndex: "DRM_YN",
      key: "drm",
      align: "center",
      width: 70,
      render: (yn) => (
        <Tag
          color={yn === "Y" ? "orange" : "default"}
          icon={yn === "Y" ? <SafetyOutlined /> : null}
        >
          {yn === "Y" ? "Y" : "N"}
        </Tag>
      ),
      filters: [
        { text: "Y", value: "Y" },
        { text: "N", value: "N" },
      ],
      onFilter: (value, record) => record.DRM_YN === value,
    },
    {
      title: "권역",
      dataIndex: "SERVICE_REGION",
      key: "region",
      align: "center",
      width: 70,
      render: getRegionTag,
      filters: [
        { text: "국내", value: "KR" },
        { text: "해외", value: "GLOBAL" },
      ],
      onFilter: (value, record) => record.SERVICE_REGION === value,
    },
    {
      title: "등록일",
      dataIndex: "REGISTRATION_DATE",
      key: "registrationDate",
      align: "center",
      width: 110,
      sorter: (a, b) => {
        if (!a.REGISTRATION_DATE && !b.REGISTRATION_DATE) return 0;
        if (!a.REGISTRATION_DATE) return 1;
        if (!b.REGISTRATION_DATE) return -1;
        return (
          moment(a.REGISTRATION_DATE).unix() -
          moment(b.REGISTRATION_DATE).unix()
        );
      },
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "서비스 오픈일",
      dataIndex: "SERVICE_OPEN_DATE",
      key: "serviceOpenDate",
      align: "center",
      width: 120,
      sorter: (a, b) => {
        if (!a.SERVICE_OPEN_DATE && !b.SERVICE_OPEN_DATE) return 0;
        if (!a.SERVICE_OPEN_DATE) return 1;
        if (!b.SERVICE_OPEN_DATE) return -1;
        return (
          moment(a.SERVICE_OPEN_DATE).unix() -
          moment(b.SERVICE_OPEN_DATE).unix()
        );
      },
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "관리",
      key: "action",
      fixed: "right",
      width: 100,
      align: "center",
      render: (_, record) => {
        const menu = (
          <Menu
            items={[
              {
                key: "1",
                label: "수정",
                icon: <EditOutlined />,
                onClick: () => showEditModal(record),
              },
              {
                key: "2",
                label: (
                  <Popconfirm
                    title={`'${record.BOOK_NAME}' 도서를 삭제하시겠습니까?`}
                    description="삭제 작업은 되돌릴 수 없습니다."
                    onConfirm={() => handleDelete(record.key)}
                    okText="삭제"
                    cancelText="취소"
                  >
                    삭제
                  </Popconfirm>
                ),
                icon: <DeleteOutlined />,
                danger: true,
              },
            ]}
          />
        );

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<EllipsisOutlined />} size="small" />
          </Dropdown>
        );
      },
    },
  ];

  // --- Columns for Preview Table ---
  const previewColumns = [
    {
      title: "도서명",
      dataIndex: "BOOK_NAME",
      key: "BOOK_NAME",
      width: 150,
      ellipsis: true,
    },
    {
      title: "저자",
      dataIndex: "BOOK_AUTHOR",
      key: "BOOK_AUTHOR",
      width: 100,
      ellipsis: true,
    },
    {
      title: "ISBN",
      dataIndex: "ISBN",
      key: "ISBN",
      width: 120,
      ellipsis: true,
    },
    {
      title: "카테고리",
      dataIndex: "CATEGORY_NAME",
      key: "CATEGORY_NAME",
      width: 100,
      ellipsis: true,
    },
    {
      title: "하위 카테고리",
      dataIndex: "SUB_CATEGORY_NAME",
      key: "SUB_CATEGORY_NAME",
      width: 100,
      ellipsis: true,
    },
    {
      title: "타입",
      dataIndex: "CONTENT_TYPE",
      key: "CONTENT_TYPE",
      width: 80,
      render: (val) =>
        val === "10" ? "전자책" : val === "20" ? "오디오북" : "알수없음",
    },
    {
      title: "가격",
      dataIndex: "PRICE",
      key: "PRICE",
      width: 80,
      align: "right",
      render: (val) => (typeof val === "number" ? val.toLocaleString() : val),
    },
    // Add more columns as needed for preview
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Title level={2}>
        <BookOutlined /> 도서 관리
      </Title>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <Search
          placeholder="도서명, 저자, 출판사, ISBN 검색..."
          onSearch={setSearchText}
          allowClear
          addonBefore={
            <Select
              value={searchContentType}
              onChange={(value) => setSearchContentType(value)}
              style={{ width: 100 }}
            >
              <Option value="all">전체</Option>
              <Option value="10">전자책</Option>
              <Option value="20">오디오북</Option>
            </Select>
          }
          style={{ minWidth: "300px", flex: 1, maxWidth: "600px" }}
        />
        <Space>
          <Space>
            <Text>오픈일 미지정</Text>
            <Switch
              checked={showOnlyMissingServiceOpenDate}
              onChange={setShowOnlyMissingServiceOpenDate}
            />
          </Space>
          {/* Import Button */}
          <Button icon={<UploadOutlined />} onClick={showImportModal}>
            대량 등록
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            새 도서 추가
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        scroll={{ x: 1500 }} // Adjust scroll width based on columns
        bordered
        size="small"
        rowKey="key"
      />

      {/* Add/Edit Modal (Existing) */}
      <Modal
        title={editingBook ? "도서 정보 수정" : "새 도서 추가"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingBook ? "수정" : "추가"}
        cancelText="취소"
        destroyOnClose
        width={800}
        bodyStyle={{ maxHeight: "calc(100vh - 210px)", overflowY: "auto" }}
      >
        <Form form={form} layout="vertical" name="book_form">
          <Divider orientation="left">기본 정보</Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="BOOK_NAME"
                label="도서명"
                rules={[{ required: true, message: "도서명을 입력해주세요." }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ISBN"
                label="ISBN"
                rules={[{ required: true, message: "ISBN을 입력해주세요." }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="BOOK_AUTHOR"
                label="저자"
                rules={[{ required: true, message: "저자를 입력해주세요." }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="BOOK_TRANSLATOR" label="번역자">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="BOOK_AUTHOR_INTRODUCTION" label="저자 소개">
                <TextArea rows={3} placeholder="저자에 대한 소개글을 입력해주세요." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="BOOK_PUBLISHER" label="출판사">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="CONTENT_TYPE"
                label="콘텐츠 타입"
                rules={[
                  { required: true, message: "콘텐츠 타입을 선택해주세요." },
                ]}
              >
                <Select placeholder="타입 선택">
                  <Option value="10">전자책</Option>
                  <Option value="20">오디오북</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="EBOOK_PUBLISH_DATE" label="출간일">
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="REGISTRATION_DATE" label="등록일">
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="LANGUAGE" label="언어">
                <Select
                  mode="multiple"
                  placeholder="언어 선택 (다중 선택 가능)"
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Option value="ko">한국어</Option>
                  <Option value="en">영어</Option>
                  <Option value="ja">일본어</Option>
                  <Option value="zh">중국어</Option>
                  <Option value="es">스페인어</Option>
                  <Option value="fr">프랑스어</Option>
                  <Option value="de">독일어</Option>
                  {/* 필요에 따라 다른 언어 옵션 추가 */}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="표지 썸네일">
                <Space.Compact block style={{ width: "100%" }}>
                  <Form.Item name="BOOK_COVER_IMAGE" noStyle>
                    <Input
                      style={{ flex: 1 }}
                      readOnly
                      value={coverFileList[0]?.name || ""} // Display selected file name
                      placeholder="선택된 파일 없음"
                      // onInput handler removed as it's readOnly and file-driven
                    />
                  </Form.Item>
                  <Upload
                    fileList={coverFileList}
                    beforeUpload={() => false}
                    onChange={({ fileList: newFileList }) => {
                      const latestFile = newFileList.slice(-1);
                      setCoverFileList(latestFile);
                      if (
                        latestFile.length > 0 &&
                        latestFile[0].originFileObj
                      ) {
                        form.setFieldsValue({
                          BOOK_COVER_IMAGE: latestFile[0].name,
                        });
                      } else if (latestFile.length === 0) {
                        // If file is removed, clear the form field
                        form.setFieldsValue({ BOOK_COVER_IMAGE: "" });
                      }
                    }}
                    showUploadList={false}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>파일 선택</Button>{" "}
                    {/* Changed button text */}
                  </Upload>
                  {coverFileList.length > 0 && (
                    <Button
                      icon={<CloseOutlined />}
                      onClick={() => {
                        setCoverFileList([]);
                        form.setFieldsValue({ BOOK_COVER_IMAGE: "" }); // Clear form field
                      }}
                      danger
                    />
                  )}
                </Space.Compact>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">상세 정보</Divider>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="SERIES_NAME"
                label={
                  <span>
                    시리즈명&nbsp;
                    <Tooltip title='시리즈를 추가하고 저장할 경우 신규시리즈 알림이 자동으로 발송됩니다. 발송될 알림내용은 관리자 페이지 "알림 관리 > 알림 템플릿 관리"에서 확인해주세요.'>
                      <InfoCircleOutlined />
                    </Tooltip>
                  </span>
                }
                rules={[
                  {
                    validator: (_, value) => {
                      if (value && value.trim() === "") {
                        return Promise.reject(
                          new Error(
                            "시리즈명은 공백만으로 이루어질 수 없습니다."
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="시리즈 선택"
                  allowClear
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={seriesData.map((series) => ({
                    value: series.name,
                    label: `${series.name} (${series.count}권)`,
                    categoryName: series.categoryName,
                    subCategoryName: series.subCategoryName,
                  }))}
                  onSelect={(value, option) => {
                    if (option) {
                      const fieldsToUpdate = {};
                      if (option.categoryName !== undefined) {
                        fieldsToUpdate.CATEGORY_NAME = option.categoryName;
                      }
                      if (option.subCategoryName !== undefined) {
                        fieldsToUpdate.SUB_CATEGORY_NAME =
                          option.subCategoryName;
                      } else if (option.categoryName !== undefined) {
                        fieldsToUpdate.SUB_CATEGORY_NAME = undefined;
                      }
                      fieldsToUpdate.DESCRIPTION = `[${option.value}] 시리즈의 간략한 소개입니다. 내용을 직접 수정해주세요.`;
                      form.setFieldsValue(fieldsToUpdate);
                    }
                  }}
                  onChange={(value) => {
                    if (!value) {
                      const fieldsToClear = {
                        CATEGORY_NAME: undefined,
                        SUB_CATEGORY_NAME: undefined,
                      };
                      if (editingBook) {
                        fieldsToClear.DESCRIPTION = editingBook.DESCRIPTION || "";
                      } else {
                        fieldsToClear.DESCRIPTION = "";
                      }
                      form.setFieldsValue(fieldsToClear);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.SERIES_NAME !== currentValues.SERIES_NAME
                }
              >
                {({ getFieldValue }) => {
                  const currentSeriesName = getFieldValue("SERIES_NAME");
                  let isCategoryDisabledBySeries = false;
                  if (currentSeriesName) {
                    const seriesInfo = seriesData.find(
                      (s) => s.name === currentSeriesName
                    );
                    // Disable if series is found AND it has a category defined
                    if (seriesInfo && seriesInfo.categoryName) {
                      isCategoryDisabledBySeries = true;
                    }
                  }
                  return (
                    <Form.Item
                      name="CATEGORY_NAME"
                      label="카테고리"
                      rules={[
                        { required: true, message: "카테고리를 선택해주세요." },
                      ]}
                    >
                      <Select
                        placeholder="카테고리 선택"
                        disabled={isCategoryDisabledBySeries} // Disable based on series selection
                        onChange={(newCategoryValue) => {
                          const currentSubCategoryValue =
                            form.getFieldValue("SUB_CATEGORY_NAME");
                          const subCategoriesForNewCategory =
                            subCategoryMap[newCategoryValue] || [];
                          if (newCategoryValue) {
                            if (
                              currentSubCategoryValue &&
                              !subCategoriesForNewCategory.includes(
                                currentSubCategoryValue
                              )
                            ) {
                              form.setFieldsValue({
                                SUB_CATEGORY_NAME: undefined,
                              });
                            }
                          } else {
                            form.setFieldsValue({
                              SUB_CATEGORY_NAME: undefined,
                            });
                          }
                        }}
                      >
                        <Option value="소설">소설</Option>
                        <Option value="시/에세이">시/에세이</Option>
                        <Option value="인문">인문</Option>
                        <Option value="사회과학">사회과학</Option>
                        <Option value="경영/경제">경영/경제</Option>
                        <Option value="자기계발">자기계발</Option>
                        <Option value="IT/컴퓨터">IT/컴퓨터</Option>
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={
                  (prevValues, currentValues) =>
                    prevValues.CATEGORY_NAME !== currentValues.CATEGORY_NAME ||
                    prevValues.SERIES_NAME !== currentValues.SERIES_NAME // Also re-render if SERIES_NAME changes
                }
              >
                {({ getFieldValue }) => {
                  const categoryName = getFieldValue("CATEGORY_NAME");
                  const subCategories = subCategoryMap[categoryName] || [];

                  const currentSeriesName = getFieldValue("SERIES_NAME");
                  let isSubCategoryDisabledBySeries = false;
                  if (currentSeriesName) {
                    const seriesInfo = seriesData.find(
                      (s) => s.name === currentSeriesName
                    );
                    if (seriesInfo && seriesInfo.categoryName) {
                      // If series drives category, it also drives sub-category lock
                      isSubCategoryDisabledBySeries = true;
                    }
                  }

                  return (
                    <Form.Item
                      name="SUB_CATEGORY_NAME"
                      label="하위 카테고리"
                      rules={[
                        {
                          required: true,
                          message: "하위 카테고리를 선택해주세요.",
                        },
                      ]}
                    >
                      <Select
                        placeholder="하위 카테고리 선택"
                        allowClear
                        disabled={
                          !categoryName || isSubCategoryDisabledBySeries
                        }
                      >
                        {subCategories.map((subCategory) => (
                          <Option key={subCategory} value={subCategory}>
                            {subCategory}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  );
                }}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.CONTENT_TYPE !== currentValues.CONTENT_TYPE
                }
              >
                {({ getFieldValue }) =>
                  getFieldValue("CONTENT_TYPE") === "10" ? (
                    <Form.Item name="PAGE_COUNT" label="페이지 수">
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="TAGS" label="키워드">
                <Select
                  mode="tags"
                  placeholder="키워드 선택 또는 입력 후 Enter"
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
                  options={availableKeywords.map(kw => ({ label: kw, value: kw }))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="DESCRIPTION" label="책 소개">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="PUBLISHER_REVIEW" label="출판사 서평">
                <TextArea
                  rows={3}
                  placeholder="출판사에서 제공하는 서평을 입력해주세요."
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="TOC" label="목차">
                <TextArea rows={3} placeholder="1장...\n2장..." />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="SUMMARY" label="본문 요약(도입부)">
                <TextArea rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">추천 정보</Divider>
          <Row gutter={[16, 16]}>
            <Col span={24}>
                <Form.Item name="RECOMMENDATION_TITLE" label="추천 제목">
                    <Input placeholder="도서 추천 시 사용될 제목" />
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item name="RECOMMENDATION_MESSAGE" label="추천 메시지">
                    <TextArea rows={3} placeholder="도서 추천 시 함께 표시될 메시지" />
                </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="추천 텍스트" tooltip="추천 문구를 입력하고 '추가' 버튼을 클릭하세요.">
                <Space.Compact style={{ width: "100%" }}>
                  <Input
                    value={recommendationTextInput}
                    onChange={(e) =>
                      setRecommendationTextInput(e.target.value)
                    }
                    onPressEnter={(e) => {
                      e.preventDefault();
                      handleAddRecommendationText();
                    }}
                    placeholder="추천 문장을 입력하세요"
                  />
                  <Button type="primary" onClick={handleAddRecommendationText}>
                    추가
                  </Button>
                </Space.Compact>
                <Form.Item name="RECOMMENDATION_TEXTS" noStyle>
                  <div style={{ marginTop: "8px" }}>
                    {form
                      .getFieldValue("RECOMMENDATION_TEXTS")
                      ?.map((text, index) => (
                        <Tag
                          key={index}
                          closable
                          onClose={() => handleRemoveRecommendationText(text)}
                          style={{
                            whiteSpace: "normal",
                            height: "auto",
                            display: "inline-block",
                            lineHeight: "20px",
                            padding: "4px 8px",
                            margin: "4px 4px 0 0",
                            fontSize: "14px",
                          }}
                        >
                          {text}
                        </Tag>
                      ))}
                  </div>
                </Form.Item>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.CONTENT_TYPE !== currentValues.CONTENT_TYPE
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("CONTENT_TYPE") === "20" ? (
                <>
                  <Divider orientation="left">오디오북 정보</Divider>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Form.Item name="LEADER_NAME" label="낭독자 이름">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="LEADER_JOB" label="낭독자 직업">
                        <Input placeholder="(예: 성우)" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="PLAY_TIME" label="재생 시간 (HH:MM:SS)">
                        <Input placeholder="00:00:00" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              ) : null
            }
          </Form.Item>

          <Divider orientation="left">파일 및 서비스 정보</Divider>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item label="도서 파일">
                <Space.Compact block style={{ width: "100%" }}>
                  <Input
                    style={{ flex: 1 }}
                    readOnly
                    value={bookFileList[0]?.name || ""}
                    placeholder="선택된 파일 없음"
                  />
                  <Upload
                    fileList={bookFileList}
                    beforeUpload={() => false}
                    onChange={({ fileList: newFileList }) => {
                      setBookFileList(newFileList.slice(-1));
                    }}
                    showUploadList={false}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>파일 선택</Button>
                  </Upload>
                  {bookFileList.length > 0 && (
                    <Button
                      icon={<CloseOutlined />}
                      onClick={() => setBookFileList([])}
                      danger
                    />
                  )}
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="COPYRIGHT_INFO" label="저작권 정보">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="DRM_YN" label="DRM 적용" initialValue="Y">
                <Select style={{ width: "100%" }}>
                  <Option value="Y">적용</Option>
                  <Option value="N">미적용</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="BOOK_ADULT_YN"
                label="연령 제한"
                initialValue="N"
              >
                <Select style={{ width: "100%" }}>
                  <Option value="N">전체 이용가</Option>
                  <Option value="Y">성인</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="IS_EXCLUSIVE"
                label="독점 콘텐츠"
                initialValue="N"
              >
                <Select style={{ width: "100%" }}>
                  <Option value="Y">독점</Option>
                  <Option value="N">일반</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="SERVICE_REGION"
                label="제공 권역"
                initialValue="KR"
              >
                <Select style={{ width: "100%" }}>
                  <Option value="KR">국내</Option>
                  <Option value="GLOBAL">해외</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="SERVICE_OPEN_DATE" label="서비스 오픈일">
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Form.Item
            name="BOOK_SERVICE_YN"
            label="서비스 상태"
            valuePropName="checked"
            initialValue={true} // 'Y'를 true로 가정
            getValueFromEvent={(e) => (e ? "Y" : "N")} // Switch 값(true/false)을 'Y'/'N'으로 변환
            normalize={(value) => value === "Y"} // 폼 데이터 로드 시 'Y'를 true로 변환
          >
            <Switch checkedChildren="서비스중" unCheckedChildren="중지" />
          </Form.Item>

        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal
        title="도서 대량 등록 (Excel/TXT)"
        open={isImportModalOpen}
        onCancel={handleImportCancel}
        footer={[
          <Button key="back" onClick={handleImportCancel}>
            취소
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isImporting}
            onClick={handleImport}
            disabled={
              previewData.length === 0 ||
              fileList.length === 0 ||
              isImporting ||
              importErrors.some(
                (err) => err.includes("필수 필드 누락") || err.includes("가격")
              )
            }
          >
            {isImporting ? "등록 중..." : `${previewData.length}개 도서 등록`}
          </Button>,
        ]}
        width={1000}
        destroyOnClose
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Alert
            message="파일 형식 안내"
            description={
              <div>
                <p>
                  Excel (.xlsx) 또는 텍스트 (.txt, .csv - 탭으로 구분) 파일을
                  업로드해주세요.
                </p>
                <p>
                  첫 번째 행은 헤더(컬럼명)여야 합니다. 필수 컬럼:{" "}
                  <strong>
                    BOOK_NAME, BOOK_AUTHOR, ISBN, CATEGORY_NAME, CONTENT_TYPE
                  </strong>
                </p>
                <p>
                  선택 컬럼 예시: BOOK_PUBLISHER, SUB_CATEGORY_NAME, PRICE,
                  EBOOK_PUBLISH_DATE (YYYY-MM-DD), SERVICE_OPEN_DATE
                  (YYYY-MM-DD), TAGS (쉼표로 구분), DESCRIPTION 등
                </p>
              </div>
            }
            type="info"
            showIcon
          />

          <Upload.Dragger
            name="file"
            accept=".xlsx, .txt, .csv"
            multiple={false}
            fileList={fileList}
            beforeUpload={() => false}
            onChange={handleFileChange}
            onRemove={() => {
              setFileList([]);
              setPreviewData([]);
              setImportErrors([]);
            }}
          >
            <p className="ant-upload-drag-icon">
              <FileExcelOutlined
                style={{ color: "#1890ff", marginRight: "8px" }}
              />
              <FileTextOutlined style={{ color: "#faad14" }} />
            </p>
            <p className="ant-upload-text">
              클릭하거나 파일을 이곳으로 드래그하여 업로드하세요.
            </p>
            <p className="ant-upload-hint">
              Excel (.xlsx) 또는 텍스트 (.txt, .csv) 파일 1개만 가능합니다.
            </p>
          </Upload.Dragger>

          {importErrors.length > 0 && (
            <Alert
              message="데이터 검증 오류"
              description={
                <ul
                  style={{
                    paddingLeft: 20,
                    maxHeight: "150px",
                    overflowY: "auto",
                  }}
                >
                  {importErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              }
              type="error"
              showIcon
              closable
              onClose={() => setImportErrors([])}
            />
          )}

          {previewData.length > 0 && (
            <div>
              <Title level={5}>
                미리보기 (상위 {previewData.length}개 데이터)
              </Title>
              <Table
                columns={previewColumns}
                dataSource={previewData}
                pagination={false}
                size="small"
                bordered
                scroll={{ y: 240 }}
                rowKey={(record, index) => `preview_${index}`}
              />
            </div>
          )}
        </Space>
      </Modal>
    </Space>
  );
};

export default BookManagement;
