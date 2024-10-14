import { Link } from "@nextui-org/link";
import {  Menu, MenuItem} from '@nextui-org/react';
import { Home, UserPlus, Users, User, Edit, LogOut } from 'lucide-react';
import { Logo } from './icons';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
const Sidebar = () => {
  const navigate = useNavigate();

  const logoutFunction=()=>{
    
    localStorage.removeItem('token');
    toast.success("you are successfully logout");
    navigate("/");
  }
  


  return (
    <div className="h-screen  ">
      <div className="flex flex-col h-full">
        {/* Logo and Company Name */}
        <div className="p-4 mb-4">
            <Logo/>
          <h2 className="text-2xl bold">SmartTrack HR</h2>
        </div>

        {/* Menu Items */}
        <Menu className="flex-grow">
          <MenuItem key="dashboard" startContent={<Home size={24} />}>
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/admin/dashboard"
          >
              Dashboard
          </Link>
          
          </MenuItem>
          <MenuItem key="add-employees" startContent={<UserPlus size={24} />}>
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/admin/dashboard/addemployee"
          >
          
          Add Employees
          </Link>
          </MenuItem>
          <MenuItem key="view-employees" startContent={<Users size={24} />}>
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/admin/dashboard/viewemployee"
          >
         View Employees
          </Link>
          
            
          </MenuItem>
          <MenuItem key="admin-profile" startContent={<User size={24} />}>
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/admin/dashboard/profile"
          >
          
          Admin Profile
          </Link>
        
          </MenuItem>
          <MenuItem key="edit-admin" startContent={<Edit size={24} />}>
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/admin/dashboard/editdetails"
          >
          
          Edit Admin
          </Link>
          
          </MenuItem>
        </Menu>

        {/* Logout Button */}
        <div className="p-4">
          <button onClick={logoutFunction} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors">
            <LogOut size={20}  />
           
            Log Out

          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;