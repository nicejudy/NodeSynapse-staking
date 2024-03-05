import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Grid, Zoom, OutlinedInput, InputAdornment } from "@material-ui/core";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { IAccountSlice } from "src/store/slices/account-slice";
import { IAppSlice } from "../../store/slices/app-slice";
import Stake from "../Stake";
import Claim from "../Claim";

function Dashboard() {
    const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
    const isAccountLoading = useSelector<IReduxState, boolean>(state => state.account.loading);
    const app = useSelector<IReduxState, IAppSlice>(state => state.app);
    const account = useSelector<IReduxState, IAccountSlice>(state => state.account);
    const [quantity, setQuantity] = useState<string>("");

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <div style={{ display: "flex", marginBottom: "10px" }}>
                    <p style={{ fontSize: "44px", color: "white", fontWeight: 600, fontFamily: "Montserrat Bold" }}>NodeSynapse Stake</p>
                </div>
                <Grid container spacing={4}>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <div className="dashboard-card">
                            <p className="card-title">NS Price</p>
                            <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `$${trim(app.marketPrice, 6)}`}</p>
                        </div>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <div className="dashboard-card">
                            <p className="card-title">Total Supply</p>
                            <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(app.totalSupply, 2)} NS`}</p>
                        </div>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <div className="dashboard-card">
                            <p className="card-title">Total Staked</p>
                            <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(app.totalStaked, 2)} NS`}</p>
                        </div>
                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <div className="dashboard-card">
                            <p className="card-title">Total Distributed</p>
                            <p className="card-value">{isAppLoading ? <Skeleton width="100px" /> : `${trim(app.totalDistributed, 2)} ETH`}</p>
                        </div>
                    </Grid>
                </Grid>
                <Stake />
                <Claim />
            </div>
        </div>
    );
}

export default Dashboard;
