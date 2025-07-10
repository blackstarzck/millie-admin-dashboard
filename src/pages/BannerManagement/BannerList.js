import { MenuOutlined } from '@ant-design/icons';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Carousel, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Table, Tag, Typography } from 'antd';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// 인라인 에디팅을 위한 셀 컴포넌트
const EditableCell = ({ editing, dataIndex, title, inputType, children, ...restProps }) => {
  const inputNode = inputType === 'select' ? (
    <Select placeholder="위치를 선택하세요">
      <Option value="Home_Top">홈 상단</Option>
      <Option value="Home_Middle">홈 중단</Option>
      <Option value="Category_Top">카테고리 상단</Option>
    </Select>
  ) : (
    <Input />
  );

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }} rules={[{ required: true, message: `${title}을(를) 입력해주세요.` }]}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

// 드래그를 위한 Context와 컴포넌트들
const DraggableRowContext = createContext(null);

const DragHandle = () => {
  const { attributes, listeners } = useContext(DraggableRowContext) || {};
  return <MenuOutlined style={{ cursor: 'grab' }} {...attributes} {...listeners} />;
};

const DraggableRow = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props['data-row-key'] });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 1, position: 'relative', userSelect: 'none' } : {}),
  };
  const contextValue = useMemo(() => ({ attributes, listeners }), [attributes, listeners]);
  return (
    <DraggableRowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} />
    </DraggableRowContext.Provider>
  );
};


const BannerList = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [banners, setBanners] = useState([
        {
          key: '1',
          name: '메인 상단 배너',
          position: 'Home_Top',
          createdAt: '2023-09-28',
          items: [
            { id: '1-1', title: '이벤트 1', description: '가을맞이 특별 할인!', imageUrl: 'https://via.placeholder.com/800x400/FF6347/FFFFFF?Text=Fall+Event', navigationUrl: '/event1' },
            { id: '1-2', title: '이벤트 2', description: '신간 도서 안내', imageUrl: 'https://via.placeholder.com/800x400/4682B4/FFFFFF?Text=New+Books', navigationUrl: '/event2' },
          ],
        },
        {
          key: '2',
          name: '카테고리 상단 프로모션',
          position: 'Category_Top',
          createdAt: '2023-10-25',
          items: [
            { id: '2-1', title: '프로모션', description: '경제/경영 도서 20% 할인', imageUrl: 'https://via.placeholder.com/800x400/32CD32/FFFFFF?Text=Promotion', navigationUrl: '/promo1' },
          ],
        },
    ]);

    const [filteredBanners, setFilteredBanners] = useState(banners);
    const [previewBanner, setPreviewBanner] = useState(null);
    const [editingKey, setEditingKey] = useState('');
    const [editingItemKey, setEditingItemKey] = useState('');

    const isEditing = (record) => record.key === editingKey;
    const isEditingItem = (record) => record.id === editingItemKey;

    const edit = (record) => {
        form.setFieldsValue({ name: '', position: '', ...record });
        setEditingKey(record.key);
    };
    const cancel = () => setEditingKey('');
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...banners];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setBanners(newData);
                setFilteredBanners(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const editItem = (record) => {
        form.setFieldsValue({ ...record });
        setEditingItemKey(record.id);
    };
    const cancelItem = () => setEditingItemKey('');
    const saveItem = async (bannerKey, itemKey) => {
        try {
            const row = await form.validateFields();
            const newData = JSON.parse(JSON.stringify(banners));
            const bannerIndex = newData.findIndex((b) => b.key === bannerKey);
            if (bannerIndex > -1) {
                const itemIndex = newData[bannerIndex].items.findIndex((i) => i.id === itemKey);
                if (itemIndex > -1) {
                    const item = newData[bannerIndex].items[itemIndex];
                    newData[bannerIndex].items.splice(itemIndex, 1, { ...item, ...row });
                    setBanners(newData);
                    setFilteredBanners(newData);
                    setEditingItemKey('');
                }
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const deleteItem = (bannerKey, itemKey) => {
        const newData = JSON.parse(JSON.stringify(banners));
        const bannerIndex = newData.findIndex((b) => b.key === bannerKey);
        if (bannerIndex > -1) {
            newData[bannerIndex].items = newData[bannerIndex].items.filter(i => i.id !== itemKey);
            setBanners(newData);
            setFilteredBanners(newData);
        }
    };

    const handleItemDragEnd = (event, bannerKey) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
          const newData = JSON.parse(JSON.stringify(banners));
          const bannerIndex = newData.findIndex((b) => b.key === bannerKey);
          if (bannerIndex > -1) {
              const items = newData[bannerIndex].items;
              const oldIndex = items.findIndex((i) => i.id === active.id);
              const newIndex = items.findIndex((i) => i.id === over.id);
              if (oldIndex > -1 && newIndex > -1) {
                newData[bannerIndex].items = arrayMove(items, oldIndex, newIndex);
                setBanners(newData);
                setFilteredBanners(newData);
              }
          }
        }
    };

    const handleSearch = (value) => {
        const filtered = banners.filter(banner => banner.name.toLowerCase().includes(value.toLowerCase()));
        setFilteredBanners(filtered);
    };

    const handleFilterChange = (value) => {
        if (value === 'All') setFilteredBanners(banners);
        else setFilteredBanners(banners.filter(banner => banner.position === value));
    };

    const showPreviewModal = (banner) => setPreviewBanner(banner);

    const handleDelete = (key) => {
        const newBanners = banners.filter(item => item.key !== key);
        setBanners(newBanners);
        setFilteredBanners(newBanners);
    };

    // 확장된 행을 렌더링하는 새로운 컴포넌트
    const ExpandedItemsTable = ({ bannerRecord }) => {
        const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));

        const onDragEnd = (event) => {
            handleItemDragEnd(event, bannerRecord.key);
        };

        const expandColumns = [
          { key: 'sort', width: 60, align: 'center', render: () => <DragHandle /> },
          { title: '아이템 제목', dataIndex: 'title', key: 'title', editable: true },
          { title: '아이템 설명', dataIndex: 'description', key: 'description', editable: true },
          { title: '이미지 URL', dataIndex: 'imageUrl', key: 'imageUrl', editable: true, render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a> },
          { title: '네비게이션 URL', dataIndex: 'navigationUrl', key: 'navigationUrl', editable: true, render: (url) => <a href={url} target="_blank" rel="noopener noreferrer">{url}</a> },
          {
            title: '관리',
            key: 'action',
            render: (_, itemRecord) => {
                const editable = isEditingItem(itemRecord);
                const isAnythingEditing = editingKey !== '' || editingItemKey !== '';
                return editable ? (
                    <Space>
                        <Button onClick={() => saveItem(bannerRecord.key, itemRecord.id)} type="primary" size="small">저장</Button>
                        <Popconfirm title="정말 취소하시겠습니까?" onConfirm={cancelItem} okText="예" cancelText="아니오"><Button size="small">취소</Button></Popconfirm>
                    </Space>
                ) : (
                    <Space>
                        <Button type="link" size="small" disabled={isAnythingEditing} onClick={() => editItem(itemRecord)}>수정</Button>
                        <Popconfirm title="정말 삭제하시겠습니까?" disabled={isAnythingEditing} onConfirm={() => deleteItem(bannerRecord.key, itemRecord.id)} okText="예" cancelText="아니오">
                            <Button type="link" danger size="small" disabled={isAnythingEditing}>삭제</Button>
                        </Popconfirm>
                    </Space>
                );
            }
          },
        ];

        const mergedExpandColumns = expandColumns.map((col) => {
            if (!col.editable) return col;
            return {
                ...col,
                onCell: (record) => ({ record, inputType: 'text', dataIndex: col.dataIndex, title: col.title, editing: isEditingItem(record) }),
            };
        });

        return (
            <DndContext sensors={sensors} onDragEnd={onDragEnd}>
                <SortableContext items={bannerRecord.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <Table
                        components={{ body: { row: DraggableRow, cell: EditableCell } }}
                        columns={mergedExpandColumns}
                        dataSource={bannerRecord.items}
                        pagination={false}
                        rowKey="id"
                        rowClassName="editable-row"
                    />
                </SortableContext>
            </DndContext>
        );
    };

    const expandedRowRender = (record) => <ExpandedItemsTable bannerRecord={record} />;

    const mainColumns = [
        { title: '배너 이름', dataIndex: 'name', key: 'name', editable: true },
        {
            title: '노출 위치',
            dataIndex: 'position',
            key: 'position',
            editable: true,
            inputType: 'select',
            render: (pos) => <Tag>{ {Home_Top: '홈 상단', Home_Middle: '홈 중단', Category_Top: '카테고리 상단'}[pos] || '위치 정보 없음' }</Tag>
        },
        { title: '생성일', dataIndex: 'createdAt', key: 'createdAt' },
        { title: '아이템 수', dataIndex: 'items', key: 'itemCount', render: (items) => items ? items.length : 0 },
        {
            title: '관리',
            key: 'action',
            render: (_, record) => {
                const editable = isEditing(record);
                const isAnythingEditing = editingKey !== '' || editingItemKey !== '';
                return editable ? (
                    <Space>
                        <Button onClick={() => save(record.key)} type="primary" size="small">저장</Button>
                        <Popconfirm title="정말 취소하시겠습니까?" onConfirm={cancel} okText="예" cancelText="아니오"><Button size="small">취소</Button></Popconfirm>
                    </Space>
                ) : (
                    <Space>
                        <Button type="link" disabled={isAnythingEditing} onClick={() => edit(record)}>수정</Button>
                        <Popconfirm title="정말 삭제하시겠습니까?" onConfirm={() => handleDelete(record.key)} disabled={isAnythingEditing} okText="예" cancelText="아니오">
                          <Button type="link" danger disabled={isAnythingEditing}>삭제</Button>
                        </Popconfirm>
                        <Button type="link" disabled={isAnythingEditing} onClick={() => showPreviewModal(record)}>미리보기</Button>
                    </Space>
                );
            },
        },
    ];

    const mergedColumns = mainColumns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record) => ({ record, inputType: col.inputType || 'text', dataIndex: col.dataIndex, title: col.title, editing: isEditing(record) }),
        };
    });

    const isAnythingEditing = editingKey !== '' || editingItemKey !== '';

    return (
      <Form form={form} component={false}>
        <Space direction="vertical" size="large" style={{ width: '100%', padding: 24 }}>
            <Title level={2}>배너 목록</Title>
            <Card>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col><Search placeholder="배너 이름으로 검색" onSearch={handleSearch} style={{ width: 200 }} enterButton disabled={isAnythingEditing} /></Col>
                    <Col>
                        <Select defaultValue="All" style={{ width: 150 }} onChange={handleFilterChange} disabled={isAnythingEditing}>
                            <Option value="All">전체 위치</Option>
                            <Option value="Home_Top">홈 상단</Option>
                            <Option value="Home_Middle">홈 중단</Option>
                            <Option value="Category_Top">카테고리 상단</Option>
                        </Select>
                    </Col>
                    <Col style={{ marginLeft: 'auto' }}><Button type="primary" onClick={() => navigate('/banner/register')} disabled={isAnythingEditing}>배너 생성</Button></Col>
                </Row>
                <Table
                    components={{ body: { cell: EditableCell, row: DraggableRow } }}
                    bordered
                    columns={mergedColumns}
                    dataSource={filteredBanners}
                    rowKey="key"
                    expandable={{ expandedRowRender, defaultExpandedRowKeys: ['1'] }}
                    rowClassName="editable-row"
                />
            </Card>
            {previewBanner && (
                <Modal
                    title={`${previewBanner.name} 미리보기`}
                    open={!!previewBanner}
                    onCancel={() => setPreviewBanner(null)}
                    footer={[<Button key="close" onClick={() => setPreviewBanner(null)}>닫기</Button>]}
                    width={850}
                >
                    <Carousel dots infinite speed={500} slidesToShow={1} slidesToScroll={1} autoplay>
                        {previewBanner.items.map((item, index) => (
                            <div key={index}>
                                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: 'auto' }} />
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    <Title level={4}>{item.title}</Title>
                                    <Text>{item.description}</Text>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </Modal>
            )}
        </Space>
      </Form>
    );
}

export default BannerList;
