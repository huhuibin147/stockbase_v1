import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Space, Input, Select, Row, Col, Timeline } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined, CalendarOutlined } from '@ant-design/icons';

interface Event {
  id: string;
  title: string;
  date: string;
  type: string;
  description: string;
  relatedCompanies: string[];
}

const EVENT_TYPES = ['发布会', '并购', 'IPO', '产能投放', '技术突破', '政策法规', '合作'];

const EventIndex: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  useEffect(() => {
    // 模拟数据加载
    const mockData: Event[] = [
      { id: '1', title: 'NVIDIA Blackwell架构发布', date: '2024-03-18', type: '发布会', description: 'NVIDIA发布新一代Blackwell GPU架构', relatedCompanies: ['NVIDIA'] },
      { id: '2', title: 'OpenAI发布GPT-4o', date: '2024-05-13', type: '发布会', description: 'OpenAI发布多模态大模型GPT-4o', relatedCompanies: ['OpenAI'] },
      { id: '3', title: '超聚变IPO辅导备案', date: '2026', type: 'IPO', description: '超聚变启动IPO辅导备案', relatedCompanies: ['超聚变'] },
      { id: '4', title: '中芯北方49%股权收购', date: '2026', type: '并购', description: '中芯国际收购中芯北方49%股权', relatedCompanies: ['中芯国际'] },
      { id: '5', title: '京东物流收购德邦快运', date: '2026', type: '并购', description: '京东物流溢价35%收购德邦快运', relatedCompanies: ['京东物流', '德邦快运'] },
      { id: '6', title: '中国核电玲龙一号商业投运', date: '2026', type: '产能投放', description: '小型模块化反应堆商业投运', relatedCompanies: ['中国核电'] },
      { id: '7', title: 'Unity出售中国业务', date: '2026', type: '并购', description: 'Unity出售中国业务给新成立公司', relatedCompanies: ['Unity'] },
      { id: '8', title: 'NVIDIA Rubin相变液冷标准', date: '2026-Q3', type: '技术突破', description: 'NVIDIA Rubin相变液冷标准发布', relatedCompanies: ['NVIDIA'] },
      { id: '9', title: '万兴科技战投生数科技Vidu', date: '2026', type: '合作', description: '万兴科技战略投资生数科技Vidu', relatedCompanies: ['万兴科技', '生数科技'] },
      { id: '10', title: 'Gartner AI客服Agent预测', date: '2026', type: '政策法规', description: 'Gartner预测AI客服Agent市场', relatedCompanies: [] },
    ];

    setTimeout(() => {
      setEvents(mockData);
      setLoading(false);
    }, 500);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchSearch = event.title.includes(searchText) || 
                       event.description.includes(searchText);
    const matchType = selectedType === null || event.type === selectedType;
    return matchSearch && matchType;
  });

  const columns: ColumnsType<Event> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => a.date.localeCompare(b.date),
      render: (text) => (
        <Space>
          <CalendarOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '事件标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a href={`/event/${record.id}`}>{text}</a>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (text) => {
        const colorMap: Record<string, string> = {
          '发布会': 'blue',
          '并购': 'red',
          'IPO': 'green',
          '产能投放': 'orange',
          '技术突破': 'purple',
          '政策法规': 'cyan',
          '合作': 'magenta',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '相关公司',
      dataIndex: 'relatedCompanies',
      key: 'relatedCompanies',
      render: (companies: string[]) => (
        <Space>
          {companies.map(company => (
            <Tag key={company}>{company}</Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title="事件索引" 
      extra={
        <Space>
          <span>共 {filteredEvents.length} 个事件</span>
          <Select
            value={viewMode}
            onChange={setViewMode}
            style={{ width: 120 }}
          >
            <Select.Option value="table">表格视图</Select.Option>
            <Select.Option value="timeline">时间线视图</Select.Option>
          </Select>
        </Space>
      }
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={16}>
          <Input
            placeholder="搜索事件标题或描述"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="选择事件类型"
            style={{ width: '100%' }}
            allowClear
            value={selectedType}
            onChange={setSelectedType}
          >
            {EVENT_TYPES.map(type => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      
      {viewMode === 'table' ? (
        <Table
          columns={columns}
          dataSource={filteredEvents}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 20 }}
        />
      ) : (
        <Timeline
          mode="left"
          items={filteredEvents.map(event => ({
            label: event.date,
            children: (
              <Card size="small">
                <Space direction="vertical">
                  <Space>
                    <Tag color="blue">{event.type}</Tag>
                    <strong>{event.title}</strong>
                  </Space>
                  <div>{event.description}</div>
                  <Space>
                    {event.relatedCompanies.map(company => (
                      <Tag key={company}>{company}</Tag>
                    ))}
                  </Space>
                </Space>
              </Card>
            ),
          }))}
        />
      )}
    </Card>
  );
};

export default EventIndex;