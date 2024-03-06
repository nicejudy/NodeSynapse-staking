import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Grid, Zoom, OutlinedInput, InputAdornment, Skeleton } from "@mui/material";
import { useAppSelector } from "src/hooks";
import { trim } from "../../helpers";
import "./dashboard.scss";
import { IAccountSlice } from "src/slices/AccountSlice";
import { IAppSlice } from "src/slices/AppSlice";
import Social from "./social";
import Stake from "../Stake";
import Claim from "../Claim";

function Dashboard() {
    const isAppLoading = useAppSelector(state => state.app.loading);
    const isAccountLoading = useAppSelector(state => state.account.loading);
    const app = useAppSelector(state => state.app);
    const account = useAppSelector(state => state.account);
    const [quantity, setQuantity] = useState<string>("");

    return (
        <div className="dashboard-view">
            <div className="dashboard-infos-wrap">
                <div style={{ display: "flex", marginBottom: "10px" }}>
                    <p style={{ fontSize: "44px", color: "white", fontWeight: 600, fontFamily: "Montserrat Bold", margin: "20px 0" }}>NodeSynapse Stake</p>
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
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Social />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
