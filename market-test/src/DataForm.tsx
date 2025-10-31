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
        is_bid: true
    }

    const [userInfo, setUserInfo] = useState<UserInfo>(userInfoTemplate);

    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(companyInfoTemplate);

    const [bidding, setBidding] = useState(true);

    const [orderInfo, setOrderInfo] = useState<OrderInfo>(orderInfoTemplate);

    const [insertingItem, setInsertingItem] = useState<boolean>(false);


    const insertUser = async () => {
        const response = await axios.post('http://127.0.0.1:8000/add_user', userInfo)
        if (!userInfo.full_name) {
            alert("You did not enter a user's full name")
            return
        };
        if ((userInfo.full_name?.split(' ')).length === 0) {
            alert("Spaces don't count as a name")
            return;
        }
        console.log(response.data)
        setUserInfo(userInfoTemplate)
    };

    const insertCompany = async () => {
        if ([companyInfo.name, companyInfo.ticker].some(v => v == null)) {
            if (companyInfo.name === undefined) {
                alert('You did not enter a Company Name')
            } else {
                alert('You did not enter a Company Abbreviation')
            }
            return;
        }
        const response = await axios.post('http://127.0.0.1:8000/add_company', companyInfo)
        console.log(response.data)
        setCompanyInfo(companyInfoTemplate)
    };

    const insertOrder = async () => {
        if ([orderInfo.is_bid, orderInfo.stock_id, orderInfo.user_id].some(v => v == null)) {
            if (orderInfo.stock_id === undefined) {
                alert('You did not enter a Stock ID')
            } else {
                alert('You did not enter a User ID')
            }
            return;
        }
        const response = await axios.post('http://127.0.0.1:8000/add_order', orderInfo)
        console.log(response.data)
        setOrderInfo(orderInfoTemplate)
        setBidding(true);
    };

    function InsertingItem() {
        return (
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                flex flex-col items-center justify-evenly">

                <div className="justify-self-center h-200 w-200 animate-ping rounded-full
            shadow-lg shadow-red-400 border-2 border-amber-50 self-center flex"/>
            </div>
        )
    }



    return (
        <div className='h-full bg-slate-300 flex min-w-full mx-auto flex-col items-center'>
            {insertingItem && <InsertingItem />}
            <div className='h-1/3 bg-blue-400 flex min-w-full mx-auto flex-col items-center'>

                <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                    <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder="Enter User's Full Name"
                            onChange={(e) => setUserInfo(prev => ({ ...prev, full_name: e.target.value }))}

                        ></input>
                    </div>

                    <button className='min-w-fit bg-blue-300 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center hover:scale-105 transition-transform duration-150'
                        onClick={async () => {
                            setInsertingItem(true);
                            try {
                                await insertUser()

                            } catch {
                                setInsertingItem(false);
                            }
                            setInsertingItem(false);
                        }}
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

                    <button className='min-w-fit bg-emerald-200 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center hover:scale-105 transition-transform duration-150'
                        onClick={async () => {
                            setInsertingItem(true);
                            await insertCompany()
                            setInsertingItem(false);
                        }}                    >
                        Insert Company </button>

                </div>

            </div>
            <div className='h-1/3 bg-red-300 flex min-w-full mx-auto flex-col items-center'>

                <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                    <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>

                        <div className='flex flex-row min-w-full h-1/5 justify-evenly items-center'>
                            <button className={'min-w-fit w-1/3 shadow-md shadow-slate-600 h-fit p-2 rounded-xl text-center hover:scale-105 transition-transform duration-150' + ' ' + (bidding ? 'bg-green-300' : 'bg-pink-300')}
                                onClick={() => {
                                    setBidding(true)
                                    setOrderInfo(prev => ({ ...prev, is_bid: true }))
                                }}
                            >
                                Bid
                            </button>
                            <button className={'min-w-fit w-1/3 shadow-md shadow-slate-600 h-fit p-2 rounded-xl text-center hover:scale-105 transition-transform duration-150' + ' ' + (!bidding ? 'bg-green-300' : 'bg-pink-300')}
                                onClick={() => {
                                    setBidding(false)
                                    setOrderInfo(prev => ({ ...prev, is_bid: false }))
                                }}
                            >
                                Ask</button>
                        </div>

                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder="Enter User ID"
                            onChange={(e) => setOrderInfo(prev => ({ ...prev, user_id: Number(e.target.value) }))}
                        ></input>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder="Enter Stock ID"
                            onChange={(e) => setOrderInfo(prev => ({ ...prev, stock_id: Number(e.target.value) }))}
                        ></input>

                    </div>

                    <button className='min-w-fit bg-pink-300 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center hover:scale-105 transition-transform duration-150'
                        onClick={async () => {
                            setInsertingItem(true);
                            await insertOrder()
                            setInsertingItem(false);
                        }}                    >
                        Insert Order
                    </button>

                </div>

            </div>

        </div>
    )
}