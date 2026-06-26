import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CompanyList from './pages/CompanyList'
import CompanyDetail from './pages/CompanyDetail'
import NewsCenter from './pages/NewsCenter'
import NewsDetail from './pages/NewsDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="companies" element={<CompanyList />} />
        <Route path="companies/:code" element={<CompanyDetail />} />
        <Route path="news" element={<NewsCenter />} />
        <Route path="news/:id" element={<NewsDetail />} />
      </Route>
    </Routes>
  )
}

export default App
