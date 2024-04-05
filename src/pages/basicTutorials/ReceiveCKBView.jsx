import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { ReactComponent as OpenEyeIcon } from '../../assets/images/icon-eye-open.svg';
import { ReactComponent as NoteIcon } from '../../assets/images/icon-info.svg';
import { ReactComponent as OopsIcon } from '../../assets/images/icon-oops.svg';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatAddress } from '../../utils/helper';
import { useWallet } from '../../walletmgr/WalletContext';
import TitleBar from '../../components/titleBar/TitleBar';


const ReceiveCKBView = () => {

    const [t] = useTranslation();
    const { connectedInfo, setWalletSelectorOpen } = useWallet();
    const [copyed, setCopyed] = useState(false);
    const [showMask, setShowMask] = useState(true);

    const renderConnectWallet = () => {
        return <div className='flex flex-col justify-center items-center gap-5'>
            <OopsIcon></OopsIcon>
            <span className='title text-lg'>{t('common.connect-first')}</span>
            <div class="cursor-pointer h-[36px] border border-opacity-50 border-color-main hidden font-semibold rounded-md px-4 md:flex items-center"
                onClick={() => setWalletSelectorOpen(true)}>
                <i class="fa-solid fa-wallet fa-lg mr-2"></i>{t('common.connect-wallet')}
            </div>
        </div>
    }

    if (!connectedInfo || !connectedInfo.address || connectedInfo.address.length === 0) {
        return renderConnectWallet()
    }

    const onCopyAddress = () => {

        setCopyed(true);

        setTimeout(() => {
            setCopyed(false);
        }, 2000);
    }

    const handleIconClick = () => {
        setShowMask(false);
    };

    const renderQRCode = () => {
        return <div className='relative h-48 w-48 p-4 border border-[#BBB] rounded-lg'>
            {showMask && (
                <div className='absolute inset-0 flex items-center justify-center bg-[#303846] rounded-lg  bg-opacity-95'>
                    <div className='flex flex-col text-sm items-center justify-center text-white cursor-pointer'
                        onClick={handleIconClick}>
                        <OpenEyeIcon className='h-8'></OpenEyeIcon>
                        <span className=''>{t('trans.show-qrcode')}</span>
                    </div>
                </div>
            )}
            <QRCode
                className=''
                size={145}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={connectedInfo?.address}
                viewBox={`0 0 145 145`}
            />
        </div>
    }

    const renderNoteTips = () => {
        return <div className='bg-white shadow-[0_0_2px_0px_rgba(49,56,70,0.3)] mt-8 p-4 gap-3 w-full rounded-lg flex flex-col items-center justify-center'>
            <div className='flex gap-2'>
                <NoteIcon className='h-6 w-6'></NoteIcon>
                <span>{t('common.note')}</span>
            </div>

            <p className='inscription'>{t('trans.deposit-suggest')}&nbsp;
                <a href="https://app.joy.id/" target="_blank" rel="noopener noreferrer" className='text-color-main underline underline-offset-3'>JoyID</a>,&nbsp;
                <a href="https://docs.nervos.org/docs/basics/guides/crypto%20wallets/neuron/" target="_blank" rel="noopener noreferrer" className='text-[#13AA7A] underline underline-offset-3'>Neuron</a>,{" "}
                <a href="https://token.im/" target="_blank" rel="noopener noreferrer" className='text-[#0792C2] underline underline-offset-3'>imToken</a>,{" "}
                {t("common.or")}{" "}
                <a href="https://ckb.pw/" target="_blank" rel="noopener noreferrer" className='text-[#7A7CFD] underline underline-offset-3'>Portal wallet</a>{"  "}.
            </p>
        </div>
    }

    return (
        <div className='bg-[#FAFAFB] shadow-[0_0_5px_0px_rgba(49,56,70,0.3)] w-full md:w-[600px] flex flex-col gap-10 py-8 md:py-12 px-8 md:px-10 rounded-xl'>
            <div className='flex flex-col items-center justify-center gap-4'>
                <TitleBar title={t('nav.basic.receive-ckb')}></TitleBar>
                <div></div>
                {renderQRCode()}
                <div className='flex '>
                    <div className='w-20'></div>
                    <div className='flex rounded-full px-4 py-1 border border-[#BBB]'>
                        <CopyToClipboard text={connectedInfo?.address} onCopy={onCopyAddress}>
                            <div className='flex items-center gap-4 cursor-pointer'>
                                <span className=''>{formatAddress(connectedInfo?.address, 7)}</span>
                                <i class="fa-regular fa-copy cursor-pointer hover:text-color-main"></i>
                            </div>
                        </CopyToClipboard>

                    </div>
                    {copyed ? <div className='flex w-20 items-center gap-1 animate__animated animate__fadeOutUp'>
                        <i className="fa-solid fa-circle-check text-color-main"></i>
                        <span className='hidden md:block'>{t('account.copied')}</span>
                    </div> : (<div className='w-20'></div>)}
                </div>

                {renderNoteTips()}
            </div>

        </div>
    );
}

export default ReceiveCKBView;
