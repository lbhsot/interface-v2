import { ChainId } from 'sdk/uniswap';
import { createStore, Store } from 'redux';
import { addTransaction } from './actions';
import reducer, { initialState, TransactionState } from './reducer';
import { DEFAULT_CHAIN_ID } from '../../sdk/uniswap/constants';

describe('transaction reducer', () => {
  let store: Store<TransactionState>;

  beforeEach(() => {
    store = createStore(reducer, initialState);
  });

  describe('addTransaction', () => {
    it('adds the transaction', () => {
      const beforeTime = new Date().getTime();
      store.dispatch(
        addTransaction({
          chainId: DEFAULT_CHAIN_ID,
          summary: 'hello world',
          hash: '0x0',
          approval: { tokenAddress: 'abc', spender: 'def' },
          from: 'abc',
        }),
      );
      const txs = store.getState();
      expect(txs[DEFAULT_CHAIN_ID]).toBeTruthy();
      expect(txs[DEFAULT_CHAIN_ID]?.['0x0']).toBeTruthy();
      const tx = txs[DEFAULT_CHAIN_ID]?.['0x0'];
      expect(tx).toBeTruthy();
      expect(tx?.hash).toEqual('0x0');
      expect(tx?.summary).toEqual('hello world');
      expect(tx?.approval).toEqual({ tokenAddress: 'abc', spender: 'def' });
      expect(tx?.from).toEqual('abc');
      expect(tx?.addedTime).toBeGreaterThanOrEqual(beforeTime);
    });
  });
});
