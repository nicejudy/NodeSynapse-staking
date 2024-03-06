import { MILK_ADDRESSES, MILK_ETH_LP_ADDRESSES, WETH_ADDRESSES } from "src/constants/addresses";
import { Token } from "src/helpers/contracts/Token";
import { NetworkId } from "src/networkDetails";
import { IERC20__factory } from "src/typechain";

export const MILK_TOKEN = new Token({
  icons: ["OHM"],
  name: "MILK",
  decimals: 18,
  addresses: MILK_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});

export const DEFAULD_NETWORK = NetworkId.MAINNET;

export const WETH_TOKEN = new Token({
  icons: ["wETH"],
  name: "WETH",
  decimals: 18,
  addresses: WETH_ADDRESSES,
  factory: IERC20__factory,
  purchaseUrl: "",
});
export const MILK_ETH_LP_TOKEN = new Token({
  decimals: 18,
  name: "MILK-ETH LP",
  icons: ["OHM", "wETH"],
  factory: IERC20__factory,
  addresses: MILK_ETH_LP_ADDRESSES,
  purchaseUrl:
    "",
});

/**
 * We have to add the custom pricing func after
 * the token has been initialised to prevent
 * circular references during initialisation.
 */
// OHM_TOKEN.customPricingFunc = async () => {
//   return OHM_DAI_BALANCER_LP_TOKEN.getPrice(NetworkId.MAINNET);
// };
