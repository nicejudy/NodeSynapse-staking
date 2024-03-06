import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { NFT_MANAGER } from "src/constants/addresses";
import { setAll } from "src/helpers";
import { multicall } from "src/helpers/multicall";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { getLevelAndRate } from "src/slices/search-slice";
import { RootState } from "src/store";
import { NftManagerContract__factory } from "src/typechain";

export const galleryDetails = createAsyncThunk(
  "app/galleryDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const calls_nft_supply = [
      {
        address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
        name: "totalSupply",
      },
    ];

    const [[nftMintedSupply]] = await multicall(
      NftManagerContract__factory.abi as any,
      calls_nft_supply,
      networkID,
      provider,
    );

    const nfts = [];
    const calls_nft = [];
    const ids = Array.from({ length: nftMintedSupply }, (_, i) => i + 1);
    calls_nft.push(
      {
        address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
        name: "getNFTsByIds",
        params: [ids],
      },
      {
        address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
        name: "getUsersOf",
        params: [ids],
      },
    );
    for (let i = 0; i < parseInt(nftMintedSupply); i++) {
      const id = i + 1;
      calls_nft.push(
        // {
        //   address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
        //   name: "getNFTsByIds",
        //   params: [[id]],
        // },
        // {
        //   address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
        //   name: "getUsersOf",
        //   params: [[id]],
        // },
        {
          address: NFT_MANAGER[networkID as keyof typeof NFT_MANAGER],
          name: "ownerOf",
          params: [id],
        },
      );
    }

    const nftData = (await multicall(
      NftManagerContract__factory.abi as any,
      calls_nft,
      networkID,
      provider,
    )) as Array<any>;

    for (let i = 0; i < nftMintedSupply; i++) {
      const id = i + 1;
      const nft = {
        id: id,
        owner: nftData[i + 2][0].toString(),
        level: getLevelAndRate(parseInt(ethers.utils.formatUnits(nftData[0][0][i].amount, "ether")))[0],
        totalStakedAmount: parseFloat(ethers.utils.formatUnits(nftData[0][0][i].amount, "ether")),
        totalStakers: parseInt(nftData[1][0][i].length),
        nftLastProcessingTimestamp: parseInt(nftData[0][0][i].lastProcessingTimestamp),
        nftLastReward: parseFloat(ethers.utils.formatUnits(nftData[0][0][i].lastReward, "ether")),
      };
      nfts.push(nft);
    }
    return {
      loading: false,
      nfts,
    } as IGalleryData;
  },
);

export interface IGalleryData {
  loading: boolean;
  nfts: INftItem[];
}

export interface INftItem {
  id: number;
  owner: string;
  level: number;
  totalStakedAmount: number;
  totalStakers: number;
  nftLastProcessingTimestamp: number;
  nftLastReward: number;
}

const initialState: IGalleryData = {
  loading: true,
  nfts: [],
};

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {
    fetchGallerySuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(galleryDetails.pending, state => {
        state.loading = true;
      })
      .addCase(galleryDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        // state.loading = false;
      })
      .addCase(galleryDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default gallerySlice.reducer;

export const { fetchGallerySuccess } = gallerySlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
