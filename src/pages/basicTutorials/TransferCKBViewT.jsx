import React from 'react';

import { BI } from "@ckb-lumos/bi";
//import { parseAddress } from '@ckb-lumos/helpers'
import * as helpers from '@ckb-lumos/helpers';
import * as commons from '@ckb-lumos/common-scripts';
import JSBI from 'jsbi';
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import { indexer, rpc } from '../../utils/lumos';
import { useWallet } from '../../walletmgr/WalletContext';
import { signRawTransaction, signTransaction } from '@joyid/ckb';
import { CellCollector } from '@ckb-lumos/ckb-indexer';
import { useFeeRate } from '../../hooks/useFeeRate';
/*
export const rpc = new RPC(appConfig.CKB.CKB_RPC_URL);
export const indexer = new Indexer(appConfig.CKB.CKB_INDEXER_URL, appConfig.CKB.CKB_RPC_URL);
*/

//import { BI, hd, config, helpers, RPC, Indexer, commons, Address, HexString } from '@ckb-lumos/lumos';


async function getCapacities(address) {
    const collector = indexer.collector({
        lock: helpers.parseAddress(address),
    });

    let capacities = BI.from(0);
    for await (const cell of collector.collect()) {
        capacities = capacities.add(cell.cellOutput.capacity);
    }

    return capacities;
}



//console.log('address: ', address)
//getCapacities(address).then(capacities => console.log(`balance: ${capacities.div(10 ** 8).toString()} CKB`))
//transfer(address, bobAddress, 100 * 10 ** 8, privateKey).then((txHash: string) => console.log('txHash: ', txHash));



const TransferCKBViewT = () => {
    const { connectedInfo, walletManager, setConnectedInfo, setWalletSelectorOpen } = useWallet();
    const { feeRate } = useFeeRate();

    const transfer = async (from, to, capacity) => {
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        txSkeleton = await commons.common.transfer(
            txSkeleton,
            [from],
            to,
            BI.from(capacity).toBigInt(),
            // BigInt(capacity),
        );
        console.log(txSkeleton.toJSON());

        const lock = helpers.parseAddress(from);
        console.log(lock);

        txSkeleton = await commons.common.payFeeByFeeRate(
            txSkeleton,
            [from],
            feeRate.high,
        );
        console.log(txSkeleton.toJSON());

        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
        const rawTx = helpers.createTransactionFromSkeleton(txSkeleton);
        console.log(rawTx);

        let signedTx = await walletManager.signRawTx(rawTx, connectedInfo.address);
        console.log(signedTx);
        if (signedTx) {
            let txHash = await rpc.sendTransaction(signedTx, 'passthrough')
            console.log(txHash);
        }
    }

    const transferCKB = async (toAddress) => {
        if (connectedInfo && connectedInfo.type === "joyid") {
            const signedTx = await signTransaction({
                to: toAddress,
                from: connectedInfo.address,
                amount: BI.from(Number(100) * 10 ** 8).toString(),
            });

            rpc.sendTransaction(signedTx, "passthrough");
        } else {
            transfer(connectedInfo.address, toAddress, 100 * 10 ** 8);
        }
    }

    const transferAllCKB = async (from, to) => {
        let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
        let capacity;
        // 计算 from 地址的全部余额
        if (!capacity) {
            const fromScript = helpers.parseAddress(from);
            const cellCollector = new CellCollector(indexer, {
                lock: fromScript,
                type: "empty",
                data: "any",
            });
    
            let totalCapacity = BI.from(0);
            for await (const cell of cellCollector.collect()) {
                totalCapacity = totalCapacity.add(BI.from(cell.cellOutput.capacity));
            }

            console.log(totalCapacity.toString());
    
            // 预估交易手续费
            txSkeleton = await commons.common.transfer(
                txSkeleton,
                [from],
                to,
                totalCapacity.toBigInt(),
            );
            txSkeleton = await commons.common.payFeeByFeeRate(
                txSkeleton,
                [from],
                1000,
            );
    
            // 获取实际的交易手续费
            const fee = BI.from(txSkeleton.get("fee"));
    
            // 计算扣除手续费后的转账金额
            capacity = totalCapacity.sub(fee);
            console.log(capacity.toString());
        }
    
        // 构建转账交易
        txSkeleton = await commons.common.transfer(
            txSkeleton,
            [from],
            to,
            capacity.toBigInt(),
        );
        console.log(capacity.toString());
        txSkeleton = await commons.common.payFeeByFeeRate(
            txSkeleton,
            [from],
            1000,
        );
    
        txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
        const rawTx = helpers.createTransactionFromSkeleton(txSkeleton);
    
        let signedTx = await walletManager.signRawTx(rawTx, connectedInfo.address);
        if (signedTx) {
            let txHash = await rpc.sendTransaction(signedTx, 'passthrough');
            console.log(txHash);
        }
    };

    console.log(connectedInfo.address);
    return (
        <div className='flex flex-col gap-4'>
            <div className=' bg-slate-500 px-5' onClick={() => transferCKB('ckt1qrfrwcdnvssswdwpn3s9v8fp87emat306ctjwsm3nmlkjg8qyza2cqgqq9gtxvx297t0vdlc62dcfxv0tjmhhfumrsgqfew9')}>
                transfer
            </div>

            <div className=' bg-slate-500 px-5' onClick={() => transferAllCKB(connectedInfo.address, 'ckt1qrfrwcdnvssswdwpn3s9v8fp87emat306ctjwsm3nmlkjg8qyza2cqgqq9gtxvx297t0vdlc62dcfxv0tjmhhfumrsgqfew9')}>
                transfer All
            </div>
        </div>
    );
}

export default TransferCKBViewT;
