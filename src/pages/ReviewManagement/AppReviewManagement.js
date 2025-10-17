import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  GoogleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  StarOutlined,
  SyncOutlined,
  WarningOutlined
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Popconfirm,
  Rate,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const { Title, Text } = Typography;
const { Search, TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 랜덤 API 상태 생성 함수
const getRandomApiStatus = () => {
  const statuses = ['active', 'modified', 'deleted'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// 랜덤 노출 여부 생성 함수
const getRandomExposure = () => Math.random() > 0.5;

// 가상 리뷰 데이터
const generateInitialReviews = () => {
  const reviews = [
    {
      key: '1',
      reviewId: 'REV001',
      source: 'google_store',
      userName: '김영희',
      userId: 'google_user_123',
      rating: 5,
      content: '정말 좋은 앱입니다. 도서가 다양하고 오디오북도 훌륭해요!',
      reviewDate: '2024-07-28 10:00:00',
      isExposed: true,
      exposedDate: '2024-07-28 10:30:00',
      adminComment: '긍정적 리뷰',
      createdBy: null,
      lastModifiedBy: 'admin_A',
      lastModifiedDate: '2024-07-28 10:30:00',
      apiStatus: getRandomApiStatus()
    },
    {
      key: '2',
      reviewId: 'REV002',
      source: 'manual',
      userName: '이철수',
      userId: null,
      rating: 4,
      content: '사용하기 편하고 좋아요. 다만 가끔 느려질 때가 있어요.',
      reviewDate: '2024-07-27 15:30:00',
      isExposed: false,
      exposedDate: null,
      adminComment: '관리자 직접 입력',
      createdBy: 'admin_B',
      lastModifiedBy: 'admin_B',
      lastModifiedDate: '2024-07-27 15:30:00',
      apiStatus: null
    },
    {
      key: '3',
      reviewId: 'REV003',
      source: 'google_store',
      userName: '박민수',
      userId: 'google_user_456',
      rating: 3,
      content: '평범합니다. 특별한 점은 없는 것 같아요.',
      reviewDate: '2024-07-26 09:00:00',
      isExposed: getRandomExposure(),
      exposedDate: null,
      adminComment: null,
      createdBy: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      apiStatus: getRandomApiStatus()
    },
    {
      key: '4',
      reviewId: 'REV004',
      source: 'google_store',
      userName: '최지은',
      userId: 'google_user_789',
      rating: 5,
      content: '최고의 독서 앱! 강추합니다!!',
      reviewDate: '2024-07-25 14:20:00',
      isExposed: true,
      exposedDate: '2024-07-25 14:30:00',
      adminComment: '우수 리뷰',
      createdBy: null,
      lastModifiedBy: 'admin_C',
      lastModifiedDate: '2024-07-25 14:30:00',
      apiStatus: getRandomApiStatus()
    },
    {
      key: '5',
      reviewId: 'REV005',
      source: 'manual',
      userName: '정다영',
      userId: null,
      rating: 5,
      content: '오디오북 기능이 정말 마음에 들어요. 출퇴근길에 듣기 좋습니다.',
      reviewDate: '2024-07-24 11:00:00',
      isExposed: true,
      exposedDate: '2024-07-24 11:05:00',
      adminComment: '관리자 작성 - 홍보용',
      createdBy: 'admin_A',
      lastModifiedBy: 'admin_A',
      lastModifiedDate: '2024-07-24 11:05:00',
      apiStatus: null
    },
    {
      key: '6',
      reviewId: 'REV006',
      source: 'google_store',
      userName: '홍길동',
      userId: 'google_user_999',
      rating: 5,
      content: '구글 스토어에서 삭제된 리뷰지만 노출 중이었던 리뷰입니다.',
      reviewDate: '2024-07-23 09:00:00',
      isExposed: true,
      exposedDate: '2024-07-23 09:30:00',
      adminComment: '우수 리뷰였으나 원본 삭제됨',
      createdBy: null,
      lastModifiedBy: 'admin_A',
      lastModifiedDate: '2024-07-23 09:30:00',
      apiStatus: getRandomApiStatus()
    },
    {
      key: '7',
      reviewId: 'REV007',
      source: 'google_store',
      userName: '강민준',
      userId: 'google_user_1001',
      rating: 4,
      content: '책을 읽기 좋은 앱입니다. UI가 깔끔해요.',
      reviewDate: '2024-07-22 16:00:00',
      isExposed: getRandomExposure(),
      exposedDate: null,
      adminComment: null,
      createdBy: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      apiStatus: getRandomApiStatus()
    },
    {
      key: '8',
      reviewId: 'REV008',
      source: 'google_store',
      userName: '윤서아',
      userId: 'google_user_1002',
      rating: 5,
      content: '매일 사용하는 필수 앱이에요! 독서가 즐거워졌습니다.',
      reviewDate: '2024-07-21 13:20:00',
      isExposed: getRandomExposure(),
      exposedDate: null,
      adminComment: null,
      createdBy: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      apiStatus: getRandomApiStatus()
    },
    {
      key: '9',
      reviewId: 'REV009',
      source: 'manual',
      userName: '김태희',
      userId: null,
      rating: 5,
      content: '베스트셀러부터 신간까지! 밀리의 서재 최고입니다.',
      reviewDate: '2024-07-20 10:00:00',
      isExposed: true,
      exposedDate: '2024-07-20 10:05:00',
      adminComment: '홍보용 리뷰',
      createdBy: 'admin_C',
      lastModifiedBy: 'admin_C',
      lastModifiedDate: '2024-07-20 10:05:00',
      apiStatus: null
    },
    {
      key: '10',
      reviewId: 'REV010',
      source: 'google_store',
      userName: '이준호',
      userId: 'google_user_1003',
      rating: 2,
      content: '가끔 앱이 느려지는 현상이 있어요. 개선이 필요합니다.',
      reviewDate: '2024-07-19 18:30:00',
      isExposed: getRandomExposure(),
      exposedDate: null,
      adminComment: null,
      createdBy: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      apiStatus: getRandomApiStatus()
    },
    {
      key: '11',
      reviewId: 'REV011',
      source: 'google_store',
      userName: '박지원',
      userId: 'google_user_1004',
      rating: 5,
      content: '오디오북 기능 덕분에 운동하면서 책을 듣고 있어요!',
      reviewDate: '2024-07-18 07:45:00',
      isExposed: getRandomExposure(),
      exposedDate: null,
      adminComment: null,
      createdBy: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      apiStatus: getRandomApiStatus()
    },
    {
      key: '12',
      reviewId: 'REV012',
      source: 'google_store',
      userName: '조현우',
      userId: 'google_user_1005',
      rating: 4,
      content: '도서 검색 기능이 편리합니다. 추천 알고리즘도 괜찮아요.',
      reviewDate: '2024-07-17 14:15:00',
      isExposed: getRandomExposure(),
      exposedDate: null,
      adminComment: null,
      createdBy: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      apiStatus: getRandomApiStatus()
    },
    {
      key: '13',
      reviewId: 'REV013',
      source: 'google_store',
      userName: '한수지',
      userId: 'google_user_1006',
      rating: 5,
      content: '구독 서비스 가성비가 정말 좋아요. 모든 책을 무제한으로!',
      reviewDate: '2024-07-16 11:30:00',
      isExposed: getRandomExposure(),
      exposedDate: null,
      adminComment: null,
      createdBy: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      apiStatus: getRandomApiStatus()
    },
    {
      key: '14',
      reviewId: 'REV014',
      source: 'manual',
      userName: '최영수',
      userId: null,
      rating: 5,
      content: '밀리의 서재 덕분에 독서량이 3배 늘었습니다!',
      reviewDate: '2024-07-15 09:20:00',
      isExposed: false,
      exposedDate: null,
      adminComment: '대기 중인 홍보 리뷰',
      createdBy: 'admin_A',
      lastModifiedBy: 'admin_A',
      lastModifiedDate: '2024-07-15 09:20:00',
      apiStatus: null
    },
    {
      key: '15',
      reviewId: 'REV015',
      source: 'google_store',
      userName: '송민호',
      userId: 'google_user_1007',
      rating: 3,
      content: '도서 종류는 많은데 찾고 싶은 책이 없을 때도 있어요.',
      reviewDate: '2024-07-14 17:00:00',
      isExposed: getRandomExposure(),
      exposedDate: null,
      adminComment: null,
      createdBy: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      apiStatus: getRandomApiStatus()
    }
  ];

  // 노출된 리뷰는 exposedDate 설정
  return reviews.map(review => ({
    ...review,
    exposedDate: review.isExposed && !review.exposedDate
      ? review.reviewDate
      : review.exposedDate
  }));
};

const initialReviews = generateInitialReviews();

const AppReviewManagement = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [isSyncLoading, setIsSyncLoading] = useState(false);

  const [editForm] = Form.useForm();
  const [createForm] = Form.useForm();

  // 필터 상태
  const [filterSource, setFilterSource] = useState(null);
  const [filterExposed, setFilterExposed] = useState(null);
  const [searchText, setSearchText] = useState('');

  // 구글 스토어 API 리뷰 불러오기
  const handleSyncGoogleReviews = async () => {
    setIsSyncLoading(true);
    try {
      // TODO: 실제 구글 스토어 API 연동
      // const response = await fetch('/api/google-play-reviews');
      // const data = await response.json();

      // 시뮬레이션용 딜레이
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 가상 데이터 추가 (실제로는 API 응답 데이터 사용)
      const newReviews = [
        {
          key: `new_${Date.now()}`,
          reviewId: `REV${String(reviews.length + 1).padStart(3, '0')}`,
          source: 'google_store',
          userName: '새로운 사용자',
          userId: `google_user_${Date.now()}`,
          rating: 4,
          content: '구글 스토어에서 가져온 새로운 리뷰입니다.',
          reviewDate: moment().format('YYYY-MM-DD HH:mm:ss'),
          isExposed: false,
          exposedDate: null,
          adminComment: null,
          createdBy: null,
          lastModifiedBy: null,
          lastModifiedDate: null,
          apiStatus: 'active' // 새로 가져온 리뷰는 정상 상태
        }
      ];

      setReviews(prev => [...newReviews, ...prev]);
      message.success(`구글 스토어에서 ${newReviews.length}개의 새로운 리뷰를 가져왔습니다.`);
    } catch (error) {
      console.error('리뷰 동기화 오류:', error);
      message.error('구글 스토어 리뷰 불러오기에 실패했습니다.');
    } finally {
      setIsSyncLoading(false);
    }
  };

  // 리뷰 생성
  const handleCreateReview = async () => {
    try {
      const values = await createForm.validateFields();

      const newReview = {
        key: `manual_${Date.now()}`,
        reviewId: `REV${String(reviews.length + 1).padStart(3, '0')}`,
        source: 'manual',
        userName: values.userName,
        userId: null,
        rating: values.rating,
        content: values.content,
        reviewDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        isExposed: values.isExposed || false,
        exposedDate: values.isExposed ? moment().format('YYYY-MM-DD HH:mm:ss') : null,
        adminComment: values.adminComment || '관리자 직접 입력',
        createdBy: 'current_admin', // 실제로는 로그인한 관리자 ID
        lastModifiedBy: 'current_admin',
        lastModifiedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        apiStatus: null // 관리자 입력 리뷰는 null
      };

      setReviews(prev => [newReview, ...prev]);
      message.success('리뷰가 성공적으로 등록되었습니다.');
      setIsCreateModalVisible(false);
      createForm.resetFields();
    } catch (error) {
      console.error('리뷰 생성 오류:', error);
      message.error('입력 값을 확인해주세요.');
    }
  };

  // 리뷰 수정
  const handleEditReview = async () => {
    try {
      const values = await editForm.validateFields();

      setReviews(prev => prev.map(review =>
        review.key === selectedReview.key
          ? {
              ...review,
              userName: values.userName,
              rating: values.rating,
              content: values.content,
              isExposed: values.isExposed,
              exposedDate: values.isExposed && !review.exposedDate
                ? moment().format('YYYY-MM-DD HH:mm:ss')
                : (!values.isExposed ? null : review.exposedDate),
              adminComment: values.adminComment,
              lastModifiedBy: 'current_admin',
              lastModifiedDate: moment().format('YYYY-MM-DD HH:mm:ss')
            }
          : review
      ));

      message.success('리뷰가 수정되었습니다.');
      setIsEditModalVisible(false);
      setSelectedReview(null);
      editForm.resetFields();
    } catch (error) {
      console.error('리뷰 수정 오류:', error);
      message.error('입력 값을 확인해주세요.');
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = (review) => {
    setReviews(prev => prev.filter(r => r.key !== review.key));
    message.success('리뷰가 삭제되었습니다.');
  };

  // 노출 토글
  const handleToggleExposure = (review) => {
    setReviews(prev => prev.map(r =>
      r.key === review.key
        ? {
            ...r,
            isExposed: !r.isExposed,
            exposedDate: !r.isExposed ? moment().format('YYYY-MM-DD HH:mm:ss') : null,
            lastModifiedBy: 'current_admin',
            lastModifiedDate: moment().format('YYYY-MM-DD HH:mm:ss')
          }
        : r
    ));
    message.success(`리뷰가 ${!review.isExposed ? '노출' : '미노출'} 처리되었습니다.`);
  };

  // 편집 모달 열기
  const openEditModal = (review) => {
    setSelectedReview(review);
    editForm.setFieldsValue({
      userName: review.userName,
      rating: review.rating,
      content: review.content,
      isExposed: review.isExposed,
      adminComment: review.adminComment
    });
    setIsEditModalVisible(true);
  };

  // 테이블 컬럼 정의
  const columns = [
    {
      title: '리뷰 ID',
      dataIndex: 'reviewId',
      key: 'reviewId',
      width: 100,
      fixed: 'left'
    },
    {
      title: '출처',
      dataIndex: 'source',
      key: 'source',
      width: 120,
      render: (source) => (
        <Space size={4}>
          {source === 'google_store' ? (
            <>
              <GoogleOutlined style={{ color: '#1890ff' }} />
              <Text>구글 스토어</Text>
            </>
          ) : (
            <>
              <EditOutlined/>
              <Text>관리자 입력</Text>
            </>
          )}
        </Space>
      ),
      filters: [
        { text: '구글 스토어', value: 'google_store' },
        { text: '관리자 입력', value: 'manual' }
      ],
      onFilter: (value, record) => record.source === value
    },
    {
      title: 'API 상태',
      dataIndex: 'apiStatus',
      key: 'apiStatus',
      width: 120,
      align: 'center',
      render: (apiStatus, record) => {
        // 관리자 입력 리뷰는 아무것도 표시 안 함
        if (record.source === 'manual' || !apiStatus) {
          return '-';
        }

        // API 리뷰의 상태 표시
        if (apiStatus === 'active') {
          return <Tag color="success">정상</Tag>;
        } else if (apiStatus === 'modified') {
          return (
            <Tooltip title="원본 리뷰가 구글 스토어에서 수정되었습니다">
              <Tag icon={<ExclamationCircleOutlined />} color="warning">원본 수정됨</Tag>
            </Tooltip>
          );
        } else if (apiStatus === 'deleted') {
          return (
            <Tooltip title="원본 리뷰가 구글 스토어에서 삭제되었습니다">
              <Tag icon={<WarningOutlined />} color="error">원본 삭제됨</Tag>
            </Tooltip>
          );
        }
        return '-';
      },
      filters: [
        { text: '정상', value: 'active' },
        { text: '원본 수정됨', value: 'modified' },
        { text: '원본 삭제됨', value: 'deleted' }
      ],
      onFilter: (value, record) => record.apiStatus === value
    },
    {
      title: '작성자',
      dataIndex: 'userName',
      key: 'userName',
      width: 120
    },
    {
      title: '평점',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: 16 }} />,
      sorter: (a, b) => a.rating - b.rating
    },
    {
      title: '리뷰 내용',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      ellipsis: {
        showTitle: false
      },
      render: (content) => (
        <Tooltip placement="topLeft" title={content}>
          {content}
        </Tooltip>
      )
    },
    {
      title: '작성일',
      dataIndex: 'reviewDate',
      key: 'reviewDate',
      width: 160,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => moment(a.reviewDate).unix() - moment(b.reviewDate).unix()
    },
    {
      title: '노출 상태',
      dataIndex: 'isExposed',
      key: 'isExposed',
      width: 100,
      align: 'center',
      render: (isExposed, record) => (
        <Switch
          checked={isExposed}
          checkedChildren="노출"
          unCheckedChildren="미노출"
          onChange={() => handleToggleExposure(record)}
          onClick={(checked, e) => e.stopPropagation()}
        />
      ),
      filters: [
        { text: '노출', value: true },
        { text: '미노출', value: false }
      ],
      onFilter: (value, record) => record.isExposed === value
    },
    {
      title: '노출 시작일',
      dataIndex: 'exposedDate',
      key: 'exposedDate',
      width: 160,
      render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm') : '-'
    },
    {
      title: '관리자 메모',
      dataIndex: 'adminComment',
      key: 'adminComment',
      width: 150,
      ellipsis: {
        showTitle: false
      },
      render: (comment) => comment ? (
        <Tooltip placement="topLeft" title={comment}>
          {comment}
        </Tooltip>
      ) : '-'
    },
    {
      title: '관리',
      key: 'action',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (text, record) => {
        // 관리자 입력 리뷰만 수정/삭제 가능
        if (record.source !== 'manual') {
          return (
            <Tooltip title="구글 스토어 리뷰는 수정/삭제할 수 없습니다">
              <Button type="text" icon={<EllipsisOutlined />} disabled />
            </Tooltip>
          );
        }

        const menu = (
           <Menu onClick={({ key, domEvent }) => {
             domEvent.stopPropagation();
             if (key === 'edit') openEditModal(record);
           }}>
             <Menu.Item key="edit" icon={<EditOutlined />}>수정</Menu.Item>
             <Menu.Item key="delete" onClick={(e) => e.domEvent.stopPropagation()}>
               <Popconfirm
                 title="리뷰를 삭제하시겠습니까?"
                 description="삭제된 리뷰는 복구할 수 없습니다."
                 onConfirm={(e) => {
                   e.stopPropagation();
                   handleDeleteReview(record);
                 }}
                 onCancel={(e) => e.stopPropagation()}
                 okText="삭제"
                 cancelText="취소"
                 okButtonProps={{ danger: true }}
               >
                 <span style={{ color: '#ff4d4f' }}>
                   <DeleteOutlined /> 삭제
                 </span>
               </Popconfirm>
             </Menu.Item>
           </Menu>
        );

        return (
          <Dropdown overlay={menu} trigger={['click']} onClick={(e) => e.stopPropagation()}>
            <Button type="text" icon={<EllipsisOutlined />} onClick={(e) => e.stopPropagation()} />
          </Dropdown>
        );
      }
    }
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>
          <StarOutlined /> 앱 리뷰 관리
        </Title>
        <Text type="secondary">
          구글 스토어 리뷰를 불러오거나 관리자가 직접 리뷰를 등록하고 노출 여부를 관리합니다.
        </Text>
      </div>

      {/* 안내 카드 */}
      <Card size="small" style={{ backgroundColor: '#f6f8fa', border: '1px solid #e1e4e8' }}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong><InfoCircleOutlined /> 리뷰 출처 안내</Text>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>
              <Tag icon={<GoogleOutlined />} color="blue">구글 스토어</Tag>
              <Text type="secondary">: 구글 플레이 스토어 API를 통해 가져온 실제 사용자 리뷰</Text>
            </li>
            <li style={{ marginTop: '4px' }}>
              <Tag icon={<EditOutlined />} color="">관리자 입력</Tag>
              <Text type="secondary">: 관리자가 직접 작성하여 등록한 리뷰 (홍보용 등)</Text>
            </li>
          </ul>

          <Text strong><InfoCircleOutlined /> API 상태 안내 (구글 스토어 리뷰만 해당)</Text>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>
              <Tag color="success">정상</Tag>
              <Text type="secondary">: 구글 스토어에 원본 리뷰가 정상적으로 존재</Text>
            </li>
            <li style={{ marginTop: '4px' }}>
              <Tag icon={<ExclamationCircleOutlined />} color="warning">원본 수정됨</Tag>
              <Text type="secondary">: 구글 스토어에서 사용자가 리뷰를 수정했으나, 기존 노출 중인 리뷰는 유지됨</Text>
            </li>
            <li style={{ marginTop: '4px' }}>
              <Tag icon={<WarningOutlined />} color="error">원본 삭제됨</Tag>
              <Text type="secondary">: 구글 스토어에서 사용자가 리뷰를 삭제했으나, 기존 노출 중인 리뷰는 유지됨</Text>
            </li>
          </ul>

          <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
            ※ 노출 중인 리뷰는 원본이 수정/삭제되어도 자동으로 삭제되지 않습니다.
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
            ※ 구글 스토어 리뷰는 수정/삭제할 수 없으며, 노출 상태만 변경할 수 있습니다.
          </Text>
          <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px', display: 'block' }}>
            ※ 관리자가 직접 입력한 리뷰만 수정 및 삭제가 가능합니다.
          </Text>
        </Space>
      </Card>

      <Divider style={{ margin: '12px 0 8px 0' }} />


        {/* 검색 및 액션 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          {/* 검색 및 필터 */}
          <Space wrap>
            <Search
              placeholder="리뷰 내용, 작성자 검색"
              style={{ width: 300 }}
              onSearch={(value) => setSearchText(value)}
              allowClear
            />
            <Select
              placeholder="출처 필터"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilterSource(value)}
            >
              <Option value="google_store">구글 스토어</Option>
              <Option value="manual">관리자 입력</Option>
            </Select>
            <Select
              placeholder="노출 상태"
              style={{ width: 150 }}
              allowClear
              onChange={(value) => setFilterExposed(value)}
            >
              <Option value={true}>노출</Option>
              <Option value={false}>미노출</Option>
            </Select>
          </Space>

          {/* 액션 버튼 */}
          <Space wrap>
            <Button
              type="primary"
              icon={<SyncOutlined spin={isSyncLoading} />}
              onClick={handleSyncGoogleReviews}
              loading={isSyncLoading}
            >
              구글 스토어 리뷰 불러오기
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
            >
              리뷰 직접 등록
            </Button>
          </Space>
        </div>

        {/* 리뷰 테이블 */}
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey="key"
          loading={isTableLoading}
          scroll={{ x: 1500 }}
           pagination={{
             pageSize: 10,
             showSizeChanger: true,
             showTotal: (total) => `총 ${total}개 리뷰`
           }}
         />

      {/* 리뷰 수정 모달 */}
      {selectedReview && (
        <Modal
          title={`리뷰 수정 (${selectedReview.reviewId})`}
          open={isEditModalVisible}
          onOk={handleEditReview}
          onCancel={() => {
            setIsEditModalVisible(false);
            setSelectedReview(null);
            editForm.resetFields();
          }}
          width={600}
          okText="수정"
          cancelText="취소"
          footer={[
            <Popconfirm
              key="delete"
              title="리뷰를 삭제하시겠습니까?"
              description="삭제된 리뷰는 복구할 수 없습니다."
              onConfirm={() => {
                handleDeleteReview(selectedReview);
                setIsEditModalVisible(false);
                setSelectedReview(null);
                editForm.resetFields();
              }}
              okText="삭제"
              cancelText="취소"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                style={{ float: 'left' }}
              >
                삭제
              </Button>
            </Popconfirm>,
            <Button
              key="cancel"
              onClick={() => {
                setIsEditModalVisible(false);
                setSelectedReview(null);
                editForm.resetFields();
              }}
            >
              취소
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleEditReview}
            >
              수정
            </Button>
          ]}
        >
          <Form form={editForm} layout="vertical">
            <Form.Item
              name="userName"
              label="작성자 이름"
              rules={[{ required: true, message: '작성자 이름을 입력해주세요!' }]}
            >
              <Input placeholder="작성자 이름" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="평점"
              rules={[{ required: true, message: '평점을 선택해주세요!' }]}
            >
              <Rate />
            </Form.Item>

            <Form.Item
              name="content"
              label="리뷰 내용"
              rules={[{ required: true, message: '리뷰 내용을 입력해주세요!' }]}
            >
              <TextArea rows={4} placeholder="리뷰 내용을 입력하세요" />
            </Form.Item>

            <Form.Item
              name="adminComment"
              label="관리자 메모"
            >
              <TextArea rows={2} placeholder="관리자 메모 (선택사항)" />
            </Form.Item>

            <Form.Item
              name="isExposed"
              label="노출 설정"
              valuePropName="checked"
            >
              <Switch checkedChildren="노출" unCheckedChildren="미노출" />
            </Form.Item>
          </Form>
        </Modal>
      )}

      {/* 리뷰 생성 모달 */}
      <Modal
        title="새 리뷰 등록"
        open={isCreateModalVisible}
        onOk={handleCreateReview}
        onCancel={() => {
          setIsCreateModalVisible(false);
          createForm.resetFields();
        }}
        width={600}
        okText="등록"
        cancelText="취소"
      >
        <Form form={createForm} layout="vertical">
          <Form.Item
            name="userName"
            label="작성자 이름"
            rules={[{ required: true, message: '작성자 이름을 입력해주세요!' }]}
          >
            <Input placeholder="작성자 이름" />
          </Form.Item>

          <Form.Item
            name="rating"
            label="평점"
            rules={[{ required: true, message: '평점을 선택해주세요!' }]}
            initialValue={5}
          >
            <Rate />
          </Form.Item>

          <Form.Item
            name="content"
            label="리뷰 내용"
            rules={[{ required: true, message: '리뷰 내용을 입력해주세요!' }]}
          >
            <TextArea rows={4} placeholder="리뷰 내용을 입력하세요" />
          </Form.Item>

          <Form.Item
            name="adminComment"
            label="관리자 메모"
          >
            <TextArea rows={2} placeholder="관리자 메모 (선택사항)" />
          </Form.Item>

          <Form.Item
            name="isExposed"
            label="노출 설정"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch checkedChildren="노출" unCheckedChildren="미노출" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default AppReviewManagement;
