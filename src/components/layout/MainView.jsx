import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from '../../pages/Home';
import ConnectWalletView from '../../pages/basicTutorials/ConnectWalletView';
import CreateSporeView from '../../pages/spore/CreateSporeView';

const MainView = () => {


    return (
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/basic_tutorials/connect_wallets' element={<ConnectWalletView />} />
                <Route path='/spore/create_spore' element={<CreateSporeView />} />
                
            </Routes>
    );
}

export default MainView;
