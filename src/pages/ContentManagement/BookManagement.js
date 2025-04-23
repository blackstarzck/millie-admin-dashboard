import React, { useState } from 'react';
import {
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    Space,
    Typography,
    Tag,
    message, // For feedback
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

// Initial Data (Can be fetched from API later)
const initialBooks = [
    { key: '1', id: 1, title: 'React 마스터하기', author: '김개발', isbn: '979-11-1234-001-1', status: 'approved' },
    { key: '2', id: 2, title: 'Node.js 실전 가이드', author: '박코딩', isbn: '979-11-1234-002-8', status: 'pending' },
    { key: '3', id: 3, title: 'UI/UX 디자인 원칙', author: '이나눔', isbn: '979-11-1234-003-5', status: 'approved' },
];

const BookManagement = () => {
    const [books, setBooks] = useState(initialBooks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null); // For editing functionality (optional)
    const [form] = Form.useForm(); // AntD Form instance

    // --- Modal Handling ---
    const showAddModal = () => {
        setEditingBook(null); // Ensure not in editing mode
        form.resetFields(); // Clear form fields
        setIsModalOpen(true);
    };

    const showEditModal = (book) => {
        setEditingBook(book);
        form.setFieldsValue(book); // Populate form with book data
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingBook(null);
        form.resetFields();
    };

    // --- Form Submission ---
    const handleOk = () => {
        form
            .validateFields() // Validate form fields
            .then((values) => {
                // Simulate API call / data update
                if (editingBook) {
                    // --- Edit Logic --- (Placeholder)
                    const updatedBooks = books.map(book =>
                        book.key === editingBook.key ? { ...book, ...values } : book
                    );
                    setBooks(updatedBooks);
                    message.success('도서 정보가 수정되었습니다.');
                    console.log('Updating book:', editingBook.key, values);
                } else {
                    // --- Add Logic --- (Placeholder)
                    const newBook = {
                        key: (books.length + 1).toString(), // Simple key generation
                        id: books.length + 1, // Simple ID generation
                        ...values,
                    };
                    setBooks([...books, newBook]);
                    message.success('새 도서가 추가되었습니다.');
                    console.log('Adding new book:', values);
                }
                form.resetFields();
                setIsModalOpen(false);
                setEditingBook(null);
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                 message.error('폼 입력값을 확인해주세요.');
            });
    };

    // --- Delete Handling --- (Placeholder)
    const handleDelete = (key) => {
        // Simulate API call / data deletion
        setBooks(books.filter(book => book.key !== key));
        message.success('도서가 삭제되었습니다.');
        console.log('Deleting book key:', key);
    };

    // --- Table Columns Definition ---
    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
        {
            title: '제목', dataIndex: 'title', key: 'title', sorter: (a, b) => a.title.localeCompare(b.title),
            // Add search functionality if needed
        },
        { title: '저자', dataIndex: 'author', key: 'author' },
        { title: 'ISBN', dataIndex: 'isbn', key: 'isbn' },
        {
            title: '상태', dataIndex: 'status', key: 'status',
            render: (status) => {
                let color = status === 'approved' ? 'green' : 'volcano';
                let text = status === 'approved' ? '승인' : '대기';
                return <Tag color={color}>{text}</Tag>;
            },
            filters: [
                { text: '승인', value: 'approved' },
                { text: '대기', value: 'pending' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: '관리', key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} size="small">
                        수정
                    </Button>
                    <Button
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.key)}
                        danger // Make delete button red
                        size="small"
                    >
                        삭제
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}>도서 관리</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 {/* Add Search Input here if needed */}
                 {/* <Input.Search placeholder="도서 검색..." style={{ width: 300 }} /> */}
                <span/> {/* Placeholder to push button to right */} 
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showAddModal}
                >
                    새 도서 추가
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={books}
                pagination={{ pageSize: 10 }} // Add pagination
                // loading={isLoading} // Add loading state if fetching data
                rowKey="key"
            />

            {/* Add/Edit Book Modal */}
            <Modal
                title={editingBook ? "도서 정보 수정" : "새 도서 추가"}
                open={isModalOpen}
                onOk={handleOk} // Trigger form submission
                onCancel={handleCancel}
                okText={editingBook ? "수정" : "추가"}
                cancelText="취소"
                destroyOnClose // Reset form state when modal is closed
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="book_form"
                    initialValues={{ status: 'pending' }} // Default status
                >
                    <Form.Item
                        name="title"
                        label="제목"
                        rules={[{ required: true, message: '도서 제목을 입력해주세요!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="author"
                        label="저자"
                        rules={[{ required: true, message: '저자명을 입력해주세요!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="isbn"
                        label="ISBN"
                        rules={[
                            { required: true, message: 'ISBN을 입력해주세요!' },
                            // Add more specific ISBN validation if needed
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="상태"
                        rules={[{ required: true, message: '상태를 선택해주세요!' }]}
                    >
                        <Select placeholder="상태 선택">
                            <Option value="approved">승인</Option>
                            <Option value="pending">대기</Option>
                            {/* Add other statuses if needed */}
                        </Select>
                    </Form.Item>
                    {/* Add other fields like cover image upload, description, etc. */}
                    {/* <Form.Item name="description" label="설명"><Input.TextArea rows={4} /></Form.Item> */}
                </Form>
            </Modal>
        </Space>
    );
};

export default BookManagement; 