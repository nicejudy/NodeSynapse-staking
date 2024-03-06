import { BaseProvider, JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { DIAMOND_AMOUNT, GOLD_AMOUNT, PLANTIUM_AMOUNT } from "src/constants";
import { NFT_MANAGER } from "src/constants/addresses";
import { multicall } from "src/helpers/multicall";
import { NetworkId } from "src/networkDetails";
import { NftManagerContract__factory } from "src/typechain";

interface ILoadAccountDetails {
  address: string;
  networkID: NetworkId;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface INftInfoDetails {
  id: number;
  owner: string;
  level: number;
  rewardRate: number;
  totalStakers: number;
  totalStakedAmount: string;
  nftLastProcessingTimestamp: number;
  totalClaimed?: number;
}

export const loadAccountDetails = async ({ networkID, provider, address }: ILoadAccountDetails) => {
  const nftManagerContract = new ethers.Contract(
    NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
    NftManagerContract__factory.abi,
    provider,
  );

  const calls_nft0 = [
    {
      address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      name: "getOwnedNFTIdsOf",
      params: [address],
    },
  ];

  const [nftIds] = await multicall(NftManagerContract__factory.abi as any, calls_nft0);

  const nftIdsAsString = [];

  for (let i = 0; i < nftIds.length; i++) {
    nftIdsAsString.push(nftIds[i].toString());
  }

  return {
    nfts: nftIdsAsString,
  };
};

interface ILoadIdDetails {
  networkID: NetworkId;
  id: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider | BaseProvider;
}

interface ILoadUserInfoDetails {
  networkID: NetworkId;
  id: string;
  address: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider | BaseProvider;
}

export const loadOwnerDetails = async ({ networkID, id }: ILoadIdDetails) => {
  const calls_nft0 = [
    {
      address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      name: "ownerOf",
      params: [id],
    },
  ];

  const [[owner]] = await multicall(NftManagerContract__factory.abi as any, calls_nft0);

  return {
    owner: owner,
  };
};

export const loadImageDetails = async ({ networkID, id, provider }: ILoadIdDetails) => {
  const calls_nft0 = [
    {
      address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      name: "tokenURI",
      params: [id],
    },
  ];

  const [tokenURI] = await multicall(NftManagerContract__factory.abi as any, calls_nft0, networkID, provider);
  const data = JSON.parse(atob(tokenURI.toString().split(",")[1]));

  return {
    name: data.name,
    description: data.description,
    image: data.image,
  };
};

export const loadUserInfoDetails = async ({ networkID, id, address, provider }: ILoadUserInfoDetails) => {
  const calls_nft0 = [
    {
      address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      name: "userInfo",
      params: [id, address],
    },
  ];

  const [userInfo] = await multicall(NftManagerContract__factory.abi as any, calls_nft0, networkID, provider);
  const stakedAmount = userInfo[1] / Math.pow(10, 18);
  const lastProcessingTimestamp = userInfo[0].toNumber();
  const rewardRate = getUserRewardRate(stakedAmount);
  const pendingReward = getPendingReward(stakedAmount, rewardRate, lastProcessingTimestamp, false);

  return {
    stakedAmount,
    lastProcessingTimestamp,
    pendingReward,
  };
};

export const getPendingReward = (stakedAmount: number, rewardRate: number, lastTimestamp: number, isOwner: boolean) => {
  const dividerValue = isOwner ? 8640000 : 100000000000;
  return (stakedAmount * rewardRate * (Date.now() / 1000 - lastTimestamp)) / dividerValue;
};

export const loadIdDetails = async ({ networkID, id, provider }: ILoadIdDetails) => {
  const calls_nft0 = [
    {
      address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      name: "getNFTsByIds",
      params: [[id]],
    },
    {
      address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      name: "getUsersOf",
      params: [id],
    },
    {
      address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
      name: "ownerOf",
      params: [id],
    },
  ];

  const [nftData, users, owner] = await multicall(
    NftManagerContract__factory.abi as any,
    calls_nft0,
    networkID,
    provider,
  );
  const totalStakedAmount = nftData[0][0];

  const nft: INftInfoDetails = {
    id: Number(id),
    owner: owner[0],
    level: getLevelAndRate(parseInt(ethers.utils.formatUnits(totalStakedAmount.amount, "ether")))[0],
    rewardRate: getUserRewardRate(parseInt(ethers.utils.formatUnits(totalStakedAmount.amount, "ether"))),
    totalStakers: users[0].length,
    totalStakedAmount: ethers.utils.formatUnits(totalStakedAmount.amount, "ether"),
    totalClaimed: 0,
    nftLastProcessingTimestamp: parseInt(totalStakedAmount.lastProcessingTimestamp),
  };

  return {
    nfts: nft,
  };
};

export function getLevelAndRate(stakedAmount: number) {
  if (stakedAmount >= DIAMOND_AMOUNT) {
    return [3, 4051, 5787]; // DIAMOND 0.35% 0.5%
  } else if (stakedAmount >= PLANTIUM_AMOUNT) {
    return [2, 3704, 3472]; // PLANTIUM 0.32% 0.3%
  } else if (stakedAmount >= GOLD_AMOUNT) {
    return [1, 3356, 1157]; // GOLD 0.29% 0.1%
  } else {
    return [0, 2894, 0]; // COMMON 0.25% 0%
  }
}

export function getUserRewardRate(stakedAmount: number) {
  if (stakedAmount >= 20000) {
    return 28935; // 2.5%
  } else if (stakedAmount >= 5000) {
    return 26620; // 2.3%
  } else if (stakedAmount >= 1000) {
    return 24305; // 2.1%
  } else {
    return 23148; // 2.0%
  }
}
