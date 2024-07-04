import { Web3Auth, Web3AuthOptions } from '@web3auth/modal';
import { SolanaPrivateKeyProvider } from '@web3auth/solana-provider';
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from '@web3auth/base';
import { getDefaultExternalAdapters } from '@web3auth/default-solana-adapter';

const mainnetChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: '0x1',
  rpcTarget: 'https://fluent-aged-putty.solana-mainnet.quiknode.pro/ece7111420081e8ac46a76b2f2a93b2d4dc1367e',
  // rpcTarget: 'https://api.mainnet-beta.solana.com',
  // rpcTarget: 'https://rpc.ankr.com/solana',
  displayName: 'Solana Mainnet',
  blockExplorerUrl: 'https://explorer.solana.com',
  ticker: 'SOL',
  tickerName: 'SOLANA',
  decimals: 18,
  logo: 'https://images.toruswallet.io/sol.svg',
};

// const testnetChainConfig = {
//   chainId: '0x2',
//   displayName: 'Solana Testnet',
//   chainNamespace: CHAIN_NAMESPACES.SOLANA,
//   tickerName: 'SOLANA',
//   ticker: 'SOL',
//   decimals: 18,
//   rpcTarget: 'https://api.testnet.solana.com',
//   blockExplorerUrl: 'https://explorer.solana.com/?cluster=testnet',
//   logo: 'https://images.toruswallet.io/sol.svg',
// };

const devChainConfig = {
  chainId: '0x3',
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  rpcTarget: 'https://api.testnet.solana.com',
  tickerName: 'SOLANA',
  displayName: 'Solana Devnet',
  ticker: 'SOL',
  decimals: 18,
  blockExplorerUrl: 'https://explorer.solana.com/?cluster=testnet',
  logo: 'https://images.toruswallet.io/sol.svg',
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: {
    chainConfig: import.meta.env.VITE_ENV === 'dev' ? devChainConfig : mainnetChainConfig,
  },
});

const web3AuthOptions: Web3AuthOptions = {
  clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
  web3AuthNetwork:
    import.meta.env.VITE_ENV === 'dev' ? WEB3AUTH_NETWORK.SAPPHIRE_DEVNET : WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
  uiConfig: {
    appName: 'OFAI',
    mode: 'dark',
    theme: {
      primary: '#FF00FF',
    },
    loginMethodsOrder: ['google', 'apple', 'facebook', 'twitter'],
    modalZIndex: '9999999',
  },
  sessionTime: 86400 * 7,
};

export const web3auth = new Web3Auth(web3AuthOptions);

getDefaultExternalAdapters({ options: web3AuthOptions }).then((adapters) => {
  adapters.forEach((adapter) => {
    web3auth.configureAdapter(adapter);
  });
});
