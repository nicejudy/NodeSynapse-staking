import "@rainbow-me/rainbowkit/styles.css";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { configureChains, createClient } from "wagmi";
import { arbitrum, arbitrumGoerli, avalanche, boba, fantom, goerli, mainnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import BaseETHIcon from "src/assets/icons/ethereum.png";

export const { chains, provider, webSocketProvider } = configureChains(
  [
    {
      id: 1,
      network: "ethereum",
      name: "Ethereum",
      iconUrl: BaseETHIcon,
      nativeCurrency: { name: "Base", symbol: "ETH", decimals: 18 },
      rpcUrls: {
        default: {
          http: ["https://ethereum-rpc.publicnode.com"],
        },
        public: {
          http: ["https://ethereum-rpc.publicnode.com"],
        },
      },
      blockExplorers: {
        blockscout: {
          name: "Ethscout",
          url: "https://eth.blockscout.com",
        },
        default: {
          name: "Etherscan",
          url: "https://etherscan.io",
        },
        etherscan: {
          name: "Etherscan",
          url: "https://etherscan.io",
        },
      },
      contracts: {
        multicall3: {
          address: "0xca11bde05977b3631167028862be2a173976ca11",
          blockCreated: 5022,
        },
      },
    }
  ],
  [
    // jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) }),
    jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default.http[0] }) }),
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ],
);

const needsInjectedWalletFallback =
  typeof window !== "undefined" && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet;

const walletConnectProjectId = Environment.getWalletConnectProjectId() as string;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId: walletConnectProjectId, chains, shimDisconnect: true }),
      braveWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ projectId: walletConnectProjectId, chains }),
      walletConnectWallet({ projectId: walletConnectProjectId, chains }),
      coinbaseWallet({ appName: "UniCow", chains }),
      rabbyWallet({ chains, shimDisconnect: true }),
      okxWallet({ projectId: walletConnectProjectId, chains }),
      ...(needsInjectedWalletFallback ? [injectedWallet({ chains, shimDisconnect: true })] : []),
    ],
  },
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
