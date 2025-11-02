import './index.css';
import { useNavigate } from 'react-router-dom';

export default function NavMenu() {

  const navigate = useNavigate();
  // useEffect(() => {
  //   const testFastApi = async () => {
  //     const result = await axios.get('http://127.0.0.1:8000');
  //     console.log(result.data);
  //   };
  //   testFastApi();
  // }, []);

  return (
    <div className='h-fit flex w-full bg-gray-200'>
      <button className={'w-1/6 p-6 m-5 rounded-xl shadow-md shadow-slate-600 bg-orange-200'}
        onClick={() => navigate('/')}
      >
        View Form
      </button>
      <button className={'w-1/6 p-6 m-5 rounded-xl shadow-md shadow-slate-600 bg-orange-200'}
        onClick={() => navigate('/data')}
      >
        View Data
      </button>
      <button className={'w-1/6 p-6 m-5 rounded-xl shadow-md shadow-slate-600 bg-orange-200'}
        onClick={() => navigate('/stocks')}
      >
        Create Orders
      </button>
    </div>
  );
};