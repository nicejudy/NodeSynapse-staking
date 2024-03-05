import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingContract, TimeTokenContract } from "../../abi";
import { setAll } from "../../helpers";

import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { RootState } from "../store";

interface IGetBalances {
    address: string;
    networkID: Networks;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
}

interface IAccountBalances {
    balances: {
        time: string;
    };
}

export const getBalances = createAsyncThunk("account/getBalances", async ({ address, networkID, provider }: IGetBalances): Promise<IAccountBalances> => {
    const addresses = getAddresses(networkID);

    const timeContract = new ethers.Contract(addresses.TIME_ADDRESS, TimeTokenContract, provider);
    const timeBalance = await timeContract.balanceOf(address);

    return {
        balances: {
            time: ethers.utils.formatEther(timeBalance),
        },
    };
});

interface ILoadAccountDetails {
    address: string;
    networkID: Networks;
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
    const addresses = getAddresses(networkID);

    const timeContract = new ethers.Contract(addresses.NS_ADDRESS, TimeTokenContract, provider);
    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

    const timeBalance = (await timeContract.balanceOf(address)) / 10 ** 9;
    const stakeAllowance = (await timeContract.allowance(address, addresses.STAKING_ADDRESS)) / 10 ** 9;
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
            .addCase(getBalances.pending, state => {
                state.loading = true;
            })
            .addCase(getBalances.fulfilled, (state, action) => {
                setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getBalances.rejected, (state, { error }) => {
                state.loading = false;
                console.log(error);
            });
    },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
