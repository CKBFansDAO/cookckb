// WalletManager.js
import { showError } from '../utils/helper';
import WalletFactory from './WalletFactory';


export default class WalletManager {
  constructor({connectedInfo, setConnectedInfo}) {
    console.log(111);
    this.connectedInfo = connectedInfo;
    this.setConnectedInfo = setConnectedInfo;
    this.wallet = null;
   
    // 检查缓存信息的有效性
    if (connectedInfo && connectedInfo.address && connectedInfo.externalAddress?.length > 0 
        && connectedInfo.chain?.length > 0) {
      this.wallet = WalletFactory.createWallet(connectedInfo.type);
      this.disconnectWallet = this.disconnectWallet.bind(this);
      this.wallet.setAccountChangedCallback(this.disconnectWallet);

      this.wallet.setConnectedInfo(connectedInfo)
    }
  }

  async connectWallet(walletType) {
    //console.log(walletType);

    this.wallet = WalletFactory.createWallet(walletType);
    
    await this.wallet.connect();
    // 连接成功后，存储钱包类型和地址到本地缓存
  }

  async disconnectWallet() {
    //console.log('disconnect', this.wallet)
    if (this.wallet) {
      await this.wallet.disconnect();
      this.wallet = null;
      // 清除本地缓存
      // ...
      this.setConnectedInfo('');
    }
  }

  accountChangedCallback(wallet) {
    // 只处理已连接的钱包
    if (this.wallet === wallet) {
      this.disconnectWallet();
    }
  }

  // ... 其他代理到当前钱包实例的方法
  getCellDeps() {
    //console.log('wallet manager getCellDeps')
    if (this.wallet) {
      return this.wallet.getCellDeps();
    }

    return [];
  }

  async signRawTx(rawTx, address) {
    //console.log('wallet manager signRawTransaction')
    if (this.wallet) {
        let signedTx = await this.wallet.signRawTx(rawTx, address);
        return signedTx;
    }

    // 抛出异常
    throw new Error('Wallet not connect yet');
  }
}
