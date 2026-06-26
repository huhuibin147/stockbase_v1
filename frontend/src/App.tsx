import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CompanyList from './pages/CompanyList'
import CompanyDetail from './pages/CompanyDetail'
import NewsCenter from './pages/NewsCenter'
import NewsDetail from './pages/NewsDetail'
import IndustryChainGraph from './components/IndustryChain/IndustryChainGraph'
import CompanyIndex from './pages/IndustryChain/CompanyIndex'
import ConceptIndex from './pages/IndustryChain/ConceptIndex'
import PersonIndex from './pages/IndustryChain/PersonIndex'
import EventIndex from './pages/IndustryChain/EventIndex'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="companies" element={<CompanyList />} />
        <Route path="companies/:code" element={<CompanyDetail />} />
        <Route path="news" element={<NewsCenter />} />
        <Route path="news/:id" element={<NewsDetail />} />
        <Route path="industry-chain" element={<IndustryChainGraph />} />
        <Route path="industry-chain/companies" element={<CompanyIndex />} />
        <Route path="industry-chain/concepts" element={<ConceptIndex />} />
        <Route path="industry-chain/persons" element={<PersonIndex />} />
        <Route path="industry-chain/events" element={<EventIndex />} />
      </Route>
    </Routes>
  )
}

export default App
