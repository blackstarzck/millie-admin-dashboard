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
    message,
    Image,
    Tooltip,
    DatePicker,
    Popconfirm,
    InputNumber,
    Upload,
    Row,
    Col,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    BookOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    AudioOutlined,
    ReadOutlined,
    UploadOutlined,
    GlobalOutlined,
    SafetyOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Updated Initial Data reflecting new structure + audio/ebook info
const initialBooks = [
    { key: '1', BOOK_ID: 'db2d7f6d848c4742', BOOK_NAME: '숙론', BOOK_AUTHOR: '최재천', BOOK_PUBLISHER: '김영사', BOOK_COVER_IMAGE: 'https://img.millie.co.kr/200x/service/cover/180080659/f9238e2933934e2e8249c74a6e9c7ce7.jpg', CATEGORY_SEQ: '1240', CATEGORY_NAME: '사회과학', GENRE: '교양과학', BOOK_SERVICE_YN: 'Y', BOOK_EBOOK_RENT_YN: 'Y', EBOOK_PUBLISH_DATE: '2024-05-17', REGISTRATION_DATE: '2024-05-10', TAKE_COUNT: '73', BOOK_ADULT_YN: 'N', IS_EXCLUSIVE: 'N', CONTENT_TYPE: '10', PLAY_TIME: '00:00:00', LEADER_NAME: '', LEADER_JOB: '', ISBN: '9791138434195', LANGUAGE: 'ko', TAGS: ['과학', '사회', '토론'], AGE_GROUP: 'all', DESCRIPTION: '숙고하고 토론해야 할 우리 시대의 다양한 질문들', TOC: '1부...', SUMMARY: '우리는 끊임없이...', SERIES_NAME: '', SERIES_NUM: null, SERIES_COUNT: null, FILE_FORMAT: 'EPUB', DRM_YN: 'Y', FILE_SIZE_MB: 5.2, PAGE_COUNT: 320, PRICE: 16200, COPYRIGHT_INFO: '김영사 © 2024', SERVICE_REGION: 'KR' },
    { key: '2', BOOK_ID: 'anotherBook123', BOOK_NAME: 'React 마스터하기', BOOK_AUTHOR: '김개발', BOOK_PUBLISHER: 'IT출판', BOOK_COVER_IMAGE: 'https://via.placeholder.com/40x60.png?text=React', CATEGORY_SEQ: '500', CATEGORY_NAME: 'IT/컴퓨터', GENRE: '프로그래밍', BOOK_SERVICE_YN: 'Y', BOOK_EBOOK_RENT_YN: 'N', EBOOK_PUBLISH_DATE: '2023-01-15', REGISTRATION_DATE: '2023-01-10', TAKE_COUNT: '150', BOOK_ADULT_YN: 'N', IS_EXCLUSIVE: 'Y', CONTENT_TYPE: '10', PLAY_TIME: '00:00:00', LEADER_NAME: '', LEADER_JOB: '', ISBN: '9791162240101', LANGUAGE: 'ko', TAGS: ['React', '웹개발'], AGE_GROUP: 'all', DESCRIPTION: 'React의 기초부터 심화까지 다루는 개발 서적', TOC: null, SUMMARY: null, SERIES_NAME: '웹 개발 시리즈', SERIES_NUM: 1, SERIES_COUNT: 5, FILE_FORMAT: 'EPUB', DRM_YN: 'Y', FILE_SIZE_MB: 15.8, PAGE_COUNT: 600, PRICE: 32000, COPYRIGHT_INFO: 'IT출판 © 2023', SERVICE_REGION: 'GLOBAL' },
    { key: '3', BOOK_ID: 'someOtherId456', BOOK_NAME: 'Node.js 실전 가이드', BOOK_AUTHOR: '박코딩', BOOK_PUBLISHER: '코딩북스', BOOK_COVER_IMAGE: 'https://via.placeholder.com/40x60.png?text=Node', CATEGORY_SEQ: '501', BOOK_SERVICE_YN: 'N', BOOK_EBOOK_RENT_YN: 'N', EBOOK_PUBLISH_DATE: '2023-05-20', REGISTRATION_DATE: '2023-05-15', TAKE_COUNT: '88', BOOK_ADULT_YN: 'Y', IS_EXCLUSIVE: 'N', CONTENT_TYPE: '10', PLAY_TIME: '00:00:00', LEADER_NAME: '', LEADER_JOB: '', ISBN: '', LANGUAGE: '', TAGS: [], AGE_GROUP: '', DESCRIPTION: '', TOC: '', SUMMARY: '', SERIES_NAME: '', SERIES_NUM: null, SERIES_COUNT: null, FILE_FORMAT: '', DRM_YN: '', FILE_SIZE_MB: '', PAGE_COUNT: '', PRICE: '', COPYRIGHT_INFO: '', SERVICE_REGION: '' },
    { key: '4', BOOK_ID: 'audiobook789', BOOK_NAME: '불편한 편의점 (오디오북)', BOOK_AUTHOR: '김호연', BOOK_PUBLISHER: '나무옆의자', BOOK_COVER_IMAGE: 'https://via.placeholder.com/40x60.png?text=Audio', CATEGORY_SEQ: '1240', CATEGORY_NAME: '소설', GENRE: '한국소설', BOOK_SERVICE_YN: 'Y', BOOK_EBOOK_RENT_YN: 'Y', EBOOK_PUBLISH_DATE: '2022-08-10', REGISTRATION_DATE: '2022-08-01', TAKE_COUNT: '250', BOOK_ADULT_YN: 'N', IS_EXCLUSIVE: 'N', CONTENT_TYPE: '20', PLAY_TIME: '08:35:20', LEADER_NAME: '김유정', LEADER_JOB: '성우', ISBN: '9791161571188', LANGUAGE: 'ko', TAGS: ['힐링', '편의점', '드라마'], AGE_GROUP: 'all', DESCRIPTION: '서울역 뒤편 골목길의 작은 편의점에서 벌어지는 이야기 (오디오북)', TOC: null, SUMMARY: null, SERIES_NAME: '', SERIES_NUM: null, SERIES_COUNT: null, FILE_FORMAT: 'MP3', DRM_YN: 'Y', FILE_SIZE_MB: 450.5, PAGE_COUNT: null, PRICE: 12600, COPYRIGHT_INFO: '나무옆의자 © 2022', SERVICE_REGION: 'KR' },
];

// Helper to get content type tag
const getContentTypeTag = (contentType) => {
    // Assuming '10' is ebook and '20' is audiobook based on typical patterns
    if (contentType === '10') {
        return <Tag icon={<ReadOutlined />} color="blue">전자책</Tag>;
    } else if (contentType === '20') {
        return <Tag icon={<AudioOutlined />} color="purple">오디오북</Tag>;
    } else {
        return <Tag>{contentType || '알 수 없음'}</Tag>;
    }
};

// Helper for region tag
const getRegionTag = (regionCode) => {
    switch (regionCode?.toUpperCase()) {
        case 'KR': return <Tag color="red">국내</Tag>;
        case 'GLOBAL': return <Tag color="geekblue">해외</Tag>;
        // Add more specific region logic if needed
        default: return <Tag>{regionCode || '-'}</Tag>;
    }
};

const BookManagement = () => {
    const [books, setBooks] = useState(initialBooks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [form] = Form.useForm();

    // --- Modal Handling ---
    const showAddModal = () => {
        setEditingBook(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const showEditModal = (book) => {
        setEditingBook(book);
        form.setFieldsValue({
            ...book,
            EBOOK_PUBLISH_DATE: book.EBOOK_PUBLISH_DATE ? moment(book.EBOOK_PUBLISH_DATE) : null,
            REGISTRATION_DATE: book.REGISTRATION_DATE ? moment(book.REGISTRATION_DATE) : null,
            TAGS: book.TAGS || [],
        });
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingBook(null);
        form.resetFields();
    };

    // --- Form Submission ---
    const handleOk = () => {
        form.validateFields()
            .then((values) => {
                const contentType = values.CONTENT_TYPE;
                const formattedValues = {
                    ...values,
                    EBOOK_PUBLISH_DATE: values.EBOOK_PUBLISH_DATE ? values.EBOOK_PUBLISH_DATE.format('YYYY-MM-DD') : null,
                    REGISTRATION_DATE: values.REGISTRATION_DATE ? values.REGISTRATION_DATE.format('YYYY-MM-DD') : null,
                    // Clear irrelevant fields based on type
                    PLAY_TIME: contentType === '20' ? (values.PLAY_TIME || '00:00:00') : undefined,
                    LEADER_NAME: contentType === '20' ? (values.LEADER_NAME || '') : undefined,
                    LEADER_JOB: contentType === '20' ? (values.LEADER_JOB || '') : undefined,
                    PAGE_COUNT: contentType === '10' ? values.PAGE_COUNT : undefined,
                    TAGS: values.TAGS || [],
                };

                // Remove undefined keys to avoid sending empty strings for irrelevant fields
                Object.keys(formattedValues).forEach(key => {
                    if (formattedValues[key] === undefined) {
                        delete formattedValues[key];
                    }
                });

                if (editingBook) {
                    const updatedBooks = books.map(book =>
                        book.key === editingBook.key ? { ...editingBook, ...formattedValues } : book
                    );
                    setBooks(updatedBooks);
                    message.success('도서 정보가 수정되었습니다.');
                    console.log('Updating book:', editingBook.key, formattedValues);
                } else {
                    const newBook = {
                        key: `book_${Date.now()}`,
                        BOOK_ID: `new_${Date.now()}`,
                        ...formattedValues,
                    };
                    setBooks([...books, newBook]);
                    message.success('새 도서가 추가되었습니다.');
                    console.log('Adding new book:', formattedValues);
                }
                handleCancel();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
                message.error('폼 입력값을 확인해주세요.');
            });
    };

    // --- Delete Handling ---
    const handleDelete = (key) => {
        setBooks(books.filter(book => book.key !== key));
        message.success('도서가 삭제되었습니다.');
        console.log('Deleting book key:', key);
    };

    // --- Updated Table Columns Definition ---
    const columns = [
        {
            title: '표지',
            dataIndex: 'BOOK_COVER_IMAGE',
            key: 'cover',
            width: 60,
            render: (url) => <Image src={url || 'https://via.placeholder.com/40x60.png?text=N/A'} alt="Cover" width={30} preview={false} fallback="https://via.placeholder.com/40x60.png?text=Err"/>,
        },
        {
            title: '타입',
            dataIndex: 'CONTENT_TYPE',
            key: 'contentType',
            align: 'center',
            render: getContentTypeTag,
            filters: [
                { text: '전자책', value: '10' },
                { text: '오디오북', value: '20' },
            ],
            onFilter: (value, record) => record.CONTENT_TYPE === value,
        },
        {
            title: '도서명',
            dataIndex: 'BOOK_NAME',
            key: 'title',
            sorter: (a, b) => a.BOOK_NAME.localeCompare(b.BOOK_NAME),
            render: (text) => <Text style={{maxWidth: 150}} ellipsis={{ tooltip: text }}>{text}</Text>
        },
        { title: '저자', dataIndex: 'BOOK_AUTHOR', key: 'author', ellipsis: true },
        { title: '출판사', dataIndex: 'BOOK_PUBLISHER', key: 'publisher', ellipsis: true },
        { title: 'ISBN', dataIndex: 'ISBN', key: 'isbn', ellipsis: true },
        { title: '장르', dataIndex: 'GENRE', key: 'genre', ellipsis: true },
        {
            title: '서비스 상태',
            dataIndex: 'BOOK_SERVICE_YN',
            key: 'service',
            align: 'center',
            render: (yn) => <Tag color={yn === 'Y' ? 'success' : 'default'} icon={yn === 'Y' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>{yn === 'Y' ? 'Y' : 'N'}</Tag>,
            filters: [{ text: 'Y', value: 'Y' }, { text: 'N', value: 'N' }],
            onFilter: (value, record) => record.BOOK_SERVICE_YN === value,
        },
        {
            title: 'DRM',
            dataIndex: 'DRM_YN',
            key: 'drm',
            align: 'center',
            render: (yn) => <Tag color={yn === 'Y' ? 'orange' : 'default'} icon={yn === 'Y' ? <SafetyOutlined /> : null}>{yn === 'Y' ? 'Y' : 'N'}</Tag>,
            filters: [{ text: 'Y', value: 'Y' }, { text: 'N', value: 'N' }],
            onFilter: (value, record) => record.DRM_YN === value,
        },
        {
            title: '가격',
            dataIndex: 'PRICE',
            key: 'price',
            align: 'right',
            sorter: (a, b) => (a.PRICE || 0) - (b.PRICE || 0),
            render: (price) => price ? `${price.toLocaleString()} 원` : '-',
        },
        {
            title: '권역',
            dataIndex: 'SERVICE_REGION',
            key: 'region',
            align: 'center',
            render: getRegionTag,
            filters: [
                { text: '국내', value: 'KR' },
                { text: '해외', value: 'GLOBAL' },
            ],
            onFilter: (value, record) => record.SERVICE_REGION === value,
        },
        {
            title: '등록일',
            dataIndex: 'REGISTRATION_DATE',
            key: 'registrationDate',
            align: 'center',
            sorter: (a, b) => moment(a.REGISTRATION_DATE).unix() - moment(b.REGISTRATION_DATE).unix(),
            render: (date) => date ? moment(date).format('YYYY-MM-DD') : '-',
        },
        {
            title: '관리', key: 'action', fixed: 'right', width: 100,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="수정">
                        <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} size="small" />
                    </Tooltip>
                    <Tooltip title="삭제">
                        <Popconfirm
                            title={`'${record.BOOK_NAME}' 도서를 삭제하시겠습니까?`}
                            description="삭제 작업은 되돌릴 수 없습니다."
                            onConfirm={() => handleDelete(record.key)}
                            okText="삭제"
                            cancelText="취소"
                        >
                            <Button icon={<DeleteOutlined />} danger size="small" />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><BookOutlined /> 도서 관리</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Input.Search placeholder="도서명, 저자, 출판사, ISBN 검색..." style={{ width: 300 }} allowClear/>
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
                pagination={{ pageSize: 10, showSizeChanger: true }}
                scroll={{ x: 'max-content' }}
                bordered
                size="small"
                rowKey="key"
            />

            <Modal
                title={editingBook ? "도서 정보 수정" : "새 도서 추가"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingBook ? "수정" : "추가"}
                cancelText="취소"
                destroyOnClose
                width={800}
            >
                <Form form={form} layout="vertical" name="book_form">
                    <Typography.Title level={5} style={{ marginBottom: 16, marginTop: 0 }}>기본 정보</Typography.Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="BOOK_NAME" label="도서명" rules={[{ required: true }]}> <Input /> </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ISBN" label="ISBN" rules={[{ required: true }]}> <Input /> </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="BOOK_AUTHOR" label="저자" rules={[{ required: true }]}> <Input /> </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="BOOK_PUBLISHER" label="출판사"> <Input /> </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="CONTENT_TYPE" label="콘텐츠 타입" rules={[{ required: true }]}> 
                                <Select placeholder="타입 선택"> 
                                    <Option value="10">전자책</Option> 
                                    <Option value="20">오디오북</Option> 
                                </Select> 
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="EBOOK_PUBLISH_DATE" label="출간일"> <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/> </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="REGISTRATION_DATE" label="등록일"> <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/> </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="LANGUAGE" label="언어"> 
                                <Select placeholder="언어 선택"> <Option value="ko">한국어</Option> <Option value="en">영어</Option> </Select> 
                            </Form.Item>
                        </Col>
                        <Col span={12}></Col>
                    </Row>

                    <Typography.Title level={5} style={{ marginBottom: 16, marginTop: 16 }}>상세 정보</Typography.Title>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="GENRE" label="장르"> <Input /> </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="CATEGORY_NAME" label="카테고리명"> <Input /> </Form.Item>
                        </Col>
                        <Col span={8}>
                            {/* Conditional Page Count for Ebooks */}
                            <Form.Item
                                noStyle
                                shouldUpdate={(prevValues, currentValues) => prevValues.CONTENT_TYPE !== currentValues.CONTENT_TYPE}
                            >
                                {({ getFieldValue }) =>
                                    getFieldValue('CONTENT_TYPE') === '10' ? (
                                        <Form.Item name="PAGE_COUNT" label="페이지 수"> 
                                            <InputNumber min={0} style={{ width: '100%' }}/> 
                                        </Form.Item>
                                    ) : null
                                }
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="TAGS" label="태그/키워드"> 
                        <Select mode="tags" placeholder="태그 입력 후 Enter" style={{ width: '100%' }} tokenSeparators={[',']} />
                    </Form.Item>
                    <Form.Item name="DESCRIPTION" label="책 소개"> <TextArea rows={3} /> </Form.Item>
                    <Form.Item name="TOC" label="목차"> <TextArea rows={3} placeholder="1장...\n2장..."/> </Form.Item>
                    <Form.Item name="SUMMARY" label="본문 요약(도입부)"> <TextArea rows={3} /> </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="SERIES_NAME" label="시리즈명"> <Input placeholder="(예: 해리포터)"/> </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="SERIES_NUM" label="시리즈 번호"> <InputNumber min={1} style={{ width: '100%' }}/> </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="SERIES_COUNT" label="총 시리즈 권수"> <InputNumber min={1} style={{ width: '100%' }}/> </Form.Item>
                        </Col>
                    </Row>

                    {/* Conditional Fields for Audiobooks */}
                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.CONTENT_TYPE !== currentValues.CONTENT_TYPE}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('CONTENT_TYPE') === '20' ? (
                                <>
                                    <Typography.Title level={5} style={{ marginBottom: 16, marginTop: 16 }}>오디오북 정보</Typography.Title>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item name="LEADER_NAME" label="낭독자 이름"> <Input /> </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item name="LEADER_JOB" label="낭독자 직업"> <Input placeholder="(예: 성우)"/> </Form.Item>
                                        </Col>
                                        <Col span={8}>
                                            <Form.Item name="PLAY_TIME" label="재생 시간 (HH:MM:SS)"> <Input placeholder="00:00:00"/> </Form.Item>
                                        </Col>
                                    </Row>
                                </>
                            ) : null
                        }
                    </Form.Item>

                    <Typography.Title level={5} style={{ marginBottom: 16, marginTop: 16 }}>파일 및 서비스 정보</Typography.Title>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="FILE_FORMAT" label="파일 포맷"> 
                                <Select placeholder="포맷 선택"> <Option value="EPUB">EPUB</Option> <Option value="PDF">PDF</Option> <Option value="MP3">MP3</Option> </Select> 
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="FILE_SIZE_MB" label="용량 (MB)"> <InputNumber min={0} step={0.1} style={{ width: '100%' }}/> </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="PRICE" label="가격 (원)"> <InputNumber min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\s?|(,*)/g, '')} style={{ width: '100%' }}/> </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item name="COPYRIGHT_INFO" label="저작권 정보"> <Input /> </Form.Item>
                    <Space wrap>
                        <Form.Item name="BOOK_SERVICE_YN" label="서비스 상태"> <Select style={{ width: 100 }}> <Option value="Y">서비스중</Option> <Option value="N">중지</Option> </Select> </Form.Item>
                        <Form.Item name="BOOK_EBOOK_RENT_YN" label="대여 가능"> <Select style={{ width: 100 }}> <Option value="Y">가능</Option> <Option value="N">불가</Option> </Select> </Form.Item>
                        <Form.Item name="DRM_YN" label="DRM 적용"> <Select style={{ width: 100 }}> <Option value="Y">적용</Option> <Option value="N">미적용</Option> </Select> </Form.Item>
                        <Form.Item name="BOOK_ADULT_YN" label="연령 제한"> 
                            <Select style={{ width: 100 }}> <Option value="N">전체 이용가</Option> <Option value="Y">성인</Option> </Select> 
                        </Form.Item>
                        <Form.Item name="IS_EXCLUSIVE" label="독점 콘텐츠"> <Select style={{ width: 100 }}> <Option value="Y">독점</Option> <Option value="N">일반</Option> </Select> </Form.Item>
                        <Form.Item name="SERVICE_REGION" label="제공 권역"> 
                            <Select style={{ width: 100 }}> <Option value="KR">국내</Option> <Option value="GLOBAL">해외</Option> </Select> 
                        </Form.Item>
                    </Space>
                </Form>
            </Modal>
        </Space>
    );
};

export default BookManagement; 