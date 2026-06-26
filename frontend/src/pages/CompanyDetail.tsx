import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { companyApi } from '../services/api'

export default function CompanyDetail() {
  const { code } = useParams<{ code: string }>()
  const [company, setCompany] = useState<any>(null)
  const [basicInfo, setBasicInfo] = useState<any>(null)
  const [financial, setFinancial] = useState<any>(null)
  const [industryTech, setIndustryTech] = useState<any>(null)
  const [notes, setNotes] = useState<any>(null)
  const [news, setNews] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('basic')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (code) {
      loadData(code)
    }
  }, [code])

  const loadData = async (companyCode: string) => {
    setLoading(true)
    try {
      const companyRes = await companyApi.get(companyCode)
      setCompany(companyRes.data)

      try {
        const basicRes = await companyApi.getBasicInfo(companyCode)
        setBasicInfo(basicRes.data)
      } catch {
        setBasicInfo(null)
      }

      try {
        const financialRes = await companyApi.getFinancial(companyCode)
        setFinancial(financialRes.data)
      } catch {
        setFinancial(null)
      }

      try {
        const industryTechRes = await companyApi.getIndustryTech(companyCode)
        setIndustryTech(industryTechRes.data)
      } catch {
        setIndustryTech(null)
      }

      try {
        const notesRes = await companyApi.getNotes(companyCode)
        setNotes(notesRes.data)
      } catch {
        setNotes(null)
      }

      try {
        const newsRes = await companyApi.getNews(companyCode)
        setNews(Array.isArray(newsRes.data) ? newsRes.data : [])
      } catch {
        setNews([])
      }
    } catch (err) {
      console.error('Failed to load company data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载中...</div>
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">公司不存在</div>
        <Link to="/companies" className="text-blue-600 hover:underline mt-2 inline-block">
          返回列表
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'basic', label: '基本信息' },
    { id: 'financial', label: '财务数据' },
    { id: 'industry', label: '行业技术' },
    { id: 'notes', label: '投资笔记' },
    { id: 'news', label: '相关新闻' },
  ]

  const markdownComponents = {
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border border-gray-300">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-gray-100">{children}</thead>
    ),
    th: ({ children }: any) => (
      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="border border-gray-300 px-4 py-2 text-sm">
        {children}
      </td>
    ),
    tr: ({ children }: any) => (
      <tr className="border-b border-gray-300">{children}</tr>
    ),
    h1: ({ children }: any) => (
      <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
    ),
    p: ({ children }: any) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-6 mb-4">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-6 mb-4">{children}</ol>
    ),
    li: ({ children }: any) => (
      <li className="mb-1">{children}</li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
        {children}
      </blockquote>
    ),
    code: ({ children, className }: any) => {
      const isInline = !className
      if (isInline) {
        return (
          <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
            {children}
          </code>
        )
      }
      return (
        <code className="block bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto">
          {children}
        </code>
      )
    },
  }

  return (
    <div>
      {/* 面包屑 */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/companies" className="hover:text-blue-600">
          公司列表
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{company.name}</span>
      </div>

      {/* 公司头部 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="font-mono">{company.code}</span>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">
                {company.market}
              </span>
              {company.industry && <span>{company.industry}</span>}
            </div>
          </div>
          {company.tags && company.tags.length > 0 && (
            <div className="flex gap-2">
              {company.tags.map((tag: string, i: number) => (
                <span key={i} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab导航 */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab内容 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'basic' && (
          <div>
            {basicInfo ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {basicInfo.content || ''}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">暂无基本信息</div>
            )}
          </div>
        )}

        {activeTab === 'financial' && (
          <div>
            {financial ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {financial.content || ''}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">暂无财务数据</div>
            )}
          </div>
        )}

        {activeTab === 'industry' && (
          <div>
            {industryTech ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {industryTech.content || ''}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">暂无行业技术信息</div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            {notes ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {notes.content || ''}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">暂无投资笔记</div>
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            {news.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    to={`/news/${item.id}`}
                    className="block py-4 first:pt-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded"
                  >
                    <div className="font-medium text-blue-600 hover:underline">{item.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{item.date}</div>
                    {item.summary && (
                      <div className="text-sm text-gray-600 mt-2">{item.summary}</div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">暂无相关新闻</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
