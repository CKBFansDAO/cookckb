import {
    initializeConfig,
    createConfig,
    //   predefined,
    createRpcResolver,
    refreshScriptConfigs
} from '@ckb-lumos/config-manager'
import { RPC } from '@ckb-lumos/rpc'
import { Indexer } from '@ckb-lumos/ckb-indexer'
import { BI } from "@ckb-lumos/bi";
import { parseAddress } from '@ckb-lumos/helpers'
import JSBI from 'jsbi';
import { hexToBytes } from '@nervosnetwork/ckb-sdk-utils'
import appConfig from '../appConfig';

export const rpc = new RPC(appConfig.CKB.CKB_RPC_URL);
export const indexer = new Indexer(appConfig.CKB.CKB_INDEXER_URL, appConfig.CKB.CKB_RPC_URL);

export const CKB_DECIMAL = BI.from(10 ** 8);

export async function updateScript() {
    if (appConfig.APP.IS_MAINNET) {
        return;
    }

    const outdatedConfig = appConfig.CKB.SCRIPTS;

    const refreshed = await refreshScriptConfigs(outdatedConfig, {
        resolve: createRpcResolver(rpc),
    });

    appConfig.CKB.SCRIPTS = refreshed;
}

export async function initLumos() {
    //console.log('lumos init');
    initializeConfig(
        createConfig({
            PREFIX: appConfig.CKB.PREFIX,
            SCRIPTS: {
                ...appConfig.CKB.SCRIPTS,

                JOYID: {
                    ...appConfig.JOYID.SCRIPT,
                    pubkey: '',
                    keyType: 'main_key',
                    alg: '-7'
                },
            },
        })
    )
}

export async function capacityOf(address) {
    const lock = parseAddress(address)
    const collector = indexer.collector({ lock, type: "empty", data: "0x" })

    let capacities = BI.from(0);
    for await (const cell of collector.collect()) {
        capacities = capacities.add(cell.cellOutput.capacity);
    }

    let capacity = capacities.div(CKB_DECIMAL);
    const fraction = capacities.mod(CKB_DECIMAL);
    const fractionStr = fraction.toString().padStart(8, "0");

    return `${capacity}.${fractionStr}`;
}

export async function getFeeRateStatistics() {
    const res = await rpc.getFeeRateStatistics();

    return res;
}

export async function getTransaction(tx_hash) {
    const res = await rpc.getTransaction(tx_hash);

    return res;
}

// include lock, xudt type, capacity
export const calcXudtCapacity = (address, isReserve = true) => {
    const lock = parseAddress(address);
    const argsSize = hexToBytes(lock.args).length;
    const lockSize = 32 + 1 + argsSize;
    const xudtTypeSize = 32 + 32 + 1;
    const capacitySize = 8;
    const xudtDataSize = 16;
    let cellSize = lockSize + xudtTypeSize + capacitySize + xudtDataSize;
    if (isReserve) {
        cellSize += 1;
    }

    const capacity = JSBI.multiply(JSBI.BigInt(cellSize), JSBI.BigInt(10000_0000));

    return capacity.toString();
}
