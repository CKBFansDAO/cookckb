// IWallet.js
export default class IWallet {
    async connect() {
        throw new Error("connect method not implemented");
    }

    async disconnect() {
        throw new Error("disconnect method not implemented");
    }

    async signTransaction(transaction) {
        throw new Error("signTransaction method not implemented");
    }

    getCellDeps() {
        throw new Error("getCellDeps method not implemented");
    }

    setConnectedInfo() {
        throw new Error("setConnectedInfo method not implemented");
    }

    async signRawTx(rawTx, address) {
        throw new Error("signRawTx method not implemented");
    }
}