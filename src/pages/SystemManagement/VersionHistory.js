import { Button, Card, DatePicker, Form, Input, Modal, Popconfirm, Space, Table, Typography } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';

const { Title } = Typography;

const initialVersionData = [
  { key: '1', version: '1.0.0', date: '2023-01-15', description: '최초 릴리즈', registrant: 'system_bot', registrationDate: '2023-01-15' },
  { key: '2', version: '1.0.1', date: '2023-02-01', description: '마이너 버그 수정 및 안정성 향상', registrant: 'dev_lead', registrationDate: '2023-02-01' },
  { key: '3', version: '1.1.0', date: '2023-03-10', description: '사용자 통계 기능 추가', registrant: 'planner_kim', registrationDate: '2023-03-10' },
  { key: '4', version: '1.2.0', date: '2023-04-20', description: '쿠폰 관리 기능 추가 및 UI 개선', registrant: 'dev_lead', registrationDate: '2023-04-20' },
  { key: '5', version: '1.2.1', date: '2023-05-05', description: '보안 패치 및 성능 최적화', registrant: 'security_lee', registrationDate: '2023-05-05' },
];

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'date' ? <DatePicker format="YYYY-MM-DD" /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `${title}을(를) 입력해주세요.` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};


const VersionHistory = () => {
  const [tableForm] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [versionData, setVersionData] = useState(initialVersionData);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    tableForm.setFieldsValue({
      ...record,
      date: moment(record.date, 'YYYY-MM-DD'),
    });
    setEditingKey(record.key);
  };

  const cancelEdit = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await tableForm.validateFields();
      const newData = [...versionData];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          date: row.date.format('YYYY-MM-DD'),
        });
        setVersionData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (key) => {
    setVersionData(versionData.filter(item => item.key !== key));
  };

  const showCreateModal = () => {
    modalForm.resetFields();
    setIsModalVisible(true);
  };

  const handleCreateCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreate = () => {
    modalForm.validateFields()
      .then(values => {
        const newVersion = {
          key: (versionData.length + 1).toString(),
          ...values,
          date: values.date.format('YYYY-MM-DD'),
          registrant: 'admin_millie', // TODO: 실제 로그인된 사용자 ID로 교체 필요
          registrationDate: moment().format('YYYY-MM-DD'),
        };
        setVersionData([newVersion, ...versionData]);
        handleCreateCancel();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const columns = [
    {
      title: '버전',
      dataIndex: 'version',
      key: 'version',
      width: 120,
      editable: true,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: '릴리즈 날짜',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      editable: true,
    },
    {
      title: '변경사항',
      dataIndex: 'description',
      key: 'description',
      editable: true,
    },
    {
      title: '등록자',
      dataIndex: 'registrant',
      key: 'registrant',
      width: 120,
    },
    {
      title: '등록일',
      dataIndex: 'registrationDate',
      key: 'registrationDate',
      width: 150,
    },
    {
      title: '관리',
      key: 'action',
      width: 150,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <a onClick={() => save(record.key)} style={{ marginRight: 8 }}>저장</a>
            <Popconfirm title="취소하시겠습니까?" onConfirm={cancelEdit}>
              <a>취소</a>
            </Popconfirm>
          </Space>
        ) : (
          <Space size="middle">
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              수정
            </Typography.Link>
            <Popconfirm title="정말 삭제하시겠습니까?" onConfirm={() => handleDelete(record.key)} okText="예" cancelText="아니오">
              <Button type="link" danger>삭제</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'date' ? 'date' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>플랫폼 버전 히스토리</Title>
        <Button type="primary" onClick={showCreateModal}>
          신규 버전 등록
        </Button>
      </div>
      <Form form={tableForm} component={false}>
        <Card>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={versionData}
            pagination={false}
            bordered
            rowClassName="editable-row"
            tableLayout="fixed"
          />
        </Card>
      </Form>
      <Modal
        title={"신규 버전 등록"}
        visible={isModalVisible}
        onOk={handleCreate}
        onCancel={handleCreateCancel}
        okText={"등록"}
        cancelText="취소"
      >
        <Form form={modalForm} layout="vertical" name="version_form">
          <Form.Item
            name="version"
            label="버전"
            rules={[{ required: true, message: '버전명을 입력해주세요.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="릴리즈 날짜"
            rules={[{ required: true, message: '릴리즈 날짜를 선택해주세요.' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="변경사항"
            rules={[{ required: true, message: '변경사항을 입력해주세요.' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VersionHistory;
