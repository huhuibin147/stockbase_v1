import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { companyApi, newsApi, systemApi } from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({ companies: 0, news: 0 })
  const [latestNews, setLatestNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statusRes, newsRes] = await Promise.all([
        systemApi.status(),
        newsApi.latest(5),
      ])
      setStats(statusRes.data.stats)
      setLatestNews(newsRes.data)
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      await systemApi.sync()
      loadData()
    } catch (err) {
      console.error('Sync failed:', err)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <button
          onClick={handleSync}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          同步文档
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/companies"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="text-sm text-gray-500">公司总数</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{stats.companies}</div>
        </Link>

        <Link
          to="/news"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="text-sm text-gray-500">新闻总数</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.news}</div>
        </Link>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-sm text-gray-500">行情数据</div>
          <div className="text-3xl font-bold text-gray-400 mt-2">--</div>
          <div className="text-xs text-gray-400 mt-1">即将上线</div>
        </div>
      </div>

      {/* 最新新闻 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">最新新闻</h2>
            <Link to="/news" className="text-sm text-blue-600 hover:underline">
              查看全部
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {latestNews.map((news) => (
            <Link
              key={news.id}
              to={`/news/${news.id}`}
              className="block p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-blue-600 hover:underline">{news.title}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {(news.company_name || news.company_code) && (
                      <Link
                        to={`/companies/${news.company_code}`}
                        className="mr-3 text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {news.company_name || news.company_code}
                      </Link>
                    )}
                    <span>{news.date}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {latestNews.length === 0 && (
            <div className="p-8 text-center text-gray-500">暂无新闻</div>
          )}
        </div>
      </div>
    </div>
  )
}
