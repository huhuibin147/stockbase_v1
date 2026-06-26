import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { newsApi } from '../services/api'

export default function NewsCenter() {
  const [news, setNews] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const pageSize = 20

  useEffect(() => {
    loadNews()
  }, [page])

  const loadNews = async () => {
    setLoading(true)
    try {
      const res = await newsApi.list({ limit: pageSize, offset: page * pageSize })
      setNews(res.data.items || [])
      setTotal(res.data.total || 0)
    } catch (err) {
      console.error('Failed to load news:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">新闻中心</h1>

      {/* 新闻列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">加载中...</div>
        ) : news.length === 0 ? (
          <div className="p-8 text-center text-gray-500">暂无新闻</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {news.map((item) => (
              <Link
                key={item.id}
                to={`/news/${item.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-blue-600 hover:underline">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{item.date}</span>
                      {(item.company_name || item.company_code) && (
                        <Link
                          to={`/companies/${item.company_code}`}
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.company_name || item.company_code}
                        </Link>
                      )}
                      {item.source && <span>来源: {item.source}</span>}
                    </div>
                    {item.summary && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.summary}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              共 {total} 条，第 {page + 1} / {totalPages} 页
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
