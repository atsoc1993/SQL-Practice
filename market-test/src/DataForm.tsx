import { useEffect, useRef, useState, type RefObject } from "react";
import axios from 'axios'
import NavMenu from "./NavMenu";
import './index.css'
export default function DataForm() {

    type UserInfo = {
        full_name: string | undefined;
    }

    type CompanyInfo = {
        name: string | undefined;
        ticker: string | undefined;
        circulating_shares: number | undefined;
        market_capitalization: number | undefined;
    }

    type OrderInfo = {
        user_id: number | undefined;
        stock_id: number | undefined;
        is_bid: boolean | undefined;
        price: number | undefined;
    }
    const userInfoTemplate: UserInfo = {
        full_name: undefined
    };

    const companyInfoTemplate: CompanyInfo = {
        name: undefined,
        ticker: undefined,
        circulating_shares: undefined,
        market_capitalization: undefined
    };

    const orderInfoTemplate: OrderInfo = {
        user_id: undefined,
        stock_id: undefined,
        is_bid: true,
        price: undefined
    };

    const [userInfo, setUserInfo] = useState<UserInfo>(userInfoTemplate);

    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(companyInfoTemplate);

    const [bidding, setBidding] = useState(true);

    const [orderInfo, setOrderInfo] = useState<OrderInfo>(orderInfoTemplate);

    const [insertingItem, setInsertingItem] = useState<boolean>(false);

    const userNameInput = useRef<HTMLInputElement>(null)
    const companyNameInput = useRef<HTMLInputElement>(null)
    const companyAbbrInput = useRef<HTMLInputElement>(null)
    const companyCirculatingSupplyInput = useRef<HTMLInputElement>(null)
    const companyMarketCapInput = useRef<HTMLInputElement>(null)
    const orderUserIdInput = useRef<HTMLInputElement>(null)
    const orderStockIDInput = useRef<HTMLInputElement>(null)
    const orderPriceInput = useRef<HTMLInputElement>(null)

    const [refs, setRefs] = useState<RefObject<HTMLInputElement | null>[]>([])

    useEffect(() => {
        if (!(
            userNameInput &&
            companyNameInput &&
            companyAbbrInput &&
            companyCirculatingSupplyInput &&
            companyMarketCapInput &&
            orderUserIdInput &&
            orderStockIDInput
        )) return;
        setRefs([
            userNameInput,
            companyNameInput,
            companyAbbrInput,
            companyCirculatingSupplyInput,
            companyMarketCapInput,
            orderUserIdInput,
            orderStockIDInput,
            orderPriceInput
        ])
    }, [])
    const insertUser = async () => {
        if (!userInfo.full_name) {
            alert("You did not enter a user's full name")
            return
        };
        if ((userInfo.full_name?.split(' ')).length === 0) {
            alert("Spaces don't count as a name")
            return;
        }
        clearRefFields();
        const response = await axios.post('http://127.0.0.1:8000/users/add_user', userInfo)
        console.log(response.data)
        setUserInfo(userInfoTemplate)
    };

    const insertCompany = async () => {
        console.log(companyInfo)
        if ([companyInfo.name, companyInfo.ticker, companyInfo.circulating_shares, companyInfo.market_capitalization].some(v => v == null)) {
            if (companyInfo.name === undefined) {
                alert('You did not enter a Company Name')
            } else if (companyInfo.ticker === undefined) {
                alert('You did not enter a Company Abbreviation')
            } else if (companyInfo.circulating_shares === undefined) {
                alert('You did not enter # of circulating shares')
            } else if (companyInfo.market_capitalization === undefined) {
                alert('You did not enter an Initial Market Cap')
            }
            return;
        }
        if (!companyInfo.market_capitalization || !companyInfo.circulating_shares) return;
        if (companyInfo.market_capitalization / companyInfo.circulating_shares < 0.01) {
            alert(`The minimum price per share (Price = Market Cap / Circulating Supply) must be greater than $0.01. Your current stock price is ${companyInfo.market_capitalization / companyInfo.circulating_shares}`)
            return;
        }
        clearRefFields();
        const response = await axios.post('http://127.0.0.1:8000/companies/add_company', companyInfo)
        console.log(response.data)
        setCompanyInfo(companyInfoTemplate)
    };

    const insertOrder = async () => {
        console.log(orderInfo)
        if ([orderInfo.is_bid, orderInfo.stock_id, orderInfo.user_id].some(v => v == null)) {
            if (orderInfo.stock_id === undefined) {
                alert('You did not enter a Stock ID')
            } else if (orderInfo.user_id === undefined) {
                alert('You did not enter a User ID')
            } else if (orderInfo.price === undefined) {
                alert(`You did not enter a price for your ${orderInfo.is_bid ? 'bid' : 'ask'}`)
            }
            return;
        }
        clearRefFields();

        const response = await axios.post('http://127.0.0.1:8000/orders/add_order', orderInfo)
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

    const clearRefFields = () => {
        refs.map((ref) => {
            if (!ref.current) return;
            ref.current.value = ''
        }
        )
    }



    return (
        <>
            <div className='h-full flex min-w-full mx-auto flex-col items-center'>
                <NavMenu />
                {insertingItem && <InsertingItem />}
                <div className='h-fit bg-blue-400 flex min-w-full mx-auto flex-col items-center p-6'>

                    <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                        <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>
                            <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                                placeholder="Enter User's Full Name"
                                ref={userNameInput}
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
                <div className='h-fit bg-green-300 flex min-w-full mx-auto flex-col items-center p-6'>

                    <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                        <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>
                            <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                                placeholder='Enter Company Name'
                                ref={companyNameInput}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}

                            ></input>
                            <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                                placeholder='Enter Abbreviation'
                                ref={companyAbbrInput}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, ticker: e.target.value }))}
                            ></input>
                            <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                                placeholder='Enter Circulating Supply'
                                ref={companyCirculatingSupplyInput}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, circulating_shares: Number(e.target.value) }))}
                            ></input>
                            <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                                placeholder='Enter Market Cap.'
                                ref={companyMarketCapInput}
                                onChange={(e) => setCompanyInfo(prev => ({ ...prev, market_capitalization: Number(e.target.value.split('$')[0]) }))}
                            ></input>
                        </div>

                        <button className='min-w-fit bg-emerald-200 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center hover:scale-105 transition-transform duration-150'
                            onClick={async () => {
                                setInsertingItem(true);
                                try {
                                    await insertCompany()

                                } catch {
                                    setInsertingItem(false);
                                }
                                setInsertingItem(false);
                            }}                    >
                            Insert Company </button>

                    </div>

                </div>
                <div className='h-fit bg-red-300 flex min-w-full mx-auto flex-col items-center p-6'>

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
                                ref={orderUserIdInput}
                                onChange={(e) => setOrderInfo(prev => ({ ...prev, user_id: Number(e.target.value) }))}
                            ></input>
                            <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                                placeholder="Enter Stock ID"
                                ref={orderStockIDInput}
                                onChange={(e) => setOrderInfo(prev => ({ ...prev, stock_id: Number(e.target.value) }))}
                            ></input>
                            <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                                placeholder="Enter Price"
                                ref={orderPriceInput}
                                onChange={(e) => setOrderInfo(prev => ({ ...prev, price: Number(e.target.value) }))}
                            ></input>

                        </div>

                        <button className='min-w-fit bg-pink-300 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center hover:scale-105 transition-transform duration-150'
                            onClick={async () => {
                                setInsertingItem(true);
                                try {
                                    await insertOrder()

                                } catch {
                                    setInsertingItem(false);
                                }
                                setInsertingItem(false);
                            }}
                        >
                            Insert Order
                        </button>

                    </div>

                </div>

            </div>
        </>
    )
}