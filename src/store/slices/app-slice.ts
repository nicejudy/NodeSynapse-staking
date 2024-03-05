import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingContract, TimeTokenContract, OracleContract, LpReserveContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice } from "../../helpers";
import { RootState } from "../store";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        const addresses = getAddresses(networkID);

        const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
        const ethUsdcContract = new ethers.Contract(addresses.ETH_PAIR, LpReserveContract, provider);
        const timeContract = new ethers.Contract(addresses.NS_ADDRESS, TimeTokenContract, provider);

        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;

        const reserves = await ethUsdcContract.getReserves();
        const ethPrice = (reserves[0] / reserves[1]) * 10 ** 12;

        const marketPrice = (await getMarketPrice(networkID, provider)) * ethPrice;

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
