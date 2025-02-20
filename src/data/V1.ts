import { AddressZero } from '@ethersproject/constants';
import {
  BigintIsh,
  Currency,
  CurrencyAmount,
  currencyEquals,
  ETHER,
  JSBI,
  Pair,
  Percent,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WETH,
} from 'sdk/uniswap';
import { useMemo } from 'react';
import { useActiveWeb3React } from 'hooks';
import { useAllTokens } from 'hooks/Tokens';
import { useV1FactoryContract } from 'hooks/useContract';
import { Version } from 'hooks/useToggledVersion';
import {
  NEVER_RELOAD,
  useSingleCallResult,
  useSingleContractMultipleData,
} from 'state/multicall/hooks';
import { useTokenBalances } from 'state/wallet/hooks';

export function useV1ExchangeAddress(
  tokenAddress?: string,
): string | undefined {
  const contract = useV1FactoryContract();

  const inputs = useMemo(() => [tokenAddress], [tokenAddress]);
  return useSingleCallResult(contract, 'getExchange', inputs)?.result?.[0];
}

export class MockV1Pair extends Pair {
  constructor(etherAmount: BigintIsh, tokenAmount: TokenAmount) {
    super(
      tokenAmount,
      new TokenAmount(WETH[tokenAmount.token.chainId], etherAmount),
    );
  }
}

// returns all v1 exchange addresses in the user's token list
export function useAllTokenV1Exchanges(): { [exchangeAddress: string]: Token } {
  const allTokens = useAllTokens();
  const factory = useV1FactoryContract();
  const args = useMemo(
    () => Object.keys(allTokens).map((tokenAddress) => [tokenAddress]),
    [allTokens],
  );

  const data = useSingleContractMultipleData(
    factory,
    'getExchange',
    args,
    NEVER_RELOAD,
  );

  return useMemo(
    () =>
      data?.reduce<{ [exchangeAddress: string]: Token }>(
        (memo, { result }, ix) => {
          if (result?.[0] && result[0] !== AddressZero) {
            memo[result[0]] = allTokens[args[ix][0]];
          }
          return memo;
        },
        {},
      ) ?? {},
    [allTokens, args, data],
  );
}

// returns whether any of the tokens in the user's token list have liquidity on v1
export function useUserHasLiquidityInAllTokens(): boolean | undefined {
  const { account, chainId } = useActiveWeb3React();

  const exchanges = useAllTokenV1Exchanges();

  const v1ExchangeLiquidityTokens = useMemo(
    () =>
      chainId
        ? Object.keys(exchanges).map(
            (address) =>
              new Token(chainId, address, 18, 'UNI-V1', 'Uniswap V1'),
          )
        : [],
    [chainId, exchanges],
  );

  const balances = useTokenBalances(
    account ?? undefined,
    v1ExchangeLiquidityTokens,
  );

  return useMemo(
    () =>
      Object.keys(balances).some((tokenAddress) => {
        const b = balances[tokenAddress]?.raw;
        return b && JSBI.greaterThan(b, JSBI.BigInt(0));
      }),
    [balances],
  );
}

export function getTradeVersion(trade?: Trade): Version | undefined {
  const isV1 = trade?.route?.pairs?.some((pair) => pair instanceof MockV1Pair);
  if (isV1) return Version.v1;
  if (isV1 === false) return Version.v2;
  return undefined;
}

// returns the v1 exchange against which a trade should be executed
export function useV1TradeExchangeAddress(
  trade: Trade | undefined,
): string | undefined {
  const tokenAddress: string | undefined = useMemo(() => {
    if (!trade) return undefined;
    const isV1 = getTradeVersion(trade) === Version.v1;
    if (!isV1) return undefined;
    return trade.inputAmount instanceof TokenAmount
      ? trade.inputAmount.token.address
      : trade.outputAmount instanceof TokenAmount
      ? trade.outputAmount.token.address
      : undefined;
  }, [trade]);
  return useV1ExchangeAddress(tokenAddress);
}

const ZERO_PERCENT = new Percent('0');
const ONE_HUNDRED_PERCENT = new Percent('1');

// returns whether tradeB is better than tradeA by at least a threshold percentage amount
export function isTradeBetter(
  tradeA: Trade | undefined,
  tradeB: Trade | undefined,
  minimumDelta: Percent = ZERO_PERCENT,
): boolean | undefined {
  if (tradeA && !tradeB) return false;
  if (tradeB && !tradeA) return true;
  if (!tradeA || !tradeB) return undefined;

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !currencyEquals(tradeB.outputAmount.currency, tradeB.outputAmount.currency)
  ) {
    throw new Error('Trades are not comparable');
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice);
  } else {
    return tradeA.executionPrice.raw
      .multiply(minimumDelta.add(ONE_HUNDRED_PERCENT))
      .lessThan(tradeB.executionPrice);
  }
}
