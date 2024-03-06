import { isChainEthereum } from "src/helpers";
import { useNetwork } from "wagmi";

import { useAppSelector } from ".";

export const useOldAssetsDetected = () => {
  const { chain = { id: 8453 } } = useNetwork();

  return useAppSelector(state => {
    if (chain.id && isChainEthereum({ chainId: chain.id, includeTestnets: true })) {
      return (
        state.account.balances &&
        (Number(state.account.balances.eth) ||
        Number(state.account.balances.milk)
          ? true
          : false)
      );
    } else {
      return false;
    }
  });
};
