import { Signer, ethers } from "ethers";
// import { getAddresses } from "../../constants";
import { StakingHelperContract, TimeTokenContract, MemoTokenContract, StakingContract } from "src/abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, loadAccountDetails } from "./AccountSlice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
// import { Networks } from "../../constants/blockchain";
// import { warning, success, info, error } from "../../store/slices/messages-slice";
import { messages } from "src/constants/messages";
import { toast } from "react-hot-toast";
import { getGasPrice } from "src/helpers/get-gas-price";
import { metamaskErrorWrap } from "src/helpers/metamask-error-wrap";
import { sleep } from "src/helpers/sleep";
import { loadAppDetails } from "./AppSlice";
import { NetworkId } from "src/networkDetails";
import { NS_ADDRESS, STAKING_ADDRESS } from "src/constants/addresses";

interface IChangeApproval {
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    signer: Signer;
    address: string;
    value: string;
    networkID: NetworkId;
}

export const changeApproval = createAsyncThunk("stake/changeApproval", async ({ provider, signer, address, value, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
        toast.error(messages.please_connect_wallet);
        return;
    }

    // const signer = provider.getSigner();
    const timeContract = new ethers.Contract(NS_ADDRESS[networkID as keyof typeof NS_ADDRESS], TimeTokenContract, signer);

    let approveTx;
    try {
        // const gasPrice = await getGasPrice(provider);

        approveTx = await timeContract.approve(STAKING_ADDRESS[networkID as keyof typeof STAKING_ADDRESS], ethers.utils.parseUnits(value, "gwei"));

        const text = "Approve Staking";
        const pendingTxnType = "approve_staking";

        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        toast.success(messages.tx_successfully_send);
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (approveTx) {
            dispatch(clearPendingTxn(approveTx.hash));
        }
    }

    await sleep(2);

    const stakeAllowance = await timeContract.allowance(address, STAKING_ADDRESS[networkID as keyof typeof STAKING_ADDRESS]);

    return dispatch(
        fetchAccountSuccess({
            allowance: {
                time: Number(stakeAllowance),
            },
        }),
    );
});

interface IChangeStake {
    action: string;
    value: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    signer: Signer;
    address: string;
    networkID: NetworkId;
}

export const changeStake = createAsyncThunk("stake/changeStake", async ({ action, value, provider, signer, address, networkID }: IChangeStake, { dispatch }) => {
    if (!provider) {
        toast.error(messages.please_connect_wallet);
        return;
    }

    // const signer = provider.getSigner();
    const staking = new ethers.Contract(STAKING_ADDRESS[networkID as keyof typeof STAKING_ADDRESS], StakingContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "stake") {
            stakeTx = await staking.deposit(ethers.utils.parseUnits(value, "gwei"));
        } else {
            stakeTx = await staking.withdraw(ethers.utils.parseUnits(value, "gwei"));
        }
        const pendingTxnType = action === "stake" ? "staking" : "unstaking";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        await stakeTx.wait();
        toast.success(messages.tx_successfully_send);
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    toast.success(messages.your_data_update_soon);
    await sleep(5);
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    toast.success(messages.your_data_updated);
    return;
});

interface IChangeClaim {
    action: string;
    provider: StaticJsonRpcProvider | JsonRpcProvider;
    signer: Signer;
    address: string;
    networkID: NetworkId;
}

export const changeClaim = createAsyncThunk("stake/changeClaim", async ({ action, provider, signer, address, networkID }: IChangeClaim, { dispatch }) => {
    if (!provider) {
        toast.error(messages.please_connect_wallet);
        return;
    }
    // const addresses = getAddresses(networkID);
    // const signer = provider.getSigner();
    const staking = new ethers.Contract(STAKING_ADDRESS[networkID as keyof typeof STAKING_ADDRESS], StakingContract, signer);

    let stakeTx;

    try {
        const gasPrice = await getGasPrice(provider);

        if (action === "compound") {
            stakeTx = await staking.compound("0");
        } else {
            stakeTx = await staking.claim();
        }
        const pendingTxnType = action === "compound" ? "compounding" : "claiming";
        dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
        await stakeTx.wait();
        toast.success(messages.tx_successfully_send);
    } catch (err: any) {
        return metamaskErrorWrap(err, dispatch);
    } finally {
        if (stakeTx) {
            dispatch(clearPendingTxn(stakeTx.hash));
        }
    }
    toast.success(messages.your_data_update_soon);
    await sleep(5);
    await dispatch(loadAppDetails({ networkID, provider }));
    await dispatch(loadAccountDetails({ networkID, provider, address }));
    toast.success(messages.your_data_updated);
    return;
});
