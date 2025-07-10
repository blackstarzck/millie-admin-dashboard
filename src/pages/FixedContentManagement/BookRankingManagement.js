import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Flex, Input, message, Modal, Popconfirm, Select, Table, Tooltip, Typography } from 'antd';
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

const allBooks = Object.values(mockBooks).flat();

const BookRankingManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('소설');
  const [dataSource, setDataSource] = useState([]);
  const [rankings, setRankings] = useState(() => {
    const initialRankings = {};
    bookCategories.forEach(category => {
      const books = mockBooks[category] || [];
      const shuffled = [...books].sort(() => 0.5 - Math.random());
      initialRankings[category] = shuffled.slice(0, 5).map(book => book.key);
    });
    return initialRankings;
  });

  const targetKeys = rankings[selectedCategory] || [];

  const setTargetKeys = (updater) => {
    setRankings(prevRankings => {
      const currentKeys = prevRankings[selectedCategory] || [];
      const newKeys = typeof updater === 'function' ? updater(currentKeys) : updater;
      return {
        ...prevRankings,
        [selectedCategory]: newKeys,
      };
    });
  };

  const [leftSelectedKeys, setLeftSelectedKeys] = useState([]);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sortPreferences, setSortPreferences] = useState({
    previewCount: 'total',
    downloadCount: 'total',
    totalScore: 'total',
  });

  useEffect(() => {
    const books = mockBooks[selectedCategory] || [];
    const sortedBooks = [...books].sort((a, b) => b.totalScore - a.totalScore);
    setDataSource(sortedBooks);
    setLeftSelectedKeys([]);
  }, [selectedCategory]);

  const handleSortPreferenceChange = (key, value) => {
    setSortPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (!value) {
      setSearchResults([]);
      return;
    }
    const filteredBooks = allBooks.filter(book =>
      book.title.toLowerCase().includes(value.toLowerCase()) && !targetKeys.includes(book.key)
    );
    setSearchResults(filteredBooks);
  };

  const addBookFromSearch = (bookKey) => {
    if (targetKeys.length >= 12) {
      message.warning('노출 랭킹에는 최대 12개의 도서만 추가할 수 있습니다.');
      return;
    }
    if (targetKeys.includes(bookKey)) {
      message.warning('이미 노출 랭킹에 추가된 도서입니다.');
      return;
    }
    setTargetKeys(prevKeys => [...prevKeys, bookKey]);
    setSearchResults(prevResults => prevResults.filter(book => book.key !== bookKey));
    message.success('도서가 추가되었습니다.');
    setIsSearchModalVisible(false);
    setSearchQuery('');
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setTargetKeys((previousKeys) => {
        const oldIndex = previousKeys.indexOf(active.id);
        const newIndex = previousKeys.indexOf(over.id);
        return arrayMove(previousKeys, oldIndex, newIndex);
      });
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const moveRight = () => {
    if (targetKeys.length + leftSelectedKeys.length > 12) {
      message.warning('노출 랭킹에는 최대 12개의 도서만 추가할 수 있습니다.');
      return;
    }
    const newTargetKeys = [...targetKeys, ...leftSelectedKeys];
    setTargetKeys(newTargetKeys);
    setLeftSelectedKeys([]);
  };

  const moveLeft = (keyToRemove) => {
    setTargetKeys(targetKeys.filter(key => key !== keyToRemove));
  };

  const leftTableDataSource = dataSource.filter(item => !targetKeys.includes(item.key));
  const rightTableDataSource = targetKeys.map(key => allBooks.find(item => item.key === key)).filter(Boolean);

  const sortRightTableByTotalScore = () => {
    const sortedBooks = [...rightTableDataSource].sort((a, b) => b.totalScore - a.totalScore);
    const sortedKeys = sortedBooks.map(book => book.key);
    setTargetKeys(sortedKeys);
  };

  const isSaveable = targetKeys.length === 12;

  const baseColumns = [
    { dataIndex: 'title', title: '제목' },
    {
      dataIndex: 'previewCount',
      title: '조회수',
      sorter: (a, b) => a.previewCount - b.previewCount,
      render: (text, record) => {
        const diff = record.previewCount - record.previousPreviewCount;
        let diffElement = diff > 0
          ? <span style={{ color: 'green', marginLeft: 8 }}>(+{diff})</span>
          : diff < 0
            ? <span style={{ color: 'red', marginLeft: 8 }}>({diff})</span>
            : null;
        return <Flex align="center"><span>{text}</span>{diffElement}</Flex>;
      },
    },
    {
      dataIndex: 'downloadCount',
      title: '다운로드수',
      sorter: (a, b) => a.downloadCount - b.downloadCount,
      render: (text, record) => {
        const diff = record.downloadCount - record.previousDownloadCount;
        let diffElement = diff > 0
          ? <span style={{ color: 'green', marginLeft: 8 }}>(+{diff})</span>
          : diff < 0
            ? <span style={{ color: 'red', marginLeft: 8 }}>({diff})</span>
            : null;
        return <Flex align="center"><span>{text}</span>{diffElement}</Flex>;
      },
    },
    { dataIndex: 'totalScore', title: '총점', sorter: (a, b) => a.totalScore - b.totalScore },
  ];

  const rightColumns = [
    { key: 'sort', title: '순서', width: 60 },
    ...baseColumns,
    {
      title: '관리',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm title="이 도서를 랭킹에서 제외하시겠습니까?" onConfirm={() => moveLeft(record.key)}>
          <Button type="link" danger>제외</Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: leftSelectedKeys,
    onChange: (keys) => setLeftSelectedKeys(keys),
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={4}>도서 랭킹 관리</Typography.Title>
      <Typography.Paragraph>
        카테고리별 도서 랭킹을 관리합니다. 최대 12개의 도서를 랭킹에 노출할 수 있습니다.
        {isSaveable ? '' : <span style={{ color: 'red', marginLeft: 8 }}>현재 {targetKeys.length}개/12개</span>}
      </Typography.Paragraph>

      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Select value={selectedCategory} onChange={handleCategoryChange} style={{ width: 200 }}>
          {bookCategories.map(cat => <Select.Option key={cat} value={cat}>{cat}</Select.Option>)}
        </Select>
      </Flex>

      <Flex gap="large" align="start">
        <div style={{ flex: 1 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>{selectedCategory} 도서 목록</Typography.Title>
            <Button
              type="primary"
              onClick={moveRight}
              disabled={leftSelectedKeys.length === 0}
            >
              랭킹에 추가 &gt;
            </Button>
          </Flex>
          <Table
            rowSelection={rowSelection}
            columns={baseColumns}
            dataSource={leftTableDataSource}
            rowKey="key"
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </div>

        <div style={{ flex: 1 }}>
           <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
              <Typography.Title level={5} style={{ margin: 0 }}>{selectedCategory} 노출 랭킹</Typography.Title>
             <div>
               <Button onClick={() => setIsSearchModalVisible(true)}>도서 검색하여 추가</Button>
               <Tooltip title={!isSaveable ? '랭킹은 12개 도서가 모두 채워져야 저장할 수 있습니다.' : ''}>
                   <Button
                       type="primary"
                       onClick={() => message.success('도서 랭킹이 저장되었습니다.')}
                       style={{ marginLeft: 8 }}
                       disabled={!isSaveable}
                       >
                       저장
                   </Button>
               </Tooltip>
             </div>
            </Flex>
            <DndContext onDragEnd={onDragEnd}>
              <SortableContext items={targetKeys} strategy={verticalListSortingStrategy}>
                <Table
                columns={rightColumns}
                dataSource={rightTableDataSource}
                rowKey="key"
                pagination={false}
                components={{ body: { row: DraggableRow } }}
                size="small"
              />
            </SortableContext>
          </DndContext>
        </div>
      </Flex>

      <Modal
        title="도서 검색"
        open={isSearchModalVisible}
        onCancel={() => setIsSearchModalVisible(false)}
        footer={null}
      >
        <Input.Search
          placeholder="도서 제목으로 검색"
          onSearch={handleSearch}
          enterButton
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={[
            { title: '제목', dataIndex: 'title' },
            { title: '저자', dataIndex: 'author' },
            {
              title: '추가',
              key: 'action',
              render: (_, record) => (
                <Button onClick={() => addBookFromSearch(record.key)}>추가</Button>
              ),
            },
          ]}
          dataSource={searchResults}
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default BookRankingManagement;
