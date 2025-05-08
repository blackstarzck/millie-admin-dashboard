import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Space,
    Typography,
    Tag,
    message,
    Popconfirm,
    Select,
    DatePicker,
    Transfer,
    Tooltip,
    Flex,
    Switch,
    Descriptions
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    TagsOutlined,
    BookOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 제공된 썸네일 이미지 URL 목록
const sampleThumbnailUrls = [
    'https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-1.png?alt=media&token=3bd34326-431b-4654-aef3-7db0f2738972',
    'https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-10.png?alt=media&token=d3452afd-608a-4529-87a9-c8871872ff7f',
    'https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-3.png?alt=media&token=cd0f35a8-a09c-4cd5-a527-2c229066d279',
    // 중복된 URL 제거 (동일 토큰은 같은 이미지를 가리킴)
    // 'https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FF-AG1-3.png?alt=media&token=cd0f35a8-a09c-4cd5-a527-2c229066d279',
    'https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/AG1%2FM-AG1-1.png?alt=media&token=21827222-9c14-4828-8918-3569b2c08ce5',
    'https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/HP1%2FF-HP1-10.png?alt=media&token=1d7d51d6-78d6-4bba-b5db-a96453e605ab',
    'https://firebasestorage.googleapis.com/v0/b/card-maker-89016.appspot.com/o/HP1%2FF-HP1-12.png?alt=media&token=3292f705-5a04-4201-8fe3-4cabbbf1998a',
];

// 랜덤 썸네일 URL 반환 함수
const getRandomThumbnail = () => sampleThumbnailUrls[Math.floor(Math.random() * sampleThumbnailUrls.length)];

// Customize Table Transfer (사용자 제공 코드)
const __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };

const TableTransfer = props => {
  const { leftColumns, rightColumns, 요청된_selectedContentType, onItemViewDetail } = props,
    restProps = __rest(props, ['leftColumns', 'rightColumns', '요청된_selectedContentType', 'onItemViewDetail']);
  return (
    <Transfer style={{ width: '100%' }} {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;
        
        // 왼쪽 목록일 경우에만 selectedContentType에 따라 추가 필터링
        let displayedItems = filteredItems;
        if (direction === 'left' && 요청된_selectedContentType) {
            displayedItems = filteredItems.filter(item => item.type === 요청된_selectedContentType);
        }

        const rowSelection = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, 'replace');
          },
          selectedRowKeys: listSelectedKeys,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
        };
        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={displayedItems}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
            onRow={(record) => ({
              onClick: () => {
                if (record.disabled || listDisabled) {
                  return;
                }
                onItemSelect(record.key, !listSelectedKeys.includes(record.key));
                if (onItemViewDetail) {
                    onItemViewDetail(record);
                }
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};

// 초기 큐레이션 더미 데이터
const constTempInitialCurations = [
    { key: 'cur_1', id: 'CUR001', title: '여름 휴가에 읽기 좋은 책', description: '시원한 여름을 위한 추천 전자책 모음', connectionUrl: '/curations/summer-reading', landingUrl: '/events/summer-event', creator: 'admin_A', creationDate: '2024-07-01', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_2', id: 'CUR002', title: 'IT 개발자를 위한 필독서', description: '최신 기술 트렌드와 기본기를 다질 수 있는 개발 서적', connectionUrl: '/curations/dev-books', landingUrl: null, creator: 'admin_B', creationDate: '2024-06-15', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '샘플 텍스트 1 for CUR002', text2: '샘플 텍스트 2 for CUR002' },
    { key: 'cur_3', id: 'CUR003', title: '퇴근길, 마음을 달래주는 에세이 (비공개)', description: '지친 하루 끝에 위로가 되는 글들', connectionUrl: null, landingUrl: null, creator: 'admin_A', creationDate: '2024-07-10', status: 'Private', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_4', id: 'CUR004', title: '주말에 볼만한 영화 원작 소설', description: '스크린으로 옮겨진 명작들을 책으로 만나보세요.', creator: 'editor_C', creationDate: '2024-07-05', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_5', id: 'CUR005', title: '오디오북으로 즐기는 고전 문학', description: '귀로 듣는 명작의 감동.', creator: 'admin_B', creationDate: '2024-07-12', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_6', id: 'CUR006', title: '데이터 과학 입문자를 위한 추천 자료 (비공개)', description: '데이터 분석의 첫걸음, 이 자료들로 시작하세요.', creator: 'data_guru', creationDate: '2024-07-18', status: 'Private', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_7', id: 'CUR007', title: '역사 속 위대한 인물들 이야기', description: '그들의 삶과 업적을 통해 배우는 교훈.', creator: 'history_buff', creationDate: '2024-07-02', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_8', id: 'CUR008', title: '우리동네 맛집 시리즈', description: '이웃들이 추천하는 진짜 맛집 정보.', creator: 'foodie_local', creationDate: '2024-06-28', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_9', id: 'CUR009', title: 'SF 판타지 소설 컬렉션 (비공개)', description: '상상력을 자극하는 미지의 세계로 떠나보세요.', creator: 'fantasy_lover', creationDate: '2024-07-20', status: 'Private', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_10', id: 'CUR010', title: '자기계발 베스트셀러 큐레이션', description: '성장을 위한 동기부여와 실용적인 조언들.', creator: 'admin_A', creationDate: '2024-07-15', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_11', id: 'CUR011', title: '여행지 추천: 숨겨진 보석 같은 곳들', description: '다음 휴가를 위한 특별한 장소들.', creator: 'travel_holic', creationDate: '2024-07-08', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_12', id: 'CUR012', title: '스타트업 성공 스토리 모음', description: '혁신적인 아이디어와 도전 정신.', creator: 'biz_dev', creationDate: '2024-06-25', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_13', id: 'CUR013', title: '건강한 삶을 위한 레시피 (비공개)', description: '맛있고 건강한 식단 아이디어.', creator: 'wellness_chef', creationDate: '2024-07-22', status: 'Private', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_14', id: 'CUR014', title: '최신 IT 기술 트렌드 분석 시리즈', description: 'AI, 블록체인, 클라우드 등 주요 기술 동향.', creator: 'tech_analyst', creationDate: '2024-07-11', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_15', id: 'CUR015', title: '어린이 동화 오디오북 시리즈', description: '잠들기 전 아이들에게 들려주기 좋은 이야기.', creator: 'kids_voice', creationDate: '2024-07-03', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    // 추가된 10개 큐레이션 데이터
    { key: 'cur_16', id: 'CUR016', title: '힐링을 위한 자연 ASMR 시리즈', description: '마음의 평화를 찾는 소리들.', creator: 'asmr_lover', creationDate: '2024-07-25', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_17', id: 'CUR017', title: '세계 명화 감상 (비공개)', description: '미술사조와 함께하는 명화 이야기.', creator: 'art_critic', creationDate: '2024-07-28', status: 'Private', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_18', id: 'CUR018', title: '코딩 테스트 준비를 위한 문제 풀이', description: '알고리즘과 자료구조 문제 해결 전략.', creator: 'algo_master', creationDate: '2024-08-01', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_19', id: 'CUR019', title: '반려동물과 함께하는 삶 (비공개)', description: '반려동물 양육 정보 및 팁 공유.', creator: 'pet_lover', creationDate: '2024-08-03', status: 'Private', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_20', id: 'CUR020', title: '홈 트레이닝 루틴 추천', description: '집에서 하는 효과적인 운동 방법.', creator: 'fitness_guru', creationDate: '2024-08-05', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_21', id: 'CUR021', title: '우주 탐험의 역사와 미래', description: '별과 행성, 그리고 미지의 세계로.', creator: 'space_explorer', creationDate: '2024-08-08', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_22', id: 'CUR022', title: '미니멀 라이프 실천 가이드 (비공개)', description: '단순하고 의미있는 삶을 위한 조언.', creator: 'minimalist', creationDate: '2024-08-10', status: 'Private', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_23', id: 'CUR023', title: '재테크 초보 탈출 프로젝트', description: '금융 지식과 투자 전략 배우기.', creator: 'invest_pro', creationDate: '2024-08-12', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_24', id: 'CUR024', title: '영화 음악 베스트 컬렉션', description: '감동을 더하는 영화 속 명곡들.', creator: 'soundtrack_fan', creationDate: '2024-08-15', status: 'Public', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
    { key: 'cur_25', id: 'CUR025', title: '세계 축제 & 이벤트 정보 (비공개)', description: '다양한 문화와 즐거움을 경험하세요.', creator: 'event_planner', creationDate: '2024-08-18', status: 'Private', contents: [], thumbnail: getRandomThumbnail(), text1: '', text2: '' },
];

// 다양한 콘텐츠 유형을 위한 가상 데이터 (기존 데이터 유지 및 thumbnail 추가, post -> series 변경)
const allContentsData = [
    // 전자책/전자책
    { key: 'book_1', type: 'book', title: '숙론', author: '김숙', publisher: '웅진지식하우스', category: '에세이', thumbnail: getRandomThumbnail() },
    { key: 'book_2', type: 'book', title: 'React 마스터하기', author: 'John Doe', publisher: 'Tech Books', category: 'IT', thumbnail: getRandomThumbnail() },
    { key: 'book_3', type: 'book', title: 'Node.js 실전 가이드', author: 'Jane Smith', publisher: 'Dev Press', category: 'IT', thumbnail: getRandomThumbnail() },
    { key: 'book_4', type: 'book', title: '여행의 이유', author: '김영하', publisher: '문학동네', category: '에세이', thumbnail: getRandomThumbnail() },
    { key: 'book_5', type: 'book', title: '파친코 1', author: '이민진', publisher: '문학사상', category: '소설', thumbnail: getRandomThumbnail() },
    { key: 'book_6', type: 'book', title: '이기적 유전자', author: '리처드 도킨스', publisher: '을유문화사', category: '과학', thumbnail: getRandomThumbnail() },

    // 오디오북
    { key: 'audio_1', type: 'audiobook', title: '불편한 편의점 (오디오북)', narrator: '김혜수', runningTime: '5시간 30분', category: '소설', thumbnail: getRandomThumbnail() },
    { key: 'audio_2', type: 'audiobook', title: '달러구트 꿈 백화점 (오디오북)', narrator: '이지아', runningTime: '6시간 15분', category: '판타지', thumbnail: getRandomThumbnail() },
    { key: 'audio_3', type: 'audiobook', title: '해리포터와 마법사의 돌 (오디오북)', narrator: '조앤 K. 롤링 (낭독 샘)', runningTime: '8시간', category: '판타지', thumbnail: getRandomThumbnail() },

    // 시리즈 (기존 게시글 변경)
    { key: 'series_1', type: 'series', title: '[공지] 서버 점검 시리즈', author: '운영팀', thumbnail: getRandomThumbnail() },
    { key: 'series_2', type: 'series', title: '여름 휴가 후기 시리즈', author: '마케팅팀', thumbnail: getRandomThumbnail() },
    { key: 'series_3', type: 'series', title: 'React Query 활용 팁 시리즈', author: 'dev_expert', thumbnail: getRandomThumbnail() },
];

// 사용 가능한 모든 콘텐츠 풀 (thumbnail 추가)
const availableContentPool = [
    ...allContentsData.map(c => ({ ...c })),
    ...constTempInitialCurations.map(c => ({ key: c.key, id: c.id, title: c.title, type: 'curation', creator: c.creator, thumbnail: c.thumbnail }))
];

// 각 큐레이션에 최소 5개의 다양한 콘텐츠를 채우는 로직 (thumbnail 포함되도록 수정)
export const initialCurations = constTempInitialCurations.map(curation => {
    const newContents = [];
    const numberOfContents = 5 + Math.floor(Math.random() * 3);
    const pool = availableContentPool.filter(item => item.key !== curation.key);
    const addedContentKeys = new Set();

    // "IT 개발자를 위한 필독서" (cur_2)에 "숙론" (book_1)을 우선적으로 추가
    if (curation.key === 'cur_2') {
        const sukronBook = allContentsData.find(c => c.key === 'book_1');
        if (sukronBook && !addedContentKeys.has(sukronBook.key)) {
            const contentToAdd = {
                key: sukronBook.key,
                title: sukronBook.title,
                type: sukronBook.type,
                thumbnail: sukronBook.thumbnail || getRandomThumbnail(),
                ...sukronBook // 나머지 정보도 모두 복사
            };
            newContents.push(contentToAdd);
            addedContentKeys.add(sukronBook.key);
        }
    }

    while (newContents.length < numberOfContents && pool.length > 0) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        const selectedItem = pool[randomIndex];

        if (!addedContentKeys.has(selectedItem.key)) {
            // 모든 아이템은 thumbnail을 가지고 있어야 함
            const contentToAdd = {
                key: selectedItem.key,
                title: selectedItem.title,
                type: selectedItem.type,
                thumbnail: selectedItem.thumbnail || getRandomThumbnail(), // selectedItem에 thumbnail이 없을 경우 대비 (이론상 항상 있어야 함)
            };

            if (selectedItem.type === 'curation') {
                contentToAdd.id = selectedItem.id;
                contentToAdd.creator = selectedItem.creator;
            } else {
                // allContentsData에서 원본을 찾아 추가 정보 병합
                const originalContent = allContentsData.find(c => c.key === selectedItem.key);
                if (originalContent) {
                    Object.assign(contentToAdd, originalContent); // thumbnail은 이미 contentToAdd에 있음
                }
            }
            newContents.push(contentToAdd);
            addedContentKeys.add(selectedItem.key);
        }
        if (newContents.length >= pool.length && newContents.length < numberOfContents) break;
    }
    return { ...curation, contents: newContents };
});

// 콘텐츠 유형별 컬럼 정의 (썸네일 컬럼 추가)
const thumbnailColumn = {
    title: '썸네일',
    dataIndex: 'thumbnail',
    key: 'thumbnail',
    width: 70,
    render: (thumbnail) => <img src={thumbnail || 'https://via.placeholder.com/40x40?text=N/A'} alt="thumbnail" style={{ width: 40, height: 40, objectFit: 'cover' }} />,
};

const bookColumns = [
    thumbnailColumn,
    { dataIndex: 'title', title: '도서명' },
    { dataIndex: 'author', title: '저자' },
    { dataIndex: 'publisher', title: '출판사' },
];

const audiobookColumns = [
    thumbnailColumn,
    { dataIndex: 'title', title: '오디오북명' },
    { dataIndex: 'narrator', title: '읽은이' },
    { dataIndex: 'runningTime', title: '재생 시간' },
];

// 시리즈 컬럼 (기존 postColumns 대체)
const seriesColumns = [
    thumbnailColumn,
    { dataIndex: 'title', title: '시리즈명' },
    { dataIndex: 'author', title: '저자' },
];

// 콘텐츠 유형 한글 매핑 (post -> series)
const contentTypeKoreanMap = {
    book: '전자책',
    audiobook: '오디오북',
    series: '시리즈',
    curation: '큐레이션',
};

// 콘텐츠 유형별 태그 색상 매핑
const contentTypeColorMap = {
    book: 'blue',
    audiobook: 'green',
    series: 'volcano',
    curation: 'purple',
};

// 상태 태그 헬퍼
const getStatusTag = (status) => {
    if (status === 'Public') {
        return <Tag color="blue">공개</Tag>;
    } else if (status === 'Private') {
        return <Tag color="gold">비공개</Tag>;
    }
    return <Tag>{status}</Tag>;
};

// 콘텐츠 유형 필터 옵션 생성
const contentTypeFilterOptions = Object.entries(contentTypeKoreanMap).map(([key, value]) => ({
    text: value,
    value: key,
}));

// 큐레이션 표시용 컬럼 (썸네일 컬럼 추가)
const curationColumns = [
    thumbnailColumn,
    { dataIndex: 'id', title: '큐레이션 ID' },
    { dataIndex: 'title', title: '큐레이션명' },
    { dataIndex: 'creator', title: '생성자' },
];

// 콘텐츠 구성 모달 - 오른쪽 선택된 아이템 표시용 고정 컬럼 (썸네일 컬럼 추가)
const selectedContentColumns = [
    thumbnailColumn,
    {
        title: '유형',
        dataIndex: 'type',
        width: 100,
        render: (type) => <Tag color={contentTypeColorMap[type] || 'default'}>{contentTypeKoreanMap[type] || type}</Tag>,
    },
    {
        title: '제목',
        dataIndex: 'title',
        ellipsis: true,
    },
    {
        title: '세부 정보',
        key: 'detail',
        width: 150,
        ellipsis: true,
        render: (_, record) => {
            switch (record.type) {
                case 'book':
                    return `저자: ${record.author || '-'}`;
                case 'audiobook':
                    return `읽은이: ${record.narrator || '-'}`;
                case 'series':
                    return `저자: ${record.author || '-'}`;
                case 'curation':
                    return `생성자: ${record.creator || '-'}`;
                default:
                    return '-';
            }
        },
    },
];

const CurationManagement = () => {
    const [curations, setCurations] = useState(initialCurations);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCuration, setEditingCuration] = useState(null);
    const [form] = Form.useForm();

    // 전자책 구성 모달 상태 -> 콘텐츠 구성 모달 상태로 변경
    const [isContentModalOpen, setIsContentModalOpen] = useState(false);
    const [selectedCurationForContent, setSelectedCurationForContent] = useState(null);
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedContentType, setSelectedContentType] = useState('book'); // 기본값 'book'

    // 상세 정보 모달 상태
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedItemForDetail, setSelectedItemForDetail] = useState(null);

    // 외부 필터 상태
    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Public', 'Private'
    const [filterContentType, setFilterContentType] = useState('all'); // 'all', 'book', 'audiobook', ...

    // 상태 변경 핸들러
    const handleStatusChange = (key, checked) => {
        const newStatus = checked ? 'Public' : 'Private';
        setCurations(prevCurations =>
            prevCurations.map(curation =>
                curation.key === key ? { ...curation, status: newStatus } : curation
            )
        );
        message.success(`큐레이션 상태가 '${newStatus === 'Public' ? '공개' : '비공개'}'으로 변경되었습니다.`);
    };

    // 모달 열기 (추가/수정)
    const showModal = (curation = null) => {
        setEditingCuration(curation);
        if (curation) {
            form.setFieldsValue({
                ...curation,
                status: curation.status === 'Public',
                text1: curation.text1 || '',
                text2: curation.text2 || '',
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ 
                status: false,
                text1: '',
                text2: '',
            });
        }
        setIsModalOpen(true);
    };

    // 모달 취소
    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingCuration(null);
        form.resetFields();
    };

    // 모달 확인 (추가/수정 처리)
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const newStatus = values.status ? 'Public' : 'Private'; // boolean 값을 문자열로 변환
                if (editingCuration) {
                    const updatedCurations = curations.map(c =>
                        c.key === editingCuration.key ? { ...editingCuration, ...values, status: newStatus, contents: c.contents || [] } : c
                    );
                    setCurations(updatedCurations);
                    message.success('큐레이션 정보가 수정되었습니다.');
                } else {
                    const newCuration = {
                        key: `cur_${Date.now()}`,
                        id: `CUR${String(Date.now()).slice(-4)}`,
                        ...values,
                        status: newStatus, // 변환된 상태 값 사용
                        creator: 'current_admin',
                        creationDate: moment().format('YYYY-MM-DD'),
                        contents: [], // 새 큐레이션 생성 시 빈 contents 배열 초기화
                    };
                    setCurations([...curations, newCuration]);
                    message.success('새 큐레이션이 추가되었습니다.');
                }
                handleCancel();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('입력 값을 확인해주세요.');
            });
    };

    // 삭제 처리
    const handleDelete = (key) => {
        setCurations(curations.filter(curation => curation.key !== key));
        message.success('큐레이션이 삭제되었습니다.');
    };

    // 콘텐츠 구성 모달 열기
    const showContentModal = (curation) => {
        setSelectedCurationForContent(curation);
        // 현재 큐레이션에 포함된 콘텐츠들의 key 배열을 targetKeys 초기값으로 설정
        const initialTargetKeys = curation.contents?.map(content => content.key) || [];
        setTargetKeys(initialTargetKeys);
        setSelectedContentType('book'); // 모달 열 때 기본 선택 유형
        setIsContentModalOpen(true);
    };

    // 콘텐츠 구성 모달 취소
    const handleContentModalCancel = () => {
        setIsContentModalOpen(false);
        setSelectedCurationForContent(null);
        setTargetKeys([]);
    };

    // 상세 정보 모달 열기 핸들러
    const handleShowItemDetail = (item) => {
        // TableTransfer에서 넘어온 item에는 이미 필요한 정보가 다 들어있다고 가정
        // 만약 부족하다면, getTransferDataSource() 전체 목록에서 key로 찾아야 할 수 있음.
        const fullItem = getTransferDataSource().find(i => i.key === item.key);
        setSelectedItemForDetail(fullItem || item); // 전체 목록에서 찾은 아이템 또는 전달된 아이템 사용
        setIsDetailModalOpen(true);
    };

    // 상세 정보 모달 닫기 핸들러
    const handleCloseItemDetail = () => {
        setIsDetailModalOpen(false);
        setSelectedItemForDetail(null);
    };

    // 콘텐츠 구성 모달 확인 (저장)
    const handleContentModalOk = () => {
        if (!selectedCurationForContent) return;

        const selectedContents = targetKeys.map(key => {
            // 먼저 allContentsData에서 찾아보고, 없으면 curations 리스트에서 찾음 (큐레이션 유형)
            let content = allContentsData.find(c => c.key === key);
            if (!content) {
                const curationContent = curations.find(c => c.key === key);
                if (curationContent) {
                    content = { 
                        key: curationContent.key, 
                        title: curationContent.title, 
                        type: 'curation', 
                        id: curationContent.id, 
                        creator: curationContent.creator,
                        thumbnail: curationContent.thumbnail || getRandomThumbnail() // 썸네일 추가 (fallback)
                    };
                }
            }
            // 일반 콘텐츠의 경우 모든 정보 저장하도록 확장 (기존 로직 유지)
            if (content && content.type !== 'curation') {
                 const fullContent = allContentsData.find(c => c.key === key);
                 if (fullContent) content = {...fullContent};
            } else if (content && content.type === 'curation') {
                // 이미 위에서 curation 타입에 필요한 정보를 구성했으므로 추가 작업 불필요
            } else {
                // 에러 처리 또는 기본값: 만약 키에 해당하는 콘텐츠를 못 찾은 경우
                console.warn(`Content with key ${key} not found in allContentsData or curations.`);
                return null; // 또는 적절한 기본 객체
            }
            return content;
        }).filter(Boolean); // null인 경우 필터링

        // curations 상태 업데이트
        setCurations(prevCurations =>
            prevCurations.map(curation =>
                curation.key === selectedCurationForContent.key
                    ? { ...curation, contents: selectedContents }
                    : curation
            )
        );
        message.success(`'${selectedCurationForContent.title}' 큐레이션의 콘텐츠 구성이 저장되었습니다.`);
        handleContentModalCancel(); // 모달 닫기
    };

    // Transfer 컴포넌트 변경 핸들러 (TableTransfer의 onChange)
    const handleTransferChange = (nextTargetKeys, direction, moveKeys) => {
        setTargetKeys(nextTargetKeys);
        console.log('targetKeys:', nextTargetKeys);
    };

    // Transfer dataSource에 사용될 전체 콘텐츠 목록 (자기 자신 제외)
    const getTransferDataSource = () => {
        const otherCurations = curations
            .filter(c => c.key !== selectedCurationForContent?.key)
            .map(c => ({ ...c, type: 'curation' })); // type 명시
        return [...allContentsData, ...otherCurations];
    };

    // 선택된 콘텐츠 유형에 따른 컬럼 가져오기 (왼쪽)
    const getCurrentLeftColumns = () => {
        switch (selectedContentType) {
            case 'book':
                return bookColumns;
            case 'audiobook':
                return audiobookColumns;
            case 'series':
                return seriesColumns;
            case 'curation':
                return curationColumns;
            default:
                return [];
        }
    };

    // 필터링된 큐레이션 데이터 계산
    const filteredCurations = curations.filter(curation => {
        // 1. 텍스트 검색 (큐레이션명, 생성자, 포함된 콘텐츠 제목, 포함된 콘텐츠 저자/읽은이)
        const searchMatch = !searchText || 
                            curation.title.toLowerCase().includes(searchText.toLowerCase()) ||
                            curation.creator.toLowerCase().includes(searchText.toLowerCase()) ||
                            (curation.contents && curation.contents.some(content => 
                                content.title.toLowerCase().includes(searchText.toLowerCase()) ||
                                (content.author && content.author.toLowerCase().includes(searchText.toLowerCase())) ||
                                (content.narrator && content.narrator.toLowerCase().includes(searchText.toLowerCase()))
                            ));

        // 2. 상태 필터
        const statusMatch = filterStatus === 'All' || curation.status === filterStatus;

        // 3. 콘텐츠 유형 필터
        const contentTypeMatch = filterContentType === 'all' || 
                                 curation.contents?.some(content => content.type === filterContentType);

        return searchMatch && statusMatch && contentTypeMatch;
    });

    // 테이블 컬럼 정의
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
        { title: '큐레이션명', dataIndex: 'title', key: 'title', width: 200, ellipsis: true },
        { title: '설명', dataIndex: 'description', key: 'description', width: 180, ellipsis: true },
        { 
            title: '콘텐츠 수', // '전자책 수'에서 '콘텐츠 수'로 변경
            dataIndex: 'contents', 
            key: 'contentCount', 
            width: 90, 
            align: 'center',
            render: (contents) => contents?.length || 0 
        },
        {
            title: '콘텐츠 유형',
            dataIndex: 'contents',
            key: 'contentTypes',
            width: 180,
            render: (contents) => {
                if (!contents || contents.length === 0) {
                    return '-';
                }
                const uniqueTypes = [...new Set(contents.map(content => content.type))];
                return (
                    <Space wrap size={[0, 8]}>
                        {uniqueTypes.map(type => (
                            <Tag key={type} color={contentTypeColorMap[type] || 'default'}>
                                {contentTypeKoreanMap[type] || type}
                            </Tag>
                        ))}
                    </Space>
                );
            },
        },
        { title: '연결 URL', dataIndex: 'connectionUrl', key: 'connectionUrl', width: 130, ellipsis: true },
        { title: '랜딩 URL', dataIndex: 'landingUrl', key: 'landingUrl', width: 130, ellipsis: true },
        { title: '등록자', dataIndex: 'creator', key: 'creator', width: 100 },
        { title: '등록일', dataIndex: 'creationDate', key: 'creationDate', width: 110, sorter: (a, b) => moment(a.creationDate).unix() - moment(b.creationDate).unix(), render: (date) => date ? moment(date).format('YYYY-MM-DD') : '-' },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            width: 100, 
            align: 'center',
            render: (status, record) => (
                <Switch
                    checked={status === 'Public'}
                    onChange={(checked) => handleStatusChange(record.key, checked)}
                    checkedChildren="공개"
                    unCheckedChildren="비공개"
                />
            ),
        },
        {
            title: '관리',
            key: 'action',
            width: 130,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="콘텐츠 구성">
                        <Button icon={<BookOutlined />} onClick={() => showContentModal(record)} size="small" />
                    </Tooltip>
                    <Tooltip title="수정">
                        <Button icon={<EditOutlined />} onClick={() => showModal(record)} size="small" />
                    </Tooltip>
                    <Tooltip title="삭제">
                        <Popconfirm
                            title={`'${record.title}' 큐레이션을 삭제하시겠습니까?`}
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

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><TagsOutlined /> 큐레이션 관리</Title>
            <Text>테마별 전자책 큐레이션을 생성하고 관리합니다.</Text>

            {/* 외부 필터 영역 */}
            <Space wrap style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                 <Input.Search 
                    placeholder="큐레이션명, 전자책 제목, 오디오북 제목, 시리즈명..." 
                    allowClear
                    onSearch={value => setSearchText(value)} // Enter 또는 검색 버튼 클릭 시
                    onChange={e => !e.target.value && setSearchText('')} // 입력 내용 지울 때 상태 초기화
                    style={{ width: 300 }}
                 />
                 <span style={{ marginLeft: 'auto' }}> {/* 새 큐레이션 버튼 오른쪽 정렬 */} 
                     <Button
                         type="primary"
                         icon={<PlusOutlined />}
                         onClick={() => showModal()}
                     >
                         새 큐레이션 추가
                     </Button>
                 </span>
             </Space>

            <Table
                columns={columns}
                dataSource={filteredCurations} // 필터링된 데이터 사용
                rowKey="key"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1300 }}
            />

            {/* 추가/수정 모달 */}
            <Modal
                title={editingCuration ? "큐레이션 수정" : "새 큐레이션 추가"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingCuration ? "수정" : "추가"}
                cancelText="취소"
                destroyOnClose
                width={1000}
            >
                <Form form={form} layout="vertical" name="curation_form">
                    <Form.Item
                        name="title"
                        label="큐레이션명"
                        rules={[{ required: true, message: '큐레이션명을 입력해주세요.' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="설명"
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        name="text1"
                        label="텍스트1"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="text2"
                        label="텍스트2"
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="connectionUrl"
                        label="연결 URL"
                    >
                        <Input placeholder="예: /curations/my-curation" />
                    </Form.Item>
                    <Form.Item
                        name="landingUrl"
                        label="랜딩 URL"
                    >
                        <Input placeholder="예: /events/special-offer" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="상태"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="공개" unCheckedChildren="비공개" />
                    </Form.Item>
                </Form>
            </Modal>

            {/* 콘텐츠 구성 모달 */}
            {selectedCurationForContent && (
                <Modal
                    title={`'${selectedCurationForContent.title}' 콘텐츠 구성`}
                    open={isContentModalOpen}
                    onOk={handleContentModalOk}
                    onCancel={handleContentModalCancel}
                    width={1400} // 너비 조정
                    okText="저장"
                    cancelText="취소"
                    destroyOnClose
                    bodyStyle={{ paddingTop: '24px' }}
                >
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Form layout="vertical">
                            <Form.Item label="콘텐츠 유형 선택" style={{ marginBottom: 16 }}>
                                <Select
                                    value={selectedContentType}
                                    onChange={(value) => setSelectedContentType(value)}
                                    style={{ width: 200 }}
                                >
                                    <Option value="book">전자책/전자책</Option>
                                    <Option value="audiobook">오디오북</Option>
                                    <Option value="series">시리즈</Option>
                                    <Option value="curation">큐레이션</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                        <TableTransfer
                            dataSource={getTransferDataSource()}
                            targetKeys={targetKeys}
                            onChange={handleTransferChange}
                            showSearch
                            filterOption={(inputValue, item) =>
                                item.title.toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ||
                                (item.author && item.author.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) ||
                                (item.narrator && item.narrator.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) ||
                                (item.creator && item.creator.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
                            }
                            leftColumns={getCurrentLeftColumns()}
                            rightColumns={selectedContentColumns}
                            요청된_selectedContentType={selectedContentType}
                            onItemViewDetail={handleShowItemDetail}
                        />
                    </Space>
                </Modal>
            )}

            {/* 아이템 상세 정보 모달 */}
            {selectedItemForDetail && (
                (() => {
                    // 포함된 큐레이션 목록 미리 계산
                    const containingCurations = curations.filter(curation => 
                        curation.contents?.some(content => content.key === selectedItemForDetail.key)
                    );
                    const containingCurationTitles = containingCurations.map(c => c.title);
                    
                    // 렌더링할 JSX 요소 생성
                    const containingCurationsList = containingCurationTitles.length > 0 ? (
                        <ul style={{ paddingLeft: '15px', marginBottom: 0, marginTop: '5px' }}>
                            {containingCurationTitles.map((title, index) => <li key={index}>{title}</li>)}
                        </ul>
                    ) : (
                        '-'
                    );

                    // Modal 및 내부 컴포넌트 반환
                    return (
                        <Modal
                            title={`${contentTypeKoreanMap[selectedItemForDetail.type] || '콘텐츠'} 상세 정보`}
                            open={isDetailModalOpen}
                            onCancel={handleCloseItemDetail}
                            footer={[
                                <Button key="close" onClick={handleCloseItemDetail}>
                                    닫기
                                </Button>
                            ]}
                            width={800}
                        >
                            <Descriptions bordered column={1} layout="horizontal">
                                <Descriptions.Item label="썸네일">
                                    <img 
                                        src={selectedItemForDetail.thumbnail || getRandomThumbnail()} 
                                        alt={selectedItemForDetail.title} 
                                        style={{ width: '100%', maxWidth: '300px', maxHeight: '300px', objectFit: 'contain' }}
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="제목">{selectedItemForDetail.title}</Descriptions.Item>
                                <Descriptions.Item label="유형">{contentTypeKoreanMap[selectedItemForDetail.type] || selectedItemForDetail.type}</Descriptions.Item>
                                
                                {selectedItemForDetail.type === 'book' && (
                                    <>
                                        <Descriptions.Item label="저자">{selectedItemForDetail.author}</Descriptions.Item>
                                        <Descriptions.Item label="출판사">{selectedItemForDetail.publisher}</Descriptions.Item>
                                        <Descriptions.Item label="카테고리">{selectedItemForDetail.category}</Descriptions.Item>
                                    </>
                                )}
                                {selectedItemForDetail.type === 'audiobook' && (
                                    <>
                                        <Descriptions.Item label="읽은이">{selectedItemForDetail.narrator}</Descriptions.Item>
                                        <Descriptions.Item label="재생 시간">{selectedItemForDetail.runningTime}</Descriptions.Item>
                                        <Descriptions.Item label="카테고리">{selectedItemForDetail.category}</Descriptions.Item>
                                    </>
                                )}
                                {selectedItemForDetail.type === 'series' && (
                                    <>
                                        <Descriptions.Item label="저자">{selectedItemForDetail.author}</Descriptions.Item>
                                        {selectedItemForDetail.description && <Descriptions.Item label="설명">{selectedItemForDetail.description}</Descriptions.Item>}
                                    </>
                                )}
                                {selectedItemForDetail.type === 'curation' && (
                                    <>
                                        <Descriptions.Item label="생성자">{selectedItemForDetail.creator}</Descriptions.Item>
                                        <Descriptions.Item label="설명">{selectedItemForDetail.description}</Descriptions.Item>
                                        <Descriptions.Item label="포함된 콘텐츠 수">{selectedItemForDetail.contents?.length || 0}개</Descriptions.Item>
                                    </>
                                )}
                                {/* 공통 설명 필드 (큐레이션이 아닌 경우) */}
                                {(selectedItemForDetail.type === 'book' || selectedItemForDetail.type === 'audiobook' || selectedItemForDetail.type === 'series') && selectedItemForDetail.description && (
                                    <Descriptions.Item label="설명">{selectedItemForDetail.description}</Descriptions.Item>
                                )}
                                {/* 포함된 큐레이션 목록 표시 */}
                                <Descriptions.Item label="포함된 큐레이션">
                                    {containingCurationsList} {/* 미리 계산된 JSX 변수 사용 */} 
                                </Descriptions.Item>
                            </Descriptions>
                        </Modal>
                    );
                })()
            )}
        </Space>
    );
};

export default CurationManagement; 