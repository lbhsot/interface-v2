import { Price, TokenAmount } from './fractions';
import invariant from 'tiny-invariant';
import JSBI from 'jsbi';
import { keccak256, pack } from '@ethersproject/solidity';
import { getCreate2Address } from '@ethersproject/address';

import {
  _1000,
  _997,
  BigintIsh,
  ChainId,
  V2_FACTORY_ADDRESSES,
  FIVE,
  INIT_CODE_HASH,
  MINIMUM_LIQUIDITY,
  ONE,
  ZERO,
  V2_BYTE_CODE_HASH,
} from '../constants';
import { computeZkSalt, getPairToken, parseBigintIsh, sqrt } from '../utils';
import {
  InsufficientInputAmountError,
  InsufficientReservesError,
} from '../errors';
import { Token } from './token';
import { ethers } from 'ethers';
import { utils as zksyncUtils } from 'zksync-web3';

let PAIR_ADDRESS_CACHE: {
  [token0Address: string]: { [token1Address: string]: string };
} = {};

export class Pair {
  public readonly liquidityToken: Token;
  private readonly tokenAmounts: [TokenAmount, TokenAmount];

  // todo fixme
  public static getPair(tokenA: Token, tokenB: Token): string {
    if (tokenA.chainId !== tokenB.chainId)
      throw new Error('INVALID TOKEN PAIR: CHAIN_ID');
    if (tokenA.address === tokenB.address)
      throw new Error('INVALID TOKEN PAIR: ADDRESS');
    if ([ChainId.ZK_ERA, ChainId.ZK_ERA_TESTNET].includes(tokenA.chainId)) {
      const abiCoder = new ethers.utils.AbiCoder();
      const salt = computeZkSalt(tokenA, tokenB);
      return zksyncUtils.create2Address(
        V2_FACTORY_ADDRESSES[tokenA.chainId],
        V2_BYTE_CODE_HASH[tokenA.chainId],
        salt,
        abiCoder.encode(
          ['address', 'address'],
          [tokenA.address, tokenB.address],
        ),
      );
    }
    return getCreate2Address(
      V2_FACTORY_ADDRESSES[tokenA.chainId],
      keccak256(
        ['bytes'],
        [pack(['address', 'address'], [tokenA.address, tokenB.address])],
      ),
      INIT_CODE_HASH,
    );
  }

  public static getAddress(tokenA: Token, tokenB: Token): string {
    const tokens = tokenA.sortsBefore(tokenB)
      ? [tokenA, tokenB]
      : [tokenB, tokenA]; // does safety checks

    if (
      PAIR_ADDRESS_CACHE?.[tokens[0].address]?.[tokens[1].address] === undefined
    ) {
      PAIR_ADDRESS_CACHE = {
        ...PAIR_ADDRESS_CACHE,
        [tokens[0].address]: {
          ...PAIR_ADDRESS_CACHE?.[tokens[0].address],
          [tokens[1].address]: Pair.getPair(tokens[0], tokens[1]),
        },
      };
    }

    return PAIR_ADDRESS_CACHE[tokens[0].address][tokens[1].address];
  }

  public constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount) {
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA];
    const token0 = tokenAmounts[0].token;
    const token1 = tokenAmounts[1].token;
    const pairTokenInfo = getPairToken(token0, token1, token0.chainId);
    this.liquidityToken = new Token(
      token0.chainId,
      Pair.getAddress(token0, token1),
      18,
      pairTokenInfo.symbol,
      pairTokenInfo.name,
    );
    this.tokenAmounts = tokenAmounts as [TokenAmount, TokenAmount];
  }

  /**
   * Returns true if the token is either token0 or token1
   * @param token to check
   */
  public involvesToken(token: Token): boolean {
    return token.equals(this.token0) || token.equals(this.token1);
  }

  /**
   * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
   */
  public get token0Price(): Price {
    return new Price(
      this.token0,
      this.token1,
      this.tokenAmounts[0].raw,
      this.tokenAmounts[1].raw,
    );
  }

  /**
   * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
   */
  public get token1Price(): Price {
    return new Price(
      this.token1,
      this.token0,
      this.tokenAmounts[1].raw,
      this.tokenAmounts[0].raw,
    );
  }

  /**
   * Return the price of the given token in terms of the other token in the pair.
   * @param token token to return price of
   */
  public priceOf(token: Token): Price {
    invariant(this.involvesToken(token), 'TOKEN');
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }

  /**
   * Returns the chain ID of the tokens in the pair.
   */
  public get chainId(): ChainId {
    return this.token0.chainId;
  }

  public get token0(): Token {
    return this.tokenAmounts[0].token;
  }

  public get token1(): Token {
    return this.tokenAmounts[1].token;
  }

  public get reserve0(): TokenAmount {
    return this.tokenAmounts[0];
  }

  public get reserve1(): TokenAmount {
    return this.tokenAmounts[1];
  }

  public reserveOf(token: Token): TokenAmount {
    invariant(this.involvesToken(token), 'TOKEN');
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  }

  public getOutputAmount(inputAmount: TokenAmount): [TokenAmount, Pair] {
    invariant(this.involvesToken(inputAmount.token), 'TOKEN');
    if (
      JSBI.equal(this.reserve0.raw, ZERO) ||
      JSBI.equal(this.reserve1.raw, ZERO)
    ) {
      throw new InsufficientReservesError();
    }
    const inputReserve = this.reserveOf(inputAmount.token);
    const outputReserve = this.reserveOf(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
    );
    const inputAmountWithFee = JSBI.multiply(inputAmount.raw, _997);
    const numerator = JSBI.multiply(inputAmountWithFee, outputReserve.raw);
    const denominator = JSBI.add(
      JSBI.multiply(inputReserve.raw, _1000),
      inputAmountWithFee,
    );
    const outputAmount = new TokenAmount(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.divide(numerator, denominator),
    );
    if (JSBI.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError();
    }
    return [
      outputAmount,
      new Pair(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
      ),
    ];
  }

  public getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pair] {
    invariant(this.involvesToken(outputAmount.token), 'TOKEN');
    if (
      JSBI.equal(this.reserve0.raw, ZERO) ||
      JSBI.equal(this.reserve1.raw, ZERO) ||
      JSBI.greaterThanOrEqual(
        outputAmount.raw,
        this.reserveOf(outputAmount.token).raw,
      )
    ) {
      throw new InsufficientReservesError();
    }

    const outputReserve = this.reserveOf(outputAmount.token);
    const inputReserve = this.reserveOf(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
    );
    const numerator = JSBI.multiply(
      JSBI.multiply(inputReserve.raw, outputAmount.raw),
      _1000,
    );
    const denominator = JSBI.multiply(
      JSBI.subtract(outputReserve.raw, outputAmount.raw),
      _997,
    );
    const inputAmount = new TokenAmount(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI.add(JSBI.divide(numerator, denominator), ONE),
    );
    return [
      inputAmount,
      new Pair(
        inputReserve.add(inputAmount),
        outputReserve.subtract(outputAmount),
      ),
    ];
  }

  public getLiquidityMinted(
    totalSupply: TokenAmount,
    tokenAmountA: TokenAmount,
    tokenAmountB: TokenAmount,
  ): TokenAmount {
    invariant(totalSupply.token.equals(this.liquidityToken), 'LIQUIDITY');
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) // does safety checks
      ? [tokenAmountA, tokenAmountB]
      : [tokenAmountB, tokenAmountA];
    invariant(
      tokenAmounts[0].token.equals(this.token0) &&
        tokenAmounts[1].token.equals(this.token1),
      'TOKEN',
    );

    let liquidity: JSBI;
    if (JSBI.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI.subtract(
        sqrt(JSBI.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)),
        MINIMUM_LIQUIDITY,
      );
    } else {
      const amount0 = JSBI.divide(
        JSBI.multiply(tokenAmounts[0].raw, totalSupply.raw),
        this.reserve0.raw,
      );
      const amount1 = JSBI.divide(
        JSBI.multiply(tokenAmounts[1].raw, totalSupply.raw),
        this.reserve1.raw,
      );
      liquidity = JSBI.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }
    if (!JSBI.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }
    return new TokenAmount(this.liquidityToken, liquidity);
  }

  public getLiquidityValue(
    token: Token,
    totalSupply: TokenAmount,
    liquidity: TokenAmount,
    feeOn = false,
    kLast?: BigintIsh,
  ): TokenAmount {
    invariant(this.involvesToken(token), 'TOKEN');
    invariant(totalSupply.token.equals(this.liquidityToken), 'TOTAL_SUPPLY');
    invariant(liquidity.token.equals(this.liquidityToken), 'LIQUIDITY');
    invariant(
      JSBI.lessThanOrEqual(liquidity.raw, totalSupply.raw),
      'LIQUIDITY',
    );

    let totalSupplyAdjusted: TokenAmount;
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      invariant(!!kLast, 'K_LAST');
      const kLastParsed = parseBigintIsh(kLast);
      if (!JSBI.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI.multiply(this.reserve0.raw, this.reserve1.raw));
        const rootKLast = sqrt(kLastParsed);
        if (JSBI.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI.multiply(
            totalSupply.raw,
            JSBI.subtract(rootK, rootKLast),
          );
          const denominator = JSBI.add(JSBI.multiply(rootK, FIVE), rootKLast);
          const feeLiquidity = JSBI.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(
            new TokenAmount(this.liquidityToken, feeLiquidity),
          );
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }

    return new TokenAmount(
      token,
      JSBI.divide(
        JSBI.multiply(liquidity.raw, this.reserveOf(token).raw),
        totalSupplyAdjusted.raw,
      ),
    );
  }
}
