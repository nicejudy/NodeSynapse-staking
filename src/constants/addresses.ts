import { NetworkId } from "src/constants";

export type AddressMap = Partial<Record<NetworkId, string>>;

export const MILK_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x38d54A4060F14686eD6a07baEa3AECb4AeCE98FB",
  [NetworkId.BASE]: "0x117908E5fbC5F77DAF07D4263bA79eE810b092f4",
};

export const NFT_MANAGER = {
  [NetworkId.TESTNET_GOERLI]: "0x93036972dC138A4cc39b5B3a52b3737552D22007",
  [NetworkId.BASE]: "0x51403ED41C73174effc541Cc7bBF783B6602D2ca",
};

export const MILK_ETH_LP_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x935770eBE6E046c7775A0CAa06E45Bc6a3aF367b",
  [NetworkId.BASE]: "0x3cd93aa08f1a67d4e5f17011eb0d749596292d71",
};

export const BUY_LINK = {
  [NetworkId.TESTNET_GOERLI]: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=",
  [NetworkId.BASE]: "https://baseswap.fi/basicswap?inputCurrency=ETH&outputCurrency=",
};

export const MULTICALL_ADDRESS = {
  [NetworkId.TESTNET_GOERLI]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [NetworkId.BASE]: "0x53e5228054875Ecd43e5B9ecDDA0E992A169c89e",
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const RPC_URL = "https://rpc.cryptotigernode.club/v1/mainnet";

export const WETH_ADDRESSES = {
  [NetworkId.BASE]: "0x4200000000000000000000000000000000000006",
};

export const NS_ADDRESS = {
  [NetworkId.MAINNET]: "0x30672AE2680c319ec1028B69670A4a786baA0f35",
};

export const STAKING_ADDRESS = {
  [NetworkId.MAINNET]: "0x704fd8E6DfC178E4F9a2aF480F819e99bbdbb96b",
};

export const ORACLE_ADDRESS = {
  [NetworkId.MAINNET]: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
};

export const PAIR_ADDRESS = {
  [NetworkId.MAINNET]: "0xCF55bd6BD63Ba915A18cdd91B13882f517DA207a",
};

export const ETH_PAIR = {
  [NetworkId.MAINNET]: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
};
