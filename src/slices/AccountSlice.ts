import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ethers } from "ethers";
import { MILK_ADDRESSES, NFT_MANAGER, NS_ADDRESS, STAKING_ADDRESS } from "src/constants/addresses";
import { setAll } from "src/helpers";
import { multicall } from "src/helpers/multicall";
import { NetworkId } from "src/networkDetails";
import { IBaseAddressAsyncThunk } from "src/slices/interfaces";
import { getLevelAndRate, getUserRewardRate } from "src/slices/search-slice";
import { RootState } from "src/store";
import { StakingContract, TimeTokenContract } from "src/abi";

interface IGetBalances {
  address: string;
  networkID: NetworkId;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
  balances: {
      time: string;
  };
}

interface ILoadAccountDetails {
  address: string;
  networkID: NetworkId;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IUserAccountDetails {
  balances: {
      time: number;
  };
  allowance: {
      time: number;
  };
  staking: {
      time: number;
      reward: number;
      unlockTime: number;
  };
}

export const loadAccountDetails = createAsyncThunk("account/loadAccountDetails", async ({ networkID, provider, address }: ILoadAccountDetails): Promise<IUserAccountDetails> => {
  // const addresses = getAddresses(networkID);

  const timeContract = new ethers.Contract(NS_ADDRESS[networkID as keyof typeof NS_ADDRESS], TimeTokenContract, provider);
  const stakingContract = new ethers.Contract(STAKING_ADDRESS[networkID as keyof typeof STAKING_ADDRESS], StakingContract, provider);

  const timeBalance = (await timeContract.balanceOf(address)) / 10 ** 9;
  const stakeAllowance = (await timeContract.allowance(address, STAKING_ADDRESS[networkID as keyof typeof STAKING_ADDRESS])) / 10 ** 9;
  const reward = (await stakingContract.withdrawableDividendOf(address)) / 10 ** 18;
  const stakeBalance = (await stakingContract.holderBalance(address)) / 10 ** 9;
  const unlockTime = (await stakingContract.holderUnlockTime(address)) * 1;

  return {
      balances: {
          time: timeBalance,
      },
      allowance: {
          time: stakeAllowance,
      },
      staking: {
          time: stakeBalance,
          reward,
          unlockTime,
      },
  };
});

export interface IAccountSlice {
  balances: {
      time: number;
  };
  allowance: {
      time: number;
  };
  loading: boolean;
  staking: {
      time: number;
      reward: number;
      unlockTime: number;
  };
}

const initialState: IAccountSlice = {
  loading: true,
  balances: { time: 0 },
  allowance: { time: 0 },
  staking: { time: 0, reward: 0, unlockTime: 0 },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
      fetchAccountSuccess(state, action) {
          setAll(state, action.payload);
      },
  },
  extraReducers: builder => {
      builder
          .addCase(loadAccountDetails.pending, state => {
              state.loading = true;
          })
          .addCase(loadAccountDetails.fulfilled, (state, action) => {
              setAll(state, action.payload);
              state.loading = false;
          })
          .addCase(loadAccountDetails.rejected, (state, { error }) => {
              state.loading = false;
              console.log(error);
          })
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);

