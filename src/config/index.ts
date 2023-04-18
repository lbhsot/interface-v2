import zktestnet from './zkera_testnet.json';
import zkmainnet from './zkera.json';
import scrollAlphaTestnet from './scroll_alpha_testnet.json';
import lineaTestnet from './linea_testnet.json';
import { ChainId } from 'sdk/uniswap';
import { DEFAULT_CHAIN_ID } from '../sdk/uniswap/constants';

const configs: any = {
  [ChainId.ZK_ERA_TESTNET]: zktestnet,
  [ChainId.ZK_ERA]: zkmainnet,
  [ChainId.LINEA_TESTNET]: lineaTestnet,
  [ChainId.SCROLL_ALPHA_TESTNET]: scrollAlphaTestnet,
};

export const getConfig = (network: ChainId | undefined) => {
  if (network === undefined) {
    return configs[DEFAULT_CHAIN_ID];
  }
  return configs[network];
};
