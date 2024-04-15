import { predefined } from "@ckb-lumos/config-manager";

// 下面配置的 Urls 用于应用 rpc 请求分流，通过 devdRandomIndex 或者 prodRandomIndex 来决定加载哪一个，
// 注意:
// 1、每组 url 的数量保持一致，如果应用有自己的 rpc 服务，可自行添加
// 2、如果你希望某一个 url 的请求概率增加，则在 url 数组里多添加该地址即可，比如：
//  希望生产环境上 https://mainnet.ckb.dev 的请求数量是 https://mainnet.ckbapp.dev 的两倍，
//  则在 prodUrls 里，进行这样的配置即可：
/*
const prodUrls = {
    ckb_indexer_url: [
        "https://mainnet.ckb.dev",
        "https://mainnet.ckb.dev",
        "https://mainnet.ckbapp.dev",
    ],
    ckb_rpc_url: [
        "https://mainnet.ckb.dev",
        "https://mainnet.ckb.dev",
        "https://mainnet.ckbapp.dev",
    ]
}
*/
const devdUrls = {
    ckb_indexer_url: [
        "https://testnet.ckb.dev",      
        "https://testnet.ckbapp.dev",
    ],
    ckb_rpc_url: [
        "https://testnet.ckb.dev",  
        "https://testnet.ckbapp.dev", 
    ]
}

const prodUrls = {
    ckb_indexer_url: [
        "https://mainnet.ckb.dev",
        "https://mainnet.ckbapp.dev",
    ],
    ckb_rpc_url: [
        "https://mainnet.ckb.dev",
        "https://mainnet.ckbapp.dev",
    ]
}

const devdRandomCKBRPCIndex = Math.floor(Math.random() * devdUrls.ckb_rpc_url.length);
const devdRandomCKBIndexerIndex = Math.floor(Math.random() * devdUrls.ckb_indexer_url.length);
const prodRandomCKBRPCIndex = Math.floor(Math.random() * prodUrls.ckb_rpc_url.length);
const prodRandomCKBIndexerIndex = Math.floor(Math.random() * prodUrls.ckb_indexer_url.length);

const prodConfig = {
    APP: {
        IS_MAINNET: true,
        API_BASE_URL:"https://api.your-dapp-domain",   
        MAX_DECIMAL_PART_LENGTH: 8,
        JOYID_BUY_CKB:"https://app.joy.id/exchange?token=ckb",
    },
    CKB: {
        CKB_RPC_URL: prodUrls.ckb_rpc_url[prodRandomCKBRPCIndex],
        CKB_INDEXER_URL: prodUrls.ckb_indexer_url[prodRandomCKBIndexerIndex],
        CKB_EXPLORER_URL: "https://explorer.nervos.org",
        PREFIX: 'ckb',
        SCRIPTS: predefined.LINA.SCRIPTS,
    },
    JOYID: {
        SCRIPT: {
            CODE_HASH: "0xd00c84f0ec8fd441c38bc3f87a371f547190f2fcff88e642bc5bf54b9e318323",
            HASH_TYPE: "type",
            TX_HASH: "0xf05188e5f3a6767fc4687faf45ba5f1a6e25d3ada6129dae8722cb282f262493",
            INDEX: "0x0",
            DEP_TYPE: "depGroup"
        },
        APP_CONFIG: {
            // your app name
            name: 'cookckb',
            // your app logo
            logo: 'https://your-dapp-domain/your-logo.svg',
            // 
            network: 'mainnet',
            //
            // JoyID app url, optional
            joyidAppURL: 'https://app.joy.id',
            // JoyID server url, optional
            joyidServerURL: 'https://api.joy.id',
        }
    }
};

const devConfig = {
    APP: {
        IS_MAINNET: false,
        API_BASE_URL:"https://test-api.cookckb",
        MAX_DECIMAL_PART_LENGTH: 8,
        JOYID_BUY_CKB:"https://testnet.joyid.dev/exchange?token=ckb",
    },
    CKB: {
        CKB_RPC_URL: devdUrls.ckb_rpc_url[devdRandomCKBRPCIndex],
        CKB_INDEXER_URL: devdUrls.ckb_indexer_url[devdRandomCKBIndexerIndex],
        CKB_EXPLORER_URL: "https://pudge.explorer.nervos.org",
        PREFIX: 'ckt',
        SCRIPTS: predefined.AGGRON4.SCRIPTS,
    },
    JOYID: {
        SCRIPT: {
            CODE_HASH: "0xd23761b364210735c19c60561d213fb3beae2fd6172743719eff6920e020baac",
            HASH_TYPE: "type",
            TX_HASH: "0x4dcf3f3b09efac8995d6cbee87c5345e812d310094651e0c3d9a730f32dc9263",
            INDEX: "0x0",
            DEP_TYPE: "depGroup"
        },
        APP_CONFIG: {
            // your app name
            name: 'your app name',
            // your app logo
            logo: 'https://your-dapp-domain/your-logo.svg',
            // 
            network: 'testnet',
            //
            // JoyID app url, optional
            joyidAppURL: 'https://testnet.joyid.dev',
            // JoyID server url, optional
            joyidServerURL: "https://api.joyid.dev",
        }
    }

};

const env = process.env.REACT_APP_ENV;

let appConfig;

if (env === "production" || env === "prod") {
    appConfig = prodConfig;
} else if (env === "development" || env === "dev" || env === "staging") {
    appConfig = devConfig;
} else {
    appConfig = devConfig;
}

export default appConfig;
