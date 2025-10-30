import { useRef, useState } from "react";
import axios from 'axios'

export default function DataForm() {

    type UserInfo = {
        full_name: string | undefined
    }

    type CompanyInfo = {
        name: string | undefined,
        ticker: string | undefined
    }

    type OrderInfo = {
        user_id: number | undefined,
        stock_id: number | undefined,
        is_bid: boolean | undefined
    }
    const userInfoTemplate: UserInfo = {
        full_name: undefined
    }

    const companyInfoTemplate: CompanyInfo = {
        name: undefined,
        ticker: undefined,
    }

    const orderInfoTemplate: OrderInfo = {
        user_id: undefined,
        stock_id: undefined,
        is_bid: undefined
    }

    const [bidding, setBidding] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo>(userInfoTemplate);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(companyInfoTemplate);
    const [orderInfo, setOrderInfo] = useState<OrderInfo>(orderInfoTemplate);


    const insertUser = async () => {
        const response = await axios.post('http://127.0.0.1:8000/add_user', userInfo)
        console.log(response.data)
    }
    const insertCompany = async () => {
        const response = await axios.post('http://127.0.0.1:8000/add_company', companyInfo)
        console.log(response.data)
    }


    return (
        <div className='h-full bg-slate-300 flex min-w-full mx-auto flex-col items-center'>
            <div className='h-1/3 bg-blue-400 flex min-w-full mx-auto flex-col items-center'>

                <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                    <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder="Enter User's Full Name"
                            onChange={(e) => setUserInfo(prev => ({ ...prev, full_name: e.target.value }))}

                        ></input>
                    </div>

                    <button className='min-w-fit bg-blue-300 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center'
                        onClick={async () => insertUser()}
                    >
                        Insert User</button>

                </div>

            </div>
            <div className='h-1/3 bg-green-300 flex min-w-full mx-auto flex-col items-center'>

                <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                    <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder='Enter Company Name'
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}

                        ></input>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder='Enter Abbreviation'
                            onChange={(e) => setCompanyInfo(prev => ({ ...prev, ticker: e.target.value }))}
                        ></input>
                    </div>

                    <button className='min-w-fit bg-emerald-200 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center'
                        onClick={async () => insertCompany()}

                    >
                        Insert Company </button>

                </div>

            </div>
            <div className='h-1/3 bg-red-300 flex min-w-full mx-auto flex-col items-center'>

                <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                    <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>

                        <div className='flex flex-row min-w-full h-1/5 justify-evenly items-center'>
                            <button className={'min-w-fit w-1/3 shadow-md shadow-slate-600 h-fit p-2 rounded-xl text-center' + ' ' + (bidding ? 'bg-green-300' : 'bg-pink-300')}
                                onClick={() => setBidding(true)}
                            >
                                Bid
                            </button>
                            <button className={'min-w-fit w-1/3 shadow-md shadow-slate-600 h-fit p-2 rounded-xl text-center' + ' ' + (!bidding ? 'bg-green-300' : 'bg-pink-300')}
                                onClick={() => setBidding(false)}
                            >
                                Ask</button>
                        </div>

                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder="Enter User ID"
                        ></input>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder="Enter Stock ID"
                        ></input>

                    </div>

                    <button className='min-w-fit bg-pink-300 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center'>
                        Insert Order
                    </button>

                </div>

            </div>

        </div>
    )
}