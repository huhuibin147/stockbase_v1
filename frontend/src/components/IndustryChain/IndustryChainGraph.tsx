import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, Spin } from 'antd';

interface Node {
  id: string;
  name: string;
  layer: number;
  sector: string;
  type: 'company' | 'concept' | 'person' | 'event';
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
  type: string;
  description?: string;
}

interface IndustryChainData {
  nodes: Node[];
  links: Link[];
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

const IndustryChainGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IndustryChainData | null>(null);

  useEffect(() => {
    // 模拟数据加载
    const mockData: IndustryChainData = {
      nodes: [
        { id: '1', name: '国家电网', layer: 1, sector: '电力供应', type: 'company' },
        { id: '2', name: '中国核电', layer: 1, sector: '核电', type: 'company' },
        { id: '3', name: 'NVIDIA', layer: 2, sector: 'GPU', type: 'company' },
        { id: '4', name: '台积电', layer: 2, sector: '芯片制造', type: 'company' },
        { id: '5', name: '工业富联', layer: 3, sector: '服务器', type: 'company' },
        { id: '6', name: '中际旭创', layer: 3, sector: '光模块', type: 'company' },
        { id: '7', name: 'OpenAI', layer: 4, sector: '大模型', type: 'company' },
        { id: '8', name: '百度', layer: 4, sector: '大模型', type: 'company' },
        { id: '9', name: '科大讯飞', layer: 5, sector: 'AI应用', type: 'company' },
        { id: '10', name: '金山办公', layer: 5, sector: 'AI应用', type: 'company' },
      ],
      links: [
        { source: '1', target: '5', type: 'supply', description: '电力供应' },
        { source: '2', target: '5', type: 'supply', description: '核电供应' },
        { source: '3', target: '5', type: 'supply', description: 'GPU供应' },
        { source: '4', target: '3', type: 'supply', description: '芯片代工' },
        { source: '5', target: '7', type: 'supply', description: '服务器供应' },
        { source: '6', target: '5', type: 'supply', description: '光模块供应' },
        { source: '7', target: '9', type: 'supply', description: '模型API' },
        { source: '8', target: '10', type: 'supply', description: '模型API' },
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 1200;
    const height = 800;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    svg.attr('width', width).attr('height', height);

    // 清空之前的内容
    svg.selectAll('*').remove();

    // 创建主容器
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // 计算节点位置（按层级分布）
    const layerHeight = (height - margin.top - margin.bottom) / 5;
    const processedNodes = data.nodes.map(node => ({
      ...node,
      x: (width - margin.left - margin.right) / 2 + (Math.random() - 0.5) * 200,
      y: (node.layer - 0.5) * layerHeight
    }));

    // 创建力导向图
    const simulation = d3.forceSimulation(processedNodes as any)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter((width - margin.left - margin.right) / 2, (height - margin.top - margin.bottom) / 2))
      .force('y', d3.forceY((d: any) => (d.layer - 0.5) * layerHeight).strength(2));

    // 绘制层级背景
    for (let i = 0; i < 5; i++) {
      g.append('rect')
        .attr('x', 0)
        .attr('y', i * layerHeight)
        .attr('width', width - margin.left - margin.right)
        .attr('height', layerHeight)
        .attr('fill', LAYER_COLORS[i])
        .attr('opacity', 0.1);

      g.append('text')
        .attr('x', 10)
        .attr('y', i * layerHeight + 20)
        .text(`第${i + 1}层: ${LAYER_NAMES[i]}`)
        .attr('font-size', '12px')
        .attr('fill', LAYER_COLORS[i]);
    }

    // 绘制连线
    const link = g.append('g')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // 绘制节点
    const node = g.append('g')
      .selectAll('circle')
      .data(processedNodes)
      .enter()
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => LAYER_COLORS[d.layer - 1])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .call(d3.drag<any, any>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // 添加节点标签
    const labels = g.append('g')
      .selectAll('text')
      .data(processedNodes)
      .enter()
      .append('text')
      .text((d: any) => d.name)
      .attr('font-size', '10px')
      .attr('text-anchor', 'middle')
      .attr('dy', 30)
      .attr('fill', '#333');

    // 添加节点悬停提示
    node.append('title')
      .text((d: any) => `${d.name}\n层级: ${LAYER_NAMES[d.layer - 1]}\n子行业: ${d.sector}`);

    // 更新力导向图
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // 添加缩放功能
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

  }, [data]);

  return (
    <Card title="AI产业链图谱" style={{ width: '100%' }}>
      <Spin spinning={loading}>
        <svg ref={svgRef}></svg>
      </Spin>
    </Card>
  );
};

export default IndustryChainGraph;