import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { UAuthConnector } from '@uauth/web3-react';
import { NetworkConnector } from './NetworkConnector';
import { SafeAppConnector } from './SafeApp';
import { MetaMaskConnector } from './MetaMaskConnector';
import { ChainId } from 'sdk/uniswap';
import { PhantomWalletConnector } from './PhantomWalletConnector';
import { DEFAULT_CHAIN_ID } from '../sdk/uniswap/constants';

const POLLING_INTERVAL = 12000;

export interface NetworkInfo {
  rpcUrl: string;
  scanUrl: string;
}

export type NetworkInfoChainMap = Readonly<
  {
    [chainId in ChainId]: NetworkInfo;
  }
>;

export const networkInfoMap: NetworkInfoChainMap = {
  [ChainId.ZK_ERA]: {
    rpcUrl: 'https://mainnet.era.zksync.io',
    scanUrl: 'https://explorer.zksync.io/',
  },
  [ChainId.ZK_ERA_TESTNET]: {
    rpcUrl: 'https://testnet.era.zksync.dev',
    scanUrl: 'https://goerli.explorer.zksync.io/',
  },
  [ChainId.LINEA_TESTNET]: {
    rpcUrl: 'https://rpc.goerli.linea.build',
    scanUrl: 'https://explorer.goerli.linea.build/',
  },
  [ChainId.SCROLL_ALPHA_TESTNET]: {
    rpcUrl: 'https://alpha-rpc.scroll.io/l2',
    scanUrl: 'https://blockscout.scroll.io/',
  },
};

const NETWORK_URL = 'https://polygon-rpc.com/';
// const FORMATIC_KEY = 'pk_live_F937DF033A1666BF'
// const PORTIS_ID = 'c0e2bf01-4b08-4fd5-ac7b-8e26b58cd236'
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY;
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID;
const MAINNET_NETWORK_URL = process.env.REACT_APP_MAINNET_NETWORK_URL;

export const NETWORK_CHAIN_ID: number = parseInt(
  process.env.REACT_APP_CHAIN_ID ?? '280',
);

export const rpcMap = {
  [ChainId.ZK_ERA]: networkInfoMap[ChainId.ZK_ERA].rpcUrl,
  [ChainId.ZK_ERA_TESTNET]: networkInfoMap[ChainId.ZK_ERA_TESTNET].rpcUrl,
};

export const network = new NetworkConnector({
  urls: rpcMap,
  defaultChainId: DEFAULT_CHAIN_ID,
});

export const mainnetNetwork = new NetworkConnector({
  urls: {
    [Number('1')]: MAINNET_NETWORK_URL || 'https://rpc.ankr.com/eth',
  },
});

export function getMainnetNetworkLibrary(): Web3Provider {
  return new Web3Provider(mainnetNetwork.provider as any);
}

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary =
    networkLibrary ?? new Web3Provider(network.provider as any));
}

const supportedChainIds: number[] = [
  ChainId.ZK_ERA,
  ChainId.ZK_ERA_TESTNET,
  ChainId.LINEA_TESTNET,
  ChainId.SCROLL_ALPHA_TESTNET,
];

export const injected = new InjectedConnector({
  supportedChainIds: supportedChainIds,
});

export const metamask = new MetaMaskConnector({
  supportedChainIds: supportedChainIds,
});

export const safeApp = new SafeAppConnector();

export const phantomconnect = new PhantomWalletConnector({
  supportedChainIds: [],
});

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: rpcMap,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
});

export const unstopabbledomains = new UAuthConnector({
  clientID: process.env.REACT_APP_UNSTOPPABLE_DOMAIN_CLIENT_ID,
  redirectUri: process.env.REACT_APP_UNSTOPPABLE_DOMAIN_REDIRECT_URI,

  // Scope must include openid and wallet
  scope: 'openid wallet',

  // Injected and walletconnect connectors are required.
  connectors: { injected, walletconnect },
});
