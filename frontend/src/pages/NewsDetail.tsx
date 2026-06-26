import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { newsApi } from '../services/api'

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>()
  const [news, setNews] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadNews(id)
    }
  }, [id])

  const loadNews = async (newsId: string) => {
    setLoading(true)
    try {
      const res = await newsApi.get(newsId)
      setNews(res.data)
    } catch (err) {
      console.error('Failed to load news:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载中...</div>
  }

  if (!news) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">新闻不存在</div>
        <Link to="/news" className="text-blue-600 hover:underline mt-2 inline-block">
          返回新闻列表
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* 面包屑 */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/news" className="hover:text-blue-600">
          新闻中心
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{news.title}</span>
      </div>

      {/* 新闻内容 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold mb-4">{news.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
          <span>{news.date}</span>
          {news.company_code && (
            <Link
              to={`/companies/${news.company_code}`}
              className="text-blue-600 hover:underline"
            >
              {news.company_code}
            </Link>
          )}
          {news.source && <span>来源: {news.source}</span>}
          {news.url && (
            <a
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              原文链接
            </a>
          )}
        </div>

        {/* Markdown内容 */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border border-gray-300">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-100">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-4 py-2 text-sm">
                  {children}
                </td>
              ),
              tr: ({ children }) => (
                <tr className="border-b border-gray-300">{children}</tr>
              ),
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold mt-8 mb-4">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-4">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="mb-1">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
                  {children}
                </blockquote>
              ),
              code: ({ children, className }) => {
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
            }}
          >
            {news.content || '暂无内容'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
