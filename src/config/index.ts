import polygon from './polygon.json';
import zktestnet from './zkera_testnet.json';
import zkmainnet from './zkera.json';
import { ChainId } from 'sdk/uniswap';
import { DEFAULT_CHAIN_ID } from '../sdk/uniswap/constants';

const configs: any = {
  [ChainId.ZK_ERA_TESTNET]: zktestnet,
  [ChainId.ZK_ERA]: zkmainnet,
};

export const getConfig = (network: ChainId | undefined) => {
  if (network === undefined) {
    return configs[DEFAULT_CHAIN_ID];
  }
  return configs[network];
};
