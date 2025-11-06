import { MenuOutlined } from '@ant-design/icons';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, DatePicker, Flex, Form, Input, message, Modal, Popconfirm, Select, Space, Table, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { initialBooks } from '../ContentManagement/BookManagement';

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
  '소설', '시/에세이', '인문', '사회과학', '경영/경제', '자기계발', 'IT/컴퓨터',
  '도슨트북', '오브제북', '오디오북', '챗북', '밀리 오리지널',
  '독립출판', '디즈니', '빨간펜 동화', '매거진', '만화',
  '세계문학전집', '외국어', '여행', '라이프스타일', '부모', '어린이', '청소년',
  '철학', '과학', '역사', '종교', '로맨스/BL', '판타지/무협'
];


const allAudiobooksData = initialBooks
  .filter(book => book.CONTENT_TYPE === '20')
  .map(book => ({
    ...book,
    id: book.key,
    key: book.key,
    title: book.BOOK_NAME,
    author: book.BOOK_AUTHOR,
  }));

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const inputNode = inputType === 'date' ? <DatePicker format="YYYY-MM-DD" /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `${title}을(를) 입력해주세요.` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const GenrePopularAudiobookManagement = () => {
  const [audiobookData, setAudiobookData] = useState(allAudiobooksData);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('소설');

  const [globalRanking, setGlobalRanking] = useState([]);
  const [isGlobalRankingActive, setIsGlobalRankingActive] = useState(false);

  const audiobooksByCategory = useMemo(() => {
    const byCategory = {};
    bookCategories.forEach(cat => { byCategory[cat] = []; });
    audiobookData.forEach(book => {
      if (book.CATEGORY_NAME && byCategory.hasOwnProperty(book.CATEGORY_NAME)) {
          byCategory[book.CATEGORY_NAME].push(book);
      }
    });
    return byCategory;
  }, [audiobookData]);

  const [rankings, setRankings] = useState(() => {
    const initialRankings = {};
    // 카테고리별로 초기 오디오북 데이터를 할당합니다 (실제 CATEGORY_NAME 기준)
    const tempBooksByCategory = {};
    bookCategories.forEach(cat => { tempBooksByCategory[cat] = []; });
    allAudiobooksData.forEach(book => {
      // 도서 데이터의 실제 카테고리를 사용합니다.
      if (book.CATEGORY_NAME && tempBooksByCategory.hasOwnProperty(book.CATEGORY_NAME)) {
        tempBooksByCategory[book.CATEGORY_NAME].push(book);
      }
    });

    bookCategories.forEach(category => {
      // 이제 실제 카테고리 데이터로 순위를 생성합니다.
      const booksInCategory = tempBooksByCategory[category] || [];
      // 초기 순위는 카테고리 내에서 무작위로 5개를 선택합니다.
      const shuffled = [...booksInCategory].sort(() => 0.5 - Math.random());
      initialRankings[category] = shuffled.slice(0, Math.min(5, shuffled.length)).map(book => book.key);
    });
    return initialRankings;
  });

  const targetKeys = useMemo(() => {
    if (isGlobalRankingActive) {
      return globalRanking;
    }
    return rankings[selectedCategory] || [];
  }, [isGlobalRankingActive, globalRanking, rankings, selectedCategory]);

  const setTargetKeysForCategory = (newKeys) => {
    if (isGlobalRankingActive) {
      // 전역 랭킹이 활성화된 상태에서는 rankings[selectedCategory]를 업데이트하지 않습니다.
      // 대신, 사용자가 수동으로 목록을 변경하면 전역 랭킹 상태를 해제할 수 있습니다.
      message.warn('자동 채우기 상태에서는 순서를 변경할 수 없습니다. 초기화 후 다시 시도해주세요.');
      return;
    }
    setRankings(prev => ({ ...prev, [selectedCategory]: newKeys }));
  };

  const [leftSelectedKeys, setLeftSelectedKeys] = useState([]);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setLeftSelectedKeys([]);
    if (isGlobalRankingActive) {
      // 카테고리를 변경하면 전역 랭킹 상태를 초기화합니다.
      setIsGlobalRankingActive(false);
      setGlobalRanking([]);
    }
  }, [selectedCategory]);

  const handleAutoPopulate = () => {
    // initialBooks에서 CONTENT_TYPE이 '20'(오디오북)인 데이터만 필터링합니다.
    const allAudiobooks = initialBooks.filter(book => book.CONTENT_TYPE === '20');

    const sortedBooks = allAudiobooks
      .filter(book => book.SERVICE_OPEN_DATE)
      .sort((a, b) => moment(b.SERVICE_OPEN_DATE).diff(moment(a.SERVICE_OPEN_DATE)));

    const newGlobalRanking = sortedBooks.slice(0, 12).map(book => book.key);

    if (newGlobalRanking.length < 1) {
      message.warning('서비스 오픈일이 지정된 오디오북이 없습니다.');
      return;
    }

    setGlobalRanking(newGlobalRanking);
    setIsGlobalRankingActive(true);
    message.success(`전체 오디오북 중 최신 12권이 목록에 표시됩니다.`);
  };

  const handleReset = () => {
    if (isGlobalRankingActive) {
      setIsGlobalRankingActive(false);
      setGlobalRanking([]);
      message.success('목록을 초기화했습니다. 카테고리별 목록이 표시됩니다.');
    } else {
      message.info('이미 초기화 상태입니다.');
    }
  };

  const isEditing = record => record.key === editingKey;

  const edit = record => {
    form.setFieldsValue({ ...record, SERVICE_OPEN_DATE: record.SERVICE_OPEN_DATE ? moment(record.SERVICE_OPEN_DATE, 'YYYY-MM-DD') : null });
    setEditingKey(record.key);
  };

  const cancel = () => setEditingKey('');

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...audiobookData];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedItem = {
          ...item,
          ...row,
          SERVICE_OPEN_DATE: row.SERVICE_OPEN_DATE ? row.SERVICE_OPEN_DATE.format('YYYY-MM-DD') : item.SERVICE_OPEN_DATE,
        };
        newData.splice(index, 1, updatedItem);
        setAudiobookData(newData);
        setEditingKey('');
        message.success('서비스 오픈일이 수정되었습니다.');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (!value) {
      setSearchResults([]);
      return;
    }
    const filteredBooks = audiobookData.filter(book =>
      book.title.toLowerCase().includes(value.toLowerCase()) && !targetKeys.includes(book.key)
    );
    setSearchResults(filteredBooks);
  };

  const addBookFromSearch = (bookKey) => {
    if (targetKeys.includes(bookKey)) {
      message.warning('이미 신규 오디오북 목록에 추가된 도서입니다.');
      return;
    }
    // 전역 랭킹 활성화 시 수동 추가 방지
    if (isGlobalRankingActive) {
      message.warn('자동 채우기 상태에서는 도서를 추가할 수 없습니다.');
      return;
    }
    setTargetKeysForCategory([...targetKeys, bookKey]);
    setSearchResults(prevResults => prevResults.filter(book => book.key !== bookKey));
    message.success('오디오북이 추가되었습니다.');
    setIsSearchModalVisible(false);
    setSearchQuery('');
  };

  const onDragEnd = ({ active, over }) => {
    if (isGlobalRankingActive) {
      message.warn('자동 채우기 상태에서는 순서를 변경할 수 없습니다.');
      return;
    }
    if (active.id !== over?.id) {
      const oldIndex = targetKeys.indexOf(active.id);
      const newIndex = targetKeys.indexOf(over.id);
      setTargetKeysForCategory(arrayMove(targetKeys, oldIndex, newIndex));
    }
  };

  const handleCategoryChange = (value) => setSelectedCategory(value);

  const moveRight = () => {
    if (isGlobalRankingActive) {
      message.warn('자동 채우기 상태에서는 도서를 추가할 수 없습니다.');
      return;
    }
    setTargetKeysForCategory([...targetKeys, ...leftSelectedKeys]);
    setLeftSelectedKeys([]);
  };

  const moveLeft = (keyToRemove) => {
    if (isGlobalRankingActive) {
      message.warn('자동 채우기 상태에서는 도서를 삭제할 수 없습니다.');
      return;
    }
    setTargetKeysForCategory(targetKeys.filter(key => key !== keyToRemove));
  };

  const leftTableDataSource = useMemo(() => {
    if (isGlobalRankingActive) return []; // 자동 채우기 시 왼쪽 테이블 비움
    return (audiobooksByCategory[selectedCategory] || []).filter(item => !targetKeys.includes(item.key));
  }, [audiobooksByCategory, selectedCategory, targetKeys, isGlobalRankingActive]);

  const rightTableDataSource = useMemo(() => {
    const sourceKeys = isGlobalRankingActive ? globalRanking : (rankings[selectedCategory] || []);
    return sourceKeys.map(key => audiobookData.find(item => item.key === key)).filter(Boolean);
  }, [isGlobalRankingActive, globalRanking, rankings, selectedCategory, audiobookData]);

  const baseColumns = [
    { dataIndex: 'title', title: '제목', width: 250 },
    { dataIndex: 'author', title: '저자', width: 150 },
    { dataIndex: 'BOOK_PUBLISHER', title: '출판사', width: 150 },
    { dataIndex: 'SERVICE_OPEN_DATE', title: '서비스 오픈일', editable: true, width: 150 },
  ];

  const leftColumns = [...baseColumns];

  const rightColumns = [
    { key: 'sort', title: '순서', width: 60 },
    ...baseColumns,
    {
      title: '관리',
      key: 'action',
      width: 120,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>저장</Typography.Link>
            <Popconfirm title="수정을 취소하시겠습니까?" onConfirm={cancel}><a>취소</a></Popconfirm>
          </span>
        ) : (
          <Space>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>편집</Typography.Link>
            <Popconfirm title="이 오디오북을 목록에서 제외하시겠습니까?" onConfirm={() => moveLeft(record.key)}>
              <Button type="link" danger>제외</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedRightColumns = rightColumns.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({ record, inputType: 'date', dataIndex: col.dataIndex, title: col.title, editing: isEditing(record) }),
    };
  });

  const rowSelection = {
    selectedRowKeys: leftSelectedKeys,
    onChange: (keys) => setLeftSelectedKeys(keys),
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={4}>장르별 인기 오디오북 관리</Typography.Title>
      <Typography.Paragraph>독자에게 노출될 '신규 오디오북' 목록을 관리합니다. 오디오북을 추가, 제외하고 순서를 변경할 수 있습니다.</Typography.Paragraph>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Select value={selectedCategory} onChange={handleCategoryChange} style={{ width: 200 }}>
          {bookCategories.map(cat => <Select.Option key={cat} value={cat}>{cat}</Select.Option>)}
        </Select>
      </Flex>
      <Flex gap="large" align="start">
        <div style={{ flex: 1 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>{selectedCategory} 전체 오디오북 목록</Typography.Title>
            <Button type="primary" onClick={moveRight} disabled={leftSelectedKeys.length === 0 || isGlobalRankingActive}>신규 오디오북으로 추가 &gt;</Button>
          </Flex>
          <Table rowSelection={rowSelection} columns={leftColumns} dataSource={leftTableDataSource} rowKey="key" pagination={{ pageSize: 10 }} size="small" />
        </div>
        <div style={{ flex: 1 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>{selectedCategory} 신규 오디오북 목록</Typography.Title>
            <Space>
              <Button type="primary" ghost onClick={handleAutoPopulate}>최신순 자동 채우기</Button>
              <Button onClick={handleReset} disabled={!isGlobalRankingActive}>초기화</Button>
              <Button icon={<i className="fas fa-search" />} onClick={() => setIsSearchModalVisible(true)} disabled={isGlobalRankingActive}>
                도서 검색 추가
              </Button>
              <Button type="primary" onClick={() => message.success('신규 오디오북 목록이 저장되었습니다.')}>저장</Button>
            </Space>
          </Flex>
          <Form form={form} component={false}>
            <DndContext onDragEnd={onDragEnd}>
              <SortableContext items={rightTableDataSource.map(item => item.key)} strategy={verticalListSortingStrategy}>
                <Table
                  columns={mergedRightColumns}
                  dataSource={rightTableDataSource}
                  rowKey="key"
                  pagination={false}
                  components={{ body: { row: DraggableRow, cell: EditableCell } }}
                  size="small"
                />
              </SortableContext>
            </DndContext>
          </Form>
        </div>
      </Flex>
      <Modal
        title="도서 검색"
        open={isSearchModalVisible}
        onCancel={() => setIsSearchModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Input.Search
          placeholder="오디오북 제목으로 검색"
          enterButton
          onSearch={handleSearch}
          style={{ marginBottom: 16 }}
        />
        <Table
          columns={[
            { title: '제목', dataIndex: 'title' },
            { title: '저자', dataIndex: 'author' },
            {
              title: '추가',
              key: 'add',
              render: (_, record) => (
                <Button size="small" onClick={() => addBookFromSearch(record.key)}>
                  추가
                </Button>
              ),
            },
          ]}
          dataSource={searchResults}
          rowKey="key"
          pagination={false}
          size="small"
        />
      </Modal>
    </div>
  );
};

export default GenrePopularAudiobookManagement;
