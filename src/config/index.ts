import polygon from './polygon.json';
import zktestnet from './zkera_testnet.json';
import zkmainnet from './zkera.json';
import { ChainId } from 'sdk/uniswap';

const configs: any = {
  [ChainId.MATIC]: polygon,
  [ChainId.ZK_ERA_TESTNET]: zktestnet,
  [ChainId.ZK_ERA]: zkmainnet,
};

export const getConfig = (network: ChainId | undefined) => {
  if (network === undefined) {
    return configs[ChainId.MATIC];
  }
  return configs[network];
};
