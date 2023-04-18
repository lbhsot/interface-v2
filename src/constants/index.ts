import { ChainId, JSBI, Percent, Token, WETH } from 'sdk/uniswap';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { injected, metamask, safeApp, walletconnect } from '../connectors';
import MetamaskIcon from 'assets/images/metamask.png';
import BlockWalletIcon from 'assets/images/blockwalletIcon.svg';
import BraveWalletIcon from 'assets/images/braveWalletIcon.png';
import cypherDIcon from 'assets/images/cypherDIcon.png';
import BitKeepIcon from 'assets/images/bitkeep.png';
import WalletConnectIcon from 'assets/images/walletConnectIcon.svg';
import GnosisIcon from 'assets/images/gnosis_safe.png';
import { Presets } from 'state/mint/v3/reducer';
import { DAI, USDC, WBTC } from './v3/addresses';

export enum TxnType {
  SWAP,
  ADD,
  REMOVE,
}

export enum RouterTypes {
  QUICKSWAP = 'QUICKSWAP',
  SMART = 'SMART',
  BONUS = 'BONUS',
}

export enum SmartRouter {
  PARASWAP = 'PARASWAP',
  QUICKSWAP = 'QUICKSWAP',
}

export const WALLCHAIN_PARAMS = {
  [ChainId.ZK_ERA]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
  [ChainId.ZK_ERA_TESTNET]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
  [ChainId.LINEA_TESTNET]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
  [ChainId.SCROLL_ALPHA_TESTNET]: {
    [SmartRouter.PARASWAP]: {
      apiURL: '',
      apiKey: '',
    },
    [SmartRouter.QUICKSWAP]: {
      apiURL: '',
      apiKey: '',
    },
  },
};

export const BONUS_CUTOFF_AMOUNT = {
  [ChainId.ZK_ERA_TESTNET]: 0,
  [ChainId.ZK_ERA]: 0,
  [ChainId.LINEA_TESTNET]: 0,
  [ChainId.SCROLL_ALPHA_TESTNET]: 0,
};

export const GlobalConst = {
  blacklists: {
    TOKEN_BLACKLIST: [
      '0x495c7f3a713870f68f8b418b355c085dfdc412c3',
      '0xc3761eb917cd790b30dad99f6cc5b4ff93c4f9ea',
      '0xe31debd7abff90b06bca21010dd860d8701fd901',
      '0xfc989fbb6b3024de5ca0144dc23c18a063942ac1',
      '0xf4eda77f0b455a12f3eb44f8653835f377e36b76',
    ],
    PAIR_BLACKLIST: [
      '0xb6a741f37d6e455ebcc9f17e2c16d0586c3f57a5',
      '0x97cb8cbe91227ba87fc21aaf52c4212d245da3f8',
    ],
  },
  addresses: {
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  },
  utils: {
    QUICK_CONVERSION_RATE: 1000,
    ONEDAYSECONDS: 60 * 60 * 24,
    DQUICKFEE: 0.04,
    DQUICKAPR_MULTIPLIER: 0.01,
    ROWSPERPAGE: 10,
    FEEPERCENT: 0.003,
    BUNDLE_ID: '1',
    PROPOSAL_LENGTH_IN_DAYS: 7, // TODO this is only approximate, it's actually based on blocks
    NetworkContextName: 'NETWORK',
    INITIAL_ALLOWED_SLIPPAGE: 50, // default allowed slippage, in bips
    DEFAULT_DEADLINE_FROM_NOW: 60 * 20, // 20 minutes, denominated in seconds
    BIG_INT_ZERO: JSBI.BigInt(0),
    ONE_BIPS: new Percent(JSBI.BigInt(1), JSBI.BigInt(10000)), // one basis point
    BIPS_BASE: JSBI.BigInt(10000),
    // used to ensure the user doesn't send so much ETH so they end up with <.01
    MIN_ETH: JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)), // .01 ETH
    BETTER_TRADE_LINK_THRESHOLD: new Percent(
      JSBI.BigInt(75),
      JSBI.BigInt(10000),
    ),
    // the Uniswap Default token list lives here
    // we add '' to remove the possibility of nulls
    DEFAULT_ADS_LIST_URL: process.env.REACT_APP_ADS_LIST_DEFAULT_URL + '',
    DEFAULT_TOKEN_LIST_URL: process.env.REACT_APP_TOKEN_LIST_DEFAULT_URL + '',
    DEFAULT_LP_FARMS_LIST_URL:
      process.env.REACT_APP_STAKING_LIST_DEFAULT_URL + '',
    DEFAULT_CNT_FARMS_LIST_URL:
      process.env.REACT_APP_CNT_STAKING_LIST_DEFAULT_URL + '',
    DEFAULT_DUAL_FARMS_LIST_URL:
      process.env.REACT_APP_DUAL_STAKING_LIST_DEFAULT_URL + '',
    DEFAULT_SYRUP_LIST_URL: process.env.REACT_APP_SYRUP_LIST_DEFAULT_URL + '',
    ANALYTICS_TOKENS_COUNT: 200,
    ANALYTICS_PAIRS_COUNT: 400,
    v3FarmSortBy: {
      pool: '1',
      tvl: '2',
      rewards: '3',
      apr: '4',
    },
    v3FarmFilter: {
      allFarms: '0',
      stableCoin: '1',
      blueChip: '2',
      stableLP: '3',
      otherLP: '4',
    },
  },
  analyticChart: {
    ONE_MONTH_CHART: 1,
    THREE_MONTH_CHART: 2,
    SIX_MONTH_CHART: 3,
    ONE_YEAR_CHART: 4,
    ALL_CHART: 5,
    CHART_COUNT: 60, //limit analytics chart items not more than 60
  },
  v2FarmTab: {
    LPFARM: 'lpFarm',
    DUALFARM: 'DualFarm',
    OTHER_LP: 'OtherFarm',
  },
  v3LiquidityRangeType: {
    MANUAL_RANGE: '0',
    GAMMA_RANGE: '1',
  },
  walletName: {
    METAMASK: 'Metamask',
    TRUST_WALLET: 'Trust Wallet',
    PHANTOM_WALLET: 'Phantom',
    CYPHERD: 'CypherD',
    BLOCKWALLET: 'BlockWallet',
    BRAVEWALLET: 'BraveWallet',
    BITKEEP: 'BitKeep',
    INJECTED: 'Injected',
    SAFE_APP: 'Gnosis Safe App',
    ARKANE_CONNECT: 'Venly',
    Portis: 'Portis',
    WALLET_LINK: 'Coinbase Wallet',
    WALLET_CONNECT: 'WalletConnect',
    ZENGO_CONNECT: 'ZenGo',
  },
};

export const SUPPORTED_CHAINIDS = [
  ChainId.ZK_ERA_TESTNET,
  // ChainId.LINEA_TESTNET,
  // ChainId.SCROLL_ALPHA_TESTNET,
];

export interface GammaPair {
  address: string;
  title: string;
  type: Presets;
  token0Address: string;
  token1Address: string;
  ableToFarm?: boolean;
  pid?: number;
  masterChefIndex?: number;
}

export const GammaPairs: {
  [chainId in ChainId]: {
    [key: string]: GammaPair[];
  };
} = {
  [ChainId.ZK_ERA]: {},
  [ChainId.ZK_ERA_TESTNET]: {},
  [ChainId.LINEA_TESTNET]: {},
  [ChainId.SCROLL_ALPHA_TESTNET]: {},
};

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  CYPHERD: {
    connector: injected,
    name: GlobalConst.walletName.CYPHERD,
    iconName: cypherDIcon,
    description: 'CypherD browser extension.',
    href: null,
    color: '#E8831D',
  },
  METAMASK: {
    connector: metamask,
    name: GlobalConst.walletName.METAMASK,
    iconName: MetamaskIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
  },
  BLOCKWALLET: {
    connector: injected,
    name: GlobalConst.walletName.BLOCKWALLET,
    iconName: BlockWalletIcon,
    description: 'BlockWallet browser extension.',
    href: null,
    color: '#1673ff',
  },
  BRAVEWALLET: {
    connector: injected,
    name: GlobalConst.walletName.BRAVEWALLET,
    iconName: BraveWalletIcon,
    description: 'Brave browser wallet.',
    href: null,
    color: '#1673ff',
    mobile: true,
  },
  BITKEEP: {
    connector: injected,
    name: GlobalConst.walletName.BITKEEP,
    iconName: BitKeepIcon,
    description: 'BitKeep browser extension.',
    href: null,
    color: '#E8831D',
  },
  INJECTED: {
    connector: injected,
    name: GlobalConst.walletName.INJECTED,
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
  },
  SAFE_APP: {
    connector: safeApp,
    name: GlobalConst.walletName.SAFE_APP,
    iconName: GnosisIcon,
    description: 'Login using gnosis safe app',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: GlobalConst.walletName.WALLET_CONNECT,
    iconName: WalletConnectIcon,
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true,
  },
};

export const GlobalValue = {
  percents: {
    ALLOWED_PRICE_IMPACT_LOW: new Percent( // used for warning states
      JSBI.BigInt(100),
      GlobalConst.utils.BIPS_BASE,
    ), // 1%
    ALLOWED_PRICE_IMPACT_MEDIUM: new Percent(
      JSBI.BigInt(300),
      GlobalConst.utils.BIPS_BASE,
    ), // 3%
    ALLOWED_PRICE_IMPACT_HIGH: new Percent(
      JSBI.BigInt(500),
      GlobalConst.utils.BIPS_BASE,
    ), // 5%
    PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: new Percent( // if the price slippage exceeds this number, force the user to type 'confirm' to execute
      JSBI.BigInt(1000),
      GlobalConst.utils.BIPS_BASE,
    ), // 10%
    BLOCKED_PRICE_IMPACT_NON_EXPERT: new Percent( // for non expert mode disable swaps above this
      JSBI.BigInt(1500),
      GlobalConst.utils.BIPS_BASE,
    ), // 15%
  },
  tokens: {
    ETH: WETH[ChainId.ZK_ERA_TESTNET],
    COMMON: {
      EMPTY: new Token(
        ChainId.ZK_ERA_TESTNET,
        '0x0000000000000000000000000000000000000000',
        0,
        'EMPTY',
        'EMPTY',
      ),
      USDC: USDC[ChainId.ZK_ERA_TESTNET],
      WBTC: WBTC[ChainId.ZK_ERA_TESTNET],
      DAI: DAI[ChainId.ZK_ERA_TESTNET],
    },
  },
  marketSDK: {
    BLOCKSPERDAY: 0.5 * GlobalConst.utils.ONEDAYSECONDS,
  },
};

export const paraswapTax: { [key: string]: number } = {
  '0xed88227296943857409a8e0f15ad7134e70d0f73': 100,
  '0x37eb60f78e06c4bb2a5f836b0fc6bccbbaa995b3': 0,
  '0xf16ec50ec49abc95fa793c7871682833b6bc47e7': 1300,
};

export const GlobalData = {
  analytics: {
    CHART_DURATIONS: [
      GlobalConst.analyticChart.ONE_MONTH_CHART,
      GlobalConst.analyticChart.THREE_MONTH_CHART,
      GlobalConst.analyticChart.SIX_MONTH_CHART,
      GlobalConst.analyticChart.ONE_YEAR_CHART,
      GlobalConst.analyticChart.ALL_CHART,
    ],
    CHART_DURATION_TEXTS: ['1M', '3M', '6M', '1Y', 'All'],
  },
  stableCoins: [GlobalValue.tokens.COMMON.USDC, GlobalValue.tokens.COMMON.DAI],
  blueChips: [
    GlobalValue.tokens.COMMON.WBTC,
    GlobalValue.tokens.COMMON.USDC,
    GlobalValue.tokens.COMMON.DAI,
  ],
  stablePairs: [
    [GlobalValue.tokens.COMMON.USDC, GlobalValue.tokens.COMMON.DAI],
  ],
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
  installLink?: string | null;
}

export const ContestPairs = [
  {
    name: 'All',
    address: 'all',
  },
  {
    name: 'WETH / USDC',
    address: '0x55caabb0d2b704fd0ef8192a7e35d8837e678207',
    token0Address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    token1Address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  {
    name: 'WMATIC / USDC',
    address: '0xae81fac689a1b4b1e06e7ef4a2ab4cd8ac0a087d',
    token0Address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    token1Address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  },
  {
    name: 'WMATIC / USDT',
    address: '0x5b41eedcfc8e0ae47493d4945aa1ae4fe05430ff',
    token0Address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    token1Address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
  },
  {
    name: 'WMATIC / WETH',
    address: '0x479e1b71a702a595e19b6d5932cd5c863ab57ee0',
    token0Address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    token1Address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
  },
];

export const LeaderBoardAnalytics = {
  CHART_DURATIONS: [1, 7, 30],
  CHART_DURATION_TEXTS: ['24H', '7D', '30D'],
};

// export const ContestPairs = {
//   ETH_USDC_PAIR: '0x853Ee4b2A13f8a742d64C8F088bE7bA2131f670d',
//   MATIC_USDC_PAIR: '0x6e7a5FAFcec6BB1e78bAE2A1F0B612012BF14827',
//   MATIC_USDT_PAIR: '0x604229c960e5cacf2aaeac8be68ac07ba9df81c3',
//   MATIC_ETH_PAIR: '0xadbf1854e5883eb8aa7baf50705338739e558e5b',
// };
