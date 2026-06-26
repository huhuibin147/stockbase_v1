import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Input, Select, Row, Col } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';

interface Company {
  id: string;
  name: string;
  code: string;
  market: string;
  layer: number;
  sector: string;
  description: string;
  referenceCount: number;
}

const LAYER_NAMES = [
  '能源与电力',
  '芯片系统',
  'AI基础设施',
  'AI基础模型',
  'AI应用'
];

const LAYER_COLORS = [
  '#ff6b6b',
  '#ffa500',
  '#4ecdc4',
  '#45b7d1',
  '#96ceb4'
];

const CompanyIndex: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  useEffect(() => {
    // 模拟数据加载
    const mockData: Company[] = [
      { id: '1', name: '国家电网', code: '—', market: '国企', layer: 1, sector: '电力供应', description: '中国最大的电力公司', referenceCount: 45 },
      { id: '2', name: '中国核电', code: '601985', market: 'A股', layer: 1, sector: '核电', description: '核电运营商', referenceCount: 32 },
      { id: '3', name: 'NVIDIA', code: 'NVDA', market: '美股', layer: 2, sector: 'GPU', description: '全球GPU龙头', referenceCount: 461 },
      { id: '4', name: '台积电', code: '2330', market: '台股', layer: 2, sector: '芯片制造', description: '全球最大芯片代工厂', referenceCount: 173 },
      { id: '5', name: '工业富联', code: '601138', market: 'A股', layer: 3, sector: '服务器', description: 'AI服务器龙头', referenceCount: 89 },
      { id: '6', name: '中际旭创', code: '300308', market: 'A股', layer: 3, sector: '光模块', description: '光模块龙头', referenceCount: 67 },
      { id: '7', name: 'OpenAI', code: '—', market: '私募', layer: 4, sector: '大模型', description: 'ChatGPT开发商', referenceCount: 160 },
      { id: '8', name: '百度', code: 'BIDU', market: '美股', layer: 4, sector: '大模型', description: '文心一言开发商', referenceCount: 98 },
      { id: '9', name: '科大讯飞', code: '002230', market: 'A股', layer: 5, sector: 'AI应用', description: 'AI语音龙头', referenceCount: 56 },
      { id: '10', name: '金山办公', code: '688111', market: 'A股', layer: 5, sector: 'AI应用', description: 'WPS AI开发商', referenceCount: 45 },
    ];

    setTimeout(() => {
      setCompanies(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCompanies = companies.filter(company => {
    const matchSearch = company.name.includes(searchText) || 
                       company.code.includes(searchText) ||
                       company.description.includes(searchText);
    const matchLayer = selectedLayer === null || company.layer === selectedLayer;
    const matchMarket = selectedMarket === null || company.market === selectedMarket;
    return matchSearch && matchLayer && matchMarket;
  });

  const columns: ColumnsType<Company> = [
    {
      title: '排名',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: '公司名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <a href={`/company/${record.code}`}>{text}</a>
          <Tag color={LAYER_COLORS[record.layer - 1]}>
            {LAYER_NAMES[record.layer - 1]}
          </Tag>
        </Space>
      ),
    },
    {
      title: '股票代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '上市地',
      dataIndex: 'market',
      key: 'market',
      width: 100,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: '子行业',
      dataIndex: 'sector',
      key: 'sector',
      width: 120,
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
    <Card title="公司索引" extra={`共 ${filteredCompanies.length} 家公司`}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="搜索公司名称、代码或描述"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="选择层级"
            style={{ width: '100%' }}
            allowClear
            value={selectedLayer}
            onChange={setSelectedLayer}
          >
            {LAYER_NAMES.map((name, index) => (
              <Select.Option key={index + 1} value={index + 1}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Select
            placeholder="选择上市地"
            style={{ width: '100%' }}
            allowClear
            value={selectedMarket}
            onChange={setSelectedMarket}
          >
            <Select.Option value="A股">A股</Select.Option>
            <Select.Option value="港股">港股</Select.Option>
            <Select.Option value="美股">美股</Select.Option>
            <Select.Option value="台股">台股</Select.Option>
            <Select.Option value="私募">私募</Select.Option>
            <Select.Option value="国企">国企</Select.Option>
          </Select>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={filteredCompanies}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 20 }}
      />
    </Card>
  );
};

export default CompanyIndex;