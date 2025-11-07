import React, { useMemo, useState } from 'react';
import { Button, Card, Flex, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, Typography, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const CATEGORY_OPTIONS = ['abuse', 'impersonation', 'system', 'brand', 'promo'];

const initialData = [
  { id: '1', word: 'admin', categories: ['system'], createdAt: '2024-08-01 10:00', updatedAt: '2024-08-01 10:00', createdBy: 'adminA' },
  { id: '2', word: 'free-charge', categories: ['promo'], createdAt: '2024-08-02 11:20', updatedAt: '2024-08-02 11:20', createdBy: 'adminA' },
  { id: '3', word: 'badword01', categories: ['abuse'], createdAt: '2024-08-03 09:00', updatedAt: '2024-08-03 09:00', createdBy: 'adminA' },
  { id: '4', word: 'fakeadmin', categories: ['impersonation'], createdAt: '2024-08-03 09:05', updatedAt: '2024-08-03 09:05', createdBy: 'adminA' },
  { id: '5', word: 'systemroot', categories: ['system'], createdAt: '2024-08-03 09:10', updatedAt: '2024-08-03 09:10', createdBy: 'adminA' },
  { id: '6', word: 'brandpromo', categories: ['brand'], createdAt: '2024-08-03 09:15', updatedAt: '2024-08-03 09:15', createdBy: 'adminA' },
  { id: '7', word: 'promo123', categories: ['promo'], createdAt: '2024-08-03 09:20', updatedAt: '2024-08-03 09:20', createdBy: 'adminA' },
  { id: '8', word: 'no-swear', categories: ['abuse'], createdAt: '2024-08-03 09:25', updatedAt: '2024-08-03 09:25', createdBy: 'adminA' },
  { id: '9', word: 'impersonate-staff', categories: ['impersonation'], createdAt: '2024-08-03 09:30', updatedAt: '2024-08-03 09:30', createdBy: 'adminA' },
  { id: '10', word: 'official_admin', categories: ['impersonation'], createdAt: '2024-08-03 09:35', updatedAt: '2024-08-03 09:35', createdBy: 'adminA' },
  { id: '11', word: 'ad-link', categories: ['promo'], createdAt: '2024-08-03 09:40', updatedAt: '2024-08-03 09:40', createdBy: 'adminA' },
  { id: '12', word: 'brandX', categories: ['brand'], createdAt: '2024-08-03 09:45', updatedAt: '2024-08-03 09:45', createdBy: 'adminA' },
];

const currentAdmin = 'adminA';

function now() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const ForbiddenWords = () => {
  const [form] = Form.useForm();
  const [words, setWords] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);

  const columns = useMemo(
    () => [
      { title: '단어', dataIndex: 'word', key: 'word', sorter: (a, b) => a.word.localeCompare(b.word) },
      {
        title: '분류 태그',
        dataIndex: 'categories',
        key: 'categories',
        render: (cats) => (
          <Space wrap>
            {(cats || []).map((c) => (
              <Tag key={c}>{c}</Tag>
            ))}
          </Space>
        ),
      },
      { title: '생성일', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
      { title: '작성자', dataIndex: 'createdBy', key: 'createdBy', width: 140 },
      {
        title: '작업',
        key: 'actions',
        width: 160,
        render: (_, record) => (
          <Space>
            <Popconfirm title="삭제하시겠습니까?" onConfirm={() => onDelete(record)}>
              <Button size="small" danger>삭제</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [words]
  );

  const onAdd = () => {
    form.resetFields();
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
        setModalOpen(false);
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
    return false;
  };

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
        <Table rowKey="id" dataSource={words} columns={columns} pagination={{ pageSize: 10, showSizeChanger: true }} />
      </Card>

      <Modal title={'금지어 등록'} open={modalOpen} onCancel={() => { setModalOpen(false); }} onOk={onSubmit} okText={'등록'}>
        <Form form={form} layout="vertical">
          <Form.Item label="단어" name="word" rules={[{ required: true, message: '단어를 입력해 주세요.' }]}> 
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
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default ForbiddenWords;
