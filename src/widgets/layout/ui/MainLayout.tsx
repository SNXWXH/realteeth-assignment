import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className='min-h-screen bg-background'>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
