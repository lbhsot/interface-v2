import { useQuery } from 'react-query';
import { useReadOnlyMarket } from './useMarket';
import { useActiveWeb3React } from '../index';
import { fetchPoolData, PoolData } from '../../utils/marketxyz/fetchPoolData';
import { PoolDirectoryV1 } from 'market-sdk';
import { useEthPrice } from 'state/application/hooks';
import { ChainId } from 'sdk/uniswap';
import { DEFAULT_CHAIN_ID } from '../../sdk/uniswap/constants';

export const usePoolsData = (
  poolAddresses: string[],
  directory: PoolDirectoryV1 | string,
) => {
  const { chainId, account } = useActiveWeb3React();
  const chainIdToUse = chainId ?? DEFAULT_CHAIN_ID;
  const { sdk } = useReadOnlyMarket();
  const { ethPrice } = useEthPrice();
  const _directory = sdk
    ? typeof directory === 'string'
      ? new PoolDirectoryV1(sdk, directory)
      : directory
    : undefined;
  const getPoolsData = async () => {
    if (!_directory) return;
    const allPools = await _directory.getAllPools();
    const poolsData: any[] = [];
    for (const poolAddress of poolAddresses) {
      const poolId = allPools.findIndex((p) => {
        return (
          p.comptroller.address.toLowerCase() === poolAddress.toLowerCase()
        );
      });
      if (poolId === -1) return;
      const poolData = await fetchPoolData(
        chainIdToUse,
        poolId.toString(),
        account ?? undefined,
        _directory,
        ethPrice.price ?? 0,
      );
      poolsData.push(poolData);
    }
    return poolsData;
  };
  const { data } = useQuery('FetchPoolsData', getPoolsData, {
    refetchInterval: 3000,
  });

  return data;
};

export const usePoolData = (
  poolId: string | null | undefined,
  directory: PoolDirectoryV1 | string,
): PoolData | undefined => {
  const { chainId, account } = useActiveWeb3React();
  const chainIdToUse = chainId ?? DEFAULT_CHAIN_ID;
  const { sdk } = useReadOnlyMarket();
  const { ethPrice } = useEthPrice();
  const _directory = sdk
    ? typeof directory === 'string'
      ? new PoolDirectoryV1(sdk, directory)
      : directory
    : undefined;
  const getPoolData = async () => {
    if (!_directory) return;
    const poolData = await fetchPoolData(
      chainIdToUse,
      poolId ?? undefined,
      account ?? undefined,
      _directory,
      ethPrice.price ?? 0,
    );
    return poolData;
  };
  const { data } = useQuery('FetchPoolData', getPoolData, {
    refetchInterval: 3000,
  });

  return data;
};
