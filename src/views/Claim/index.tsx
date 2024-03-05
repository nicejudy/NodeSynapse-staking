import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import { prettifySeconds, trim } from "../../helpers";
import { changeStake, changeApproval, changeClaim } from "../../store/slices/stake-thunk";
import "./stake.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import { warning, success } from "../../store/slices/messages-slice";

function Claim() {
    const dispatch = useDispatch();
    const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const [quantity, setQuantity] = useState<string>("");

    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);

    const stakeBalance = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.time;
    });
    const unlockTimeStamp = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.unlockTime;
    });

    const reward = useSelector<IReduxState, number>(state => {
        return state.account.staking && state.account.staking.reward;
    });

    const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
        return state.pendingTransactions;
    });

    const onChangeClaim = async (action: string) => {
        if (await checkWrongNetwork()) return;
        if (reward === 0) {
            dispatch(warning({ text: messages.before_compound }));
            return;
        }
        await dispatch(changeClaim({ address, action, provider, networkID: chainID }));
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
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Claim;
