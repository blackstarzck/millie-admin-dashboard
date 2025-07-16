import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined, SearchOutlined
} from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tooltip,
  Typography
} from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const initialData = [
  { id: 1, title: '서비스 점검 안내 (AntD 적용)', author: '관리자', date: '2024-07-26', views: 150, content: '서비스 안정화를 위한 점검이 예정되어 있습니다.', category: 'system' },
  { id: 2, title: '새로운 기능 업데이트 소식 (AntD 적용)', author: '관리자', date: '2024-07-25', views: 320, content: '사용자 편의성을 위한 새로운 기능이 추가되었습니다.', category: 'update' },
  { id: 3, title: '이용약관 변경 안내 (AntD 적용)', author: '관리자', date: '2024-07-24', views: 50, content: '개인정보 처리방침 관련 이용약관이 변경됩니다.', category: 'announcement' },
  { id: 4, title: '여름맞이 이벤트 공지', author: '마케터', date: '2024-07-27', views: 500, content: '시원한 여름 보내세요!', category: 'event' },
];

const categories = [
    { id: 'announcement', name: '공지' },
    { id: 'event', name: '안내' },
    { id: 'system', name: '시스템 점검' },
    { id: 'update', name: '업데이트' },
];

const categoryMap = categories.reduce((acc, cur) => {
    acc[cur.id] = cur.name;
    return acc;
}, {});

const NoticeList = () => {
  const [searchText, setSearchText] = useState('');
  const [dataSource, setDataSource] = useState(initialData);
  const [filteredData, setFilteredData] = useState(initialData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm] = Form.useForm();

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = dataSource.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      item.author.toLowerCase().includes(value.toLowerCase()) ||
      item.content.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleDelete = (id) => {
    const newData = dataSource.filter(item => item.id !== id);
    setDataSource(newData);
    const newFilteredData = filteredData.filter(item => item.id !== id);
    setFilteredData(newFilteredData);
    console.log(`Deleting notice with id: ${id}`);
  };

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEditNotice = (id) => {
    const noticeToEdit = dataSource.find(item => item.id === id);
    if (noticeToEdit) {
        setEditingNotice(noticeToEdit);
        editForm.setFieldsValue({
            ...noticeToEdit,
            exposurePeriod: noticeToEdit.exposurePeriod ? [dayjs(noticeToEdit.exposurePeriod[0]), dayjs(noticeToEdit.exposurePeriod[1])] : null,
        });
        setIsEditModalVisible(true);
    } else {
        message.error('공지 정보를 찾을 수 없습니다.');
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingNotice(null);
    editForm.resetFields();
  };

  const onEditFinish = async (values) => {
    if (!editingNotice) return;
    setEditLoading(true);
    message.loading({ content: '공지사항 수정 중...', key: 'noticeEditModal' });
    console.log('Edit Form Values:', values, 'Editing ID:', editingNotice.id);

    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const updatedNotice = {
            ...editingNotice,
            ...values,
            content: values.content || '',
            exposurePeriod: values.exposurePeriod ? [dayjs(values.exposurePeriod[0]).format(), dayjs(values.exposurePeriod[1]).format()] : null,
        };

        const updatedDataSource = dataSource.map(item =>
            item.id === editingNotice.id ? updatedNotice : item
        );
        setDataSource(updatedDataSource);

        const filtered = updatedDataSource.filter(item =>
            item.title.toLowerCase().includes(searchText.toLowerCase()) ||
            item.author.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.content && item.content.toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredData(filtered);

        message.success({ content: '공지사항이 성공적으로 수정되었습니다!', key: 'noticeEditModal' });
        handleEditCancel();
    } catch (error) {
        console.error('Error updating notice:', error);
        message.error({ content: '공지사항 수정 중 오류가 발생했습니다.', key: 'noticeEditModal' });
    } finally {
        setEditLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    message.loading({ content: '공지사항 등록 중...', key: 'noticeCreateModal' });
    console.log('Form Values from Modal:', values);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newNotice = {
          id: dataSource.length > 0 ? Math.max(...dataSource.map(n => n.id)) + 1 : 1,
          author: '관리자',
          date: dayjs().format('YYYY-MM-DD'),
          views: 0,
          ...values,
          content: values.content || '',
          exposurePeriod: values.exposurePeriod ? [dayjs(values.exposurePeriod[0]).format(), dayjs(values.exposurePeriod[1]).format()] : null,
      };
      const newData = [newNotice, ...dataSource];
      setDataSource(newData);
      const filtered = newData.filter(item =>
          item.title.toLowerCase().includes(searchText.toLowerCase()) ||
          item.author.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.content && item.content.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredData(filtered);

      message.success({ content: '공지사항이 성공적으로 등록되었습니다!', key: 'noticeCreateModal' });
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error creating notice:', error);
      message.error({ content: '공지사항 등록 중 오류가 발생했습니다.', key: 'noticeCreateModal' });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Modal Form Failed:', errorInfo);
    message.error('필수 입력 항목을 확인해주세요.');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      width: 80,
    },
    {
        title: '카테고리',
        dataIndex: 'category',
        key: 'category',
        width: 130,
        render: (categoryId) => categoryMap[categoryId] || categoryId,
        sorter: (a, b) => (categoryMap[a.category] || '').localeCompare(categoryMap[b.category] || ''),
        filters: categories.map(cat => ({ text: cat.name, value: cat.id })),
        onFilter: (value, record) => record.category === value,
    },
    {
      title: '제목',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: '작성자',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
      width: 120,
    },
    {
      title: '등록일',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      width: 150,
    },
    {
      title: '조회수',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
      width: 100,
    },
    {
      title: '관리',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="수정">
            <Button icon={<EditOutlined />} size="small" onClick={() => handleEditNotice(record.id)} />
          </Tooltip>
          <Popconfirm
            title="정말로 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="예"
            cancelText="아니오"
          >
            <Tooltip title="삭제">
              <Button icon={<DeleteOutlined />} size="small" danger />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={2}>공지사항 목록 관리</Title>
      <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Search
          placeholder="제목, 작성자, 내용 검색"
          allowClear
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          새 공지 작성
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        title="새 공지 작성"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
            form={form}
            layout="vertical"
            name="notice_creation_modal_form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={{ isVisible: true }}
        >
            <Form.Item
                name="title"
                label="제목"
                rules={[{ required: true, message: '제목을 입력해주세요.' }]}
            >
                <Input placeholder="공지사항 제목" />
            </Form.Item>

            <Form.Item
                name="category"
                label="카테고리"
                rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}
            >
                <Select placeholder="카테고리 선택">
                    {categories.map(cat => (
                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="content"
                label={
                    <Space>
                        <span>내용</span>
                        <Tooltip title="작성 후 반드시 모바일 환경에서 확인해주세요">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    </Space>
                }
                rules={[{ required: true, message: '내용을 입력해주세요.' }]}
                getValueFromEvent={(value) => { return value === '<p><br></p>' ? '' : value; }}
            >
                <ReactQuill
                    theme="snow"
                    placeholder="공지 내용을 입력하세요..."
                    style={{ height: '250px', marginBottom: '50px' }}
                />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        공지 등록
                    </Button>
            </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="공지 수정"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
            form={editForm}
            layout="vertical"
            name="notice_edit_modal_form"
            onFinish={onEditFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                name="title"
                label="제목"
                rules={[{ required: true, message: '제목을 입력해주세요.' }]}
            >
                <Input placeholder="공지사항 제목" />
            </Form.Item>

            <Form.Item
                name="category"
                label="카테고리"
                rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}
            >
                <Select placeholder="카테고리 선택">
                    {categories.map(cat => (
                        <Option key={cat.id} value={cat.id}>{cat.name}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="content"
                label={
                    <Space>
                        <span>내용</span>
                        <Tooltip title="작성 후 반드시 모바일 환경에서 확인해주세요">
                            <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                        </Tooltip>
                    </Space>
                }
                rules={[{ required: true, message: '내용을 입력해주세요.' }]}
                getValueFromEvent={(value) => { return value === '<p><br></p>' ? '' : value; }}
            >
                <ReactQuill
                    theme="snow"
                    placeholder="공지 내용을 입력하세요..."
                    style={{ height: '250px', marginBottom: '50px' }}
                />
          </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={editLoading}
                    >
                        수정 완료
                    </Button>
            </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default NoticeList;
