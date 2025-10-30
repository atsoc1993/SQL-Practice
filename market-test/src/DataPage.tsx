import { useEffect, useState } from "react";
import axios from 'axios';

export default function DataPage() {

    type UserInfoResponse = {
        user_id: number,
        full_name: string
    }

    type CompanyInfoResponse = {
        stock_id: number,
        company_name: string,
        asset_ticker: string
    }


    const [users, setUsers] = useState<UserInfoResponse[]>([]);
    const [companies, setCompanies] = useState<CompanyInfoResponse[]>([]);

    const getUsers = async () => {
        const response = await axios.get('http://127.0.0.1:8000/get_users')
        setUsers(response.data)
    }
    const getCompanies = async () => {
        const response = await axios.get('http://127.0.0.1:8000/get_companies')
        console.log(response.data)
        setCompanies(response.data)
    }

    useEffect(() => {
        getUsers();
        getCompanies();
    }, [])

    return (
        <div className="min-w-full min-h-full bg-orange-200">
            <h1 className="text-6xl m-20 text-center">Data View</h1>

            <div className="mx-auto w-5/12 max-w-5xl rounded-xl shadow-md shadow-slate-600">
                <div className="flex items-center justify-between px-5 py-4 bg-blue-400">
                    <h2 className="text-2xl font-semibold">Users</h2>
                    <span className="text-sm text-slate-500">{users.length} total</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-t border-slate-200">
                        <thead className="bg-blue-300">
                            <tr className=" text-slate-600 divide-y border-b">
                                <th className="px-5 py-3 text-sm font-medium">ID</th>
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
                                    <tr key={u.user_id} className="hover:bg-blue-400 text-center">
                                        <td className="px-5 py-3 text-sm text-slate-700">{u.user_id}</td>
                                        <td className="px-5 py-3 text-sm text-slate-900 font-medium">{u.full_name}</td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                </div>
                <div className="mx-auto w-5/12 max-w-5xl rounded-xl shadow-md shadow-slate-600 m-10">
                    <div className="flex items-center justify-between px-5 py-4 bg-green-300">
                        <h2 className="text-2xl font-semibold">Companies</h2>
                        <span className="text-sm text-slate-500">{companies.length} total</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-t border-slate-200 ">
                            <thead className='bg-emerald-200'>
                                <tr className=" text-slate-600 divide-y border-b">
                                    <th className="px-5 py-3 text-sm font-medium">Company Name</th>
                                    <th className="px-5 py-3 text-sm font-medium">Ticker</th>
                                    <th className="px-5 py-3 text-sm font-medium">Stock ID</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-emerald-200">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-10 text-center text-slate-500">
                                            No Companies yet.
                                        </td>
                                    </tr>
                                ) : (
                                    companies.map(c => (
                                        <tr key={c.company_name} className="hover:bg-green-300 text-center">
                                            <td className="px-5 py-3 text-sm text-slate-700">{c.company_name}</td>
                                            <td className="px-5 py-3 text-sm text-slate-900 font-medium">{c.asset_ticker}</td>
                                            <td className="px-5 py-3 text-sm text-slate-900 font-medium">{c.stock_id}</td>

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