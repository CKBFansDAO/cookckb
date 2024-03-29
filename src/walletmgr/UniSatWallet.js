// UniSatWallet.js
import { showError } from '../utils/helper';
import IWallet from './IWallet';
//import { helpers, commons } from "@ckb-lumos/lumos";
import { bytes } from "@ckb-lumos/codec";
import { blockchain } from "@ckb-lumos/base"
import { List, Map as ImmutableMap, Record } from "immutable";
import * as commons from "@ckb-lumos/common-scripts";
import { TransactionSkeleton, createTransactionFromSkeleton, encodeToAddress, parseAddress } from "@ckb-lumos/helpers";
import appConfig from '../appConfig';

const SECP_SIGNATURE_PLACEHOLDER = bytes.hexify(
  new Uint8Array(
    commons.omnilock.OmnilockWitnessLock.pack({
      signature: new Uint8Array(65).buffer,
    }).byteLength
  )
);

export default class UniSatWallet extends IWallet {

  constructor() {
    super();
    this.connectedInfo = null;

    this.initialize();

  }

  // 初始化UniSat监听器和获取账户信息
  initialize() {
    console.log('initialize')
    if (window.unisat) {
      // 监听账户变化
      window.unisat.on('accountsChanged', (accounts) => {
        this.handleAccountsChanged(accounts);
      });
    } else {
      console.log('请安装UniSat!');
    }
  }

  // 处理账户变化
  handleAccountsChanged(accounts) {
    if (accounts.length > 0) {
      console.log('当前账户地址:', accounts[0]);
      this.connectAddress(accounts[0]);
      // 这里可以执行更多的逻辑，比如更新UI或者重新获取数据等
    } else {
      console.log('请连接到UniSat。');
      //this.connectedInfo = null;
    }
    // 可以在这里触发一些事件，比如更新UI
    //this.onAccountChanged(accounts[0]);
  }

  // 获取当前账户
  async getCurrentAccount() {
    try {
      // 请求用户授权
      const accounts = await window.unisat.requestAccounts();
      if (accounts.length > 0) {
        console.log('当前账户地址:', accounts[0]);
        return accounts[0];
      } else {
        showError('There is no account to connect');
        return null;
      }
    } catch (error) {
      showError(error);
    }
  }

  // 当账户变化时触发的回调函数，可以在子类中重写
  onAccountChanged(newAccount) {
    // 子类可以重写这个方法来处理账户变化事件
    console.log(newAccount);
  }

  // 增加 externalAddress 用于识别当前地址是否与外部钱包的地址匹配，处理必要的逻辑
  async connect() {

    if (typeof window.unisat !== 'undefined') {
      let btcAddr = await window.unisat.requestAccounts();
      this.connectAddress(btcAddr[0]);
    } else {
      // 抛出异常
      throw new Error('UniSat not found');
    }
  }

  async connectAddress(btcAddr) {
    if (!btcAddr || btcAddr.length === 0) {
      console.log('!btcAddr || btcAddr.length === 0');
      return;
    }

    try {
      const omniLockScript = commons.omnilock.createOmnilockScript({ auth: { flag: "BITCOIN", content: btcAddr } });
      const omniAddr = encodeToAddress(omniLockScript);
      this.connectedInfo = {
        address: omniAddr,
        type: 'unisat',
        chain: 'bitcoin',
        externalAddress: btcAddr
      };
      console.log('UniSat connected');
    } catch (error) {
      showError(error);
    }
  }

  async disconnect() {
    // UniSat断开连接逻辑
  }

  getCellDeps() {
    const omnilock = appConfig.CKB.SCRIPTS.OMNILOCK;
    let cellDeps = [];
    cellDeps.push({
      outPoint: {
        txHash: omnilock.TX_HASH,   //'0xb50ef6f2e9138f4dbca7d5280e10d29c1a65e60e8a574c009a2fa4e4107e0750',
        index: omnilock.INDEX      //'0x0'
      },
      depType: omnilock.DEP_TYPE   //'code'
    });

    const secp256k1 = appConfig.CKB.SCRIPTS.SECP256K1_BLAKE160;
    cellDeps.push({
      outPoint: {
        txHash: secp256k1.TX_HASH,  //'0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
        index: secp256k1.INDEX     //'0x0'
      },
      depType: secp256k1.DEP_TYPE   //'depGroup'
    });

    return cellDeps;
  }

  setConnectedInfo(connectedInfo) {
    this.connectedInfo = connectedInfo;
  }

  setAccountChangedCallback(callback) {
    this.accountChangedCallback = callback;
  }



  buildTx = async (rawTx, address) => {
    const fromScript = parseAddress(address);

    const collectedCells = [];
    const outputCells = [];

    for (let i = 0; i < rawTx.inputs.length; i++) {
      collectedCells.push({
        cellOutput: {
          lock: fromScript,
        },
        outPoint: rawTx.inputs[i].previousOutput
      })
    }

    for (let i = 0; i < rawTx.outputs.length; i++) {
      const cellOutput = {
        capacity: rawTx.outputs[i].capacity,
        lock: rawTx.outputs[i].lock
      };

      if (rawTx.outputs[i].type) {
        cellOutput.type = rawTx.outputs[i].type;
      }
      outputCells.push({
        cellOutput: cellOutput,
        data: rawTx.outputsData[i]
      })
    }

    let tx = TransactionSkeleton({
      cellProvider: List([]),
      cellDeps: List(rawTx.cellDeps),
      headerDeps: List(rawTx.headerDeps),
      inputs: List(collectedCells),
      outputs: List(outputCells),
    });

    const witness = bytes.hexify(blockchain.WitnessArgs.pack({ lock: SECP_SIGNATURE_PLACEHOLDER }));
    //   for (let i = 0; i < tx.inputs.toArray().length; i++) {
    tx = tx.update("witnesses", (witnesses) => witnesses.push(witness));
    //   }
    if (rawTx.witnesses.length == 2) {
      tx = tx.update("witnesses", (witnesses) => witnesses.push(rawTx.witnesses[1]));
    }
    tx = commons.omnilock.prepareSigningEntries(tx);


    let signedMessage = await commons.omnilock.bitcoin.signMessage(tx.signingEntries.get(0).message, "ecdsa", window.unisat);

    const signedWitness = bytes.hexify(
      blockchain.WitnessArgs.pack({
        lock: commons.omnilock.OmnilockWitnessLock.pack({
          signature: bytes.bytify(signedMessage).buffer,
        }),
      })
    );

    tx = tx.update("witnesses", (witnesses) => witnesses.set(0, signedWitness));
    return tx
  }


  async signRawTx(rawTx, address) {
    if (address === this.connectedInfo.address) {
      // UniSat 交易签名逻辑
      let tx = await this.buildTx(rawTx, address);
      let signedTx = createTransactionFromSkeleton(tx);

      return signedTx;
    }

    throw new Error('Please change the UniSat account first');
  }
}
