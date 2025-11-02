import { useEffect, useState } from "react";
import axios from 'axios';
import NavMenu from "./NavMenu";
export default function DataPage() {

    type UserInfoResponse = {
        UserID: number;
        UserFullName: string;
    };

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

    const [users, setUsers] = useState<UserInfoResponse[]>([]);
    const [companies, setCompanies] = useState<CompanyInfoResponse[]>([]);
    const [orders, setOrders] = useState<OrderInfoResponse[]>([]);



    const getUsers = async () => {
        const response = await axios.get('http://127.0.0.1:8000/users/get_users')
        console.log(response.data)
        setUsers(response.data)
    };

    const getCompanies = async () => {
        const response = await axios.get('http://127.0.0.1:8000/companies/get_companies')
        const data: CompanyInfoResponse[] = response.data
        console.log(data)
        setCompanies(data)
    };

    const getOrders = async () => {
        const response = await axios.get('http://127.0.0.1:8000/orders/get_orders')
        console.log(response.data)
        setOrders(response.data)
    };

    useEffect(() => {
        getUsers();
        getCompanies();
        getOrders();
    }, [])


    return (
        <div className="min-w-full min-h-full bg-slate-400">
                <NavMenu />

            <h1 className="text-6xl m-20 mt-40 text-center">Data View</h1>

            <div className="mx-auto w-7/12 max-w-5xl rounded-xl shadow-md shadow-slate-600">
                <div className="flex items-center justify-between px-5 py-4 bg-blue-400">
                    <h2 className="text-2xl font-semibold">Users</h2>
                    <span className="text-sm text-slate-500">{users.length} total</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-t border-slate-200">
                        <thead className="bg-blue-300">
                            <tr className=" text-slate-600 divide-y border-b">
                                <th className="px-5 py-3 text-sm font-medium">User ID</th>
                                <th className="px-5 py-3 text-sm font-medium">Full name</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-blue-300">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-5 py-10 text-center text-slate-500">
                                        No users yet.
                                    </td>
                                </tr>
                            ) : (
                                users.map(u => (
                                    <tr key={u.UserID} className="hover:bg-blue-400 text-center">
                                        <td className="px-5 py-3 text-sm text-slate-700">{u.UserID}</td>
                                        <td className="px-5 py-3 text-sm text-slate-900 font-medium">{u.UserFullName}</td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mx-auto w-7/12 max-w-5xl rounded-xl shadow-md shadow-slate-600 m-10">
                <div className="flex items-center justify-between px-5 py-4 bg-green-300">
                    <h2 className="text-2xl font-semibold">Companies</h2>
                    <span className="text-sm text-slate-500">{companies.length} total</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-t border-slate-200 ">
                        <thead className='bg-emerald-200'>
                            <tr className=" text-slate-600 divide-y border-b">
                                <th className="px-5 py-3 text-sm font-medium">Stock ID</th>
                                <th className="px-5 py-3 text-sm font-medium">Company Name</th>
                                <th className="px-5 py-3 text-sm font-medium">Ticker</th>
                                <th className="px-5 py-3 text-sm font-medium">Circulating Shares</th>
                                <th className="px-5 py-3 text-sm font-medium">Market Cap</th>
                                <th className="px-5 py-3 text-sm font-medium">Price</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-emerald-200">
                            {companies.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                                        No Companies yet.
                                    </td>
                                </tr>
                            ) : (
                                companies.map(c => (
                                    <tr key={c.CompanyName} className="hover:bg-green-300 text-center">
                                        <td className="px-5 py-3 text-sm text-slate-900 font-medium">{c.StockID}</td>
                                        <td className="px-5 py-3 text-sm text-slate-700">{c.CompanyName}</td>
                                        <td className="px-5 py-3 text-sm text-slate-900 font-medium">{c.AssetTicker}</td>
                                        <td className="px-5 py-3 text-sm text-slate-900 font-medium">{c.CirculatingShares?.toLocaleString()}</td>
                                        <td className="px-5 py-3 text-sm text-slate-900 font-medium">${c.MarketCapitalization?.toLocaleString()}</td>
                                        <td className="px-5 py-3 text-sm text-slate-900 font-medium">${(c.MarketCapitalization && c.CirculatingShares) ? (c.MarketCapitalization / c.CirculatingShares).toLocaleString() : 'ERROR'}</td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mx-auto w-7/12 max-w-5xl rounded-xl shadow-md shadow-slate-600 m-10">
                <div className="flex items-center justify-between px-5 py-4 bg-red-300">
                    <h2 className="text-2xl font-semibold">Orders</h2>
                    <span className="text-sm text-slate-500">{orders.length} total</span>
                </div>

                <div className="overflow-x-auto">
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
                                    <tr key={o.OrderID} className="hover:bg-green-300 text-center">
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
        </div>

    )
}