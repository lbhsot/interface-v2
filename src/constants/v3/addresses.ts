import { ChainId, WETH, Token } from 'sdk/uniswap';
import { Token as TokenV3 } from '@uniswap/sdk-core';
import { V3Currency } from 'v3lib/entities/v3Currency';

export enum V2Exchanges {
  Quickswap = 'Quickswap',
  SushiSwap = 'Sushiswap',
  //Uniswap = 'Uniswap',
}

type ExchangeAddressMap = { [exchange in V2Exchanges]: AddressMap };
type AddressMap = { [chainId: number]: string };

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

const WETH_ONLY: ChainTokenList = {
  [ChainId.ZK_ERA]: [WETH[ChainId.ZK_ERA]],
  [ChainId.ZK_ERA_TESTNET]: [WETH[ChainId.ZK_ERA_TESTNET]],
  [ChainId.LINEA_TESTNET]: [WETH[ChainId.LINEA_TESTNET]],
  [ChainId.SCROLL_ALPHA_TESTNET]: [WETH[ChainId.SCROLL_ALPHA_TESTNET]],
};

export const toV3Token = (t: {
  chainId: number;
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
}): TokenV3 => {
  return new TokenV3(t.chainId, t.address, t.decimals, t.symbol, t.name);
};

export const toV3Currency = (t: {
  chainId: number;
  decimals: number;
  symbol?: string;
  name?: string;
}): V3Currency => {
  return new V3Currency(t.chainId, t.decimals, t.symbol, t.name);
};

export const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.ZK_ERA]: '', // todo fixme
  [ChainId.ZK_ERA_TESTNET]: '0x88495e37572D0bE88E36669C2d0Ba38C3fA06E7A',
  [ChainId.SCROLL_ALPHA_TESTNET]: '0xA69C056fCB17d3E2528e9F5a116262D12903D9De',
  [ChainId.LINEA_TESTNET]: '0xA69C056fCB17d3E2528e9F5a116262D12903D9De',
};

// export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
//   [ChainId.MATIC]: '0x411b0fAcC3489691f28ad58c47006AF5E3Ab3A28',
//   [ChainId.DOGECHAIN]: '0xd2480162Aa7F02Ead7BF4C127465446150D58452',
//   [ChainId.ZKTESTNET]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
//   [ChainId.ZKEVM]: '0x4B9f4d2435Ef65559567e5DbFC1BbB37abC43B57',
// };

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
  [ChainId.ZK_ERA]: '',
  [ChainId.ZK_ERA_TESTNET]: '',
  [ChainId.LINEA_TESTNET]: '',
  [ChainId.SCROLL_ALPHA_TESTNET]: '',
};

export const QUOTER_ADDRESSES: AddressMap = {
  [ChainId.ZK_ERA]: '',
  [ChainId.ZK_ERA_TESTNET]: '',
  [ChainId.LINEA_TESTNET]: '',
  [ChainId.SCROLL_ALPHA_TESTNET]: '',
};

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
  [ChainId.ZK_ERA]: '',
  [ChainId.ZK_ERA_TESTNET]: '',
  [ChainId.LINEA_TESTNET]: '',
  [ChainId.SCROLL_ALPHA_TESTNET]: '',
};

export const SWAP_ROUTER_ADDRESS: AddressMap = {};

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {};

export const GAMMA_UNIPROXY_ADDRESSES: AddressMap = {};

export const GAMMA_MASTERCHEF_ADDRESSES: AddressMap[] = [];

export const MULTICALL_ADDRESS: AddressMap = {
  [ChainId.ZK_ERA]: '', // todo fixme
  [ChainId.ZK_ERA_TESTNET]: '0x18c4a4f85CD63d83b8190e484ceC19510F8d77cD',
  [ChainId.LINEA_TESTNET]: '0xd8069b3395c6bE5668395fa2DFd130E976dE808E',
  [ChainId.SCROLL_ALPHA_TESTNET]: '0x4216f1ce1F0e9FC1131F1eb322353185821624CD',
};

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
  [ChainId.ZK_ERA]: '',
  [ChainId.ZK_ERA_TESTNET]: '',
  [ChainId.LINEA_TESTNET]: '',
  [ChainId.SCROLL_ALPHA_TESTNET]: '',
};

export const FINITE_FARMING: AddressMap = {};

export const FARMING_CENTER: AddressMap = {};

export const V2_FACTORY_ADDRESSES: AddressMap = {
  [ChainId.ZK_ERA]: '', // fixme
  [ChainId.ZK_ERA_TESTNET]: '0xc457be4CB96Fa4Ed612DA41fb9F4f86B3606911f',
  [ChainId.LINEA_TESTNET]: '0x3D8bafcAD95b93264D7fcfC6B351Dc547569F681',
  [ChainId.SCROLL_ALPHA_TESTNET]: '0x3D8bafcAD95b93264D7fcfC6B351Dc547569F681',
};

export const EXCHANGE_FACTORY_ADDRESS_MAPS: ExchangeAddressMap = {
  [V2Exchanges.Quickswap]: {},
  [V2Exchanges.SushiSwap]: {},
};

export const EXCHANGE_PAIR_INIT_HASH_MAPS: ExchangeAddressMap = {
  [V2Exchanges.Quickswap]: {},
  [V2Exchanges.SushiSwap]: {},
};

export const V2_ROUTER_ADDRESS: AddressMap = {
  [ChainId.ZK_ERA]: '',
  [ChainId.ZK_ERA_TESTNET]: '0x3d31a0f27267F917Fe6d85fe221963bfbBb83bC6',
  [ChainId.LINEA_TESTNET]: '0x08Cd1d62ad16495C6CBa7EBCc9C0C5c18a1b0306',
  [ChainId.SCROLL_ALPHA_TESTNET]: '0x08Cd1d62ad16495C6CBa7EBCc9C0C5c18a1b0306',
};

export const PARASWAP_PROXY_ROUTER_ADDRESS: AddressMap = {};

export const PARASWAP_ROUTER_ADDRESS: AddressMap = {};

export const LAIR_ADDRESS: AddressMap = {};

export const NEW_LAIR_ADDRESS: AddressMap = {};

export const QUICK_ADDRESS: AddressMap = {};

export const NEW_QUICK_ADDRESS: AddressMap = {};

export const DL_QUICK_ADDRESS: AddressMap = {};

export const QUICK_CONVERSION: AddressMap = {};

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {};

export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {};

export const V2_MATIC_USDT_PAIR: AddressMap = {};

export const LENDING_QS_POOL_DIRECTORY: AddressMap = {};

export const LENDING_LENS: AddressMap = {};

export const LENDING_QS_POOLS: { [chainId: number]: string[] } = {};

export const WMATIC_EXTENDED: { [chainId: number]: TokenV3 } = {};

export const USDC: { [chainId: number]: Token } = {
  [ChainId.ZK_ERA_TESTNET]: new Token(
    ChainId.ZK_ERA_TESTNET,
    '0x0faF6df7054946141266420b43783387A78d82A9',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.LINEA_TESTNET]: new Token(
    ChainId.LINEA_TESTNET,
    '0x37922c71477dd9c2e781706A81019c9a5D0a3aC8',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.SCROLL_ALPHA_TESTNET]: new Token(
    ChainId.SCROLL_ALPHA_TESTNET,
    '0xA0D71B9877f44C744546D649147E3F1e70a93760',
    6,
    'USDC',
    'USD Coin',
  ),
};

export const USDT: { [chainId: number]: Token } = {};

export const OLD_QUICK: { [chainId: number]: Token } = {};

export const NEW_QUICK: { [chainId: number]: Token } = {};

export const OLD_DQUICK: { [chainId: number]: Token } = {};

export const NEW_DQUICK: { [chainId: number]: Token } = {};

export const WBTC: { [chainId: number]: Token } = {
  [ChainId.ZK_ERA_TESTNET]: new Token(
    ChainId.ZK_ERA_TESTNET,
    '0x0BfcE1D53451B4a8175DD94e6e029F7d8a701e9c',
    8,
    'wBTC',
    'Wrapped Bitcoin',
  ),
};

export const DAI: { [chainId: number]: Token } = {
  [ChainId.ZK_ERA_TESTNET]: new Token(
    ChainId.ZK_ERA_TESTNET,
    '0x3e7676937A7E96CFB7616f255b9AD9FF47363D4b',
    18,
    'DAI',
    'Dai Stablecoin',
  ),
};

export const ETHER: { [chainId: number]: Token } = {};

export const MATIC: { [chainId: number]: Token } = {};

export const MI: { [chainId: number]: Token } = {};

export const DC: { [chainId: number]: Token } = {};

export const DD: { [chainId: number]: Token } = {};

export const dDD: { [chainId: number]: Token } = {};

export const BOB: { [chainId: number]: Token } = {};

export const axlUSDC: { [chainId: number]: Token } = {};

export const TUSD: { [chainId: number]: Token } = {};

export const UND: { [chainId: number]: Token } = {};

export const USDD: { [chainId: number]: Token } = {};

export const DLQUICK: { [chainId: number]: Token } = {};

export const DLDQUICK: { [chainId: number]: Token } = {};

export const V2_BASES_TO_CHECK_TRADES_AGAINST: {
  [ChainId: number]: Token[];
} = {
  [ChainId.ZK_ERA_TESTNET]: [
    ...WETH_ONLY[ChainId.ZK_ERA_TESTNET],
    USDC[ChainId.ZK_ERA_TESTNET],
    WBTC[ChainId.ZK_ERA_TESTNET],
    DAI[ChainId.ZK_ERA_TESTNET],
  ],
  [ChainId.LINEA_TESTNET]: [
    ...WETH_ONLY[ChainId.LINEA_TESTNET],
    USDC[ChainId.LINEA_TESTNET],
  ],
  [ChainId.SCROLL_ALPHA_TESTNET]: [
    ...WETH_ONLY[ChainId.SCROLL_ALPHA_TESTNET],
    USDC[ChainId.SCROLL_ALPHA_TESTNET],
  ],
};

export const StableCoins: { [ChainId: number]: Token[] } = {
  [ChainId.ZK_ERA_TESTNET]: [
    USDC[ChainId.ZK_ERA_TESTNET],
    DAI[ChainId.ZK_ERA_TESTNET],
  ],
};

// Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these tokens.
export const V2_CUSTOM_BASES: {
  [ChainId: number]: { [tokenAddress: string]: Token[] };
} = {};

export const V3_CUSTOM_BASES: {
  [chainId: number]: { [tokenAddress: string]: TokenV3[] };
} = {};

export const V3_BASES_TO_CHECK_TRADES_AGAINST: {
  [ChainId: number]: TokenV3[];
} = {};

export const SUGGESTED_BASES: {
  [ChainId: number]: Token[];
} = {
  [ChainId.ZK_ERA_TESTNET]: [
    ...WETH_ONLY[ChainId.ZK_ERA_TESTNET],
    DAI[ChainId.ZK_ERA_TESTNET],
    USDC[ChainId.ZK_ERA_TESTNET],
    WBTC[ChainId.ZK_ERA_TESTNET],
  ],
  [ChainId.LINEA_TESTNET]: [
    ...WETH_ONLY[ChainId.LINEA_TESTNET],
    USDC[ChainId.LINEA_TESTNET],
  ],
  [ChainId.SCROLL_ALPHA_TESTNET]: [
    ...WETH_ONLY[ChainId.SCROLL_ALPHA_TESTNET],
    USDC[ChainId.SCROLL_ALPHA_TESTNET],
  ],
};

export const V2_BASES_TO_TRACK_LIQUIDITY_FOR: {
  [ChainId: number]: Token[];
} = {
  [ChainId.ZK_ERA_TESTNET]: [
    ...WETH_ONLY[ChainId.ZK_ERA_TESTNET],
    DAI[ChainId.ZK_ERA_TESTNET],
    USDC[ChainId.ZK_ERA_TESTNET],
  ],
  [ChainId.LINEA_TESTNET]: [
    ...WETH_ONLY[ChainId.LINEA_TESTNET],
    USDC[ChainId.LINEA_TESTNET],
  ],
  [ChainId.SCROLL_ALPHA_TESTNET]: [
    ...WETH_ONLY[ChainId.SCROLL_ALPHA_TESTNET],
    USDC[ChainId.SCROLL_ALPHA_TESTNET],
  ],
};

export const V3_BASES_TO_TRACK_LIQUIDITY_FOR: {
  [ChainId: number]: TokenV3[];
} = {};

export const V2_PINNED_PAIRS: {
  [ChainId: number]: [Token, Token][];
} = {
  [ChainId.ZK_ERA_TESTNET]: [
    [USDC[ChainId.ZK_ERA_TESTNET], DAI[ChainId.ZK_ERA_TESTNET]],
    [WBTC[ChainId.ZK_ERA_TESTNET], DAI[ChainId.ZK_ERA_TESTNET]],
    [WBTC[ChainId.ZK_ERA_TESTNET], USDC[ChainId.ZK_ERA_TESTNET]],
  ],
  [ChainId.LINEA_TESTNET]: [],
  [ChainId.ZK_ERA_TESTNET]: [],
};

export const V3_PINNED_PAIRS: {
  [ChainId: number]: [TokenV3, TokenV3][];
} = {};

export class ExtendedEther extends V3Currency {
  private static _cachedEther: { [chainId: number]: ExtendedEther } = {};

  public get wrapped(): TokenV3 {
    if (this.chainId in WMATIC_EXTENDED) return WMATIC_EXTENDED[this.chainId];
    throw new Error('Unsupported chain ID');
  }

  public static onChain(
    chainId: number,
    decimals: number,
    symbol?: string,
    name?: string,
  ): ExtendedEther {
    return (
      this._cachedEther[chainId] ??
      (this._cachedEther[chainId] = new ExtendedEther(
        chainId,
        decimals,
        symbol,
        name,
      ))
    );
  }
}
