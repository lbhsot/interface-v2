import { useEffect } from 'react';
import { useGasPrice } from '../../hooks/useGasPrice';
import { useActiveWeb3React } from 'hooks';

import { updateGasPrice } from './actions';
import { ChainId } from 'sdk/uniswap';
import { useAppDispatch, useAppSelector } from 'state';
import { DEFAULT_CHAIN_ID } from '../../sdk/uniswap/constants';

export default function GasUpdater(): null {
  const dispatch = useAppDispatch();

  const { chainId } = useActiveWeb3React();

  const block = useAppSelector((state) => {
    return state.application.blockNumber[chainId ?? DEFAULT_CHAIN_ID];
  });

  const { fetchGasPrice, gasPrice, gasPriceLoading } = useGasPrice();

  useEffect(() => {
    fetchGasPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [block]);

  useEffect(() => {
    if (!gasPrice.fetched) return;
    dispatch(updateGasPrice(gasPrice));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gasPrice, gasPriceLoading]);

  return null;
}
