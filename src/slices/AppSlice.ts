import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { ETH_PAIR, MILK_ADDRESSES, NFT_MANAGER, NS_ADDRESS, PAIR_ADDRESS, STAKING_ADDRESS } from "src/constants/addresses";
import { getMarketValue, setAll } from "src/helpers";
import { multicall } from "src/helpers/multicall";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { RootState } from "src/store";
import { StakingContract, TimeTokenContract, LpReserveContract } from "src/abi";
import { JsonRpcProvider } from "@ethersproject/providers";

interface ILoadAppDetails {
  networkID: number;
  provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  //@ts-ignore
  async ({ networkID, provider }: ILoadAppDetails) => {

      const stakingContract = new ethers.Contract(STAKING_ADDRESS[networkID as keyof typeof STAKING_ADDRESS], StakingContract, provider);
      const ethUsdcContract = new ethers.Contract(ETH_PAIR[networkID as keyof typeof ETH_PAIR], LpReserveContract, provider);
      const timeContract = new ethers.Contract(NS_ADDRESS[networkID as keyof typeof NS_ADDRESS], TimeTokenContract, provider);
      const pairContract = new ethers.Contract(PAIR_ADDRESS[networkID as keyof typeof PAIR_ADDRESS], LpReserveContract, provider);
      const reserves_ = await pairContract.getReserves();
      const marketPrice_ = reserves_[1] / reserves_[0] / 10 ** 9;

      const currentBlock = await provider.getBlockNumber();
      const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

      const reserves = await ethUsdcContract.getReserves();
      const ethPrice = (reserves[0] / reserves[1]) * 10 ** 12;

      const marketPrice = marketPrice_ * ethPrice;

      const decimals = await timeContract.decimals();
      const totalSupply = (await timeContract.totalSupply()) / 10 ** decimals;

      const totalStaked = (await stakingContract.totalBalance()) / 10 ** decimals;
      const totalDistributed = (await stakingContract.totalDividendsDistributed()) / 10 ** 18;
      const lockDuration = await stakingContract.lockDuration();

      return {
          networkID,
          currentBlock,
          currentBlockTime,
          ethPrice,
          marketPrice,
          decimals,
          totalSupply,
          totalStaked,
          totalDistributed,
          lockDuration,
      };
  },
);

const initialState = {
  loading: true,
};

export interface IAppSlice {
  loading: boolean;
  networkID: number;
  currentBlock: number;
  currentBlockTime: number;
  ethPrice: number;
  marketPrice: number;
  decimals: number;
  totalSupply: number;
  totalStaked: number;
  totalDistributed: number;
  lockDuration: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
      fetchAppSuccess(state, action) {
          setAll(state, action.payload);
      },
  },
  extraReducers: builder => {
      builder
          .addCase(loadAppDetails.pending, (state, action) => {
              state.loading = true;
          })
          .addCase(loadAppDetails.fulfilled, (state, action) => {
              setAll(state, action.payload);
              state.loading = false;
          })
          .addCase(loadAppDetails.rejected, (state, { error }) => {
              state.loading = false;
              console.log(error);
          });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
