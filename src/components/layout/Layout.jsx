import React from 'react';
import SideBar from './SideBar';
import MainView from './MainView';
import { BrowserRouter } from 'react-router-dom';

const Layout = () => {
    return (
        <div className='flex w-full min-h-screen'>
            <div className='fixed w-60 h-full'>
                <SideBar></SideBar>
            </div>
            <div className='pl-60 p-5'>
                <MainView></MainView>
            </div>
        </div>
    );
}

export default Layout;
