import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function StockPage() {

    type CompanyInfoResponse = {
        stock_id: number;
        company_name: string;
        asset_ticker: string;
        circulating_shares: number | undefined;
        market_capitalization: number | undefined;
    }

    const navigate = useNavigate();

    const [companies, setCompanies] = useState<CompanyInfoResponse[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<CompanyInfoResponse | undefined>(undefined)



    const getCompanies = async () => {
        const response = await axios.get('http://127.0.0.1:8000/get_companies')
        const data: CompanyInfoResponse[] = response.data
        console.log(data)
        setCompanies(data)
        setSelectedCompany(data[0])
    };

    useEffect(() => {
        getCompanies();
    }, [])



    return (
        <div className="min-w-full min-h-full bg-red-200 flex flex-col items-center">
            <h1 className="text-6xl m-20 mt-100 text-center">Select Stock for Trading</h1>

                <select className="bg-amber-100 text-3xl h-1/12 w-1/2 rounded-t-2xl text-center"
                    onChange={(e) => setSelectedCompany(companies.filter((company) => company.company_name === e.currentTarget.value)[0])}
                >
                    {companies.map((company) => (
                        <option key={company.stock_id}>{company.company_name}</option>
                    ))}
                </select>
            {/* Some drop down for companies, then a button to navigate to tradingpage/stockid */}
                    <button className='min-w-fit bg-blue-300 w-1/4 shadow-md shadow-slate-600 h-fit p-6 mt-30 rounded-xl text-center hover:scale-105 transition-transform duration-150'
                        onClick={async () => {
                            if (!selectedCompany) return;
                            navigate(`trade/${selectedCompany.stock_id}`)
                        }}
                    >
                        Trade {selectedCompany?.company_name}</button>
        </div>

    )
}