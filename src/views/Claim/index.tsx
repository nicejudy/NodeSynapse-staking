import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom, Skeleton } from "@mui/material";
import { trim } from "../../helpers";
import { useAppSelector } from "src/hooks";
import { prettifySeconds } from "src/helpers/timeUtil";
import { changeStake, changeApproval, changeClaim } from "src/slices/stake-thunk";
import "./stake.scss";
// import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
// import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
// import { warning, success } from "../../store/slices/messages-slice";
import { useAccount, useNetwork, useSigner } from "wagmi";
import toast from "react-hot-toast";
import { getValidChainId } from "src/constants/data";
import { NetworkId } from "src/networkDetails";
import { Providers } from "src/helpers/providers/Providers/Providers";

function Claim() {
    const dispatch = useDispatch();
    // const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();
    // const { data: signer } = useSigner();
    const { chain = { id: 1 } } = useNetwork();

    const provider = Providers.getProviderUrl(getValidChainId(chain.id) as NetworkId);
    const { address = "", isConnected, isReconnecting } = useAccount();
    const { data: signer } = useSigner();

    const [quantity, setQuantity] = useState<string>("");

    const isAccountLoading = useAppSelector(state => state.account.loading);

    const stakeBalance = useAppSelector(state => {
        return state.account.staking && state.account.staking.time;
    });
    const unlockTimeStamp = useAppSelector(state => {
        return state.account.staking && state.account.staking.unlockTime;
    });

    const reward = useAppSelector(state => {
        return state.account.staking && state.account.staking.reward;
    });

    const pendingTransactions = useAppSelector(state => {
        return state.pendingTransactions;
    });

    const onChangeClaim = async (action: string) => {
        // if (await checkWrongNetwork()) return;
        if (reward === 0) {
            // dispatch(warning({ text: messages.before_compound }));
            toast.error(messages.before_compound)
            return;
        }
        await dispatch(changeClaim({ address, action, provider, signer, networkID: chainID }));
    };

    const trimmedMemoBalance = trim(Number(stakeBalance), 6);

    const currentTime = Date.now() / 1000;
    const canUnlock = currentTime >= unlockTimeStamp;
    const unlockTime = canUnlock ? "0" : prettifySeconds(unlockTimeStamp - currentTime);

    return (
        <div className="stake-view">
            <Zoom in={true}>
                <div className="stake-card">
                    <Grid className="stake-card-grid" container direction="column" spacing={2}>
                        <Grid item>
                            <div className="stake-card-header">
                                <p className="stake-card-header-title">Your Reward</p>
                            </div>
                        </Grid>

                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                            <p style={{ fontSize: "32px", color: "white", fontWeight: 600, fontFamily: "Montserrat Bold" }}>
                                {isAccountLoading ? <Skeleton width="100px" /> : `${trim(reward, 8)} ETH`}
                            </p>
                        </div>

                        {address && (
                            <Grid container spacing={4} style={{ marginBottom: "5px" }}>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <div
                                        className="stake-card-tab-panel-btn"
                                        onClick={() => {
                                            if (isPendingTxn(pendingTransactions, "compounding")) return;
                                            onChangeClaim("compound");
                                        }}
                                    >
                                        <p>{txnButtonText(pendingTransactions, "compounding", "Compound")}</p>
                                    </div>
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={12}>
                                    <div
                                        className="stake-card-tab-panel-btn"
                                        onClick={() => {
                                            if (isPendingTxn(pendingTransactions, "claiming")) return;
                                            onChangeClaim("claim");
                                        }}
                                    >
                                        <p>{txnButtonText(pendingTransactions, "claiming", "Claim")}</p>
                                    </div>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Claim;
