import React, { useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Typography,
  Tag,
  message,
  Image,
  Tooltip,
  DatePicker,
  Popconfirm,
  InputNumber,
  Upload,
  Row,
  Col,
  Alert,
  Divider,
  AutoComplete,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  AudioOutlined,
  ReadOutlined,
  UploadOutlined,
  CloseOutlined,
  GlobalOutlined,
  SafetyOutlined,
  FileExcelOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import moment from "moment";
// CurationManagement에서 큐레이션 데이터를 가져옵니다 (데모용)
import { initialCurations as allCurationsData } from "./CurationManagement";

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
    TAKE_COUNT: "73",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791138434195",
    LANGUAGE: ["ko"],
    TAGS: ["과학", "사회", "토론"],
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
  },
  {
    key: "2",
    BOOK_ID: "anotherBook123",
    BOOK_NAME: "React 마스터하기",
    BOOK_AUTHOR: "김개발",
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
    TAKE_COUNT: "150",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "Y",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791162240101",
    LANGUAGE: ["ko", "en"],
    TAGS: ["React", "웹개발"],
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
  },
  {
    key: "3",
    BOOK_ID: "someOtherId456",
    BOOK_NAME: "Node.js 실전 가이드",
    BOOK_AUTHOR: "박코딩",
    BOOK_TRANSLATOR: "이코딩",
    BOOK_PUBLISHER: "코딩북스",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_SEQ: "501",
    CATEGORY_NAME: "IT/컴퓨터",
    BOOK_SERVICE_YN: "N",
    BOOK_EBOOK_RENT_YN: "N",
    EBOOK_PUBLISH_DATE: "2023-05-20",
    REGISTRATION_DATE: "2023-05-15",
    TAKE_COUNT: "88",
    BOOK_ADULT_YN: "Y",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    PLAY_TIME: "00:00:00",
    LEADER_NAME: "",
    LEADER_JOB: "",
    ISBN: "9791162240231",
    LANGUAGE: ["ko"],
    TAGS: ["Nodejs", "백엔드"],
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
  },
  {
    key: "4",
    BOOK_ID: "audiobook789",
    BOOK_NAME: "불편한 편의점 (오디오북)",
    BOOK_AUTHOR: "김호연",
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
    TAKE_COUNT: "250",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "20",
    PLAY_TIME: "08:35:20",
    LEADER_NAME: "김유정",
    LEADER_JOB: "성우",
    ISBN: "9791161571188",
    LANGUAGE: ["ko"],
    TAGS: ["힐링", "편의점", "드라마"],
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
  },
  // 나머지 initialBooks 데이터에도 BOOK_TRANSLATOR: '' (또는 실제값) 추가 필요
  {
    key: "5",
    BOOK_ID: "ebook5",
    BOOK_NAME: "데이터 분석 입문",
    BOOK_AUTHOR: "이나영",
    BOOK_TRANSLATOR: "",
    BOOK_PUBLISHER: "데이터사이언스",
    BOOK_COVER_IMAGE: getRandomCoverImage(),
    CATEGORY_NAME: "IT/컴퓨터",
    SUB_CATEGORY_NAME: "데이터 분석",
    BOOK_SERVICE_YN: "Y",
    BOOK_EBOOK_RENT_YN: "Y",
    EBOOK_PUBLISH_DATE: "2024-01-20",
    REGISTRATION_DATE: "2024-01-15",
    TAKE_COUNT: "120",
    BOOK_ADULT_YN: "N",
    IS_EXCLUSIVE: "N",
    CONTENT_TYPE: "10",
    ISBN: "9791199000005",
    PRICE: 25000,
    PAGE_COUNT: 400,
    TAGS: ["데이터", "Python", "R"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "6",
    BOOK_ID: "audio6",
    BOOK_NAME: "달러구트 꿈 백화점 (오디오북)",
    BOOK_AUTHOR: "이미예",
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
    TAGS: ["판타지", "꿈"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "7",
    BOOK_ID: "ebook7",
    BOOK_NAME: "여행의 이유",
    BOOK_AUTHOR: "김영하",
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
    TAGS: ["여행", "에세이", "김영하"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "8",
    BOOK_ID: "ebook8",
    BOOK_NAME: "사피엔스",
    BOOK_AUTHOR: "유발 하라리",
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
    TAGS: ["역사", "인류", "빅 히스토리"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "9",
    BOOK_ID: "audio9",
    BOOK_NAME: "미드나잇 라이브러리 (오디오북)",
    BOOK_AUTHOR: "매트 헤이그",
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
    TAGS: ["판타지", "인생", "선택"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "10",
    BOOK_ID: "ebook10",
    BOOK_NAME: "파이썬 알고리즘 인터뷰",
    BOOK_AUTHOR: "박상길",
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
    TAGS: ["Python", "알고리즘", "코딩테스트"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "11",
    BOOK_ID: "ebook11",
    BOOK_NAME: "부자 아빠 가난한 아빠",
    BOOK_AUTHOR: "로버트 기요사키",
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
    TAGS: ["재테크", "부자", "투자"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "12",
    BOOK_ID: "audio12",
    BOOK_NAME: "클루지 (오디오북)",
    BOOK_AUTHOR: "개리 마커스",
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
    TAGS: ["심리학", "뇌과학", "인지오류"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "13",
    BOOK_ID: "ebook13",
    BOOK_NAME: "코스모스",
    BOOK_AUTHOR: "칼 세이건",
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
    TAGS: ["우주", "과학", "칼 세이건"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  {
    key: "14",
    BOOK_ID: "ebook14",
    BOOK_NAME: "팩트풀니스",
    BOOK_AUTHOR: "한스 로슬링",
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
    TAGS: ["데이터", "통계", "세상읽기"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    BOOK_FILE_NAME: "",
    SERIES_NAME: "",
    SERIES_NUM: null,
  },
  // --- 추가 더미 데이터 (시리즈 테스트용) ---
  {
    key: "15",
    BOOK_ID: "series_test_1_1",
    BOOK_NAME: "나니아 연대기 1: 사자와 마녀와 옷장",
    BOOK_AUTHOR: "C.S. 루이스",
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
  },
  {
    key: "16",
    BOOK_ID: "series_test_1_2",
    BOOK_NAME: "나니아 연대기 2: 캐스피언 왕자",
    BOOK_AUTHOR: "C.S. 루이스",
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
  },
  {
    key: "17",
    BOOK_ID: "series_test_2_1",
    BOOK_NAME: "멋진 신세계",
    BOOK_AUTHOR: "올더스 헉슬리",
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
  },
  {
    key: "18",
    BOOK_ID: "series_test_3_1",
    BOOK_NAME: "반지의 제왕 1: 반지 원정대",
    BOOK_AUTHOR: "J.R.R. 톨킨",
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
  },
  {
    key: "19",
    BOOK_ID: "series_test_3_2",
    BOOK_NAME: "반지의 제왕 2: 두 개의 탑",
    BOOK_AUTHOR: "J.R.R. 톨킨",
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
  },
  {
    key: "20",
    BOOK_ID: "series_test_3_3",
    BOOK_NAME: "반지의 제왕 3: 왕의 귀환",
    BOOK_AUTHOR: "J.R.R. 톨킨",
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
  },
  {
    key: "21",
    BOOK_ID: "no_series_book_1",
    BOOK_NAME: "침묵의 봄",
    BOOK_AUTHOR: "레이첼 카슨",
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
    TAGS: ["환경", "고전", "과학"],
    FILE_FORMAT: "EPUB",
    DRM_YN: "Y",
    SERVICE_REGION: "KR",
    SERIES_NAME: "",
    SERIES_NUM: null,
    VIDEO_URL: "",
  },
  {
    key: "22",
    BOOK_ID: "audio_series_1_1",
    BOOK_NAME: "해리 포터와 마법사의 돌 (오디오북)",
    BOOK_AUTHOR: "J.K. 롤링",
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
    TAGS: ["판타지", "마법", "오디오북"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    SERIES_NAME: "해리 포터 (오디오북)",
    SERIES_NUM: 1,
    VIDEO_URL: "",
  },
  {
    key: "23",
    BOOK_ID: "audio_series_1_2",
    BOOK_NAME: "해리 포터와 비밀의 방 (오디오북)",
    BOOK_AUTHOR: "J.K. 롤링",
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
    TAGS: ["판타지", "모험", "오디오북"],
    FILE_FORMAT: "MP3",
    DRM_YN: "Y",
    SERVICE_REGION: "GLOBAL",
    SERIES_NAME: "해리 포터 (오디오북)",
    SERIES_NUM: 2,
    VIDEO_URL: "",
  },
  {
    key: "24",
    BOOK_ID: "it_series_1",
    BOOK_NAME: "Clean Code 클린 코드",
    BOOK_AUTHOR: "로버트 C. 마틴",
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
  },
  {
    key: "25",
    BOOK_ID: "it_series_2",
    BOOK_NAME: "Clean Architecture 클린 아키텍처",
    BOOK_AUTHOR: "로버트 C. 마틴",
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
  },
].map((book) => ({
  ...book,
  BOOK_TRANSLATOR: book.BOOK_TRANSLATOR || "",
  BOOK_FILE_NAME: book.BOOK_FILE_NAME || "",
  VIDEO_URL: book.VIDEO_URL || "",
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
  const [filteredSeriesOptions, setFilteredSeriesOptions] = useState([]); // 자동 완성 옵션 상태 추가

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
      TAGS: book.TAGS || [],
      LANGUAGE: book.LANGUAGE
        ? Array.isArray(book.LANGUAGE)
          ? book.LANGUAGE
          : [book.LANGUAGE]
        : [],
      BOOK_TRANSLATOR: book.BOOK_TRANSLATOR || "",
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
          BOOK_FILE_NAME: newBookFileName,
          EBOOK_PUBLISH_DATE: values.EBOOK_PUBLISH_DATE
            ? values.EBOOK_PUBLISH_DATE.format("YYYY-MM-DD")
            : null,
          REGISTRATION_DATE: values.REGISTRATION_DATE
            ? values.REGISTRATION_DATE.format("YYYY-MM-DD")
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
      sorter: (a, b) =>
        moment(a.REGISTRATION_DATE).unix() - moment(b.REGISTRATION_DATE).unix(),
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "-"),
    },
    {
      title: "관리",
      key: "action",
      fixed: "right",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="수정">
            <Button
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="삭제">
            <Popconfirm
              title={`'${record.BOOK_NAME}' 도서를 삭제하시겠습니까?`}
              description="삭제 작업은 되돌릴 수 없습니다."
              onConfirm={() => handleDelete(record.key)}
              okText="삭제"
              cancelText="취소"
            >
              <Button icon={<DeleteOutlined />} danger size="small" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
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
        <Input.Search
          placeholder="도서명, 저자, 출판사, ISBN 검색..."
          style={{ width: 300 }}
          allowClear
        />
        <Space>
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
        dataSource={books}
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
                label="시리즈명"
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
                <AutoComplete
                  options={filteredSeriesOptions}
                  onSearch={(value) => {
                    const searchValue = value.toLowerCase();
                    const topOptions = seriesData
                      .filter((series) =>
                        series.name.toLowerCase().includes(searchValue)
                      )
                      .slice(0, 5)
                      .map((series) => ({
                        value: series.name,
                        label: (
                          <div>
                            {series.name}
                            <Text type="secondary" style={{ marginLeft: 8 }}>
                              ({series.count}권)
                            </Text>
                          </div>
                        ),
                        // Pass along category info for onSelect
                        categoryName: series.categoryName,
                        subCategoryName: series.subCategoryName,
                      }));
                    setFilteredSeriesOptions(topOptions);
                  }}
                  onSelect={(value, option) => {
                    // option contains { value, label, categoryName, subCategoryName, introduction }
                    if (option) {
                      const fieldsToUpdate = {};
                      if (option.categoryName !== undefined) {
                        fieldsToUpdate.CATEGORY_NAME = option.categoryName;
                      }
                      if (option.subCategoryName !== undefined) {
                        fieldsToUpdate.SUB_CATEGORY_NAME =
                          option.subCategoryName;
                      } else if (option.categoryName !== undefined) {
                        // If main category is set but sub is not in option, clear it
                        fieldsToUpdate.SUB_CATEGORY_NAME = undefined;
                      }
                      // 시리즈 선택 시 책 소개 필드에 더미 데이터 삽입
                      fieldsToUpdate.DESCRIPTION = `[${option.value}] 시리즈의 간략한 소개입니다. 내용을 직접 수정해주세요.`;
                      form.setFieldsValue(fieldsToUpdate);
                    }
                  }}
                  placeholder="시리즈명 검색 또는 새 시리즈 입력"
                  allowClear
                  filterOption={false}
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
                  placeholder="태그 입력 후 Enter"
                  style={{ width: "100%" }}
                  tokenSeparators={[","]}
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
              <Form.Item
                name="BOOK_SERVICE_YN"
                label="서비스 상태"
                initialValue="Y"
              >
                <Select style={{ width: "100%" }}>
                  <Option value="Y">서비스중</Option>
                  <Option value="N">중지</Option>
                </Select>
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
          </Row>
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
                  EBOOK_PUBLISH_DATE (YYYY-MM-DD), TAGS (쉼표로 구분),
                  DESCRIPTION 등
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
