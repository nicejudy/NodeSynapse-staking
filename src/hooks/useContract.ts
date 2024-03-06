/**
 * @deprecated
 * author: Sam Potter
 *
 * These contract hooks are no longer necessary. Rather than creating a new hook
 * below, please instead add that contract to the `src/constants/contracts` file
 * instead (or `src/contracts/tokens` if the contract is an ERC20 or LP token).
 *
 * You will be then be able to call `getEthersContract` wherever you need
 * throughout our entire app (including inside our components).
 */

import { Contract, ContractInterface } from "@ethersproject/contracts";
import { useMemo } from "react";
import FUSE_PROXY_ABI from "src/abi/FuseProxy.json";
import IERC20_ABI from "src/abi/IERC20.json";
import { AddressMap } from "src/constants/addresses";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { NetworkId } from "src/networkDetails";
import {
  FuseProxy,
  IERC20,
} from "src/typechain";
import { useNetwork, useProvider, useSigner } from "wagmi";

/**
 * @deprecated Please see note at the top of this file
 *
 * Helper function to create a static contract hook.
 * Static contracts require an explicit network id to be given as an argument.
 */
export const createStaticContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (address: string, networkId: NetworkId) => {
    const provider = Providers.getStaticProvider(networkId);

    return useMemo(() => new Contract(address, ABI, provider) as TContract, [address, provider]);
  };
};

/**
 * @deprecated Please see note at the top of this file
 *
 * Helper function to create a dynamic contract hook.
 * Dynamic contracts use the provider/signer injected by the users wallet.
 * Since a wallet can be connected to any network, a dynamic contract hook
 * can possibly return null if there is no contract address specified for
 * the currently active network.
 */
const createDynamicContract = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return (addressMap: AddressMap, asSigner = false) => {
    const provider = useProvider();
    const { data: signer } = useSigner();
    const { chain = { id: 8453 } } = useNetwork();

    return useMemo(() => {
      const address = addressMap[chain.id as keyof typeof addressMap];

      if (!address) return null;

      const providerOrSigner = asSigner && signer ? signer : provider;

      return new Contract(address, ABI, providerOrSigner) as TContract;
    }, [addressMap, chain.id, asSigner, signer, provider]);
  };
};

/**
 * @deprecated Please see note at the top of this file
 *
 * Hook that returns a contract for every network in an address map
 */
export const createMultipleStaticContracts = <TContract extends Contract = Contract>(ABI: ContractInterface) => {
  return <TAddressMap extends AddressMap = AddressMap>(addressMap: TAddressMap) => {
    return useMemo(() => {
      return Object.entries(addressMap).reduce((res, [networkId, address]) => {
        const _networkId = Number(networkId) as NetworkId;
        const provider = Providers.getStaticProvider(_networkId);
        const contract = new Contract(address, ABI, provider) as TContract;

        return Object.assign(res, { [networkId]: contract });
      }, {} as Record<keyof typeof addressMap, TContract>);
    }, [addressMap]);
  };
};

// Static contracts
export const useStaticFuseContract = createStaticContract<FuseProxy>(FUSE_PROXY_ABI.abi);

// Dynamic contracts
export const useDynamicTokenContract = createDynamicContract<IERC20>(IERC20_ABI.abi);

// Multiple static contracts
export const useMultipleTokenContracts = createMultipleStaticContracts<IERC20>(IERC20_ABI.abi);
