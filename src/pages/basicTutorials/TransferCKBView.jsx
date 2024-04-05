import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BI } from '@ckb-lumos/bi';
import { indexer, rpc } from '../../utils/lumos';
import BigNumber from 'bignumber.js';
import MessageBox from '../../components/messagebox/MessageBox';
import { getDisplayNumber, showError } from '../../utils/helper';
import { parseAddress } from '@ckb-lumos/helpers';
import { bytes as byteUtils } from '@ckb-lumos/codec'
import * as helpers from '@ckb-lumos/helpers';
import * as commons from '@ckb-lumos/common-scripts';

import { ReactComponent as PendingIcon } from '../../assets/images/icon-trans-pending.svg';
import { ReactComponent as SentIcon } from '../../assets/images/icon-trans-send.svg';
import { ReactComponent as NoDataIcon } from '../../assets/images/pic-no-data.svg';
import { ReactComponent as LoadingSpinIcon } from '../../assets/images/loading-spin.svg';

import usePollingTx from '../../hooks/usePollingTx';
import { useWallet } from '../../walletmgr/WalletContext';
import appConfig from '../../appConfig';
import { useCKBBalance } from '../../hooks/useCKBBalance';
import { useFeeRate } from '../../hooks/useFeeRate';
import { signTransaction } from '@joyid/ckb';

const TransferCKBView = () => {
    const [t] = useTranslation();
    const [sendToAddress, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [isPaying, setIsPaying] = useState(false);
    const [tx, setTxHash] = useState(null);
    const { connectedInfo } = useWallet();
    const { balance, isLoading: isLoadingBalance, getBalance } = useCKBBalance(connectedInfo?.address, true);
    const [txTime, setTxTime] = useState(null);
    const { walletManager, setWalletSelectorOpen } = useWallet();
    const { feeRate } = useFeeRate();

    const stopPolling = () => {
        setTxHash(null);
        getBalance();
    }

    const { polling, success, txStatus } = usePollingTx({ hash: tx, stopCallback: stopPolling });

    const renderConnectWallet = () => {
        return <div className='flex flex-col justify-center items-center gap-5'>
            <span className='title text-lg'>{t('common.connect-first')}</span>
            <div class="cursor-pointer h-[36px] border border-opacity-50 border-[#733DFF] hidden font-semibold rounded-md px-4 md:flex items-center"
                onClick={() => setWalletSelectorOpen(true)}>
                <i class="fa-solid fa-wallet fa-lg mr-2"></i>{t('common.connect-wallet')}
            </div>
        </div>
    }

    if (!connectedInfo || !connectedInfo.address || connectedInfo.address.length === 0) {
        return renderConnectWallet()
    }

    const handleAddressChanged = (e) => {
        setAddress(e.target.value)
    }

    const handleAmountChanged = (e) => {
        setAmount(e.target.value)
    }

    const isDecimalInvalid = (number, digits) => {
        // 将浮点数转换为字符串
        const numberString = number.toString();

        // 使用正则表达式匹配小数点后的位数
        //const decimalPlacesMatch = numberString.match(/\.(\d+)/);

        // 去除末尾的零
        const trimmedNumberString = numberString.replace(/(\.\d*?)0+$/, '$1').replace(/\.?$/, '');

        // 使用正则表达式匹配小数点后的位数
        const decimalPlacesMatch = trimmedNumberString.match(/\.(\d+)/);


        if (decimalPlacesMatch && decimalPlacesMatch[1].length > digits) {
            return true;
        }

        return false;
    }

    const checkAddress = () => {
        let checkRes = {
            hasError: false,
            hasWarning: false,
            error: ''
        };

        if (sendToAddress.length === 0) {
            checkRes.hasError = true;
            checkRes.error = t('trans.address-required');

            return checkRes;
        }

        try {
            const script = parseAddress(sendToAddress);
            if (script) {

            }
        } catch (error) {
            checkRes.hasError = true;
            checkRes.error = t('trans.address-invalid');
            return checkRes;
        }

        if (sendToAddress === connectedInfo.address) {
            checkRes.hasWarning = true;
            checkRes.error = t('trans.address-self');
            return checkRes;
        }

        return checkRes;
    }


    const getAddressTransLimit = (addr) => {
        try {
            const script = parseAddress(addr);
            if (script) {
                const size = 1 + byteUtils.concat(script.args, script.codeHash).byteLength
                const outputSize = 8 + byteUtils.bytify('0x').byteLength + size
                return outputSize;
            }
        } catch (error) {

        }
    }

    const checkAmount = () => {
        let totalAmount = parseFloat(amount);
        let checkRes = {
            hasError: false,
            hasWarning: false,
            error: ''
        };

        const regex = /^(?!0(\.0+)?$)(\d+(\.\d+)?|\.\d+)$/;
        if (!regex.test(amount)) {
            checkRes.hasError = true;
            checkRes.error = t('trans.amount-required');
            return checkRes;
        }

        // 检查小数点
        if (isDecimalInvalid(amount, 8)) {
            checkRes.hasError = true;
            checkRes.error = t('trans.decimal-out-limit');

            return checkRes;
        }

        // 检查最小转账金额
        const limit = getAddressTransLimit(sendToAddress)
        if (totalAmount < limit) {
            checkRes.hasError = true;
            checkRes.error = t('trans.capacity-too-small', { bytes: limit });

            return checkRes;
        }

        // 检查余额，余额不足
        if ((balance - totalAmount) < 0) {
            checkRes.hasError = true;
            checkRes.error = t('trans.live-capacity-not-enough');

            return checkRes;
        }

        // 检查转账之后余额不足63CKB
        const remainingLimit = getAddressTransLimit(connectedInfo.address);
        if ((balance - totalAmount) > 0 && (balance - totalAmount) < remainingLimit) {
            checkRes.hasError = true;
            checkRes.error = t('trans.capacity-not-enough', { limit, remainingLimit });

            return checkRes;
        }

        if (sendToAddress.length < 47) {
            if (totalAmount < 100) {
                checkRes.hasWarning = true;
                checkRes.error = t('trans.amount-less-100');

                return checkRes;
            }
        }

        return checkRes;
    }

    const checkAddressRes = checkAddress();
    const checkAmountRes = checkAmount();

    const canSend = () => {
        if (isLoadingBalance) {
            return false;
        }

        if (checkAddressRes.hasError || checkAmountRes.hasError) {
            return false;
        }

        if (isPaying) {
            return false;
        }

        if (tx) {
            return false;
        }

        return true;
    }

    const isTransAll = () => {
        let totalAmount = parseFloat(amount);
        if (balance - totalAmount < getAddressTransLimit(connectedInfo.address)) {
            return true;
        }

        return false;
    }

    const joyidTransCKB = async (from, to, capacity) => {

        const signedTx = await signTransaction({
            to: to,
            from: from,
            amount: capacity,
        });

        const txHash = rpc.sendTransaction(signedTx, "passthrough");

        return txHash;
    }

    const omnilockTransCKB = async (from, to, capacity) => {
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        txSkeleton = await commons.common.transfer(
            txSkeleton,
            [from],
            to,
            BI.from(capacity).toBigInt(),
        );
        console.log(txSkeleton.toJSON());

        const lock = helpers.parseAddress(from);
        console.log(lock);

        txSkeleton = await commons.common.payFeeByFeeRate(
            txSkeleton,
            [from],
            feeRate.low,
        );
        console.log(txSkeleton.toJSON());

        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
        const rawTx = helpers.createTransactionFromSkeleton(txSkeleton);
        console.log(rawTx);

        const result = await MessageBox.open({
            title: '',
            content: renderConfirm(capacity),
            buttons: [
                { name: t('alert.confirm'), isDanger: false, handler: () => "yes" }
            ]
        });

        if (result != "yes") {
            setIsPaying(false);
            return;
        }

        let signedTx = await walletManager.signRawTx(rawTx, connectedInfo.address);
        console.log(signedTx);
        let txHash;
        if (signedTx) {
            txHash = await rpc.sendTransaction(signedTx, 'passthrough')
            console.log(txHash);     
        }

        return txHash;
    }

    const onSendCKB = async () => {
        if (isPaying) {
            return;
        }

        if (!canSend) {
            return;
        }

        let bSendAll = false;
        if (isTransAll()) {
            const result = await MessageBox.open({
                title: '',
                content: <div className='flex flex-col gap-2'><p className='text-[#FFF]'><span className='font-bold'>{t('trans.alert-send-all-content-1')}</span>
                    <span className='font-bold text-[#FF6800]'>{t('trans.alert-send-all-content-2', { limit: getAddressTransLimit(connectedInfo.address) })}</span>
                    <span className='font-bold'>{t('trans.alert-send-all-content-3')}</span></p>
                    <p className='text-[#FFF] font-light'><span className=''>{t('trans.alert-send-all-content-4')}</span>
                        <span className='font-bold'>{balance}</span> CKB?
                    </p></div>,
                buttons: [
                    { name: t('alert.cancel'), handler: () => "nope" },
                    { name: t('alert.confirm'), isDanger: true, handler: () => "yes" }
                ]
            });

            // 关闭或者取消
            if (!result || result === "nope") {
                return;
            }

            bSendAll = true;
        }

        setIsPaying(true);
        const bnAmount = new BigNumber(amount).times(10 ** 8).toFixed(0);
        //console.log(bnAmount);

        try {
            let txHash;
            if (connectedInfo && connectedInfo.type === "joyid") {
                txHash = await joyidTransCKB(connectedInfo.address, sendToAddress, BI.from(Number(amount) * 10 ** 8).toString())
            } else {
                txHash = await omnilockTransCKB(connectedInfo.address, sendToAddress, BI.from(Number(amount) * 10 ** 8).toString());
            }

            if (txHash) {
                setTxTime(new Date().getTime())
                setTxHash(txHash);
            }

            setIsPaying(false);
        } catch (error) {
            setIsPaying(false);
            showError(error);
            console.log(error);
        }
    }

    const renderConfirm = (amount) => {
        return <div className='flex flex-col -mt-2 gap-2 text-white'>
            <span className='text-[#000]'>{t('trans.from')}</span>
            <span className='-mt-2 text-sm break-all'>{connectedInfo.address}</span>
            <span className='text-[#777]'>{t('trans.to')}</span>
            <span className='-mt-2 text-sm break-all'>{sendToAddress}</span>
            <div className="border-b border-[#777] border-dashed w-full"></div>

            <div className='flex justify-between'>
                <span className='text-[#777]'>{t('trans.amount')}</span>
                <span className='ml-2 text-white text-sm'>{getDisplayNumber(amount.toString(), 8)} {` CKB`}</span>
            </div>
        </div>
    }

    const renderPendingList = () => {
        return <div className='flex flex-col gap-4'>
            <div className='border-b border-[#333] w-full md:w-[520px] ' />
            <span className=''>{t('trans.pending-activity')}</span>
            {renderTxStatus()}
        </div>
    }

    const renderTxStatus = () => {
        if (!tx || tx.length === 0) {
            return <div className='flex flex-col justify-center items-center gap-4'>
                <span className='text-sm text-[#777]'>{t('common.no-data')}</span>
            </div>
        }

        return <a href={`${appConfig.CKB.CKB_EXPLORER_URL}/transaction/${tx}`} target="_blank" rel="noopener noreferrer"
            className='flex flex-col w-full gap-6 hover:bg-[#202228]'>
            <div className="flex gap-2 p-2">
                <div className="flex h-12 w-7 justify-center items-center">
                    <div className="flex justify-center items-center h-7 w-7 bg-[#50F412] rounded-full">
                        {success ? <SentIcon></SentIcon> : <PendingIcon></PendingIcon>}
                    </div>
                </div>
                <div className="flex flex-col w-full gap-1">
                    <div className="flex gap-2 w-full">
                        <span className="text-[#50F412]">{t('trans.send')}</span>
                        <div className="grow"></div>
                        <div className="flex justify-end items-center">
                            <div className="rounded-full text-xs font-semibold px-4 h-4 flex items-center justify-center bg-[#50F412] text-black ">{t(`trans.tx-status-${txStatus}`)}</div>
                        </div>
                    </div>
                    <div className="flex gap-2 text-sm whitespace-nowrap">
                        <div className='flex gap-2'>
                            <span className='text-[#BBBBBB]'> {getDisplayNumber(amount, 0)} </span>
                            <span>CKB</span>
                        </div>

                        <span className="text-right whitespace-nowrap w-full text-[#AAAAAA]">{txTime ? new Date(txTime).toLocaleString() : ""}</span>
                    </div>
                </div>
            </div>
        </a>
    }

    return (
        <div className='bg-[#FAFAFB] shadow-[0_0_5px_0px_rgba(49,56,70,0.3)] w-full md:w-[600px] flex flex-col gap-10 py-8 md:py-12 px-8 md:px-10 rounded-xl'>
            <div className="flex flex-col inscription gap-4">
                <span className='text-[#777777]'>{t('Send to')}:</span>
                <textarea className="w-full break-all text-left border border-[#777] bg-gray-100 rounded px-5 py-3 h-24"
                    type="text"
                    onChange={handleAddressChanged}
                    value={sendToAddress}
                    placeholder={t('ckb address')} />
                {checkAddressRes.hasError && <span className='text-red-500 -mt-2 text-sm'>{checkAddressRes.error}</span>}
                {checkAddressRes.hasWarning && <span className='text-yellow-500 -mt-2 text-sm'>{checkAddressRes.error}</span>}
            </div>
            <div className="flex flex-col inscription gap-4">
                <div className='flex justify-between'>
                    <span className='text-[#777777]'>{t('Amount')}:</span>
                    <div className='text-[#733DFF] flex gap-1 items-center'>{t('Max')}:{isLoadingBalance ? <div className='animate-pulse'><div className='h-5 w-40 bg-[#333333] rounded-full'></div></div>
                        : <span className='text-[#733DFF] underline underline-offset-2 cursor-pointer' onClick={() => setAmount(balance)}>{balance} CKB</span>}</div>
                </div>
                <input className="w-full text-left border border-[#777] bg-gray-100 rounded px-5 py-3"
                    type="text"
                    onChange={handleAmountChanged}
                    value={amount}
                    disabled={isPaying || tx}
                    placeholder={t('')} />
                {checkAmountRes.hasError && <span className='text-red-500 -mt-2 text-sm'>{checkAmountRes.error}</span>}
                {checkAmountRes.hasWarning && <span className='text-yellow-500 -mt-2 text-sm'>{checkAmountRes.error}</span>}
            </div>
            <div className='flex justify-end'>
                <button className='flex justify-center bg-[#733DFF] hover:bg-[#5022c4] cursor-pointer text-white w-[120px] md:w-[200px] text-center rounded-full py-2 disabled:bg-[#777777] disabled:cursor-not-allowed'
                    disabled={!canSend()}
                    onClick={onSendCKB}>
                    <div className='flex gap-2'>
                        {(isPaying || tx) && <LoadingSpinIcon className='h-5 w-5'></LoadingSpinIcon>}
                        {t('trans.send')}
                    </div>
                </button>
            </div>
            {renderPendingList()}

        </div>
    );
}

export default TransferCKBView;
