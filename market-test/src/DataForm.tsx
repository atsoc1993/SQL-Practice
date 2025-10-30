import { useState } from "react";

export default function DataForm() {

    const [bidding, setBidding] = useState(true);

    return (
        <div className='h-full bg-slate-300 flex min-w-full mx-auto flex-col items-center'>
            <div className='h-1/3 bg-green-300 flex min-w-full mx-auto flex-col items-center'>

                <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                    <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder='Enter Company Name'
                        ></input>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder='Enter Abbreviation'
                        ></input>
                    </div>

                    <button className='min-w-fit bg-emerald-200 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center'>
                        Insert Company </button>

                </div>

            </div>
            <div className='h-1/3 bg-blue-400 flex min-w-full mx-auto flex-col items-center'>

                <div className='h-full flex min-w-full mx-auto justify-center flex-row items-center'>

                    <div className='h-full flex w-1/4 min-w-fit justify-center flex-col items-center'>
                        <input className='min-w-fit shadow-md shadow-slate-600 m-5 h-fit p-6 rounded-xl text-center focus:outline-none'
                            placeholder="Enter User's Full Name"
                        ></input>
                    </div>

                    <button className='min-w-fit bg-blue-300 w-1/4 shadow-md shadow-slate-600 h-fit p-6 m-10 rounded-xl text-center'>
                        Insert User</button>

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