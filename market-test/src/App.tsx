import { useState } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

export default function App() {

  const [viewingData, setViewingData] = useState(false);
  const [viewingOrderPage, setViewingOrderPage] = useState(false);

  const navigate = useNavigate();
  // useEffect(() => {
  //   const testFastApi = async () => {
  //     const result = await axios.get('http://127.0.0.1:8000');
  //     console.log(result.data);
  //   };
  //   testFastApi();
  // }, []);

  return (
    <>
      <button className={'w-1/6 p-6 m-5 fixed rounded-xl shadow-md shadow-slate-600 bg-orange-200'}
        onClick={() => navigate('/')}
      >
        View Form
      </button>
      <button className={'w-1/6 p-6 m-5 fixed left-50 rounded-xl shadow-md shadow-slate-600 bg-orange-200'}
        onClick={() => navigate('data')}
      >
        View Data
      </button>
      <button className={'w-1/6 p-6 m-5 fixed left-100 rounded-xl shadow-md shadow-slate-600 bg-orange-200'}
        onClick={() => navigate('stocks')}
      >
        Create Orders
      </button>
    </>
  );
};