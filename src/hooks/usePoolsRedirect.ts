import { ChainId, currencyEquals, ETHER } from 'sdk/uniswap';
import { useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useParsedQueryString from './useParsedQueryString';
import { NEW_QUICK_ADDRESS } from 'constants/v3/addresses';
import { useActiveWeb3React } from 'hooks';
import { DEFAULT_CHAIN_ID } from '../sdk/uniswap/constants';

export default function usePoolsRedirect() {
  const history = useHistory();
  const { chainId } = useActiveWeb3React();
  const chainIdToUse = chainId ?? DEFAULT_CHAIN_ID;
  const params: any = useParams();
  const currentPath = history.location.pathname + history.location.search;
  const parsedQuery = useParsedQueryString();
  const currencyIdAParam = params ? params.currencyIdA : undefined;
  const currencyIdBParam = params ? params.currencyIdB : undefined;

  const redirectWithCurrency = useCallback(
    (currency: any, isInput: boolean, isV2 = true) => {
      let redirectPath = '';
      const currencyId = (isV2
      ? currencyEquals(currency, ETHER[chainIdToUse])
      : currency.isNative)
        ? 'ETH'
        : currency.address;
      if (isInput) {
        if (currencyIdAParam ?? parsedQuery.currency0) {
          if (currencyIdAParam) {
            redirectPath = currentPath.replace(currencyIdAParam, currencyId);
          } else {
            redirectPath = currentPath.replace(
              `currency0=${parsedQuery.currency0}`,
              `currency0=${currencyId}`,
            );
          }
        } else {
          if (history.location.pathname.includes('/add')) {
            redirectPath = `${currentPath}/${currencyId}/${
              currencyIdBParam
                ? currencyIdBParam
                : currencyId === 'ETH'
                ? NEW_QUICK_ADDRESS
                : 'ETH'
            }${params && params.version ? `/${params.version}` : ''}`;
          } else {
            redirectPath = `${currentPath}${
              history.location.search === '' ? '?' : '&'
            }currency0=${currencyId}`;
          }
        }
      } else {
        if (currencyIdBParam ?? parsedQuery.currency1) {
          if (currencyIdBParam) {
            redirectPath = currentPath.replace(currencyIdBParam, currencyId);
          } else {
            redirectPath = currentPath.replace(
              `currency1=${parsedQuery.currency1}`,
              `currency1=${currencyId}`,
            );
          }
        } else {
          if (history.location.pathname.includes('/add')) {
            redirectPath = `${currentPath}/${
              currencyIdAParam
                ? currencyIdAParam
                : currencyId === 'ETH'
                ? NEW_QUICK_ADDRESS
                : 'ETH'
            }/${currencyId}${
              params && params.version ? `/${params.version}` : ''
            }`;
          } else {
            redirectPath = `${currentPath}${
              history.location.search === '' ? '?' : '&'
            }currency1=${currencyId}`;
          }
        }
      }
      history.push(redirectPath);
    },
    [
      currentPath,
      history,
      parsedQuery,
      currencyIdAParam,
      currencyIdBParam,
      params,
      chainIdToUse,
    ],
  );

  const redirectWithSwitch = useCallback(
    (currency: any, isInput: boolean, isV2 = true) => {
      const currencyId = (isV2
      ? currencyEquals(currency, ETHER[chainIdToUse])
      : currency.isNative)
        ? 'ETH'
        : currency.address;
      let redirectPath;
      if (isInput) {
        if (history.location.pathname.includes('/add')) {
          redirectPath = `/add/${currencyId}/${currencyIdAParam}${
            params && params.version ? `/${params.version}` : ''
          }`;
        } else {
          redirectPath = `${history.location.pathname}?currency0=${currencyId}&currency1=${parsedQuery.currency0}`;
        }
      } else {
        if (history.location.pathname.includes('/add')) {
          redirectPath = `/add/${currencyIdBParam}/${currencyId}${
            params && params.version ? `/${params.version}` : ''
          }`;
        } else {
          redirectPath = `${history.location.pathname}?currency0=${parsedQuery.currency1}&currency1=${currencyId}`;
        }
      }
      history.push(redirectPath);
    },
    [
      chainIdToUse,
      currencyIdAParam,
      currencyIdBParam,
      history,
      params,
      parsedQuery.currency0,
      parsedQuery.currency1,
    ],
  );

  return { redirectWithCurrency, redirectWithSwitch };
}
