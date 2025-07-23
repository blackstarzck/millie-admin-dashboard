import {
  DeleteOutlined,
  DragOutlined,
  EditOutlined,
  PlusOutlined,
  SmileOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Popover,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Typography
} from "antd";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";

const { Title, Text } = Typography;
const { Option } = Select;

// 드래그 가능한 카드 컴포넌트
const SortableKeywordCard = ({
  keyword,
  rating,
  onEdit,
  onDelete,
  onToggleActive,
  getRatingColor,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: keyword.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        size="small"
        hoverable
        style={{
          borderRadius: "8px",
          height: "100%",
          cursor: "grab",
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space
            align="start"
            style={{ width: "100%", justifyContent: "space-between" }}
          >
            <Space align="start" style={{ flex: 1 }}>
              <Space {...attributes} {...listeners}>
                <DragOutlined style={{ color: "#999", fontSize: "12px" }} />
                <Text
                  strong
                  style={{
                    fontSize: "14px",
                    color: getRatingColor(rating),
                  }}
                >
                  {keyword.order}.
                </Text>
              </Space>
              <div style={{ flex: 1 }}>
                <Text
                  strong
                  style={{
                    fontSize: "16px",
                    display: "block",
                  }}
                >
                  <Space>
                    {keyword.emoji && (
                      <span style={{ fontSize: "20px" }}>{keyword.emoji}</span>
                    )}
                    <span>{keyword.keyword}</span>
                  </Space>
                </Text>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {keyword.description}
                </Text>
              </div>
            </Space>
            <Space>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(keyword);
                }}
              />
              <Popconfirm
                title="키워드를 삭제하시겠습니까?"
                onConfirm={(e) => {
                  e?.preventDefault();
                  e?.stopPropagation();
                  onDelete(keyword.id);
                }}
                okText="삭제"
                cancelText="취소"
              >
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </Popconfirm>
            </Space>
          </Space>
          <Space>
            <Switch
              size="small"
              checked={keyword.isActive}
              checkedChildren="활성"
              unCheckedChildren="비활성"
              onChange={(checked) => {
                onToggleActive(keyword.id);
              }}
            />
            <Text type="secondary" style={{ fontSize: "11px" }}>
              등록일: {new Date(keyword.createdAt).toLocaleDateString("ko-KR")}
            </Text>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

const ReviewKeywordManagement = () => {
  const [keywords, setKeywords] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [form] = Form.useForm();

  // 드래그 앤 드롭 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 앤 드롭 핸들러
  const handleDragEnd = (event, rating) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = keywords.findIndex((k) => k.id === active.id);
      const newIndex = keywords.findIndex((k) => k.id === over.id);

      const newKeywords = arrayMove(keywords, oldIndex, newIndex);

      // 같은 점수 내에서만 순서 변경
      const sameRatingKeywords = newKeywords.filter((k) => k.rating === rating);
      const updatedKeywords = newKeywords.map((keyword) => {
        if (keyword.rating === rating) {
          const orderIndex = sameRatingKeywords.findIndex(
            (k) => k.id === keyword.id
          );
          return { ...keyword, order: orderIndex + 1 };
        }
        return keyword;
      });

      setKeywords(updatedKeywords);
      message.success("키워드 순서가 변경되었습니다.");
    }
  };

  // 샘플 데이터 초기화
  useEffect(() => {
    const sampleData = [
      // 5점 키워드들
      {
        id: "5-1",
        rating: 5,
        order: 1,
        keyword: "스토리가 흥미로워요",
        emoji: "🤩",
        description: "이야기의 전개가 매우 흥미롭고 흡입력이 있습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-2",
        rating: 5,
        order: 2,
        keyword: "몰입감이 엄청나요",
        emoji: "😮",
        description: "책을 읽는 내내 다른 생각을 할 수 없을 정도로 몰입했습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-3",
        rating: 5,
        order: 3,
        keyword: "다시 읽고 싶어요",
        emoji: "🥰",
        description: "한 번으로는 부족해서 여러 번 다시 읽고 싶은 책입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-4",
        rating: 5,
        order: 4,
        keyword: "인사이트가 깊어요",
        emoji: "🧐",
        description: "새로운 관점과 깊이 있는 통찰을 얻을 수 있었습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-5",
        rating: 5,
        order: 5,
        keyword: "감동적이에요",
        emoji: "😭",
        description: "마음이 따뜻해지는 감동적인 이야기가 담겨 있습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-6",
        rating: 5,
        order: 6,
        keyword: "선물용으로도 좋을 듯해요",
        emoji: "🎁",
        description: "소중한 사람에게 선물하기 좋은 책입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-7",
        rating: 5,
        order: 7,
        keyword: "구성이 탄탄해요",
        emoji: "👍",
        description: "논리적이고 체계적인 구성이 돋보입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-8",
        rating: 5,
        order: 8,
        keyword: "토론용으로 좋아요",
        emoji: "🤔",
        description: "다양한 생각거리를 던져주어 토론하기 좋은 책입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-9",
        rating: 5,
        order: 9,
        keyword: "실무에 도움돼요",
        emoji: "💼",
        description: "업무에 바로 적용할 수 있는 유용한 지식을 얻었습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5-10",
        rating: 5,
        order: 10,
        keyword: "학생에게 추천해요",
        emoji: "🎓",
        description: "학생들의 시야를 넓혀줄 수 있는 좋은 책입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // 4점 키워드들
      {
        id: "4-1",
        rating: 4,
        order: 1,
        keyword: "유쾌하고 재밌어요",
        emoji: "😄",
        description: "가볍게 읽기 좋고, 유머가 넘치는 책입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-2",
        rating: 4,
        order: 2,
        keyword: "전개가 반전이에요",
        emoji: "😲",
        description: "예상치 못한 반전이 있어서 흥미진진했습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-3",
        rating: 4,
        order: 3,
        keyword: "문장이 매끄러워요",
        emoji: "✍️",
        description: "술술 읽히는 유려한 문체가 인상적입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-4",
        rating: 4,
        order: 4,
        keyword: "내용이 잘 정리되어 있어요",
        emoji: "📚",
        description: "복잡한 내용이 보기 쉽게 잘 정리되어 있습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-5",
        rating: 4,
        order: 5,
        keyword: "길이가 적당해요",
        emoji: "👌",
        description: "부담 없이 읽을 수 있는 적절한 분량입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-6",
        rating: 4,
        order: 6,
        keyword: "정보가 유익해요",
        emoji: "💡",
        description: "일상이나 업무에 도움이 되는 유익한 정보가 많습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-7",
        rating: 4,
        order: 7,
        keyword: "생각하게 만들어요",
        emoji: "🧠",
        description: "읽고 나서도 계속 생각하게 만드는 여운이 있습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-8",
        rating: 4,
        order: 8,
        keyword: "공감이 많이 돼요",
        emoji: "💖",
        description: "나의 이야기처럼 공감되는 부분이 많았습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-9",
        rating: 4,
        order: 9,
        keyword: "짧은 시간에 읽기 좋아요",
        emoji: "⏳",
        description: "자투리 시간에 가볍게 읽기 좋은 책입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4-10",
        rating: 4,
        order: 10,
        keyword: "삽화/디자인이 예뻐요",
        emoji: "🎨",
        description: "책의 내용과 잘 어울리는 아름다운 삽화와 디자인이 돋보입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // 3점 키워드들
      {
        id: "3-1",
        rating: 3,
        order: 1,
        keyword: "입문자에게 좋아요",
        emoji: "🔰",
        description: "해당 분야를 처음 접하는 사람들에게 추천할 만합니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-2",
        rating: 3,
        order: 2,
        keyword: "실무에 도움돼요",
        emoji: "💼",
        description: "업무 관련 지식을 쌓는 데 도움이 됩니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-3",
        rating: 3,
        order: 3,
        keyword: "학생에게 추천해요",
        emoji: "🎓",
        description: "관련 분야를 공부하는 학생들에게 유용합니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-4",
        rating: 3,
        order: 4,
        keyword: "구성이 탄탄해요",
        emoji: "👍",
        description: "전체적인 짜임새가 좋은 편입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-5",
        rating: 3,
        order: 5,
        keyword: "내용이 잘 정리되어 있어요",
        emoji: "📚",
        description: "정보가 체계적으로 정리되어 있어 이해하기 쉽습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-6",
        rating: 3,
        order: 6,
        keyword: "길이가 적당해요",
        emoji: "👌",
        description: "지루하지 않게 읽을 수 있는 분량입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-7",
        rating: 3,
        order: 7,
        keyword: "토론용으로 좋아요",
        emoji: "🤔",
        description: "이야기할 거리가 많아 토론용으로 적합합니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-8",
        rating: 3,
        order: 8,
        keyword: "정보가 유익해요",
        emoji: "💡",
        description: "알아두면 좋은 유용한 정보들을 얻을 수 있습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-9",
        rating: 3,
        order: 9,
        keyword: "공감이 많이 돼요",
        emoji: "💖",
        description: "감정적으로 공감되는 부분이 있습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3-10",
        rating: 3,
        order: 10,
        keyword: "짧은 시간에 읽기 좋아요",
        emoji: "⏳",
        description: "짧고 간결하여 금방 읽을 수 있습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // 2점 키워드들
      {
        id: "2-1",
        rating: 2,
        order: 1,
        keyword: "집중해서 읽어야 해요",
        emoji: "🙇",
        description: "내용이 다소 어려워 집중이 필요합니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-2",
        rating: 2,
        order: 2,
        keyword: "조금 지루했어요",
        emoji: "😑",
        description: "개인적으로는 다소 흥미가 떨어지는 부분이 있었습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-3",
        rating: 2,
        order: 3,
        keyword: "다시 읽고 싶어요",
        emoji: "🥰",
        description: "이해를 위해 다시 한번 읽어보고 싶은 책입니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-4",
        rating: 2,
        order: 4,
        keyword: "생각하게 만들어요",
        emoji: "🧠",
        description: "복잡한 생각을 하게 만드는 내용이 포함되어 있습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-5",
        rating: 2,
        order: 5,
        keyword: "구성이 탄탄해요",
        emoji: "👍",
        description: "구성 자체는 나쁘지 않았습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-6",
        rating: 2,
        order: 6,
        keyword: "문장이 매끄러워요",
        emoji: "✍️",
        description: "문장 자체는 잘 쓰여졌습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-7",
        rating: 2,
        order: 7,
        keyword: "유쾌하고 재밌어요",
        emoji: "😄",
        description: "일부 재미있는 부분이 있었습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-8",
        rating: 2,
        order: 8,
        keyword: "공감이 많이 돼요",
        emoji: "💖",
        description: "어느 정도 공감되는 내용이 있었습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-9",
        rating: 2,
        order: 9,
        keyword: "인사이트가 깊어요",
        emoji: "🧐",
        description: "생각해볼 만한 통찰을 제공합니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2-10",
        rating: 2,
        order: 10,
        keyword: "삽화/디자인이 예뻐요",
        emoji: "🎨",
        description: "디자인은 만족스러웠습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      // 1점 키워드들
      {
        id: "1-1",
        rating: 1,
        order: 1,
        keyword: "조금 지루했어요",
        emoji: "😑",
        description: "제 취향과는 맞지 않아 지루하게 느껴졌습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-2",
        rating: 1,
        order: 2,
        keyword: "집중해서 읽어야 해요",
        emoji: "🙇",
        description: "너무 어려워서 따라가기 힘들었습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-3",
        rating: 1,
        order: 3,
        keyword: "삽화/디자인이 예뻐요",
        emoji: "🎨",
        description: "내용보다는 디자인이 더 인상에 남습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-4",
        rating: 1,
        order: 4,
        keyword: "길이가 적당해요",
        emoji: "👌",
        description: "길이는 적당했지만 내용은 아쉬웠습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-5",
        rating: 1,
        order: 5,
        keyword: "입문자에게 좋아요",
        emoji: "🔰",
        description: "입문자가 보기에도 내용이 부실합니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-6",
        rating: 1,
        order: 6,
        keyword: "전개가 반전이에요",
        emoji: "😲",
        description: "반전이 너무 뜬금없게 느껴졌습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-7",
        rating: 1,
        order: 7,
        keyword: "인사이트가 깊어요",
        emoji: "🧐",
        description: "특별한 인사이트를 얻지 못했습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-8",
        rating: 1,
        order: 8,
        keyword: "토론용으로 좋아요",
        emoji: "🤔",
        description: "토론하기에는 내용이 부족합니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-9",
        rating: 1,
        order: 9,
        keyword: "선물용으로도 좋을 듯해요",
        emoji: "🎁",
        description: "선물하기에는 적절하지 않은 것 같습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "1-10",
        rating: 1,
        order: 10,
        keyword: "유쾌하고 재밌어요",
        emoji: "😄",
        description: "재미를 느끼기 어려웠습니다.",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setKeywords(sampleData);
  }, []);

  // 점수별 색상 매핑
  const getRatingColor = (rating) => {
    const colors = {
      1: "#ff4d4f",
      2: "#ff7a45",
      3: "#ffa940",
      4: "#52c41a",
      5: "#1890ff",
    };
    return colors[rating] || "#d9d9d9";
  };

  // 점수별 별표 렌더링
  const renderStars = (rating) => {
    return (
      <Space>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? (
              <StarFilled style={{ color: getRatingColor(rating) }} />
            ) : (
              <StarOutlined style={{ color: "#d9d9d9" }} />
            )}
          </span>
        ))}
      </Space>
    );
  };

  // 키워드 추가/수정
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.emoji = selectedEmoji;

      if (editingKeyword) {
        // 수정
        const updatedKeywords = keywords.map((k) =>
          k.id === editingKeyword.id
            ? { ...k, ...values, updatedAt: new Date().toISOString() }
            : k
        );
        setKeywords(updatedKeywords);
        message.success("키워드가 수정되었습니다.");
      } else {
        // 추가
        const newKeyword = {
          id: `${values.rating}-${Date.now()}`,
          ...values,
          order: keywords.filter((k) => k.rating === values.rating).length + 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setKeywords([...keywords, newKeyword]);
        message.success("키워드가 추가되었습니다.");
      }

      setIsModalVisible(false);
      setEditingKeyword(null);
      setSelectedEmoji(null);
      form.resetFields();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // 키워드 삭제
  const handleDelete = (id) => {
    const updatedKeywords = keywords.filter((k) => k.id !== id);
    setKeywords(updatedKeywords);
    message.success("키워드가 삭제되었습니다.");
  };

  // 키워드 활성화/비활성화
  const toggleActive = (id) => {
    const updatedKeywords = keywords.map((k) =>
      k.id === id
        ? { ...k, isActive: !k.isActive, updatedAt: new Date().toISOString() }
        : k
    );
    setKeywords(updatedKeywords);
    message.success("키워드 상태가 변경되었습니다.");
  };

  // 모달 열기
  const showModal = (keyword = null) => {
    setEditingKeyword(keyword);
    if (keyword) {
      form.setFieldsValue(keyword);
      setSelectedEmoji(keyword.emoji);
    } else {
      form.resetFields();
      setSelectedEmoji(null);
    }
    setIsModalVisible(true);
  };

  // 모달 닫기
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingKeyword(null);
    setSelectedEmoji(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "24px" }}
        >
          <Col>
            <Title level={2}>키워드 관리 (리뷰)</Title>
            <Text type="secondary">
              리뷰 점수별 키워드를 관리합니다. 각 점수별로 최대 10개의 키워드를
              등록할 수 있습니다.
            </Text>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
              size="medium"
            >
              키워드 추가
            </Button>
          </Col>
        </Row>

        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: "all",
              label: "전체 보기",
              children: (
                <Row gutter={[16, 16]}>
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const ratingKeywords = keywords
                      .filter((k) => k.rating === rating)
                      .sort((a, b) => a.order - b.order);

                    return (
                      <Col key={rating} span={24}>
                        <Card
                          size="small"
                          title={
                            <Space>
                              {renderStars(rating)}
                              <Text strong>{rating}점 키워드</Text>
                              <Badge
                                count={`${ratingKeywords.length}개`}
                                style={{
                                  backgroundColor: getRatingColor(rating),
                                }}
                              />
                            </Space>
                          }
                          style={{
                            borderLeft: `4px solid ${getRatingColor(rating)}`,
                            marginBottom: "8px",
                          }}
                        >
                          <Row gutter={[8, 8]}>
                            {ratingKeywords.map((keyword) => (
                              <Col key={keyword.id} span={12}>
                                <Card
                                  size="small"
                                  style={{
                                    borderRadius: "6px",
                                  }}
                                >
                                  <Space
                                    direction="vertical"
                                    style={{ width: "100%" }}
                                  >
                                    <Space>
                                      <Text strong style={{ fontSize: "14px" }}>
                                        {keyword.order}.
                                      </Text>
                                      <Text style={{ fontSize: "14px" }}>
                                        <Space>
                                          {keyword.emoji && (
                                            <span style={{ fontSize: "16px" }}>
                                              {keyword.emoji}
                                            </span>
                                          )}
                                          <span>{keyword.keyword}</span>
                                        </Space>
                                      </Text>
                                      <Switch
                                        size="small"
                                        checked={keyword.isActive}
                                        checkedChildren="활성"
                                        unCheckedChildren="비활성"
                                        onChange={() =>
                                          toggleActive(keyword.id)
                                        }
                                      />
                                    </Space>
                                    <Text
                                      type="secondary"
                                      style={{
                                        fontSize: "12px",
                                        marginLeft: "20px",
                                      }}
                                    >
                                      {keyword.description}
                                    </Text>
                                  </Space>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ),
            },
            ...[5, 4, 3, 2, 1].map((rating) => {
              const ratingKeywords = keywords
                .filter((k) => k.rating === rating)
                .sort((a, b) => a.order - b.order);

              return {
                key: rating.toString(),
                label: (
                  <Space>
                    {renderStars(rating)}
                    <span>{rating}점</span>
                  </Space>
                ),
                children: (
                  <div>
                    <Row
                      justify="space-between"
                      align="middle"
                      style={{ marginBottom: "16px" }}
                    >
                      <Col>
                        <Title level={4} style={{ margin: 0 }}>
                          {rating}점 리뷰 키워드
                        </Title>
                        <Text type="secondary">
                          {rating}점 리뷰에 사용되는 키워드들을 관리합니다.
                        </Text>
                      </Col>
                    </Row>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleDragEnd(event, rating)}
                    >
                      <SortableContext
                        items={ratingKeywords.map((k) => k.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <Row gutter={[12, 12]}>
                          {ratingKeywords.map((keyword) => (
                            <Col key={keyword.id} span={8}>
                              <SortableKeywordCard
                                keyword={keyword}
                                rating={rating}
                                onEdit={showModal}
                                onDelete={handleDelete}
                                onToggleActive={toggleActive}
                                getRatingColor={getRatingColor}
                              />
                            </Col>
                          ))}
                        </Row>
                      </SortableContext>
                    </DndContext>
                  </div>
                ),
              };
            }),
          ]}
        />
      </Card>

      <Modal
        title={editingKeyword ? "키워드 수정" : "키워드 추가"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        width={600}
        okText={editingKeyword ? "수정" : "추가"}
        cancelText="취소"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ rating: 5, isActive: true, emoji: null }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="점수"
                rules={[{ required: true, message: "점수를 선택해주세요" }]}
              >
                <Select placeholder="점수 선택">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Option key={rating} value={rating}>
                      <Space>
                        {renderStars(rating)}
                        <span>{rating}점</span>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isActive" label="상태">
                <Switch
                  checkedChildren="활성"
                  unCheckedChildren="비활성"
                  defaultChecked
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} align="bottom">
            <Col span={18}>
              <Form.Item
                name="keyword"
                label="키워드"
                rules={[
                  { required: true, message: "키워드를 입력해주세요" },
                  { max: 16, message: "키워드는 16자 이내로 입력해주세요" },
                ]}
              >
                <Input
                  showCount
                  maxLength={16}
                  placeholder="예: 재미있어요, 감동적이에요"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="이모지">
                <Popover
                  content={
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        setSelectedEmoji(emojiData.emoji);
                        form.setFieldsValue({ emoji: emojiData.emoji });
                      }}
                    />
                  }
                  trigger="click"
                >
                  <Button icon={<SmileOutlined />} style={{ width: "100%" }}>
                    {selectedEmoji || "선택"}
                  </Button>
                </Popover>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="설명"
            rules={[
              { required: true, message: "설명을 입력해주세요" },
              { max: 200, message: "설명은 200자 이내로 입력해주세요" },
            ]}
          >
            <Input.TextArea
              showCount
              maxLength={200}
              placeholder="키워드에 대한 설명을 입력해주세요"
              rows={3}
            />
          </Form.Item>
          <Form.Item name="emoji" noStyle>
            <Input type="hidden" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReviewKeywordManagement;
