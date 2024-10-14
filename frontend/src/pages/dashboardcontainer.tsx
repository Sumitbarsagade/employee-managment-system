
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/sidebar';


import DashboardLayout from '@/layouts/dashboardlayout';

function DashboardContainer() {
  return (
    <div className='w-100vw h-lvh flex relative    mx-auto'>

    <Sidebar/>
    
   <div className='w-full overflow-auto'>
    <DashboardLayout >
    <Outlet />
    </DashboardLayout>
    </div>
    </div>
  )
}

export default DashboardContainer
