import {
  Currency,
  Token,
  CurrencyAmount,
  ETHER,
  JSBI,
  Pair,
  Percent,
  Price,
  TokenAmount,
  ChainId,
} from 'sdk/uniswap';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PairState, usePair } from 'data/Reserves';
import { useTotalSupply } from 'data/TotalSupply';

import { useActiveWeb3React } from 'hooks';
import { wrappedCurrency, wrappedCurrencyAmount } from 'utils/wrappedCurrency';
import { AppDispatch, AppState } from 'state';
import { tryParseAmount } from 'state/swap/hooks';
import { useCurrencyBalances } from 'state/wallet/hooks';
import { useCurrency } from 'hooks/Tokens';
import { Field, typeInput, selectCurrency } from './actions';
import { DEFAULT_CHAIN_ID } from '../../sdk/uniswap/constants';

const ZERO = JSBI.BigInt(0);

export function useMintState(): AppState['mint'] {
  return useSelector<AppState, AppState['mint']>((state) => state.mint);
}

export function useDerivedMintInfo(): {
  dependentField: Field;
  currencies: { [field in Field]?: Currency };
  pair?: Pair | null;
  pairState: PairState;
  currencyBalances: { [field in Field]?: CurrencyAmount };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  price?: Price;
  noLiquidity?: boolean;
  liquidityMinted?: TokenAmount;
  poolTokenPercentage?: Percent;
  error?: string;
} {
  const { account, chainId } = useActiveWeb3React();
  const chainIdToUse = chainId ? chainId : DEFAULT_CHAIN_ID;
  const nativeCurrency = ETHER[chainIdToUse];
  const {
    independentField,
    typedValue,
    [Field.CURRENCY_A]: { currencyId: currencyAId },
    [Field.CURRENCY_B]: { currencyId: currencyBId },
    otherTypedValue,
  } = useMintState();

  const currencyA = useCurrency(currencyAId);
  const currencyB = useCurrency(currencyBId);

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A;

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB],
  );

  // pair
  const [pairState, pair] = usePair(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
  );
  const totalSupply = useTotalSupply(pair?.liquidityToken);

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(totalSupply && JSBI.equal(totalSupply.raw, ZERO));

  // balances
  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
  ]);
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  };

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(
    chainIdToUse,
    typedValue,
    currencies[independentField],
  );
  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(
          chainIdToUse,
          otherTypedValue,
          currencies[dependentField],
        );
      }
      return undefined;
    } else if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(
        independentAmount,
        chainId,
      );
      const [tokenA, tokenB] = [
        wrappedCurrency(currencyA ?? undefined, chainId),
        wrappedCurrency(currencyB ?? undefined, chainId),
      ];
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency =
          dependentField === Field.CURRENCY_B ? currencyB : currencyA;
        const independentPrice =
          dependentField === Field.CURRENCY_B
            ? pair.priceOf(tokenA)
            : pair.priceOf(tokenB);
        try {
          const dependentTokenAmount = independentPrice.quote(
            wrappedIndependentAmount,
            pair.chainId,
          );
          return dependentCurrency === nativeCurrency
            ? CurrencyAmount.ether(dependentTokenAmount.raw, chainIdToUse)
            : dependentTokenAmount;
        } catch (error) {
          // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
          console.debug('Failed to quote amount', error);
        }
      }
      return undefined;
    } else {
      return undefined;
    }
  }, [
    noLiquidity,
    independentAmount,
    otherTypedValue,
    currencies,
    dependentField,
    chainIdToUse,
    chainId,
    currencyA,
    currencyB,
    pair,
    nativeCurrency,
  ]);
  const parsedAmounts: {
    [field in Field]: CurrencyAmount | undefined;
  } = useMemo(() => {
    return {
      [Field.CURRENCY_A]:
        independentField === Field.CURRENCY_A
          ? independentAmount
          : dependentAmount,
      [Field.CURRENCY_B]:
        independentField === Field.CURRENCY_A
          ? dependentAmount
          : independentAmount,
    };
  }, [dependentAmount, independentAmount, independentField]);

  const price = useMemo(() => {
    if (noLiquidity) {
      const {
        [Field.CURRENCY_A]: currencyAAmount,
        [Field.CURRENCY_B]: currencyBAmount,
      } = parsedAmounts;
      if (currencyAAmount && currencyBAmount) {
        return new Price(
          currencyAAmount.currency,
          currencyBAmount.currency,
          currencyAAmount.raw,
          currencyBAmount.raw,
        );
      }
      return undefined;
    } else {
      const wrappedCurrencyA = wrappedCurrency(currencyA ?? undefined, chainId);
      return pair && wrappedCurrencyA
        ? pair.priceOf(wrappedCurrencyA)
        : undefined;
    }
  }, [chainId, currencyA, noLiquidity, pair, parsedAmounts]);

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const {
      [Field.CURRENCY_A]: currencyAAmount,
      [Field.CURRENCY_B]: currencyBAmount,
    } = parsedAmounts;
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyAAmount, chainId),
      wrappedCurrencyAmount(currencyBAmount, chainId),
    ];
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB);
    } else {
      return undefined;
    }
  }, [parsedAmounts, chainId, pair, totalSupply]);

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(
        liquidityMinted.raw,
        totalSupply.add(liquidityMinted).raw,
      );
    } else {
      return undefined;
    }
  }, [liquidityMinted, totalSupply]);

  let error: string | undefined;
  if (!account) {
    error = 'Connect Wallet';
  }

  if (pairState === PairState.INVALID) {
    error = error ?? 'Invalid pair';
  }

  if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
    error = error ?? 'Enter an amount';
  }

  const {
    [Field.CURRENCY_A]: currencyAAmount,
    [Field.CURRENCY_B]: currencyBAmount,
  } = parsedAmounts;

  if (
    currencyAAmount &&
    currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)
  ) {
    error = 'Insufficient ' + currencies[Field.CURRENCY_A]?.symbol + ' balance';
  }

  if (
    currencyBAmount &&
    currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)
  ) {
    error = 'Insufficient ' + currencies[Field.CURRENCY_B]?.symbol + ' balance';
  }

  return {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  };
}

export function useMintActionHandlers(
  noLiquidity: boolean | undefined,
  chainId: ChainId,
): {
  onFieldAInput: (typedValue: string) => void;
  onFieldBInput: (typedValue: string) => void;
  onCurrencySelection: (field: Field, currency: Currency) => void;
} {
  const dispatch = useDispatch<AppDispatch>();

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY_A,
          typedValue,
          noLiquidity: noLiquidity === true,
        }),
      );
    },
    [dispatch, noLiquidity],
  );
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(
        typeInput({
          field: Field.CURRENCY_B,
          typedValue,
          noLiquidity: noLiquidity === true,
        }),
      );
    },
    [dispatch, noLiquidity],
  );

  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId:
            currency instanceof Token
              ? currency.address
              : currency === ETHER[chainId]
              ? 'ETH'
              : '',
        }),
      );
    },
    [chainId, dispatch],
  );

  return {
    onFieldAInput,
    onFieldBInput,
    onCurrencySelection,
  };
}
