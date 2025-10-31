import { useState } from 'react';
import DataForm from './DataForm';
import './index.css';
import DataPage from './DataPage';

export default function App() {

  const [viewingData, setViewingData] = useState(false);

  // useEffect(() => {
  //   const testFastApi = async () => {
  //     const result = await axios.get('http://127.0.0.1:8000');
  //     console.log(result.data);
  //   };
  //   testFastApi();
  // }, []);

  return (
    <>

      <button className={'w-1/6 p-6 m-5 fixed rounded-xl shadow-md shadow-slate-600' + ' ' + (!viewingData ? 'bg-orange-200' : 'bg-blue-300')}
        onClick={() => setViewingData(!viewingData)}
      >
        {viewingData ? 'Back to Form' : 'View Data'}</button>
      {viewingData ? <DataPage /> : <DataForm />}
    </>
  );
};