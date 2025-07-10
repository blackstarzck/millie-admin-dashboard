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


const allBooksData = initialBooks
  .filter(book => book.CONTENT_TYPE === '10')
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

const NewBookManagement = () => {
  const [bookData, setBookData] = useState(allBooksData);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('소설');
  const [globalRanking, setGlobalRanking] = useState(null); // Tracks the "auto-populated" state

  const booksByCategory = useMemo(() => {
    const byCategory = {};
    bookCategories.forEach(cat => { byCategory[cat] = []; });
    bookData.forEach(book => {
      if (book.CATEGORY_NAME && byCategory.hasOwnProperty(book.CATEGORY_NAME)) {
          byCategory[book.CATEGORY_NAME].push(book);
      }
    });
    return byCategory;
  }, [bookData]);

  const [rankings, setRankings] = useState(() => {
    const initialRankings = {};
    const tempBooksByCategory = {};
    bookCategories.forEach(cat => { tempBooksByCategory[cat] = []; });
    allBooksData.forEach(book => {
      if (book.CATEGORY_NAME && tempBooksByCategory.hasOwnProperty(book.CATEGORY_NAME)) {
          tempBooksByCategory[book.CATEGORY_NAME].push(book);
      }
    });

    bookCategories.forEach(category => {
      const books = tempBooksByCategory[category] || [];
      const shuffled = [...books].sort(() => 0.5 - Math.random());
      initialRankings[category] = shuffled.slice(0, 5).map(book => book.key);
    });
    return initialRankings;
  });

  const activeRanking = globalRanking !== null ? globalRanking : (rankings[selectedCategory] || []);

  const setTargetKeysForCategory = (newKeys) => {
    setRankings(prev => ({ ...prev, [selectedCategory]: newKeys }));
  };

  const [leftSelectedKeys, setLeftSelectedKeys] = useState([]);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setLeftSelectedKeys([]);
    setGlobalRanking(null); // Reset global ranking on category change
  }, [selectedCategory]);

  const handleAutoPopulate = () => {
    const sortedBooks = [...bookData]
      .filter(book => book.SERVICE_OPEN_DATE)
      .sort((a, b) => moment(b.SERVICE_OPEN_DATE).diff(moment(a.SERVICE_OPEN_DATE)));
    const newTargetKeys = sortedBooks.slice(0, 12).map(book => book.key);

    if (newTargetKeys.length === 0) {
      message.warning(`서비스 오픈일이 지정된 도서가 없습니다.`);
    }
    setGlobalRanking(newTargetKeys);
    message.success(`전체 도서 중 최신순으로 신규 도서 목록이 업데이트되었습니다.`);
  };

  const handleReset = () => {
    setGlobalRanking(null);
    message.success('목록을 카테고리 기본값으로 되돌렸습니다.');
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
      const newData = [...bookData];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        const updatedItem = {
          ...item,
          ...row,
          SERVICE_OPEN_DATE: row.SERVICE_OPEN_DATE ? row.SERVICE_OPEN_DATE.format('YYYY-MM-DD') : item.SERVICE_OPEN_DATE,
        };
        newData.splice(index, 1, updatedItem);
        setBookData(newData);
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
    const filteredBooks = bookData.filter(book =>
      book.title.toLowerCase().includes(value.toLowerCase()) && !activeRanking.includes(book.key)
    );
    setSearchResults(filteredBooks);
  };

  const addBookFromSearch = (bookKey) => {
    if (activeRanking.includes(bookKey)) {
      message.warning('이미 신규 도서 목록에 추가된 도서입니다.');
      return;
    }

    if (globalRanking !== null) {
      setGlobalRanking([...activeRanking, bookKey]);
    } else {
      setTargetKeysForCategory([...activeRanking, bookKey]);
    }

    setSearchResults(prevResults => prevResults.filter(book => book.key !== bookKey));
    message.success('도서가 추가되었습니다.');
    setIsSearchModalVisible(false);
    setSearchQuery('');
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      const oldIndex = activeRanking.indexOf(active.id);
      const newIndex = activeRanking.indexOf(over.id);
      const newKeys = arrayMove(activeRanking, oldIndex, newIndex);
      if (globalRanking !== null) {
        setGlobalRanking(newKeys);
      } else {
        setTargetKeysForCategory(newKeys);
      }
    }
  };

  const handleCategoryChange = (value) => setSelectedCategory(value);

  const moveRight = () => {
    const newKeys = [...activeRanking, ...leftSelectedKeys];
    if (globalRanking !== null) {
      setGlobalRanking(newKeys);
    } else {
      setTargetKeysForCategory(newKeys);
    }
    setLeftSelectedKeys([]);
  };

  const moveLeft = (keyToRemove) => {
    const newKeys = activeRanking.filter(key => key !== keyToRemove);
     if (globalRanking !== null) {
      setGlobalRanking(newKeys);
    } else {
      setTargetKeysForCategory(newKeys);
    }
  }

  const leftTableDataSource = useMemo(() => (booksByCategory[selectedCategory] || []).filter(item => !activeRanking.includes(item.key)), [booksByCategory, selectedCategory, activeRanking]);
  const rightTableDataSource = useMemo(() => activeRanking.map(key => bookData.find(item => item.key === key)).filter(Boolean), [activeRanking, bookData]);

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
            <Popconfirm title="이 도서를 목록에서 제외하시겠습니까?" onConfirm={() => moveLeft(record.key)}>
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
      <Typography.Title level={4}>신규 도서 관리</Typography.Title>
      <Typography.Paragraph>독자에게 노출될 '신규 도서' 목록을 관리합니다. 도서를 추가, 제외하고 순서를 변경할 수 있습니다.</Typography.Paragraph>
      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Select value={selectedCategory} onChange={handleCategoryChange} style={{ width: 200 }}>
          {bookCategories.map(cat => <Select.Option key={cat} value={cat}>{cat}</Select.Option>)}
        </Select>
      </Flex>
      <Flex gap="large" align="start">
        <div style={{ flex: 1 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>{selectedCategory} 전체 도서 목록 (전자책)</Typography.Title>
            <Button type="primary" onClick={moveRight} disabled={leftSelectedKeys.length === 0}>신규 도서로 추가 &gt;</Button>
          </Flex>
          <Table rowSelection={rowSelection} columns={leftColumns} dataSource={leftTableDataSource} rowKey="key" pagination={{ pageSize: 10 }} size="small" />
        </div>
        <div style={{ flex: 1 }}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 12 }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {globalRanking !== null ? '전체 최신 도서 목록' : `${selectedCategory} 신규 도서 목록`}
            </Typography.Title>
            <Space>
              <Button onClick={handleAutoPopulate}>최신순 자동 채우기</Button>
              {globalRanking !== null && <Button onClick={handleReset}>리셋</Button>}
              <Button onClick={() => setIsSearchModalVisible(true)}>도서 검색하여 추가</Button>
              <Button type="primary" onClick={() => message.success('신규 도서 목록이 저장되었습니다.')}>저장</Button>
            </Space>
          </Flex>
          <Form form={form} component={false}>
            <DndContext onDragEnd={onDragEnd}>
              <SortableContext items={activeRanking} strategy={verticalListSortingStrategy}>
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
      <Modal title="도서 검색" open={isSearchModalVisible} onCancel={() => setIsSearchModalVisible(false)} footer={null}>
        <Input.Search placeholder="도서 제목으로 검색" onSearch={handleSearch} enterButton style={{ marginBottom: 16 }} />
        <Table
          columns={[
            { title: '제목', dataIndex: 'title' },
            { title: '저자', dataIndex: 'author' },
            { title: '추가', key: 'action', render: (_, record) => (<Button onClick={() => addBookFromSearch(record.key)}>추가</Button>) },
          ]}
          dataSource={searchResults}
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default NewBookManagement;
