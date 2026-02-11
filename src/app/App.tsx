import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>Vite + React</h1>
        <div className='mb-4'>
          <button
            onClick={() => setCount((count) => count + 1)}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            count is {count}
          </button>
        </div>
        <p className='text-gray-600'>
          Edit <code>src/app/index.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}

export default App;
