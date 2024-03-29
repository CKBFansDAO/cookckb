// JoyIDWallet.js
import { connect, signRawTransaction } from '@joyid/ckb';
import IWallet from './IWallet';

export default class JoyIDWallet extends IWallet {

    constructor() {
        super();
        this.connectedInfo = null;
    }

    async connect() {
        const authData = await connect();
        authData.type = 'joyid';
        authData.externalAddress = authData.address;
        authData.chain = 'ckb';
        this.connectedInfo = authData;
        return authData;
    }

    async disconnect() {
        this.connectedInfo = null;
    }

    getCellDeps() {
        let cellDeps = [];
        return cellDeps;
    }

    setConnectedInfo(connectedInfo) {
        this.connectedInfo = connectedInfo;
    }

    setAccountChangedCallback(callback) {
        this.accountChangedCallback = callback;
    }

    async signRawTx(rawTx, address) {
        let signedTx = await signRawTransaction(rawTx, address);

        return signedTx;
    }
}
