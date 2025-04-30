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
    Alert,
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
    FileExcelOutlined,
    FileTextOutlined,
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

    // --- State for Import Modal ---
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [importErrors, setImportErrors] = useState([]);
    const [isImporting, setIsImporting] = useState(false); // Import 진행 상태

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
            // Handle potential numeric/string inconsistencies if PRICE is sometimes string
            PRICE: typeof book.PRICE === 'string' ? parseInt(book.PRICE.replace(/,/g, ''), 10) : book.PRICE,
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
                    CATEGORY_NAME: values.CATEGORY_NAME || '', // Ensure CATEGORY_NAME is captured
                    PRICE: values.PRICE, // Price should be handled by InputNumber
                    // Ensure other numeric fields are numbers if necessary
                    FILE_SIZE_MB: values.FILE_SIZE_MB,
                    SERIES_NUM: values.SERIES_NUM,
                    SERIES_COUNT: values.SERIES_COUNT,
                };

                // Remove undefined keys to avoid sending empty strings for irrelevant fields
                Object.keys(formattedValues).forEach(key => {
                    if (formattedValues[key] === undefined || formattedValues[key] === null) { // Also check for null
                        delete formattedValues[key];
                    }
                });

                if (editingBook) {
                    // Ensure PRICE is stored as a number if it exists
                    if (formattedValues.PRICE !== undefined) {
                         formattedValues.PRICE = typeof formattedValues.PRICE === 'string'
                             ? parseInt(formattedValues.PRICE.replace(/,/g, ''), 10) || 0
                             : formattedValues.PRICE || 0;
                     }

                    const updatedBooks = books.map(book =>
                        book.key === editingBook.key ? { ...editingBook, ...formattedValues } : book
                    );
                    setBooks(updatedBooks);
                    message.success('도서 정보가 수정되었습니다.');
                    console.log('Updating book:', editingBook.key, formattedValues);
                } else {
                     // Ensure PRICE is stored as a number for new books too
                    if (formattedValues.PRICE !== undefined) {
                        formattedValues.PRICE = typeof formattedValues.PRICE === 'string'
                            ? parseInt(formattedValues.PRICE.replace(/,/g, ''), 10) || 0
                            : formattedValues.PRICE || 0;
                    }
                    const newBook = {
                        key: `book_${Date.now()}`,
                        BOOK_ID: `new_${Date.now()}`, // Consider a more robust ID generation strategy
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

    // --- Import Modal Handling ---
    const showImportModal = () => {
        setFileList([]);
        setPreviewData([]);
        setImportErrors([]);
        setIsImporting(false);
        setIsImportModalOpen(true);
    };

    const handleImportCancel = () => {
        setIsImportModalOpen(false);
        // Reset states if needed when cancelling during the process
        setFileList([]);
        setPreviewData([]);
        setImportErrors([]);
        setIsImporting(false);
    };

    const handleFileChange = (info) => {
        let file = info.file;
        let newFileList = [...info.fileList];

        // Limit to one file
        newFileList = newFileList.slice(-1);

        setFileList(newFileList);
        setPreviewData([]); // Reset preview on new file selection
        setImportErrors([]); // Reset errors

        if (newFileList.length > 0 && file.status !== 'removed') {
            // --- !!! Placeholder for Actual Parsing Logic !!! ---
            // This is where you'd integrate 'xlsx' or 'papaparse'
            // For now, we simulate parsing based on file type (rudimentary)

            console.log("File selected:", file.name, file.type);
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                let parsedData = [];
                let errors = [];

                try {
                    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
                        // --- Simulate Excel Parsing ---
                        console.log("Simulating Excel parsing...");
                        // Replace with actual XLSX.read(content, {type: 'binary'}) and XLSX.utils.sheet_to_json(...)
                        // Example simulated data structure (MUST match expected columns)
                        parsedData = [
                             { BOOK_NAME: '엑셀책 1', BOOK_AUTHOR: '작가A', ISBN: '9790000000011', PRICE: 15000, CONTENT_TYPE: '10', CATEGORY_NAME: '소설'},
                             { BOOK_NAME: '엑셀책 2', BOOK_AUTHOR: '작가B', ISBN: '9790000000012', PRICE: 20000, CONTENT_TYPE: '20', CATEGORY_NAME: '경영'},
                             { BOOK_NAME: '오류데이터', BOOK_AUTHOR: '작가C', ISBN: null, PRICE: '가격오류', CONTENT_TYPE: '10', CATEGORY_NAME: '인문'}, // Example error row
                        ];
                        message.info('엑셀 파일 미리보기 생성됨 (시뮬레이션)');

                    } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.type === 'text/csv' || file.name.endsWith('.csv')) {
                        // --- Simulate TXT/CSV Parsing (assuming tab-separated) ---
                        console.log("Simulating TXT/CSV parsing...");
                        // Replace with actual Papa.parse(content, { header: true, skipEmptyLines: true })
                        const lines = content.split('\n').filter(line => line.trim() !== '');
                        if (lines.length > 1) {
                            const headers = lines[0].split('\t').map(h => h.trim()); // Assume tab-separated, use headers
                            parsedData = lines.slice(1).map(line => {
                                const values = line.split('\t').map(v => v.trim());
                                let rowData = {};
                                headers.forEach((header, index) => {
                                     rowData[header] = values[index] || null; // Handle empty values
                                });
                                // Attempt basic type conversion (example for PRICE)
                                if (rowData.PRICE) {
                                     const priceNum = parseInt(String(rowData.PRICE).replace(/,/g, ''));
                                     rowData.PRICE = isNaN(priceNum) ? rowData.PRICE : priceNum; // Keep original if conversion fails
                                 }
                                 if (rowData.CONTENT_TYPE) rowData.CONTENT_TYPE = String(rowData.CONTENT_TYPE); // Ensure string

                                return rowData;
                            });
                             message.info('TXT/CSV 파일 미리보기 생성됨 (시뮬레이션)');
                        } else {
                            errors.push("파일 형식이 올바르지 않거나 데이터가 없습니다.");
                        }

                    } else {
                         errors.push(`지원하지 않는 파일 형식입니다: ${file.type || '알 수 없음'}`);
                    }

                    // --- Basic Validation (Example) ---
                    const validatedData = [];
                    parsedData.forEach((row, index) => {
                        if (!row.BOOK_NAME || !row.BOOK_AUTHOR || !row.ISBN || !row.CATEGORY_NAME || !row.CONTENT_TYPE) {
                             errors.push(`[${index + 1}행] 필수 필드 누락: 도서명, 저자, ISBN, 카테고리, 콘텐츠 타입`);
                         } else if (row.PRICE !== undefined && typeof row.PRICE !== 'number') {
                             errors.push(`[${index + 1}행] 가격(${row.PRICE})은 숫자여야 합니다.`);
                         } else {
                             validatedData.push(row);
                         }
                    });

                    setPreviewData(validatedData); // Show only potentially valid data in preview
                    setImportErrors(errors); // Show all errors found

                } catch (error) {
                    console.error("Parsing failed:", error);
                    setImportErrors([`파일 처리 중 오류 발생: ${error.message}`]);
                    setPreviewData([]);
                }
            };

            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
                 reader.readAsArrayBuffer(file.originFileObj || file); // Use originFileObj for ArrayBuffer
             } else if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.type === 'text/csv' || file.name.endsWith('.csv')) {
                 reader.readAsText(file.originFileObj || file); // Use originFileObj for text reading
             } else {
                  message.error(`지원하지 않는 파일 형식입니다: ${file.type || '알 수 없음'}`);
                  setFileList([]); // Clear file list if unsupported
                  setImportErrors([`지원하지 않는 파일 형식입니다.`]);
              }
        } else if (file.status === 'removed') {
            // Handle file removal if needed
             setFileList([]);
             setPreviewData([]);
             setImportErrors([]);
        }
    };

    const handleImport = () => {
        if (previewData.length === 0) {
            message.error('Import할 데이터가 없습니다. 파일을 업로드하고 내용을 확인해주세요.');
            return;
        }
        if (importErrors.some(err => err.includes("필수 필드 누락") || err.includes("가격"))) { // Only block on critical errors
            message.error('데이터 오류를 수정 후 다시 시도해주세요. 오류 목록을 확인하세요.');
            return;
        }

        setIsImporting(true);
        setImportErrors([]); // Clear previous non-blocking errors before import

        // --- Simulate Import Process ---
        console.log("Starting import process...");
        // In a real app, you might send 'previewData' to a backend API

        const newBooks = previewData.map((bookData, index) => ({
             ...bookData, // Spread the parsed data
             key: `imported_${Date.now()}_${index}`, // Generate a unique key
             BOOK_ID: `imported_id_${Date.now()}_${index}`, // Generate a unique ID (should be better)
             // Apply default values or transformations if needed
             BOOK_SERVICE_YN: bookData.BOOK_SERVICE_YN || 'N',
             BOOK_EBOOK_RENT_YN: bookData.BOOK_EBOOK_RENT_YN || 'N',
             DRM_YN: bookData.DRM_YN || 'N',
             BOOK_ADULT_YN: bookData.BOOK_ADULT_YN || 'N',
             IS_EXCLUSIVE: bookData.IS_EXCLUSIVE || 'N',
             SERVICE_REGION: bookData.SERVICE_REGION || 'KR',
             REGISTRATION_DATE: moment().format('YYYY-MM-DD'), // Set registration date to now
             // Ensure numeric types
             PRICE: typeof bookData.PRICE === 'string' ? parseInt(bookData.PRICE.replace(/,/g, ''), 10) || 0 : bookData.PRICE || 0,
             PAGE_COUNT: bookData.PAGE_COUNT ? parseInt(bookData.PAGE_COUNT, 10) : null,
             FILE_SIZE_MB: bookData.FILE_SIZE_MB ? parseFloat(bookData.FILE_SIZE_MB) : null,
             SERIES_NUM: bookData.SERIES_NUM ? parseInt(bookData.SERIES_NUM, 10) : null,
             SERIES_COUNT: bookData.SERIES_COUNT ? parseInt(bookData.SERIES_COUNT, 10) : null,
             // Ensure arrays/strings
             TAGS: bookData.TAGS ? (Array.isArray(bookData.TAGS) ? bookData.TAGS : String(bookData.TAGS).split(',').map(t => t.trim())) : [],
             EBOOK_PUBLISH_DATE: bookData.EBOOK_PUBLISH_DATE ? moment(bookData.EBOOK_PUBLISH_DATE).format('YYYY-MM-DD') : null, // Format date
             // Ensure other fields are strings or null/undefined
              BOOK_PUBLISHER: bookData.BOOK_PUBLISHER || '',
              GENRE: bookData.GENRE || '',
              PLAY_TIME: bookData.CONTENT_TYPE === '20' ? (bookData.PLAY_TIME || '00:00:00') : undefined,
              LEADER_NAME: bookData.CONTENT_TYPE === '20' ? (bookData.LEADER_NAME || '') : undefined,
              LEADER_JOB: bookData.CONTENT_TYPE === '20' ? (bookData.LEADER_JOB || '') : undefined,
              LANGUAGE: bookData.LANGUAGE || 'ko',
              DESCRIPTION: bookData.DESCRIPTION || '',
              TOC: bookData.TOC || '',
              SUMMARY: bookData.SUMMARY || '',
              SERIES_NAME: bookData.SERIES_NAME || '',
              FILE_FORMAT: bookData.FILE_FORMAT || '',
              COPYRIGHT_INFO: bookData.COPYRIGHT_INFO || '',
              AGE_GROUP: bookData.AGE_GROUP || 'all',
              // Fields likely not in basic import
              // BOOK_COVER_IMAGE: bookData.BOOK_COVER_IMAGE || undefined,
              // TAKE_COUNT: bookData.TAKE_COUNT || undefined,
              // CATEGORY_SEQ: bookData.CATEGORY_SEQ || undefined, // Might need lookup based on CATEGORY_NAME
        }));

        // Simulate API call delay
        setTimeout(() => {
            setBooks(prevBooks => [...prevBooks, ...newBooks]);
            message.success(`${newBooks.length}개의 도서가 성공적으로 등록되었습니다.`);
            setIsImporting(false);
            setIsImportModalOpen(false);
            setFileList([]);
            setPreviewData([]);
             setImportErrors([]);
        }, 1500); // Simulate network latency
    };

    // --- Updated Table Columns Definition (existing columns remain same) ---
     const columns = [
        {
            title: '표지', dataIndex: 'BOOK_COVER_IMAGE', key: 'cover', width: 60,
            render: (url) => <Image src={url || 'https://via.placeholder.com/40x60.png?text=N/A'} alt="Cover" width={30} preview={false} fallback="https://via.placeholder.com/40x60.png?text=Err"/>,
        },
        { title: '카테고리', dataIndex: 'CATEGORY_NAME', key: 'categoryName', width: 100, ellipsis: true },
        {
            title: '콘텐츠', dataIndex: 'CONTENT_TYPE', key: 'contentType', align: 'center', width: 100,
            render: getContentTypeTag,
            filters: [{ text: '전자책', value: '10' }, { text: '오디오북', value: '20' }],
            onFilter: (value, record) => record.CONTENT_TYPE === value,
        },
        {
             title: '도서명', dataIndex: 'BOOK_NAME', key: 'title', width: 200,
             sorter: (a, b) => a.BOOK_NAME.localeCompare(b.BOOK_NAME),
             render: (text) => <Text style={{maxWidth: 180}} ellipsis={{ tooltip: text }}>{text}</Text>
         },
         { title: '저자', dataIndex: 'BOOK_AUTHOR', key: 'author', width: 120, ellipsis: true },
         { title: '출판사', dataIndex: 'BOOK_PUBLISHER', key: 'publisher', width: 120, ellipsis: true },
         { title: 'ISBN', dataIndex: 'ISBN', key: 'isbn', width: 130, ellipsis: true },
         //{ title: '장르', dataIndex: 'GENRE', key: 'genre', width: 100, ellipsis: true }, // Hiding less critical columns for space
        {
            title: '서비스', dataIndex: 'BOOK_SERVICE_YN', key: 'service', align: 'center', width: 80,
            render: (yn) => <Tag color={yn === 'Y' ? 'success' : 'default'} icon={yn === 'Y' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>{yn === 'Y' ? 'Y' : 'N'}</Tag>,
            filters: [{ text: 'Y', value: 'Y' }, { text: 'N', value: 'N' }],
            onFilter: (value, record) => record.BOOK_SERVICE_YN === value,
        },
        {
            title: 'DRM', dataIndex: 'DRM_YN', key: 'drm', align: 'center', width: 70,
            render: (yn) => <Tag color={yn === 'Y' ? 'orange' : 'default'} icon={yn === 'Y' ? <SafetyOutlined /> : null}>{yn === 'Y' ? 'Y' : 'N'}</Tag>,
            filters: [{ text: 'Y', value: 'Y' }, { text: 'N', value: 'N' }],
            onFilter: (value, record) => record.DRM_YN === value,
        },
        {
            title: '가격', dataIndex: 'PRICE', key: 'price', align: 'right', width: 100,
             sorter: (a, b) => (Number(a.PRICE) || 0) - (Number(b.PRICE) || 0), // Ensure numeric comparison
             render: (price) => price ? `${Number(price).toLocaleString()} 원` : '-',
         },
         {
            title: '권역', dataIndex: 'SERVICE_REGION', key: 'region', align: 'center', width: 70,
            render: getRegionTag,
            filters: [{ text: '국내', value: 'KR' }, { text: '해외', value: 'GLOBAL' }],
            onFilter: (value, record) => record.SERVICE_REGION === value,
        },
        {
            title: '등록일', dataIndex: 'REGISTRATION_DATE', key: 'registrationDate', align: 'center', width: 110,
            sorter: (a, b) => moment(a.REGISTRATION_DATE).unix() - moment(b.REGISTRATION_DATE).unix(),
            render: (date) => date ? moment(date).format('YYYY-MM-DD') : '-',
        },
        {
            title: '관리', key: 'action', fixed: 'right', width: 100, align: 'center',
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

    // --- Columns for Preview Table ---
    const previewColumns = [
         { title: '도서명', dataIndex: 'BOOK_NAME', key: 'BOOK_NAME', width: 150, ellipsis: true },
         { title: '저자', dataIndex: 'BOOK_AUTHOR', key: 'BOOK_AUTHOR', width: 100, ellipsis: true },
         { title: 'ISBN', dataIndex: 'ISBN', key: 'ISBN', width: 120, ellipsis: true },
         { title: '카테고리', dataIndex: 'CATEGORY_NAME', key: 'CATEGORY_NAME', width: 100, ellipsis: true},
         { title: '타입', dataIndex: 'CONTENT_TYPE', key: 'CONTENT_TYPE', width: 80, render: (val) => val === '10' ? '전자책' : (val === '20' ? '오디오북' : '알수없음') },
         { title: '가격', dataIndex: 'PRICE', key: 'PRICE', width: 80, align: 'right', render: (val) => typeof val === 'number' ? val.toLocaleString() : val },
         // Add more columns as needed for preview
     ];

    return (
        <Space direction="vertical" size="large" style={{ display: 'flex' }}>
            <Title level={2}><BookOutlined /> 도서 관리</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <Input.Search placeholder="도서명, 저자, 출판사, ISBN 검색..." style={{ width: 300 }} allowClear/>
                <Space>
                    {/* Import Button */}
                    <Button
                        icon={<UploadOutlined />}
                        onClick={showImportModal}
                    >
                        대량 등록
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showAddModal}
                    >
                        새 도서 추가
                    </Button>
                 </Space>
            </div>

            <Table
                columns={columns}
                dataSource={books}
                pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100'] }}
                scroll={{ x: 1500 }} // Adjust scroll width based on columns
                bordered
                size="small"
                rowKey="key"
            />

            {/* Add/Edit Modal (Existing) */}
            <Modal
                title={editingBook ? "도서 정보 수정" : "새 도서 추가"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={editingBook ? "수정" : "추가"}
                cancelText="취소"
                destroyOnClose
                width={800}
                bodyStyle={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}
            >
              {/* Form content remains the same */}
               <Form form={form} layout="vertical" name="book_form">
                    <Typography.Title level={5} style={{ marginBottom: 16, marginTop: 0 }}>기본 정보</Typography.Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="BOOK_NAME" label="도서명" rules={[{ required: true, message: '도서명을 입력해주세요.' }]}> <Input /> </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="ISBN" label="ISBN" rules={[{ required: true, message: 'ISBN을 입력해주세요.'}]}> <Input /> </Form.Item>
                        </Col>
                    </Row>
                     <Row gutter={16}>
                         <Col span={12}>
                             <Form.Item name="BOOK_AUTHOR" label="저자" rules={[{ required: true, message: '저자를 입력해주세요.' }]}> <Input /> </Form.Item>
                         </Col>
                         <Col span={12}>
                             <Form.Item name="BOOK_PUBLISHER" label="출판사"> <Input /> </Form.Item>
                         </Col>
                     </Row>
                     <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="CONTENT_TYPE" label="콘텐츠 타입" rules={[{ required: true, message: '콘텐츠 타입을 선택해주세요.' }]}>
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
                         <Col span={8}>
                             <Form.Item name="LANGUAGE" label="언어">
                                 <Select placeholder="언어 선택" allowClear> <Option value="ko">한국어</Option> <Option value="en">영어</Option> /* 다른 언어 추가 */ </Select>
                             </Form.Item>
                         </Col>
                        <Col span={8}>
                            <Form.Item name="PRICE" label="가격 (원)">
                                 <InputNumber min={0} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\s?원?|(,*)/g, '')} style={{ width: '100%' }}/>
                            </Form.Item>
                         </Col>
                     </Row>

                    <Typography.Title level={5} style={{ marginBottom: 16, marginTop: 16 }}>상세 정보</Typography.Title>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="GENRE" label="장르"> <Input /> </Form.Item>
                        </Col>
                        <Col span={8}>
                             <Form.Item name="CATEGORY_NAME" label="카테고리" rules={[{ required: true, message: '카테고리를 선택해주세요.' }]}>
                                {/* Provide actual category options based on your system */}
                                <Select placeholder="카테고리 선택">
                                    <Option value="소설">소설</Option>
                                     <Option value="시/에세이">시/에세이</Option>
                                     <Option value="인문">인문</Option>
                                     <Option value="사회과학">사회과학</Option>
                                     <Option value="경영/경제">경영/경제</Option>
                                     <Option value="자기계발">자기계발</Option>
                                     <Option value="IT/컴퓨터">IT/컴퓨터</Option>
                                     {/* Add other categories */}
                                </Select>
                            </Form.Item>
                         </Col>
                        <Col span={8}>
                            {/* Conditional Page Count for Ebooks */}
                             <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.CONTENT_TYPE !== currentValues.CONTENT_TYPE}>
                                 {({ getFieldValue }) => getFieldValue('CONTENT_TYPE') === '10' ? (
                                     <Form.Item name="PAGE_COUNT" label="페이지 수"> <InputNumber min={0} style={{ width: '100%' }}/> </Form.Item>
                                 ) : null }
                             </Form.Item>
                         </Col>
                     </Row>
                     <Form.Item name="TAGS" label="태그/키워드"> <Select mode="tags" placeholder="태그 입력 후 Enter" style={{ width: '100%' }} tokenSeparators={[',']} /> </Form.Item>
                     <Form.Item name="DESCRIPTION" label="책 소개"> <TextArea rows={3} /> </Form.Item>
                     <Form.Item name="TOC" label="목차"> <TextArea rows={3} placeholder="1장...\n2장..."/> </Form.Item>
                     <Form.Item name="SUMMARY" label="본문 요약(도입부)"> <TextArea rows={3} /> </Form.Item>
                    <Row gutter={16}>
                        <Col span={8}> <Form.Item name="SERIES_NAME" label="시리즈명"> <Input placeholder="(예: 해리포터)"/> </Form.Item> </Col>
                        <Col span={8}> <Form.Item name="SERIES_NUM" label="시리즈 번호"> <InputNumber min={1} style={{ width: '100%' }}/> </Form.Item> </Col>
                        <Col span={8}> <Form.Item name="SERIES_COUNT" label="총 시리즈 권수"> <InputNumber min={1} style={{ width: '100%' }}/> </Form.Item> </Col>
                     </Row>

                    {/* Conditional Fields for Audiobooks */}
                     <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.CONTENT_TYPE !== currentValues.CONTENT_TYPE}>
                         {({ getFieldValue }) => getFieldValue('CONTENT_TYPE') === '20' ? (
                             <>
                                <Typography.Title level={5} style={{ marginBottom: 16, marginTop: 16 }}>오디오북 정보</Typography.Title>
                                <Row gutter={16}>
                                     <Col span={8}> <Form.Item name="LEADER_NAME" label="낭독자 이름"> <Input /> </Form.Item> </Col>
                                     <Col span={8}> <Form.Item name="LEADER_JOB" label="낭독자 직업"> <Input placeholder="(예: 성우)"/> </Form.Item> </Col>
                                     <Col span={8}> <Form.Item name="PLAY_TIME" label="재생 시간 (HH:MM:SS)"> <Input placeholder="00:00:00"/> </Form.Item> </Col>
                                 </Row>
                             </>
                         ) : null }
                     </Form.Item>

                    <Typography.Title level={5} style={{ marginBottom: 16, marginTop: 16 }}>파일 및 서비스 정보</Typography.Title>
                    <Row gutter={16}>
                         <Col span={8}>
                            <Form.Item name="FILE_FORMAT" label="파일 포맷">
                                <Select placeholder="포맷 선택" allowClear> <Option value="EPUB">EPUB</Option> <Option value="PDF">PDF</Option> <Option value="MP3">MP3</Option> <Option value="TXT">TXT</Option></Select>
                            </Form.Item>
                         </Col>
                         <Col span={8}> <Form.Item name="FILE_SIZE_MB" label="용량 (MB)"> <InputNumber min={0} step={0.1} style={{ width: '100%' }}/> </Form.Item> </Col>
                        <Col span={8}>
                            <Form.Item name="COPYRIGHT_INFO" label="저작권 정보"> <Input /> </Form.Item>
                         </Col>
                     </Row>
                     {/* Cover Image Upload - Consider adding later if needed in modal */}
                     {/* <Form.Item name="BOOK_COVER_IMAGE" label="표지 이미지 URL"> <Input placeholder="https://..."/> </Form.Item> */}
                     {/* Or Use Upload Component */}
                     {/* <Form.Item label="표지 이미지 업로드"> <Upload><Button icon={<UploadOutlined />}>파일 선택</Button></Upload> </Form.Item> */}

                     <Space wrap style={{ marginTop: '10px'}}>
                         <Form.Item name="BOOK_SERVICE_YN" label="서비스 상태" initialValue="Y"> <Select style={{ width: 120 }}> <Option value="Y">서비스중</Option> <Option value="N">중지</Option> </Select> </Form.Item>
                         <Form.Item name="BOOK_EBOOK_RENT_YN" label="대여 가능" initialValue="Y"> <Select style={{ width: 120 }}> <Option value="Y">가능</Option> <Option value="N">불가</Option> </Select> </Form.Item>
                         <Form.Item name="DRM_YN" label="DRM 적용" initialValue="Y"> <Select style={{ width: 120 }}> <Option value="Y">적용</Option> <Option value="N">미적용</Option> </Select> </Form.Item>
                         <Form.Item name="BOOK_ADULT_YN" label="연령 제한" initialValue="N"> <Select style={{ width: 120 }}> <Option value="N">전체 이용가</Option> <Option value="Y">성인</Option> </Select> </Form.Item>
                         <Form.Item name="IS_EXCLUSIVE" label="독점 콘텐츠" initialValue="N"> <Select style={{ width: 120 }}> <Option value="Y">독점</Option> <Option value="N">일반</Option> </Select> </Form.Item>
                         <Form.Item name="SERVICE_REGION" label="제공 권역" initialValue="KR"> <Select style={{ width: 120 }}> <Option value="KR">국내</Option> <Option value="GLOBAL">해외</Option> </Select> </Form.Item>
                     </Space>
                </Form>
            </Modal>

            {/* Import Modal */}
            <Modal
                title="도서 대량 등록 (Excel/TXT)"
                open={isImportModalOpen}
                onCancel={handleImportCancel}
                footer={[
                    <Button key="back" onClick={handleImportCancel}>
                        취소
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={isImporting}
                        onClick={handleImport}
                        disabled={previewData.length === 0 || fileList.length === 0 || isImporting || importErrors.some(err => err.includes("필수 필드 누락") || err.includes("가격")) } // Disable if no data, file, importing, or critical errors
                    >
                        {isImporting ? '등록 중...' : `${previewData.length}개 도서 등록`}
                    </Button>,
                ]}
                width={1000} // Wider modal for table preview
                destroyOnClose // Reset state when closed
            >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                     <Alert
                         message="파일 형식 안내"
                         description={
                             <div>
                                 <p>Excel (.xlsx) 또는 텍스트 (.txt, .csv - 탭으로 구분) 파일을 업로드해주세요.</p>
                                 <p>첫 번째 행은 헤더(컬럼명)여야 합니다. 필수 컬럼: <strong>BOOK_NAME, BOOK_AUTHOR, ISBN, CATEGORY_NAME, CONTENT_TYPE</strong></p>
                                 <p>선택 컬럼 예시: BOOK_PUBLISHER, GENRE, PRICE, EBOOK_PUBLISH_DATE (YYYY-MM-DD), TAGS (쉼표로 구분), DESCRIPTION 등</p>
                                 {/* <Link href="/path/to/template.xlsx" target="_blank">템플릿 파일 다운로드</Link> */}
                             </div>
                         }
                         type="info"
                         showIcon
                     />

                    <Upload.Dragger
                        name="file"
                        accept=".xlsx, .txt, .csv" // Accept specific file types
                        multiple={false} // Allow only single file upload
                        fileList={fileList}
                        beforeUpload={() => false} // Prevent default upload behavior, handle manually
                        onChange={handleFileChange}
                        onRemove={() => { // Clear state on remove
                            setFileList([]);
                            setPreviewData([]);
                            setImportErrors([]);
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <FileExcelOutlined style={{ color: '#1890ff', marginRight: '8px' }}/>
                            <FileTextOutlined style={{ color: '#faad14' }}/>
                        </p>
                        <p className="ant-upload-text">클릭하거나 파일을 이곳으로 드래그하여 업로드하세요.</p>
                        <p className="ant-upload-hint">
                             Excel (.xlsx) 또는 텍스트 (.txt, .csv) 파일 1개만 가능합니다.
                        </p>
                    </Upload.Dragger>

                    {importErrors.length > 0 && (
                         <Alert
                             message="데이터 검증 오류"
                             description={
                                 <ul style={{ paddingLeft: 20, maxHeight: '150px', overflowY: 'auto' }}>
                                     {importErrors.map((error, index) => <li key={index}>{error}</li>)}
                                 </ul>
                             }
                             type="error"
                             showIcon
                             closable
                             onClose={() => setImportErrors([])} // Allow closing the error message
                         />
                    )}

                    {previewData.length > 0 && (
                        <div>
                             <Title level={5}>미리보기 (상위 {previewData.length}개 데이터)</Title>
                             <Table
                                 columns={previewColumns}
                                 dataSource={previewData}
                                 pagination={false} // No pagination for preview
                                 size="small"
                                 bordered
                                 scroll={{ y: 240 }} // Scrollable preview table
                                 rowKey={(record, index) => `preview_${index}`} // Simple key for preview
                             />
                        </div>
                    )}
                </Space>
            </Modal>
        </Space>
    );
};

export default BookManagement; 