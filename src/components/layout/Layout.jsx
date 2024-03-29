import React from 'react';
import SideBar from './SideBar';
import MainView from './MainView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/toastify_override.css'

const Layout = () => {
    return (
        <div className='flex w-full min-h-screen'>
            <div className='fixed w-60 h-full'>
                <SideBar></SideBar>
            </div>
            <div className='pl-60 flex w-full justify-center'>
                <MainView></MainView>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default Layout;
