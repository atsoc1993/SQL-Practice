import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavMenu from "./NavMenu";

type CompanyInfoResponse = {
    StockID: number;
    CompanyName: string;
    AssetTicker: string;
    CirculatingShares: number | undefined;
    MarketCapitalization: number | undefined;
}


type OrderInfoResponse = {
    UserID: number;
    StockID: string;
    OrderID: number;
    IsBid: string;
    Price: number | undefined;
};

type UserOrdersRequest = {
    UserID: number;
    StockID: number;
}

export default function TradingPage() {
    const { userId, stockId } = useParams<{ userId: string, stockId: string }>();

    const [usersOrders, setUsersOrders] = useState<OrderInfoResponse[]>([])
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
            UserID: Number(userId),
            StockID: Number(stockId)
        }
        const result = await axios.post(`http://127.0.0.1:8000/users/user_orders`, usersOrderRequest)
        setUsersOrders(result.data)
        console.log(result.data)
    }
    
    const getAllOrdersForStock = async () => {
        // if (!userId || !stockId) return;
        // const usersOrderRequest: UserOrdersRequest = {
        //     UserID: Number(userId),
        //     StockID: Number(stockId)
        // }
        // const result = await axios.post(`http://127.0.0.1:8000/users/user_orders`, usersOrderRequest)
        // setOrders(result.data)
        // console.log(result.data)
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
            <NavMenu />
            <h1 className="text-6xl m-20 mt-20 text-center text-white">Create Orders</h1>

            {/* display general company info, all bids and asks, and users current open orders */}

            <h1 className="text-white place-self-center mb-5 text-4xl">{companyInfo?.CompanyName} ({companyInfo?.AssetTicker})</h1>
            <div className="overflow-x-auto w-3/4">
            <div className="mb-10">
                <h1 className="text-white place-self-center mb-5 text-sm">Market Capitalization: {companyInfo?.MarketCapitalization?.toLocaleString()}</h1>
                <h1 className="text-white place-self-center mb-5 text-sm">Circulating Shares: {companyInfo?.CirculatingShares?.toLocaleString()}</h1>
                <h1 className="text-white place-self-center mb-5 text-sm">Price: ${(companyInfo && companyInfo.MarketCapitalization && companyInfo.CirculatingShares) ? (companyInfo.MarketCapitalization / companyInfo.CirculatingShares).toLocaleString() : 'ERROR'}</h1>
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
                        {usersOrders.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-5 py-10 text-center text-slate-500">
                                    No Orders yet.
                                </td>
                            </tr>
                        ) : (
                            usersOrders.map(o => (
                                <tr key={o.OrderID} className="hover:bg-red-300 text-center">
                                    <td className="px-5 py-3 text-sm text-slate-700">{o.OrderID}</td>
                                    <td className="px-5 py-3 text-sm text-slate-900 font-medium">{o.StockID}</td>
                                    <td className="px-5 py-3 text-sm text-slate-900 font-medium">{o.UserID}</td>
                                    <td className="px-5 py-3 text-sm text-slate-900 font-medium">{o.IsBid ? 'Bid' : 'Ask'}</td>

                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    )
}