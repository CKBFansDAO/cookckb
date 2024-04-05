import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatAddress, showError } from '../../utils/helper';
import WalletSelector from '../../walletmgr/WalletSelector';
import { useWallet } from '../../walletmgr/WalletContext';
import { useTranslation } from 'react-i18next';
import { ReactComponent as NervosLogo } from '../../assets/images/icon-nervos.svg';

const ConnectWalletView = () => {
    const [t] = useTranslation()
    const { connectedInfo, setConnectedInfo, setWalletSelectorOpen } = useWallet();
    const [showConnectedInfo, setConnectInfoVisible] = useState(false);

    const [copiedAddres, setCopiedAddress] = useState(false);
    const onCopyAddress = () => {

        setCopiedAddress(true);

        setTimeout(() => {
            setCopiedAddress(false);
        }, 2000);
    }

    const renderConnectBtn = () => {
        if (!connectedInfo) {
            return <div class="cursor-pointer h-[36px] border border-opacity-50 border-color-main hidden font-semibold rounded-md px-4 md:flex items-center"
                onClick={() => setWalletSelectorOpen(true)}>
                <i class="fa-solid fa-wallet fa-lg mr-2"></i>{t('common.connect-wallet')}
            </div>
        }

        return <div className='h-[36px] text-black font-semibold rounded-md cursor-pointer flex items-center'
            onClick={() => { setConnectInfoVisible(!showConnectedInfo) }}>
            <div className='flex h-full items-center px-2 rounded-md border border-opacity-50 border-color-main'>
                {<img src={`../images/wallets/logo-wallet-${connectedInfo.type}.svg`} alt={connectedInfo.type} className="w-5 h-5" />}

                <span className='hidden md:block text-color-main md:ml-3 inscription'>{formatAddress(connectedInfo.externalAddress, 6)}</span>
            </div>
        </div>
    }

    const renderConnectedInfo = () => {
        if (!showConnectedInfo) {
            return <></>
        }

        return <div className='flex flex-col gap-5 bg-[#FAFAFB] shadow-[0_0_10px_0px_rgba(0,0,0,0.3)] p-5 rounded'>
            <div className='flex gap-14 items-center justify-between'>
                <div className='flex gap-2 items-center'>
                    <i class="fa-solid fa-wallet fa-lg"></i>
                    <span className='font-semibold'>{t('wallet.title')}</span>
                </div>
                <span className='text-color-main'>{t(`wallet.wallet-${connectedInfo.type}`)} {t(`wallet.connected`)}</span>
            </div>
            {connectedInfo.chain !== 'ckb' && <div className='pl-[26px] flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    {<img src={`../images/chains/${connectedInfo.chain}-logo.svg`} alt={connectedInfo.chain} className="w-5 h-5" />}
                    <span className=''>{formatAddress(connectedInfo?.externalAddress, 6)}</span>
                </div>
            </div>}
            <div className='pl-[26px] flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <NervosLogo className='w-5 h-4'></NervosLogo>
                    <span className=''>{formatAddress(connectedInfo?.address, 6)}</span>
                </div>
                <div className='flex items-center gap-1'>
                    {copiedAddres && <div className='flex items-center gap-1 animate__animated animate__fadeOutUp'>
                        <i className="fa-solid fa-circle-check text-white"></i>
                        <span className='hidden md:block'>{t('account.copied')}</span>
                    </div>}
                    <CopyToClipboard text={connectedInfo?.address} onCopy={onCopyAddress}>
                        <i class="fa-regular fa-copy cursor-pointer hover:text-color-main"></i>
                        
                    </CopyToClipboard>
                </div>
            </div>
            <div className='border-b border-color-main opacity-35'></div>
            <div className='flex justify-between items-center cursor-pointer px-3 py-2 hover:bg-color-main hover:text-white ease-in duration-300 rounded -mx-3 -my-2'
                onClick={() => { setConnectedInfo('') }}>
                <div className='flex gap-2 items-center'>
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                    <span className=''>{t('account.disconnect')}</span>
                </div>
            </div>
        </div>

    }
    return (
        <div className='flex items-center justify-center'>
            <div className='flex flex-col justify-end gap-4'>
                {renderConnectBtn()}
                {connectedInfo && renderConnectedInfo()}
            </div>
        </div>
    );
}

export default ConnectWalletView;
