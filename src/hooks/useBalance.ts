import { useQueries, UseQueryResult } from "@tanstack/react-query";
import { NetworkId } from "src/constants";
import { AddressMap } from "src/constants/addresses";
import { DecimalBigNumber } from "src/helpers/DecimalBigNumber/DecimalBigNumber";
import { nonNullable } from "src/helpers/types/nonNullable";
import { useMultipleTokenContracts } from "src/hooks/useContract";
import { useAccount } from "wagmi";

export const balanceQueryKey = (address?: string, tokenAddressMap?: AddressMap, networkId?: NetworkId) =>
  ["useBalance", address, tokenAddressMap, networkId].filter(nonNullable);

/**
 * Returns a balance.
 * @param addressMap Address map of the token you want the balance of.
 */
export const useBalance = <TAddressMap extends AddressMap = AddressMap>(tokenAddressMap: TAddressMap) => {
  const { address = "" } = useAccount();
  const contracts = useMultipleTokenContracts(tokenAddressMap);

  const networkIds = Object.keys(tokenAddressMap).map(Number);

  const results = useQueries({
    queries: networkIds.map(networkId => ({
      queryKey: [balanceQueryKey(address, tokenAddressMap, networkId)],
      enabled: !!address,

      queryFn: async () => {
        const contract = contracts[networkId as NetworkId];
        console.debug("Refetching balance");
        const [balance, decimals] = await Promise.all([contract.balanceOf(address), contract.decimals()]);

        return new DecimalBigNumber(balance, decimals);
      },
    })),
  });

  return networkIds.reduce(
    (prev, networkId, index) => Object.assign(prev, { [networkId]: results[index] }),
    {} as Record<keyof typeof tokenAddressMap, UseQueryResult<DecimalBigNumber, Error>>,
  );
};
