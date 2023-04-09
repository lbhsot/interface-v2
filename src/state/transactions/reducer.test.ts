import { ChainId } from 'sdk/uniswap';
import { createStore, Store } from 'redux';
import { addTransaction } from './actions';
import reducer, { initialState, TransactionState } from './reducer';

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
          chainId: ChainId.MATIC,
          summary: 'hello world',
          hash: '0x0',
          approval: { tokenAddress: 'abc', spender: 'def' },
          from: 'abc',
        }),
      );
      const txs = store.getState();
      expect(txs[ChainId.MATIC]).toBeTruthy();
      expect(txs[ChainId.MATIC]?.['0x0']).toBeTruthy();
      const tx = txs[ChainId.MATIC]?.['0x0'];
      expect(tx).toBeTruthy();
      expect(tx?.hash).toEqual('0x0');
      expect(tx?.summary).toEqual('hello world');
      expect(tx?.approval).toEqual({ tokenAddress: 'abc', spender: 'def' });
      expect(tx?.from).toEqual('abc');
      expect(tx?.addedTime).toBeGreaterThanOrEqual(beforeTime);
    });
  });
});
