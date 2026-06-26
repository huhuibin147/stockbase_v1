import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Input, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

interface Concept {
  id: string;
  name: string;
  category: string;
  description: string;
  frequency: number;
  relatedCompanies: string[];
}

const ConceptIndex: React.FC = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // 模拟数据加载
    const mockData: Concept[] = [
      { id: '1', name: 'HBM', category: '存储技术', description: '高带宽内存，用于AI芯片', frequency: 156, relatedCompanies: ['SK海力士', '三星', '美光'] },
      { id: '2', name: 'CoWoS', category: '封装技术', description: '台积电先进封装技术', frequency: 134, relatedCompanies: ['台积电'] },
      { id: '3', name: 'CUDA', category: '软件生态', description: 'NVIDIA并行计算平台', frequency: 128, relatedCompanies: ['NVIDIA'] },
      { id: '4', name: '大模型', category: 'AI模型', description: '大规模预训练模型', frequency: 120, relatedCompanies: ['OpenAI', '百度', '阿里'] },
      { id: '5', name: '液冷', category: '散热技术', description: '数据中心液冷散热方案', frequency: 98, relatedCompanies: ['工业富联', '英维克'] },
      { id: '6', name: '光模块', category: '通信设备', description: '高速光通信模块', frequency: 89, relatedCompanies: ['中际旭创', '新易盛'] },
      { id: '7', name: 'AI Agent', category: 'AI应用', description: 'AI代理/智能体', frequency: 78, relatedCompanies: ['OpenAI', '百度'] },
      { id: '8', name: '人形机器人', category: '机器人', description: '仿人形机器人', frequency: 67, relatedCompanies: ['特斯拉', '小米'] },
      { id: '9', name: 'RAG', category: 'AI技术', description: '检索增强生成', frequency: 56, relatedCompanies: ['OpenAI', '百度'] },
      { id: '10', name: 'InfiniBand', category: '网络技术', description: '高速网络互联技术', frequency: 45, relatedCompanies: ['NVIDIA', 'Mellanox'] },
    ];

    setTimeout(() => {
      setConcepts(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredConcepts = concepts.filter(concept => {
    return concept.name.includes(searchText) || 
           concept.description.includes(searchText) ||
           concept.category.includes(searchText);
  });

  const columns: ColumnsType<Concept> = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '概念名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a href={`/concept/${text}`}>{text}</a>,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '出现频率',
      dataIndex: 'frequency',
      key: 'frequency',
      width: 120,
      sorter: (a, b) => a.frequency - b.frequency,
      render: (count) => <span style={{ color: '#1890ff' }}>↗ {count}</span>,
    },
    {
      title: '相关公司',
      dataIndex: 'relatedCompanies',
      key: 'relatedCompanies',
      render: (companies: string[]) => (
        <Space>
          {companies.slice(0, 3).map(company => (
            <Tag key={company}>{company}</Tag>
          ))}
          {companies.length > 3 && <Tag>+{companies.length - 3}</Tag>}
        </Space>
      ),
    },
  ];

  return (
    <Card title="概念索引" extra={`共 ${filteredConcepts.length} 条概念`}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Input
            placeholder="搜索概念名称、分类或描述"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredConcepts}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />
    </Card>
  );
};

export default ConceptIndex;