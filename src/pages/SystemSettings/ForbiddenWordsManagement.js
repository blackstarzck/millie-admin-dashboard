import React, { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
  message,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const CATEGORY_OPTIONS = ['비속어', '사칭', '시스템', '브랜드', '홍보'];

const initialData = [
  { id: '1', word: 'admin', categories: ['시스템'], createdAt: '2024-08-01 10:00', updatedAt: '2024-08-01 10:00', createdBy: 'system' },
  { id: '2', word: '무료충전', categories: ['홍보'], createdAt: '2024-08-02 11:20', updatedAt: '2024-08-02 11:20', createdBy: '관리자A' },
];

const currentAdmin = '관리자A';

function now() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const ForbiddenWordsManagement = () => {
  const [form] = Form.useForm();
  const [words, setWords] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // record or null
  // 변경 이력 기능 제거로 관련 상태 제거
  // 외부 연동 제거로 관련 상태 제거

  const columns = useMemo(
    () => [
      {
        title: '단어',
        dataIndex: 'word',
        key: 'word',
        sorter: (a, b) => a.word.localeCompare(b.word),
      },
      {
        title: '분류 태그',
        dataIndex: 'categories',
        key: 'categories',
        render: (cats) => (
          <Space wrap>
            {cats.map((c) => (
              <Tag key={c}>{c}</Tag>
            ))}
          </Space>
        ),
      },
      {
        title: '생성일',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
      },
      {
        title: '수정일',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
      },
      {
        title: '작성자/수정자',
        key: 'by',
        width: 160,
        render: (_, r) => (
          <div>
            <div><Text type="secondary">생성</Text>: {r.createdBy}</div>
            <div><Text type="secondary">수정</Text>: {r.updatedBy}</div>
          </div>
        ),
      },
      {
        title: '작업',
        key: 'actions',
        width: 160,
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => onEdit(record)}>수정</Button>
            <Popconfirm title="삭제하시겠습니까?" onConfirm={() => onDelete(record)}>
              <Button size="small" danger>삭제</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [words]
  );

  // Override author/modifier column to show only creator id
  const columnsFinal = useMemo(
    () =>
      columns.map((col) =>
        col && col.key === 'by'
          ? { ...col, title: '작성자', dataIndex: 'createdBy', render: (_, r) => r.createdBy, width: 140 }
          : col
      ),
    [columns]
  );

  const onAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const onEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({ word: record.word, categories: record.categories });
    setModalOpen(true);
  };

  const onDelete = (record) => {
    setWords((prev) => prev.filter((w) => w.id !== record.id));
    message.success('삭제되었습니다.');
  };

  const onSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (editing) {
          const updated = { ...editing, ...values, updatedAt: now() };
          setWords((prev) => prev.map((w) => (w.id === editing.id ? updated : w)));
          message.success('수정되었습니다.');
        } else {
          const rec = {
            id: cryptoRandomId(),
            word: values.word,
            categories: values.categories || [],
            createdAt: now(),
            updatedAt: now(),
            createdBy: currentAdmin,
          };
          setWords((prev) => [rec, ...prev]);
          message.success('등록되었습니다.');
        }
        setModalOpen(false);
        setEditing(null);
      })
      .catch(() => {});
  };

  const onExport = () => {
    const payload = words.map(({ id, word, categories }) => ({ id, word, categories }));
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'forbidden-words.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCsv = (text) => {
    // Very simple CSV: word,categories(semi-colon separated)
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const rows = lines.map((l) => l.split(',').map((x) => x.trim()));
    return rows.map(([word, cats]) => ({
      id: cryptoRandomId(),
      word,
      categories: (cats || '').split(';').map((c) => c.trim()).filter(Boolean),
      createdAt: now(),
      updatedAt: now(),
      createdBy: currentAdmin,
    }));
  };

  const beforeUpload = (file) => {
    const isJson = file.type === 'application/json' || file.name.endsWith('.json');
    const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let imported = [];
        if (isJson) {
          const data = JSON.parse(e.target.result);
          imported = (Array.isArray(data) ? data : []).map((d) => ({
            id: d.id || cryptoRandomId(),
            word: d.word,
            categories: d.categories || [],
            createdAt: now(),
            updatedAt: now(),
            createdBy: currentAdmin,
          }));
        } else if (isCsv) {
          imported = parseCsv(e.target.result);
        }
        if (!imported.length) {
          message.warning('가져올 데이터가 없습니다.');
          return;
        }
        setWords((prev) => [...imported, ...prev]);
        message.success(`${imported.length}건 가져왔습니다.`);
      } catch (err) {
        console.error(err);
        message.error('파일 처리 중 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    return false; // prevent auto upload
  };

  // 외부 연동 기능 제거됨

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      <Title level={3}>금지어 관리</Title>
      <Card>
        <Flex align="center" justify="space-between" wrap>
          <Space size={8}>
            <Button type="primary" onClick={onAdd}>금지어 등록</Button>
            <Upload beforeUpload={beforeUpload} showUploadList={false} accept=".json,.csv">
              <Button icon={<UploadOutlined />}>가져오기(JSON/CSV)</Button>
            </Upload>
            <Button onClick={onExport}>내보내기(JSON)</Button>
          </Space>
          <Space size={16}></Space>
        </Flex>
      </Card>
      <Card>
        <Table
          rowKey="id"
          dataSource={words}
          columns={columnsFinal}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>

      <Modal
        title={editing ? '금지어 수정' : '금지어 등록'}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditing(null); }}
        onOk={onSubmit}
        okText={editing ? '수정' : '등록'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="단어"
            name="word"
            rules={[{ required: true, message: '단어를 입력해 주세요.' }]}
          >
            <Input placeholder="금지할 단어" />
          </Form.Item>
          <Form.Item label="분류 태그" name="categories">
            <Select mode="multiple" placeholder="분류 태그 선택">
              {CATEGORY_OPTIONS.map((c) => (
                <Option key={c} value={c}>{c}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      
    </Space>
  );
};

function cryptoRandomId() {
  // Simple random id; not crypto-strong but fine for UI state
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default ForbiddenWordsManagement;
