import { useEffect, useState, useCallback, useMemo } from 'react';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { ChainId, Pair } from 'sdk/uniswap';
import { isMobile } from 'react-device-detect';
import { injected, safeApp } from 'connectors';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'state';
/* eslint-disable */
// @ts-ignore
import transakSDK from '@transak/transak-sdk';
import { addPopup } from 'state/application/actions';
import { useSingleCallResult, NEVER_RELOAD } from 'state/multicall/hooks';
import { useArgentWalletDetectorContract } from './useContract';
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks';
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks';
import { usePairs } from 'data/Reserves';
import useParsedQueryString from './useParsedQueryString';
import { useLocalChainId } from 'state/application/hooks';
import { GlobalConst } from '../constants';
import { useParams } from 'react-router-dom';
import { getConfig } from 'config';
import { DEFAULT_CHAIN_ID } from '../sdk/uniswap/constants';

export function useActiveWeb3React(): Web3ReactContextInterface<
  Web3Provider
> & {
  chainId?: ChainId;
} {
  const context = useWeb3ReactCore<Web3Provider>();
  const contextNetwork = useWeb3ReactCore<Web3Provider>(
    GlobalConst.utils.NetworkContextName,
  );
  const { localChainId } = useLocalChainId();
  const contextActive = context.active ? context : contextNetwork;
  return {
    ...contextActive,
    chainId: context.chainId ?? localChainId,
  };
}

export function useIsArgentWallet(): boolean {
  const { account } = useActiveWeb3React();
  const argentWalletDetector = useArgentWalletDetectorContract();
  const call = useSingleCallResult(
    argentWalletDetector,
    'isArgentWallet',
    [account ?? undefined],
    NEVER_RELOAD,
  );
  return call?.result?.[0] ?? false;
}

export function useInitTransak() {
  const dispatch = useDispatch<AppDispatch>();
  const initTransak = (account: any, mobileWindowSize: boolean) => {
    const transak = new transakSDK({
      apiKey: process.env.REACT_APP_TRANSAK_KEY, // Your API Key
      environment: 'PRODUCTION', // STAGING/PRODUCTION
      defaultCryptoCurrency: 'MATIC',
      walletAddress: account, // Your customer's wallet address
      themeColor: '2891f9', // App theme color
      redirectURL: 'window.location.origin',
      hostURL: window.location.origin,
      widgetHeight: mobileWindowSize ? '450px' : '600px',
      widgetWidth: mobileWindowSize ? '360px' : '450px',
      networks: 'matic',
    });

    transak.init();

    // To get all the events
    transak.on(transak.TRANSAK_ORDER_FAILED, (data: any) => {
      dispatch(
        addPopup({
          key: 'abc',
          content: {
            txn: { hash: '', summary: 'Buy order failed', success: false },
          },
        }),
      );
    });

    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData: any) => {
      dispatch(
        addPopup({
          key: 'abc',
          content: {
            txn: {
              hash: '',
              summary:
                'Buy ' +
                orderData.status.cryptoAmount +
                ' ' +
                orderData.status.cryptocurrency +
                ' for ' +
                orderData.status.fiatAmount +
                ' ' +
                orderData.status.fiatCurrency,
              success: true,
            },
          },
        }),
      );
      transak.close();
    });
  };

  return { initTransak };
}

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore(); // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false);

  const checkInjected = useCallback(() => {
    return injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        if (isMobile && window.ethereum) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      }
    });
  }, [activate]);

  useEffect(() => {
    Promise.race([
      safeApp.getSafeInfo(),
      new Promise((resolve) => setTimeout(resolve, 100)),
    ]).then(
      (safe) => {
        if (safe) activate(safeApp, undefined, true);
        else checkInjected();
      },
      () => {
        checkInjected();
      },
    );
  }, [activate, checkInjected]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error);
          });
        }
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
}

export function useV2LiquidityPools(account?: string) {
  const trackedTokenPairs = useTrackedTokenPairs();
  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs],
  );
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  );
  const [
    v2PairsBalances,
    fetchingV2PairBalances,
  ] = useTokenBalancesWithLoadingIndicator(account, liquidityTokens);

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  );

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens),
  );
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    v2Pairs?.some((V2Pair) => !V2Pair);

  const allV2PairsWithLiquidity = v2Pairs
    .map(([, pair]) => pair)
    .filter((v2Pair): v2Pair is Pair => Boolean(v2Pair));

  return { loading: v2IsLoading, pairs: allV2PairsWithLiquidity };
}

export const useIsProMode = () => {
  const { chainId } = useActiveWeb3React();
  const config = getConfig(chainId);
  const proModeEnabled = config['swap']['proMode'];
  const parsedQs = useParsedQueryString();
  const isProMode = Boolean(
    parsedQs.isProMode && parsedQs.isProMode === 'true',
  );
  return proModeEnabled && isProMode;
};

export const useAnalyticsVersion = () => {
  const { chainId } = useActiveWeb3React();
  const chainIdToUse = chainId ?? DEFAULT_CHAIN_ID;
  const config = getConfig(chainIdToUse);
  const v2 = config['v2'];
  const v3 = config['v3'];
  const defaultVersion = v2 && v3 ? 'total' : v2 ? 'v2' : 'v3';
  const params: any = useParams();
  const version = params && params.version ? params.version : defaultVersion;
  return version;
};
