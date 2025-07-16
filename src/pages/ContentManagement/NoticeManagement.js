import {
  DeleteOutlined,
  EditOutlined, // For visibility
  EyeInvisibleOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusOutlined, // For visibility
  PushpinOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Input as AntInput,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm, // Rename for TextArea
  Row,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
// Consider adding a Rich Text Editor like ReactQuill or TinyMCE
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker; // Although maybe not needed for filtering notices typically
const { TextArea } = AntInput;

// --- Sample Data ---
const initialNotices = [
    { key: 'notice1', id: 'N001', title: '서버 점검 안내 (08/05 02:00 ~ 04:00)', author: 'admin_A', createdAt: '2024-07-30 10:00:00', views: 1024, isImportant: true, isPublished: true, content: '보다 안정적인 서비스 제공을 위해 서버 점검을 실시합니다. 점검 시간 동안 서비스 이용이 원활하지 않을 수 있으니 양해 부탁드립니다.' },
    { key: 'notice2', id: 'N002', title: '개인정보처리방침 개정 안내', author: 'admin_B', createdAt: '2024-07-25 15:30:00', views: 512, isImportant: false, isPublished: true, content: '개인정보처리방침 일부 내용이 개정되어 안내드립니다. 변경 사항을 확인해주세요.' },
    { key: 'notice3', id: 'N003', title: '신규 기능 업데이트 v1.2', author: 'admin_A', createdAt: '2024-07-20 09:00:00', views: 850, isImportant: false, isPublished: true, content: '새로운 기능이 추가되었습니다! 자세한 내용은 공지 본문을 확인해주세요.' },
    { key: 'notice4', id: 'N004', title: '[임시] 이벤트 공지 초안', author: 'admin_C', createdAt: '2024-07-31 11:00:00', views: 0, isImportant: false, isPublished: false, content: '여름맞이 이벤트 상세 내용 작성 중...' },
];

// --- Helper Functions ---
const getVisibilityTag = (isPublished) => {
    return isPublished
        ? <Tag icon={<EyeOutlined />} color="blue">게시 중</Tag>
        : <Tag icon={<EyeInvisibleOutlined />} color="default">비공개</Tag>;
};

// --- Component ---
const NoticeManagement = () => {
    const [notices, setNotices] = useState(initialNotices);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null); // null for new, object for edit
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState({ status: 'all', importance: 'all' });
    const [form] = Form.useForm();

    // --- Search & Filter Logic ---
    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    const handleFilterChange = (type, value) => {
        setFilters(prev => ({ ...prev, [type]: value }));
    };

    const filteredNotices = useMemo(() => {
        return notices.filter(notice => {
            const matchesSearch = searchText
                ? notice.title.toLowerCase().includes(searchText) ||
                  notice.content.toLowerCase().includes(searchText) ||
                  notice.author.toLowerCase().includes(searchText)
                : true;
            const matchesStatus = filters.status === 'all' || notice.isPublished === (filters.status === 'published');
            const matchesImportance = filters.importance === 'all' || notice.isImportant === (filters.importance === 'important');

            return matchesSearch && matchesStatus && matchesImportance;
        }).sort((a, b) => {
          // Sort by importance first, then by creation date
          if (a.isImportant !== b.isImportant) {
            return a.isImportant ? -1 : 1;
          }
          return moment(b.createdAt).unix() - moment(a.createdAt).unix();
        });
    }, [notices, searchText, filters]);

    // --- Modal Handling ---
    const showModal = (notice = null) => {
        setEditingNotice(notice);
        form.setFieldsValue(
            notice
                ? { ...notice, createdAt: moment(notice.createdAt) } // Keep moment object for potential display/edit
                : { title: '', content: '', isImportant: false, isPublished: true, author: 'current_admin' } // Default for new notice
        );
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingNotice(null);
        form.resetFields();
    };

    // --- Add/Edit Logic ---
    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const noticeData = {
                    ...values,
                    // Use existing key/id if editing, generate if new
                    key: editingNotice ? editingNotice.key : `notice${Date.now()}`,
                    id: editingNotice ? editingNotice.id : `N${String(Date.now()).slice(-3)}`,
                    createdAt: editingNotice ? editingNotice.createdAt : moment().format('YYYY-MM-DD HH:mm:ss'), // Keep original creation date or set new
                    views: editingNotice ? editingNotice.views : 0, // Reset views for new, keep for edit
                    author: editingNotice ? editingNotice.author : 'current_admin', // Or fetch logged-in admin
                };

                if (editingNotice) {
                    // Update existing notice
                    setNotices(prevNotices =>
                        prevNotices.map(n => n.key === editingNotice.key ? { ...n, ...noticeData } : n)
                    );
                    message.success(`공지사항(ID: ${editingNotice.id})이 수정되었습니다.`);
                    // TODO: API call to update notice
                    console.log('Updated Notice:', noticeData);
                } else {
                    // Add new notice
                    setNotices(prevNotices => [noticeData, ...prevNotices]);
                    message.success('새 공지사항이 등록되었습니다.');
                    // TODO: API call to add notice
                    console.log('Added Notice:', noticeData);
                }
                handleCancel();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
                message.error('필수 입력 항목을 확인해주세요.');
            });
    };

    // --- Delete Logic ---
    const handleDelete = (key, id) => {
        setNotices(prevNotices => prevNotices.filter(n => n.key !== key));
        message.success(`공지사항(ID: ${id})이 삭제되었습니다.`);
        // TODO: API call to delete notice
        console.log('Deleted Notice ID:', id);
    };

    // --- Toggle Publish Status --- (Directly in table)
    const handlePublishToggle = (key, checked) => {
         setNotices(prevNotices =>
            prevNotices.map(n => n.key === key ? { ...n, isPublished: checked } : n)
        );
        message.success(`공지사항 게시 상태가 ${checked ? '게시 중' : '비공개'}으로 변경되었습니다.`);
         // TODO: API call to update publish status
         console.log(`Toggled publish status for notice key ${key} to ${checked}`);
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
        {
            title: '제목', dataIndex: 'title', key: 'title',
            render: (text, record) => (
                <Space>
                    {record.isImportant && <Tooltip title="중요 공지"><PushpinOutlined style={{ color: 'red' }} /></Tooltip>}
                    <Button type="link" onClick={() => showModal(record)} style={{ padding: 0, height: 'auto' }}>
                       {text}
                    </Button>
                </Space>
            )
        },
        { title: '작성자', dataIndex: 'author', key: 'author', width: 120 },
        {
            title: '작성일', dataIndex: 'createdAt', key: 'createdAt', width: 150,
            render: (date) => moment(date).format('YYYY-MM-DD HH:mm'),
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
        },
        { title: '조회수', dataIndex: 'views', key: 'views', width: 100, align: 'right', render: (v) => v.toLocaleString(), sorter: (a, b) => a.views - b.views },
        {
            title: '게시 상태', dataIndex: 'isPublished', key: 'isPublished', width: 120, align: 'center',
             render: (isPublished, record) => (
                 <Switch
                    checked={isPublished}
                    onChange={(checked) => handlePublishToggle(record.key, checked)}
                    checkedChildren={<EyeOutlined />}
                    unCheckedChildren={<EyeInvisibleOutlined />}
                    size="small"
                 />
            ),
            filters: [
                { text: '게시 중', value: 'published' },
                { text: '비공개', value: 'unpublished' },
            ],
            // Filter logic handled in useMemo
        },
        {
            title: '관리',
            key: 'action',
            width: 100,
            align: 'center',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="수정">
                        <Button icon={<EditOutlined />} onClick={() => showModal(record)} size="small" />
                    </Tooltip>
                    <Popconfirm
                        title={`'${record.title}' 공지사항을 삭제하시겠습니까?`}
                        onConfirm={() => handleDelete(record.key, record.id)}
                        okText="삭제"
                        cancelText="취소"
                    >
                        <Tooltip title="삭제">
                             <Button icon={<DeleteOutlined />} danger size="small" />
                         </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>공지사항 관리</Title>
            <Text type="secondary">사용자에게 보여줄 공지사항을 관리합니다.</Text>

            {/* Controls: Add Button, Search, Filters */}
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Space wrap>
                    <Search
                        placeholder="제목, 내용, 작성자 검색"
                        allowClear
                        enterButton={<><SearchOutlined /> 검색</>}
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                    />
                    <FilterOutlined style={{ marginLeft: 8, color: '#888' }} />
                    <Select
                        value={filters.status}
                        onChange={(value) => handleFilterChange('status', value)}
                        style={{ width: 120 }}
                    >
                        <Option value="all">전체 상태</Option>
                        <Option value="published">게시 중</Option>
                        <Option value="unpublished">비공개</Option>
                    </Select>
                     <Select
                        value={filters.importance}
                        onChange={(value) => handleFilterChange('importance', value)}
                        style={{ width: 120 }}
                    >
                        <Option value="all">전체 중요도</Option>
                        <Option value="important">중요 공지</Option>
                        <Option value="normal">일반 공지</Option>
                    </Select>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>새 공지 작성</Button>
            </Space>

            <Table
                columns={columns}
                dataSource={filteredNotices}
                pagination={{ pageSize: 10 }}
                rowKey="key"
                scroll={{ x: 900 }}
                size="middle"
            />

            {/* Add/Edit Modal */}
            <Modal
                title={editingNotice ? `공지사항 수정 (ID: ${editingNotice.id})` : '새 공지사항 작성'}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText={editingNotice ? '수정 완료' : '등록'}
                cancelText="취소"
                destroyOnClose
            >
                <Form form={form} layout="vertical" name="notice_form">
                    <Form.Item
                        name="title"
                        label="제목"
                        rules={[{ required: true, message: '제목을 입력해주세요.' }]}
                    >
                        <AntInput />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="내용"
                        rules={[{ required: true, message: '내용을 입력해주세요.' }]}
                    >
                        {/* Replace with Rich Text Editor if needed */}
                        <TextArea rows={10} placeholder="공지 내용을 입력하세요. HTML 태그 사용 가능합니다."/>
                        {/* <ReactQuill theme="snow" value={form.getFieldValue('content')} onChange={(value) => form.setFieldsValue({ content: value })} /> */}
                    </Form.Item>

                     <Row gutter={16}>
                         <Col span={12}>
                             <Form.Item name="isImportant" valuePropName="checked">
                                 <Checkbox><PushpinOutlined /> 중요 공지로 설정 (목록 상단 고정)</Checkbox>
                            </Form.Item>
                         </Col>
                        <Col span={12}>
                             <Form.Item name="isPublished" label="게시 상태" rules={[{ required: true }]}>
                                 <Switch checkedChildren="게시 중" unCheckedChildren="비공개" defaultChecked={true}/>
                            </Form.Item>
                        </Col>
                     </Row>

                     {/* Hidden field for author - can be set automatically */}
                     {/* <Form.Item name="author" hidden><AntInput /></Form.Item> */}
                </Form>
            </Modal>
        </Space>
    );
};

export default NoticeManagement;
