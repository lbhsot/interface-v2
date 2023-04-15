import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ChainId } from 'sdk/uniswap';

export type ApolloChainMap = Readonly<
  {
    [chainId in ChainId]: ApolloClient<NormalizedCacheObject>;
  }
>;

export const clientV2: ApolloChainMap = {
  [ChainId.ZK_ERA]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_V2_137_API_URL,
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.ZK_ERA_TESTNET]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_V2_280_API_URL,
    }),
    cache: new InMemoryCache(),
  }),
};

export const clientV3: ApolloChainMap = {
  [ChainId.ZK_ERA]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_V3_137_API_URL,
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.ZK_ERA_TESTNET]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_V3_137_API_URL,
    }),
    cache: new InMemoryCache(),
  }),
};

export const farmingClient: ApolloChainMap = {
  [ChainId.ZK_ERA]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_V3_FARMING_API_137_URL,
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.ZK_ERA_TESTNET]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_V3_FARMING_API_137_URL,
    }),
    cache: new InMemoryCache(),
  }),
};

export const txClient: ApolloChainMap = {
  [ChainId.ZK_ERA]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_V2_137_API_URL,
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.ZK_ERA_TESTNET]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_V2_280_API_URL,
    }),
    cache: new InMemoryCache(),
  }),
};

export const blockClient: ApolloChainMap = {
  [ChainId.ZK_ERA]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_V2_137_API_URL,
    }),
    cache: new InMemoryCache(),
  }),
  [ChainId.ZK_ERA_TESTNET]: new ApolloClient({
    link: new HttpLink({
      uri: process.env.REACT_APP_GRAPH_V2_280_API_URL,
    }),
    cache: new InMemoryCache(),
  }),
};

export const lensClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.REACT_APP_LENS_API_URL,
  }),
  cache: new InMemoryCache(),
});
