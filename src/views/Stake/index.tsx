import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom, Skeleton } from "@mui/material";
import { useAppSelector } from "src/hooks";
import { MAIN_URL, getValidChainId } from "src/constants/data";
import { Providers } from "src/helpers/providers/Providers/Providers";
import { prettifySeconds } from "../../helpers/timeUtil";
import { trim } from "../../helpers";
import { changeStake, changeApproval } from "src/slices/stake-thunk";
import "./stake.scss";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { IPendingTxn, isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
// import { IReduxState } from "src/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
// import { warning, success } from "src/store/slices/messages-slice";
import { NetworkId } from "src/networkDetails";
import RoundedConnectButton from "src/components/ConnectButton/RoundedConnectButton";
import toast from "react-hot-toast";

function Stake() {
    const dispatch = useDispatch();
    const { chain = { id: 1 } } = useNetwork();

    const provider = Providers.getProviderUrl(getValidChainId(chain.id) as NetworkId);
    const { address = "", isConnected, isReconnecting } = useAccount();
    const { data: signer } = useSigner();

    // const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

    const [view, setView] = useState(0);
    const [quantity, setQuantity] = useState<string>("");

    const isAppLoading = useAppSelector(state => state.app.loading);

    const timeBalance = useAppSelector(state => {
        return state.account.balances && state.account.balances.time;
    });
    const stakeBalance = useAppSelector(state => {
        return state.account.staking && state.account.staking.time;
    });
    const stakeAllowance = useAppSelector(state => {
        return state.account.staking && state.account.allowance.time;
    });
    const unlockTimeStamp = useAppSelector(state => {
        return state.account.staking && state.account.staking.unlockTime;
    });

    const pendingTransactions = useAppSelector(state => {
        return state.pendingTransactions;
    });

    const setMax = () => {
        if (view === 0) {
            setQuantity(timeBalance.toString());
        } else {
            setQuantity(stakeBalance.toString());
        }
    };

    const onSeekApproval = async (value: string) => {
        // if (await checkWrongNetwork()) return;

        await dispatch(changeApproval({ provider, signer, address, value, networkID: chain.id }));
    };

    const onChangeStake = async (action: string) => {
        // if (await checkWrongNetwork()) return;
        if (quantity === "") {
            toast.error(action === "stake" ? messages.before_stake : messages.before_unstake)
        } else {
            await dispatch(changeStake({ address, action, value: String(quantity), provider, signer, networkID: chain.id }));
            setQuantity("");
        }
    };

    const hasAllowance = useCallback(() => {
        return Number(stakeAllowance) >= Number(quantity);
    }, [stakeAllowance, quantity]);

    const changeView = (newView: number) => () => {
        setView(newView);
        setQuantity("");
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
                                <p className="stake-card-header-title">Stake / Unstake</p>
                            </div>
                        </Grid>

                        <div className="stake-card-area">
                            {!isConnected && (
                                <div className="stake-card-wallet-notification">
                                    <RoundedConnectButton />
                                    <p className="stake-card-wallet-desc-text">Connect your wallet to stake NS tokens!</p>
                                </div>
                            )}
                            {isConnected && (
                                <div>
                                    <div className="stake-card-action-area">
                                        <div className="stake-card-action-stage-btns-wrap">
                                            <div onClick={changeView(0)} className={classnames("stake-card-action-stage-btn", { active: !view })}>
                                                <p>Stake</p>
                                            </div>
                                            <div onClick={changeView(1)} className={classnames("stake-card-action-stage-btn", { active: view })}>
                                                <p>Unstake</p>
                                            </div>
                                        </div>

                                        <div className="stake-card-action-row">
                                            <OutlinedInput
                                                type="number"
                                                placeholder="Amount"
                                                className="stake-card-action-input"
                                                value={quantity}
                                                onChange={e => setQuantity(e.target.value)}
                                                // labelWidth={0}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <div onClick={setMax} className="stake-card-action-input-btn">
                                                            <p>Max</p>
                                                        </div>
                                                    </InputAdornment>
                                                }
                                            />

                                            {view === 0 && (
                                                <div className="stake-card-tab-panel">
                                                    {address && hasAllowance() ? (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "staking")) return;
                                                                onChangeStake("stake");
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "staking", "Stake NS")}</p>
                                                        </div>
                                                    ) : (
                                                        <div
                                                            className="stake-card-tab-panel-btn"
                                                            onClick={() => {
                                                                if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                                                                onSeekApproval(quantity);
                                                            }}
                                                        >
                                                            <p>{txnButtonText(pendingTransactions, "approve_staking", "Approve")}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {view === 1 && (
                                                <div className="stake-card-tab-panel">
                                                    <div
                                                        className="stake-card-tab-panel-btn"
                                                        onClick={() => {
                                                            if (isPendingTxn(pendingTransactions, "unstaking")) return;
                                                            if (!canUnlock) toast.error(messages.cant_unlock);
                                                            onChangeStake("unstake");
                                                        }}
                                                    >
                                                        <p>{txnButtonText(pendingTransactions, "unstaking", "Unstake NS")}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="stake-user-data">
                                        <div className="data-row">
                                            <p className="data-row-name">Your Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(timeBalance), 4)} NS</>}</p>
                                        </div>

                                        <div className="data-row">
                                            <p className="data-row-name">Your Staked Balance</p>
                                            <p className="data-row-value">{isAppLoading ? <Skeleton width="80px" /> : <>{trimmedMemoBalance} NS</>}</p>
                                        </div>

                                        <div className="data-row">
                                            <p className="data-row-name">You can unlock after</p>
                                            <p className="data-row-value">{unlockTime}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Grid>
                </div>
            </Zoom>
        </div>
    );
}

export default Stake;
