import { useEffect } from 'react';
import axios from 'axios';
import './index.css';

export default function App() {

  useEffect(() => {
    const testFastApi = async () => {
      const result = await axios.get('http://127.0.0.1:8000');
      console.log(result.data);
    };
    testFastApi();
  }, []);

  return (
    <div className='h-full bg-slate-300 flex min-w-full w-full mx-auto items-center'>
      <input className='min-w-fit shadow-md shadow-amber-600 h-fit mx-auto justify-self-center p-6 rounded-xl text-center border-none'
      placeholder='Enter Company Name'
      ></input>
    </div>
  );
};