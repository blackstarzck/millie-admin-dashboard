import {
  BookOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  Transfer,
  Typography
} from "antd";
import React, { useCallback, useMemo, useState } from "react";
import { initialBooks as allBookData, subCategoryMap } from "./BookManagement"; // BookManagement에서 initialBooks 가져오기

const { Title, Text, Link } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Transfer 컴포넌트에 표시할 테이블 UI 정의
const BookTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === "left" ? leftColumns : rightColumns;
      const rowSelection = {
        getCheckboxProps: () => ({ disabled: listDisabled }),
        onSelectAll(selected, selectedRows, changeRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          onItemSelectAll(treeSelectedKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };
      return (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredItems}
          size="small"
          style={{ pointerEvents: listDisabled ? "none" : undefined }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return;
              onItemSelect(key, !listSelectedKeys.includes(key));
            },
          })}
        />
      );
    }}
  </Transfer>
);

const bookTableColumns = [
  {
    dataIndex: "BOOK_NAME",
    title: "도서명",
    ellipsis: true,
  },
  {
    dataIndex: "AUTHOR",
    title: "저자",
    width: 80,
    ellipsis: true,
  },
  {
    dataIndex: "CATEGORY",
    title: "카테고리",
    width: 90,
    ellipsis: true,
  },
];

const bookFilterOption = (inputValue, item) =>
  item.BOOK_NAME.includes(inputValue) ||
  item.AUTHOR.includes(inputValue) ||
  item.CATEGORY.includes(inputValue);

// allBookData에 title 속성 추가 (Transfer 컴포넌트의 검색 기능이 title 속성을 사용하기 때문)
const transferDataSource = allBookData.map((book) => ({
  ...book,
  title: book.BOOK_NAME, // 검색을 위해 title 속성 추가
}));

// 초기 시리즈 데이터 가공 함수 (useMemo 내부로 이동하여 allBookData 변경에 반응하도록 수정)
const processSeriesData = (books) => {
  const seriesMap = new Map(); // 시리즈명 -> { key, name, bookCount, books: [{bookKey, bookName, seriesNum}], firstRegistrationDate, totalBooksInSeries (initialBooks 기준) }
  let nextId = 1;

  // 더미 카테고리 데이터
  const dummyCategories = [
    { main: "소설", sub: "판타지" },
    { main: "소설", sub: "로맨스" },
    { main: "자기계발", sub: "경제/경영" },
    { main: "자기계발", sub: "심리" },
    { main: "만화", sub: "판타지" },
    { main: "만화", sub: "액션" },
  ];

  books.forEach((book) => {
    if (book.SERIES_NAME && book.SERIES_NAME.trim() !== "") {
      let seriesDetail;
      if (!seriesMap.has(book.SERIES_NAME)) {
        const currentId = nextId++;
        // 랜덤하게 카테고리 선택
        const randomCategory =
          dummyCategories[Math.floor(Math.random() * dummyCategories.length)];
        seriesDetail = {
          id: currentId,
          key: currentId,
          name: book.SERIES_NAME,
          bookCount: 0,
          booksInCurrentList: [],
          firstRegistrationDate: book.REGISTRATION_DATE,
          category: randomCategory.main,
          subCategory: randomCategory.sub,
          introduction: "",
        };
        seriesMap.set(book.SERIES_NAME, seriesDetail);
      } else {
        seriesDetail = seriesMap.get(book.SERIES_NAME);
      }

      seriesDetail.bookCount += 1;
      seriesDetail.booksInCurrentList.push({
        bookKey: book.key,
        bookName: book.BOOK_NAME,
        seriesNum: book.SERIES_NUM,
        bookServiceYN: book.BOOK_SERVICE_YN,
      });

      if (
        book.REGISTRATION_DATE &&
        (!seriesDetail.firstRegistrationDate ||
          new Date(book.REGISTRATION_DATE) <
            new Date(seriesDetail.firstRegistrationDate))
      ) {
        seriesDetail.firstRegistrationDate = book.REGISTRATION_DATE;
      }
    }
  });

  // booksInCurrentList를 seriesNum 기준으로 정렬
  seriesMap.forEach((series) => {
    series.booksInCurrentList.sort((a, b) => {
      if (a.seriesNum == null) return 1; // null이나 undefined는 뒤로
      if (b.seriesNum == null) return -1;
      return a.seriesNum - b.seriesNum;
    });
  });

  return Array.from(seriesMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

const SeriesManagement = () => {
  // allBookData는 외부에서 오므로, 이를 기반으로 초기 상태를 설정합니다.
  // 이 페이지에서 시리즈를 추가/삭제/수정하는 것은 allBookData를 직접 변경하지 않고,
  // 이 컴포넌트의 내부 상태인 'seriesDisplayList'를 관리합니다.
  const [seriesDisplayList, setSeriesDisplayList] = useState(() =>
    processSeriesData(allBookData)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null); // 현재 수정 중인 시리즈 객체
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태 추가
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filteredSeriesOptions, setFilteredSeriesOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태 추가

  // BookManagement에서 가져온 원본 도서 목록을 기반으로 시리즈 정보를 계산 (화면 표시는 seriesDisplayList 사용)
  const seriesAnalytics = useMemo(() => {
    const analytics = {};
    allBookData.forEach((book) => {
      if (book.SERIES_NAME && book.SERIES_NAME.trim() !== "") {
        if (!analytics[book.SERIES_NAME]) {
          analytics[book.SERIES_NAME] = {
            totalBookCount: 0,
            bookIds: new Set(),
          };
        }
        analytics[book.SERIES_NAME].bookIds.add(book.BOOK_ID || book.key);
      }
    });
    Object.keys(analytics).forEach((seriesName) => {
      analytics[seriesName].totalBookCount = analytics[seriesName].bookIds.size;
    });
    return analytics;
  }, [allBookData]); // allBookData는 변경되지 않는다고 가정, 실제 앱에서는 props나 context로 관리

  const handleAddSeries = () => {
    setEditingSeries(null);
    form.resetFields();
    setSelectedCategory(null); // 모달 열 때 선택된 카테고리 초기화
    setIsModalOpen(true);
  };

  const handleEditSeries = (series) => {
    setEditingSeries(series);
    form.setFieldsValue({
      name: series.name,
      category: series.category,
      subCategory: series.subCategory,
      introduction: series.introduction,
      books: series.booksInCurrentList.map((book) => book.bookKey),
    });
    setSelectedCategory(series.category); // 수정 시 기존 카테고리 설정
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setEditingSeries(null);
    form.resetFields();
    setSelectedCategory(null); // 모달 닫을 때 선택된 카테고리 초기화
  };

  const handleFormSubmit = useCallback(() => {
    form
      .validateFields()
      .then((values) => {
        // 도서 선택 처리 (Transfer 컴포넌트의 targetKeys가 values.books로 넘어옴)
        const selectedBooks = values.books
          ? allBookData
              .filter((book) => values.books.includes(book.key))
              .map((book) => ({
                bookKey: book.key,
                bookName: book.BOOK_NAME,
                seriesNum: book.SERIES_NUM,
                bookServiceYN: book.BOOK_SERVICE_YN,
              }))
          : [];

        // 도서를 seriesNum 기준으로 정렬
        selectedBooks.sort((a, b) => {
          if (a.seriesNum == null) return 1;
          if (b.seriesNum == null) return -1;
          return a.seriesNum - b.seriesNum;
        });

        const seriesData = {
          name: values.name,
          category: values.category,
          subCategory: values.subCategory,
          introduction: values.introduction,
          booksInCurrentList: selectedBooks,
          bookCount: selectedBooks.length,
        };

        if (editingSeries) {
          if (
            seriesDisplayList.some(
              (s) => s.name === values.name && s.key !== editingSeries.key
            )
          ) {
            message.error("이미 존재하는 시리즈명입니다.");
            return;
          }
          setSeriesDisplayList((prevList) =>
            prevList.map((s) =>
              s.key === editingSeries.key ? { ...s, ...seriesData } : s
            )
          );
          message.success("시리즈가 수정되었습니다.");
        } else {
          if (seriesDisplayList.some((s) => s.name === values.name)) {
            message.error("이미 존재하는 시리즈명입니다.");
            return;
          }
          const newId =
            seriesDisplayList.length > 0
              ? Math.max(...seriesDisplayList.map((s) => s.id)) + 1
              : 1;
          const newSeries = {
            id: newId,
            key: newId,
            ...seriesData,
            bookCount: seriesData.bookCount, // bookCount도 seriesData에서 가져옴
            booksInCurrentList: seriesData.booksInCurrentList, // booksInCurrentList도 seriesData에서 가져옴
            firstRegistrationDate: new Date().toISOString().split("T")[0],
          };
          setSeriesDisplayList((prevList) =>
            [...prevList, newSeries].sort((a, b) =>
              a.name.localeCompare(b.name)
            )
          );
          message.success("새 시리즈가 추가되었습니다.");
        }
        handleCancelModal();
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  }, [form, editingSeries, seriesDisplayList]);

  const handleDeleteSeries = useCallback((seriesKey) => {
    setSeriesDisplayList((prevList) =>
      prevList.filter((s) => s.key !== seriesKey)
    );
    message.success(`'${seriesKey}' 시리즈가 삭제되었습니다.`);
  }, []);

  // 시리즈 내 도서 서비스 상태 변경 핸들러
  const handleBookServiceStatusChange = useCallback(
    (bookKey, newStatusYN, seriesKey) => {
      setSeriesDisplayList((prevList) =>
        prevList.map((series) => {
          if (series.key === seriesKey) {
            return {
              ...series,
              booksInCurrentList: series.booksInCurrentList.map((book) =>
                book.bookKey === bookKey
                  ? { ...book, bookServiceYN: newStatusYN }
                  : book
              ),
            };
          }
          return series;
        })
      );
      message.success(
        `시리즈 '${seriesKey}'의 도서 '${bookKey}' 서비스 상태가 변경되었습니다 (화면 표시용).`
      );
    },
    []
  );

  // 확장된 행에 표시될 도서 목록 테이블의 컬럼
  const expandedBookColumns = [
    {
      title: "번호",
      dataIndex: "seriesNum",
      key: "seriesNum",
      width: 80,
      align: "center",
      render: (num) => (num != null ? `Vol.${num}` : "-"),
    },
    {
      title: "도서명",
      dataIndex: "bookName",
      key: "bookName",
      ellipsis: true,
    },
    {
      title: "상태",
      dataIndex: "bookServiceYN",
      key: "status",
      width: 120,
      align: "center",
      render: (bookServiceYN, bookRecord) => {
        // 현재 확장된 시리즈의 key를 expandedRowKeys에서 가져옵니다.
        // (단일 확장 모드를 가정, 여러 행 동시 확장은 고려하지 않음)
        const currentExpandedSeriesKey = expandedRowKeys[0];
        return (
          <Switch
            checked={bookServiceYN === "Y"}
            checkedChildren="서비스중"
            unCheckedChildren="중지"
            onChange={(checked) =>
              handleBookServiceStatusChange(
                bookRecord.bookKey,
                checked ? "Y" : "N",
                currentExpandedSeriesKey
              )
            }
          />
        );
      },
    },
    // 필요하다면 여기에 더 많은 도서 정보 컬럼 추가 (예: 저자, 출판일 등)
    // 이 경우 processSeriesData에서 booksInCurrentList에 해당 정보를 포함시켜야 함
  ];

  // 검색어에 따라 필터링된 시리즈 목록
  const filteredSeriesList = useMemo(() => {
    if (!searchTerm) {
      return seriesDisplayList;
    }
    return seriesDisplayList.filter((series) =>
      series.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [seriesDisplayList, searchTerm]);

  const columns = [
    {
      title: "시리즈 ID",
      dataIndex: "id",
      key: "seriesId",
      width: 120,
      align: "center",
      sorter: (a, b) => a.id - b.id,
      render: (id) => <Text>{id}</Text>,
    },
    {
      title: "시리즈명",
      dataIndex: "name",
      key: "name",
      width: 250,
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "카테고리",
      dataIndex: "category",
      key: "category",
      width: 120,
      align: "center",
      sorter: (a, b) => a.category.localeCompare(b.category),
      filters: [
        { text: "소설", value: "소설" },
        { text: "자기계발", value: "자기계발" },
        { text: "만화", value: "만화" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "하위 카테고리",
      dataIndex: "subCategory",
      key: "subCategory",
      width: 120,
      align: "center",
      sorter: (a, b) => a.subCategory.localeCompare(b.subCategory),
      filters: [
        { text: "판타지", value: "판타지" },
        { text: "로맨스", value: "로맨스" },
        { text: "경제/경영", value: "경제/경영" },
        { text: "심리", value: "심리" },
        { text: "액션", value: "액션" },
      ],
      onFilter: (value, record) => record.subCategory === value,
    },
    {
      title: (
        <Tooltip title="실제 원본 데이터(initialBooks) 기준 해당 시리즈의 총 고유 도서 수">
          총 도서 수 <InfoCircleOutlined />
        </Tooltip>
      ),
      dataIndex: "name",
      key: "totalBookCount",
      align: "right",
      sorter: (a, b) =>
        (seriesAnalytics[a.name]?.totalBookCount || 0) -
        (seriesAnalytics[b.name]?.totalBookCount || 0),
      render: (seriesName) => {
        const count = seriesAnalytics[seriesName]?.totalBookCount || 0;
        return <Tag color={count > 0 ? "blue" : "default"}>{count} 권</Tag>;
      },
    },
    {
      title: "최초 등록일 (추정)",
      dataIndex: "firstRegistrationDate",
      key: "firstRegistrationDate",
      align: "center",
      sorter: (a, b) =>
        new Date(a.firstRegistrationDate) - new Date(b.firstRegistrationDate),
      render: (date) => (date ? date : "-"),
    },
    {
      title: "관리",
      key: "action",
      align: "center",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="수정">
            <Button
              icon={<EditOutlined />}
              onClick={() => handleEditSeries(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title={`'${record.name}' (ID: ${record.id}) 시리즈를 삭제하시겠습니까?`}
            description="이 작업은 되돌릴 수 없으며, 현재 화면 목록에서만 제거됩니다."
            onConfirm={() => handleDeleteSeries(record.key)}
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

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([record.key]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ display: "flex" }}>
      <Title level={2}>
        <BookOutlined /> 시리즈 관리
      </Title>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <Input.Search
          placeholder="시리즈명 검색..."
          allowClear
          enterButton
          style={{ width: 300 }}
          onSearch={setSearchTerm} // Enter 또는 검색 버튼 클릭 시
          onChange={(e) => {
            if (!e.target.value) {
              // 입력값이 비었을 때 즉시 전체 목록 표시
              setSearchTerm("");
            }
          }}
        />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddSeries}
          >
            새 시리즈 추가
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredSeriesList}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        scroll={{ x: 900 }}
        bordered
        size="small"
        rowKey="key"
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          expandedRowRender: (record) => (
            <Table
              columns={expandedBookColumns}
              dataSource={record.booksInCurrentList}
              rowKey="bookKey"
              pagination={false}
              size="small"
              bordered
              style={{ margin: "0 20px" }}
              title={() => (
                <Text strong>{`'${record.name}' 시리즈 도서 목록 (${
                  record.booksInCurrentList?.length || 0
                }권)`}</Text>
              )}
            />
          ),
          rowExpandable: (record) =>
            record.booksInCurrentList && record.booksInCurrentList.length > 0,
        }}
      />

      <Modal
        title={editingSeries ? "시리즈 수정" : "새 시리즈 추가"}
        open={isModalOpen}
        onOk={handleFormSubmit}
        onCancel={handleCancelModal}
        okText={editingSeries ? "수정" : "추가"}
        cancelText="취소"
        destroyOnClose
        width={800} // 모달 너비 확장
      >
        <Form form={form} layout="vertical" name="series_form">
          <Form.Item
            name="name"
            label="시리즈명"
            rules={[
              { required: true, message: "시리즈명을 입력해주세요." },
              {
                whitespace: true,
                message: "시리즈명은 공백만으로 이루어질 수 없습니다.",
              },
              {
                validator: (_, value) => {
                  const isDuplicate = seriesDisplayList.some(
                    (s) => s.name === value && s.id !== editingSeries?.id
                  );
                  if (isDuplicate) {
                    return Promise.reject(
                      new Error("이미 사용 중인 시리즈명입니다.")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder="예: 해리포터 시리즈" />
          </Form.Item>
          <Form.Item
            name="category"
            label="카테고리"
            rules={[{ required: true, message: "카테고리를 선택해주세요." }]}
          >
            <Select
              placeholder="카테고리 선택"
              onChange={(value) => {
                setSelectedCategory(value);
                form.setFieldsValue({ subCategory: undefined }); // 카테고리 변경 시 하위 카테고리 초기화
              }}
              allowClear
            >
              {Object.keys(subCategoryMap).map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="subCategory"
            label="하위 카테고리"
            rules={[
              {
                required: true,
                message: "하위 카테고리를 선택해주세요.",
              },
            ]}
          >
            <Select
              placeholder="하위 카테고리 선택"
              disabled={!selectedCategory}
              allowClear
            >
              {selectedCategory &&
                subCategoryMap[selectedCategory] &&
                subCategoryMap[selectedCategory].map((subCat) => (
                  <Option key={subCat} value={subCat}>
                    {subCat}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item name="introduction" label="시리즈 소개">
            <TextArea
              rows={4}
              placeholder="시리즈에 대한 간략한 소개를 입력해주세요."
            />
          </Form.Item>
          <Form.Item name="books" label="도서 선택">
            <BookTransfer
              dataSource={transferDataSource}
              showSearch
              filterOption={bookFilterOption}
              targetKeys={form.getFieldValue("books") || []}
              onChange={(keys) => form.setFieldsValue({ books: keys })}
              leftColumns={bookTableColumns}
              rightColumns={bookTableColumns}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
};

export default SeriesManagement;
