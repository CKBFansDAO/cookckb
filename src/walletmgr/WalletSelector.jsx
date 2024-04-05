// WalletSelector.js
import React, { useEffect, useRef, useContext, useState } from 'react';
import { useWallet } from './WalletContext';
import { useTranslation } from 'react-i18next';
import { ReactComponent as JoyIDLargIcon } from '../assets/images/logo-wallet-joyid-large.svg';
import { ReactComponent as LoadingSpinIcon } from '../assets/images/loading-spin.svg';
import supportedWallets from './SupportedWallets.json';
import { toast } from 'react-toastify';
import { showError } from '../utils/helper';

const WalletSelector = () => {
    const [t] = useTranslation();
    const [selectedChain, setSelectedChain] = useState('bitcoin');
    const [connectingWallet, setConnectingWallet] = useState('');
    const { walletManager, isWalletSelectorOpen: isOpen, setWalletSelectorOpen, connectedInfo, setConnectedInfo } = useWallet();
    const popdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event) => {
            // 其实应该传父窗口的ref过来
            const parentNode = event.target.closest('[data-id="top-nav-wallet"]');
            if (!popdownRef.current.contains(event.target) && !parentNode) {
                setWalletSelectorOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);


        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);


    if (!isOpen) {
        return <></>
    }

    const getWalletInfo = (name) => {
        const lowerCaseName = name.toLowerCase();
        const walletInfo = supportedWallets.wallets.find((wallet) => wallet.walletName.toLowerCase() === lowerCaseName);

        return walletInfo || null;
    };

    const handleConnect = async (wallet) => {
        // 处理连接钱包的逻辑
        //console.log(`Connecting to ${wallet}`);
        try {
            setConnectingWallet(wallet.walletName);
            await walletManager.connectWallet(wallet.walletName);
            setWalletSelectorOpen(false);
            setConnectedInfo(walletManager.wallet.connectedInfo)
            setConnectingWallet('');
        }
        catch (error) {
            // todo
            showError(error);
            setConnectingWallet('');

            console.log(error);
        }
    };

    const renderSupportChainsTab = () => {

        return (<div className='flex flex-row h-9 gap-10 border-b border-[#35363D] overflow-x-auto scrollbar-hidden'>
            {
                supportedWallets.chains.map((chain) => {
                    return (
                        chain.enable && <div key={chain.key} className={`flex gap-2 cursor-pointer hover:text-white border-color-main ${selectedChain === chain.key ? 'border-b-[2px] text-white' : ''}`}
                            onClick={() => setSelectedChain(chain.key)}>
                            {<img src={`../images/chains/${chain.logo}`} alt={chain.displayName} className="w-5 h-5" />}
                            <span>{chain.displayName}</span>
                        </div>
                    )
                })
            }
        </div>)
    }

    const renderWalletsContainer = () => {
        return <div className='flex flex-col gap-3 w-full  bg-[#1F2024] p-4 rounded-md'>
            {renderSupportChainsTab()}
            <div className='h-[168px] overflow-y-auto'>
                {renderChainWallets()}
            </div>
            
        </div>
    }

    const renderChainWallets = () => {
        const wallets = supportedWallets.wallets.filter(wallet => wallet.chain === selectedChain);
        return <div className='w-full px-14 py-6 flex flex-col items-center justify-center gap-5 font-bold '>
            {wallets.map((wallet) => (
                <button
                    key={wallet.walletName}
                    className={`w-full rounded-full px-2 gap-5 flex items-center h-[48px] bg-[#FFF] hover:opacity-90 text-[#000] border-[#777] cursor-pointer disabled:bg-opacity-50 disabled:cursor-not-allowed`}
                    onClick={() => handleConnect(wallet)}
                    disabled={!wallet.enable}
                >
                    <div className={`flex items-center p-2 rounded-full bg-black`}>
                        <img src={`../images/wallets/${wallet.logo}`} alt={wallet.walletName} className="w-5 h-5" />
                    </div>

                    <span className="text-black text-left grow">{wallet.displayName}</span>
                    {connectingWallet === wallet.walletName && <div className='mr-4'><LoadingSpinIcon className='w-5 h-5'></LoadingSpinIcon></div>}
                </button>
            ))}
        </div>
    }

    return (<div ref={popdownRef} className='app-mask flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center rounded-md items-center w-[400px] md:w-[500px] px-8 md:px-14 py-10 gap-5 bg-[#16171A] shadow-[0_0_9px_0px_rgba(0,0,0,0.5)] text-[#BBBBBB] inscription'>
            <div className='flex w-full justify-end items-end -my-6'>
                <div className='flex items-center justify-center cursor-pointer -mx-5 md:-mx-10 h-10 w-10 bg-[#222] hover:bg-[#333] rounded-full'
                    onClick={() => {
                        setWalletSelectorOpen(false);
                    }}>
                    <i className="fa-solid fa-xmark text-[20px] hover:text-red-500 focus:outline-none "></i>
                </div>

            </div>

            <span className='text-white text-xl mb-5'>{t('wallet.connect-wallet')}</span>

            <button className='bg-[#4CD917] w-full flex  justify-center items-center hover:opacity-90 cursor-pointer text-[#0E0F11] break-keep px-10 py-3 text-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={false}
                onClick={() => handleConnect(getWalletInfo('JoyID'))}>
                <JoyIDLargIcon className='h-6'></JoyIDLargIcon>
                {connectingWallet === 'joyid' && <div className='ml-4'><LoadingSpinIcon className='w-5 h-5'></LoadingSpinIcon></div>}
            </button>
            <span>Keyless and non-custodial</span>
            <div className='w-full mt-4'>
                <div className='border-[#333] border-t -mx-8 md:-mx-14'>
                </div>
            </div>

            <span className='flex items-center justify-center -mt-9 p-1 w-16 rounded-full bg-[#DDDDDD] text-[#111111]'>or</span>
            <div className='w-full flex justify-center'>
                {renderWalletsContainer()}
            </div>
            
            <span className='text-center mt-4'>We do not own your private keys and cannot access your assets without your confirmation.</span>

        </div >
    </div>
    );
};

export default WalletSelector;
