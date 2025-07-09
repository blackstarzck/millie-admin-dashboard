import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Flex, Select, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

// Draggable Row Component
const DraggableRow = ({ children, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { zIndex: 1, position: 'relative' } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if (child.key === 'sort') {
          return React.cloneElement(child, {
            children: (
              <div style={{ cursor: 'grab' }} {...listeners}>
                 <MenuOutlined />
              </div>
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const bookCategories = [
  '도슨트북', '오브제북', '오디오북', '챗북', '밀리 오리지널',
  '독립출판', '디즈니', '빨간펜 동화', '매거진', '만화', '소설',
  '세계문학전집', '경제경영', '자기계발', 'IT', '외국어', '에세이/시',
  '여행', '라이프스타일', '부모', '어린이', '청소년', '인문', '철학',
  '사회', '과학', '역사', '종교', '로맨스/BL', '판타지/무협'
];

// Mock data generation
const mockBooks = {};
let bookIdCounter = 1;
bookCategories.forEach(category => {
  mockBooks[category] = Array.from({ length: 20 }).map((_, i) => {
    const previewCount = Math.floor(Math.random() * 500) + 50;
    const downloadCount = Math.floor(Math.random() * 300) + 20;

    const previewChange = Math.floor(Math.random() * 50) - 25;
    const downloadChange = Math.floor(Math.random() * 30) - 15;

    const previousPreviewCount = Math.max(0, previewCount - previewChange);
    const previousDownloadCount = Math.max(0, downloadCount - downloadChange);

    const totalScore = previewCount + downloadCount;
    const previousTotalScore = previousPreviewCount + previousDownloadCount;

    return {
      id: bookIdCounter++,
      key: (bookIdCounter - 1).toString(),
      title: `${category} 도서 ${i + 1}`,
      author: `저자 ${bookIdCounter % 15 + 1}`,
      previewCount,
      downloadCount,
      totalScore,
      previousPreviewCount,
      previousDownloadCount,
      previousTotalScore,
    };
  });
});

const BookRankingManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('소설');
  const [dataSource, setDataSource] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [leftSelectedKeys, setLeftSelectedKeys] = useState([]);

  useEffect(() => {
    const books = mockBooks[selectedCategory] || [];
    const sortedBooks = [...books]
      .sort((a, b) => b.totalScore - a.totalScore);

    setDataSource(sortedBooks);
    setLeftSelectedKeys([]);

    const shuffled = [...sortedBooks].sort(() => 0.5 - Math.random());
    const initialTargetKeys = shuffled.slice(0, 5).map(book => book.key);
    setTargetKeys(initialTargetKeys);
  }, [selectedCategory]);

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setTargetKeys((previousKeys) => {
        const oldIndex = previousKeys.indexOf(active.id);
        const newIndex = previousKeys.indexOf(over.id);
        return arrayMove(previousKeys, oldIndex, newIndex);
      });
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const moveRight = () => {
    const newTargetKeys = [...targetKeys, ...leftSelectedKeys];
    setTargetKeys(newTargetKeys);
    setLeftSelectedKeys([]);
  };

  const moveLeft = (keyToRemove) => {
    setTargetKeys(targetKeys.filter(key => key !== keyToRemove));
  };

  const leftTableDataSource = dataSource.filter(item => !targetKeys.includes(item.key));
  const rightTableDataSource = targetKeys.map(key => dataSource.find(item => item.key === key)).filter(Boolean);

  const baseColumns = [
    { dataIndex: 'title', title: '제목' },
    {
      dataIndex: 'previewCount',
      title: '조회수',
      sorter: (a, b) => a.previewCount - b.previewCount,
      render: (text, record) => {
        const diff = record.previewCount - record.previousPreviewCount;
        let diffElement = null;
        if (diff > 0) {
          diffElement = <span style={{ color: 'green', marginLeft: 8 }}>(+{diff})</span>;
        } else if (diff < 0) {
          diffElement = <span style={{ color: 'red', marginLeft: 8 }}>({diff})</span>;
        }
        return (
          <Flex align="center">
            <span>{text}</span>
            {diffElement}
          </Flex>
        );
      },
    },
    {
      dataIndex: 'downloadCount',
      title: '다운로드수',
      sorter: (a, b) => a.downloadCount - b.downloadCount,
      render: (text, record) => {
        const diff = record.downloadCount - record.previousDownloadCount;
        let diffElement = null;
        if (diff > 0) {
          diffElement = <span style={{ color: 'green', marginLeft: 8 }}>(+{diff})</span>;
        } else if (diff < 0) {
          diffElement = <span style={{ color: 'red', marginLeft: 8 }}>({diff})</span>;
        }
        return (
          <Flex align="center">
            <span>{text}</span>
            {diffElement}
          </Flex>
        );
      },
    },
    {
      dataIndex: 'totalScore',
      title: '총점',
      sorter: (a, b) => a.totalScore - a.totalScore,
      render: (text, record) => {
        const diff = record.totalScore - record.previousTotalScore;
        let diffElement = null;

        if (diff > 0) {
          diffElement = <span style={{ color: 'green', marginLeft: 8 }}>(+{diff})</span>;
        } else if (diff < 0) {
          diffElement = <span style={{ color: 'red', marginLeft: 8 }}>({diff})</span>;
        }

        return (
          <Flex align="center">
            <span>{text}</span>
            {diffElement}
          </Flex>
        );
      },
    },
  ];

  const leftColumns = [
    {
      title: '랭킹',
      key: 'rank',
      render: (text, record, index) => index + 1,
      width: 60,
    },
    ...baseColumns,
  ];

  const rightColumns = [
    { key: 'sort', width: 60 },
    {
      title: '순서',
      key: 'rank',
      render: (text, record, index) => index + 1,
      width: 60,
    },
    ...baseColumns,
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <Button size="small" onClick={() => moveLeft(record.key)}>삭제</Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>도서 랭킹 관리</h2>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 20 }}>
        이른 아침 데이터 부족으로 모든 도서가 "하락"으로 보이는 문제를 해결하기 위해, 최근 24시간 데이터를 비교합니다.
        <br />
        예: 2025-07-09 18:35 KST의 랭킹을 2025-07-08 18:35 KST ~ 2025-07-09 18:35 KST 데이터와 비교.
      </Typography.Paragraph>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-select" style={{ marginRight: '10px' }}>카테고리 선택:</label>
        <Select id="category-select" value={selectedCategory} onChange={handleCategoryChange} style={{ width: 200 }}>
          {bookCategories.map(category => (
            <Select.Option key={category} value={category}>{category}</Select.Option>
          ))}
        </Select>
      </div>

      <Flex justify="space-between" align="flex-start" gap="large">
        <div style={{ flex: 1 }}>
          <h3>자동 랭킹</h3>
          <Table
            rowSelection={{
              selectedRowKeys: leftSelectedKeys,
              onChange: (keys) => setLeftSelectedKeys(keys),
            }}
            columns={leftColumns}
            dataSource={leftTableDataSource}
            size="small"
            pagination={{ pageSize: 10 }}
          />
        </div>

        <Flex vertical gap="small" align="center" justify="center" style={{ flexShrink: 0, marginTop: '100px' }}>
            <Button onClick={moveRight} disabled={leftSelectedKeys.length === 0}>
              추가 &gt;
            </Button>
        </Flex>

        <div style={{ flex: 1 }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                <h3>사용자 노출 랭킹</h3>
                <Button onClick={() => {
                    const rightSideItems = targetKeys.map(key => dataSource.find(item => item.key === key)).filter(Boolean);
                    const sortedKeys = rightSideItems.sort((a, b) => b.totalScore - a.totalScore).map(item => item.key);
                    setTargetKeys(sortedKeys);
                }}>총점 순으로 정렬</Button>
            </Flex>
          <DndContext onDragEnd={onDragEnd}>
            <SortableContext items={targetKeys} strategy={verticalListSortingStrategy}>
              <Table
                dataSource={rightTableDataSource}
                columns={rightColumns}
                rowKey="key"
                components={{
                  body: {
                    row: DraggableRow,
                  },
                }}
                pagination={false}
                size="small"
              />
            </SortableContext>
          </DndContext>
        </div>
      </Flex>
    </div>
  );
};

export default BookRankingManagement;
