export const mintPrice = 0.1;
export const ogPrice = 0.05;
export const whitelistedPrice = 0.08;

export const META_IMAGES = "QmZzZp2dnMB86oVLJQvnJzDT3Fvuyb39gSk6tfK4EnyHj4";

export const META_JSONS = "QmcUBHkeyh2SvVgDB3XF8AZBTNPSnw8xPUmFrtTZcMYgED";

export const ETHSCAN_URL = "https://etherscan.io/address/";

export const IMAGE_URL = "https://image.cryptotigernode.club/";

export const META_URL = "https://meta.cryptotigernode.club/";

export const OPENSEA_ITEM_URL = "https://opensea.io/assets/base/";

export const OPENSEA_COLLECTION_URL = "https://opensea.io/collection/unicow-12";

export const INVITE_LINK = "https://unicow.org/nftitem?id=";

export const MAIN_URL = "https://unicow.org/";

export const NUMBER_OF_GALLER_VISIBLE = 9;

export const START_TIME = 1696352400;

export const getValidChainId = (chainId: Number) => {
  switch (chainId) {
    case 1:
      return 1;
    case 8453:
      return 8453;
    default:
      return 1;
  }
};
