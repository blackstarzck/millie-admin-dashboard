import React, { useState } from 'react';
import { Space, Typography, Card, Table, Button, Modal, Form, Input, message, Popconfirm, Switch } from 'antd';
import { SettingOutlined, PlusOutlined, EditOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';

// DND-Kit imports
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Title, Text } = Typography;

// 초기 신고 사유 유형 데이터
const initialReportTypes = [
  { key: '1', id: 'RT001', name: '욕설/비방', description: '타인에게 불쾌감을 주는 언어 폭력', isActive: true, order: 1, isDefault: true },
  { key: '2', id: 'RT002', name: '스팸/광고', description: '상업적 목적의 무분별한 홍보 활동', isActive: true, order: 2, isDefault: true },
  { key: '3', id: 'RT003', name: '음란물', description: '성적으로 부적절한 콘텐츠 게시', isActive: true, order: 3, isDefault: true },
  { key: '4', id: 'RT004', name: '불법정보', description: '법률에 위반되는 정보 유포', isActive: false, order: 4, isDefault: false },
  { key: '5', id: 'RT005', name: '기타', description: '위에 해당하지 않는 기타 신고 사유', isActive: true, order: 5, isDefault: true },
];

// Draggable Row Component
const DraggableRow = (props) => {
  const { attributes, listeners: rowListeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });
  const style = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 1, background: '#fafafa' } : {}),
  };
  return <tr {...props} ref={setNodeRef} style={style} {...attributes} />;
};

// Drag Handle Cell Component (ESLint 오류 해결용)
const DragHandleCell = ({ recordKey }) => {
  const { attributes, listeners, setNodeRef: setHandleNodeRef } = useSortable({ id: recordKey });
  return (
    <Button 
      type="text" 
      size="small" 
      ref={setHandleNodeRef}
      {...attributes} 
      {...listeners} 
      icon={<MenuOutlined style={{ cursor: 'grab'}} />}
      style={{ touchAction: 'none' }}
    />
  );
};

const ReportSettings = () => {
  const [reportTypes, setReportTypes] = useState(initialReportTypes.sort((a, b) => a.order - b.order));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [form] = Form.useForm();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1, // 클릭과 드래그를 구분하기 위한 최소 이동 거리
      },
    })
  );

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setReportTypes((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        const newOrder = arrayMove(prev, activeIndex, overIndex);
        // 순서 변경 후 각 아이템의 order 값도 업데이트
        return newOrder.map((item, index) => ({ ...item, order: index + 1 }));
      });
      message.success('순서가 변경되었습니다.');
    }
  };

  const showModal = (type = null) => {
    setEditingType(type);
    if (type) {
      form.setFieldsValue(type);
    } else {
      const newOrder = reportTypes.length > 0 ? Math.max(...reportTypes.map(rt => rt.order)) + 1 : 1;
      form.resetFields();
      form.setFieldsValue({ isActive: true, order: newOrder });
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        order: Number(values.order) // order를 숫자로 변환
      };
      if (editingType) {
        setReportTypes(prev => 
          prev.map(t => t.key === editingType.key ? { ...editingType, ...formattedValues } : t)
              .sort((a, b) => a.order - b.order) // 수정 후에도 order 기준으로 정렬
        );
        message.success('신고 유형이 수정되었습니다.');
      } else {
        const newType = { 
          key: String(Date.now()), 
          id: `RT${String(Date.now()).slice(-3)}${reportTypes.length + 1}`,
          ...formattedValues, 
          isDefault: false
        };
        setReportTypes(prev => [...prev, newType].sort((a, b) => a.order - b.order)); // 추가 후에도 order 기준으로 정렬
        message.success('새 신고 유형이 추가되었습니다.');
      }
      setIsModalVisible(false);
      setEditingType(null);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingType(null);
  };

  const handleDelete = (key) => {
    const typeToDelete = reportTypes.find(t => t.key === key);
    if (typeToDelete && typeToDelete.isDefault) {
        message.error('기본 신고 유형은 삭제할 수 없습니다.');
        return;
    }
    setReportTypes(prev => prev.filter(t => t.key !== key));
    message.success('신고 유형이 삭제되었습니다.');
  };

  const handleToggleActiveStatus = (key, isActive) => {
    setReportTypes(prevTypes => 
      prevTypes.map(type => 
        type.key === key ? { ...type, isActive: isActive } : type
      )
    );
    message.success(`신고 유형의 활성 상태가 변경되었습니다.`);
  };

  const columns = [
    {
      key: 'sort',
      align: 'center',
      width: 50,
      render: (_, record) => <DragHandleCell recordKey={record.key} />,
    },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '유형명', dataIndex: 'name', key: 'name', width: 150 },
    { title: '설명', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '순서', dataIndex: 'order', key: 'order', width: 80, sorter: (a,b) => a.order - b.order },
    { 
      title: '활성 여부', 
      dataIndex: 'isActive', 
      key: 'isActive', 
      width: 100,
      render: (isActive, record) => (
        <Switch 
          checked={isActive} 
          checkedChildren="활성"
          unCheckedChildren="비활성"
          onChange={(checked, event) => {
            event.stopPropagation();
            handleToggleActiveStatus(record.key, checked);
          }}
        />
      )
    },
    {
      title: '관리',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)} />
          {!record.isDefault && (
            <Popconfirm title="정말로 삭제하시겠습니까?" onConfirm={() => handleDelete(record.key)} okText="삭제" cancelText="취소">
                <Button type="link" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}><SettingOutlined /> 신고 유형 및 정책 관리</Title>
      <Text>사용자 신고 시 선택 가능한 사유 유형 및 관련 정책을 관리합니다.</Text>

      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={reportTypes.map(i => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Card 
            title="신고 사유 유형 관리"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showModal()} 
              >
                새 유형 추가
              </Button>
            }
          >
            <Table 
              components={{
                body: { row: DraggableRow },
              }}
              rowKey="key"
              columns={columns} 
              dataSource={reportTypes}
            />
          </Card>
        </SortableContext>
      </DndContext>
      
      <Card title="신고 처리 정책">
        <Text>여기에 신고 처리와 관련된 전반적인 운영 정책 내용을 표시하거나 편집할 수 있는 기능을 넣을 수 있습니다. (예: Markdown 에디터 또는 단순 텍스트 영역)</Text>
      </Card>

      <Modal
        title={editingType ? '신고 유형 수정' : '새 신고 유형 추가'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={editingType ? '수정' : '추가'}
        cancelText="취소"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="유형명" rules={[{ required: true, message: '유형명을 입력해주세요.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="설명">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="order" label="노출 순서" rules={[{ required: true, message: '순서를 입력해주세요.'/*, type: 'number'*/ }]}>
            {/* order는 DND로 관리되므로, 직접 입력보다는 참고용으로 표시하거나 자동 할당하는 것이 좋음 */}
            {/* 여기서는 일단 입력 가능하게 두되, DND와 충돌 가능성 인지 */}
            <Input type="number" />
          </Form.Item>
          <Form.Item name="isActive" label="활성 여부" valuePropName="checked">
            <Switch checkedChildren="활성" unCheckedChildren="비활성" defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default ReportSettings; 