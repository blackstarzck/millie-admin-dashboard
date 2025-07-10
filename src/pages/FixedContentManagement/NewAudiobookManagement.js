import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Flex, Input, message, Modal, Popconfirm, Select, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { initialBooks } from '../ContentManagement/BookManagement';

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

const allAudiobooks = initialBooks
  .filter(book => book.CONTENT_TYPE === '20') // 오디오북만 필터링
  .map(book => ({
    ...book,
    id: book.key,
    key: book.key,
    title: book.BOOK_NAME,
    author: book.BOOK_AUTHOR,
  }));

const audiobooksByCategory = {};
bookCategories.forEach(category => {
  // For demonstration, randomly assign audiobooks to categories.
  audiobooksByCategory[category] = allAudiobooks.filter(() => Math.random() > 0.5);
});


const NewAudiobookManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('소설');
  const [dataSource, setDataSource] = useState([]);
  const [rankings, setRankings] = useState(() => {
    const initialRankings = {};
    bookCategories.forEach(category => {
      const books = audiobooksByCategory[category] || [];
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

  useEffect(() => {
    const categoryBooks = audiobooksByCategory[selectedCategory] || [];
    const availableBooks = categoryBooks.filter(book => !targetKeys.includes(book.key));
    setDataSource(availableBooks);
    setLeftSelectedKeys([]);
  }, [selectedCategory, targetKeys]);


  const handleSearch = (value) => {
    setSearchQuery(value);
    if (!value) {
      setSearchResults([]);
      return;
    }
    const filteredBooks = allAudiobooks.filter(book =>
      book.title.toLowerCase().includes(value.toLowerCase()) && !targetKeys.includes(book.key)
    );
    setSearchResults(filteredBooks);
  };

  const addBookFromSearch = (bookKey) => {
    if (targetKeys.includes(bookKey)) {
      message.warning('이미 신규 오디오북 목록에 추가된 도서입니다.');
      return;
    }
    setTargetKeys(prevKeys => [...prevKeys, bookKey]);
    setSearchResults(prevResults => prevResults.filter(book => book.key !== bookKey));
    message.success('오디오북이 추가되었습니다.');
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
    const newTargetKeys = [...targetKeys, ...leftSelectedKeys];
    setTargetKeys(newTargetKeys);
    setLeftSelectedKeys([]);
  };

  const moveLeft = (keyToRemove) => {
    setTargetKeys(targetKeys.filter(key => key !== keyToRemove));
  };

  const leftTableDataSource = dataSource.filter(item => !targetKeys.includes(item.key));
  const rightTableDataSource = targetKeys.map(key => allAudiobooks.find(item => item.key === key)).filter(Boolean);

  const baseColumns = [
    { dataIndex: 'title', title: '제목' },
    { dataIndex: 'author', title: '저자' },
    { dataIndex: 'BOOK_PUBLISHER', title: '출판사' },
    { dataIndex: 'EBOOK_PUBLISH_DATE', title: '출간일' },
  ];

  const leftColumns = [
    ...baseColumns,
  ];

  const rightColumns = [
    { key: 'sort', title: '순서', width: 60 },
    ...baseColumns,
    {
      title: '관리',
      key: 'action',
      width: 80,
      render: (_, record) => (
        <Popconfirm title="이 오디오북을 목록에서 제외하시겠습니까?" onConfirm={() => moveLeft(record.key)}>
          <Button type="link" danger>제외</Button>
        </Popconfirm>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: leftSelectedKeys,
    onChange: (keys) => {
      setLeftSelectedKeys(keys);
    },
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={4}>신규 오디오북 관리</Typography.Title>
      <Typography.Paragraph>
        독자에게 노출될 '신규 오디오북' 목록을 관리합니다. 오디오북을 추가, 제외하고 순서를 변경할 수 있습니다.
      </Typography.Paragraph>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Select value={selectedCategory} onChange={handleCategoryChange} style={{ width: 200 }}>
          {bookCategories.map(cat => <Select.Option key={cat} value={cat}>{cat}</Select.Option>)}
        </Select>
      </Flex>
      <Flex gap="large" align="start">
        <div style={{ flex: 1 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>{selectedCategory} 전체 오디오북 목록</Typography.Title>
            <Button
              type="primary"
              onClick={moveRight}
              disabled={leftSelectedKeys.length === 0}
            >
              신규 오디오북으로 추가 &gt;
            </Button>
          </Flex>
          <Table
            rowSelection={rowSelection}
            columns={leftColumns}
            dataSource={leftTableDataSource}
            rowKey="key"
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </div>

        <div style={{ flex: 1 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>{selectedCategory} 신규 오디오북 목록</Typography.Title>
            <div>
              <Button onClick={() => setIsSearchModalVisible(true)}>오디오북 검색하여 추가</Button>
              <Button
                type="primary"
                onClick={() => message.success('신규 오디오북 목록이 저장되었습니다.')}
                style={{ marginLeft: 8 }}
              >
                저장
              </Button>
            </div>
          </Flex>
          <DndContext onDragEnd={onDragEnd}>
            <SortableContext items={targetKeys} strategy={verticalListSortingStrategy}>
              <Table
                columns={rightColumns}
                dataSource={rightTableDataSource}
                rowKey="key"
                pagination={false}
                components={{
                  body: {
                    row: DraggableRow,
                  },
                }}
                size="small"
              />
            </SortableContext>
          </DndContext>
        </div>
      </Flex>
      <Modal
        title="오디오북 검색"
        open={isSearchModalVisible}
        onCancel={() => setIsSearchModalVisible(false)}
        footer={null}
      >
        <Input.Search
          placeholder="오디오북 제목으로 검색"
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

export default NewAudiobookManagement;
