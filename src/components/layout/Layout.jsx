import React from 'react';
import SideBar from './SideBar';
import MainView from './MainView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/toastify_override.css'
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import Footer from '../footer/Footer';
import WalletSelector from '../../walletmgr/WalletSelector';

const queryClient = new QueryClient();

const Layout = () => {
    return (<QueryClientProvider client={queryClient}>
        <div className='flex w-full min-h-screen'>
            <div className='fixed w-60 h-full'>
                <SideBar></SideBar>
            </div>
            <div className='pl-60 flex flex-col w-full justify-center'>
                <div className="flex py-20 grow w-full min-w-full justify-center">
                    <MainView />
                </div>
                <Footer />
            </div>

            <ToastContainer />
            <WalletSelector></WalletSelector>
            <div id="app-message-box" />
        </div>
    </QueryClientProvider>
    );
}

export default Layout;
