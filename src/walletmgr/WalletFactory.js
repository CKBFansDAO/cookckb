// WalletFactory.js
import MetaMaskWallet from './MetaMaskWallet';
import JoyIDWallet from './JoyIDWallet';
import UniSatWallet from './UniSatWallet';
import OkxWallet from './OkxWallet';
import OkxEvmWallet from './OkxEvmWallet';
// ... 导入其他钱包类


class WalletFactory {
  static createWallet(walletType) {
    switch (walletType) {
      case 'metamask':
        if (!WalletFactory.metaMaskWallet) {
          WalletFactory.metaMaskWallet = new MetaMaskWallet();
        }
        return WalletFactory.metaMaskWallet;
      case 'unisat':
        if (!WalletFactory.unisatWallet) {
          WalletFactory.unisatWallet = new UniSatWallet();
        }
        return WalletFactory.unisatWallet;
      case 'okx':
        if (!WalletFactory.okxWallet) {
          WalletFactory.okxWallet = new OkxWallet();
        }
        return WalletFactory.okxWallet;
      case 'okxevm':
          if (!WalletFactory.okxEvmWallet) {
            WalletFactory.okxEvmWallet = new OkxEvmWallet();
          }
          return WalletFactory.okxEvmWallet;
      case 'joyid':
        if (!WalletFactory.joyIDWallet) {
          WalletFactory.joyIDWallet = new JoyIDWallet();
        }
        return WalletFactory.joyIDWallet;
      // ... 其他钱包的case
      default:
        throw new Error('Unknown wallet type');
    }
  }
}

WalletFactory.metaMaskWallet = null;
WalletFactory.joyIDWallet = null;
WalletFactory.okxWallet = null;
WalletFactory.okxEvmWallet = null;
WalletFactory.unisatWallet = null;
export default WalletFactory;
