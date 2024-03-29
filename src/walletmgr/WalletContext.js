// WalletContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import WalletManager from './WalletManager';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
    const [connectedInfo, setConnectedInfo] = useState(() => {
        const storedInfo = localStorage.getItem('current_account');
        if (storedInfo) {
            try {
                let info = JSON.parse(storedInfo);
                if (info && info.address && info.externalAddress?.length > 0) {
                    return info;
                }
            } catch (error) {
                return null;
            }
        }

        return null;
    });

    const [walletManager] = useState(new WalletManager({ connectedInfo, setConnectedInfo }));
    const [isWalletSelectorOpen, setWalletSelectorOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('current_account', JSON.stringify(connectedInfo));
    }, [connectedInfo]);

    return (
        <WalletContext.Provider value={{ walletManager, isWalletSelectorOpen, setWalletSelectorOpen, connectedInfo, setConnectedInfo }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
