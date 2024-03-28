import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from '../../pages/Home';
import ConnectWalletView from '../../pages/basicTutorials/ConnectWalletView';

const MainView = () => {


    return (
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/basic_tutorials/connect_wallets' element={<ConnectWalletView />} />
            </Routes>
    );
}

export default MainView;
