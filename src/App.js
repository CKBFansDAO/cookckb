import logo from './logo.svg';
import './App.css';
import appConfig from './appConfig';

function App() {
  return (
    <div className='flex justify-center p-10'>

      <div className="flex flex-col ">
        <span className='text-[96px] font-bold'>
          Hello CKBee 😄
        </span>
        <div className='flex'>
          <span className='text-green-700'>RPC url:</span>
          {appConfig.CKB.CKB_RPC_URL}
        </div>
        <div className='flex'>
          <span className='text-green-700'>Indexer url:</span>
          {appConfig.CKB.CKB_INDEXER_URL}
        </div>

      </div>
    </div>

  );
}

export default App;
