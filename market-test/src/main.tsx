import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DataForm from './DataForm.tsx'
import DataPage from './DataPage.tsx'
import TradingPage from './TradingPage.tsx'
import StockPage from './StockPage.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<DataForm />} />
            <Route path='data' element={<DataPage />} />
            <Route path='stocks' element={<StockPage />} />
            <Route path='stocks/trade/:userId/:stockId' element={<TradingPage />} />
        </Routes>
    </BrowserRouter>
)
