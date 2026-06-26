import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Input, Row, Col, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';

interface Person {
  id: string;
  name: string;
  company: string;
  title: string;
  description: string;
  referenceCount: number;
}

const PersonIndex: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // 模拟数据加载
    const mockData: Person[] = [
      { id: '1', name: '黄仁勋', company: 'NVIDIA', title: '创始人/CEO', description: 'NVIDIA创始人，AI芯片领域领军人物', referenceCount: 8 },
      { id: '2', name: 'Sam Altman', company: 'OpenAI', title: 'CEO', description: 'OpenAI首席执行官，ChatGPT推动者', referenceCount: 13 },
      { id: '3', name: '马斯克', company: 'Tesla', title: 'CEO', description: '特斯拉CEO，xAI创始人', referenceCount: 9 },
      { id: '4', name: '李彦宏', company: '百度', title: '创始人/CEO', description: '百度创始人，文心一言推动者', referenceCount: 7 },
      { id: '5', name: '任正非', company: '华为', title: '创始人', description: '华为创始人，推动国产芯片发展', referenceCount: 6 },
      { id: '6', name: '梁文锋', company: 'DeepSeek', title: '创始人', description: 'DeepSeek创始人，幻方量化创始人', referenceCount: 5 },
      { id: '7', name: '周鸿祎', company: '360集团', title: '创始人/董事长', description: '360集团创始人，AI安全倡导者', referenceCount: 9 },
      { id: '8', name: 'Demis Hassabis', company: 'DeepMind', title: 'CEO', description: 'Google DeepMind CEO，AlphaFold负责人', referenceCount: 10 },
      { id: '9', name: 'Dario Amodei', company: 'Anthropic', title: 'CEO', description: 'Anthropic联合创始人兼CEO', referenceCount: 5 },
      { id: '10', name: 'Jim Keller', company: '—', title: '芯片架构师', description: '传奇芯片架构师，曾任职AMD、Intel、Tesla', referenceCount: 5 },
    ];

    setTimeout(() => {
      setPersons(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredPersons = persons.filter(person => {
    return person.name.includes(searchText) || 
           person.company.includes(searchText) ||
           person.description.includes(searchText);
  });

  const columns: ColumnsType<Person> = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <a href={`/person/${record.id}`}>{text}</a>
        </Space>
      ),
    },
    {
      title: '所属公司',
      dataIndex: 'company',
      key: 'company',
      width: 120,
      render: (text) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: '职位',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '引用次数',
      dataIndex: 'referenceCount',
      key: 'referenceCount',
      width: 100,
      sorter: (a, b) => a.referenceCount - b.referenceCount,
      render: (count) => <span style={{ color: '#1890ff' }}>↗ {count}</span>,
    },
  ];

  return (
    <Card title="人物索引" extra={`共 ${filteredPersons.length} 位人物`}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            placeholder="搜索人物姓名、公司或描述"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredPersons}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />
    </Card>
  );
};

export default PersonIndex;