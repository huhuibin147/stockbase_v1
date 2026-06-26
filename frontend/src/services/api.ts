import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 公司相关
export const companyApi = {
  list: (params?: { keyword?: string; industry?: string; market?: string }) =>
    api.get('/companies', { params }),

  get: (code: string) => api.get(`/companies/${code}`),

  getBasicInfo: (code: string) => api.get(`/companies/${code}/basic`),

  getFinancial: (code: string) => api.get(`/companies/${code}/financial`),

  getIndustryTech: (code: string) => api.get(`/companies/${code}/industry-tech`),

  getNotes: (code: string) => api.get(`/companies/${code}/notes`),

  getNews: (code: string) => api.get(`/companies/${code}/news`),

  create: (data: any) => api.post('/companies', data),

  update: (code: string, data: any) => api.put(`/companies/${code}`, data),
}

// 新闻相关
export const newsApi = {
  list: (params?: { company_code?: string; limit?: number; offset?: number }) =>
    api.get('/news', { params }),

  latest: (limit?: number) => api.get('/news/latest', { params: { limit } }),

  get: (id: string) => api.get(`/news/${encodeURIComponent(id)}`),
}

// 行情相关（预留）
export const marketApi = {
  getQuote: (code: string) => api.get(`/market/quote/${code}`),

  getHistory: (code: string) => api.get(`/market/history/${code}`),

  getIndex: () => api.get('/market/index'),
}

// 系统相关
export const systemApi = {
  status: () => api.get('/system/status'),

  sync: () => api.post('/system/sync'),
}

export default api
