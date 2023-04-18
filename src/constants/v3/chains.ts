import { ChainId } from 'sdk/uniswap';

export const L1_CHAIN_IDS = [] as const;

export type SupportedL1ChainId = typeof L1_CHAIN_IDS[number];

export const L2_CHAIN_IDS = [] as const;

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number];

interface L1ChainInfo {
  readonly docs: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly label: string;
  readonly nativeCurrencySymbol: string;
  readonly nativeCurrencyName: string;
  readonly nativeCurrencyDecimals: number;
}

interface L2ChainInfo extends L1ChainInfo {
  readonly bridge: string;
  readonly logoUrl: string;
}

type ChainInfo = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo;
} &
  { readonly [chainId in SupportedL1ChainId]: L1ChainInfo };

export const CHAIN_INFO: ChainInfo = {
  [ChainId.ZK_ERA_TESTNET]: {
    docs: 'https://era.zksync.io/docs/',
    explorer: 'https://goerli.explorer.zksync.io/m',
    infoLink: 'https://algebra.finance',
    label: 'ZK_ERA_TESTNET',
    nativeCurrencySymbol: 'ETH',
    nativeCurrencyName: 'Ether',
    nativeCurrencyDecimals: 18,
  },
  [ChainId.ZK_ERA]: {
    docs: 'https://era.zksync.io/docs/',
    explorer: 'https://explorer.zksync.io/',
    infoLink: 'https://algebra.finance',
    label: 'ZK_ERA',
    nativeCurrencySymbol: 'ETH',
    nativeCurrencyName: 'Ether',
    nativeCurrencyDecimals: 18,
  },
  [ChainId.LINEA_TESTNET]: {
    docs: '',
    explorer: 'https://explorer.goerli.linea.build',
    infoLink: '',
    label: 'LINEA_TESTNET',
    nativeCurrencySymbol: 'ETH',
    nativeCurrencyName: 'Ether',
    nativeCurrencyDecimals: 18,
  },
  [ChainId.SCROLL_ALPHA_TESTNET]: {
    docs: '',
    explorer: 'https://blockscout.scroll.io',
    infoLink: '',
    label: 'SCROLL_ALPHA_TESTNET',
    nativeCurrencySymbol: 'ETH',
    nativeCurrencyName: 'Ether',
    nativeCurrencyDecimals: 18,
  },
};
