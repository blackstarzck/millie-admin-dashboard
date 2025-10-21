import {
  CloseOutlined,
  PlusOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography
} from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { formatQuery, QueryBuilder } from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 배지 해금 조건용 필드 정의
const badgeUnlockFields = [
  { name: 'readingCount', label: '완독 도서 수', inputType: 'number', operators: ['=', '!=', '>', '<', '>=', '<='] },
  { name: 'genreReadingCount', label: '특정 장르 완독 수', inputType: 'number', operators: ['=', '!=', '>', '<', '>=', '<='] },
  { name: 'reviewCount', label: '리뷰 작성 수', inputType: 'number', operators: ['=', '!=', '>', '<', '>=', '<='] },
  { name: 'shareCount', label: '공유 횟수', inputType: 'number', operators: ['=', '!=', '>', '<', '>=', '<='] },
  { name: 'eventParticipation', label: '이벤트 참여 횟수', inputType: 'number', operators: ['=', '!=', '>', '<', '>=', '<='] },
  { name: 'consecutiveDays', label: '연속 독서일', inputType: 'number', operators: ['=', '!=', '>', '<', '>=', '<='] },
  { name: 'audiobookCount', label: '오디오북 청취 수', inputType: 'number', operators: ['=', '!=', '>', '<', '>=', '<='] },
  { name: 'genre', label: '장르', inputType: 'select', operators: ['=', '!='],
    values: [
      { name: 'romance', label: '로맨스' },
      { name: 'fantasy', label: '판타지' },
      { name: 'thriller', label: '스릴러' },
      { name: 'selfdev', label: '자기계발' },
      { name: 'humanities', label: '인문' },
      { name: 'novel', label: '소설' },
      { name: 'essay', label: '에세이' },
      { name: 'audiobook', label: '오디오북' },
      { name: 'magazine', label: '매거진' },
    ]
  },
];

// Editable Cell을 위한 Context
const EditableContext = React.createContext(null);

// Editable Row 컴포넌트
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// Editable Cell 컴포넌트
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      // 편집 모드 진입 시 기존 값 설정
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      setEditing(false);
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const cancel = () => {
    // 편집 취소 시 원래 값으로 되돌림
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    setEditing(false);
  };

  const handleBlur = () => {
    // focus-out 시 편집 모드 해제 (기존 값 유지)
    cancel();
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title}을(를) 입력해주세요.` }]}
        initialValue={record[dataIndex]}
      >
        <Space.Compact style={{ width: '100%' }}>
          <Input
            ref={inputRef}
            defaultValue={record[dataIndex]}
            onPressEnter={save}
            onBlur={handleBlur}
          />
          <Button
            type="primary"
            onMouseDown={(e) => e.preventDefault()} // blur 이벤트 전에 클릭 처리
            onClick={save}
          >
            저장
          </Button>
          <Button
            onMouseDown={(e) => e.preventDefault()} // blur 이벤트 전에 클릭 처리
            onClick={cancel}
          >
            취소
          </Button>
        </Space.Compact>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24, cursor: 'pointer' }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

// 배지 그룹 타입 정의 (그룹명과 매핑)
const BADGE_GROUP_TYPES = {
  '장르 탐험가': 'genre_explorer',
  '커뮤니티 빌더': 'community_builder',
  '이벤트 마스터': 'event_master',
  '꾸준한 독서': 'consistent_reader',
};

// 그룹별 초기 카테고리 (배지 데이터를 기반으로 자동 분류)
const getGroupCategories = (badges, groupType) => {
  const groupMapping = {
    'genre_explorer': ['로맨스 정복자', '판타지 모험가', '스릴러 추적자', '자기계발 선구자', '인문 탐구자', '다장르 개척자', '오디오북', '매거진', '소설', '에세이'],
    'community_builder': ['리뷰 크리에이터', '책 전파자', '이벤트 열정가', '포스트 생성자'],
    'event_master': ['챌린지 스타', '특별 이벤트 헌터', '시즌 챔피언'],
    'consistent_reader': ['연속 독서', '오디오북 마니아'],
  };

  const categories = groupMapping[groupType] || [];

  // 배지 데이터에서 해당 그룹의 카테고리만 추출하여 통계 계산
  const result = {};
  categories.forEach(category => {
    const categoryBadges = badges.filter(b => b.category === category);
    if (categoryBadges.length > 0) {
      result[category] = categoryBadges;
    }
  });

  return result;
};

// 초기 배지 데이터
const initialBadgesMaster = {
  // 장르 탐험가 - 로맨스
  'romance_beginner': { name: '첫사랑 수집가', category: '로맨스 정복자', description: '로맨스 장르 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/ff69b4/ffffff?text=R1', isActive: true, createdAt: '2024-01-01', keywords: ['로맨스', '독서', '초보'] },
  'romance_intermediate': { name: '하트 도둑', category: '로맨스 정복자', description: '로맨스 장르 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/ff1493/ffffff?text=R2', isActive: true, createdAt: '2024-01-01', keywords: ['로맨스', '독서', '숙련'] },
  'romance_master': { name: '로맨스 황제', category: '로맨스 정복자', description: '로맨스 장르 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/c71585/ffffff?text=R3', isActive: true, createdAt: '2024-01-01', keywords: ['로맨스', '마스터', '완독'] },

  // 장르 탐험가 - 판타지
  'fantasy_beginner': { name: '마법 초심자', category: '판타지 모험가', description: '판타지 장르 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/9370db/ffffff?text=F1', isActive: true, createdAt: '2024-01-01', keywords: ['판타지', '마법', '초보'] },
  'fantasy_intermediate': { name: '드래곤 기사', category: '판타지 모험가', description: '판타지 장르 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/8a2be2/ffffff?text=F2', isActive: true, createdAt: '2024-01-01', keywords: ['판타지', '드래곤', '숙련'] },
  'fantasy_master': { name: '판타지 대마법사', category: '판타지 모험가', description: '판타지 장르 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/4b0082/ffffff?text=F3', isActive: true, createdAt: '2024-01-01', keywords: ['판타지', '대마법사', '마스터'] },

  // 장르 탐험가 - 스릴러
  'thriller_beginner': { name: '단서 탐구자', category: '스릴러 추적자', description: '스릴러 장르 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/696969/ffffff?text=T1', isActive: true, createdAt: '2024-01-01', keywords: ['스릴러', '추리', '초보'] },
  'thriller_intermediate': { name: '진실 사냥꾼', category: '스릴러 추적자', description: '스릴러 장르 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/2f4f4f/ffffff?text=T2', isActive: true, createdAt: '2024-01-01', keywords: ['스릴러', '미스터리', '숙련'] },
  'thriller_master': { name: '미스터리 해결사', category: '스릴러 추적자', description: '스릴러 장르 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/000000/ffffff?text=T3', isActive: true, createdAt: '2024-01-01', keywords: ['스릴러', '해결사', '마스터'] },

  // 장르 탐험가 - 자기계발
  'selfdev_beginner': { name: '성장 신입', category: '자기계발 선구자', description: '자기계발 장르 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/ffa500/ffffff?text=S1', isActive: true, createdAt: '2024-01-01', keywords: ['자기계발', '성장', '초보'] },
  'selfdev_intermediate': { name: '목표 달인', category: '자기계발 선구자', description: '자기계발 장르 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/ff8c00/ffffff?text=S2', isActive: true, createdAt: '2024-01-01', keywords: ['자기계발', '목표', '숙련'] },
  'selfdev_master': { name: '인생 설계자', category: '자기계발 선구자', description: '자기계발 장르 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/ff6347/ffffff?text=S3', isActive: true, createdAt: '2024-01-01', keywords: ['자기계발', '설계', '마스터'] },

  // 장르 탐험가 - 인문
  'humanities_beginner': { name: '지식 방랑자', category: '인문 탐구자', description: '인문 장르 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/4682b4/ffffff?text=H1', isActive: true, createdAt: '2024-01-01', keywords: ['인문', '지식', '초보'] },
  'humanities_intermediate': { name: '철학 산책자', category: '인문 탐구자', description: '인문 장르 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/1e90ff/ffffff?text=H2', isActive: true, createdAt: '2024-01-01', keywords: ['인문', '철학', '숙련'] },
  'humanities_master': { name: '지혜의 수호자', category: '인문 탐구자', description: '인문 장르 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/0000cd/ffffff?text=H3', isActive: true, createdAt: '2024-01-01', keywords: ['인문', '지혜', '마스터'] },

  // 장르 탐험가 - 다장르 개척자
  'multigenre_beginner': { name: '호기심 탐험가', category: '다장르 개척자', description: '5개 장르 각 5권', tier: '초보', icon: 'https://via.placeholder.com/48/ff00ff/ffffff?text=M1', isActive: true, createdAt: '2024-01-01', keywords: ['다장르', '호기심', '탐험'] },
  'multigenre_intermediate': { name: '저재 순례자', category: '다장르 개척자', description: '5개 장르 각 5권', tier: '숙련', icon: 'https://via.placeholder.com/48/da70d6/ffffff?text=M2', isActive: true, createdAt: '2024-01-01', keywords: ['다장르', '순례', '숙련'] },
  'multigenre_master': { name: '만화경 독자', category: '다장르 개척자', description: '5개 장르 각 5권', tier: '마스터', icon: 'https://via.placeholder.com/48/ba55d3/ffffff?text=M3', isActive: true, createdAt: '2024-01-01', keywords: ['다장르', '만화경', '마스터'] },

  // 장르별 배지 - 오디오북
  'audiobook_beginner': { name: '소리 탐험가', category: '오디오북', description: '오디오북 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/20b2aa/ffffff?text=A1', isActive: true, createdAt: '2024-01-01' },
  'audiobook_intermediate': { name: '음성 정복자', category: '오디오북', description: '오디오북 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/008b8b/ffffff?text=A2', isActive: true, createdAt: '2024-01-01' },
  'audiobook_master': { name: '오디오북 황제', category: '오디오북', description: '오디오북 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/008080/ffffff?text=A3', isActive: true, createdAt: '2024-01-01' },

  // 장르별 배지 - 매거진
  'magazine_beginner': { name: '잡지 입문자', category: '매거진', description: '매거진 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/daa520/ffffff?text=MG1', isActive: true, createdAt: '2024-01-01' },
  'magazine_intermediate': { name: '트렌드 수집가', category: '매거진', description: '매거진 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/b8860b/ffffff?text=MG2', isActive: true, createdAt: '2024-01-01' },
  'magazine_master': { name: '매거진 마스터', category: '매거진', description: '매거진 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/8b6914/ffffff?text=MG3', isActive: true, createdAt: '2024-01-01' },

  // 장르별 배지 - 소설
  'novel_beginner': { name: '이야기 방랑자', category: '소설', description: '소설 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/cd853f/ffffff?text=N1', isActive: true, createdAt: '2024-01-01' },
  'novel_intermediate': { name: '소설 정복자', category: '소설', description: '소설 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/d2691e/ffffff?text=N2', isActive: true, createdAt: '2024-01-01' },
  'novel_master': { name: '스토리 마스터', category: '소설', description: '소설 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/8b4513/ffffff?text=N3', isActive: true, createdAt: '2024-01-01' },

  // 장르별 배지 - 에세이
  'essay_beginner': { name: '감성 탐험가', category: '에세이', description: '에세이 5권 완독', tier: '초보', icon: 'https://via.placeholder.com/48/f0e68c/000000?text=E1', isActive: true, createdAt: '2024-01-01' },
  'essay_intermediate': { name: '사색 여행자', category: '에세이', description: '에세이 15권 완독', tier: '숙련', icon: 'https://via.placeholder.com/48/bdb76b/ffffff?text=E2', isActive: true, createdAt: '2024-01-01' },
  'essay_master': { name: '에세이 마스터', category: '에세이', description: '에세이 30권 완독', tier: '마스터', icon: 'https://via.placeholder.com/48/9acd32/ffffff?text=E3', isActive: true, createdAt: '2024-01-01' },

  // 커뮤니티 빌더 - 리뷰 크리에이터
  'review_beginner': { name: '첫 감상 기록자', category: '리뷰 크리에이터', description: '10개 리뷰 작성', tier: '초보', icon: 'https://via.placeholder.com/48/87ceeb/000000?text=RC1', isActive: true, createdAt: '2024-01-01', keywords: ['리뷰', '감상', '초보'] },
  'review_intermediate': { name: '서평 비평가', category: '리뷰 크리에이터', description: '50개 리뷰 작성', tier: '숙련', icon: 'https://via.placeholder.com/48/4169e1/ffffff?text=RC2', isActive: true, createdAt: '2024-01-01', keywords: ['리뷰', '서평', '숙련'] },
  'review_master': { name: '밀리 평론가', category: '리뷰 크리에이터', description: '200개 리뷰 작성', tier: '마스터', icon: 'https://via.placeholder.com/48/0000ff/ffffff?text=RC3', isActive: true, createdAt: '2024-01-01', keywords: ['리뷰', '평론', '마스터'] },

  // 커뮤니티 빌더 - 책 전파자
  'share_beginner': { name: '서재 메신저', category: '책 전파자', description: '10회 책 공유', tier: '초보', icon: 'https://via.placeholder.com/48/98fb98/000000?text=SH1', isActive: true, createdAt: '2024-01-01', keywords: ['공유', '전파', '초보'] },
  'share_intermediate': { name: '독서 전도사', category: '책 전파자', description: '50회 책 공유', tier: '숙련', icon: 'https://via.placeholder.com/48/00fa9a/ffffff?text=SH2', isActive: true, createdAt: '2024-01-01', keywords: ['공유', '전도', '숙련'] },
  'share_master': { name: '밀리 전령사', category: '책 전파자', description: '150회 책 공유', tier: '마스터', icon: 'https://via.placeholder.com/48/00ff7f/000000?text=SH3', isActive: true, createdAt: '2024-01-01', keywords: ['공유', '전령', '마스터'] },

  // 커뮤니티 빌더 - 이벤트 열정가
  'event_beginner': { name: '서재 신참', category: '이벤트 열정가', description: '5회 이벤트 참여', tier: '초보', icon: 'https://via.placeholder.com/48/ffb6c1/000000?text=EV1', isActive: true, createdAt: '2024-01-01' },
  'event_intermediate': { name: '밀리 열혈팬', category: '이벤트 열정가', description: '20회 이벤트 참여', tier: '숙련', icon: 'https://via.placeholder.com/48/ff69b4/ffffff?text=EV2', isActive: true, createdAt: '2024-01-01' },
  'event_master': { name: '서재 축제왕', category: '이벤트 열정가', description: '50회 이벤트 참여', tier: '마스터', icon: 'https://via.placeholder.com/48/db7093/ffffff?text=EV3', isActive: true, createdAt: '2024-01-01' },

  // 커뮤니티 빌더 - 포스트 생성자
  'post_beginner': { name: '초보 포스팅', category: '포스트 생성자', description: '10개 포스트 작성', tier: '초보', icon: 'https://via.placeholder.com/48/dda0dd/000000?text=P1', isActive: true, createdAt: '2024-01-01' },
  'post_intermediate': { name: '숙련 포스팅', category: '포스트 생성자', description: '50개 포스트 작성', tier: '숙련', icon: 'https://via.placeholder.com/48/ee82ee/ffffff?text=P2', isActive: true, createdAt: '2024-01-01' },
  'post_master': { name: '마스터 포스팅', category: '포스트 생성자', description: '200개 포스트 작성', tier: '마스터', icon: 'https://via.placeholder.com/48/9370db/ffffff?text=P3', isActive: true, createdAt: '2024-01-01' },

  // 이벤트 마스터 - 챌린지 스타
  'challenge_beginner': { name: '이벤트 새싹', category: '챌린지 스타', description: '5회 이벤트 참여', tier: '초보', icon: 'https://via.placeholder.com/48/ffd700/000000?text=CH1', isActive: true, createdAt: '2024-01-01', keywords: ['이벤트', '챌린지', '초보'] },
  'challenge_intermediate': { name: '이벤트 사냥꾼', category: '챌린지 스타', description: '20회 이벤트 참여', tier: '숙련', icon: 'https://via.placeholder.com/48/ffdf00/000000?text=CH2', isActive: true, createdAt: '2024-01-01', keywords: ['이벤트', '챌린지', '숙련'] },
  'challenge_master': { name: '밀리 레전드', category: '챌린지 스타', description: '50회 이벤트 참여', tier: '마스터', icon: 'https://via.placeholder.com/48/ffa500/ffffff?text=CH3', isActive: true, createdAt: '2024-01-01', keywords: ['이벤트', '레전드', '마스터'] },

  // 이벤트 마스터 - 특별 이벤트 헌터
  'special_event_beginner': { name: '신규 도전자', category: '특별 이벤트 헌터', description: '3회 특별 이벤트 참여', tier: '초보', icon: 'https://via.placeholder.com/48/7fffd4/000000?text=SE1', isActive: true, createdAt: '2024-01-01', keywords: ['특별', '도전', '초보'] },
  'special_event_intermediate': { name: '축제 마니아', category: '특별 이벤트 헌터', description: '10회 특별 이벤트 참여', tier: '숙련', icon: 'https://via.placeholder.com/48/40e0d0/ffffff?text=SE2', isActive: true, createdAt: '2024-01-01', keywords: ['특별', '축제', '숙련'] },
  'special_event_master': { name: '이벤트 제왕', category: '특별 이벤트 헌터', description: '30회 특별 이벤트 참여', tier: '마스터', icon: 'https://via.placeholder.com/48/48d1cc/ffffff?text=SE3', isActive: true, createdAt: '2024-01-01', keywords: ['특별', '제왕', '마스터'] },

  // 이벤트 마스터 - 시즌 챔피언
  'season_beginner': { name: '시즌 초심자', category: '시즌 챔피언', description: '2회 시즌 이벤트 1위', tier: '초보', icon: 'https://via.placeholder.com/48/ff6347/ffffff?text=SC1', isActive: true, createdAt: '2024-01-01', keywords: ['시즌', '챔피언', '초보'] },
  'season_intermediate': { name: '시즌 강자', category: '시즌 챔피언', description: '5회 시즌 이벤트 1위', tier: '숙련', icon: 'https://via.placeholder.com/48/dc143c/ffffff?text=SC2', isActive: true, createdAt: '2024-01-01', keywords: ['시즌', '강자', '숙련'] },
  'season_master': { name: '시즌 패왕', category: '시즌 챔피언', description: '15회 시즌 이벤트 1위', tier: '마스터', icon: 'https://via.placeholder.com/48/b22222/ffffff?text=SC3', isActive: true, createdAt: '2024-01-01', keywords: ['시즌', '패왕', '마스터'] },

  // 꾸준한 독서 - 연속 독서
  'consecutive_beginner': { name: '매일 독자', category: '연속 독서', description: '7일 연속 독서', tier: '초보', icon: 'https://via.placeholder.com/48/32cd32/ffffff?text=CR1', isActive: true, createdAt: '2024-01-01', keywords: ['꾸준함', '연속', '초보'] },
  'consecutive_intermediate': { name: '서재 지킴이', category: '연속 독서', description: '30일 연속 독서', tier: '숙련', icon: 'https://via.placeholder.com/48/228b22/ffffff?text=CR2', isActive: true, createdAt: '2024-01-01', keywords: ['꾸준함', '지킴이', '숙련'] },
  'consecutive_master': { name: '불멸의 독서가', category: '연속 독서', description: '100일 연속 독서', tier: '마스터', icon: 'https://via.placeholder.com/48/006400/ffffff?text=CR3', isActive: true, createdAt: '2024-01-01', keywords: ['꾸준함', '불멸', '마스터'] },

  // 꾸준한 독서 - 오디오북 마니아
  'audio_consecutive_beginner': { name: '소리 탐험가', category: '오디오북 마니아', description: '7일 연속 오디오북 청취', tier: '초보', icon: 'https://via.placeholder.com/48/00bfff/ffffff?text=AC1', isActive: true, createdAt: '2024-01-01' },
  'audio_consecutive_intermediate': { name: '음성 동반자', category: '오디오북 마니아', description: '30일 연속 오디오북 청취', tier: '숙련', icon: 'https://via.placeholder.com/48/1e90ff/ffffff?text=AC2', isActive: true, createdAt: '2024-01-01' },
  'audio_consecutive_master': { name: '오디오 지켜주는 주인', category: '오디오북 마니아', description: '100일 연속 오디오북 청취', tier: '마스터', icon: 'https://via.placeholder.com/48/0000cd/ffffff?text=AC3', isActive: true, createdAt: '2024-01-01' },
};

const BadgeManagement = () => {
  // 배지 데이터 상태
  const [allBadgesMaster, setAllBadgesMaster] = useState(initialBadgesMaster);
  const [allBadges, setAllBadges] = useState([]);

  // 탭 관련 상태
  const [activeTab, setActiveTab] = useState('all');
  const [customTabs, setCustomTabs] = useState([]); // 사용자가 추가한 커스텀 탭

  // 모달 관련 상태
  const [badgeModalVisible, setBadgeModalVisible] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [badgeForm] = Form.useForm();
  const [unlockQuery, setUnlockQuery] = useState({ combinator: 'and', rules: [] });

  // 탭 추가 모달
  const [tabModalVisible, setTabModalVisible] = useState(false);
  const [newTabName, setNewTabName] = useState('');

  // 카테고리 생성 모달
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  // 빈 카테고리 목록 (배지가 없는 카테고리)
  const [emptyCategories, setEmptyCategories] = useState([]);

  // allBadgesMaster가 변경될 때마다 배지 목록 업데이트
    useEffect(() => {
    const badgeList = Object.entries(allBadgesMaster).map(([id, badge]) => ({
      id,
      ...badge,
    }));
    setAllBadges(badgeList);
  }, [allBadgesMaster]);

  // 현재 탭에 해당하는 배지 필터링
  const getFilteredBadges = () => {
    if (activeTab === 'all') {
      return allBadges;
    }

    // 고정 탭인 경우
    const groupType = BADGE_GROUP_TYPES[activeTab];
    if (groupType) {
      return allBadges.filter(badge => {
        const categories = getGroupCategories(allBadges, groupType);
        return Object.keys(categories).includes(badge.category);
      });
    }

    // 커스텀 탭인 경우
    const customTab = customTabs.find(tab => tab.key === activeTab);
    if (customTab && customTab.categories) {
      return allBadges.filter(badge => customTab.categories.includes(badge.category));
    }

    return allBadges;
  };

  // 카테고리별로 그룹화된 데이터 생성 (Nested Table용)
  const getCategoryTableData = () => {
    const filtered = getFilteredBadges();
    const categoryMap = {};

    // 배지가 있는 카테고리 처리
    filtered.forEach(badge => {
      // 카테고리의 그룹 확인
      let badgeGroup = badge.categoryGroup;

      // 그룹 정보가 없으면 고정 그룹에서 찾기
      if (!badgeGroup) {
        for (const [groupName, groupType] of Object.entries(BADGE_GROUP_TYPES)) {
          const groupCategories = getGroupCategories(allBadges, groupType);
          if (Object.keys(groupCategories).includes(badge.category)) {
            badgeGroup = groupName;
            break;
          }
        }
      }

      // '전체' 탭이 아닌 경우, 현재 탭의 배지만 표시
      const shouldShowBadge = activeTab === 'all' ||
                              badgeGroup === activeTab ||
                              // 고정 그룹의 카테고리인지 확인
                              (BADGE_GROUP_TYPES[activeTab] &&
                               Object.keys(getGroupCategories(allBadges, BADGE_GROUP_TYPES[activeTab])).includes(badge.category));

      if (shouldShowBadge) {
        if (!categoryMap[badge.category]) {
          categoryMap[badge.category] = {
            key: badge.category,
            category: badge.category,
            group: badgeGroup, // 추론된 그룹 정보
            badges: [],
            latestCreatedAt: badge.createdAt || '2024-01-01',
          };
        }
        categoryMap[badge.category].badges.push(badge);

        // 카테고리의 최신 생성일 업데이트
        const badgeCreatedAt = badge.createdAt || '2024-01-01';
        if (badgeCreatedAt > categoryMap[badge.category].latestCreatedAt) {
          categoryMap[badge.category].latestCreatedAt = badgeCreatedAt;
        }
      }
    });

    // 빈 카테고리 추가 (현재 탭에 맞는 그룹만)
    emptyCategories.forEach(cat => {
      // 현재 탭에 속하는 카테고리만 추가
      const shouldShow = activeTab === 'all' || cat.group === activeTab;

      if (shouldShow && !categoryMap[cat.name]) {
        categoryMap[cat.name] = {
          key: cat.name,
          category: cat.name,
          group: cat.group, // 그룹 정보 추가
          badges: [],
          latestCreatedAt: cat.createdAt,
          isEmpty: true, // 빈 카테고리 표시
        };
      }
    });

    // 최신 생성일 기준으로 내림차순 정렬 (새로운 카테고리가 상단에)
    return Object.values(categoryMap).sort((a, b) => {
      return new Date(b.latestCreatedAt) - new Date(a.latestCreatedAt);
    });
  };

  // 배지 생성/수정 모달 열기 (카테고리는 필수)
  const openBadgeModal = (badge = null, category = null) => {
    if (!badge && !category) {
      message.error('카테고리 정보가 필요합니다.');
      return;
    }

    setEditingBadge(badge);
    if (badge) {
      // 배지 수정 시 - 배지가 속한 실제 그룹 찾기
      let badgeGroup = badge.categoryGroup;

      // categoryGroup이 없으면 카테고리로부터 그룹 추론
      if (!badgeGroup) {
        // 1. 고정 그룹에서 찾기
        for (const [groupName, groupType] of Object.entries(BADGE_GROUP_TYPES)) {
          const groupCategories = getGroupCategories(allBadges, groupType);
          if (Object.keys(groupCategories).includes(badge.category)) {
            badgeGroup = groupName;
            break;
          }
        }

        // 2. 커스텀 탭에서 찾기
        if (!badgeGroup) {
          const customTab = customTabs.find(tab =>
            tab.categories && tab.categories.includes(badge.category)
          );
          if (customTab) {
            badgeGroup = customTab.label;
          }
        }
      }

      const groupLabel = badgeGroup || '미분류';

      badgeForm.setFieldsValue({
        name: badge.name,
        description: badge.description,
        tier: badge.tier,
        icon: badge.icon,
        unlockDescription: badge.unlockDescription || '',
        keywords: badge.keywords || [],
        _category: badge.category, // 내부 참조용
        _groupName: groupLabel, // 그룹명 표시용
      });
      // QueryBuilder 상태 설정
      setUnlockQuery(badge.unlockQueryObj || { combinator: 'and', rules: [] });
        } else {
      // 새 배지 생성 시
      const currentGroup = activeTab === 'all' ? '전체' : activeTab;
      const groupLabel = customTabs.find(tab => tab.key === currentGroup)?.label ||
                        Object.entries(BADGE_GROUP_TYPES).find(([key]) => key === currentGroup)?.[0] || currentGroup;

      badgeForm.resetFields();
      badgeForm.setFieldsValue({
        _category: category, // 내부 참조용
        _groupName: groupLabel, // 그룹명 표시용
        tier: '초보',
      });
      setUnlockQuery({ combinator: 'and', rules: [] });
    }
    setBadgeModalVisible(true);
  };

  // 배지 저장
  const handleSaveBadge = async () => {
    try {
      const values = await badgeForm.validateFields();
      const category = values._category; // 내부 참조용 카테고리

      // 해금 조건 검증
      if (!unlockQuery.rules || unlockQuery.rules.length === 0) {
        message.error('해금 조건을 설정해주세요.');
        return;
      }

      // _category는 저장하지 않음
      const { _category, ...badgeData } = values;

      // QueryBuilder 데이터 추가
      const badgeDataWithQuery = {
        ...badgeData,
        unlockQueryObj: unlockQuery, // QueryBuilder 객체 저장
        unlockQueryString: formatQuery(unlockQuery, 'json'), // JSON 문자열로도 저장
      };

      if (editingBadge) {
        // 배지 수정
        setAllBadgesMaster(prev => ({
          ...prev,
          [editingBadge.id]: {
            ...prev[editingBadge.id],
            ...badgeDataWithQuery,
            category: category, // 카테고리 유지
          }
        }));
        message.success('배지가 수정되었습니다.');
        } else {
        // 새 배지 생성
        const newBadgeId = `badge_${Date.now()}`;

        // 빈 카테고리에서 그룹 정보 가져오기
        const emptyCategory = emptyCategories.find(cat => cat.name === category);
        let categoryGroup = emptyCategory?.group;

        // 그룹 정보가 없으면 현재 탭 사용 (단, 'all'이 아닐 때만)
        if (!categoryGroup && activeTab !== 'all') {
          categoryGroup = activeTab;
        }

        // 여전히 그룹 정보가 없으면 카테고리로부터 추론
        if (!categoryGroup) {
          for (const [groupName, groupType] of Object.entries(BADGE_GROUP_TYPES)) {
            const groupCategories = getGroupCategories(allBadges, groupType);
            if (Object.keys(groupCategories).includes(category)) {
              categoryGroup = groupName;
              break;
            }
          }
        }

        setAllBadgesMaster(prev => ({
          ...prev,
          [newBadgeId]: {
            ...badgeDataWithQuery,
            category: category,
            categoryGroup: categoryGroup, // 카테고리가 속한 그룹 저장
            isActive: true,
            createdAt: new Date().toISOString().split('T')[0],
          }
        }));

        // 해당 카테고리가 빈 카테고리 목록에 있으면 제거
        setEmptyCategories(prev => prev.filter(cat => cat.name !== category));

        message.success('새 배지가 생성되었습니다.');
      }

      setBadgeModalVisible(false);
      badgeForm.resetFields();
      setEditingBadge(null);
      setUnlockQuery({ combinator: 'and', rules: [] });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // 배지 삭제
  const handleDeleteBadge = (badgeId) => {
    setAllBadgesMaster(prev => {
      const newMaster = { ...prev };
      delete newMaster[badgeId];
      return newMaster;
    });
    message.success('배지가 삭제되었습니다.');
  };

  // 배지 활성화/비활성화
  const handleToggleBadgeStatus = (badge) => {
    const newStatus = !badge.isActive;
    setAllBadgesMaster(prev => ({
      ...prev,
      [badge.id]: {
        ...prev[badge.id],
        isActive: newStatus
      }
    }));
    message.success(`배지가 ${newStatus ? '활성화' : '비활성화'}되었습니다.`);
  };

  // 카테고리 수정 저장 (Editable Cell에서 호출)
  const handleSaveCategory = (row) => {
    const oldCategory = getCategoryTableData().find(item => item.key === row.key)?.category;
    const newCategory = row.category;

    if (newCategory && newCategory !== oldCategory) {
      // 해당 카테고리의 모든 배지 업데이트
      setAllBadgesMaster(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(id => {
          if (updated[id].category === oldCategory) {
            updated[id] = { ...updated[id], category: newCategory };
          }
        });
        return updated;
      });
      message.success('카테고리가 수정되었습니다.');
    }
  };

  // 카테고리 전체 삭제
  const handleDeleteCategory = (category) => {
    // 배지 삭제
    setAllBadgesMaster(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(id => {
        if (updated[id].category === category) {
          delete updated[id];
        }
      });
      return updated;
    });

    // 빈 카테고리 목록에서도 제거
    setEmptyCategories(prev => prev.filter(cat => cat.name !== category));

    message.success('카테고리가 삭제되었습니다.');
  };

  // 탭 추가
  const handleAddTab = () => {
    if (newTabName.trim()) {
      const newTab = {
        key: `custom_${Date.now()}`,
        label: newTabName,
        categories: [], // 비어있는 카테고리로 시작
      };
      setCustomTabs([...customTabs, newTab]);
      setNewTabName('');
      setTabModalVisible(false);
      message.success('새 탭이 추가되었습니다.');
    }
  };

  // 탭 삭제 (탭과 관련된 모든 배지 삭제)
  const handleRemoveTab = (targetKey) => {
    const tab = customTabs.find(t => t.key === targetKey);
    if (tab) {
      // 해당 탭의 카테고리에 속한 모든 배지 삭제
      if (tab.categories && tab.categories.length > 0) {
        setAllBadgesMaster(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(id => {
            if (tab.categories.includes(updated[id].category)) {
              delete updated[id];
            }
          });
          return updated;
        });
      }

      // 탭 제거
      setCustomTabs(customTabs.filter(t => t.key !== targetKey));
      if (activeTab === targetKey) {
        setActiveTab('all');
      }

      message.success('탭과 관련된 모든 배지가 삭제되었습니다.');
    }
  };

  // 카테고리 생성
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      message.warning('카테고리명을 입력해주세요.');
      return;
    }

    if (!selectedGroup) {
      message.warning('그룹을 선택해주세요.');
      return;
    }

    // 중복 카테고리 체크 (배지 카테고리 + 빈 카테고리)
    const existingCategories = [
      ...Object.values(allBadgesMaster).map(badge => badge.category),
      ...emptyCategories.map(cat => cat.name)
    ];

    if (existingCategories.includes(newCategoryName.trim())) {
      message.warning('이미 존재하는 카테고리명입니다.');
      return;
    }

    // 빈 카테고리 추가
    const newCategory = {
      name: newCategoryName.trim(),
      group: selectedGroup, // 그룹 정보 추가
      createdAt: new Date().toISOString().split('T')[0],
    };

    setEmptyCategories([newCategory, ...emptyCategories]); // 최상단에 추가

    // 커스텀 탭인 경우 해당 탭의 카테고리 목록 업데이트
    const customTab = customTabs.find(t => t.key === selectedGroup);
    if (customTab) {
      setCustomTabs(customTabs.map(tab =>
        tab.key === selectedGroup
          ? { ...tab, categories: [...(tab.categories || []), newCategoryName.trim()] }
          : tab
      ));
    }

    message.success(`'${newCategoryName.trim()}' 카테고리가 생성되었습니다.`);

    setNewCategoryName('');
    setSelectedGroup('');
    setCategoryModalVisible(false);
  };

  // 1depth 테이블 컬럼 (카테고리 테이블)
  const getDefaultCategoryColumns = () => {
    const columns = [
      {
        title: '카테고리',
        dataIndex: 'category',
        key: 'category',
        editable: true,
        render: (category) => <Text strong style={{ fontSize: '15px' }}>{category}</Text>,
      },
    ];

    // 전체 탭일 때만 그룹 컬럼 추가
    if (activeTab === 'all') {
      columns.push({
        title: '그룹',
        dataIndex: 'group',
        key: 'group',
        width: 150,
        render: (group) => {
          // 커스텀 탭의 라벨 찾기
          const customTab = customTabs.find(t => t.key === group);
          const displayName = customTab ? customTab.label : group;

          return <Text>{displayName}</Text>;
             },
         });
    }

    columns.push(
      {
        title: '초보',
        key: 'beginner',
        width: 80,
        align: 'center',
        render: (_, record) => (
          <Text>{record.badges.filter(b => b.tier === '초보').length}</Text>
        ),
      },
      {
        title: '숙련',
        key: 'intermediate',
        width: 80,
        align: 'center',
        render: (_, record) => (
          <Text>{record.badges.filter(b => b.tier === '숙련').length}</Text>
        ),
      },
      {
        title: '마스터',
        key: 'master',
        width: 80,
        align: 'center',
        render: (_, record) => (
          <Text>{record.badges.filter(b => b.tier === '마스터').length}</Text>
        ),
      },
      {
        title: '',
        key: 'actions',
        width: 200,
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              size="small"
              onClick={() => openBadgeModal(null, record.category)}
            >
              배지 추가
            </Button>
            <Popconfirm
              title="카테고리 삭제"
              description={`'${record.category}' 카테고리와 모든 배지를 삭제하시겠습니까?`}
              onConfirm={() => handleDeleteCategory(record.category)}
              okText="삭제"
              cancelText="취소"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="link"
                size="small"
                danger
              >
                삭제
              </Button>
            </Popconfirm>
          </Space>
        ),
      }
    );

    return columns;
  };

  const defaultCategoryColumns = getDefaultCategoryColumns();

  // Editable Cell을 적용한 카테고리 컬럼
  const categoryColumns = defaultCategoryColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSaveCategory,
      }),
    };
  });

  // Table components (Editable Cell 적용)
  const categoryTableComponents = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  // 해금 조건 간략 표시
  const getUnlockConditionSummary = (badge) => {
    if (badge.unlockDescription) {
      return badge.unlockDescription;
    }
    return '조건 미설정';
  };

  // 2depth 테이블 컬럼 (배지 테이블)
  const badgeColumns = [
    {
      title: '이미지',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon, record) => (
        <Avatar src={icon} shape="square" size={48} alt={record.name} />
      ),
    },
    {
      title: '배지명',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: '티어',
      dataIndex: 'tier',
      key: 'tier',
      width: 80,
      render: (tier) => (
        <Tag color={tier === '마스터' ? 'gold' : tier === '숙련' ? 'blue' : 'green'}>
          {tier}
        </Tag>
      ),
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
    },
    {
      title: '키워드',
      dataIndex: 'keywords',
      key: 'keywords',
      width: 150,
      render: (keywords) => (
        <Space size={4} wrap>
          {keywords && keywords.length > 0 ? (
            keywords.map((keyword, index) => (
              <Tag key={index} color="blue" style={{ margin: 0 }}>
                {keyword}
              </Tag>
            ))
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>-</Text>
          )}
        </Space>
      ),
    },
    {
      title: '해금 조건',
      key: 'unlockCondition',
      width: 200,
      ellipsis: true,
      render: (_, record) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {getUnlockConditionSummary(record)}
        </Text>
      ),
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={(checked, e) => {
            e.stopPropagation();
            handleToggleBadgeStatus(record);
          }}
          checkedChildren="활성"
          unCheckedChildren="비활성"
        />
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              openBadgeModal(record);
            }}
          >
            수정
          </Button>
          <Popconfirm
            title="배지를 삭제하시겠습니까?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDeleteBadge(record.id);
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="삭제"
            cancelText="취소"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="link"
              size="small"
              danger
              onClick={(e) => e.stopPropagation()}
            >
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 탭 아이템 생성
  const tabItems = [
    {
      key: 'all',
      label: '전체',
      closable: false,
    },
    {
      key: '장르 탐험가',
      label: '장르 탐험가',
      closable: false,
    },
    {
      key: '커뮤니티 빌더',
      label: '커뮤니티 빌더',
      closable: false,
    },
    {
      key: '이벤트 마스터',
      label: '이벤트 마스터',
      closable: false,
    },
    {
      key: '꾸준한 독서',
      label: '꾸준한 독서',
      closable: false,
    },
    ...customTabs.map(tab => ({
      key: tab.key,
      label: (
        <span>
          {tab.label}
          <CloseOutlined
            style={{ marginLeft: 8, fontSize: 12 }}
            onClick={(e) => {
              e.stopPropagation();
         Modal.confirm({
                title: '탭 삭제',
                content: `'${tab.label}' 탭을 삭제하시겠습니까?`,
                okText: '삭제',
             cancelText: '취소',
                okButtonProps: { danger: true },
                onOk: () => handleRemoveTab(tab.key),
              });
            }}
          />
        </span>
      ),
      closable: false, // closeIcon을 label에 포함시켰으므로 false로 설정
    })),
  ];

  const onTabEdit = (targetKey, action) => {
    if (action === 'add') {
      setTabModalVisible(true);
    }
    // remove는 label의 CloseOutlined에서 처리
  };

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <div>
        <Title level={2}><TrophyOutlined /> 배지 관리</Title>
        <Text>배지를 그룹별로 관리하고 생성합니다.</Text>
      </div>

      {/* 탭 메뉴 */}
      <Tabs
        type="editable-card"
        activeKey={activeTab}
        onChange={setActiveTab}
        onEdit={onTabEdit}
        items={tabItems.map(item => ({
          ...item,
          children: (
            <div>
              {/* 카테고리 생성 버튼 */}
              <div style={{ marginBottom: 16, textAlign: 'right' }}>
                             <Button
                                 type="primary"
                                 icon={<PlusOutlined />}
                  onClick={() => {
                    // 현재 탭이 '전체'가 아니면 자동으로 그룹 설정
                    if (activeTab !== 'all') {
                      setSelectedGroup(activeTab);
                    } else {
                      setSelectedGroup('');
                    }
                    setCategoryModalVisible(true);
                  }}
                >
                  카테고리 생성
                             </Button>
              </div>

              {/* Nested Table */}
              <Table
                components={categoryTableComponents}
                rowClassName={() => 'editable-row'}
                columns={categoryColumns}
                dataSource={getCategoryTableData()}
                expandable={{
                  expandedRowRender: (record) => (
                    <Table
                      columns={badgeColumns}
                      dataSource={record.badges}
                      rowKey="id"
                      pagination={false}
                      size="small"
                    />
                  ),
                  defaultExpandAllRows: false,
                }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `총 ${total}개 카테고리`,
                }}
              />
            </div>
          ),
                             }))}
                         />

      {/* 배지 생성/수정 모달 */}
      <Modal
        title={editingBadge ? '배지 수정' : '새 배지 생성'}
        open={badgeModalVisible}
        onOk={handleSaveBadge}
        onCancel={() => {
          setBadgeModalVisible(false);
          badgeForm.resetFields();
          setEditingBadge(null);
          setUnlockQuery({ combinator: 'and', rules: [] });
        }}
        width={800}
        okText="저장"
        cancelText="취소"
      >
        <Form
          form={badgeForm}
          layout="vertical"
          initialValues={{
            tier: '초보',
          }}
        >
          {/* 내부 참조용 숨겨진 필드 */}
          <Form.Item name="_category" hidden>
            <Input />
          </Form.Item>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 그룹명 표시 */}
            <Form.Item
              name="_groupName"
              label="그룹 (탭 메뉴)"
            >
              <Select disabled placeholder="그룹명">
                <Option value="장르 탐험가">장르 탐험가</Option>
                <Option value="커뮤니티 빌더">커뮤니티 빌더</Option>
                <Option value="이벤트 마스터">이벤트 마스터</Option>
                <Option value="꾸준한 독서">꾸준한 독서</Option>
                {customTabs.map(tab => (
                  <Option key={tab.key} value={tab.label}>{tab.label}</Option>
                ))}
              </Select>
            </Form.Item>

            <Space style={{ width: '100%' }}>
              <Form.Item
                name="name"
                label="배지명 (칭호)"
                rules={[{ required: true, message: '배지명을 입력해주세요' }]}
                style={{ flex: 1, minWidth: 300 }}
              >
                <Input placeholder="예: 첫사랑 수집가" />
              </Form.Item>

              <Form.Item
                name="tier"
                label="티어"
                rules={[{ required: true, message: '티어를 선택해주세요' }]}
                style={{ flex: 1, minWidth: 300 }}
              >
                <Select>
                  <Option value="초보">초보</Option>
                  <Option value="숙련">숙련</Option>
                  <Option value="마스터">마스터</Option>
                </Select>
              </Form.Item>
                     </Space>

            <Form.Item
              name="icon"
              label="이미지 URL"
              rules={[{ required: true, message: '이미지 URL을 입력해주세요' }]}
            >
              <Input placeholder="https://..." />
            </Form.Item>

            <Form.Item
              name="description"
              label="설명"
              rules={[{ required: true, message: '설명을 입력해주세요' }]}
            >
              <Input.TextArea
                rows={2}
                placeholder="배지에 대한 간단한 설명을 입력하세요"
              />
            </Form.Item>

            <Form.Item
              name="keywords"
              label="키워드 (최대 3개)"
              rules={[
                { type: 'array', max: 3, message: '최대 3개까지만 등록 가능합니다' }
              ]}
              extra="Enter 키를 눌러 키워드를 추가하세요"
            >
              <Select
                mode="tags"
                placeholder="키워드를 입력하고 Enter를 누르세요"
                maxTagCount={3}
                style={{ width: '100%' }}
                onChange={(value) => {
                  if (value.length > 3) {
                    message.warning('키워드는 최대 3개까지만 등록 가능합니다');
                    badgeForm.setFieldsValue({ keywords: value.slice(0, 3) });
                  }
                }}
              />
            </Form.Item>

            <Divider orientation="left">해금 조건 설정</Divider>

            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>
                해금 조건 정의 <span style={{ color: '#ff4d4f' }}>*</span>
              </div>
              <QueryBuilder
                fields={badgeUnlockFields}
                query={unlockQuery}
                onQueryChange={q => setUnlockQuery(q)}
              />
              <div style={{ marginTop: 8, color: '#888', fontSize: '12px' }}>
                규칙을 추가하여 배지 해금 조건을 정의하세요
              </div>
            </div>

            <Form.Item
              name="unlockDescription"
              label="조건 상세 설명"
              extra="사용자에게 표시될 해금 조건 설명"
              rules={[{ required: true, message: '조건 상세 설명을 입력해주세요' }]}
            >
              <TextArea
                rows={2}
                placeholder="예: 로맨스 장르 도서 5권을 완독하세요"
              />
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      {/* 탭 추가 모달 */}
      <Modal
        title="새 탭 추가"
        open={tabModalVisible}
        onOk={handleAddTab}
        onCancel={() => {
          setTabModalVisible(false);
          setNewTabName('');
        }}
        okText="추가"
        cancelText="취소"
      >
        <Form layout="vertical">
          <Form.Item label="탭 이름">
            <Input
              value={newTabName}
              onChange={(e) => setNewTabName(e.target.value)}
              placeholder="예: 특별 이벤트"
              onPressEnter={handleAddTab}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 카테고리 생성 모달 */}
      <Modal
        title="카테고리 생성"
        open={categoryModalVisible}
        onOk={handleCreateCategory}
        onCancel={() => {
          setCategoryModalVisible(false);
          setNewCategoryName('');
          setSelectedGroup('');
        }}
        okText="생성"
        cancelText="취소"
      >
        <Form layout="vertical">
          <Form.Item label="그룹" required>
            <Select
              value={selectedGroup}
              onChange={setSelectedGroup}
              placeholder="그룹을 선택하세요"
              disabled={activeTab !== 'all'}
            >
              <Option value="장르 탐험가">장르 탐험가</Option>
              <Option value="커뮤니티 빌더">커뮤니티 빌더</Option>
              <Option value="이벤트 마스터">이벤트 마스터</Option>
              <Option value="꾸준한 독서">꾸준한 독서</Option>
              {customTabs.map(tab => (
                <Option key={tab.key} value={tab.key}>{tab.label}</Option>
              ))}
            </Select>
            {activeTab !== 'all' && (
              <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>
                현재 '{activeTab}' 탭에서 생성하므로 그룹이 자동으로 설정됩니다.
              </div>
            )}
          </Form.Item>
          <Form.Item label="카테고리명" required>
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="예: 로맨스 정복자"
              onPressEnter={handleCreateCategory}
            />
          </Form.Item>
          <div style={{ color: '#888', fontSize: '12px', marginTop: '-10px' }}>
            카테고리 생성 후 '배지 추가' 버튼을 통해 배지를 추가할 수 있습니다.
          </div>
        </Form>
      </Modal>

        </Space>
    );
};

export default BadgeManagement;
