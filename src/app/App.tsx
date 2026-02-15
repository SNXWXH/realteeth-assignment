import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Main } from '../pages/main';
import { CityDetail } from '../pages/city-detail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/city/:cityId' element={<CityDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
