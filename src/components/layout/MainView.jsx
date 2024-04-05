import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from '../../pages/Home';
import ConnectWalletView from '../../pages/basicTutorials/ConnectWalletView';
import CreateSporeView from '../../pages/spore/CreateSporeView';
import TransferCKBView from '../../pages/basicTutorials/TransferCKBView';
import TransferCKBViewT from '../../pages/basicTutorials/TransferCKBViewT';
import TestView from '../../pages/basicTutorials/TestView';
import ReceiveCKBView from '../../pages/basicTutorials/ReceiveCKBView';

const MainView = () => {


    return (
            <Routes>
                <Route path='/' exact element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/basic_tutorials/connect_wallets' element={<ConnectWalletView />} />
                <Route path='/basic_tutorials/transfer_ckb' element={<TransferCKBView />} />
                <Route path='/basic_tutorials/receive_ckb' element={<ReceiveCKBView />} />
                <Route path='/basic_tutorials/transfer_ckb1' element={<TransferCKBViewT />} />
                <Route path='/basic_tutorials/test' element={<TestView />} />
                <Route path='/spore/create_spore' element={<CreateSporeView />} />
                
            </Routes>
    );
}

export default MainView;
