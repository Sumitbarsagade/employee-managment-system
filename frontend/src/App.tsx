import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import AdminSignUpPage from "./pages/adminsignuppage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminDashboard from "./pages/dashboard";

import Addemployee from "./components/addemployee";

import Editdetails from "./components/editprofile";

import Profile from "./components/profile";

import Employees from "./components/viewemployee";


import DashboardContainer from "./pages/dashboardcontainer";







function App() {
  return (
    <>
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<AdminSignUpPage />} path="/admin/signup" />



      <Route element={<DashboardContainer />} path="/admin/dashboard" >
      
      <Route index element={<AdminDashboard />} /> 
      
      <Route element={<Editdetails />} path="editdetails" />
      <Route element={<Profile />} path="profile" />

      <Route element={<Addemployee/>} path="addemployee" />

      <Route element={<Employees />} path="viewemployee" />
      
      </Route>

    </Routes>
     {/* ToastContainer for displaying toasts globally */}
     <ToastContainer
     position="top-right" // You can set position: top-left, top-right, bottom-left, etc.
     autoClose={5000}     // Toast auto-close duration (milliseconds)
     hideProgressBar={false} // Show or hide progress bar
     newestOnTop={false}
     closeOnClick
     pauseOnFocusLoss
     draggable
     pauseOnHover
   />
   </>
  );
}

export default App;
