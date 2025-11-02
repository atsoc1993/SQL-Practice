import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type CompanyInfoResponse = {
    stock_id: number;
    company_name: string;
    asset_ticker: string;
    circulating_shares: number | undefined;
    market_capitalization: number | undefined;
}

type OrderInfoResponse = {
    user_id: number;
    stock_id: string;
    order_id: number;
    is_bid: string;
    price: number | undefined;
};

type UserOrdersRequest = {
    user_id: number;
    stock_id: number;
}

export default function TradingPage() {
    const { userId, stockId } = useParams<{ userId: string, stockId: string }>();

    const [orders, setOrders] = useState<OrderInfoResponse[]>([])
    const [companyInfo, setCompanyInfo] = useState<CompanyInfoResponse | undefined>(undefined)

    const getCompanyInfo = async () => {
        const result = await axios.get(`http://127.0.0.1:8000/companies/get_company_by_id/${stockId}`)
        const data: CompanyInfoResponse = result.data
        console.log(data)
        setCompanyInfo(data)
    }   

    const getUsersOrders = async () => {
        console.log(userId, stockId)
        if (!userId || !stockId) return;
        const usersOrderRequest: UserOrdersRequest = {
            user_id: Number(userId),
            stock_id: Number(stockId)
        }
        const result = await axios.post(`http://127.0.0.1:8000/users/user_orders`, usersOrderRequest)
        setOrders(result.data)
        console.log(result.data)
    }


    useEffect(() => {
        getCompanyInfo()
        getUsersOrders()
    }, [])
    // const get this companies info

    // const get this companies orders (bid and ask)

    // seperate viewing open orders

    return (
        <div className="min-w-full min-h-full bg-gray-900 flex flex-col items-center">
            <h1 className="text-6xl m-20 mt-40 text-center text-white">Create Orders</h1>

            {/* display general company info, all bids and asks, and users current open orders */}

            <h1 className="text-white place-self-center mb-5 text-4xl">{companyInfo?.company_name} ({companyInfo?.asset_ticker})</h1>
            <div className="overflow-x-auto w-3/4">
            <div className="mb-10">
                <h1 className="text-white place-self-center mb-5 text-sm">Market Capitalization: {companyInfo?.market_capitalization?.toLocaleString()}</h1>
                <h1 className="text-white place-self-center mb-5 text-sm">Circulating Shares: {companyInfo?.circulating_shares?.toLocaleString()}</h1>
                <h1 className="text-white place-self-center mb-5 text-sm">Price: ${(companyInfo && companyInfo.market_capitalization && companyInfo.circulating_shares) ? (companyInfo.market_capitalization / companyInfo.circulating_shares).toLocaleString() : 'ERROR'}</h1>
            </div>
            <h1 className="text-white place-self-center mb-5 text-2xl">Your Open Orders</h1>
                <table className="w-full border-t border-slate-200 ">
                    <thead className='bg-pink-300'>
                        <tr className=" text-slate-600 divide-y border-b">
                            <th className="px-5 py-3 text-sm font-medium">Order ID</th>
                            <th className="px-5 py-3 text-sm font-medium">Stock ID</th>
                            <th className="px-5 py-3 text-sm font-medium">User ID</th>
                            <th className="px-5 py-3 text-sm font-medium">Bid</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-pink-300">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                                    No Orders yet.
                                </td>
                            </tr>
                        ) : (
                            orders.map(o => (
                                <tr key={o.order_id} className="hover:bg-green-300 text-center">
                                    <td className="px-5 py-3 text-sm text-slate-700">{o.order_id}</td>
                                    <td className="px-5 py-3 text-sm text-slate-900 font-medium">{o.stock_id}</td>
                                    <td className="px-5 py-3 text-sm text-slate-900 font-medium">{o.user_id}</td>
                                    <td className="px-5 py-3 text-sm text-slate-900 font-medium">{o.is_bid ? 'Bid' : 'Ask'}</td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    )
}